import axiosInstance from './axios-instance';
import { ApiResponse, ICategory } from '@/types/product';

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<ApiResponse<ICategory[]>> {
    const response = await axiosInstance.get('/categories');
    return response.data;
}

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<ApiResponse<ICategory>> {
    const response = await axiosInstance.get(`/categories/slug/${slug}`);
    return response.data;
}

/**
 * Fetch a single category by ID
 */
export async function getCategoryById(id: string): Promise<ApiResponse<ICategory>> {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
}
