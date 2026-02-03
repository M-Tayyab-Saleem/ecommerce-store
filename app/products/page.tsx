"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductItem from "@/components/ProductItem";
import SectionHeading from "@/components/SectionHeading";
import EmptyState from "@/components/EmptyState";
import { ChevronDown, X, SlidersHorizontal, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/api/axios-instance";
import { ApiResponse, IProduct, ICategory } from "@/types/product";

// Filter configurations for resin business
const priceFilters = [
    { value: "0-500", label: "Under PKR 500", min: 0, max: 500 },
    { value: "500-1000", label: "PKR 500 - 1,000", min: 500, max: 1000 },
    { value: "1000-2000", label: "PKR 1,000 - 2,000", min: 1000, max: 2000 },
    { value: "2000+", label: "Above PKR 2,000", min: 2000, max: Infinity },
];

const sortOptions = [
    { value: "createdAt-desc", label: "Newest First" },
    { value: "createdAt-asc", label: "Oldest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
];

const ProductsPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlCategorySlug = searchParams.get("category");

    // Data state
    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter state
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
    const [showBestsellers, setShowBestsellers] = useState(false);
    const [showCustomizable, setShowCustomizable] = useState(false);
    const [showInStock, setShowInStock] = useState(false);
    const [sortType, setSortType] = useState("createdAt-desc");
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 12;

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get<ApiResponse<ICategory[]>>("/categories");
                const fetchedCategories = response.data.data || [];
                setCategories(fetchedCategories);

                // If URL has category slug, find the matching category ID
                if (urlCategorySlug && fetchedCategories.length > 0) {
                    const matchingCategory = fetchedCategories.find(
                        (cat) => cat.slug === urlCategorySlug
                    );
                    if (matchingCategory) {
                        setSelectedCategory(matchingCategory._id);
                    }
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, [urlCategorySlug]);

    // Fetch products with filters
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [sortField, sortOrder] = sortType.split("-");

            // Build query params
            const params: Record<string, string | number | boolean> = {
                page,
                limit,
                sort: sortField,
                order: sortOrder,
            };

            // Add category filter
            if (selectedCategory) {
                params.category = selectedCategory;
            }

            // Add search
            if (searchQuery) {
                params.search = searchQuery;
            }

            // Add bestseller filter
            if (showBestsellers) {
                params.isBestSeller = true;
            }

            // Add price range filter (using min/max from first selected range)
            if (selectedPriceRanges.length > 0) {
                const priceRange = priceFilters.find((p) => p.value === selectedPriceRanges[0]);
                if (priceRange) {
                    params.minPrice = priceRange.min;
                    if (priceRange.max !== Infinity) {
                        params.maxPrice = priceRange.max;
                    }
                }
            }

            const response = await axiosInstance.get<ApiResponse<IProduct[]>>("/products", { params });

            setProducts(response.data.data || []);
            setTotal(response.data.metadata?.total || 0);
            setTotalPages(response.data.metadata?.totalPages || 1);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [page, sortType, selectedCategory, selectedPriceRanges, showBestsellers, searchQuery]);

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [selectedCategory, selectedPriceRanges, showBestsellers, showCustomizable, showInStock, sortType, searchQuery]);

    // Toggle functions
    const togglePriceRange = (value: string) => {
        setSelectedPriceRanges((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const clearAllFilters = () => {
        setSelectedCategory("");
        setSelectedPriceRanges([]);
        setShowBestsellers(false);
        setShowCustomizable(false);
        setShowInStock(false);
        setSortType("createdAt-desc");
        setSearchQuery("");
        // Clear URL params
        router.push("/products");
    };

    const hasActiveFilters =
        selectedCategory !== "" ||
        selectedPriceRanges.length > 0 ||
        showBestsellers ||
        showCustomizable ||
        showInStock ||
        searchQuery !== "";

    // Get current category name
    const currentCategoryName = selectedCategory
        ? categories.find((cat) => cat._id === selectedCategory)?.name
        : null;

    // Filter Section Component
    const FilterSection = ({ mobile = false }) => (
        <div className={`space-y-6 ${mobile ? "" : "filter-panel sticky top-24"}`}>
            {/* Search */}
            <div className="filter-group">
                <span className="filter-label">Search</span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Categories from API */}
            <div className="filter-group">
                <span className="filter-label">Category</span>
                <div className="space-y-2">
                    <label className="filter-checkbox">
                        <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === ""}
                            onChange={() => setSelectedCategory("")}
                            className="w-4 h-4 border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>All Categories</span>
                    </label>
                    {categories.map((category) => (
                        <label key={category._id} className="filter-checkbox">
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === category._id}
                                onChange={() => setSelectedCategory(category._id)}
                                className="w-4 h-4 border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>{category.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
                <span className="filter-label">Price Range</span>
                <div className="space-y-2">
                    {priceFilters.map((filter) => (
                        <label key={filter.value} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedPriceRanges.includes(filter.value)}
                                onChange={() => togglePriceRange(filter.value)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>{filter.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="filter-group">
                <span className="filter-label">Features</span>
                <div className="space-y-2">
                    <label className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={showBestsellers}
                            onChange={() => setShowBestsellers(!showBestsellers)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>Best Sellers</span>
                    </label>
                    <label className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={showCustomizable}
                            onChange={() => setShowCustomizable(!showCustomizable)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>Customizable</span>
                    </label>
                    <label className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={showInStock}
                            onChange={() => setShowInStock(!showInStock)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>In Stock</span>
                    </label>
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary hover:underline"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );

    return (
        <div className="container-custom pt-24 pb-16">
            {/* Header */}
            <div className="mb-8">
                <SectionHeading
                    label="Browse"
                    title={currentCategoryName || "Our Collection"}
                    subtitle="Discover handcrafted resin jewelry, keychains, and home décor"
                />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Filters Sidebar */}
                <aside className="hidden lg:block w-64 shrink-0">
                    <FilterSection />
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="lg:hidden flex items-center gap-2 btn-ghost"
                        >
                            <SlidersHorizontal size={18} />
                            <span>Filters</span>
                            {hasActiveFilters && (
                                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                                    {(selectedCategory ? 1 : 0) +
                                        selectedPriceRanges.length +
                                        (showBestsellers ? 1 : 0)}
                                </span>
                            )}
                        </button>

                        {/* Results Count */}
                        <p className="text-sm text-gray-600 hidden lg:block">
                            {total} products found
                        </p>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Active Filters Pills */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {currentCategoryName && (
                                <button
                                    onClick={() => setSelectedCategory("")}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                >
                                    {currentCategoryName}
                                    <X size={14} />
                                </button>
                            )}
                            {selectedPriceRanges.map((range) => (
                                <button
                                    key={range}
                                    onClick={() => togglePriceRange(range)}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                >
                                    {priceFilters.find((p) => p.value === range)?.label}
                                    <X size={14} />
                                </button>
                            ))}
                            {showBestsellers && (
                                <button
                                    onClick={() => setShowBestsellers(false)}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                >
                                    Best Sellers
                                    <X size={14} />
                                </button>
                            )}
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                >
                                    Search: {searchQuery}
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-2 text-gray-600">Loading products...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button onClick={fetchProducts} className="btn-primary">
                                Try Again
                            </button>
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            {/* Products Grid */}
                            <div className="product-grid">
                                {products.map((product) => (
                                    <ProductItem
                                        key={product._id}
                                        id={product._id}
                                        image={product.images}
                                        price={product.price}
                                        name={product.name}
                                        slug={product.slug}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2 text-gray-600">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}

                            {/* SEO Content Block */}
                            <div className="mt-16 border-t border-gray-200 pt-12">
                                <div className="max-w-4xl mx-auto prose prose-gray">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        {currentCategoryName
                                            ? `Handmade Resin ${currentCategoryName} in Pakistan`
                                            : "Premium Handmade Resin Products"}
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Discover our exquisite collection of handmade resin{" "}
                                        {currentCategoryName?.toLowerCase() || "products"} crafted
                                        with love in Pakistan. Each piece is unique, combining artistry
                                        with quality materials to create stunning accessories and decor
                                        items.
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
                                </div>
                            </div>
                        </>
                    ) : (
                        <EmptyState
                            type="products"
                            title="No products found"
                            message="Try adjusting your filters or search terms"
                            actionLabel="Clear Filters"
                            actionHref="/products"
                        />
                    )}
                </main>
            </div>

            {/* Mobile Filter Drawer */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden ${showMobileFilters ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={() => setShowMobileFilters(false)}
            />
            <div
                className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 transition-transform lg:hidden ${showMobileFilters ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <span className="text-lg font-semibold">Filters</span>
                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <FilterSection mobile />
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t flex gap-3">
                        <button
                            onClick={clearAllFilters}
                            className="btn-ghost flex-1 text-center"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={() => setShowMobileFilters(false)}
                            className="btn-primary flex-1 text-center"
                        >
                            Apply ({total})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
