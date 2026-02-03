import React from "react";
import Link from "next/link";
import { ShoppingBag, Search, Package } from "lucide-react";

type EmptyStateType = "cart" | "search" | "orders" | "products" | "custom";

interface EmptyStateProps {
    type?: EmptyStateType;
    title?: string;
    message?: string;
    actionLabel?: string;
    actionHref?: string;
    className?: string;
}

const defaultContent = {
    cart: {
        icon: ShoppingBag,
        title: "Your cart is empty",
        message: "Looks like you haven't added any items to your cart yet.",
        actionLabel: "Start Shopping",
        actionHref: "/products",
    },
    search: {
        icon: Search,
        title: "No results found",
        message: "Try adjusting your search or filters to find what you're looking for.",
        actionLabel: "Clear Filters",
        actionHref: "/products",
    },
    orders: {
        icon: Package,
        title: "No orders yet",
        message: "When you place an order, it will appear here.",
        actionLabel: "Start Shopping",
        actionHref: "/products",
    },
    products: {
        icon: ShoppingBag,
        title: "No products found",
        message: "We couldn't find any products matching your criteria.",
        actionLabel: "View All Products",
        actionHref: "/products",
    },
    custom: {
        icon: ShoppingBag,
        title: "Nothing here",
        message: "This section is empty.",
        actionLabel: "Go Home",
        actionHref: "/",
    },
};

const EmptyState: React.FC<EmptyStateProps> = ({
    type = "custom",
    title,
    message,
    actionLabel,
    actionHref,
    className = "",
}) => {
    const content = defaultContent[type];
    const Icon = content.icon;

    const displayTitle = title || content.title;
    const displayMessage = message || content.message;
    const displayActionLabel = actionLabel || content.actionLabel;
    const displayActionHref = actionHref || content.actionHref;

    return (
        <div className={`text-center py-16 ${className}`}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{displayTitle}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{displayMessage}</p>
            {displayActionHref && displayActionLabel && (
                <Link href={displayActionHref} className="btn-primary inline-block">
                    {displayActionLabel}
                </Link>
            )}
        </div>
    );
};

export default EmptyState;
