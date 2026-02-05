"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";

const SuccessContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm text-center max-w-2xl mx-auto border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Order Placed Successfully!
            </h1>

            <p className="text-lg text-gray-600 mb-8">
                Thank you for your purchase. Your order has been received and is being processed.
            </p>

            {orderId && (
                <div className="bg-gray-50 rounded-xl p-4 mb-8 inline-block">
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="text-xl font-mono font-bold text-gray-900 tracking-wider">
                        {orderId}
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <p className="text-gray-600">
                    We have sent a confirmation email to your inbox with all the details.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/products"
                        className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3"
                    >
                        <ShoppingBag size={20} />
                        Continue Shopping
                    </Link>
                    <Link
                        href="/my-orders"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-primary hover:text-primary transition-colors"
                    >
                        View My Orders
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const OrderSuccessPage = () => {
    return (
        <div className="container-custom pt-24 pb-16 min-h-[60vh] flex items-center justify-center">
            <Suspense fallback={<div className="text-center">Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
};

export default OrderSuccessPage;
