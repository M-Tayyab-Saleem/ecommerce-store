import React from 'react'
import Hero from '@/components/Hero'
import LatestCollection from '@/components/LatestCollection'
import BestSeller from '@/components/BestSeller'
import OurPolicy from '@/components/OurPolicy'
import NewsletterBox from '@/components/NewsletterBox'
import { StaticImageData } from 'next/image'

// 1. Import your product data directly
// This code runs ON THE SERVER!
import { products } from  "@/lib/assets" // Assuming you moved assets.js here

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  date: number;
  bestseller: boolean;
};

// 2. Create a function to get the data (this is how you do it)
const getProducts = async () => {
  // In the future, this could be an API call:
  // const res = await fetch('https://api.my-store.com/products')
  // const data = await res.json()
  // return data;

  // For now, we just return your imported mock data
  return {
    allProducts: products as Product[],
    latestProducts: products.slice(0, 10) as Product[],
    bestSellerProducts: products.filter((item) => item.bestseller).slice(0, 5) as Product[],
  };
}

// 3. Your page is now an async component
export default async function Home() {
  
  // 4. Fetch the data right here
  const { latestProducts, bestSellerProducts } = await getProducts();

  return (
    <div>
      <Hero />
      <div className="container-custom space-y-24 mt-20">
        {/* 5. Pass the data down as props! */}
        {/* No more useContext for this data */}
        <LatestCollection products={latestProducts} />
        <BestSeller products={bestSellerProducts} />
        <OurPolicy />
        <NewsletterBox />
      </div>
    </div>
  )
}