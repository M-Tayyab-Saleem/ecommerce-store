import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark-bg text-white pt-20 pb-10 mt-20">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/">
            <h3 className="text-3xl font-bold tracking-wider uppercase text-white">
              EpoxySista
            </h3>
          </Link>
          <p className="text-[#b0b0b0] text-sm leading-relaxed max-w-xs">
            Elevating your style with timeless elegance and modern design. Quality craftsmanship in every detail.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-hover hover:text-white transition-all duration-300 text-gray-400">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-hover hover:text-white transition-all duration-300 text-gray-400">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-hover hover:text-white transition-all duration-300 text-gray-400">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-hover hover:text-white transition-all duration-300 text-gray-400">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold mb-6 tracking-wide text-white">Company</h4>
          <ul className="space-y-4 text-sm text-[#b0b0b0]">
            <li><Link href="/about" className="hover:text-[#db2777] transition-colors">About Us</Link></li>
            <li><Link href="/collection" className="hover:text-[#db2777] transition-colors">Collection</Link></li>
            <li><Link href="#" className="hover:text-[#db2777] transition-colors">Sustainability</Link></li>
            <li><Link href="#" className="hover:text-[#db2777] transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-[#db2777] transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-bold mb-6 tracking-wide text-white">Support</h4>
          <ul className="space-y-4 text-sm text-[#b0b0b0]">
            <li><Link href="#" className="hover:text-[#db2777] transition-colors">FAQ</Link></li>
            <li><Link href="#" className="hover:text-[#db2777] transition-colors">Shipping & Returns</Link></li>
            <li><Link href="#" className="hover:text-[#db2777] transition-colors">Order Status</Link></li>
            <li><Link href="#" className="hover:text-[#db2777] transition-colors">Payment Options</Link></li>
            <li><Link href="/contact" className="hover:text-[#db2777] transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold mb-6 tracking-wide text-white">Get in Touch</h4>
          <ul className="space-y-4 text-sm text-[#b0b0b0]">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 shrink-0 text-primary" />
              <span>123 Fashion Ave, Suite 500<br />New York, NY 10001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-primary" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-primary" />
              <span>hello@epoxysista.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-custom pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#777]">
        <p>&copy; 2025 EpoxySista. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;