"use client";

import React from "react";
import ProductItem from "./ProductItem";
import SectionHeading from "./SectionHeading";
import Link from "next/link";
import { IProduct } from "@/types/product";

interface LatestCollectionProps {
  products: IProduct[];
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
        {displayProducts.map((item: IProduct) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={item.images}
            price={item.price}
            name={item.name}
            slug={item.slug}
            variants={item.variants}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-10">
        <Link href="/products" className="btn-outline inline-block">
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default LatestCollection;