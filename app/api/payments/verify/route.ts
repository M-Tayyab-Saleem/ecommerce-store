import { NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Payment from '@/models/Payment';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/authMiddleware';
import {
    successResponse,
    unauthorizedResponse,
    notFoundResponse,
    validationErrorResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';
import mongoose from 'mongoose';

// Validation schema for payment verification
const verifyPaymentSchema = z.object({
    paymentId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid payment ID',
    }),
    action: z.enum(['verify', 'reject']),
    rejectionReason: z
        .string()
        .max(500, 'Rejection reason cannot exceed 500 characters')
        .optional(),
});

// PUT /api/payments/verify - Admin: Verify or reject payment
export async function PUT(request: NextRequest) {
    try {
        // Check admin access
        const authResult = await requireAdmin(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const body = await request.json();

        // Validate input
        const validationResult = verifyPaymentSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const { paymentId, action, rejectionReason } = validationResult.data;

        const payment = await Payment.findById(paymentId).populate('order');

        if (!payment) {
            return notFoundResponse('Payment not found');
        }

        if (action === 'verify') {
            payment.status = 'verified';
            payment.verifiedBy = new mongoose.Types.ObjectId(authResult.user!._id);
            payment.verifiedAt = new Date();

            // Update order payment status
            await Order.findByIdAndUpdate(payment.order._id, {
                paymentStatus: 'paid',
            });
        } else {
            payment.status = 'rejected';
            payment.rejectionReason = rejectionReason;
            payment.verifiedBy = new mongoose.Types.ObjectId(authResult.user!._id);
            payment.verifiedAt = new Date();

            // Update order payment status
            await Order.findByIdAndUpdate(payment.order._id, {
                paymentStatus: 'failed',
            });
        }

        await payment.save();

        await payment.populate('order', 'orderId totalAmount');
        await payment.populate('verifiedBy', 'name email');

        return successResponse(
            `Payment ${action === 'verify' ? 'verified' : 'rejected'} successfully`,
            payment
        );
    } catch (error) {
        return serverErrorResponse(error);
    }
}

// GET /api/payments/verify - Admin: Get pending payments
export async function GET(request: NextRequest) {
    try {
        // Check admin access
        const authResult = await requireAdmin(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status') || 'pending';

        const query: Record<string, unknown> = {};

        if (['pending', 'verified', 'rejected'].includes(status)) {
            query.status = status;
        }

        // Pagination
        const skip = (page - 1) * limit;
        const total = await Payment.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const payments = await Payment.find(query)
            .populate('order', 'orderId totalAmount paymentMethod user')
            .populate('verifiedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return successResponse('Payments retrieved successfully', payments, 200, {
            page,
            limit,
            total,
            totalPages,
        });
    } catch (error) {
        return serverErrorResponse(error);
    }
}
