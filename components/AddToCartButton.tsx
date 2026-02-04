"use client";

import React, { useContext, useState } from "react";
import { ShopContext, ShopContextType } from "@/context/ShopContext";
import { useToast } from "@/components/Toast";
import { Loader2 } from "lucide-react";

interface AddToCartButtonProps {
    productId: string;
    selectedDesign?: string;  // Design name for variant selection
    disabled?: boolean;       // Disable when out of stock
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
    productId,
    selectedDesign = "default",
    disabled = false,
}) => {
    const { addToCart } = useContext(ShopContext) as ShopContextType;
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        if (disabled) return;

        setIsLoading(true);

        // Simulate a brief delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        addToCart(productId, selectedDesign);
        showToast("success", "Item added to cart!");
        setIsLoading(false);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isLoading || disabled}
            className={`btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 ${disabled
                    ? "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                    : "disabled:opacity-70 disabled:cursor-not-allowed"
                }`}
        >
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Adding to Cart...</span>
                </>
            ) : disabled ? (
                "Out of Stock"
            ) : (
                "Add to Cart"
            )}
        </button>
    );
};

export default AddToCartButton;

