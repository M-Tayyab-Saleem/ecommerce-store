import React from "react";

interface LoadingSkeletonProps {
    type?: "table" | "card" | "stats";
    rows?: number;
    className?: string;
}

export default function LoadingSkeleton({
    type = "card",
    rows = 3,
    className = "",
}: LoadingSkeletonProps) {
    if (type === "stats") {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="card p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                        <div className="h-10 bg-gray-200 rounded w-32"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === "table") {
        return (
            <div className={`space-y-3 ${className}`}>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                        <div className="w-20 h-8 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Default: card type
    return (
        <div className={`space-y-4 ${className}`}>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
