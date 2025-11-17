"use client";

import React, { useEffect, useState } from "react";
import Title from "./Title";
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

interface BestSellerProps {
  products: Product[];
}

const BestSeller: React.FC<BestSellerProps> = ({ products }) => {
  const [bestSeller, setBestSeller] = useState<Product[]>([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
          obcaecati nihil quos dolores quo consequuntur!
        </p>
      </div>
      {/* Rendering BEST SELLERS */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
            bestSeller.map((item: Product) => (
                <ProductItem key={item._id} id={item._id} image={item.image} price={item.price} name={item.name} />
            ))
        }
      </div>
    </div>
  );
};

export default BestSeller;

