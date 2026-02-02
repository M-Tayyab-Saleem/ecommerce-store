import React from "react";
import { Brush, Truck, Wallet, Sparkles } from "lucide-react";

type BadgeType = "handmade" | "cod" | "delivery" | "custom";

interface TrustBadgeProps {
    type: BadgeType;
    compact?: boolean;
    className?: string;
}

const badgeConfig = {
    handmade: {
        icon: Brush,
        title: "100% Handmade",
        description: "Every piece is handcrafted with care and attention to detail",
        bgColor: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    cod: {
        icon: Wallet,
        title: "Cash on Delivery",
        description: "Pay when you receive - COD available all over Pakistan",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    delivery: {
        icon: Truck,
        title: "Pakistan-wide Delivery",
        description: "Fast & reliable shipping to all cities in Pakistan",
        bgColor: "bg-green-50",
        iconColor: "text-green-600",
    },
    custom: {
        icon: Sparkles,
        title: "Custom Orders",
        description: "Create personalized resin pieces with your own design",
        bgColor: "bg-purple-50",
        iconColor: "text-purple-600",
    },
};

const TrustBadge: React.FC<TrustBadgeProps> = ({
    type,
    compact = false,
    className = "",
}) => {
    const config = badgeConfig[type];
    const Icon = config.icon;

    if (compact) {
        return (
            <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} ${className}`}
            >
                <Icon size={14} className={config.iconColor} />
                <span className="text-xs font-medium text-gray-700">{config.title}</span>
            </div>
        );
    }

    return (
        <div
            className={`flex flex-col items-center text-center p-6 rounded-xl ${config.bgColor} ${className}`}
        >
            <div
                className={`w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm`}
            >
                <Icon size={28} className={config.iconColor} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{config.title}</h3>
            <p className="text-sm text-gray-600">{config.description}</p>
        </div>
    );
};

export default TrustBadge;
