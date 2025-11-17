"use client";

import React, { useContext } from "react";
import { ShopContext, ShopContextType } from "@/context/ShopContext";
import Image from "next/image";
import { assets } from "@/lib/assets";

const OrderPlace = () => {
  const { getCartTotalAmount, currency, delivery_fee } = useContext(
    ShopContext
  ) as ShopContextType;

  const totalAmount = getCartTotalAmount();

  return (
    <div className="py-10 border-t">
      <form className="flex flex-col md:flex-row justify-between gap-10">
        {/* Left Side - Delivery Info */}
        <div className="flex-1 w-full max-w-lg">
          <h2 className="text-3xl font-semibold mb-6">Delivery Information</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-1/2 border border-gray-300 p-2 rounded outline-none mb-4"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-1/2 border border-gray-300 p-2 rounded outline-none mb-4"
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-gray-300 p-2 rounded outline-none mb-4"
            required
          />
          <input
            type="text"
            placeholder="Street"
            className="w-full border border-gray-300 p-2 rounded outline-none mb-4"
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="City"
              className="w-1/2 border border-gray-300 p-2 rounded outline-none mb-4"
              required
            />
            <input
              type="text"
              placeholder="State"
              className="w-1/2 border border-gray-300 p-2 rounded outline-none mb-4"
              required
            />
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Zip code"
              className="w-1/2 border border-gray-300 p-2 rounded outline-none mb-4"
              required
            />
            <input
              type="text"
              placeholder="Phone"
              className="w-1/2 border border-gray-300 p-2 rounded outline-none mb-4"
              required
            />
          </div>
        </div>

        {/* Right Side - Cart Totals & Payment */}
        <div className="flex-1 w-full max-w-lg">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold">Cart Totals</h2>
            <div className="flex justify-between my-3 text-gray-600">
              <p>Subtotal</p>
              <p>{currency} {totalAmount}</p>
            </div>
            <hr />
            <div className="flex justify-between my-3 text-gray-600">
              <p>Delivery Fee</p>
              <p>{currency} {delivery_fee}</p>
            </div>
            <hr />
            <div className="flex justify-between my-3 text-black font-semibold">
              <p>Total</p>
              <p>{currency} {totalAmount + delivery_fee}</p>
            </div>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Payment Method</h2>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-3 border border-gray-300 rounded">
                    <input type="radio" name="payment" id="stripe" className="w-4 h-4" />
                    <label htmlFor="stripe">
                        <Image src={assets.stripe_logo} alt="Stripe" width={100} height={20} />
                    </label>
                </div>
                <div className="flex items-center gap-3 p-3 border border-gray-300 rounded">
                    <input type="radio" name="payment" id="razorpay" className="w-4 h-4" />
                    <label htmlFor="razorpay">
                        <Image src={assets.razorpay_logo} alt="Razorpay" width={100} height={20} />
                    </label>
                </div>
            </div>

            <button type="submit" className="bg-black text-white px-6 py-3 text-sm active:bg-gray-700 mt-6 w-full">
              PROCEED TO PAYMENT
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderPlace;