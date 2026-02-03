import React from "react";

interface AdminCardProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default function AdminCard({
    title,
    description,
    icon,
    children,
    className = "",
}: AdminCardProps) {
    return (
        <div className={`card ${className}`}>
            {(title || description || icon) && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        {icon && <div className="text-primary">{icon}</div>}
                        <div className="flex-1">
                            {title && (
                                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                            )}
                            {description && (
                                <p className="text-sm text-gray-600 mt-0.5">{description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
}
