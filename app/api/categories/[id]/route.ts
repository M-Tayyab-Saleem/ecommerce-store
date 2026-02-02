import { NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import { requireAdmin, verifyAuth } from '@/lib/authMiddleware';
import {
    successResponse,
    unauthorizedResponse,
    notFoundResponse,
    validationErrorResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';
import mongoose from 'mongoose';

// Validation schema for category update
const updateCategorySchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),
    description: z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),
    image: z.string().url('Invalid image URL').optional(),
    isActive: z.boolean().optional(),
});

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/categories/[id] - Get single category
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        await dbConnect();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return notFoundResponse('Category not found');
        }

        const category = await Category.findById(id);

        if (!category) {
            return notFoundResponse('Category not found');
        }

        // Check if category is inactive and user is not admin
        if (!category.isActive) {
            const authResult = await verifyAuth(request);
            const isAdmin = authResult.success && authResult.user?.role === 'admin';

            if (!isAdmin) {
                return notFoundResponse('Category not found');
            }
        }

        return successResponse('Category retrieved successfully', category);
    } catch (error) {
        return serverErrorResponse(error);
    }
}

// PUT /api/categories/[id] - Admin: Update category
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
            return notFoundResponse('Category not found');
        }

        const body = await request.json();

        // Validate input
        const validationResult = updateCategorySchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const category = await Category.findByIdAndUpdate(
            id,
            { $set: validationResult.data },
            { new: true, runValidators: true }
        );

        if (!category) {
            return notFoundResponse('Category not found');
        }

        return successResponse('Category updated successfully', category);
    } catch (error) {
        if ((error as { code?: number }).code === 11000) {
            return successResponse('Category with this name already exists', null, 409);
        }
        return serverErrorResponse(error);
    }
}

// DELETE /api/categories/[id] - Admin: Delete category
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
            return notFoundResponse('Category not found');
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return notFoundResponse('Category not found');
        }

        return successResponse('Category deleted successfully');
    } catch (error) {
        return serverErrorResponse(error);
    }
}
