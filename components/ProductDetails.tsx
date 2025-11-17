"use client"; 

import React, { useState, useContext } from 'react';
import { ShopContext, ShopContextType } from '@/context/ShopContext';
import { assets, Product } from '@/lib/assets';
import Image from 'next/image';

interface ProductDetailsProps {
  productData: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productData }) => {
  const { currency, addToCart } = useContext(ShopContext) as ShopContextType;
  
  // I've simplified the logic here. The original 'image' state was for the main image.
  // And the 'size' state is for the selected size.
  const [mainImage, setMainImage] = useState(productData.image[0]);
  const [size, setSize] = useState("");
  
  const handleAddToCart = () => {
    if (!size) {
      alert("Please select a size");
      return;
    }
    // Note: Our simplified context doesn't use size. We'll just add the item.
    // To implement size, we'd need a more complex cart state.
    addToCart(productData._id);
    alert(`Added ${productData.name} to cart!`);
  }

  return (
    <div className="border-t pt-10">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <Image
                onClick={() => setMainImage(item)}
                src={item}
                key={index}
                alt={`${productData.name} thumbnail ${index + 1}`}
                width={200} 
                height={200}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%] ">
            <Image 
              src={mainImage} 
              alt={productData.name} 
              width={1000} 
              height={1000} 
              className="w-full h-auto" 
              priority 
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <Image src={assets.star_icon} alt="star" className="w-3.5" width={14} height={14} />
            <Image src={assets.star_icon} alt="star" className="w-3.5" width={14} height={14} />
            <Image src={assets.star_icon} alt="star" className="w-3.5" width={14} height={14} />
            <Image src={assets.star_icon} alt="star" className="w-3.5" width={14} height={14} />
            <Image src={assets.star_dull_icon} alt="star" className="w-3.5" width={14} height={14} />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{currency} {productData.price}</p>
          <p>{productData.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button 
                  onClick={() => setSize(item)} 
                  className={`border py-2 px-4 bg-gray-100 ${item === size ? "border-orange-500" : ""}`} 
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleAddToCart} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      {/* Description and Review System */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Review (122)</p>
        </div>
        <div className="flex flex-col border gap-4 px-6 py-6 text-sm text-gray-500">
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laudantium deleniti expedita natus quae. Repudiandae, perferendis!</p>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatum quidem mollitia reprehenderit dolore dolorem neque.</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;