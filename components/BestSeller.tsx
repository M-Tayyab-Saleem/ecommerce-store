"use client";

import React from "react";
import ProductItem from "./ProductItem";
import SectionHeading from "./SectionHeading";

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
  slug?: string;
};

interface BestSellerProps {
  products: Product[];
}

const BestSeller: React.FC<BestSellerProps> = ({ products }) => {
  // Filter bestsellers and show up to 4
  const bestSellers = products.filter((item) => item.bestseller).slice(0, 4);

  if (bestSellers.length === 0) {
    // If no bestsellers, show first 4 products
    const fallbackProducts = products.slice(0, 4);
    return (
      <section className="section-sm">
        <SectionHeading
          label="Customer Favorites"
          title="Best Sellers"
          subtitle="The pieces everyone is loving right now"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {fallbackProducts.map((item: Product) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              price={item.price}
              name={item.name}
              slug={item.slug}
            />
          ))}
        </div>
      </section>
    );
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
        {bestSellers.map((item: Product) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.image}
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