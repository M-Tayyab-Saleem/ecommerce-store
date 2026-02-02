import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Learn how EpoxySista collects, uses, and protects your personal information when you shop for handmade resin products.',
    robots: {
        index: true,
        follow: true,
    },
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container-custom py-20 border-t">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-600 mb-8">Last updated: February 3, 2026</p>

                <div className="prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
                        <p className="text-gray-700 leading-relaxed">
                            At EpoxySista, we are committed to protecting your privacy. This Privacy Policy explains how we collect,
                            use, disclose, and safeguard your information when you visit our website and purchase our handmade resin products.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                        <p className="text-gray-700 mb-4">When you place an order, we collect:</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li>Full name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Shipping address</li>
                            <li>Payment information (for online payments)</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatic Information</h3>
                        <p className="text-gray-700 mb-4">We may collect information about your device and browsing actions:</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>IP address</li>
                            <li>Browser type</li>
                            <li>Pages visited</li>
                            <li>Time and date of visit</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
                        <p className="text-gray-700 mb-4">We useyour information to:</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Process and fulfill your orders</li>
                            <li>Send order confirmations and tracking information</li>
                            <li>Respond to your inquiries and customer support requests</li>
                            <li>Send promotional emails (only if you opt-in)</li>
                            <li>Improve our products and services</li>
                            <li>Prevent fraudulent transactions</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We do not sell, trade, or rent your personal information to third parties. We may share your information with:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li><strong>Courier Services:</strong> To deliver your orders</li>
                            <li><strong>Payment Processors:</strong> To process your payments securely</li>
                            <li><strong>Legal Authorities:</strong> If required by law</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We implement appropriate security measures to protect your personal information. However, no method of
                            transmission over the Internet is 100% secure. We strive to use commercially acceptable means to protect
                            your data.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
                        <p className="text-gray-700 mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Access your personal information</li>
                            <li>Request correction of your data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use cookies to enhance your browsing experience and analyze website traffic. You can disable cookies
                            in your browser settings, but this may limit some features of our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have questions about this Privacy Policy, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <Link href="/products" className="btn-primary inline-block">
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    );
}
