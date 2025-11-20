import type { Metadata } from "next";
import { Outfit, Prata } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopContextProvider from "@/context/ShopContext"; 

const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });
const prata = Prata({ weight: "400", subsets: ["latin"], variable: '--font-prata' });

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
      <body className={`${outfit.variable} ${prata.variable} font-sans antialiased`}>
        <ShopContextProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ShopContextProvider>
      </body>
    </html>
  );
}