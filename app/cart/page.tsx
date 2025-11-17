"use client";

import React, { useContext } from "react";
import { ShopContext, ShopContextType } from "@/context/ShopContext";
import { assets } from "@/lib/assets";
import Image from "next/image";
import Link from "next/link";

const Cart = () => {
  const {
    products,
    cartItems,
    removeFromCart,
    getCartTotalAmount,
    currency,
    delivery_fee,
  } = useContext(ShopContext) as ShopContextType;

  const totalAmount = getCartTotalAmount();

  return (
    <div className="py-10 border-t">
      {totalAmount === 0 ? (
        <div className="text-center">
          <p className="text-2xl">Your cart is empty.</p>
          <Link href="/collection" className="text-blue-600 hover:underline">
            Go shopping
          </Link>
        </div>
      ) : (
        <div>
          {/* Cart Items */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 text-sm text-gray-700 font-medium max-sm:hidden">
            <p>Items</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <hr className="my-3" />
          {products.map((product) => {
            if (cartItems[product._id] > 0) {
              return (
                <div key={product._id}>
                  <div className="grid grid-cols-[1fr_auto_auto_auto_auto] sm:grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 text-sm text-gray-700 mb-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.image[0]}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="w-[60px]"
                      />
                      <p className="max-sm:text-xs">{product.name}</p>
                    </div>
                    <p>{currency} {product.price}</p>
                    <p>{cartItems[product._id]}</p>
                    <p>{currency} {product.price * cartItems[product._id]}</p>
                    <Image
                      src={assets.cross_icon}
                      alt="remove"
                      width={12}
                      height={12}
                      className="w-3 cursor-pointer"
                      onClick={() => removeFromCart(product._id)}
                    />
                  </div>
                  <hr className="sm:hidden" />
                </div>
              );
            }
            return null;
          })}

          {/* Cart Totals */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-10 mt-10">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">Cart Totals</h2>
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
              <Link href="/order">
                <button className="bg-black text-white px-6 py-3 text-sm active:bg-gray-700 mt-4">
                  PROCEED TO CHECKOUT
                </button>
              </Link>
            </div>
            <div className="flex-1 sm:w-1/2">
              <p className="text-gray-600">If you have a promo code, enter it here</p>
              <div className="flex mt-3">
                <input type="text" placeholder="Promo code" className="flex-1 outline-none border border-gray-400 p-2" />
                <button className="bg-black text-white px-6">Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;