import React from 'react';
import { assets } from "@/public/assets/assets";
import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <div className='flex flex-col sm:flex-row border border-gray-400'>
          {/* {Left side of hero section} */}
        <div className="flex w-full sm:w-1/2 items-center justify-center py-10 sm:py-0">
            <div className="text-[#414141]">
                <div className="flex items-center gap-2">
                    <p className='w-8 bg-[#414141] md:w-11 h-[2px]'></p>
                    <p className='font-medium text-sm sm:text-base'>OUR BESTSELLERS</p>
                </div>
                <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
                <div className='flex items-center gap-2'>
                <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                  <p className='w-8 bg-[#414141] md:w-11 h-[2px]'></p>
                </div>
            </div> 
        </div>
        {/* Hero Section right side */}
        <Image className='w-full sm:w-1/2' src={assets.hero_img} alt="Hero image" width={800} height={600} />
    </div>
  );
};

export default Hero;

