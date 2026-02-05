import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
void Category; // Ensure Category is registered
import Product from '@/models/Product';
import { requireAdmin, verifyAuth } from '@/lib/authMiddleware';
import { getProducts } from '@/lib/services/product-service';
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
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const category = searchParams.get('category') || undefined;
        const search = searchParams.get('search') || undefined;
        const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
        const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
        const sort = searchParams.get('sort') || 'createdAt';
        const order = (searchParams.get('order') as 'asc' | 'desc') || 'desc';
        const includeInactive = searchParams.get('includeInactive') === 'true';
        const lowStockOnly = searchParams.get('lowStockOnly') === 'true';
        const isBestSeller = searchParams.get('isBestSeller') === 'true';
        const isLatest = searchParams.get('isLatest') === 'true';

        const isActiveParam = searchParams.get('isActive');

        // Check if user is admin
        const authResult = await verifyAuth(request);
        const isAdmin = authResult.success && authResult.user?.role === 'admin';

        // Determine active status logic
        let serviceIsActive: boolean | undefined = undefined;
        let serviceIncludeInactive = false;

        if (isAdmin) {
            if (isActiveParam === 'true') {
                serviceIsActive = true;
            } else if (isActiveParam === 'false') {
                serviceIsActive = false;
            } else if (!includeInactive) {
                // Default to active only if no specific request
                serviceIsActive = true;
            } else {
                // Show all
                serviceIncludeInactive = true;
            }
        } else {
            // Non-admin: ALWAYS active only
            serviceIsActive = true;
        }

        const { products, metadata } = await getProducts({
            page,
            limit,
            category,
            search,
            minPrice,
            maxPrice,
            sort,
            order,
            isActive: serviceIsActive,
            includeInactive: serviceIncludeInactive,
            lowStockOnly: isAdmin ? lowStockOnly : false, // helper logic
            isBestSeller,
            isLatest
        });

        return successResponse('Products retrieved successfully', products, 200, metadata);
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
