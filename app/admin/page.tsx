"use client";

import React from "react";
import { useDashboardStats } from "@/lib/api/admin/stats";
import LoadingSkeleton from "@/components/admin/LoadingSkeleton";
import AdminCard from "@/components/admin/AdminCard";
import StatusBadge from "@/components/admin/StatusBadge";
import {
    ShoppingCart,
    DollarSign,
    Package,
    CreditCard,
    TrendingUp,
    AlertTriangle,
} from "lucide-react";

export default function AdminDashboard() {
    const { data: stats, isLoading, error } = useDashboardStats();

    if (isLoading) {
        return <LoadingSkeleton type="stats" />;
    }

    if (error) {
        return (
            <div className="card p-6">
                <p className="text-red-600">Failed to load dashboard stats. Please try again.</p>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-PK", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900">
                    Welcome to  Admin Dashboard
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                    Overview of your store performance and quick actions
                </p>
            </div>


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.overview.totalOrders}
                            </p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ShoppingCart className="text-blue-600" size={20} />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                        <TrendingUp size={14} className="text-green-600" />
                        <span className="text-green-600 font-medium">
                            {stats.thisMonth.orders} this month
                        </span>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(stats.overview.totalRevenue)}
                            </p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="text-green-600" size={20} />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                        <span className="text-gray-600">
                            {formatCurrency(stats.thisMonth.revenue)} this month
                        </span>
                    </div>
                </div>

                <div className="card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.overview.totalProducts}
                            </p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Package className="text-purple-600" size={20} />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                        {stats.alerts.lowStockProducts > 0 && (
                            <>
                                <AlertTriangle size={14} className="text-yellow-600" />
                                <span className="text-yellow-600 font-medium">
                                    {stats.alerts.lowStockProducts} low stock
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="card p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Pending Payments</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.alerts.pendingPayments}
                            </p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <CreditCard className="text-yellow-600" size={20} />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                        <span className="text-gray-600">Require verification</span>
                    </div>
                </div>
            </div>

            {/* Alerts Section */}
            {(stats.alerts.pendingOrders > 0 ||
                stats.alerts.pendingPayments > 0 ||
                stats.alerts.lowStockProducts > 0) && (
                    <AdminCard title="Action Required" icon={<AlertTriangle size={20} />}>
                        <div className="space-y-3">
                            {stats.alerts.pendingOrders > 0 && (
                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                    <span className="text-sm text-gray-700">
                                        <strong>{stats.alerts.pendingOrders}</strong> orders pending confirmation
                                    </span>
                                    <a href="/admin/orders" className="text-sm text-primary hover:underline">
                                        View Orders
                                    </a>
                                </div>
                            )}
                            {stats.alerts.pendingPayments > 0 && (
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm text-gray-700">
                                        <strong>{stats.alerts.pendingPayments}</strong> payments need verification
                                    </span>
                                    <a href="/admin/payments" className="text-sm text-primary hover:underline">
                                        Verify Payments
                                    </a>
                                </div>
                            )}
                            {stats.alerts.lowStockProducts > 0 && (
                                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                    <span className="text-sm text-gray-700">
                                        <strong>{stats.alerts.lowStockProducts}</strong> products have low stock
                                    </span>
                                    <a href="/admin/inventory" className="text-sm text-primary hover:underline">
                                        View Inventory
                                    </a>
                                </div>
                            )}
                        </div>
                    </AdminCard>
                )}

            {/* Recent Orders */}
            <AdminCard title="Recent Orders" description="Latest 5 orders">
                {stats.recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No orders yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Order ID
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Customer
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Amount
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Order Status
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Payment
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                            {order.orderId}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{order.user.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900 font-semibold">
                                            {formatCurrency(order.totalAmount)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <StatusBadge status={order.orderStatus} type="order" />
                                        </td>
                                        <td className="py-3 px-4">
                                            <StatusBadge status={order.paymentStatus} type="payment" />
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {formatDate(order.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </AdminCard>

            {/* Low Stock Products */}
            {stats.lowStockProductsList.length > 0 && (
                <AdminCard
                    title="Low Stock Alert"
                    description="Products running low on stock"
                    icon={<AlertTriangle size={20} />}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Product Name
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Current Stock
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Threshold
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.lowStockProductsList.map((product) => (
                                    <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                            {product.name}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{product.stock}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {product.lowStockThreshold}
                                        </td>
                                        <td className="py-3 px-4">
                                            <StatusBadge
                                                status={product.stock === 0 ? "Out of stock" : "Low stock"}
                                                type="stock"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </AdminCard>
            )}
        </div>
    );
}
