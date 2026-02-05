import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms & Conditions",
    description:
        "Terms and Conditions for using EpoxySista website and purchasing our handmade resin products.",
};

const TermsConditionsPage = () => {
    return (
        <div className="pt-20">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/5 to-white py-12">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Terms & Conditions
                        </h1>
                        <p className="text-gray-600">
                            Last updated: February 2025
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section-sm">
                <div className="container-custom max-w-3xl">
                    <div className="prose prose-gray max-w-none">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                                <p className="text-gray-600">
                                    Welcome to EpoxySista. By accessing our website and purchasing our products,
                                    you agree to be bound by these Terms and Conditions. Please read them carefully
                                    before making any purchase.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">2. Use of Website</h2>
                                <p className="text-gray-600 mb-3">
                                    By using this website, you warrant that:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                    <li>You are at least 18 years old or have parental consent</li>
                                    <li>You will use the website for lawful purposes only</li>
                                    <li>All information provided by you is accurate and current</li>
                                    <li>You will not attempt to gain unauthorized access to any part of the website</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">3. Products</h2>
                                <p className="text-gray-600 mb-3">
                                    All products sold on EpoxySista are handmade resin items. Please note:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                    <li>Each piece is handcrafted, so slight variations in color, size, or pattern are normal and part of the unique nature of handmade items</li>
                                    <li>Product images are representative; actual items may vary slightly</li>
                                    <li>Colors may appear different on different screens</li>
                                    <li>Custom orders are made to your specifications and cannot be returned unless defective</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">4. Orders & Payment</h2>
                                <p className="text-gray-600 mb-3">
                                    When you place an order:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                    <li>You are making an offer to purchase the products</li>
                                    <li>We reserve the right to accept or decline your order</li>
                                    <li>Prices are in Pakistani Rupees (PKR) and include applicable taxes</li>
                                    <li>Cash on Delivery (COD) is available for orders within Pakistan</li>
                                    <li>Full payment must be made upon delivery for COD orders</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">5. Shipping & Delivery</h2>
                                <p className="text-gray-600 mb-3">
                                    Our shipping policies:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                    <li>We deliver across Pakistan</li>
                                    <li>Delivery times are estimates and not guaranteed</li>
                                    <li>Risk of loss passes to you upon delivery</li>
                                    <li>We are not responsible for delays caused by courier services or unforeseen circumstances</li>
                                </ul>
                                <p className="text-gray-600 mt-3">
                                    For detailed shipping information, please visit our{" "}
                                    <Link href="/shipping-policy" className="text-primary hover:underline">
                                        Shipping Policy
                                    </Link>
                                    .
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">6. Returns & Refunds</h2>
                                <p className="text-gray-600">
                                    Returns are accepted under specific conditions. Custom/personalized items cannot
                                    be returned unless defective. For complete details, please refer to our{" "}
                                    <Link href="/refund-policy" className="text-primary hover:underline">
                                        Refund Policy
                                    </Link>
                                    .
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
                                <p className="text-gray-600">
                                    All content on this website, including but not limited to images, text, designs,
                                    logos, and product designs, is the property of EpoxySista. You may not reproduce,
                                    distribute, or use any content without our explicit written permission.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
                                <p className="text-gray-600">
                                    EpoxySista shall not be liable for any indirect, incidental, special, or
                                    consequential damages arising from the use of our website or products. Our
                                    liability is limited to the purchase price of the products.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">9. Privacy</h2>
                                <p className="text-gray-600">
                                    Your privacy is important to us. Please review our{" "}
                                    <Link href="/privacy-policy" className="text-primary hover:underline">
                                        Privacy Policy
                                    </Link>{" "}
                                    to understand how we collect, use, and protect your information.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to Terms</h2>
                                <p className="text-gray-600">
                                    We reserve the right to update these Terms and Conditions at any time. Changes
                                    will be effective immediately upon posting. Continued use of our website
                                    constitutes acceptance of the updated terms.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
                                <p className="text-gray-600">
                                    If you have any questions about these Terms and Conditions, please contact us:
                                </p>
                                <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-3">
                                    <li>
                                        Email:{" "}
                                        <a href="mailto:epoxysista@gmail.com" className="text-primary hover:underline">
                                            epoxysista@gmail.com
                                        </a>
                                    </li>
                                    <li>
                                        WhatsApp:{" "}
                                        <a
                                            href="https://wa.me/923022828770"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            +92 302 2828770
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsConditionsPage;
