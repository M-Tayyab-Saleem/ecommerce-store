import { NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/authMiddleware';
import {
    successResponse,
    unauthorizedResponse,
    notFoundResponse,
    validationErrorResponse,
    serverErrorResponse,
    errorResponse,
} from '@/utils/apiResponse';
import mongoose from 'mongoose';

// Validation schema for role update
const updateRoleSchema = z.object({
    role: z.enum(['user', 'admin']),
});

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/users/[id] - Admin: Get user details with order stats
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        // Check admin access
        const authResult = await requireAdmin(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return notFoundResponse('User not found');
        }

        const user = await User.findById(id).select('-password');

        if (!user) {
            return notFoundResponse('User not found');
        }

        // Get order stats for user
        const orderStats = await Order.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(id) } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: '$totalAmount' },
                },
            },
        ]);

        const stats = orderStats[0] || { totalOrders: 0, totalSpent: 0 };

        return successResponse('User retrieved successfully', {
            ...user.toObject(),
            orderStats: stats,
        });
    } catch (error) {
        return serverErrorResponse(error);
    }
}

// PUT /api/users/[id] - Admin: Update user role
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
            return notFoundResponse('User not found');
        }

        const body = await request.json();

        // Validate input
        const validationResult = updateRoleSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        // Prevent admin from demoting themselves
        if (authResult.user!._id.toString() === id && validationResult.data.role !== 'admin') {
            return errorResponse('You cannot change your own role', 400);
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role: validationResult.data.role },
            { new: true }
        ).select('-password');

        if (!user) {
            return notFoundResponse('User not found');
        }

        return successResponse('User role updated successfully', user);
    } catch (error) {
        return serverErrorResponse(error);
    }
}
