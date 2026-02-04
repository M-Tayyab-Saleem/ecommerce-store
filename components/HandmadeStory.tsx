import React from "react";
import Image from "next/image";
import Link from "next/link";
// SectionHeading removed as unused

const HandmadeStory: React.FC = () => {
    return (
        <section className="section bg-gradient-to-b from-white to-gray-50">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative">
                        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                            <Image
                                src="/images/handmade-story.jpeg"
                                alt="Handmade resin jewelry crafting process"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-6 max-w-[200px] hidden md:block">
                            <p className="text-4xl font-bold text-primary mb-1">100%</p>
                            <p className="text-sm text-gray-600">Handcrafted with Love</p>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:pl-8">
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 block">
                            Our Story
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            The Art of Handmade Resin
                        </h2>
                        <div className="space-y-4 text-gray-600 mb-8">
                            <p>
                                Every piece you see at EpoxySista is born from a deep love for creativity
                                and attention to detail. What started as a passion project has grown into
                                a journey of crafting unique resin jewelry and décor that brings joy to
                                homes across Pakistan.
                            </p>
                            <p>
                                We pour our hearts into each creation — from selecting the perfect pigments
                                to carefully curing each piece to perfection. No two pieces are exactly alike,
                                and that&apos;s the beauty of handmade art.
                            </p>
                            <p className="font-medium text-gray-800">
                                When you choose EpoxySista, you&apos;re not just buying a product — you&apos;re
                                supporting local artistry and taking home a piece of someone&apos;s passion.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                                    🎨
                                </span>
                                <span className="text-sm font-medium text-gray-700">Unique Designs</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                                    ✨
                                </span>
                                <span className="text-sm font-medium text-gray-700">Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                                    💝
                                </span>
                                <span className="text-sm font-medium text-gray-700">Made with Love</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                                    🇵🇰
                                </span>
                                <span className="text-sm font-medium text-gray-700">Made in Pakistan</span>
                            </div>
                        </div>

                        <Link href="/about" className="btn-outline inline-block">
                            Learn More About Us
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HandmadeStory;
