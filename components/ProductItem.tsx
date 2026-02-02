"use client";

import React, { useContext, useState } from "react";
import { ShopContext, ShopContextType } from "@/context/ShopContext";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { formatPKR } from "@/utils/format";

interface ProductItemProps {
  id: string;
  image: string[];
  name: string;
  price: number;
  slug?: string;
  bestseller?: boolean;
  customizable?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({
  id,
  image,
  name,
  price,
  slug,
  bestseller = false,
  customizable = false,
}) => {
  const { addToCart } = useContext(ShopContext) as ShopContextType;
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const productUrl = slug ? `/products/${slug}` : `/product/${id}`;
  const imageUrl = image?.[0] || "/images/placeholder.jpg";
  const hoverImageUrl = image?.[1] || imageUrl;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id, "default");
  };

  return (
    <div className="product-card group">
      {/* Image Container */}
      <Link
        href={productUrl}
        className="relative block aspect-square overflow-hidden rounded-xl bg-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Main Image */}
        <Image
          src={isHovered && image?.length > 1 ? hoverImageUrl : imageUrl}
          alt={name}
          fill
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {bestseller && (
            <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              Best Seller
            </span>
          )}
          {customizable && (
            <span className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              Customizable
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-gray-900 font-medium py-2.5 rounded-lg shadow-md hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            <span className="text-sm">Add to Cart</span>
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3">
        <Link href={productUrl}>
          <h3 className="font-medium text-gray-900 truncate hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="font-bold text-gray-900">{formatPKR(price)}</span>
          {/* Handmade indicator */}
          <span className="text-xs text-gray-500 flex items-center gap-1">
            ✨ Handmade
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;