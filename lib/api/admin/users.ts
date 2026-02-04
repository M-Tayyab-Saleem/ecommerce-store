"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import adminClient from "./axios-instance";
import { IUser } from "@/models/User";

export interface UserWithStats extends IUser {
    orderStats?: {
        totalOrders: number;
        totalSpent: number;
    };
}

export interface UsersResponse {
    users: UserWithStats[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface UserFilters {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
}

// Fetch users with filters
export const useAdminUsers = (filters: UserFilters) => {
    return useQuery<UsersResponse>({
        queryKey: ["admin", "users", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append("page", filters.page.toString());
            if (filters.limit) params.append("limit", filters.limit.toString());
            if (filters.role && filters.role !== "all") params.append("role", filters.role);
            if (filters.search) params.append("search", filters.search);

            const { data } = await adminClient.get(`/users?${params.toString()}`);

            return {
                users: data.data || [],
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

// Update user role mutation
export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, role }: { userId: string; role: "user" | "admin" }) => {
            const { data } = await adminClient.put(`/users/${userId}`, { role });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
        },
    });
};
