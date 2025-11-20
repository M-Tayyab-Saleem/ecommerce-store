"use client"; 

import React, { useState, useContext, useMemo } from 'react';
import { ShopContext, ShopContextType } from '@/context/ShopContext';
import { assets, Product } from '@/lib/assets';
import Image from 'next/image';
import { Share2, Scale, HelpCircle } from 'lucide-react';

interface ProductDetailsProps {
  productData: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productData }) => {
  const { 
    currency, 
    addToCart, 
    updateCartItemQuantity, 
    getProductQuantity 
  } = useContext(ShopContext) as ShopContextType;
  
  const [mainImage, setMainImage] = useState(productData.image[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("Black"); // Mock color state
  
  const cartQuantity = getProductQuantity(productData._id, selectedSize);
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }
    // Add the selected quantity of the item
    updateCartItemQuantity(productData._id, selectedSize, cartQuantity + quantity);
    alert(`Added ${quantity} x ${productData.name} (Size: ${selectedSize}) to cart!`);
  }

  // Timer logic mock
  const timer = useMemo(() => ({
    days: 0, hours: 5, minutes: 59, seconds: 47 
  }), []);

  // Mock colors for UI
  const mockColors = ['#000000', '#ADD8E6', '#ff5e5e', '#ffffff'];

  // --- JSX structure updated to match product.png ---
  return (
    <div className="py-10 border-t">
      <div className="flex gap-12 sm:gap-16 flex-col md:flex-row">
        
        {/* Left Side: Images (Vertical Thumbnails) */}
        <div className="flex w-full md:w-1/2">
          <div className="flex flex-col gap-3 mr-4 no-scrollbar max-h-[80vh] overflow-y-auto">
            {productData.image.map((item, index) => (
              <Image
                onClick={() => setMainImage(item)}
                src={item}
                key={index}
                alt={`${productData.name} thumbnail ${index + 1}`}
                width={80} 
                height={100}
                className={`w-20 h-24 object-cover border-2 cursor-pointer transition ${
                    mainImage === item ? 'border-black' : 'border-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex-1 rounded-lg overflow-hidden">
            <Image 
              src={mainImage} 
              alt={productData.name} 
              width={700} 
              height={900} 
              className="w-full h-auto object-cover" 
              priority 
            />
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="md:w-1/2 pt-4">
          <h1 className="font-heading text-4xl font-normal text-gray-900">
            {productData.name}
          </h1>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mt-4">
            <div className='flex'>
                {[...Array(4)].map((_, i) => (
                    <Image key={i} src={assets.star_icon} alt="star" className="w-3.5 h-3.5" width={14} height={14} />
                ))}
                <Image src={assets.star_dull_icon} alt="star" className="w-3.5 h-3.5" width={14} height={14} />
            </div>
            <p className="pl-2 text-sm text-gray-600">(9)</p>
          </div>

          {/* Price and Sale Badge */}
          <div className="flex items-center gap-4 mt-4">
            <p className="text-3xl font-heading font-bold">{currency}{productData.price}.00</p>
            <span className="bg-[#ff5e5e] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              SAVE 25%
            </span>
          </div>

          {/* Timer */}
          <div className="bg-[#ff5e5e] text-white p-3 mt-6 text-center rounded-lg">
            <p className="text-sm font-semibold mb-1">Hurry up! Sale ends in:</p>
            <div className="flex justify-center gap-3 text-lg font-bold">
              <span>{String(timer.days).padStart(2, '0')}</span>:
              <span>{String(timer.hours).padStart(2, '0')}</span>:
              <span>{String(timer.minutes).padStart(2, '0')}</span>:
              <span>{String(timer.seconds).padStart(2, '0')}</span>
            </div>
          </div>
          
          {/* Stock */}
          <p className="text-sm text-gray-700 mt-4">Only **9 item(s)** left in stock!</p>

          {/* Size Selector */}
          <div className="my-6">
            <p className="text-sm font-semibold mb-3">SIZE: <span className='uppercase text-black'>{selectedSize || 'Select'}</span></p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button 
                  onClick={() => setSelectedSize(item)} 
                  className={`px-4 py-2 border font-medium text-sm transition ${
                    selectedSize === item 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  }`} 
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="my-6">
            <p className="text-sm font-semibold mb-3">COLOR: <span className='uppercase text-black'>{color}</span></p>
            <div className="flex gap-2">
              {mockColors.map((hex, index) => (
                <button 
                  key={index}
                  onClick={() => setColor(hex)}
                  className={`w-6 h-6 rounded-full border-2 transition ${
                    color === hex ? 'border-black scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: hex }}
                ></button>
              ))}
            </div>
          </div>

          {/* Quantity and Cart Buttons */}
          <div className="flex items-center gap-4 mt-8">
            {/* Quantity Control */}
            <div className="flex border border-gray-300">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-lg font-semibold hover:bg-gray-50 transition"
              >
                -
              </button>
              <span className="px-5 py-3 text-lg border-x border-gray-300">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 text-lg font-semibold hover:bg-gray-50 transition"
              >
                +
              </button>
            </div>
            
            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="flex-1 border border-black text-black py-3 text-sm font-bold uppercase tracking-wider hover:bg-black hover:text-white transition"
            >
              Add to cart
            </button>
            
          </div>
          
          {/* Buy Now Button (Mock) */}
          <button className="w-full bg-black text-white py-3 mt-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition">
              Buy Now
          </button>
          
          {/* Meta Links */}
          <div className="flex items-center justify-between text-sm text-gray-600 mt-6 pt-4 border-t border-gray-100">
            <span className="flex items-center gap-2 cursor-pointer hover:text-black transition">
                <Scale size={16} /> Compare
            </span>
            <span className="flex items-center gap-2 cursor-pointer hover:text-black transition">
                <HelpCircle size={16} /> Ask a question
            </span>
            <span className="flex items-center gap-2 cursor-pointer hover:text-black transition">
                <Share2 size={16} /> Share
            </span>
          </div>

          {/* Delivery & Payment Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-700 font-semibold mb-1">
              Estimated Delivery: Jul 30 - Aug 05
            </p>
            <p className="text-sm text-gray-700">
              Free Shipping & Returns: On all orders over $75
            </p>
            
            <div className="mt-4 flex flex-wrap gap-2">
                {/* Payment Icons Placeholder */}
                <Image src={assets.stripe_logo} alt="Payment" width={40} height={20} className="opacity-70" />
                <Image src={assets.razorpay_logo} alt="Payment" width={40} height={20} className="opacity-70" />
                {/* Add more mock icons if desired */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Description and Review System (from original plan, simplified) */}
      <div className="mt-20">
        <div className="flex border-b border-gray-200">
          <b className="px-5 py-3 text-sm border-b-2 border-black font-semibold">Description</b>
          <p className="px-5 py-3 text-sm text-gray-600">Review (122)</p>
        </div>
        <div className="flex flex-col gap-4 px-0 py-6 text-sm text-gray-500">
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laudantium deleniti expedita natus quae. Repudiandae, perferendis!</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatum quidem mollitia reprehenderit dolore dolorem neque.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;