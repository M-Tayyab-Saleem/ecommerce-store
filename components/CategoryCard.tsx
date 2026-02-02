"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
    title: string;
    image: string;
    href: string;
    productCount?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    title,
    image,
    href,
    productCount,
}) => {
    return (
        <Link
            href={href}
            className="group relative overflow-hidden rounded-2xl aspect-square block"
        >
            {/* Background Image */}
            <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-1">{title}</h3>
                {productCount !== undefined && (
                    <p className="text-sm text-white/80">{productCount} Products</p>
                )}
                <span className="mt-3 text-sm font-medium px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Shop Now →
                </span>
            </div>
        </Link>
    );
};

export default CategoryCard;
