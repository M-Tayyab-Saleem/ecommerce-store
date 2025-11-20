"use client";

import React, { useEffect, useState } from "react";
import Title from "./Title";
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

interface BestSellerProps {
  products: Product[];
}

const BestSeller: React.FC<BestSellerProps> = ({ products }) => {
  const [bestSeller, setBestSeller] = useState<Product[]>([]);

  useEffect(() => {
    // Show 4 best sellers
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 4)); 
  }, [products]);

  return (
    <div className="my-16">
      <div className="text-center">
        <Title text1={"TOP PICKS"} text2={"BEST SELLERS"} />
        <p className="w-full m-auto text-sm text-gray-600 max-w-xl">
          The pieces everyone is loving right now. Shop the items selling fast!
        </p>
      </div>
      {/* Rendering BEST SELLERS (4 columns desktop) */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-10'>
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