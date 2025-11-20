import React from 'react';
import { products } from '@/lib/assets';
import ProductItem from './ProductItem';

interface RelatedProductsProps {
  category: string;
  subCategory: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  category, 
  subCategory 
}) => {
  
  const getRelated = () => {
    // We only filter by category to ensure we get enough related products
    let related = products.filter((item) => category === item.category && item.subCategory !== subCategory);
    return related.slice(0, 4); // Show 4 related items
  };

  const relatedProducts = getRelated();

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-gray-900">
          You Might Also Like
        </h2>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
        {relatedProducts.map((item, index) => (
          <ProductItem 
            key={index} 
            id={item._id} 
            image={item.image} 
            price={item.price} 
            name={item.name} 
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;