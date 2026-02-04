"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import adminClient from "./axios-instance";
import { IOrder, OrderStatus } from "@/models/Order";

export interface OrdersResponse {
    orders: IOrder[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface OrderFilters {
    page?: number;
    limit?: number;
    orderStatus?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    search?: string;
}

// Fetch orders with filters and pagination
export const useAdminOrders = (filters: OrderFilters) => {
    return useQuery<OrdersResponse>({
        queryKey: ["admin", "orders", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append("page", filters.page.toString());
            if (filters.limit) params.append("limit", filters.limit.toString());
            if (filters.orderStatus && filters.orderStatus !== "all") params.append("orderStatus", filters.orderStatus);
            if (filters.paymentStatus && filters.paymentStatus !== "all") params.append("paymentStatus", filters.paymentStatus);
            if (filters.paymentMethod && filters.paymentMethod !== "all") params.append("paymentMethod", filters.paymentMethod);
            if (filters.search) params.append("search", filters.search);

            const { data } = await adminClient.get(`/orders?${params.toString()}`);

            return {
                orders: data.data || [],
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

// Update order status mutation
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status, note }: { id: string; status: OrderStatus; note?: string }) => {
            const { data } = await adminClient.put(`/orders/${id}/status`, { status, note });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
        },
    });
};
