import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (pathname.startsWith('/admin')) {
        try {
            const token = request.cookies.get('token')?.value;

            if (!token) {
                // No token, redirect to login
                return NextResponse.redirect(new URL('/login', request.url));
            }

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET!) as {
                userId: string;
                role?: string;
            };

            // Token is valid (userId exists in decoded)
            if (!decoded.userId) {
                return NextResponse.redirect(new URL('/login', request.url));
            }

            // Allow access to admin routes
            return NextResponse.next();
        } catch (err) {
            // Invalid token, redirect to login
            console.error('JWT verification failed:', err);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
