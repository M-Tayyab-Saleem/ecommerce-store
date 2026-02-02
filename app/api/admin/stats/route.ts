import { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Payment from '@/models/Payment';
import { requireAdmin } from '@/lib/authMiddleware';
import {
    successResponse,
    unauthorizedResponse,
    serverErrorResponse,
} from '@/utils/apiResponse';

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
    try {
        // Check admin access
        const authResult = await requireAdmin(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        await dbConnect();

        // Get date range for this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Total counts
        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            pendingOrders,
            pendingPayments,
            lowStockProducts,
            ordersThisMonth,
            revenueThisMonth,
            ordersLastMonth,
            revenueLastMonth,
        ] = await Promise.all([
            // Total users (excluding admins)
            User.countDocuments({ role: 'user' }),

            // Total active products
            Product.countDocuments({ isActive: true, isDeleted: false }),

            // Total orders
            Order.countDocuments(),

            // Total revenue (from delivered orders)
            Order.aggregate([
                { $match: { orderStatus: 'delivered' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),

            // Pending orders count
            Order.countDocuments({ orderStatus: 'pending' }),

            // Pending payments count
            Payment.countDocuments({ status: 'pending' }),

            // Low stock products
            Product.countDocuments({
                isActive: true,
                isDeleted: false,
                $expr: { $lte: ['$stock', '$lowStockThreshold'] },
            }),

            // Orders this month
            Order.countDocuments({ createdAt: { $gte: startOfMonth } }),

            // Revenue this month
            Order.aggregate([
                {
                    $match: {
                        orderStatus: 'delivered',
                        createdAt: { $gte: startOfMonth },
                    },
                },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),

            // Orders last month
            Order.countDocuments({
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
            }),

            // Revenue last month
            Order.aggregate([
                {
                    $match: {
                        orderStatus: 'delivered',
                        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                    },
                },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
        ]);

        // Recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderId orderStatus paymentStatus totalAmount createdAt');

        // Order status breakdown
        const orderStatusBreakdown = await Order.aggregate([
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
        ]);

        // Payment method breakdown
        const paymentMethodBreakdown = await Order.aggregate([
            { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
        ]);

        // Low stock products list
        const lowStockProductsList = await Product.find({
            isActive: true,
            isDeleted: false,
            $expr: { $lte: ['$stock', '$lowStockThreshold'] },
        })
            .select('name stock lowStockThreshold')
            .limit(10);

        const stats = {
            overview: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
            },
            alerts: {
                pendingOrders,
                pendingPayments,
                lowStockProducts,
            },
            thisMonth: {
                orders: ordersThisMonth,
                revenue: revenueThisMonth[0]?.total || 0,
            },
            lastMonth: {
                orders: ordersLastMonth,
                revenue: revenueLastMonth[0]?.total || 0,
            },
            recentOrders,
            orderStatusBreakdown: orderStatusBreakdown.reduce(
                (acc, item) => ({ ...acc, [item._id]: item.count }),
                {}
            ),
            paymentMethodBreakdown: paymentMethodBreakdown.reduce(
                (acc, item) => ({ ...acc, [item._id]: item.count }),
                {}
            ),
            lowStockProductsList,
        };

        return successResponse('Dashboard statistics retrieved successfully', stats);
    } catch (error) {
        return serverErrorResponse(error);
    }
}
