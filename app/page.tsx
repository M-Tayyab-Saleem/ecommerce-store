import React from "react";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import LatestCollection from "@/components/LatestCollection";
import HandmadeStory from "@/components/HandmadeStory";
import BestSeller from "@/components/BestSeller";
import CustomizationHighlight from "@/components/CustomizationHighlight";
import WhyChooseUs from "@/components/WhyChooseUs";
import InstagramGallery from "@/components/InstagramGallery";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterBox from "@/components/NewsletterBox";
import WhatsAppCTA from "@/components/WhatsAppCTA";

// Import product data
import { products } from "@/lib/assets";

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

// Function to get products (server-side)
const getProducts = async () => {
  return {
    allProducts: products as Product[],
    latestProducts: products.slice(0, 10) as Product[],
    bestSellerProducts: products.filter((item) => item.bestseller).slice(0, 5) as Product[],
  };
};

export default async function Home() {
  const { latestProducts, bestSellerProducts, allProducts } = await getProducts();

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <div className="container-custom">
        {/* Category Grid - Shop by Category */}
        <CategoryGrid />

        {/* Latest Collection / New Arrivals */}
        <LatestCollection products={latestProducts} />
      </div>

      {/* Handmade Story - Full Width Background */}
      <HandmadeStory />

      <div className="container-custom">
        {/* Best Sellers */}
        <BestSeller products={bestSellerProducts.length > 0 ? bestSellerProducts : allProducts} />
      </div>

      {/* Customization Highlight - Full Width Background */}
      <CustomizationHighlight />

      <div className="container-custom">
        {/* Why Choose Us / Trust Badges */}
        <WhyChooseUs />

        {/* Testimonials */}
        <TestimonialsSection />
      </div>

      {/* Instagram Gallery - Full Width Background */}
      <InstagramGallery />

      <div className="container-custom">
        {/* Newsletter Signup */}
        <NewsletterBox />
      </div>

      {/* Floating WhatsApp Button */}
      <WhatsAppCTA variant="floating" />
    </>
  );
}