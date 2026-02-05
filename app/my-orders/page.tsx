"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { formatPKR } from "@/utils/format";
import EmptyState from "@/components/EmptyState";

// Mock orders data - replace with actual API call
const mockOrders = [
    {
        _id: "ORD-2025-001",
        items: [
            {
                name: "Rose Petal Resin Necklace",
                image: "/images/product-1.jpg",
                quantity: 1,
                price: 1500,
            },
            {
                name: "Custom Name Keychain",
                image: "/images/product-2.jpg",
                quantity: 2,
                price: 800,
            },
        ],
        amount: 3100,
        status: "delivered",
        date: "Jan 25, 2025",
        trackingNumber: "TCS-12345",
    },
    {
        _id: "ORD-2025-002",
        items: [
            {
                name: "Ocean Wave Coasters Set",
                image: "/images/product-3.jpg",
                quantity: 1,
                price: 2500,
            },
        ],
        amount: 2500,
        status: "shipped",
        date: "Jan 30, 2025",
        trackingNumber: "TCS-12346",
    },
    {
        _id: "ORD-2025-003",
        items: [
            {
                name: "Galaxy Purple Earrings",
                image: "/images/product-4.jpg",
                quantity: 1,
                price: 1200,
            },
        ],
        amount: 1200,
        status: "processing",
        date: "Feb 1, 2025",
    },
];

const statusConfig = {
    processing: {
        label: "Processing",
        icon: Clock,
        bgColor: "bg-amber-100",
        textColor: "text-amber-700",
    },
    shipped: {
        label: "Shipped",
        icon: Truck,
        bgColor: "bg-blue-100",
        textColor: "text-blue-700",
    },
    delivered: {
        label: "Delivered",
        icon: CheckCircle,
        bgColor: "bg-green-100",
        textColor: "text-green-700",
    },
};

const MyOrdersPage = () => {
    // Replace with actual data fetching
    const orders = mockOrders;

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

            {orders.length === 0 ? (
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
                        const status = statusConfig[order.status as keyof typeof statusConfig];
                        const StatusIcon = status.icon;

                        return (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 border-b">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID</p>
                                            <p className="font-semibold text-gray-900">{order._id}</p>
                                        </div>
                                        <div className="hidden sm:block w-px h-8 bg-gray-300" />
                                        <div>
                                            <p className="text-sm text-gray-500">Order Date</p>
                                            <p className="font-medium text-gray-900">{order.date}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}
                                        >
                                            <StatusIcon size={16} />
                                            {status.label}
                                        </span>
                                        {order.trackingNumber && (
                                            <button className="btn-outline text-sm py-1.5">
                                                Track Order
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-5">
                                    <div className="flex flex-wrap gap-4">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex gap-3">
                                                <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={64}
                                                        height={80}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm line-clamp-2">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-0.5">
                                                        Qty: {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900 mt-0.5">
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
                                        <span className="text-sm">
                                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Order Total</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {formatPKR(order.amount)}
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
                    className="btn-whatsapp inline-flex"
                >
                    Chat on WhatsApp
                </a>
            </div>
        </div>
    );
};

export default MyOrdersPage;