"use client";

import React, { useState } from "react";
import {
    Search,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    CreditCard,
    Loader2,
    Image as ImageIcon,
    ZoomIn,
    AlertCircle
} from "lucide-react";
import Image from "next/image";
import AdminCard from "@/components/admin/AdminCard";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import ConfirmModal from "@/components/ConfirmModal";
import { useAdminPayments, useVerifyPayment } from "@/lib/api/admin/payments";
import { useToast } from "@/components/Toast";
import { IPayment } from "@/models/Payment";

export default function PaymentsPage() {
    // State
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("pending");

    // Preview State
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Reject Modal State
    const [rejectPaymentId, setRejectPaymentId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const { showToast } = useToast();
    const verifyMutation = useVerifyPayment();

    // Fetch Payments
    const { data, isLoading, isFetching } = useAdminPayments({
        page,
        limit: 10,
        status,
    });

    // Handle Verify
    const handleVerify = async (paymentId: string) => {
        try {
            await verifyMutation.mutateAsync({ paymentId, action: "verify" });
            showToast("success", "Payment verified successfully");
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to verify payment");
        }
    };

    // Handle Reject
    const handleReject = async () => {
        if (!rejectPaymentId) return;
        try {
            await verifyMutation.mutateAsync({
                paymentId: rejectPaymentId,
                action: "reject",
                rejectionReason: rejectionReason || undefined,
            });
            showToast("success", "Payment rejected");
            setRejectPaymentId(null);
            setRejectionReason("");
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to reject payment");
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

    const getPaymentMethodColor = (method: string) => {
        switch (method) {
            case "JAZZCASH":
                return "bg-red-100 text-red-700";
            case "EASYPAISA":
                return "bg-green-100 text-green-700";
            case "BANK_TRANSFER":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // Stats counts
    const pendingCount = data?.payments.filter((p) => p.status === "pending").length || 0;
    const verifiedCount = data?.payments.filter((p) => p.status === "verified").length || 0;
    const rejectedCount = data?.payments.filter((p) => p.status === "rejected").length || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payment Verification</h1>
                    <p className="text-gray-600">Verify customer payment proofs for online transfers</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={() => { setStatus("pending"); setPage(1); }}
                    className={`rounded-lg p-4 border transition-colors text-left ${status === "pending" ? "bg-yellow-100 border-yellow-400" : "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                        }`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} className="text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-700">Pending</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-800">{pendingCount}</p>
                </button>
                <button
                    onClick={() => { setStatus("verified"); setPage(1); }}
                    className={`rounded-lg p-4 border transition-colors text-left ${status === "verified" ? "bg-green-100 border-green-400" : "bg-green-50 border-green-200 hover:bg-green-100"
                        }`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={18} className="text-green-600" />
                        <span className="text-sm font-medium text-green-700">Verified</span>
                    </div>
                    <p className="text-2xl font-bold text-green-800">{verifiedCount}</p>
                </button>
                <button
                    onClick={() => { setStatus("rejected"); setPage(1); }}
                    className={`rounded-lg p-4 border transition-colors text-left ${status === "rejected" ? "bg-red-100 border-red-400" : "bg-red-50 border-red-200 hover:bg-red-100"
                        }`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle size={18} className="text-red-600" />
                        <span className="text-sm font-medium text-red-700">Rejected</span>
                    </div>
                    <p className="text-2xl font-bold text-red-800">{rejectedCount}</p>
                </button>
            </div>

            <AdminCard>
                {/* Loading indicator */}
                {isFetching && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                )}

                {/* Content */}
                {isLoading ? (
                    <div className="py-12 text-center text-gray-500">Loading payments...</div>
                ) : data?.payments.length === 0 ? (
                    <div className="py-12 text-center">
                        <CreditCard size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">No {status} payments found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data?.payments.map((payment) => (
                            <div
                                key={payment._id.toString()}
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Screenshot Preview */}
                                    <div className="w-full lg:w-32 flex-shrink-0">
                                        {payment.screenshot ? (
                                            <button
                                                onClick={() => setPreviewImage(payment.screenshot!)}
                                                className="relative w-full h-24 lg:h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group"
                                            >
                                                <Image
                                                    src={payment.screenshot}
                                                    alt="Payment proof"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <ZoomIn className="text-white" size={24} />
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="w-full h-24 lg:h-32 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                                                <ImageIcon className="text-gray-300" size={32} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment Details */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            <span className="font-semibold text-gray-900">Order #{(payment.order as any)?.orderId || "N/A"}</span>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded ${getPaymentMethodColor(payment.method)}`}>
                                                {payment.method}
                                            </span>
                                            <StatusBadge
                                                status={payment.status}
                                                type={payment.status === "verified" ? "active" : payment.status === "rejected" ? "active" : "payment"}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Amount</p>
                                                <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                                            </div>
                                            {payment.transactionId && (
                                                <div>
                                                    <p className="text-gray-500">Transaction ID</p>
                                                    <p className="font-mono text-gray-900">{payment.transactionId}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-gray-500">Submitted</p>
                                                <p className="text-gray-900">{formatDate(payment.createdAt)}</p>
                                            </div>
                                            {payment.verifiedAt && (
                                                <div>
                                                    <p className="text-gray-500">{payment.status === "verified" ? "Verified" : "Rejected"} At</p>
                                                    <p className="text-gray-900">{formatDate(payment.verifiedAt)}</p>
                                                </div>
                                            )}
                                        </div>

                                        {payment.rejectionReason && (
                                            <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700">
                                                <span className="font-medium">Rejection reason:</span> {payment.rejectionReason}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    {payment.status === "pending" && (
                                        <div className="flex flex-row lg:flex-col gap-2">
                                            <button
                                                onClick={() => handleVerify(payment._id.toString())}
                                                disabled={verifyMutation.isPending}
                                                className="flex-1 lg:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {verifyMutation.isPending ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <CheckCircle size={16} />
                                                )}
                                                Verify
                                            </button>
                                            <button
                                                onClick={() => setRejectPaymentId(payment._id.toString())}
                                                disabled={verifyMutation.isPending}
                                                className="flex-1 lg:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <XCircle size={16} />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
                        <Image
                            src={previewImage}
                            alt="Payment proof"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Reject Confirmation Modal */}
            <ConfirmModal
                isOpen={!!rejectPaymentId}
                title="Reject Payment"
                message={
                    <div className="space-y-4">
                        <p>Are you sure you want to reject this payment? This action will mark the order payment as failed.</p>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Reason (optional)
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g. Invalid transaction ID, blurry screenshot, amount mismatch..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-200 min-h-[80px]"
                            />
                        </div>
                    </div>
                }
                variant="danger"
                confirmText="Reject Payment"
                onConfirm={handleReject}
                onCancel={() => {
                    setRejectPaymentId(null);
                    setRejectionReason("");
                }}
            />
        </div>
    );
}
