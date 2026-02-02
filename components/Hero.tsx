import React from 'react';
import { assets } from "@/lib/assets";
import Image from "next/image";
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] bg-hero-bg overflow-hidden flex items-center container-custom py-10 pt-32">
      {/* Background Image is REMOVED or replaced with Gradient as per request, but user said "Hero Background: linear-gradient..." */}
      {/* However, the user also mentioned "Images: Use rounded corners...". This might refer to a product image in the Hero or just general images. 
          The existing Hero has a background image. The request says "Hero Background: linear-gradient...".
          I will Use the Gradient as the main background. 
          If I keep the image, it conflicts with the "background gradient" requirement unless it's an overlay or a separate image.
          Looking at the user requirement: "Hero Section ... overflow-hidden with the Hero Background gradient defined above."
          And "Images: Use rounded corners".
          I will assume the background image is replaced by the gradient, OR the image is now a separate element. 
          BUT looking at existing code, it's a background image. 
          I will replace the background image with the specific Gradient, and maybe add a rounded image if appropriate, 
          OR just apply the gradient to the section. 
          Actually, the request says "Hero Background ...". 
          Let's stick to the Gradient as the background. 
          I will remove the full-screen background image to honor the "Hero Background" constraint cleanly.
          If I need to put an image, I'll put it on the side (typical hero layout) or just keep text if no image provided.
          Wait, the content overlay has text.
          Let's try to make it a split layout or centered text on gradient if no specific image is asked for "Hero Image".
          The User said "Images: Use rounded corners". This implies there ARE images.
          Let's assume there's a Hero Image on the right or similar.
          I will use a split layout: Text on Left, Rounded Image on Right.
      */}

      <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10 py-[130px]">
        {/* Text Content */}
        <div className="space-y-6 animate-fade-in-up order-2 md:order-1">
          <p className="text-sm md:text-base font-bold tracking-[0.3em] uppercase text-primary drop-shadow-sm">
            New Collection 2025
          </p>
          <h1 className="text-5xl md:text-[3.5rem] lg:text-[4rem] font-extrabold text-[#333] leading-tight">
            Elegance <br />
            <span className="text-primary italic">Redefined</span>
          </h1>
          <p className="text-[#555] text-lg md:text-xl max-w-md font-medium leading-relaxed">
            Discover the latest trends in fashion with our exclusive collection. Quality, style, and comfort in every piece.
          </p>

          <div className="pt-4 flex gap-4">
            <Link href="/collection">
              <button className="btn-primary">
                Shop Now
              </button>
            </Link>
            <Link href="/about">
              <button className="btn-outline">
                Explore
              </button>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-[390px] md:h-[465px] w-full order-1 md:order-2">
          <Image
            src={assets.hero_img}
            alt="Hero Image"
            fill
            className="object-cover rounded-[15px] shadow-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;