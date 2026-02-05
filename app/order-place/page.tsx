"use client";

import React, { useState, useContext } from "react";
import { ShopContext, ShopContextType, CartKey } from "@/context/ShopContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/api/axios-instance";
import { ArrowLeft, Truck, Wallet, Shield, MessageCircle } from "lucide-react";
import { formatPKR } from "@/utils/format";

const getItemInfoFromKey = (key: CartKey) => {
  const parts = key.split("_");
  const itemId = parts[0];
  const size = parts.slice(1).join("_") || "N/A";
  return { itemId, size };
};

const PAYMENT_ACCOUNTS = {
  EASYPAISA: {
    title: "EasyPaisa",
    accountName: "Store Owner Name",
    accountNumber: "0300-1234567",
    instruction: "Please send the exact amount and upload the screenshot below.",
  },
  JAZZCASH: {
    title: "JazzCash",
    accountName: "Store Owner Name",
    accountNumber: "0300-1234567",
    instruction: "Please send the exact amount and upload the screenshot below.",
  },
  BANK_TRANSFER: {
    title: "Bank Transfer",
    bankName: "Meezan Bank",
    accountTitle: "Store Owner Name",
    accountNumber: "1234567890",
    iban: "PK00MEZN0000001234567890",
    instruction: "Please use your Order ID as reference.",
  },
};

const CheckoutPage = () => {
  const {
    products,
    cartItems,
    getCartTotalAmount,
    delivery_fee,
    clearCart,
  } = useContext(ShopContext) as ShopContextType;

  // Step state can be used for multi-step checkout
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Validate Screenshot for non-COD
      if (paymentMethod !== 'cod' && !screenshot) {
        alert("Please upload a payment screenshot.");
        setIsSubmitting(false);
        return;
      }

      // Upload Screenshot if exists
      let uploadedScreenshotUrl = "";
      if (screenshot) {
        const reader = new FileReader();
        const base64Image = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(screenshot);
        });

        const uploadRes = await axiosInstance.post("/upload", { image: base64Image });
        if (uploadRes.data.success) {
          uploadedScreenshotUrl = uploadRes.data.data.url;
        } else {
          throw new Error("Failed to upload screenshot");
        }
      }

      // Prepare items for API
      const items = cartKeys
        .map((key) => {
          const { itemId, size } = getItemInfoFromKey(key);
          // Verify product exists
          const product = getProductById(itemId);
          if (!product) return null;

          return {
            product: itemId,
            quantity: cartItems[key],
            selectedVariant: size !== "N/A" ? size : undefined,
          };
        })
        .filter((item) => item !== null); // Filter out nulls (invalid products)

      if (items.length === 0) {
        alert("Your cart contains unavailable items. Please refresh the page.");
        setIsSubmitting(false);
        return;
      }

      const orderData = {
        items,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        paymentMethod: paymentMethod === 'cod' ? 'COD' : paymentMethod.toUpperCase(),
        notes: formData.notes,
        email: formData.email, // Required for guest checkout
        screenshot: uploadedScreenshotUrl,
        transactionId,
      };

      const response = await axiosInstance.post('/orders', orderData);

      if (response.data.success) {
        clearCart();
        router.push(`/order-success?orderId=${response.data.data.orderId}`);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Order submission error:", error);
      let errorMessage = "Something went wrong while placing your order.";
      if (typeof error === 'object' && error !== null && 'response' in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errorMessage = (error as any).response?.data?.message || errorMessage;
      }
      alert(errorMessage);
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

  // Check if user is logged in (client-side check roughly based on cookie existence or context if available)
  // For now, we will just add the link.

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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Checkout
          </h1>
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Already have an account? Login for faster checkout
          </Link>
        </div>
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
                {/* COD */}
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
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay when you receive your order.
                    </p>
                  </div>
                </label>

                {/* EasyPaisa */}
                <label
                  className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "easypaisa"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="easypaisa"
                    checked={paymentMethod === "easypaisa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">EasyPaisa</span>
                  </div>
                </label>

                {/* JazzCash */}
                <label
                  className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "jazzcash"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="jazzcash"
                    checked={paymentMethod === "jazzcash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">JazzCash</span>
                  </div>
                </label>

                {/* Bank Transfer */}
                <label
                  className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "bank_transfer"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">Bank Transfer</span>
                  </div>
                </label>
              </div>

              {/* Payment Info Card & Upload */}
              {paymentMethod !== "cod" && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                  {(() => {
                    const methodKey = paymentMethod.toUpperCase() as keyof typeof PAYMENT_ACCOUNTS;
                    const details = PAYMENT_ACCOUNTS[methodKey];
                    if (!details) return null;

                    return (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                          {details.title} Details
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700">
                          {'bankName' in details && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Bank Name:</span>
                              <span className="font-medium">{details.bankName}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-500">Account Title:</span>
                            <span className="font-medium">
                              {'accountName' in details ? details.accountName : details.accountTitle}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Account Number:</span>
                            <span className="font-medium font-mono bg-white px-1 rounded border border-gray-200">
                              {details.accountNumber}
                            </span>
                          </div>
                          {'iban' in details && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">IBAN:</span>
                              <span className="font-medium font-mono text-xs break-all bg-white px-1 rounded border border-gray-200">
                                {details.iban}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
                          {details.instruction}
                        </div>

                        {/* Transaction ID Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Transaction ID / Reference No (Optional)
                          </label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="input"
                            placeholder="e.g. 1234567890"
                          />
                        </div>

                        {/* Screenshot Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Payment Screenshot *
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-white relative hover:bg-gray-50 transition-colors">
                            <div className="space-y-1 text-center">
                              {screenshotPreview ? (
                                <div className="relative w-full h-48 mb-4">
                                  <Image
                                    src={screenshotPreview}
                                    alt="Payment Screenshot"
                                    fill
                                    className="object-contain rounded"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setScreenshot(null);
                                      setScreenshotPreview(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                                  >
                                    <Shield size={16} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                  >
                                    <path
                                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <div className="flex text-sm text-gray-600 justify-center">
                                    <label
                                      htmlFor="file-upload"
                                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                                    >
                                      <span>Upload a file</span>
                                      <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                      />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 5MB
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* WhatsApp Option */}
                        <div className="pt-2 text-center">
                          <p className="text-sm text-gray-500 mb-2">OR</p>
                          <a
                            href={`https://wa.me/923022828770?text=${encodeURIComponent(
                              `Hi! I want to confirm my order. Payment Method: ${details.title}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#25D366] font-medium hover:underline text-sm"
                          >
                            <MessageCircle size={16} />
                            Send screenshot on WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
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


                  const { itemId, size } = getItemInfoFromKey(key);
                  const product = getProductById(itemId);
                  const quantity = cartItems[key];

                  if (!product) return null;

                  // Find variant for design-specific data (calculate price)
                  const variant = size !== "N/A" && product.variants?.length
                    ? product.variants.find((v) => v.designName === size)
                    : null;

                  // Use design-specific price if available and > 0
                  const price = (variant?.price && variant.price > 0) ? variant.price : product.price;

                  return (
                    <div key={key} className="flex gap-3">
                      <div className="w-14 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                        <Image
                          src={variant?.images?.[0] || product.images[0]}
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
                        {size !== "N/A" && <p className="text-xs text-gray-500">Design: {size}</p>}
                        <p className="text-xs text-gray-500">Qty: {quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPKR(price * quantity)}
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