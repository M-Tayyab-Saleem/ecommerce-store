import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import ShopContextProvider from "@/context/ShopContext";
import Providers from "./providers";
import { generateOrganizationJsonLd } from "@/utils/seo";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://epoxysista.com'),
  title: {
    default: 'EpoxySista - Handmade Resin Jewelry & Decor in Pakistan',
    template: '%s | EpoxySista',
  },
  description: 'Shop premium handmade resin jewelry, keychains & home decor in Pakistan. Custom orders available. Cash on Delivery all over Pakistan.',
  keywords: ['handmade resin jewelry Pakistan', 'resin keychains', 'custom resin decor', 'resin gifts Pakistan', 'COD Pakistan', 'handmade jewelry'],
  authors: [{ name: 'EpoxySista' }],
  creator: 'EpoxySista',
  publisher: 'EpoxySista',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: '/',
    siteName: 'EpoxySista',
    title: 'EpoxySista - Handmade Resin Jewelry & Decor in Pakistan',
    description: 'Shop premium handmade resin jewelry, keychains & home decor in Pakistan. Custom orders available. Cash on Delivery all over Pakistan.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EpoxySista - Handmade Resin Jewelry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EpoxySista - Handmade Resin Jewelry',
    description: 'Shop premium handmade resin jewelry in Pakistan. COD available.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = generateOrganizationJsonLd();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Providers>
          <ShopContextProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ShopContextProvider>
        </Providers>
      </body>
    </html>
  );
}
