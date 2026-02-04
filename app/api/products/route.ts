import { NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
void Category; // Ensure Category is registered
import Product from '@/models/Product';
import { requireAdmin, verifyAuth } from '@/lib/authMiddleware';
import {
    successResponse,
    unauthorizedResponse,
    validationErrorResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';
import mongoose from 'mongoose';

// Validation schema for product
const productSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(200, 'Name cannot exceed 200 characters'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description cannot exceed 2000 characters'),
    price: z.number().min(0, 'Price cannot be negative'),
    images: z
        .array(z.string().url('Invalid image URL'))
        .max(10, 'Cannot have more than 10 images')
        .optional(),
    category: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid category ID',
    }),
    customizable: z.boolean().optional(),
    customizationNote: z
        .string()
        .max(500, 'Customization note cannot exceed 500 characters')
        .optional(),
    // Design-based variants: each has own images, optional price, and stock
    variants: z
        .array(
            z.object({
                designName: z.string().min(1, 'Design name is required'),
                images: z.array(z.string().url('Invalid image URL')).default([]),
                price: z.number().min(0, 'Price cannot be negative').optional(),
                stock: z.number().min(0, 'Stock cannot be negative'),
            })
        )
        .optional(),
    stock: z.number().min(0, 'Stock cannot be negative'),
    lowStockThreshold: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
    handmadeDisclaimer: z.string().optional(),
});

// GET /api/products - List products with filtering and pagination
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sort = searchParams.get('sort') || 'createdAt';
        const order = searchParams.get('order') || 'desc';
        const includeInactive = searchParams.get('includeInactive') === 'true';
        const lowStockOnly = searchParams.get('lowStockOnly') === 'true';
        const isBestSeller = searchParams.get('isBestSeller');
        const isLatest = searchParams.get('isLatest');

        const isActiveParam = searchParams.get('isActive');

        // Check if user is admin
        const authResult = await verifyAuth(request);
        const isAdmin = authResult.success && authResult.user?.role === 'admin';

        // Build query
        const query: Record<string, unknown> = {
            isDeleted: false,
        };

        // Admin filtering logic
        if (isAdmin) {
            // If admin, check if specific status requested
            if (isActiveParam === 'true') {
                query.isActive = true;
            } else if (isActiveParam === 'false') {
                query.isActive = false;
            }
            // If isActiveParam is not set or 'all', implicitly show all (do not set query.isActive)
            // UNLESS includeInactive is explicitly false? Default behavior for admin is usually 'show all' in admin view?
            // But let's stick to: if not filtered, show all is fine, OR stick to existing 'includeInactive' logic?
            // Let's support the 'includeInactive' as 'show all'.

            if (!isActiveParam && !includeInactive) {
                // Default to active only if no specific request? 
                // Actually, usually admin wants to see EVERYTHING by default or strictly active? 
                // Existing code was: if (!includeInactive) query.isActive = true;
                query.isActive = true;
            } else if (includeInactive) {
                // Show all (delete isActive query if it exists? No, just don't set it)
                if (!isActiveParam) delete query.isActive;
            }
        } else {
            // Non-admin: ALWAYS active only
            query.isActive = true;
        }

        // Category filter - accepts either ObjectId or slug
        if (category) {
            if (mongoose.Types.ObjectId.isValid(category)) {
                query.category = new mongoose.Types.ObjectId(category);
            } else {
                // Try to find category by slug
                const Category = mongoose.models.Category || (await import('@/models/Category')).default;
                const categoryDoc = await Category.findOne({ slug: category, isActive: true });
                if (categoryDoc) {
                    query.category = categoryDoc._id;
                }
            }
        }

        // Search filter
        if (search) {
            query.$text = { $search: search };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) (query.price as Record<string, number>).$gte = parseFloat(minPrice);
            if (maxPrice) (query.price as Record<string, number>).$lte = parseFloat(maxPrice);
        }

        // Low stock filter (admin only)
        if (isAdmin && lowStockOnly) {
            query.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
        }

        // Best seller filter
        if (isBestSeller === 'true') {
            query.isBestSeller = true;
        }

        // Latest products filter
        if (isLatest === 'true') {
            query.isLatest = true;
        }

        // Sorting
        const sortOptions: Record<string, 1 | -1> = {};
        sortOptions[sort] = order === 'asc' ? 1 : -1;

        // Pagination
        const skip = (page - 1) * limit;
        const total = await Product.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        return successResponse('Products retrieved successfully', products, 200, {
            page,
            limit,
            total,
            totalPages,
        });
    } catch (error) {
        return serverErrorResponse(error);
    }
}

// POST /api/products - Admin: Create product
export async function POST(request: NextRequest) {
    try {
        // Check admin access
        const authResult = await requireAdmin(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const body = await request.json();

        // Validate input
        const validationResult = productSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const productData = {
            ...validationResult.data,
            category: new mongoose.Types.ObjectId(validationResult.data.category),
        };

        const product = await Product.create(productData);
        await product.populate('category', 'name slug');

        return successResponse('Product created successfully', product, 201);
    } catch (error) {
        return serverErrorResponse(error);
    }
}
