"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, type, message }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
    const getToastStyles = () => {
        switch (toast.type) {
            case "success":
                return {
                    bg: "bg-green-50 border-green-200",
                    text: "text-green-800",
                    icon: <CheckCircle size={20} className="text-green-600" />,
                };
            case "error":
                return {
                    bg: "bg-red-50 border-red-200",
                    text: "text-red-800",
                    icon: <AlertCircle size={20} className="text-red-600" />,
                };
            case "warning":
                return {
                    bg: "bg-yellow-50 border-yellow-200",
                    text: "text-yellow-800",
                    icon: <AlertTriangle size={20} className="text-yellow-600" />,
                };
            default:
                return {
                    bg: "bg-blue-50 border-blue-200",
                    text: "text-blue-800",
                    icon: <Info size={20} className="text-blue-600" />,
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div
            className={`flex items-center gap-3 ${styles.bg} ${styles.text} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md pointer-events-auto animate-fade-in-up`}
        >
            {styles.icon}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
}
