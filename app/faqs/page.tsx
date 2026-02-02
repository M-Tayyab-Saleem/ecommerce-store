"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";
import WhatsAppCTA from "@/components/WhatsAppCTA";

interface FAQItem {
    question: string;
    answer: string;
}

const faqCategories = [
    {
        title: "Products & Materials",
        faqs: [
            {
                question: "What is resin jewelry?",
                answer:
                    "Resin jewelry is made from epoxy resin, a durable plastic material that starts as a liquid and hardens when cured. It's perfect for embedding flowers, glitter, pigments, and other decorative elements to create unique, one-of-a-kind pieces.",
            },
            {
                question: "Is resin jewelry durable?",
                answer:
                    "Yes! When properly cured, resin jewelry is very durable and water-resistant. However, we recommend avoiding prolonged exposure to direct sunlight and not wearing your pieces while swimming or showering to maintain their beauty.",
            },
            {
                question: "How do I care for my resin items?",
                answer:
                    "Wipe gently with a soft, damp cloth. Avoid harsh chemicals, direct sunlight for extended periods, and extreme heat. Store your pieces in a cool, dry place away from direct sunlight.",
            },
        ],
    },
    {
        title: "Custom Orders",
        faqs: [
            {
                question: "Can I request a custom design?",
                answer:
                    "Absolutely! We love creating custom pieces. You can personalize keychains with names, choose your own color combinations, or even request completely custom designs. Just reach out via WhatsApp with your ideas!",
            },
            {
                question: "How long does a custom order take?",
                answer:
                    "Custom orders typically take 5-7 business days to create, plus shipping time. More complex designs may take a bit longer. We'll provide a timeline when you place your order.",
            },
            {
                question: "Can I see a proof before you make my custom item?",
                answer:
                    "For most custom orders, we can share a mockup or color sample before proceeding with the final piece. This way, you can approve the design before we start crafting.",
            },
        ],
    },
    {
        title: "Payment & Pricing",
        faqs: [
            {
                question: "What payment methods do you accept?",
                answer:
                    "We accept Cash on Delivery (COD) across Pakistan, bank transfers (JazzCash, EasyPaisa), and direct bank deposit. COD is our most popular payment option!",
            },
            {
                question: "Is COD (Cash on Delivery) available?",
                answer:
                    "Yes! COD is available for all orders across Pakistan. You pay when your order arrives at your doorstep - no advance payment needed.",
            },
            {
                question: "Are there any additional charges?",
                answer:
                    "Product prices include the item only. Shipping charges apply based on your location. Orders above PKR 3,000 may qualify for free shipping. COD has no extra charges.",
            },
        ],
    },
    {
        title: "Shipping & Delivery",
        faqs: [
            {
                question: "How long does delivery take?",
                answer:
                    "Delivery typically takes 3-5 business days for major cities (Lahore, Karachi, Islamabad) and 5-7 days for other areas across Pakistan. You'll receive a tracking number once your order ships.",
            },
            {
                question: "Do you ship all over Pakistan?",
                answer:
                    "Yes! We deliver to all cities and towns across Pakistan. Whether you're in a major city or a smaller town, we'll get your order to you.",
            },
            {
                question: "Can I track my order?",
                answer:
                    "Yes! Once your order ships, we'll share a tracking number via WhatsApp or SMS so you can monitor your package's journey.",
            },
        ],
    },
    {
        title: "Returns & Exchanges",
        faqs: [
            {
                question: "What is your return policy?",
                answer:
                    "We accept returns within 7 days of delivery if the item is damaged or defective. Custom/personalized orders cannot be returned unless there's a manufacturing defect. Please check our Refund Policy page for details.",
            },
            {
                question: "What if my item arrives damaged?",
                answer:
                    "We carefully package all items, but if something arrives damaged, please contact us within 48 hours with photos. We'll arrange a replacement or refund.",
            },
            {
                question: "Can I exchange my item?",
                answer:
                    "Exchanges are available for non-customized items within 7 days of delivery. The item must be unused and in original condition. Please reach out on WhatsApp to initiate an exchange.",
            },
        ],
    },
];

const FAQPage = () => {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
        setOpenItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/5 to-white py-16">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 block">
                            Help Center
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-gray-600">
                            Find answers to common questions about our products, orders, and policies.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="section">
                <div className="container-custom max-w-4xl">
                    {faqCategories.map((category, catIndex) => (
                        <div key={category.title} className="mb-10">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {category.title}
                            </h2>
                            <div className="space-y-3">
                                {category.faqs.map((faq, faqIndex) => {
                                    const itemId = `${catIndex}-${faqIndex}`;
                                    const isOpen = openItems.includes(itemId);

                                    return (
                                        <div
                                            key={itemId}
                                            className="border border-gray-200 rounded-xl overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleItem(itemId)}
                                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-medium text-gray-900 pr-4">
                                                    {faq.question}
                                                </span>
                                                <ChevronDown
                                                    size={20}
                                                    className={`text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"
                                                    }`}
                                            >
                                                <div className="p-5 pt-0 text-gray-600">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Still Have Questions */}
                    <div className="mt-12 bg-primary/5 rounded-2xl p-8 text-center">
                        <MessageCircle size={40} className="text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Still Have Questions?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Can't find what you're looking for? We're here to help!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <WhatsAppCTA message="Hi! I have a question that's not in the FAQs." />
                            <Link href="/contact" className="btn-outline">
                                Contact Page
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQPage;
