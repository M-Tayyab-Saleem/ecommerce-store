"use client";

import React from "react";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";

interface ImagePreviewModalProps {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
    alt?: string;
}

export default function ImagePreviewModal({
    imageUrl,
    isOpen,
    onClose,
    alt = "Preview",
}: ImagePreviewModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/90 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 bg-black/50 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Zoom Icon Indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-full">
                    <ZoomIn size={20} />
                    <span className="text-sm">Click to close</span>
                </div>

                {/* Image */}
                <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
                    <Image
                        src={imageUrl}
                        alt={alt}
                        fill
                        className="object-contain"
                        onClick={onClose}
                    />
                </div>
            </div>
        </>
    );
}
