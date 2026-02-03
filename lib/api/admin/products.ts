import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import adminClient from "./axios-instance";
import { IProduct } from "@/models/Product";

export interface ProductsResponse {
    products: IProduct[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalProducts: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    stockStatus?: string;
    isActive?: string; // "true" | "false" | ""
}

export const useAdminProducts = (filters: ProductFilters) => {
    return useQuery<ProductsResponse>({
        queryKey: ["admin", "products", filters],
        queryFn: async () => {
            // Build query string
            const params = new URLSearchParams();
            if (filters.page) params.append("page", filters.page.toString());
            if (filters.limit) params.append("limit", filters.limit.toString());
            if (filters.search) params.append("search", filters.search);
            if (filters.category) params.append("category", filters.category);
            if (filters.stockStatus && filters.stockStatus !== "all") params.append("stockStatus", filters.stockStatus);
            if (filters.isActive && filters.isActive !== "all") params.append("isActive", filters.isActive);

            const { data } = await adminClient.get(`/admin/products?${params.toString()}`);
            return data.data; // Assuming API returns { success: true, data: { products: [], pagination: {} } }
        },
        placeholderData: keepPreviousData,
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await adminClient.delete(`/admin/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        },
    });
};
