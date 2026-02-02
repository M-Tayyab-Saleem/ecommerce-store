'use client';

import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import { IProduct } from '@/types/product';
import axiosInstance from '@/lib/api/axios-instance';
import { ApiResponse } from '@/types/product';

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ categoryId, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelatedProducts() {
      try {
        const response = await axiosInstance.get<ApiResponse<IProduct[]>>('/products', {
          params: {
            category: categoryId,
            limit: 5,
          },
        });

        if (response.data.success && response.data.data) {
          // Filter out current product
          const filtered = response.data.data
            .filter((product) => product._id !== currentProductId)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  if (loading) {
    return (
      <div className="my-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">You Might Also Like</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="my-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">You Might Also Like</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.images}
            price={item.price}
            name={item.name}
            slug={item.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;