import { NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Category from '@/models/Category'; // Ensure Category is registered
import { requireAdmin, verifyAuth } from '@/lib/authMiddleware';
import {
    successResponse,
    unauthorizedResponse,
    notFoundResponse,
    validationErrorResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';
import mongoose from 'mongoose';

// Validation schema for product update
const updateProductSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(200, 'Name cannot exceed 200 characters')
        .optional(),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(2000, 'Description cannot exceed 2000 characters')
        .optional(),
    price: z.number().min(0, 'Price cannot be negative').optional(),
    images: z
        .array(z.string().url('Invalid image URL'))
        .max(10, 'Cannot have more than 10 images')
        .optional(),
    category: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
            message: 'Invalid category ID',
        })
        .optional(),
    customizable: z.boolean().optional(),
    customizationNote: z
        .string()
        .max(500, 'Customization note cannot exceed 500 characters')
        .optional(),
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
    stock: z.number().min(0, 'Stock cannot be negative').optional(),
    lowStockThreshold: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
    handmadeDisclaimer: z.string().optional(),
});

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/products/[id] - Get single product
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = await params;

        // Support both ObjectId and slug
        let query: Record<string, unknown>;
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id, isDeleted: false };
        } else {
            query = { slug: id, isDeleted: false };
        }

        const product = await Product.findOne(query).populate(
            'category',
            'name slug'
        );

        if (!product) {
            return notFoundResponse('Product not found');
        }

        // Check if product is inactive and user is not admin
        if (!product.isActive) {
            const authResult = await verifyAuth(request);
            const isAdmin = authResult.success && authResult.user?.role === 'admin';

            if (!isAdmin) {
                return notFoundResponse('Product not found');
            }
        }

        return successResponse('Product retrieved successfully', product);
    } catch (error) {
        return serverErrorResponse(error);
    }
}

// PUT /api/products/[id] - Admin: Update product
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        // Check admin access
        const authResult = await requireAdmin(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return notFoundResponse('Product not found');
        }

        const body = await request.json();

        // Validate input
        const validationResult = updateProductSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const updateData = { ...validationResult.data };
        if (updateData.category) {
            (updateData as Record<string, unknown>).category = new mongoose.Types.ObjectId(updateData.category);
        }

        const product = await Product.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('category', 'name slug');

        if (!product) {
            return notFoundResponse('Product not found');
        }

        return successResponse('Product updated successfully', product);
    } catch (error) {
        return serverErrorResponse(error);
    }
}

// DELETE /api/products/[id] - Admin: Soft delete product
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        // Check admin access
        const authResult = await requireAdmin(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return notFoundResponse('Product not found');
        }

        // Soft delete instead of hard delete
        const product = await Product.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: { isDeleted: true, isActive: false } },
            { new: true }
        );

        if (!product) {
            return notFoundResponse('Product not found');
        }

        return successResponse('Product deleted successfully');
    } catch (error) {
        return serverErrorResponse(error);
    }
}
