"use client";

import React from "react";
import { X } from "lucide-react";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    position?: "left" | "right";
}

export default function Drawer({
    isOpen,
    onClose,
    title,
    children,
    position = "right",
}: DrawerProps) {
    if (!isOpen) return null;

    const positionClasses =
        position === "left"
            ? "left-0 -translate-x-full data-[open=true]:translate-x-0"
            : "right-0 translate-x-full data-[open=true]:translate-x-0";

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                data-open={isOpen}
                className={`fixed top-0 bottom-0 ${positionClasses} w-full max-w-md bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out flex flex-col`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </div>
        </>
    );
}
