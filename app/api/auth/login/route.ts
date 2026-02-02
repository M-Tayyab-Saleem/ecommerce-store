import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { generateToken } from '@/lib/authMiddleware';
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';

// Validation schema for login
const loginSchema = z.object({
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();

        // Validate input
        const validationResult = loginSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const { email, password } = validationResult.data;

        // Find user and include password for verification
        const user = await User.findOne({ email: email.toLowerCase() }).select(
            '+password'
        );

        if (!user) {
            return errorResponse('Invalid email or password', 401);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return errorResponse('Invalid email or password', 401);
        }

        // Generate JWT token
        const token = generateToken(user._id.toString());

        // Create response
        const response = successResponse('Login successful', {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        return serverErrorResponse(error);
    }
}
