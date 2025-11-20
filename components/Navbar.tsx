"use client";

import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShopContext, ShopContextType } from "@/context/ShopContext";
import { assets } from "@/lib/assets";
import Image from "next/image";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { setShowSearch, showSearch, getCartTotalItems } = useContext(
    ShopContext
  ) as ShopContextType;
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/collection" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-3xl font-heading font-bold tracking-wider uppercase text-primary">
          EpoxySista
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-10 text-sm uppercase tracking-widest font-medium text-gray-500">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`relative hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[1px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${pathname === link.href ? 'text-primary after:w-full' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="text-gray-600 hover:text-primary transition-colors"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
          
          <div className="group relative">
            <button className="text-gray-600 hover:text-primary transition-colors pt-1">
              <User size={20} strokeWidth={1.5} />
            </button>
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-40 py-4 px-5 bg-white shadow-lg border border-gray-100 rounded-md text-gray-500 text-sm">
                <Link href="/my-orders" className="cursor-pointer hover:text-primary transition-colors">My Orders</Link>
                <Link href="/login" className="cursor-pointer hover:text-primary transition-colors">Login</Link>
              </div>
            </div>
          </div>

          <Link href="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-accent text-white rounded-full text-[10px] font-bold">
              {getCartTotalItems()}
            </span>
          </Link>

          <button onClick={() => setVisible(true)} className="md:hidden text-gray-600">
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${visible ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setVisible(false)} />

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 transition-transform duration-300 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <span className="text-xl font-heading font-bold">Menu</span>
            <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-primary">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          
          <div className="flex flex-col gap-6 text-lg font-medium text-gray-600">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                onClick={() => setVisible(false)}
                className={`hover:text-primary transition-colors ${pathname === link.href ? 'text-primary' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;