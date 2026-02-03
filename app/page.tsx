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
import { IProduct } from "@/types/product";

// API base URL for server-side fetches
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Function to get products from backend API (server-side)
async function getProducts(): Promise<{
  latestProducts: IProduct[];
  bestSellerProducts: IProduct[];
  allProducts: IProduct[];
}> {
  try {
    // Fetch latest products
    const latestRes = await fetch(
      `${API_URL}/products?isLatest=true&limit=10&sort=createdAt&order=desc`,
      { next: { revalidate: 60 } } // Revalidate every 60 seconds
    );
    const latestData = await latestRes.json();

    // Fetch bestseller products  
    const bestSellerRes = await fetch(
      `${API_URL}/products?isBestSeller=true&limit=5`,
      { next: { revalidate: 60 } }
    );
    const bestSellerData = await bestSellerRes.json();

    // Fetch all products as fallback
    const allRes = await fetch(
      `${API_URL}/products?limit=10`,
      { next: { revalidate: 60 } }
    );
    const allData = await allRes.json();

    return {
      latestProducts: latestData.data || [],
      bestSellerProducts: bestSellerData.data || [],
      allProducts: allData.data || [],
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty arrays if API fails
    return {
      latestProducts: [],
      bestSellerProducts: [],
      allProducts: [],
    };
  }
}

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