import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Next.js uses a global CSS file

// 1. Import your components and provider
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopContextProvider from "@/context/ShopContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EpoxySista", 
  description: "My E-commerce Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ShopContextProvider>
          <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
            <Navbar />
            {children}
            <Footer />
          </div>
        </ShopContextProvider>
      </body>
    </html>
  );
}