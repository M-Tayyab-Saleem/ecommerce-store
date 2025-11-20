import React from 'react';
import Image from 'next/image';
import { assets } from '@/lib/assets';
import Link from 'next/link';

// We need the Title component from your original project
const TitleComponent = ({ text1, text2 }: { text1: string, text2: string }) => {
  return (
    <div className='flex flex-col items-center justify-center mb-6'>
        <p className='text-xs text-gray-500 uppercase tracking-widest'>
            {text1}
        </p> 
        <h2 className='text-3xl font-heading font-bold text-gray-900 mt-1'>
            {text2}
        </h2>
    </div>
  );
};


// Now, the About page
const About = () => {
  return (
    <div className="py-10 border-t border-gray-100">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-heading font-bold text-gray-900">
          About FASCO
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          <Link href="/" className="hover:text-black">Home</Link> / About
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
        <div className="md:w-1/2">
          <Image 
            src={assets.about_img} 
            alt="About us - collection of clothes" 
            width={600} 
            height={600} 
            className="w-full h-auto object-cover"
          />
        </div>
        <div className="md:w-1/2 flex flex-col gap-6 text-gray-700 p-4">
          <TitleComponent text1="OUR HERITAGE" text2="The FASCO Story" />
          <p className='text-lg font-heading text-black'>
            Born from a desire to redefine contemporary fashion, FASCO was founded on the principle of accessible luxury and sustainable craftsmanship.
          </p>
          <p>
            We believe that clothing should be both a reflection of individuality and a commitment to quality. Our design philosophy centers around minimalist elegance, using premium materials to create pieces that last beyond seasonal trends. Every stitch, fabric choice, and detail is meticulously considered to deliver exceptional comfort and style.
          </p>
          <p>
            Our commitment extends beyond our garments; we strive for transparency and ethical sourcing in all our operations, ensuring that your choice supports responsible fashion.
          </p>
          <Link href="/contact" className="inline-block border border-black text-black py-3 px-6 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition w-fit">
            Connect With Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;