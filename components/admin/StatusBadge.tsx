import React from "react";

type StatusType =
    | "order"
    | "payment"
    | "stock"
    | "user"
    | "active"
    | "general";

interface StatusBadgeProps {
    status: string;
    type?: StatusType;
    className?: string;
}

export default function StatusBadge({
    status,
    type = "general",
    className = "",
}: StatusBadgeProps) {
    const getBadgeClass = () => {
        const normalizedStatus = status.toLowerCase();

        // Order statuses
        if (type === "order") {
            switch (normalizedStatus) {
                case "pending":
                    return "bg-yellow-100 text-yellow-800";
                case "confirmed":
                    return "bg-blue-100 text-blue-800";
                case "processing":
                    return "bg-purple-100 text-purple-800";
                case "shipped":
                    return "bg-indigo-100 text-indigo-800";
                case "delivered":
                    return "bg-green-100 text-green-800";
                case "cancelled":
                    return "bg-red-100 text-red-800";
                default:
                    return "bg-gray-100 text-gray-800";
            }
        }

        // Payment statuses
        if (type === "payment") {
            switch (normalizedStatus) {
                case "pending":
                    return "bg-yellow-100 text-yellow-800";
                case "paid":
                case "verified":
                    return "bg-green-100 text-green-800";
                case "failed":
                case "rejected":
                    return "bg-red-100 text-red-800";
                default:
                    return "bg-gray-100 text-gray-800";
            }
        }

        // Stock statuses
        if (type === "stock") {
            switch (normalizedStatus) {
                case "in stock":
                case "available":
                    return "bg-green-100 text-green-800";
                case "low stock":
                    return "bg-yellow-100 text-yellow-800";
                case "out of stock":
                    return "bg-red-100 text-red-800";
                default:
                    return "bg-gray-100 text-gray-800";
            }
        }

        // User roles
        if (type === "user") {
            switch (normalizedStatus) {
                case "admin":
                    return "bg-purple-100 text-purple-800";
                case "user":
                    return "bg-blue-100 text-blue-800";
                default:
                    return "bg-gray-100 text-gray-800";
            }
        }

        // Active/Inactive
        if (type === "active") {
            return normalizedStatus === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800";
        }

        // General/default
        return "bg-gray-100 text-gray-800";
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBadgeClass()} ${className}`}
        >
            {status}
        </span>
    );
}
