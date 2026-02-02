"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

interface WhatsAppCTAProps {
    phoneNumber?: string;
    message?: string;
    variant?: "button" | "floating" | "banner";
    className?: string;
}

const WhatsAppCTA: React.FC<WhatsAppCTAProps> = ({
    phoneNumber = "923022828770", // Default Pakistan number format
    message = "Hi! I'm interested in your handmade resin products.",
    variant = "button",
    className = "",
}) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    if (variant === "floating") {
        return (
            <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 ${className}`}
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle size={28} fill="white" strokeWidth={0} />
            </Link>
        );
    }

    if (variant === "banner") {
        return (
            <div className={`bg-[#25D366] py-4 ${className}`}>
                <div className="container-custom flex flex-col md:flex-row items-center justify-center gap-4 text-white text-center">
                    <div className="flex items-center gap-2">
                        <MessageCircle size={24} />
                        <span className="font-medium">
                            Have a custom design in mind? Let's create it together!
                        </span>
                    </div>
                    <Link
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-[#25D366] px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Chat on WhatsApp
                    </Link>
                </div>
            </div>
        );
    }

    // Default button variant
    return (
        <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-whatsapp inline-flex items-center gap-2 ${className}`}
        >
            <MessageCircle size={20} />
            <span>Chat on WhatsApp</span>
        </Link>
    );
};

export default WhatsAppCTA;
