import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import TrustBadge from "@/components/TrustBadge";
import WhatsAppCTA from "@/components/WhatsAppCTA";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about EpoxySista - handcrafted resin jewelry and décor made with love in Pakistan. Our story, our craft, our commitment to quality.",
};

const About = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-white py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 block">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About EpoxySista
            </h1>
            <p className="text-lg text-gray-600">
              Where creativity meets craftsmanship. Every piece tells a story of
              passion, patience, and the art of resin.
            </p>
          </div>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/about-hero.jpeg"
                  alt="EpoxySista crafting process"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                The Heart Behind the Art
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  EpoxySista was born from a simple passion — the joy of creating
                  beautiful things with my own hands. What started as a hobby during
                  quiet evenings has blossomed into a journey of crafting unique resin
                  pieces that bring smiles to homes across Pakistan.
                </p>
                <p>
                  Every piece you see here is made with love, right here in Pakistan.
                  From selecting the perfect pigments to carefully pouring and curing
                  each creation, I pour my heart into every step of the process.
                  No two pieces are exactly alike — and that's the magic of handmade art.
                </p>
                <p className="font-medium text-gray-800">
                  When you choose EpoxySista, you're not just buying a product. You're
                  supporting a dream, celebrating handmade artistry, and taking home a
                  piece that was crafted just for you.
                </p>
              </div>

              <div className="mt-8">
                <WhatsAppCTA
                  message="Hi! I'd like to learn more about EpoxySista and your products."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2 block">
              What We Believe
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TrustBadge type="handmade" />
            <TrustBadge type="cod" />
            <TrustBadge type="delivery" />
            <TrustBadge type="custom" />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2 block">
              How It's Made
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Craft Behind Each Piece
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every creation goes through a meticulous process to ensure quality and beauty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Design",
                description: "Each piece starts with a creative vision and careful planning",
              },
              {
                step: "02",
                title: "Mix & Pour",
                description: "Premium resin is mixed with pigments and poured with precision",
              },
              {
                step: "03",
                title: "Cure",
                description: "Pieces cure for 24-48 hours to achieve perfect hardness",
              },
              {
                step: "04",
                title: "Finish",
                description: "Final polishing and quality check before packaging",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-sm bg-primary/5">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Own a Piece of Art?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Explore our collection or get in touch for a custom creation made just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary">
              Shop Collection
            </Link>
            <Link href="/contact" className="btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;