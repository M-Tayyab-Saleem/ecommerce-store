import React, { useContext } from 'react';
import { ShopContext } from '@/context/ShopContext';
import Link from "next/link"; // IMPORTANT: Import from next/link
import Image from "next/image"; // We'll also upgrade the <img> tag

// 1. Define the types for your component's props
interface ProductItemProps {
  id: string;
  image: string[]; // Based on your assets.js, 'image' is an array of string paths
  name: string;
  price: number;
}

// 2. Use the Props interface
const ProductItem: React.FC<ProductItemProps> = ({ id, image, name, price }) => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('ProductItem must be used within ShopContextProvider');
  }
  const { currency } = context;

  return (
    // 3. Use next/link. Notice 'href' instead of 'to'
    <Link href={`/product/${id}`} className='text-gray-700 cursor-pointer'>
      <div className='overflow-hidden'>
        {/* 4. Use the Next.js Image component for optimization! */}
        <Image 
          src={image[0]} 
          alt={name} // Always add descriptive alt text
          width={500} // You need to provide width and height
          height={500}
          className='hover:scale-110 transition ease-in-out'
        />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency} {price}</p>
    </Link>
  )
}

export default ProductItem;