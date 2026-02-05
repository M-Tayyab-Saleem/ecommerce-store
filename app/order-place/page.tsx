"use client";

import React, { useState, useContext } from "react";
import { ShopContext, ShopContextType, CartKey } from "@/context/ShopContext";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Truck, Wallet, Shield, MessageCircle } from "lucide-react";
import { formatPKR } from "@/utils/format";

// Helper function to extract info from the composite key
const getItemInfoFromKey = (key: CartKey) => {
  const parts = key.split("_");
  return {
    itemId: parts[0],
    size: parts.length > 1 ? parts[1] : "N/A",
  };
};

const CheckoutPage = () => {
  const {
    products,
    cartItems,
    getCartTotalAmount,
    delivery_fee,
  } = useContext(ShopContext) as ShopContextType;

  // Step state can be used for multi-step checkout
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const totalAmount = getCartTotalAmount();
  const cartKeys = Object.keys(cartItems);
  const cartItemCount = cartKeys.reduce((sum, key) => sum + cartItems[key], 0);

  // Free shipping calculation
  const freeShippingThreshold = 3000;
  const qualifiesForFreeShipping = totalAmount >= freeShippingThreshold;
  const shippingCost = qualifiesForFreeShipping ? 0 : delivery_fee;

  const getProductById = (id: string) => products.find((p) => p._id === id);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Handle order submission
      console.log("Order submitted:", { formData, paymentMethod, cartItems });
      // Redirect to confirmation or process order
      // await submitOrder(...);
    } catch (error) {
      console.error("Order submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItemCount === 0) {
    return (
      <div className="container-custom pt-24 pb-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h1>
        <Link href="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom pt-24 pb-16">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Side: Checkout Form */}
          <div className="lg:w-2/3 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    placeholder="+92 300 1234567"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input"
                    placeholder="House/Flat no, Street, Area"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City *
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="">Select City</option>
                    <option value="lahore">Lahore</option>
                    <option value="karachi">Karachi</option>
                    <option value="islamabad">Islamabad</option>
                    <option value="rawalpindi">Rawalpindi</option>
                    <option value="faisalabad">Faisalabad</option>
                    <option value="multan">Multan</option>
                    <option value="peshawar">Peshawar</option>
                    <option value="quetta">Quetta</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="input resize-none"
                    rows={3}
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* COD - Primary option for Pakistan */}
                <label
                  className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "cod"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Wallet size={20} className="text-primary" />
                      <span className="font-semibold text-gray-900">
                        Cash on Delivery (COD)
                      </span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay when you receive your order. No advance payment needed.
                    </p>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label
                  className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "bank"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">
                      Bank Transfer / JazzCash / EasyPaisa
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay via bank transfer or mobile wallet. We&apos;ll share account details after you place the order.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {cartKeys.map((key) => {
                  const { itemId } = getItemInfoFromKey(key);
                  const product = getProductById(itemId);
                  const quantity = cartItems[key];

                  if (!product) return null;

                  return (
                    <div key={key} className="flex gap-3">
                      <div className="w-14 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={56}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPKR(product.price * quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <hr className="border-gray-200 my-4" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <p>Subtotal</p>
                  <p className="font-medium">{formatPKR(totalAmount)}</p>
                </div>
                <div className="flex justify-between text-gray-700">
                  <p>Shipping</p>
                  <p className="font-medium">
                    {qualifiesForFreeShipping ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPKR(shippingCost)
                    )}
                  </p>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-1">
                  <p>Total</p>
                  <p>{formatPKR(totalAmount + shippingCost)}</p>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                className="btn-primary w-full py-4 font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>

              {/* Trust Indicators */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield size={16} className="text-green-600" />
                  <span>Secure & Safe Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck size={16} className="text-primary" />
                  <span>3-5 days delivery for major cities</span>
                </div>
              </div>

              {/* WhatsApp Help */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Need help ordering?</p>
                <a
                  href="https://wa.me/923022828770?text=Hi! I need help placing an order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#25D366] font-medium hover:underline"
                >
                  <MessageCircle size={16} />
                  Chat with us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;