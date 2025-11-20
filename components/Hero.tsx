import React from 'react';
import { assets } from "@/lib/assets";
import Image from "next/image";
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] bg-[#f5f5f5] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src={assets.hero_img} 
          alt="Hero Background" 
          fill
          className="object-cover object-top opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full container-custom flex flex-col justify-center items-start z-10">
        <div className="max-w-2xl space-y-6 animate-fade-in-up">
          <p className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-white drop-shadow-md">
            New Collection 2025
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-tight drop-shadow-lg">
            Elegance <br />
            <span className="italic font-light">Redefined</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-md font-light leading-relaxed drop-shadow-md">
            Discover the latest trends in fashion with our exclusive collection. Quality, style, and comfort in every piece.
          </p>
          
          <div className="pt-4 flex gap-4">
            <Link href="/collection">
              <button className="bg-white text-primary px-10 py-4 rounded-none text-sm font-bold tracking-widest hover:bg-primary hover:text-white transition-all duration-300 uppercase border border-white">
                Shop Now
              </button>
            </Link>
            <Link href="/about">
              <button className="bg-transparent text-white px-10 py-4 rounded-none text-sm font-bold tracking-widest hover:bg-white hover:text-primary transition-all duration-300 uppercase border border-white backdrop-blur-sm">
                Explore
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;