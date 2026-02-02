"use client"; // Must be a Client Component to use useContext

import React, { useContext } from 'react';
import { ShopContext, ShopContextType } from '@/context/ShopContext';
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from 'lucide-react';
import { formatPKR } from '@/utils/format';

// 1. Define the types for your component's props
interface ProductItemProps {
  id: string;
  image: string[];
  name: string;
  price: number;
  slug?: string; // Optional slug for SEO-friendly URLs
}

// 2. Use the Props interface and extract data from context
const ProductItem: React.FC<ProductItemProps> = ({ id, image, name, price, slug }) => {
  const context = useContext(ShopContext);

  if (!context) return null;

  // Use slug if available, otherwise fall back to ID
  const productUrl = slug ? `/products/${slug}` : `/product/${id}`;

  return (
    <Link href={productUrl} className='group block cursor-pointer bg-white rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.1)] overflow-hidden transition-transform duration-300 hover:-translate-y-1'>
      <div className='relative overflow-hidden bg-gray-100 aspect-[3/4]'>
        <Image
          src={image[0] || '/placeholder-product.jpg'}
          alt={`${name} - Handmade Resin Product`}
          fill
          className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out'
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay with Quick Action */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-white text-primary px-6 py-3 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-primary hover:text-white rounded-[5px]">
            <ShoppingBag size={16} />
            <span className="text-xs font-bold tracking-widest uppercase">View</span>
          </button>
        </div>

        {/* Handmade Badge */}
        <div className="absolute top-3 left-3 bg-primary px-2 py-1 text-[10px] font-bold tracking-widest uppercase text-white rounded-[3px]">
          Handmade
        </div>
      </div>

      <div className="p-4 space-y-1 text-center">
        <h3 className='font-medium text-lg tracking-wide truncate text-gray-800 group-hover:text-primary transition-colors'>{name}</h3>

        <div className="flex items-center justify-center gap-3">
          <p className='text-sm font-bold text-primary'>{formatPKR(price)}</p>
        </div>

        {/* COD indicator */}
        <p className="text-xs text-gray-500">COD Available</p>
      </div>
    </Link>
  )
}

export default ProductItem;