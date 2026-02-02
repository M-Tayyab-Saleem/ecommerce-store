import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axiosInstance from '@/lib/api/axios-instance';
import { ApiResponse, IProduct } from '@/types/product';
import { generateProductMetadata, generateProductJsonLd, generateBreadcrumbJsonLd } from '@/utils/seo';
import { formatPKR } from '@/utils/format';
import RelatedProducts from '@/components/RelatedProducts';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const { slug } = await params;
        const response = await axiosInstance.get<ApiResponse<IProduct>>(`/products/slug/${slug}`);

        if (!response.data.success || !response.data.data) {
            return {
                title: 'Product Not Found',
            };
        }

        return generateProductMetadata(response.data.data);
    } catch (error) {
        return {
            title: 'Product Not Found',
        };
    }
}

// Fetch product data
async function getProduct(slug: string): Promise<IProduct | null> {
    try {
        const response = await axiosInstance.get<ApiResponse<IProduct>>(`/products/${slug}`);
        return response.data.success && response.data.data ? response.data.data : null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

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

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {product.images.length > 0 ? (
                            <>
                                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                    <Image
                                        src={product.images[0]}
                                        alt={`${product.name} - Handmade Resin ${categoryName}`}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                                {product.images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {product.images.slice(1).map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`${product.name} - View ${index + 2}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 25vw, 12.5vw"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No image available</span>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            {/* Category Tag */}
                            <Link
                                href={`/products?category=${categorySlug}`}
                                className="inline-block text-sm text-primary font-medium hover:underline mb-2"
                            >
                                {categoryName}
                            </Link>

                            {/* Product Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="flex items-baseline gap-4 mb-6">
                                <span className="text-3xl font-bold text-gray-900">
                                    {formatPKR(product.price)}
                                </span>
                                {product.stock > 0 ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* COD Badge */}
                            <div className="mb-6">
                                <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
                                    💰 Cash on Delivery Available
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Customization */}
                        {product.customizable && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-blue-900 mb-1">
                                    ✨ Customization Available
                                </h3>
                                <p className="text-sm text-blue-800">
                                    {product.customizationNote || 'This product can be customized to your preferences.'}
                                </p>
                            </div>
                        )}

                        {/* Color Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Available Colors</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((variant, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded-full"
                                        >
                                            {variant.color} {variant.stock > 0 ? '' : '(Out of Stock)'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Handmade Disclaimer */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h3 className="text-sm font-semibold text-amber-900 mb-1">🎨 Handmade Product</h3>
                            <p className="text-sm text-amber-800">{product.handmadeDisclaimer}</p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-3 pt-4">
                            <button className="btn-primary w-full py-4 text-lg">
                                Add to Cart
                            </button>
                            <Link href="/contact" className="btn-outline w-full block text-center py-4">
                                Contact for Custom Order
                            </Link>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t border-gray-200 pt-6 space-y-2 text-sm text-gray-600">
                            <p>🚚 Free delivery on orders over PKR 3,000</p>
                            <p>📦 Ships within 3-5 business days</p>
                            <p>🇵🇰 Delivery all over Pakistan</p>
                        </div>
                    </div>
                </div>

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
