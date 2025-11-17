import React from 'react';
import { assets } from  "@/lib/assets";
import Image from "next/image";

const OurPolicy: React.FC = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs md:text-base text-gray-700'>
        <div>
            <Image src={assets.exchange_icon} alt="Exchange icon" className='w-12 m-auto mb-5' width={48} height={48} />
            <p className='font-semibold'>Easy Exchange Policy</p>
            <p className='text-gray-400'>We offer hassle free exchange Policy</p>
        </div>
        <div>
            <Image src={assets.quality_icon} alt="Quality icon" className='w-12 m-auto mb-5' width={48} height={48} />
            <p className='font-semibold'>7 Days Return Policy</p>
            <p className='text-gray-400'>We offer 7 days free return Policy</p>
        </div>
        <div>
            <Image src={assets.support_img} alt="Support icon" className='w-12 m-auto mb-5' width={48} height={48} />
            <p className='font-semibold'>Best customer support</p>
            <p className='text-gray-400'>we provide 24/7 customer support</p>
        </div>
    </div>
  );
};

export default OurPolicy;

