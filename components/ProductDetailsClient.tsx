"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { IProduct, IVariant } from "@/types/product";
import { formatPKR } from "@/utils/format";
import AddToCartButton from "@/components/AddToCartButton";

interface ProductDetailsClientProps {
    product: IProduct;
    categoryName: string;
    categorySlug: string;
}

export default function ProductDetailsClient({
    product,
    categoryName,
    categorySlug,
}: ProductDetailsClientProps) {
    const hasVariants = product.variants && product.variants.length > 0;

    // Selected design state (default to -1 to show main product details)
    const [selectedDesignIndex, setSelectedDesignIndex] = useState<number>(-1);

    // Get current design variant (if any)
    const selectedVariant: IVariant | null = useMemo(() => {
        if (!hasVariants || selectedDesignIndex < 0) return null;
        return product.variants[selectedDesignIndex];
    }, [hasVariants, selectedDesignIndex, product.variants]);

    // Determine images to display (design-specific or product-level)
    const displayImages = useMemo(() => {
        if (selectedVariant && selectedVariant.images && selectedVariant.images.length > 0) {
            return selectedVariant.images;
        }
        return product.images || [];
    }, [selectedVariant, product.images]);

    // Determine price to display (design-specific or product-level)
    const displayPrice = useMemo(() => {
        if (selectedVariant && selectedVariant.price !== undefined && selectedVariant.price > 0) {
            return selectedVariant.price;
        }
        return product.price;
    }, [selectedVariant, product.price]);

    // Determine stock status for selected design
    const selectedStock = useMemo(() => {
        if (selectedVariant) {
            return selectedVariant.stock;
        }
        return product.stock;
    }, [selectedVariant, product.stock]);

    const isOutOfStock = selectedStock === 0;

    // Image gallery state
    const [mainImageIndex, setMainImageIndex] = useState(0);

    // Reset main image when design changes
    React.useEffect(() => {
        setMainImageIndex(0);
    }, [selectedDesignIndex]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
                {displayImages.length > 0 ? (
                    <>
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <Image
                                src={displayImages[mainImageIndex] || displayImages[0]}
                                alt={`${product.name} - ${selectedVariant?.designName || 'Main Image'}`}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        {displayImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {displayImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMainImageIndex(index)}
                                        className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 ${mainImageIndex === index
                                            ? "ring-2 ring-primary ring-offset-2"
                                            : "hover:opacity-80"
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} - View ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 25vw, 12.5vw"
                                        />
                                    </button>
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
                            {formatPKR(displayPrice)}
                        </span>
                        {isOutOfStock ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                Out of Stock
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                In Stock ({selectedStock} available)
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
                            {product.customizationNote ||
                                "This product can be customized to your preferences."}
                        </p>
                    </div>
                )}

                {/* Design Variants Selector */}
                {hasVariants && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Select Design
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {/* Main/Default Option */}
                            <button
                                onClick={() => setSelectedDesignIndex(-1)}
                                className={`relative p-3 border-2 rounded-xl transition-all ${selectedDesignIndex === -1
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-primary/50"
                                    }`}
                            >
                                <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                                    <Image
                                        src={product.images?.[0] || "/images/placeholder.jpg"}
                                        alt="Main Design"
                                        fill
                                        className="object-cover"
                                        sizes="150px"
                                    />
                                </div>
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    Main Design
                                </p>
                                {selectedDesignIndex === -1 && (
                                    <span className="absolute top-2 left-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">
                                        ✓
                                    </span>
                                )}
                            </button>

                            {product.variants.map((variant, index) => {
                                const isSelected = selectedDesignIndex === index;
                                const variantOutOfStock = variant.stock === 0;
                                const thumbnailImage = variant.images?.[0] || product.images?.[0];

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDesignIndex(index)}
                                        disabled={variantOutOfStock}
                                        className={`relative p-3 border-2 rounded-xl transition-all ${isSelected
                                            ? "border-primary bg-primary/5"
                                            : variantOutOfStock
                                                ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                                                : "border-gray-200 hover:border-primary/50"
                                            }`}
                                    >
                                        {thumbnailImage && (
                                            <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                                                <Image
                                                    src={thumbnailImage}
                                                    alt={variant.designName}
                                                    fill
                                                    className="object-cover"
                                                    sizes="150px"
                                                />
                                            </div>
                                        )}
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {variant.designName}
                                        </p>
                                        {variant.price !== undefined && variant.price > 0 && variant.price !== product.price && (
                                            <p className="text-xs text-primary font-medium">
                                                {formatPKR(variant.price)}
                                            </p>
                                        )}
                                        {variantOutOfStock && (
                                            <span className="absolute top-2 right-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                                Sold Out
                                            </span>
                                        )}
                                        {isSelected && (
                                            <span className="absolute top-2 left-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs">
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Handmade Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-amber-900 mb-1">
                        🎨 Handmade Product
                    </h3>
                    <p className="text-sm text-amber-800">{product.handmadeDisclaimer}</p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 pt-4">
                    <AddToCartButton
                        productId={product._id.toString()}
                        selectedDesign={selectedVariant?.designName}
                        disabled={isOutOfStock}
                    />
                    <Link
                        href="/contact"
                        className="btn-outline w-full block text-center py-4"
                    >
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
    );
}
