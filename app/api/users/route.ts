import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { requireAdmin } from '@/lib/authMiddleware';
import {
    successResponse,
    unauthorizedResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';

// GET /api/users - Admin: Get all users
export async function GET(request: NextRequest) {
    try {
        // Check admin access
        const authResult = await requireAdmin(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const role = searchParams.get('role');
        const search = searchParams.get('search');

        // Build query
        const query: Record<string, unknown> = {};

        if (role && ['user', 'admin'].includes(role)) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;
        const total = await User.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return successResponse('Users retrieved successfully', users, 200, {
            page,
            limit,
            total,
            totalPages,
        });
    } catch (error) {
        return serverErrorResponse(error);
    }
}
