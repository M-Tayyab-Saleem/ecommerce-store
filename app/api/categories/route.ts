import { NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import { requireAdmin, verifyAuth } from '@/lib/authMiddleware';
import {
    successResponse,
    unauthorizedResponse,
    validationErrorResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';

// Validation schema for category
const categorySchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters'),
    description: z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),
    image: z.string().url('Invalid image URL').optional(),
    isActive: z.boolean().optional(),
});

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const includeInactive = searchParams.get('includeInactive') === 'true';

        // Check if user is admin to show inactive categories
        const authResult = await verifyAuth(request);
        const isAdmin = authResult.success && authResult.user?.role === 'admin';

        const query: Record<string, unknown> = {};

        // Only show active categories for non-admin users
        if (!isAdmin || !includeInactive) {
            query.isActive = true;
        }

        const categories = await Category.find(query).sort({ name: 1 });

        return successResponse('Categories retrieved successfully', categories);
    } catch (error) {
        return serverErrorResponse(error);
    }
}

// POST /api/categories - Admin: Create category
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
        const validationResult = categorySchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const category = await Category.create(validationResult.data);

        return successResponse('Category created successfully', category, 201);
    } catch (error) {
        if ((error as { code?: number }).code === 11000) {
            return successResponse('Category with this name already exists', null, 409);
        }
        return serverErrorResponse(error);
    }
}
