"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: "/images/hero-1.jpeg",
    title: "Handmade",
    subtitle: "Resin Artistry",
    description:
      "Discover unique, handcrafted resin jewelry and décor made with love in Pakistan.",
  },
  {
    image: "/images/hero-2.jpeg",
    title: "Custom",
    subtitle: "Creations",
    description:
      "Personalize your pieces with names, colors, and designs. Made just for you.",
  },
  {
    image: "/images/hero-3.jpeg",
    title: "Beautiful",
    subtitle: "Home Décor",
    description:
      "Transform your space with stunning resin art pieces and decorative items.",
  },
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] bg-hero-bg overflow-hidden flex items-center pt-10">
      <div className="container-custom w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-20">
          {/* Text Content */}
          <div className="space-y-6 order-2 lg:order-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-gray-700">
                New Collection 2025
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {slides[currentSlide].title}
              <br />
              <span className="text-primary">{slides[currentSlide].subtitle}</span>
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg max-w-lg mx-auto lg:mx-0">
              {slides[currentSlide].description}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/products" className="btn-primary text-center">
                Shop Now
              </Link>
              <Link href="/about" className="btn-outline text-center">
                Our Story
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-lg">💰</span> COD Available
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-lg">🇵🇰</span> Pakistan-wide Delivery
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-lg">✨</span> Custom Orders
              </span>
            </div>
          </div>

          {/* Hero Image Slider */}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] max-w-lg mx-auto">
              {/* Main Image */}
              <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={slides[currentSlide].image}
                  alt={`${slides[currentSlide].title} ${slides[currentSlide].subtitle}`}
                  fill
                  className="object-cover transition-opacity duration-700"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

              {/* Navigation Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide
                        ? "bg-primary w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;