import React from 'react';
import { assets } from  "@/lib/assets";
import Image from "next/image";

const OurPolicy: React.FC = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-4 text-center py-16 bg-gray-50 rounded-xl'>
        <div className="w-full sm:w-1/3 p-4">
            <Image 
                src={assets.exchange_icon} 
                alt="Exchange icon" 
                className='w-10 h-10 m-auto mb-3 opacity-80' 
                width={40} 
                height={40} 
            />
            <p className='font-heading text-lg font-semibold text-black mb-1'>Easy Exchange Policy</p>
            <p className='text-sm text-gray-600'>We offer hassle-free exchange within 7 days.</p>
        </div>
        <div className="w-full sm:w-1/3 p-4 border-t sm:border-t-0 sm:border-x border-gray-200">
            <Image 
                src={assets.quality_icon} 
                alt="Return icon" 
                className='w-10 h-10 m-auto mb-3 opacity-80' 
                width={40} 
                height={40} 
            />
            <p className='font-heading text-lg font-semibold text-black mb-1'>7 Days Return Policy</p>
            <p className='text-sm text-gray-600'>Shop confidently with our free return period.</p>
        </div>
        <div className="w-full sm:w-1/3 p-4">
            <Image 
                src={assets.support_img} 
                alt="Support icon" 
                className='w-10 h-10 m-auto mb-3 opacity-80' 
                width={40} 
                height={40} 
            />
            <p className='font-heading text-lg font-semibold text-black mb-1'>Best Customer Support</p>
            <p className='text-sm text-gray-600'>Dedicated 24/7 assistance for all your needs.</p>
        </div>
    </div>
  );
};

export default OurPolicy;