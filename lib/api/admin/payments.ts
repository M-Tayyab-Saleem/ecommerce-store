"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import adminClient from "./axios-instance";
import { IPayment } from "@/models/Payment";

export interface PaymentsResponse {
    payments: IPayment[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface PaymentFilters {
    page?: number;
    limit?: number;
    status?: string;
}

// Fetch payments for verification
export const useAdminPayments = (filters: PaymentFilters) => {
    return useQuery<PaymentsResponse>({
        queryKey: ["admin", "payments", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append("page", filters.page.toString());
            if (filters.limit) params.append("limit", filters.limit.toString());
            if (filters.status && filters.status !== "all") params.append("status", filters.status);

            const { data } = await adminClient.get(`/payments/verify?${params.toString()}`);

            return {
                payments: data.data || [],
                pagination: data.metadata || {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 1,
                },
            };
        },
        placeholderData: keepPreviousData,
    });
};

// Verify or reject payment mutation
export const useVerifyPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ paymentId, action, rejectionReason }: {
            paymentId: string;
            action: "verify" | "reject";
            rejectionReason?: string;
        }) => {
            const { data } = await adminClient.put("/payments/verify", {
                paymentId,
                action,
                rejectionReason
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "payments"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
        },
    });
};
