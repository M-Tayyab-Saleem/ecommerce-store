"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { products, Product } from "@/lib/assets";

export type CartKey = string; 
export type CartItems = {
  [key: CartKey]: number;
};

export interface ShopContextType {
  products: Product[];
  currency: string;
  delivery_fee: number;
  search: string;
  setSearch: (search: string) => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  cartItems: CartItems;
  addToCart: (itemId: string, size: string) => void;
  removeFromCart: (itemId: string, size: string) => void;
  updateCartItemQuantity: (itemId: string, size: string, newQuantity: number) => void;
  getCartTotalAmount: () => number;
  getCartTotalItems: () => number;
  getProductQuantity: (itemId: string, size: string) => number;
}

export const ShopContext = createContext<ShopContextType | null>(null);

export const ShopContextProvider = (props: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItems>({});
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const currency = "$";
  const delivery_fee = 10.0;

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(cartItems).length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
        localStorage.removeItem("cartItems");
    }
  }, [cartItems]);

  const getCartKey = (itemId: string, size: string): CartKey => `${itemId}_${size}`;
  const getItemInfoFromKey = (key: CartKey) => {
    const [itemId, size] = key.split('_');
    return { itemId, size };
  };

  const addToCart = (itemId: string, size: string) => {
    const key = getCartKey(itemId, size);
    setCartItems((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string, size: string) => {
    const key = getCartKey(itemId, size);
    setCartItems((prev) => {
      const newCart = { ...prev };
      if (newCart[key] && newCart[key] > 0) {
        newCart[key] -= 1;
        if (newCart[key] === 0) {
          delete newCart[key];
        }
      }
      return newCart;
    });
  };

  const updateCartItemQuantity = (itemId: string, size: string, newQuantity: number) => {
    const key = getCartKey(itemId, size);
    setCartItems((prev) => {
      if (newQuantity <= 0) {
        const newCart = { ...prev };
        delete newCart[key];
        return newCart;
      }
      return { ...prev, [key]: newQuantity };
    });
  };

  const getProductQuantity = (itemId: string, size: string): number => {
    const key = getCartKey(itemId, size);
    return cartItems[key] || 0;
  };

  const getCartTotalAmount = () => {
    let totalAmount = 0;
    for (const key in cartItems) {
      const { itemId } = getItemInfoFromKey(key);
      const product = products.find((p) => p._id === itemId);
      if (product) {
        totalAmount += product.price * cartItems[key];
      }
    }
    return totalAmount;
  };

  const getCartTotalItems = () => {
    let totalItems = 0;
    for (const key in cartItems) {
      totalItems += cartItems[key];
    }
    return totalItems;
  };

  const value: ShopContextType = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartTotalAmount,
    getCartTotalItems,
    getProductQuantity
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;