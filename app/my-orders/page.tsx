"use client";

import React, { useContext } from "react";
import { ShopContext, ShopContextType } from "@/context/ShopContext";
import Image from "next/image";
import { assets, products } from "@/lib/assets";
import Link from "next/link";
import { Lock } from "lucide-react";

// Helper function to extract info from the composite key (assuming we need product details)
const getItemInfoFromKey = (key: string) => {
    const [itemId, size] = key.split('_');
    return { itemId, size };
};

const OrderPlace = () => {
  const { getCartTotalAmount, currency, delivery_fee, cartItems } = useContext(
    ShopContext
  ) as ShopContextType;

  const totalAmount = getCartTotalAmount();

  const getProductById = (id: string) => products.find(p => p._id === id);

  return (
    <div className="py-10 border-t border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto bg-white p-8 md:p-12 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-10">
            <h1 className="text-3xl font-heading font-bold text-gray-900">FASCO Demo Checkout</h1>
            <p className="text-sm text-gray-500 mt-2">Complete your purchase</p>
        </div>

        <form className="flex flex-col lg:flex-row justify-between gap-12">
            
            {/* Left Side - Contact, Delivery, Payment (70%) */}
            <div className="lg:w-7/12 flex flex-col gap-10">
                
                {/* 1. Contact Section */}
                <div>
                    <h2 className="text-xl font-heading font-bold mb-4">Contact</h2>
                    <div className="flex justify-between items-center text-sm mb-4">
                        <label htmlFor="email" className="text-gray-700">Email Address</label>
                        <span className="text-xs text-gray-500">Have an account? <Link href="/login" className="text-black font-semibold hover:underline">Create Account</Link></span>
                    </div>
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full border border-gray-300 p-3 outline-none text-sm"
                        required
                    />
                </div>

                {/* 2. Delivery Section */}
                <div>
                    <h2 className="text-xl font-heading font-bold mb-4">Delivery</h2>
                    <select className="w-full border border-gray-300 p-3 outline-none text-sm mb-4">
                        <option>Country | Region (Pakistan)</option>
                        {/* More options... */}
                    </select>
                    <div className="flex gap-4 mb-4">
                        <input type="text" placeholder="First Name" className="w-1/2 border border-gray-300 p-3 outline-none text-sm" required />
                        <input type="text" placeholder="Last Name" className="w-1/2 border border-gray-300 p-3 outline-none text-sm" required />
                    </div>
                    <input type="text" placeholder="Address" className="w-full border border-gray-300 p-3 outline-none text-sm mb-4" required />
                    <div className="flex gap-4 mb-4">
                        <input type="text" placeholder="City" className="w-1/2 border border-gray-300 p-3 outline-none text-sm" required />
                        <input type="text" placeholder="Postal Code" className="w-1/2 border border-gray-300 p-3 outline-none text-sm" required />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" id="saveDelivery" className="w-4 h-4" />
                        <label htmlFor="saveDelivery">Save This Info For Future</label>
                    </div>
                </div>

                {/* 3. Payment Section */}
                <div>
                    <h2 className="text-xl font-heading font-bold mb-4">Payment</h2>
                    <div className="border border-gray-300 p-3 rounded mb-4">
                        <label className="flex items-center gap-2 text-sm font-semibold mb-3">
                             <input type="radio" name="paymentType" defaultChecked /> Credit Card
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 relative">
                                <input type="text" placeholder="Card Number" className="w-full border border-gray-300 p-3 outline-none text-sm pl-10" required />
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            </div>
                            <input type="text" placeholder="Expiration Date" className="border border-gray-300 p-3 outline-none text-sm" required />
                            <input type="text" placeholder="Security Code" className="border border-gray-300 p-3 outline-none text-sm" required />
                            <input type="text" placeholder="Cardholder Name" className="col-span-2 border border-gray-300 p-3 outline-none text-sm" required />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 mt-4">
                            <input type="checkbox" id="saveCard" className="w-4 h-4" />
                            <label htmlFor="saveCard">Save This Info For Future</label>
                        </div>
                    </div>
                </div>
                
                {/* Checkout Button */}
                <button
                    type="submit"
                    className="bg-black text-white py-4 text-lg font-bold uppercase tracking-wider hover:bg-[#ff5e5e] transition"
                >
                    Pay Now
                </button>
            </div>

            {/* Right Side - Order Summary (30%) */}
            <div className="lg:w-5/12 bg-gray-50/50 p-6">
                <h2 className="text-xl font-heading font-bold mb-4">Your Order ({Object.keys(cartItems).length} Items)</h2>
                
                {/* Product List */}
                <div className="space-y-4 border-b border-gray-200 pb-4 mb-4">
                    {Object.keys(cartItems).map((key) => {
                        const { itemId, size } = getItemInfoFromKey(key);
                        const product = getProductById(itemId);
                        const quantity = cartItems[key];
                        if (!product) return null;
                        
                        return (
                            <div key={key} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <Image src={product.image[0]} alt={product.name} width={50} height={60} className="w-12 h-16 object-cover" />
                                    <div>
                                        <p className="font-semibold text-black">{product.name}</p>
                                        <p className="text-xs text-gray-500">Size: {size}, Qty: {quantity}</p>
                                    </div>
                                </div>
                                <p className="font-semibold">{currency}{(product.price * quantity).toFixed(2)}</p>
                            </div>
                        );
                    })}
                </div>
                
                {/* Totals Summary */}
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

            </div>
        </form>
      </div>
    </div>
  );
};

export default OrderPlace;