"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { formatPKR } from "@/utils/format";
import EmptyState from "@/components/EmptyState";
import axiosInstance from "@/lib/api/axios-instance";
import { useAuth } from "@/context/AuthContext";

interface IOrderItem {
    product: {
        _id: string;
        name: string;
        images: string[];
    };
    name: string;
    quantity: number;
    selectedVariant?: string;
    price: number;
}

interface IOrder {
    _id: string;
    orderId: string;
    items: IOrderItem[];
    totalAmount: number;
    orderStatus: string;
    createdAt: string;
    paymentMethod: string;
    shippingAddress: {
        city: string;
    };
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; bgColor: string; textColor: string }> = {
    pending: {
        label: "Pending",
        icon: Clock,
        bgColor: "bg-amber-100",
        textColor: "text-amber-700",
    },
    confirmed: {
        label: "Confirmed",
        icon: CheckCircle,
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
    },
    processing: {
        label: "Processing",
        icon: Package,
        bgColor: "bg-indigo-100",
        textColor: "text-indigo-700",
    },
    shipped: {
        label: "Shipped",
        icon: Truck,
        bgColor: "bg-purple-100",
        textColor: "text-purple-700",
    },
    delivered: {
        label: "Delivered",
        icon: CheckCircle,
        bgColor: "bg-green-100",
        textColor: "text-green-700",
    },
    cancelled: {
        label: "Cancelled",
        icon: AlertCircle,
        bgColor: "bg-red-100",
        textColor: "text-red-700",
    },
};

const MyOrdersPage = () => {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get('/orders/my');
                if (response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (err: unknown) {
                console.error("Failed to fetch orders", err);
                // Don't show error if it's just no orders or 404
                if (typeof err === 'object' && err !== null && 'response' in err && (err as any).response?.status !== 404) {
                    setError("Failed to load your orders. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            if (user) {
                fetchOrders();
            } else {
                setLoading(false);
            }
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="container-custom pt-32 pb-16 flex justify-center items-center min-h-[50vh]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container-custom pt-24 pb-16 text-center">
                <EmptyState
                    type="orders"
                    title="Login to view orders"
                    message="Please login to view your order history."
                    actionLabel="Login Now"
                    actionHref="/login"
                />
            </div>
        );
    }

    return (
        <div className="container-custom pt-24 pb-16">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    My Orders
                </h1>
                <p className="text-gray-600 mt-1">
                    Track and manage your orders
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {orders.length === 0 && !error ? (
                <EmptyState
                    type="orders"
                    title="No orders yet"
                    message="When you place an order, it will appear here so you can track it."
                    actionLabel="Start Shopping"
                    actionHref="/products"
                />
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const statusKey = order.orderStatus.toLowerCase();
                        const status = statusConfig[statusKey] || statusConfig.pending;
                        const StatusIcon = status.icon;

                        return (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 border-b">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-medium">Order ID</p>
                                            <p className="font-bold text-gray-900 font-mono text-lg">{order.orderId}</p>
                                        </div>
                                        <div className="hidden sm:block w-px h-8 bg-gray-300" />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-medium">Date</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-sm font-medium border ${status.textColor} border-current`}
                                        >
                                            <StatusIcon size={14} />
                                            {status.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-5">
                                    <div className="flex flex-col gap-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex gap-4 items-start border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                                    {item.product?.images?.[0] ? (
                                                        <Image
                                                            src={item.product.images[0]}
                                                            alt={item.name}
                                                            width={80}
                                                            height={80}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                                            <Package size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 sm:text-lg">
                                                        {item.name}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                                            Qty: {item.quantity}
                                                        </span>
                                                        {item.selectedVariant && (
                                                            <span className="text-gray-500">
                                                                Design: <span className="font-medium text-gray-900">{item.selectedVariant}</span>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="font-medium text-primary mt-2">
                                                        {formatPKR(item.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="flex items-center justify-between p-5 bg-gray-50 border-t">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Package size={18} />
                                        <span className="text-sm font-medium">
                                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase font-medium">Order Total</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {formatPKR(order.totalAmount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Help Section */}
            <div className="mt-12 bg-primary/5 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Need Help with Your Order?
                </h3>
                <p className="text-gray-600 mb-4">
                    Contact us on WhatsApp for any order-related queries
                </p>
                <a
                    href="https://wa.me/923022828770?text=Hi! I need help with my order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:bg-[#20b85a] transition-all transform hover:scale-105 shadow-md"
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.698c1.005.578 2.053.945 3.167.945h.001c3.181 0 5.768-2.586 5.769-5.767 0-3.18-2.587-5.766-5.768-5.766zm-12.031 5.766c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12zm10.969 11.231c-6.195 0-11.231-5.036-11.231-11.231 0-6.196 5.036-11.231 11.231-11.231 6.196 0 11.231 5.035 11.231 11.231 0 6.195-5.036 11.231-11.231 11.231zm5.132-7.854c-.282-.141-1.669-.824-1.927-.919-.259-.094-.447-.141-.635.141-.188.282-.729.918-.894 1.106-.164.188-.329.212-.612.071-.282-.141-1.192-.44-2.271-1.402-.843-.752-1.413-1.681-1.577-1.964-.165-.282-.018-.435.123-.576.13-.13.282-.329.424-.494.141-.165.188-.282.282-.471.094-.188.047-.353-.024-.494-.07-.141-.635-1.529-.871-2.094-.229-.553-.464-.477-.635-.486-.165-.008-.353-.008-.541-.008-.188 0-.494.071-.753.353-.259.282-1 .977-1 2.383 0 1.406 1.024 2.765 1.165 2.953.141.188 2.016 3.076 4.884 4.312.682.294 1.215.47 1.631.602.686.218 1.31.187 1.808.113.553-.082 1.669-.682 1.906-1.341.235-.659.235-1.224.165-1.341-.07-.118-.259-.188-.541-.329z" />
                    </svg>
                    Chat on WhatsApp
                </a>
            </div>
        </div>
    );
};

export default MyOrdersPage;