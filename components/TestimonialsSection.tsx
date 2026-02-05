import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";

interface Testimonial {
    id: string;
    name: string;
    location: string;
    rating: number;
    text: string;
    image?: string;
}

const defaultTestimonials: Testimonial[] = [
    {
        id: "1",
        name: "Sara Ahmed",
        location: "Lahore",
        rating: 5,
        text: "Absolutely in love with my custom name keychain! The quality is amazing and it arrived so quickly. Will definitely order again!",
    },
    {
        id: "2",
        name: "Ayesha Khan",
        location: "Karachi",
        rating: 5,
        text: "The resin jewelry I ordered exceeded my expectations. Beautiful colors and perfect finish. Great communication throughout!",
    },
    {
        id: "3",
        name: "Fatima Malik",
        location: "Islamabad",
        rating: 5,
        text: "Perfect gift for my sister's birthday! She loved the custom design. The COD option made ordering so convenient.",
    },
];

interface TestimonialsSectionProps {
    testimonials?: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
    testimonials = defaultTestimonials,
}) => {
    return (
        <section className="section">
            <div className="container-custom">
                <SectionHeading
                    label="Customer Love"
                    title="What Our Customers Say"
                    subtitle="Real reviews from our happy customers across Pakistan"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={
                                            i < testimonial.rating
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}
                            </div>

                            {/* Text */}
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary font-semibold text-sm">
                                        {testimonial.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Future Reviews Note */}
                <div className="text-center mt-10">
                    <p className="text-sm text-gray-500">
                        Want to share your experience?{" "}
                        <a
                            href="https://wa.me/923022828770?text=Hi! I'd like to share my review."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            Send us your feedback on WhatsApp
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
