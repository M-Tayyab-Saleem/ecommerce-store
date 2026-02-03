"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: "danger" | "warning" | "info";
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    variant = "info",
    confirmText = "Confirm",
    cancelText = "Cancel",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const getVariantClasses = () => {
        switch (variant) {
            case "danger":
                return {
                    icon: "text-red-600",
                    button: "bg-red-600 hover:bg-red-700 text-white",
                };
            case "warning":
                return {
                    icon: "text-yellow-600",
                    button: "bg-yellow-600 hover:bg-yellow-700 text-white",
                };
            default:
                return {
                    icon: "text-blue-600",
                    button: "bg-primary hover:bg-primary-hover text-white",
                };
        }
    };

    const variantClasses = getVariantClasses();

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className={variantClasses.icon} size={24} />
                            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        </div>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Message */}
                    <p className="text-gray-600 mb-6">{message}</p>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button onClick={onCancel} className="btn-ghost">
                            {cancelText}
                        </button>
                        <button onClick={onConfirm} className={`${variantClasses.button} px-6 py-3 rounded-lg font-semibold transition-colors`}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
