import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import dbConnect from './dbConnect';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable');
}

export interface AuthUser {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export interface AuthResult {
    success: boolean;
    user?: AuthUser;
    error?: string;
}

/**
 * Verify JWT token from cookies and return user data
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
    try {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return { success: false, error: 'No authentication token found' };
        }

        const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string };

        await dbConnect();
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        return {
            success: true,
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return { success: false, error: 'Invalid token' };
        }
        if (error instanceof jwt.TokenExpiredError) {
            return { success: false, error: 'Token expired' };
        }
        return { success: false, error: 'Authentication failed' };
    }
}

/**
 * Check if user is authenticated (any role)
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
    const result = await verifyAuth(request);
    if (!result.success) {
        return result;
    }
    return result;
}

/**
 * Check if user is an admin
 */
export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
    const result = await verifyAuth(request);
    if (!result.success) {
        return result;
    }

    if (result.user?.role !== 'admin') {
        return { success: false, error: 'Admin access required' };
    }

    return result;
}

/**
 * Generate JWT token for a user
 */
export function generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET!, { expiresIn: '7d' });
}
