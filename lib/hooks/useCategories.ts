import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getCategories, getCategoryBySlug, getCategoryById } from '@/lib/api/categories';
import { ApiResponse, ICategory } from '@/types/product';

/**
 * Hook to fetch all categories
 */
export function useCategories(): UseQueryResult<ApiResponse<ICategory[]>, Error> {
    return useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 10, // 10 minutes - categories don't change often
    });
}

/**
 * Hook to fetch a single category by slug
 */
export function useCategory(slug: string): UseQueryResult<ApiResponse<ICategory>, Error> {
    return useQuery({
        queryKey: ['category', slug],
        queryFn: () => getCategoryBySlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 10,
    });
}

/**
 * Hook to fetch a single category by ID
 */
export function useCategoryById(id: string): UseQueryResult<ApiResponse<ICategory>, Error> {
    return useQuery({
        queryKey: ['category', id],
        queryFn: () => getCategoryById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10,
    });
}
