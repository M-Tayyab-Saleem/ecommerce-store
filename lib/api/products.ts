import axiosInstance from './axios-instance';
import { ApiResponse, IProduct, ProductsQueryParams } from '@/types/product';

/**
 * Fetch all products with optional filtering and pagination
 */
export async function getProducts(params?: ProductsQueryParams): Promise<ApiResponse<IProduct[]>> {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<ApiResponse<IProduct>> {
    const response = await axiosInstance.get(`/products/${slug}`); // Backend supports slug in [id] route
    return response.data;
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string): Promise<ApiResponse<IProduct>> {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
}

/**
 * Fetch products by category slug
 */
export async function getProductsByCategory(
    categorySlug: string,
    params?: ProductsQueryParams
): Promise<ApiResponse<IProduct[]>> {
    const response = await axiosInstance.get('/products', {
        params: { ...params, category: categorySlug },
    });
    return response.data;
}

/**
 * Search products
 */
export async function searchProducts(query: string, params?: ProductsQueryParams): Promise<ApiResponse<IProduct[]>> {
    const response = await axiosInstance.get('/products', {
        params: { ...params, search: query },
    });
    return response.data;
}
