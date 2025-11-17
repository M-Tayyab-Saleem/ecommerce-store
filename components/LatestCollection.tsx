"use client";

import React, { useEffect, useState } from 'react';
import Title from './Title';
import ProductItem from './ProductItem';
import { StaticImageData } from 'next/image';

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
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className='my-10'>
        <div className='text-center py-8 text-2xl'>
          <Title text1={"LATEST"} text2={"COLLECTION"} />
          <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum obcaecati nihil quos dolores quo consequuntur!</p>
        </div>
         {/* Rendering Products */}
         <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                latestProducts.map((item: Product) => (
                    <ProductItem key={item._id} id={item._id} image={item.image} price={item.price} name={item.name} />
                ))
            }
         </div>
    </div>
  );
};

export default LatestCollection;

