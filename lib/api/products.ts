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

/**
 * Fetch best seller products
 */
export async function getBestSellerProducts(limit: number = 5): Promise<ApiResponse<IProduct[]>> {
    const response = await axiosInstance.get('/products', {
        params: { isBestSeller: 'true', limit },
    });
    return response.data;
}

/**
 * Fetch latest products
 */
export async function getLatestProducts(limit: number = 10): Promise<ApiResponse<IProduct[]>> {
    const response = await axiosInstance.get('/products', {
        params: { isLatest: 'true', limit, sort: 'createdAt', order: 'desc' },
    });
    return response.data;
}

/**
 * Fetch products for homepage (bestsellers and latest combined)
 */
export async function getHomePageProducts(): Promise<{
    bestSellers: IProduct[];
    latestProducts: IProduct[];
}> {
    const [bestSellersRes, latestRes] = await Promise.all([
        getBestSellerProducts(5),
        getLatestProducts(10),
    ]);

    return {
        bestSellers: bestSellersRes.data || [],
        latestProducts: latestRes.data || [],
    };
}
