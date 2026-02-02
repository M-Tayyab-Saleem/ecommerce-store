import { NextRequest } from 'next/server';
import { successResponse } from '@/utils/apiResponse';

export async function POST(request: NextRequest) {
    // Clear the token cookie
    const response = successResponse('Logged out successfully');

    response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0, // Expire immediately
        path: '/',
    });

    return response;
}
