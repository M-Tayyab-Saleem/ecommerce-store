"use client";

// SectionHeading removed as unused
import React, { useState } from "react";

const NewsletterBox: React.FC = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        // Simulate API call - replace with actual implementation
        setTimeout(() => {
            setStatus("success");
            setEmail("");
            // Reset after 3 seconds
            setTimeout(() => setStatus("idle"), 3000);
        }, 1000);
    };

    return (
        <section className="section-sm">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 md:p-12 lg:p-16">
                <div className="max-w-2xl mx-auto text-center">
                    <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3 block">
                        Stay Updated
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Get Exclusive Updates
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Subscribe to receive notifications about new resin designs, exclusive
                        offers, and behind-the-scenes crafting stories. No spam, we promise!
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input flex-1"
                            disabled={status === "loading" || status === "success"}
                            required
                        />
                        <button
                            type="submit"
                            className="btn-primary whitespace-nowrap"
                            disabled={status === "loading" || status === "success"}
                        >
                            {status === "loading" ? (
                                "Subscribing..."
                            ) : status === "success" ? (
                                "Subscribed! ✓"
                            ) : (
                                "Subscribe"
                            )}
                        </button>
                    </form>

                    {status === "success" && (
                        <p className="text-green-600 text-sm mt-4">
                            Thank you for subscribing! We&apos;ll keep you updated.
                        </p>
                    )}

                    <p className="text-xs text-gray-500 mt-4">
                        By subscribing, you agree to receive marketing emails from EpoxySista.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default NewsletterBox;