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

// Product service for direct DB access
import { getProducts } from "@/lib/services/product-service";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch data directly from the database (Server Component)
  // This avoids "fetch failed" errors when deploying to Vercel (localhost issue)
  const [latestData, bestSellerData, allData] = await Promise.all([
    getProducts({ isLatest: true, limit: 10, sort: 'createdAt', order: 'desc' }),
    getProducts({ isBestSeller: true, limit: 5 }),
    getProducts({ limit: 10 })
  ]);

  const latestProducts = latestData.products as unknown as IProduct[];
  const bestSellerProducts = bestSellerData.products as unknown as IProduct[];
  const allProducts = allData.products as unknown as IProduct[];

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