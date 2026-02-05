import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/services/product-service';
import { IProduct } from '@/types/product';
import { generateProductMetadata, generateProductJsonLd, generateBreadcrumbJsonLd } from '@/utils/seo';
import RelatedProducts from '@/components/RelatedProducts';
import ProductDetailsClient from '@/components/ProductDetailsClient';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const { slug } = await params;
        const product = await getProductBySlug(slug);

        if (!product) {
            return {
                title: 'Product Not Found',
            };
        }

        return generateProductMetadata(product as unknown as IProduct);
    } catch {
        return {
            title: 'Product Not Found',
        };
    }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const productData = await getProductBySlug(slug);

    if (!productData) {
        notFound();
    }

    const product = productData as unknown as IProduct;

    const categoryName = typeof product.category === 'object' ? product.category.name : '';
    const categorySlug = typeof product.category === 'object' ? product.category.slug : '';

    // Generate JSON-LD structured data
    const productJsonLd = generateProductJsonLd(product);
    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
        { name: categoryName, url: `/products?category=${categorySlug}` },
        { name: product.name, url: `/products/${product.slug}` },
    ]);

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <div className="container-custom py-10 border-t pt-20">
                {/* Breadcrumbs */}
                <nav className="mb-8 text-sm" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2 text-gray-600">
                        <li>
                            <Link href="/" className="hover:text-primary transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href="/products" className="hover:text-primary transition-colors">
                                Products
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link
                                href={`/products?category=${categorySlug}`}
                                className="hover:text-primary transition-colors"
                            >
                                {categoryName}
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium">{product.name}</li>
                    </ol>
                </nav>

                {/* Product Details - Client Component for Design Selection */}
                <ProductDetailsClient
                    product={product}
                    categoryName={categoryName}
                    categorySlug={categorySlug}
                />

                {/* Related Products */}
                <div className="mt-20">
                    <RelatedProducts
                        categoryId={typeof product.category === 'object' ? product.category._id : product.category}
                        currentProductId={product._id.toString()}
                    />
                </div>
            </div>
        </>
    );
}

