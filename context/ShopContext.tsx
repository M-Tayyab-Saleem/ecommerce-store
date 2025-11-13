"use client"; // Context Providers must be Client Components

import React, { createContext, useState, ReactNode } from "react";
// We'll assume you moved your assets to a 'lib' or 'assets' folder as discussed
import { products } from "@/public/assets/assets"; 
import { StaticImageData } from "next/image";

// 1. Define the Shape of a Product (Types!)
// This is the "MERN stack developer" part: defining your data schema.
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: StaticImageData[]; // Next.js images are objects, not just strings
  category: string;
  subCategory: string;
  sizes: string[];
  date: number;
  bestseller: boolean;
}

// 2. Define the Shape of the Context
interface ShopContextType {
  products: Product[];
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: (search: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}

// 3. Create the Context with a default value (usually null or dummy data)
export const ShopContext = createContext<ShopContextType | null>(null);

export const ShopContextProvider = (props: { children: ReactNode }) => {
  const currency = "PKR";
  const delivery_fee = 100;
  const [search, setSearch] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const value: ShopContextType = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;