import { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/authMiddleware';
import { successResponse, errorResponse } from '@/utils/apiResponse';

export async function GET(request: NextRequest) {
    const authResult = await verifyAuth(request);

    if (!authResult.success || !authResult.user) {
        return errorResponse(authResult.error || 'Not authenticated', 401);
    }

    return successResponse('User authenticated', {
        user: {
            id: authResult.user._id,
            name: authResult.user.name,
            email: authResult.user.email,
            role: authResult.user.role,
        },
    });
}
