import { MetadataRoute } from 'next';
import axiosInstance from '@/lib/api/axios-instance';
import { ApiResponse, IProduct, ICategory } from '@/types/product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://epoxysista.com';

    // Fetch products for sitemap
    let products: IProduct[] = [];
    let categories: ICategory[] = [];

    try {
        const productsResponse = await axiosInstance.get<ApiResponse<IProduct[]>>('/products', {
            params: { limit: 1000 }, // Get all products
        });
        products = productsResponse.data.data || [];

        const categoriesResponse = await axiosInstance.get<ApiResponse<ICategory[]>>('/categories');
        categories = categoriesResponse.data.data || [];
    } catch (error) {
        console.error('Error fetching sitemap data:', error);
    }

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/collection`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/shipping-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/refund-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // Product pages
    const productPages: MetadataRoute.Sitemap = products
        .filter((product) => product.isActive && !product.isDeleted)
        .map((product) => ({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: new Date(product.updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

    // Category pages
    const categoryPages: MetadataRoute.Sitemap = categories
        .filter((category) => category.isActive)
        .map((category) => ({
            url: `${baseUrl}/products?category=${category.slug}`,
            lastModified: new Date(category.updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

    return [...staticPages, ...productPages, ...categoryPages];
}
