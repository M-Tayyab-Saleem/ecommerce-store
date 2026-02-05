"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import axiosInstance from "@/lib/api/axios-instance";
import { IProduct, ApiResponse } from "@/types/product";

export type CartKey = string;
export type CartItems = {
  [key: CartKey]: number;
};

export interface ShopContextType {
  products: IProduct[];
  productsLoading: boolean;
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
  clearCart: () => void;
}

export const ShopContext = createContext<ShopContextType | null>(null);

export const ShopContextProvider = (props: { children: ReactNode }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItems>({});
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const currency = "PKR";
  const delivery_fee = 200;

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await axiosInstance.get<ApiResponse<IProduct[]>>("/products", {
          params: {
            limit: 1000, // Get all products for cart functionality
            isActive: true,
          },
        });
        if (response.data.success && response.data.data) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (Object.keys(cartItems).length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems");
    }
  }, [cartItems]);

  // Sanitize cart: remove items that are no longer in the product list (e.g., deleted or inactive)
  useEffect(() => {
    if (!productsLoading && products.length > 0) {
      setCartItems((prevCart) => {
        const newCart = { ...prevCart };
        let hasChanges = false;

        Object.keys(newCart).forEach((key) => {
          const parts = key.split('_');
          const itemId = parts[0];
          const exists = products.find((p) => p._id === itemId);

          if (!exists) {
            delete newCart[key];
            hasChanges = true;
          }
        });

        return hasChanges ? newCart : prevCart;
      });
    }
  }, [productsLoading, products]);

  const getCartKey = (itemId: string, size: string): CartKey => `${itemId}_${size}`;
  // Get item info from cart key (productId_designName)
  const getItemInfoFromKey = (key: CartKey) => {
    const parts = key.split('_');
    const itemId = parts[0];
    // Join remaining parts in case designName contains underscore
    const designName = parts.slice(1).join('_') || 'default';
    return { itemId, designName };
  };

  const addToCart = (itemId: string, designName: string = 'default') => {
    const key = getCartKey(itemId, designName);
    setCartItems((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string, designName: string) => {
    const key = getCartKey(itemId, designName);
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

  const updateCartItemQuantity = (itemId: string, designName: string, newQuantity: number) => {
    const key = getCartKey(itemId, designName);
    setCartItems((prev) => {
      if (newQuantity <= 0) {
        const newCart = { ...prev };
        delete newCart[key];
        return newCart;
      }
      return { ...prev, [key]: newQuantity };
    });
  };

  const getProductQuantity = (itemId: string, designName: string): number => {
    const key = getCartKey(itemId, designName);
    return cartItems[key] || 0;
  };

  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cartItems");
  };

  // Calculate cart total with design-specific pricing support
  const getCartTotalAmount = () => {
    let totalAmount = 0;
    for (const key in cartItems) {
      const { itemId, designName } = getItemInfoFromKey(key);
      const product = products.find((p) => p._id === itemId);
      if (product) {
        // Check for design-specific price
        let price = product.price;
        if (product.variants && product.variants.length > 0 && designName !== 'default') {
          const variant = product.variants.find((v) => v.designName === designName);
          if (variant && variant.price && variant.price > 0) {
            price = variant.price;
          }
        }
        totalAmount += price * cartItems[key];
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
    productsLoading,
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
    getProductQuantity,
    clearCart
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;