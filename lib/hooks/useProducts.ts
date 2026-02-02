import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getProducts, getProductBySlug, getProductById, getProductsByCategory } from '@/lib/api/products';
import { ApiResponse, IProduct, ProductsQueryParams } from '@/types/product';

/**
 * Hook to fetch all products with optional filters
 */
export function useProducts(params?: ProductsQueryParams): UseQueryResult<ApiResponse<IProduct[]>, Error> {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => getProducts(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook to fetch a single product by slug
 */
export function useProduct(slug: string): UseQueryResult<ApiResponse<IProduct>, Error> {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: () => getProductBySlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProductById(id: string): UseQueryResult<ApiResponse<IProduct>, Error> {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook to fetch products by category
 */
export function useProductsByCategory(
    categorySlug: string,
    params?: ProductsQueryParams
): UseQueryResult<ApiResponse<IProduct[]>, Error> {
    return useQuery({
        queryKey: ['products', 'category', categorySlug, params],
        queryFn: () => getProductsByCategory(categorySlug, params),
        enabled: !!categorySlug,
        staleTime: 1000 * 60 * 5,
    });
}
