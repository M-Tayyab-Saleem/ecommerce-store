import { NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Payment from '@/models/Payment';
import Order from '@/models/Order';
import { requireAuth } from '@/lib/authMiddleware';
import { uploadPaymentProof } from '@/utils/cloudinary';
import { generateTransactionId } from '@/utils/generateOrderId';
import {
    successResponse,
    errorResponse,
    unauthorizedResponse,
    notFoundResponse,
    validationErrorResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';
import mongoose from 'mongoose';

// Validation schema for payment proof upload
const uploadProofSchema = z.object({
    orderId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid order ID',
    }),
    screenshot: z.string().min(1, 'Screenshot is required'), // Base64 image
    transactionId: z.string().optional(),
});

// POST /api/payments/upload-proof - Upload payment proof
export async function POST(request: NextRequest) {
    try {
        // Require authentication
        const authResult = await requireAuth(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const body = await request.json();

        // Validate input
        const validationResult = uploadProofSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const { orderId, screenshot, transactionId } = validationResult.data;

        // Find the order
        const order = await Order.findById(orderId);

        if (!order) {
            return notFoundResponse('Order not found');
        }

        // Check if user owns this order
        if (order.user.toString() !== authResult.user!._id) {
            return errorResponse('You do not have access to this order', 403);
        }

        // Check if payment method requires proof
        if (order.paymentMethod === 'COD') {
            return errorResponse('Payment proof not required for COD orders', 400);
        }

        // Check if payment already exists
        let payment = await Payment.findOne({ order: orderId });

        // Upload screenshot to Cloudinary
        const uploadResult = await uploadPaymentProof(screenshot);

        if (!uploadResult.success) {
            return errorResponse('Failed to upload payment proof', 500);
        }

        if (payment) {
            // Update existing payment
            payment.screenshot = uploadResult.url;
            payment.transactionId = transactionId || generateTransactionId();
            payment.status = 'pending';
            await payment.save();
        } else {
            // Create new payment record
            payment = await Payment.create({
                order: orderId,
                method: order.paymentMethod,
                transactionId: transactionId || generateTransactionId(),
                screenshot: uploadResult.url,
                amount: order.totalAmount,
                status: 'pending',
            });
        }

        return successResponse('Payment proof uploaded successfully', payment);
    } catch (error) {
        return serverErrorResponse(error);
    }
}
