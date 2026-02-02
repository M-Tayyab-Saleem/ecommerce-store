"use client";

import React from "react";
import ProductItem from "./ProductItem";
import SectionHeading from "./SectionHeading";
import Link from "next/link";

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

interface LatestCollectionProps {
  products: Product[];
}

const LatestCollection: React.FC<LatestCollectionProps> = ({ products }) => {
  // Show up to 8 products for a clean grid
  const displayProducts = products.slice(0, 8);

  return (
    <section className="section-sm">
      <SectionHeading
        label="New Arrivals"
        title="Latest Collection"
        subtitle="Explore our newest handcrafted resin pieces, fresh from the studio"
      />

      {/* Products Grid */}
      <div className="product-grid">
        {displayProducts.map((item: Product) => (
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

      {/* View All Button */}
      <div className="text-center mt-10">
        <Link href="/collection" className="btn-outline inline-block">
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default LatestCollection;