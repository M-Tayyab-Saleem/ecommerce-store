import { Metadata } from 'next';
import Link from 'next/link';
import axiosInstance from '@/lib/api/axios-instance';
import { ApiResponse, IProduct, ICategory } from '@/types/product';
import ProductItem from '@/components/ProductItem';
import { formatPKR } from '@/utils/format';

// Generate metadata for SEO
export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
    const params = await searchParams;
    const categorySlug = params.category;

    if (categorySlug) {
        try {
            // Fetch category details for metadata
            const categoriesResponse = await axiosInstance.get<ApiResponse<ICategory[]>>('/categories');
            const category = categoriesResponse.data.data?.find((cat) => cat.slug === categorySlug);

            if (category) {
                const title = `${category.name} | Handmade Resin Products in Pakistan`;
                const description = category.description || `Browse our collection of handmade resin ${category.name.toLowerCase()} in Pakistan. Premium quality, custom designs available, Cash on Delivery.`;

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
                        type: 'website',
                    },
                };
            }
        } catch (error) {
            console.error('Error generating category metadata:', error);
        }
    }

    return {
        title: 'All Products | Handmade Resin Jewelry & Decor',
        description: 'Shop our complete collection of handmade resin jewelry, keychains & home decor in Pakistan. COD available.',
        keywords: ['handmade resin products', 'resin jewelry Pakistan', 'resin decor', 'COD Pakistan'],
    };
}

// Fetch products with optional category filter
async function getProducts(categorySlug?: string): Promise<{
    products: IProduct[];
    categories: ICategory[];
}> {
    try {
        // Fetch categories first
        const categoriesResponse = await axiosInstance.get<ApiResponse<ICategory[]>>('/categories');
        const categories = categoriesResponse.data.data || [];

        // Find category ID if slug provided
        let categoryId: string | undefined;
        if (categorySlug) {
            const category = categories.find((cat) => cat.slug === categorySlug);
            categoryId = category?._id;
        }

        // Fetch products
        const productsResponse = await axiosInstance.get<ApiResponse<IProduct[]>>('/products', {
            params: {
                category: categoryId,
                limit: 100,
            },
        });

        return {
            products: productsResponse.data.data || [],
            categories,
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { products: [], categories: [] };
    }
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const params = await searchParams;
    const categorySlug = params.category;

    const { products, categories } = await getProducts(categorySlug);

    const currentCategory = categorySlug
        ? categories.find((cat) => cat.slug === categorySlug)
        : null;

    return (
        <div className="container-custom py-10 border-t pt-20">
            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {currentCategory ? currentCategory.name : 'All Products'}
                </h1>
                {currentCategory?.description && (
                    <p className="text-gray-600 max-w-2xl mx-auto">{currentCategory.description}</p>
                )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
                <Link
                    href="/products"
                    className={`px-4 py-2 rounded-full transition-colors ${!categorySlug
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    All Products
                </Link>
                {categories.map((category) => (
                    <Link
                        key={category._id}
                        href={`/products?category=${category.slug}`}
                        className={`px-4 py-2 rounded-full transition-colors ${categorySlug === category.slug
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {category.name}
                    </Link>
                ))}
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8">
                        {products.map((product) => (
                            <ProductItem
                                key={product._id}
                                id={product._id}
                                name={product.name}
                                price={product.price}
                                image={product.images}
                                slug={product.slug}
                            />
                        ))}
                    </div>

                    {/* SEO Content Block */}
                    <div className="mt-16 border-t border-gray-200 pt-12">
                        <div className="max-w-4xl mx-auto prose prose-gray">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {currentCategory
                                    ? `Handmade Resin ${currentCategory.name} in Pakistan`
                                    : 'Premium Handmade Resin Products'}
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Discover our exquisite collection of handmade resin {currentCategory?.name.toLowerCase() || 'products'} crafted with love in Pakistan. Each piece is unique, combining artistry with quality materials to create stunning accessories and decor items.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Why Choose Our Resin Products?</strong>
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>100% Handmade with attention to detail</li>
                                <li>Premium quality resin and materials</li>
                                <li>Customization available for most items</li>
                                <li>Cash on Delivery (COD) all over Pakistan</li>
                                <li>Free delivery on orders over PKR 3,000</li>
                                <li>Ships within 3-5 business days</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Each handmade resin piece may have slight variations in color and pattern, making your item truly one-of-a-kind. We ship nationwide across Pakistan with secure packaging to ensure your products arrive in perfect condition.
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-20">
                    <p className="text-2xl text-gray-600 mb-4">No products found</p>
                    <p className="text-gray-500 mb-8">
                        {currentCategory
                            ? `There are currently no products in the ${currentCategory.name} category.`
                            : 'Please check back later for new arrivals.'}
                    </p>
                    <Link href="/" className="btn-primary">
                        Back to Home
                    </Link>
                </div>
            )}
        </div>
    );
}
