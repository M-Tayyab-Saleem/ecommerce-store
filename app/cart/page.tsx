"use client";

import React, { useContext } from "react";
import { ShopContext, ShopContextType, CartKey } from "@/context/ShopContext";
import { assets } from "@/lib/assets";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

// Helper function to extract info from the composite key
const getItemInfoFromKey = (key: CartKey) => {
    const parts = key.split('_');
    return { 
        itemId: parts[0], 
        size: parts.length > 1 ? parts[1] : 'N/A' 
    };
};

const Cart = () => {
  const {
    products,
    cartItems,
    updateCartItemQuantity,
    getCartTotalAmount,
    currency,
    delivery_fee,
  } = useContext(ShopContext) as ShopContextType;

  const totalAmount = getCartTotalAmount();
  const cartKeys = Object.keys(cartItems);

  const getProductById = (id: string) => products.find(p => p._id === id);

  return (
    <div className="py-10 border-t border-gray-100">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-heading font-bold text-gray-900">
          Shopping Cart
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          <Link href="/" className="hover:text-black">Home</Link> / Your Shopping Cart
        </p>
      </div>

      {totalAmount === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl font-heading">Your cart is empty.</p>
          <Link href="/collection" className="text-black font-semibold hover:underline mt-4 inline-block">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Side: Cart Items Table (70%) */}
            <div className="lg:w-2/3">
                {/* Table Headers */}
                <div className="grid grid-cols-4 items-center gap-4 text-sm text-gray-700 font-semibold uppercase tracking-wider border-b pb-4 max-sm:hidden">
                    <p>Product</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                </div>

                {/* Cart Rows */}
                {cartKeys.map((key) => {
                    const { itemId, size } = getItemInfoFromKey(key);
                    const product = getProductById(itemId);
                    const quantity = cartItems[key];
                    
                    if (!product) return null;
                    
                    const itemTotal = product.price * quantity;

                    return (
                        <div key={key} className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4 text-sm text-gray-700 py-6 border-b">
                            
                            {/* Product Column */}
                            <div className="col-span-2 sm:col-span-1 flex items-center gap-4">
                                <Image
                                    src={product.image[0]}
                                    alt={product.name}
                                    width={80}
                                    height={100}
                                    className="w-20 h-24 object-cover"
                                />
                                <div>
                                    <p className="font-medium text-black">{product.name}</p>
                                    <p className="text-xs text-gray-500">Size: {size}</p>
                                    <button 
                                        className="text-xs text-[#ff5e5e] hover:text-black mt-1 flex items-center gap-1 transition"
                                        onClick={() => updateCartItemQuantity(itemId, size, 0)} // Remove item
                                    >
                                        <Trash2 size={12} /> Remove
                                    </button>
                                </div>
                            </div>
                            
                            {/* Price */}
                            <p className="hidden sm:block font-medium">{currency}{product.price}.00</p>
                            
                            {/* Quantity Control */}
                            <div className="flex justify-center border border-gray-300 max-w-[120px]">
                                <button 
                                    onClick={() => updateCartItemQuantity(itemId, size, quantity - 1)}
                                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 border-x text-black font-semibold">{quantity}</span>
                                <button 
                                    onClick={() => updateCartItemQuantity(itemId, size, quantity + 1)}
                                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                                >
                                    +
                                </button>
                            </div>
                            
                            {/* Total */}
                            <p className="font-bold text-black text-right sm:text-left">{currency}{itemTotal.toFixed(2)}</p>
                        </div>
                    );
                })}
            </div>

            {/* Right Side: Cart Summary (30%) */}
            <div className="lg:w-1/3 p-6 bg-gray-50 rounded-lg h-fit shadow-md">
                <h2 className="text-2xl font-heading font-bold mb-4">Cart Summary</h2>

                {/* Gift Wrap Checkbox */}
                <div className="flex items-center gap-3 mb-4 text-sm font-medium">
                    <input type="checkbox" id="wrap" className="w-4 h-4 text-black border-gray-300 focus:ring-black" />
                    <label htmlFor="wrap">For {currency}10.00 Please Wrap The Product</label>
                </div>

                {/* Totals */}
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                        <p>Subtotal</p>
                        <p className="font-medium">{currency}{totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-gray-700">
                        <p>Shipping</p>
                        <p className="font-medium">{currency}{delivery_fee.toFixed(2)}</p>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-xl font-bold text-black pt-2">
                        <p>Total</p>
                        <p>{currency}{(totalAmount + delivery_fee).toFixed(2)}</p>
                    </div>
                </div>

                <Link href="/order-place" className="mt-6 block">
                    <button className="bg-black text-white w-full py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#ff5e5e] transition">
                        Checkout
                    </button>
                </Link>
                
                <Link href="/collection" className="text-sm text-gray-600 hover:text-black mt-3 block text-center">
                    Continue Shopping
                </Link>

            </div>
        </div>
      )}
    </div>
  );
};

export default Cart;