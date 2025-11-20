"use client";

import React, { useEffect, useState } from 'react';
import Title from './Title';
import ProductItem from './ProductItem';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  date: number;
  bestseller: boolean;
};

interface LatestCollectionProps {
  products: Product[];
}

const LatestCollection: React.FC<LatestCollectionProps> = ({ products }) => {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
   
  useEffect(() => {
    // Show top 8 products for a cleaner grid (4x2 or 2x4)
    setLatestProducts(products.slice(0, 8)); 
  }, [products]);

  return (
    <div className='my-16'>
        <div className='text-center'>
          <Title text1={"NEW IN"} text2={"LATEST COLLECTION"} />
          <p className='w-full m-auto text-sm text-gray-600 max-w-xl'>
          Explore our newest arrivals curated for style and quality. Find your perfect look today.
          </p>
        </div>
         {/* Rendering Products (4 columns desktop) */}
         <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10'>
            {
                latestProducts.map((item: Product) => (
                    <ProductItem key={item._id} id={item._id} image={item.image} price={item.price} name={item.name} />
                ))
            }
         </div>
         {/* Simple button link back to collection page */}
         <div className='text-center mt-10'>
             <a href="/collection" className="inline-block border border-black text-black py-3 px-8 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition">
                 View All Products
             </a>
         </div>
    </div>
  );
};

export default LatestCollection;