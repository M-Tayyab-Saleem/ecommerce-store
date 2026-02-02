import React from "react";
import TrustBadge from "./TrustBadge";
import SectionHeading from "./SectionHeading";

const WhyChooseUs: React.FC = () => {
    return (
        <section className="section">
            <div className="container-custom">
                <SectionHeading
                    label="Why EpoxySista?"
                    title="What Makes Us Different"
                    subtitle="We're committed to quality, convenience, and your satisfaction"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <TrustBadge type="handmade" />
                    <TrustBadge type="cod" />
                    <TrustBadge type="delivery" />
                    <TrustBadge type="custom" />
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Every purchase supports local artisans and small business in Pakistan.
                        We take pride in delivering quality pieces that you'll treasure for years.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
