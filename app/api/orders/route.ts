import { NextRequest } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product, { IVariant } from '@/models/Product';
import Payment from '@/models/Payment';
import { requireAuth, requireAdmin } from '@/lib/authMiddleware';
import { generateOrderId } from '@/utils/generateOrderId';
import {
    successResponse,
    errorResponse,
    unauthorizedResponse,
    validationErrorResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';
import mongoose from 'mongoose';

// Validation schema for order item
const orderItemSchema = z.object({
    product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid product ID',
    }),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    selectedVariant: z.string().optional(),
    customText: z
        .string()
        .max(200, 'Custom text cannot exceed 200 characters')
        .optional(),
});

// Validation schema for shipping address
const shippingAddressSchema = z.object({
    name: z.string().min(2, 'Recipient name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    postalCode: z.string().optional(),
});

// Validation schema for order creation
const createOrderSchema = z.object({
    items: z
        .array(orderItemSchema)
        .min(1, 'Order must have at least one item'),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.enum(['COD', 'BANK_TRANSFER', 'JAZZCASH', 'EASYPAISA']),
    notes: z
        .string()
        .max(500, 'Notes cannot exceed 500 characters')
        .optional(),
});

// GET /api/orders - Admin: Get all orders
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
        const orderStatus = searchParams.get('orderStatus');
        const paymentStatus = searchParams.get('paymentStatus');
        const paymentMethod = searchParams.get('paymentMethod');
        const search = searchParams.get('search');

        // Build query
        const query: Record<string, unknown> = {};

        if (orderStatus) {
            query.orderStatus = orderStatus;
        }

        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        if (paymentMethod) {
            query.paymentMethod = paymentMethod;
        }

        if (search) {
            query.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { 'shippingAddress.name': { $regex: search, $options: 'i' } },
                { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;
        const total = await Order.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        const orders = await Order.find(query)
            .populate('user', 'name email phone')
            .populate('items.product', 'name images')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return successResponse('Orders retrieved successfully', orders, 200, {
            page,
            limit,
            total,
            totalPages,
        });
    } catch (error) {
        return serverErrorResponse(error);
    }
}

// POST /api/orders - Create order
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
        const validationResult = createOrderSchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const { items, shippingAddress, paymentMethod, notes } =
            validationResult.data;

        // Fetch products and calculate total
        const productIds = items.map((item) => item.product);
        const products = await Product.find({
            _id: { $in: productIds },
            isActive: true,
            isDeleted: false,
        });

        if (products.length !== items.length) {
            return errorResponse(
                'Some products are not available',
                400
            );
        }

        // Build order items and check stock
        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const product = products.find(
                (p) => p._id.toString() === item.product
            );

            if (!product) {
                return errorResponse(`Product ${item.product} not found`, 400);
            }

            // Check stock
            if (item.selectedVariant) {
                const variant = product.variants.find(
                    (v: IVariant) => v.designName === item.selectedVariant
                ) as IVariant | undefined;
                if (!variant || variant.stock < item.quantity) {
                    return errorResponse(
                        `Insufficient stock for ${product.name} (${item.selectedVariant})`,
                        400
                    );
                }
            } else {
                if (product.stock < item.quantity) {
                    return errorResponse(
                        `Insufficient stock for ${product.name}`,
                        400
                    );
                }
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                selectedVariant: item.selectedVariant,
                customText: item.customText,
                price: product.price,
            });
        }

        // Calculate shipping fee (can be customized based on location)
        const shippingFee = 200; // PKR 200 flat rate
        totalAmount += shippingFee;

        // Generate unique order ID
        const orderId = generateOrderId();

        // Create order
        const order = await Order.create({
            orderId,
            user: authResult.user!._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus: 'pending',
            orderStatus: 'pending',
            totalAmount,
            shippingFee,
            notes,
            handmadeDisclaimer: true,
        });

        // Reduce stock for each product
        for (const item of items) {
            const product = products.find(
                (p) => p._id.toString() === item.product
            );

            if (product) {
                if (item.selectedVariant) {
                    // Reduce variant stock
                    await Product.updateOne(
                        { _id: product._id, 'variants.designName': item.selectedVariant },
                        { $inc: { 'variants.$.stock': -item.quantity } }
                    );
                } else {
                    // Reduce main stock
                    await Product.updateOne(
                        { _id: product._id },
                        { $inc: { stock: -item.quantity } }
                    );
                }
            }
        }

        // Create payment record for non-COD orders
        if (paymentMethod !== 'COD') {
            await Payment.create({
                order: order._id,
                method: paymentMethod,
                amount: totalAmount,
                status: 'pending',
            });
        }

        await order.populate('user', 'name email phone');
        await order.populate('items.product', 'name images');

        return successResponse('Order placed successfully', order, 201);
    } catch (error) {
        return serverErrorResponse(error);
    }
}
