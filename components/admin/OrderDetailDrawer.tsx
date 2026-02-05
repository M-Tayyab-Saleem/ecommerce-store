"use client";

import React, { useState } from "react";
import {
    X,
    Package,
    MapPin,
    CreditCard,
    Clock,
    User,
    Phone,
    FileText,
    ChevronDown,
    Loader2,
    CheckCircle,
    XCircle,
    Truck,
    Box,
    AlertCircle,
    Eye
} from "lucide-react";
import { IOrder, OrderStatus } from "@/models/Order";
import StatusBadge from "@/components/admin/StatusBadge";
import { useUpdateOrderStatus, useAdminPayment } from "@/lib/api/admin/orders";
import { useToast } from "@/components/Toast";
import Image from "next/image";

const PaymentDetailsSection = ({ orderId, method }: { orderId: string; method: string }) => {
    const { data: payment, isLoading } = useAdminPayment(orderId);

    if (isLoading) return <div className="text-sm text-gray-500 animate-pulse">Loading payment details...</div>;
    if (!payment) return null;

    return (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {payment.transactionId && (
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Transaction ID</p>
                    <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block">
                        {payment.transactionId}
                    </p>
                </div>
            )}

            {payment.screenshot && (
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Payment Proof</p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                        <Image
                            src={payment.screenshot}
                            alt="Payment Proof"
                            fill
                            className="object-contain"
                        />
                        <a
                            href={payment.screenshot}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full flex items-center gap-2">
                                <Eye size={16} /> View Full Image
                            </span>
                        </a>
                    </div>
                </div>
            )}
            {/* If manual payment but no screenshot */}
            {method !== 'COD' && !payment.screenshot && (
                <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>No payment screenshot uploaded yet.</span>
                </div>
            )}
        </div>
    );
};

interface OrderDetailDrawerProps {
    order: IOrder | null;
    isOpen: boolean;
    onClose: () => void;
}

const statusOptions: { value: OrderStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "pending", label: "Pending", icon: <Clock size={16} />, color: "text-yellow-600" },
    { value: "confirmed", label: "Confirmed", icon: <CheckCircle size={16} />, color: "text-blue-600" },
    { value: "processing", label: "Processing", icon: <Box size={16} />, color: "text-indigo-600" },
    { value: "shipped", label: "Shipped", icon: <Truck size={16} />, color: "text-purple-600" },
    { value: "delivered", label: "Delivered", icon: <CheckCircle size={16} />, color: "text-green-600" },
    { value: "cancelled", label: "Cancelled", icon: <XCircle size={16} />, color: "text-red-600" },
];

// Valid status transitions
const validTransitions: Record<string, string[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered", "cancelled"],
    delivered: [],
    cancelled: [],
};

export default function OrderDetailDrawer({ order, isOpen, onClose }: OrderDetailDrawerProps) {
    const [statusNote, setStatusNote] = useState("");
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const { showToast } = useToast();
    const updateStatusMutation = useUpdateOrderStatus();

    if (!isOpen || !order) return null;

    const allowedStatuses = validTransitions[order.orderStatus] || [];

    const handleStatusUpdate = async (newStatus: OrderStatus) => {
        try {
            await updateStatusMutation.mutateAsync({
                id: order._id.toString(),
                status: newStatus,
                note: statusNote || undefined,
            });
            showToast("success", `Order status updated to ${newStatus}`);
            setStatusNote("");
            setShowStatusDropdown(false);
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to update order status");
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleString("en-PK", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const formatCurrency = (amount: number) => {
        return `PKR ${amount.toLocaleString()}`;
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white shadow-xl z-50 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Order #{order.orderId}</h2>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Status Section */}
                    <section className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <StatusBadge status={order.orderStatus} type="order" />
                                <StatusBadge status={order.paymentStatus} type="payment" />
                                {order.paymentMethod === "COD" && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                        COD
                                    </span>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                                <p className="text-sm text-gray-500">Total Amount</p>
                            </div>
                        </div>
                    </section>

                    {/* Status Update Section */}
                    {allowedStatuses.length > 0 && (
                        <section className="bg-white rounded-lg p-4 border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                <AlertCircle size={16} />
                                Update Order Status
                            </h3>

                            <div className="space-y-3">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <span>Select new status</span>
                                        <ChevronDown size={18} className={`transition-transform ${showStatusDropdown ? "rotate-180" : ""}`} />
                                    </button>

                                    {showStatusDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            {allowedStatuses.map((status) => {
                                                const option = statusOptions.find((o) => o.value === status);
                                                return (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusUpdate(status as OrderStatus)}
                                                        disabled={updateStatusMutation.isPending}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg disabled:opacity-50"
                                                    >
                                                        {updateStatusMutation.isPending ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <span className={option?.color}>{option?.icon}</span>
                                                        )}
                                                        <span className="font-medium">{option?.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    placeholder="Optional note for status change..."
                                    value={statusNote}
                                    onChange={(e) => setStatusNote(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        </section>
                    )}

                    {/* Order Items */}
                    <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                <Package size={18} />
                                Order Items ({order.items.length})
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item, index) => (
                                <div key={index} className="p-4 flex gap-4">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {(item.product as any)?.images?.[0] ? (
                                            <Image
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                src={(item.product as any).images[0]}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Package size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                                            <span>Qty: {item.quantity}</span>
                                            {item.selectedVariant && (
                                                <span className="px-2 py-0.5 bg-gray-100 rounded">
                                                    {item.selectedVariant}
                                                </span>
                                            )}
                                        </div>
                                        {item.customText && (
                                            <p className="mt-1 text-sm text-primary italic">
                                                Custom: &quot;{item.customText}&quot;
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                        <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Total */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(order.totalAmount - order.shippingFee)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>{formatCurrency(order.shippingFee)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>{formatCurrency(order.totalAmount)}</span>
                            </div>
                        </div>
                    </section>

                    {/* Customer & Shipping */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Customer Info */}
                        <section className="bg-white rounded-lg border border-gray-200 p-4">
                            <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
                                <User size={18} />
                                Customer
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <User size={14} />
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    <span>{(order.user as any)?.name || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone size={14} />
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    <span>{(order.user as any)?.phone || "N/A"}</span>
                                </div>
                            </div>
                        </section>

                        {/* Shipping Address */}
                        <section className="bg-white rounded-lg border border-gray-200 p-4">
                            <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
                                <MapPin size={18} />
                                Shipping Address
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}{order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ""}</p>
                                <p className="flex items-center gap-1">
                                    <Phone size={12} />
                                    {order.shippingAddress.phone}
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Payment Method */}
                    <section className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-900 flex items-center gap-2">
                                <CreditCard size={18} />
                                Payment
                            </h3>
                            <button
                                onClick={() => window.location.reload()} // Quick hack to refresh payment if needed? No, query will handle it.
                                className="text-xs text-primary hover:underline"
                            >
                                Refresh
                            </button>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-600">Method</p>
                                <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
                            </div>
                            <StatusBadge status={order.paymentStatus} type="payment" />
                        </div>

                        {/* Fetch Payment Details */}
                        <PaymentDetailsSection orderId={order._id.toString()} method={order.paymentMethod} />

                    </section>

                    {/* Order Notes */}
                    {order.notes && (
                        <section className="bg-white rounded-lg border border-gray-200 p-4">
                            <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
                                <FileText size={18} />
                                Order Notes
                            </h3>
                            <p className="text-sm text-gray-600">{order.notes}</p>
                        </section>
                    )}

                    {/* Status History */}
                    <section className="bg-white rounded-lg border border-gray-200 p-4">
                        <h3 className="font-medium text-gray-900 flex items-center gap-2 mb-4">
                            <Clock size={18} />
                            Status History
                        </h3>
                        <div className="relative pl-6 space-y-4">
                            {/* Timeline line */}
                            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />

                            {order.statusHistory.map((history, index) => {
                                const option = statusOptions.find((o) => o.value === history.status);
                                return (
                                    <div key={index} className="relative flex gap-3">
                                        {/* Timeline dot */}
                                        <div className={`absolute -left-4 w-4 h-4 rounded-full border-2 bg-white ${index === 0 ? "border-primary" : "border-gray-300"
                                            }`} />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium ${option?.color}`}>
                                                    {option?.label || history.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {formatDate(history.timestamp)}
                                            </p>
                                            {history.note && (
                                                <p className="text-sm text-gray-600 mt-1 italic">{history.note}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-white">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
