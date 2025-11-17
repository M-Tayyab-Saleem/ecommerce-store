import React from 'react';
import Image from 'next/image';
import { assets } from '@/lib/assets';
import Title from '@/components/Title'; // Re-using the Title component

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

// Now, the Contact page
const Contact = () => {
  return (
    <div className="py-10 border-t">
      <div className="text-center mb-10">
        <TitleComponent text1="GET IN" text2="TOUCH" />
        <p className="text-4xl font-bold prata-regular">Contact Us</p>
      </div>
      <div className="flex flex-col md:flex-row items-start gap-10">
        {/* Left Side: Form */}
        <div className="flex-1 w-full">
          <h3 className="text-2xl font-semibold mb-5">Send us a message</h3>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 p-3 rounded outline-none"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 p-3 rounded outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="border border-gray-300 p-3 rounded outline-none"
            />
            <textarea
              placeholder="Your Message"
              rows={6}
              className="border border-gray-300 p-3 rounded outline-none"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-black text-white py-3 rounded text-lg active:bg-gray-700"
            >
              Submit
            </button>
          </form>
        </div>
        
        {/* Right Side: Details & Image */}
        <div className="flex-1 w-full flex flex-col gap-5">
          <h3 className="text-2xl font-semibold">Contact Details</h3>
          <div className="text-gray-700 flex flex-col gap-2">
            <p><strong>Phone:</strong> +1-212-456-7890</p>
            <p><strong>Email:</strong> contact@epoxysista.com</p>
            <p><strong>Address:</strong> 123 Fashion Ave, New York, NY 10001</p>
          </div>
          <Image 
            src={assets.contact_img} 
            alt="Contact" 
            width={500} 
            height={400} 
            className="rounded-lg shadow-lg w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;