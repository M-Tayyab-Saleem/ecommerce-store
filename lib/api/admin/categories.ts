"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminClient from "./axios-instance";
import { ICategory } from "@/models/Category";

export interface CategoryWithCount extends ICategory {
    productCount?: number;
}

export interface CategoriesResponse {
    categories: CategoryWithCount[];
}

export interface CategoryFilters {
    includeInactive?: boolean;
}

// Fetch all categories with optional filters
export const useAdminCategories = (filters: CategoryFilters = {}) => {
    return useQuery<CategoryWithCount[]>({
        queryKey: ["admin", "categories", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.includeInactive) params.append("includeInactive", "true");

            const { data } = await adminClient.get(`/categories?${params.toString()}`);
            return data.data || [];
        },
    });
};

// Create category mutation
export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (categoryData: { name: string; description?: string; image?: string; isActive?: boolean }) => {
            const { data } = await adminClient.post("/categories", categoryData);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

// Update category mutation
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...categoryData }: { id: string; name?: string; description?: string; image?: string; isActive?: boolean }) => {
            const { data } = await adminClient.put(`/categories/${id}`, categoryData);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

// Delete category mutation
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await adminClient.delete(`/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};
