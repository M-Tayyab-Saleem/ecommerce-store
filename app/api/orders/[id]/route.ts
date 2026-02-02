import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { requireAuth, verifyAuth } from '@/lib/authMiddleware';
import {
    successResponse,
    unauthorizedResponse,
    notFoundResponse,
    forbiddenResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';
import mongoose from 'mongoose';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/orders/[id] - Get single order
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        // Require authentication
        const authResult = await requireAuth(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const { id } = await params;

        // Find order by ID or orderId
        let query: Record<string, unknown>;
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { orderId: id };
        }

        const order = await Order.findOne(query)
            .populate('user', 'name email phone')
            .populate('items.product', 'name images slug');

        if (!order) {
            return notFoundResponse('Order not found');
        }

        // Check if user owns this order or is admin
        const isAdmin = authResult.user?.role === 'admin';
        const isOwner = order.user._id.toString() === authResult.user!._id;

        if (!isAdmin && !isOwner) {
            return forbiddenResponse('You do not have access to this order');
        }

        return successResponse('Order retrieved successfully', order);
    } catch (error) {
        return serverErrorResponse(error);
    }
}
