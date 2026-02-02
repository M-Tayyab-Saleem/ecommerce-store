import { NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { requireAuth } from '@/lib/authMiddleware';
import {
    successResponse,
    unauthorizedResponse,
    validationErrorResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';

// Validation schema for profile update
const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),
    phone: z
        .string()
        .regex(
            /^(\+92|0)?[0-9]{10}$/,
            'Please provide a valid Pakistani phone number'
        )
        .optional(),
});

// GET /api/users/me - Get current user profile
export async function GET(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const user = await User.findById(authResult.user!._id).select('-password');

        return successResponse('Profile retrieved successfully', { user });
    } catch (error) {
        return serverErrorResponse(error);
    }
}

// PUT /api/users/me - Update current user profile
export async function PUT(request: NextRequest) {
    try {
        const authResult = await requireAuth(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const body = await request.json();

        // Validate input
        const validationResult = updateProfileSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const updateData = validationResult.data;

        const user = await User.findByIdAndUpdate(
            authResult.user!._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        return successResponse('Profile updated successfully', { user });
    } catch (error) {
        return serverErrorResponse(error);
    }
}
