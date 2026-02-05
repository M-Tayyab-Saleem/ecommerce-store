import React from "react";
import Image from "next/image";
import Link from "next/link";
// SectionHeading removed as unused

const CustomizationHighlight: React.FC = () => {
    const customOptions = [
        {
            title: "Name Keychains",
            description: "Personalize with any name or word",
            image: "/images/custom-keychain.jpg",
        },
        {
            title: "Custom Colors",
            description: "Choose your favorite color combinations",
            image: "/images/custom-colors.jpg",
        },
        {
            title: "Special Designs",
            description: "Bring your ideas to life",
            image: "/images/custom-design.jpg",
        },
    ];

    return (
        <section className="section bg-primary/5">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2 block">
                        Make It Yours
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Custom Resin Creations
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Can&apos;t find exactly what you&apos;re looking for? We love creating custom pieces!
                        From personalized keychains with names to jewelry in your favorite colors.
                    </p>
                </div>

                {/* Custom Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {customOptions.map((option) => (
                        <div
                            key={option.title}
                            className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
                        >
                            <Image
                                src={option.image}
                                alt={option.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-xl font-bold mb-1">{option.title}</h3>
                                <p className="text-sm text-white/80">{option.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Box */}
                <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg text-center max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Have a Custom Design in Mind?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Send us your ideas on WhatsApp and let&apos;s create something special together.
                        Custom orders typically take 5-7 days to craft.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="https://wa.me/923022828770?text=Hi! I'd like to order a custom resin piece."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-whatsapp justify-center"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Chat on WhatsApp
                        </Link>
                        <Link href="/contact" className="btn-outline">
                            Contact Form
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CustomizationHighlight;
