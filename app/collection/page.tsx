"use client"; // <--- THIS IS MANDATORY for interactivity

import React, { useContext, useEffect, useState } from "react";
import { ShopContext, ShopContextType } from "@/context/ShopContext"; // Updated import
import { assets } from "@/lib/assets";
import Title from "@/components/Title";
import ProductItem from "@/components/ProductItem";
import Image from "next/image"; // Optimized image

const Collection = () => {
  const context = useContext(ShopContext);

  // Guard clause for when context is not yet available
  if (!context) return <div className="py-10 border-t">Loading...</div>;

  const { products, search, showSearch } = context;

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState(products); // Initialize with all products
  const [category, setCategory] = useState<string[]>([]);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e: React.MouseEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (category.includes(value)) {
      setCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setCategory((prev) => [...prev, value]);
    }
  };

  const toggleSubCategory = (e: React.MouseEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (subCategory.includes(value)) {
      setSubCategory((prev) => prev.filter((item) => item !== value));
    } else {
      setSubCategory((prev) => [...prev, value]);
    }
  };
  useEffect(() => {
    // 1. Start with all products
    let productsCopy = products.slice();

    // 2. Apply search filter
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 3. Apply category filter
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // 4. Apply subCategory filter
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // 5. Apply sorting
    switch (sortType) {
      case "low-high":
        productsCopy.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        productsCopy.sort((a, b) => b.price - a.price);
        break;
      default:
        // "relevant" - no additional sort needed
        break;
    }

    // 6. Set the final state
    setFilterProducts(productsCopy);

  }, [category, subCategory, search, showSearch, sortType, products]); // Dependency array includes all filters

  return (
    <div className="container-custom flex flex-col sm:flex-row gap-1 sm:gap-10 pt-32 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          Filters
          <Image
            src={assets.dropdown_icon}
            alt="dropdown"
            className={`h-3 w-auto sm:hidden ${showFilter ? "rotate-90" : ""}`}
            width={16}
            height={16}
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"
            } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Men"}
                onClick={toggleCategory}
              />{" "}
              Men
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Women"}
                onClick={toggleCategory}
              />{" "}
              Women
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Kids"}
                onClick={toggleCategory}
              />{" "}
              Kids
            </p>
          </div>
        </div>
        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"
            } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Type</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Topwear"}
                onClick={toggleSubCategory}
              />{" "}
              Topwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Bottomwear"}
                onClick={toggleSubCategory}
              />{" "}
              Bottowmear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Winterwear"}
                onClick={toggleSubCategory}
              />{" "}
              Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Product Grid */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort By: Relevant</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High To Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              price={item.price}
              name={item.name}
            />
          ))}
        </div>
        {/* Handle No Results */}
        {filterProducts.length === 0 && (
          <div className="text-center col-span-full py-10">
            <p className="text-xl text-gray-600">No products found.</p>
            <p className="text-gray-500">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;