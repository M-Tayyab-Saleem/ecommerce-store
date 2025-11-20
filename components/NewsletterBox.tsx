"use client";

import React, { FormEvent } from 'react';
import Image from 'next/image';
import { assets } from '@/lib/assets';

const NewsletterBox: React.FC = () => {
  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className='flex flex-col md:flex-row justify-between items-center py-16 px-8 my-20 bg-gray-50 rounded-2xl'>
        {/* Left Side: Text and Form */}
        <div className='w-full md:w-1/2 text-center md:text-left'>
            <p className='text-xs font-semibold uppercase tracking-widest text-[#ff5e5e] mb-2'>
                Stay Informed
            </p>
            <p className='text-3xl font-heading font-bold text-gray-900'>
                Subscribe to our newsletter
            </p>
            <p className='text-gray-600 mt-3 mb-6 max-w-sm mx-auto md:mx-0'>
                Get 20% off your first order and be the first to know about new arrivals and exclusive sales.
            </p>
            <form onSubmit={onSubmitHandler} className='w-full flex mt-6 max-w-sm mx-auto md:mx-0'>
                <input 
                    type="email" 
                    placeholder='Enter your email address' 
                    className='flex-1 outline-none border border-r-0 border-gray-300 p-4 rounded-l-full text-sm' 
                    required
                />
                <button 
                    type='submit' 
                    className='bg-black text-white text-sm px-6 py-4 rounded-r-full font-semibold hover:bg-[#ff5e5e] transition duration-300'
                >
                    SUBSCRIBE
                </button>
            </form>
        </div>

        {/* Right Side: Mock Image Placeholder */}
        <div className='hidden md:block md:w-1/3 relative h-64 mt-8 md:mt-0'>
             <Image 
                src={assets.contact_img} 
                alt="Newsletter promotion" 
                width={300}
                height={200}
                className='w-full h-full object-cover rounded-2xl opacity-80'
            />
        </div>
    </div>
  );
};

export default NewsletterBox;