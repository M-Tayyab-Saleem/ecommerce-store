"use client";

import React, { useState } from "react";
import { Search, Eye, Package, Truck, Clock, CheckCircle, XCircle, Box } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import { useAdminOrders } from "@/lib/api/admin/orders";
import { IOrder } from "@/models/Order";
import OrderDetailDrawer from "@/components/admin/OrderDetailDrawer";

export default function OrdersPage() {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [orderStatus, setOrderStatus] = useState("all");
    const [paymentStatus, setPaymentStatus] = useState("all");
    const [paymentMethod, setPaymentMethod] = useState("all");

    // Detail Drawer State
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

    // Fetch Orders
    const { data, isLoading } = useAdminOrders({
        page,
        limit: 10,
        search: search || undefined,
        orderStatus: orderStatus !== "all" ? orderStatus : undefined,
        paymentStatus: paymentStatus !== "all" ? paymentStatus : undefined,
        paymentMethod: paymentMethod !== "all" ? paymentMethod : undefined,
    });

    const handleViewOrder = (order: IOrder) => {
        setSelectedOrder(order);
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-PK", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return `PKR ${amount.toLocaleString()}`;
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock size={14} className="text-yellow-500" />;
            case "confirmed":
                return <CheckCircle size={14} className="text-blue-500" />;
            case "processing":
                return <Box size={14} className="text-indigo-500" />;
            case "shipped":
                return <Truck size={14} className="text-purple-500" />;
            case "delivered":
                return <CheckCircle size={14} className="text-green-500" />;
            case "cancelled":
                return <XCircle size={14} className="text-red-500" />;
            default:
                return <Package size={14} className="text-gray-500" />;
        }
    };

    // Columns Configuration
    const columns = [
        {
            key: "orderId",
            header: "Order",
            render: (order: IOrder) => (
                <div>
                    <p className="font-medium text-gray-900">#{order.orderId}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
            ),
        },
        {
            key: "customer",
            header: "Customer",
            render: (order: IOrder) => (
                <div>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <p className="font-medium text-gray-900">{(order.user as any)?.name || "N/A"}</p>
                    <p className="text-xs text-gray-500">{order.shippingAddress.city}</p>
                </div>
            ),
        },
        {
            key: "items",
            header: "Items",
            render: (order: IOrder) => (
                <span className="text-sm text-gray-700">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </span>
            ),
        },
        {
            key: "total",
            header: "Total",
            render: (order: IOrder) => (
                <span className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
            ),
            sortable: true,
        },
        {
            key: "payment",
            header: "Payment",
            render: (order: IOrder) => (
                <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${order.paymentMethod === "COD"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                        }`}>
                        {order.paymentMethod}
                    </span>
                    <StatusBadge status={order.paymentStatus} type="payment" />
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            render: (order: IOrder) => (
                <div className="flex items-center gap-2">
                    {getStatusIcon(order.orderStatus)}
                    <StatusBadge status={order.orderStatus} type="order" />
                </div>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            align: "right" as const,
            render: (order: IOrder) => (
                <button
                    onClick={() => handleViewOrder(order)}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Order Details"
                >
                    <Eye size={18} />
                </button>
            ),
        },
    ];

    // Stats counts
    const pendingCount = data?.orders.filter((o) => o.orderStatus === "pending").length || 0;
    const processingCount = data?.orders.filter((o) => ["confirmed", "processing", "shipped"].includes(o.orderStatus)).length || 0;
    const deliveredCount = data?.orders.filter((o) => o.orderStatus === "delivered").length || 0;
    const cancelledCount = data?.orders.filter((o) => o.orderStatus === "cancelled").length || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600">Manage customer orders and shipments</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} className="text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-700">Pending</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-800">{pendingCount}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Truck size={18} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Processing</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-800">{processingCount}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={18} className="text-green-600" />
                        <span className="text-sm font-medium text-green-700">Delivered</span>
                    </div>
                    <p className="text-2xl font-bold text-green-800">{deliveredCount}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle size={18} className="text-red-600" />
                        <span className="text-sm font-medium text-red-700">Cancelled</span>
                    </div>
                    <p className="text-2xl font-bold text-red-800">{cancelledCount}</p>
                </div>
            </div>

            <AdminCard className="overflow-visible">
                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by order ID, customer name, or phone..."
                            className="pl-10 input-field w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            className="input-field min-w-[140px]"
                            value={orderStatus}
                            onChange={(e) => {
                                setOrderStatus(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <select
                            className="input-field min-w-[140px]"
                            value={paymentMethod}
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="all">All Payments</option>
                            <option value="COD">COD</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="JAZZCASH">JazzCash</option>
                            <option value="EASYPAISA">EasyPaisa</option>
                        </select>
                        <select
                            className="input-field min-w-[130px]"
                            value={paymentStatus}
                            onChange={(e) => {
                                setPaymentStatus(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="all">Payment Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <AdminTable
                    columns={columns}
                    data={data?.orders || []}
                    loading={isLoading}
                    emptyMessage="No orders found matching your filters."
                />

                {/* Pagination */}
                {data && data.pagination.totalPages > 1 && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                        <Pagination
                            currentPage={page}
                            totalPages={data.pagination.totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </AdminCard>

            {/* Order Detail Drawer */}
            <OrderDetailDrawer
                isOpen={!!selectedOrder}
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </div>
    );
}
