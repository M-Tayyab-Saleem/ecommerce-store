"use client";

import React, { useContext } from "react";
import { ShopContext, ShopContextType, CartKey } from "@/context/ShopContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowLeft, Truck, Wallet } from "lucide-react";
import { formatPKR } from "@/utils/format";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";

// Helper function to extract info from the composite key (productId_designName)
const getItemInfoFromKey = (key: CartKey) => {
    const parts = key.split("_");
    const itemId = parts[0];
    // Join remaining parts in case designName contains underscore
    const designName = parts.slice(1).join("_") || "default";
    return { itemId, designName };
};

const Cart = () => {
    const {
        products,
        cartItems,
        updateCartItemQuantity,
        getCartTotalAmount,
        delivery_fee,
    } = useContext(ShopContext) as ShopContextType;

    const totalAmount = getCartTotalAmount();
    const cartKeys = Object.keys(cartItems);
    const cartItemCount = cartKeys.reduce((sum, key) => sum + cartItems[key], 0);

    const getProductById = (id: string) => products.find((p) => p._id === id);

    // Calculate free shipping threshold
    const freeShippingThreshold = 3000;
    const remainingForFreeShipping = freeShippingThreshold - totalAmount;
    const qualifiesForFreeShipping = remainingForFreeShipping <= 0;

    const shippingCost = qualifiesForFreeShipping ? 0 : delivery_fee;

    // Delete Confirmation State
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState<{ itemId: string; designName: string } | null>(null);

    const handleDeleteClick = (itemId: string, designName: string) => {
        setItemToDelete({ itemId, designName });
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            updateCartItemQuantity(itemToDelete.itemId, itemToDelete.designName, 0);
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    return (
        <div className="container-custom pt-24 pb-16">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Shopping Cart
                </h1>
                <p className="text-gray-600">
                    {cartItemCount > 0
                        ? `You have ${cartItemCount} item${cartItemCount > 1 ? "s" : ""} in your cart`
                        : "Your cart is empty"}
                </p>
            </div>

            {cartItemCount === 0 ? (
                <EmptyState
                    type="cart"
                    title="Your cart is empty"
                    message="Looks like you haven't added any handmade pieces to your cart yet. Explore our collection!"
                    actionLabel="Start Shopping"
                    actionHref="/products"
                />
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Side: Cart Items */}
                    <div className="lg:w-2/3">
                        {/* Free Shipping Progress */}
                        {!qualifiesForFreeShipping && (
                            <div className="bg-primary/5 rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between text-sm mb-2">
                                    <span className="text-gray-700">
                                        Add {formatPKR(remainingForFreeShipping)} more for{" "}
                                        <strong>FREE shipping!</strong>
                                    </span>
                                    <span className="text-primary font-medium">
                                        {Math.round((totalAmount / freeShippingThreshold) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min(
                                                (totalAmount / freeShippingThreshold) * 100,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {qualifiesForFreeShipping && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                                <Truck size={24} className="text-green-600" />
                                <span className="text-green-800 font-medium">
                                    🎉 Congratulations! You qualify for FREE shipping!
                                </span>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cartKeys.map((key) => {
                                const { itemId, designName } = getItemInfoFromKey(key);
                                const product = getProductById(itemId);
                                const quantity = cartItems[key];

                                if (!product) return null;

                                // Find variant for design-specific data
                                const variant = designName !== "default" && product.variants?.length
                                    ? product.variants.find((v) => v.designName === designName)
                                    : null;

                                // Use design-specific price if available
                                const price = variant?.price ?? product.price;
                                const itemTotal = price * quantity;

                                // Use design-specific image if available
                                const displayImage = variant?.images?.[0] || product.images?.[0];

                                const productUrl = `/products/${product.slug}`;

                                return (
                                    <div
                                        key={key}
                                        className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4"
                                    >
                                        {/* Product Image */}
                                        <Link
                                            href={productUrl}
                                            className="shrink-0 w-24 h-28 rounded-lg overflow-hidden bg-gray-100"
                                        >
                                            {displayImage ? (
                                                <Image
                                                    src={displayImage}
                                                    alt={product.name}
                                                    width={96}
                                                    height={112}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                        </Link>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between gap-2">
                                                <div>
                                                    <Link
                                                        href={productUrl}
                                                        className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    {designName !== "default" && (
                                                        <p className="text-sm text-gray-500 mt-0.5">
                                                            Design: {designName}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                                        ✨ Handmade
                                                    </p>
                                                </div>
                                                <p className="font-bold text-gray-900 whitespace-nowrap">
                                                    {formatPKR(itemTotal)}
                                                </p>
                                            </div>

                                            {/* Quantity & Remove */}
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() =>
                                                            updateCartItemQuantity(itemId, designName, quantity - 1)
                                                        }
                                                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-4 py-1.5 border-x border-gray-300 font-medium min-w-[48px] text-center">
                                                        {quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateCartItemQuantity(itemId, designName, quantity + 1)
                                                        }
                                                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                                                    onClick={() => handleDeleteClick(itemId, designName)}
                                                >
                                                    <Trash2 size={16} />
                                                    <span className="hidden sm:inline">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Continue Shopping */}
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mt-6 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Right Side: Cart Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Order Summary
                            </h2>

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

                            {/* Checkout Button */}
                            <Link href="/order-place" className="block mt-6">
                                <button className="btn-primary w-full py-4 font-semibold">
                                    Proceed to Checkout
                                </button>
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                    <Wallet size={16} className="text-primary" />
                                    <span>Cash on Delivery Available</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Truck size={16} className="text-primary" />
                                    <span>Pakistan-wide Delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModalOpen(false)}
                title="Remove Item"
                message="Are you sure you want to remove this item from your cart?"
                variant="danger"
                confirmText="Remove"
            />
        </div>
    );
};

export default Cart;