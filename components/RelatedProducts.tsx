"use client";

import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

interface RelatedProductsProps {
  category: string;
  subCategory: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ category, subCategory }) => {
  const context = useContext(ShopContext);
  
  if (!context) {
    throw new Error('RelatedProducts must be used within ShopContextProvider');
  }
  
  const { products } = context;
  const [related, setRelated] = useState<typeof products>([]);
     
  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
      setRelated(productsCopy);
    }
  }, [products, category, subCategory]);

  return (
    <div>

    </div>
  );
};

export default RelatedProducts;

