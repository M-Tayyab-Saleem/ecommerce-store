import { NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/authMiddleware';
import {
    successResponse,
    errorResponse,
    unauthorizedResponse,
    notFoundResponse,
    validationErrorResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';
import mongoose from 'mongoose';

// Validation schema for status update
const updateStatusSchema = z.object({
    status: z.enum([
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
    ]),
    note: z.string().max(200, 'Note cannot exceed 200 characters').optional(),
});

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT /api/orders/[id]/status - Admin: Update order status
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        // Check admin access
        const authResult = await requireAdmin(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return notFoundResponse('Order not found');
        }

        const body = await request.json();

        // Validate input
        const validationResult = updateStatusSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const { status, note } = validationResult.data;

        const order = await Order.findById(id);

        if (!order) {
            return notFoundResponse('Order not found');
        }

        // Validate status transition
        const validTransitions: Record<string, string[]> = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['processing', 'cancelled'],
            processing: ['shipped', 'cancelled'],
            shipped: ['delivered', 'cancelled'],
            delivered: [], // Final state
            cancelled: [], // Final state
        };

        const currentStatus = order.orderStatus;
        const allowedTransitions = validTransitions[currentStatus] || [];

        if (!allowedTransitions.includes(status)) {
            return errorResponse(
                `Cannot change order status from '${currentStatus}' to '${status}'`,
                400
            );
        }

        // If cancelling, restore stock
        if (status === 'cancelled') {
            for (const item of order.items) {
                if (item.selectedVariant) {
                    await Product.updateOne(
                        { _id: item.product, 'variants.color': item.selectedVariant },
                        { $inc: { 'variants.$.stock': item.quantity } }
                    );
                } else {
                    await Product.updateOne(
                        { _id: item.product },
                        { $inc: { stock: item.quantity } }
                    );
                }
            }
        }

        // Update order status
        order.orderStatus = status;
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            note,
        });

        // If delivered and COD, mark as paid
        if (status === 'delivered' && order.paymentMethod === 'COD') {
            order.paymentStatus = 'paid';
        }

        await order.save();

        await order.populate('user', 'name email phone');
        await order.populate('items.product', 'name images');

        return successResponse('Order status updated successfully', order);
    } catch (error) {
        return serverErrorResponse(error);
    }
}
