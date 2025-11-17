import React from 'react';
import Image from 'next/image';
import { assets } from '@/lib/assets';
import Title from '@/components/Title'; // Make sure you have this component migrated

// We need the Title component from your original project
// Let's create `components/Title.tsx`
// (If you already have this, you can skip this file)

const TitleComponent = ({ text1, text2 }: { text1: string, text2: string }) => {
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-gray-500'>{text1} <span className='text-gray-700 font-medium'>{text2}</span></p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
    </div>
  );
};


// Now, the About page
const About = () => {
  return (
    <div className="py-10 border-t">
      <div className="text-center mb-10">
        <TitleComponent text1="ABOUT" text2="US" />
        <p className="text-4xl font-bold prata-regular">Who We Are</p>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <Image 
            src={assets.about_img} 
            alt="About us" 
            width={600} 
            height={600} 
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="flex-1 flex flex-col gap-5 text-gray-700">
          <h3 className="text-2xl font-semibold">Our Story</h3>
          <p>
            Welcome to EpoxySista! We started with a simple idea: to bring high-quality,
            stylish, and affordable fashion to everyone. Our journey began in a small
            studio, driven by a passion for design and a commitment to quality.
          </p>
          <h3 className="text-2xl font-semibold">Our Mission</h3>
          <p>
            Our mission is to empower you to express your unique style with confidence.
            We believe that fashion is more than just clothes; it's a form of
            self-expression. We meticulously curate our collections, ensuring
            every piece meets our standards for quality, comfort, and style.
          </p>
          <p>
            From the latest trends to timeless classics, we're dedicated to
            providing you with a seamless shopping experience, from browsing to
            delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;