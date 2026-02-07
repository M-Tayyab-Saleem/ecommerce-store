"use client";

import React from "react";
import CategoryCard from "./CategoryCard";
import SectionHeading from "./SectionHeading";

interface Category {
    name: string;
    image: string;
    href: string;
    productCount?: number;
}

interface CategoryGridProps {
    categories?: Category[];
    className?: string;
}

const defaultCategories: Category[] = [
    {
        name: "Jewelry",
        image: "/images/category-jewelry.png",
        href: "/products?category=jewelry",
        productCount: 24,
    },
    {
        name: "Keychains",
        image: "/images/category-keychains.png",
        href: "/products?category=keychains",
        productCount: 18,
    },
    {
        name: "Home Décor",
        image: "/images/category-decor.jpeg",
        href: "/products?category=home-decor",
        productCount: 12,
    },
    {
        name: "Custom Orders",
        image: "/images/category-custom.png",
        href: "/contact",
    },
];

const CategoryGrid: React.FC<CategoryGridProps> = ({
    categories = defaultCategories,
    className = "",
}) => {
    return (
        <section className={`section-sm ${className}`}>
            <SectionHeading
                label="Browse by Category"
                title="Shop Our Collections"
                subtitle="Discover handcrafted resin pieces for every occasion"
            />
            <div className="category-grid">
                {categories.map((category) => (
                    <CategoryCard
                        key={category.name}
                        title={category.name}
                        image={category.image}
                        href={category.href}
                        productCount={category.productCount}
                    />
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
