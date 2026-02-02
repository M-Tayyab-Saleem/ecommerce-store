import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Shipping Policy',
    description: 'Learn about our shipping policy, delivery timeframes, and Cash on Delivery options for handmade resin products across Pakistan.',
    robots: {
        index: true,
        follow: true,
    },
};

export default function ShippingPolicyPage() {
    return (
        <div className="container-custom py-20 border-t">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping Policy</h1>

                <div className="prose prose-gray max-w-none">
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Across Pakistan</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We deliver our handmade resin products all over Pakistan! We partner with reliable courier services
                            to ensure your products reach you safely and on time.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Timeframe</h2>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li><strong>Processing Time:</strong> 3-5 business days to create and pack your order</li>
                            <li><strong>Karachi:</strong> 1-2 business days after dispatch</li>
                            <li><strong>Lahore, Islamabad, Rawalpindi:</strong> 2-3 business days after dispatch</li>
                            <li><strong>Other Major Cities:</strong> 3-5 business days after dispatch</li>
                            <li><strong>Remote Areas:</strong> 5-7 business days after dispatch</li>
                        </ul>
                        <p className="text-gray-700 mt-4">
                            You will receive tracking information via SMS/WhatsApp once your order is dispatched.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Charges</h2>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <ul className="list-none text-gray-700 space-y-3">
                                <li className="flex justify-between">
                                    <span>Orders below PKR 3,000:</span>
                                    <span className="font-semibold">PKR 200</span>
                                </li>
                                <li className="flex justify-between text-green-700 font-semibold">
                                    <span>Orders above PKR 3,000:</span>
                                    <span>FREE DELIVERY 🎉</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cash on Delivery (COD)</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Yes! We offer Cash on Delivery (COD) for all orders across Pakistan. Pay when you receive your
                            handmade products at your doorstep.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-900">
                                <strong>Note:</strong> For orders above PKR 5,000, we may require a 50% advance payment to confirm the order.
                            </p>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Packaging</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Each product is carefully packaged with bubble wrap and placed in a sturdy box to ensure it reaches
                            you in perfect condition. Our handmade items are delicate and we take extra care during packaging.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tracking Your Order</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Once your order is dispatched, we will share:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Courier company name</li>
                            <li>Tracking number</li>
                            <li>Estimated delivery date</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions?</h2>
                        <p className="text-gray-700 leading-relaxed">
                            If you have any questions about shipping, please <Link href="/contact" className="text-primary hover:underline">contact us</Link> and
                            we'll be happy to help!
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
