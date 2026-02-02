import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { requireAuth } from '@/lib/authMiddleware';
import {
    successResponse,
    unauthorizedResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';

// GET /api/orders/my - Get user's order history
export async function GET(request: NextRequest) {
    try {
        // Require authentication
        const authResult = await requireAuth(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const orderStatus = searchParams.get('orderStatus');

        // Build query
        const query: Record<string, unknown> = {
            user: authResult.user!._id,
        };

        if (orderStatus) {
            query.orderStatus = orderStatus;
        }

        // Pagination
        const skip = (page - 1) * limit;
        const total = await Order.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const orders = await Order.find(query)
            .populate('items.product', 'name images slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return successResponse('Orders retrieved successfully', orders, 200, {
            page,
            limit,
            total,
            totalPages,
        });
    } catch (error) {
        return serverErrorResponse(error);
    }
}
