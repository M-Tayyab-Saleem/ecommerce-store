"use client";

import React from "react";
import ProductItem from "./ProductItem";
import SectionHeading from "./SectionHeading";
import { IProduct } from "@/types/product";

interface BestSellerProps {
  products: IProduct[];
}

const BestSeller: React.FC<BestSellerProps> = ({ products }) => {
  // Filter bestsellers and show up to 4 (products passed are already bestsellers from API)
  const bestSellers = products.slice(0, 4);

  if (bestSellers.length === 0) {
    return null; // Don't render section if no products
  }

  return (
    <section className="section-sm">
      <SectionHeading
        label="Customer Favorites"
        title="Best Sellers"
        subtitle="The pieces everyone is loving right now"
      />

      {/* Products Grid - 4 columns on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {bestSellers.map((item: IProduct) => (
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
    </section>
  );
};

export default BestSeller;
