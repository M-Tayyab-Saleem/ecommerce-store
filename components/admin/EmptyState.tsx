import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    actionHref?: string;
    actionText?: string;
    className?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionHref,
    actionText,
    className = "",
    onAction,
}: EmptyStateProps) {
    return (
        <div className={`empty-state ${className}`}>
            {Icon && (
                <div className="empty-state__icon bg-gray-50 rounded-full p-4 inline-flex items-center justify-center mb-4 text-gray-400">
                    <Icon size={32} />
                </div>
            )}
            <h3 className="empty-state__title">{title}</h3>
            {description && <p className="empty-state__text max-w-sm mx-auto">{description}</p>}

            {(actionHref && actionText) && (
                <Link href={actionHref} className="btn-primary inline-flex items-center gap-2">
                    {actionText}
                </Link>
            )}

            {(!actionHref && actionText && onAction) && (
                <button onClick={onAction} className="btn-primary inline-flex items-center gap-2">
                    {actionText}
                </button>
            )}
        </div>
    );
}
