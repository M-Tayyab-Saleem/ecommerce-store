import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Refund & Return Policy',
    description: 'Learn about our refund and return policy for handmade resin products. Customer satisfaction is our priority.',
    robots: {
        index: true,
        follow: true,
    },
};

export default function RefundPolicyPage() {
    return (
        <div className="container-custom py-20 border-t">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund & Return Policy</h1>
                <p className="text-gray-600 mb-8">Last updated: February 3, 2026</p>

                <div className="prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
                        <p className="text-gray-700 leading-relaxed">
                            At EpoxySista, customer satisfaction is our top priority. We take great pride in our handmade resin products
                            and want you to be completely happy with your purchase.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Damaged or Defective Items</h2>
                        <p className="text-gray-700 mb-4">
                            If you receive a damaged or defective product, please contact us within <strong>48 hours of delivery</strong> with:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li>Clear photos of the damaged item</li>
                            <li>Photos of the packaging</li>
                            <li>Your order number</li>
                        </ul>
                        <p className="text-gray-700">
                            We will provide a replacement or full refund for damaged/defective items.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Wrong Item Delivered</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you received the wrong item, please contact us within <strong>48 hours of delivery</strong>. We will arrange
                            to collect the wrong item and send you the correct one at no additional cost.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Handmade Product Disclaimer</h2>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                            <p className="text-gray-800 leading-relaxed">
                                <strong>Important:</strong> All our products are handmade with love. Slight variations in color, size, pattern,
                                and design are natural and expected. These variations make each piece unique and are not considered defects.
                                We cannot accept returns based on minor variations that are inherent to handmade products.
                            </p>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Change of Mind</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Due to the custom nature of our handmade products, we generally do not accept returns for change of mind.
                            However, we understand special circumstances may arise. Please contact us to discuss your situation.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Custom Orders</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Custom-made products cannot be returned or refunded as they are made specifically according to your requirements.
                            Please ensure you provide accurate customization details when placing your order.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Process</h2>
                        <p className="text-gray-700 mb-4">Once we receive and inspect the returned item (if applicable), we will:</p>
                        <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                            <li>Notify you of the approval or rejection of your refund</li>
                            <li>If approved, process the refund to your original payment method</li>
                            <li>For COD orders, refund will be processed via bank transfer</li>
                        </ol>
                        <p className="text-gray-700 mt-4">
                            Refunds typically take <strong>7-10 business days</strong> to reflect in your account.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Non-Returnable Items</h2>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Products used, damaged, or not in original condition</li>
                            <li>Products personalized or customized to your specifications</li>
                            <li>Products without proper photos of damage (if claiming damage)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Initiate a Return</h2>
                        <p className="text-gray-700 mb-4">To start a return or report an issue:</p>
                        <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-4">
                            <li><Link href="/contact" className="text-primary hover:underline">Contact us</Link> within 48 hours of delivery</li>
                            <li>Provide your order number and photos (if damaged)</li>
                            <li>Our team will review and respond within 24 hours</li>
                            <li>Follow the instructions provided for return/replacement</li>
                        </ol>
                    </section>

                    <section className="mt-10">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">Questions?</h3>
                            <p className="text-blue-800">
                                If you have any questions about our refund policy, please don't hesitate to{' '}
                                <Link href="/contact" className="text-primary hover:underline font-semibold">contact us</Link>.
                                We're here to help!
                            </p>
                        </div>
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
