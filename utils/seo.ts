import { Metadata } from 'next';
import { IProduct, ICategory } from '@/types/product';

const SITE_NAME = 'EpoxySista';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://epoxysista.com';
const SITE_DESCRIPTION = 'Shop premium handmade resin jewelry, keychains & home decor in Pakistan. Custom orders available. Cash on Delivery all over Pakistan.';

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(product: IProduct): Metadata {
    const productName = product.name;
    const categoryName = typeof product.category === 'object' ? product.category.name : '';

    const title = `${productName} | Handmade Resin ${categoryName} in Pakistan`;
    const description = `Buy ${productName}, handmade resin ${categoryName.toLowerCase()} in Pakistan. ${product.description.slice(0, 100)}... Customizable designs, premium quality, Cash on Delivery available.`;

    const imageUrl = product.images[0] || `${SITE_URL}/og-image.jpg`;
    const productUrl = `${SITE_URL}/products/${product.slug}`;

    return {
        title,
        description,
        keywords: [
            'handmade resin jewelry Pakistan',
            'resin',
            categoryName.toLowerCase(),
            productName,
            'custom resin',
            'COD Pakistan',
            'handmade jewelry',
        ].join(', '),
        openGraph: {
            title,
            description,
            url: productUrl,
            siteName: SITE_NAME,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: productName,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: productUrl,
        },
        robots: {
            index: product.isActive && !product.isDeleted,
            follow: true,
        },
    };
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(category: ICategory): Metadata {
    const title = `${category.name} | Handmade Resin Products in Pakistan`;
    const description = category.description || `Browse our collection of handmade resin ${category.name.toLowerCase()} in Pakistan. Premium quality, custom designs available, Cash on Delivery.`;

    const imageUrl = category.image || `${SITE_URL}/og-image.jpg`;
    const categoryUrl = `${SITE_URL}/products?category=${category.slug}`;

    return {
        title,
        description,
        keywords: [
            `handmade resin ${category.name.toLowerCase()}`,
            'resin products Pakistan',
            category.name.toLowerCase(),
            'custom resin',
            'COD Pakistan',
        ].join(', '),
        openGraph: {
            title,
            description,
            url: categoryUrl,
            siteName: SITE_NAME,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: category.name,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: categoryUrl,
        },
    };
}

/**
 * Generate JSON-LD structured data for products
 */
export function generateProductJsonLd(product: IProduct) {
    const categoryName = typeof product.category === 'object' ? product.category.name : '';

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images,
        brand: {
            '@type': 'Brand',
            name: SITE_NAME,
        },
        category: categoryName,
        offers: {
            '@type': 'Offer',
            url: `${SITE_URL}/products/${product.slug}`,
            priceCurrency: 'PKR',
            price: product.price,
            availability: product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
            seller: {
                '@type': 'Organization',
                name: SITE_NAME,
            },
        },
    };
}

/**
 * Generate JSON-LD breadcrumb data
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_URL}${item.url}`,
        })),
    };
}

/**
 * Generate JSON-LD organization data
 */
export function generateOrganizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description: SITE_DESCRIPTION,
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'PK',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            areaServed: 'PK',
        },
    };
}
