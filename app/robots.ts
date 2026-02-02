import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://epoxysista.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',
                    '/api',
                    '/cart',
                    '/checkout',
                    '/my-orders',
                    '/order-place',
                    '/login',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
