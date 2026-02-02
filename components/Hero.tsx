"use client";

import React, { useState, useEffect } from 'react';
import { assets } from "@/lib/assets";
import Image from "next/image";
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Install lucide-react or use SVGs

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { image: assets.hero_img, title: "Elegance", subtitle: "Redefined" },
    { image: assets.about_img, title: "Modern", subtitle: "Craftsmanship" },
    { image: assets.contact_img, title: "Exclusive", subtitle: "Collections" }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] bg-hero-bg overflow-hidden flex items-center container-custom py-10 pt-32">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10 py-[130px]">
        {/* Text Content */}
        <div className="space-y-6 animate-fade-in-up order-2 md:order-1">
          <p className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-primary drop-shadow-sm">
            New Collection 2025
          </p>
          <h1 className="text-5xl md:text-[3.5rem] lg:text-[4rem] font-extrabold text-[#333] leading-tight transition-all duration-500">
            {slides[currentSlide].title} <br />
            <span className="text-primary italic">{slides[currentSlide].subtitle}</span>
          </h1>
          <p className="text-[#555] text-lg md:text-xl max-w-md font-medium leading-relaxed">
            Discover the latest trends in fashion with our exclusive collection. Quality, style, and comfort in every piece.
          </p>
          <div className="pt-4 flex gap-4">
            <Link href="/collection"><button className="btn-primary">Shop Now</button></Link>
            <Link href="/about"><button className="btn-outline">Explore</button></Link>
          </div>
        </div>

        {/* Hero Image Slider */}
        <div className="relative h-[390px] md:h-[465px] w-full order-1 md:order-2 group">
          <Image
            src={slides[currentSlide].image}
            alt="Hero Image"
            fill
            className="object-cover rounded-[15px] shadow-xl transition-opacity duration-700"
            priority
          />
          {/* Controls */}
          <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft className="text-primary" />
          </button>
          <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;