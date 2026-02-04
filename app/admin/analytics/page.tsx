"use client";

import React from "react";
import {
    TrendingUp,
    DollarSign,
    ShoppingBag,
    Package,
    CreditCard,
    Users,
    Award
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import { useQuery } from "@tanstack/react-query";
import adminClient from "@/lib/api/admin/axios-instance";

interface AnalyticsData {
    revenue: {
        total: number;
        thisMonth: number;
        lastMonth: number;
        growth: number;
    };
    orders: {
        total: number;
        thisMonth: number;
        pending: number;
        delivered: number;
    };
    products: {
        total: number;
        active: number;
        lowStock: number;
        outOfStock: number;
    };
    topProducts: Array<{
        _id: string;
        name: string;
        sold: number;
        revenue: number;
    }>;
    paymentBreakdown: {
        cod: number;
        bank: number;
        jazzcash: number;
        easypaisa: number;
    };
}

export default function AnalyticsPage() {
    // Fetch analytics data
    const { data: orders } = useQuery({
        queryKey: ["admin", "analytics", "orders"],
        queryFn: async () => {
            const { data } = await adminClient.get("/orders?limit=1000");
            return data.data || [];
        },
    });

    const { data: products } = useQuery({
        queryKey: ["admin", "analytics", "products"],
        queryFn: async () => {
            const { data } = await adminClient.get("/products?limit=1000");
            return data.data || [];
        },
    });

    const { data: users } = useQuery({
        queryKey: ["admin", "analytics", "users"],
        queryFn: async () => {
            const { data } = await adminClient.get("/users?limit=1000");
            return data.data || [];
        },
    });

    // Calculate analytics from data
    const analytics: Partial<AnalyticsData> = {};

    // Revenue & Orders stats
    if (orders) {
        const now = new Date();
        const thisMonth = now.getMonth();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const thisYear = now.getFullYear();

        const thisMonthOrders = orders.filter((o: { createdAt: string }) => {
            const d = new Date(o.createdAt);
            return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        });

        const lastMonthOrders = orders.filter((o: { createdAt: string }) => {
            const d = new Date(o.createdAt);
            return d.getMonth() === lastMonth && d.getFullYear() === (thisMonth === 0 ? thisYear - 1 : thisYear);
        });

        const totalRevenue = orders.reduce((sum: number, o: { totalAmount: number; orderStatus: string }) =>
            o.orderStatus !== "cancelled" ? sum + o.totalAmount : sum, 0);
        const thisMonthRevenue = thisMonthOrders.reduce((sum: number, o: { totalAmount: number; orderStatus: string }) =>
            o.orderStatus !== "cancelled" ? sum + o.totalAmount : sum, 0);
        const lastMonthRevenue = lastMonthOrders.reduce((sum: number, o: { totalAmount: number; orderStatus: string }) =>
            o.orderStatus !== "cancelled" ? sum + o.totalAmount : sum, 0);

        const growth = lastMonthRevenue > 0
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
            : 0;

        analytics.revenue = {
            total: totalRevenue,
            thisMonth: thisMonthRevenue,
            lastMonth: lastMonthRevenue,
            growth: parseFloat(growth as string) || 0,
        };

        analytics.orders = {
            total: orders.length,
            thisMonth: thisMonthOrders.length,
            pending: orders.filter((o: { orderStatus: string }) => o.orderStatus === "pending").length,
            delivered: orders.filter((o: { orderStatus: string }) => o.orderStatus === "delivered").length,
        };

        // Payment breakdown
        analytics.paymentBreakdown = {
            cod: orders.filter((o: { paymentMethod: string }) => o.paymentMethod === "COD").length,
            bank: orders.filter((o: { paymentMethod: string }) => o.paymentMethod === "BANK_TRANSFER").length,
            jazzcash: orders.filter((o: { paymentMethod: string }) => o.paymentMethod === "JAZZCASH").length,
            easypaisa: orders.filter((o: { paymentMethod: string }) => o.paymentMethod === "EASYPAISA").length,
        };
    }

    // Products stats
    if (products) {
        analytics.products = {
            total: products.length,
            active: products.filter((p: { isActive: boolean }) => p.isActive).length,
            lowStock: products.filter((p: { stock: number; lowStockThreshold: number }) =>
                p.stock > 0 && p.stock <= p.lowStockThreshold).length,
            outOfStock: products.filter((p: { stock: number }) => p.stock === 0).length,
        };
    }

    const formatCurrency = (amount: number) => `PKR ${amount?.toLocaleString() || 0}`;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600">Store performance metrics and insights</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminCard className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10">
                        <DollarSign size={80} className="text-green-600" />
                    </div>
                    <div className="relative">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(analytics.revenue?.total || 0)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            {analytics.revenue?.growth !== undefined && analytics.revenue.growth > 0 ? (
                                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                                    <TrendingUp size={14} />
                                    +{analytics.revenue.growth}%
                                </span>
                            ) : (
                                <span className="text-gray-500 text-sm">vs last month</span>
                            )}
                        </div>
                    </div>
                </AdminCard>

                <AdminCard className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10">
                        <ShoppingBag size={80} className="text-blue-600" />
                    </div>
                    <div className="relative">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.orders?.total || 0}</p>
                        <p className="mt-2 text-sm text-gray-500">
                            {analytics.orders?.thisMonth || 0} this month
                        </p>
                    </div>
                </AdminCard>

                <AdminCard className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10">
                        <Package size={80} className="text-purple-600" />
                    </div>
                    <div className="relative">
                        <p className="text-sm font-medium text-gray-500 mb-1">Active Products</p>
                        <p className="text-2xl font-bold text-gray-900">{analytics.products?.active || 0}</p>
                        <p className="mt-2 text-sm text-gray-500">
                            of {analytics.products?.total || 0} total
                        </p>
                    </div>
                </AdminCard>

                <AdminCard className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10">
                        <Users size={80} className="text-indigo-600" />
                    </div>
                    <div className="relative">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
                        <p className="mt-2 text-sm text-gray-500">
                            Registered customers
                        </p>
                    </div>
                </AdminCard>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Methods Breakdown */}
                <AdminCard title="Payment Methods" description="Order distribution by payment type">
                    <div className="space-y-4 mt-4">
                        {[
                            { label: "Cash on Delivery", value: analytics.paymentBreakdown?.cod || 0, color: "bg-blue-500" },
                            { label: "Bank Transfer", value: analytics.paymentBreakdown?.bank || 0, color: "bg-green-500" },
                            { label: "JazzCash", value: analytics.paymentBreakdown?.jazzcash || 0, color: "bg-red-500" },
                            { label: "EasyPaisa", value: analytics.paymentBreakdown?.easypaisa || 0, color: "bg-emerald-500" },
                        ].map((item) => {
                            const total = (analytics.paymentBreakdown?.cod || 0) +
                                (analytics.paymentBreakdown?.bank || 0) +
                                (analytics.paymentBreakdown?.jazzcash || 0) +
                                (analytics.paymentBreakdown?.easypaisa || 0);
                            const percentage = total > 0 ? (item.value / total * 100).toFixed(1) : 0;
                            return (
                                <div key={item.label} className="flex items-center gap-4">
                                    <div className="w-32 text-sm text-gray-600">{item.label}</div>
                                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} transition-all`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <div className="w-20 text-right">
                                        <span className="font-medium text-gray-900">{item.value}</span>
                                        <span className="text-gray-400 text-sm ml-1">({percentage}%)</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </AdminCard>

                {/* Order Status Distribution */}
                <AdminCard title="Order Status" description="Current order status breakdown">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <p className="text-2xl font-bold text-yellow-700">{analytics.orders?.pending || 0}</p>
                            <p className="text-sm text-yellow-600">Pending</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <p className="text-2xl font-bold text-green-700">{analytics.orders?.delivered || 0}</p>
                            <p className="text-sm text-green-600">Delivered</p>
                        </div>
                    </div>
                </AdminCard>
            </div>

            {/* Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AdminCard title="Inventory Health" description="Stock level overview">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <p className="text-2xl font-bold text-yellow-700">{analytics.products?.lowStock || 0}</p>
                            <p className="text-sm text-yellow-600">Low Stock Items</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <p className="text-2xl font-bold text-red-700">{analytics.products?.outOfStock || 0}</p>
                            <p className="text-sm text-red-600">Out of Stock</p>
                        </div>
                    </div>
                </AdminCard>

                {/* Revenue Stats */}
                <AdminCard title="Revenue Comparison" description="Monthly revenue performance">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-lg font-bold text-blue-700">
                                {formatCurrency(analytics.revenue?.thisMonth || 0)}
                            </p>
                            <p className="text-sm text-blue-600">This Month</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="text-lg font-bold text-gray-700">
                                {formatCurrency(analytics.revenue?.lastMonth || 0)}
                            </p>
                            <p className="text-sm text-gray-600">Last Month</p>
                        </div>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
}
