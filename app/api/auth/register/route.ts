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

// Validation schema for registration
const registerSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters'),
    email: z.string().email('Please provide a valid email'),
    phone: z
        .string()
        .regex(
            /^(\+92|0)?[0-9]{10}$/,
            'Please provide a valid Pakistani phone number (e.g., 03001234567 or +923001234567)'
        ),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password cannot exceed 50 characters'),
});

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();

        // Validate input
        const validationResult = registerSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const { name, email, phone, password } = validationResult.data;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return errorResponse('User with this email already exists', 409);
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            role: 'user',
        });

        // Generate JWT token
        const token = generateToken(user._id.toString());

        // Create response with HTTP-only cookie
        const response = successResponse(
            'Registration successful',
            {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
            },
            201
        );

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
