import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { name: "Jewelry", href: "/collection?category=jewelry" },
    { name: "Keychains", href: "/collection?category=keychains" },
    { name: "Home Décor", href: "/collection?category=home-decor" },
    { name: "Custom Orders", href: "/contact" },
    { name: "All Products", href: "/collection" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Shipping Info", href: "/shipping-policy" },
    { name: "Refund Policy", href: "/refund-policy" },
  ];

  const supportLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-conditions" },
    { name: "FAQs", href: "/faqs" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com/epoxysista",
      icon: Instagram,
    },
    {
      name: "Facebook",
      href: "https://facebook.com/epoxysista",
      icon: Facebook,
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/923001234567",
      icon: MessageCircle,
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold tracking-wide text-primary">
                EpoxySista
              </h3>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Handcrafted resin jewelry & home décor made with love in Pakistan.
              Each piece is unique, just like you.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5 text-white">
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5 text-white">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5 mt-8 text-white">
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-5 text-white">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
                <span className="text-gray-400 text-sm">
                  Lahore, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <a
                  href="tel:+923001234567"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <a
                  href="mailto:hello@epoxysista.com"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  hello@epoxysista.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="text-primary shrink-0" />
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Chat on WhatsApp
                </a>
              </li>
            </ul>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                💰 COD Available
              </span>
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
                🇵🇰 Pakistan-wide
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} EpoxySista. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/privacy-policy"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms-conditions"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/shipping-policy"
              className="text-gray-500 hover:text-gray-300 transition-colors"
            >
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;