import { useQuery } from '@tanstack/react-query';
import adminClient from './axios-instance';

interface DashboardStats {
    overview: {
        totalUsers: number;
        totalProducts: number;
        totalOrders: number;
        totalRevenue: number;
    };
    alerts: {
        pendingOrders: number;
        pendingPayments: number;
        lowStockProducts: number;
    };
    thisMonth: {
        orders: number;
        revenue: number;
    };
    lastMonth: {
        orders: number;
        revenue: number;
    };
    recentOrders: Array<{
        _id: string;
        orderId: string;
        orderStatus: string;
        paymentStatus: string;
        totalAmount: number;
        createdAt: string;
        user: {
            name: string;
            email: string;
        };
    }>;
    orderStatusBreakdown: Record<string, number>;
    paymentMethodBreakdown: Record<string, number>;
    lowStockProductsList: Array<{
        _id: string;
        name: string;
        stock: number;
        lowStockThreshold: number;
    }>;
}

export const useDashboardStats = () => {
    return useQuery<DashboardStats>({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const { data } = await adminClient.get('/admin/stats');
            return data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
