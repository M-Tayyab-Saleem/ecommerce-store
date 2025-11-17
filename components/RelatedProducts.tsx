import React from 'react';
import { products } from '@/lib/assets';
import ProductItem from './ProductItem';
import Title from './Title';

// 1. Define its props
interface RelatedProductsProps {
  category: string;
  subCategory: string;
}

// 2. Make it an async function to fetch its own data
const RelatedProducts: React.FC<RelatedProductsProps> = async ({ 
  category, 
  subCategory 
}) => {
  
  // 3. All logic runs on the server!
  const getRelated = () => {
    let related = products.filter((item) => category === item.category);
    related = related.filter((item) => subCategory === item.subCategory);
    return related.slice(0, 5); // Show 5 related items
  };

  const relatedProducts = getRelated();

  if (relatedProducts.length === 0) {
    return null; // Don't show anything if no related products
  }

  // 4. Render the final JSX
  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
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