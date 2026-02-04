import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (pathname.startsWith('/admin')) {
        try {
            const token = request.cookies.get('token')?.value;

            if (!token) {
                // No token, redirect to login
                return NextResponse.redirect(new URL('/login', request.url));
            }

            // Verify token using jose (Edge compatible)
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);

            // Token is valid
            if (!payload.userId) {
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
