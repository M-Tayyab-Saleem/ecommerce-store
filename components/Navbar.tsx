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
      // Change background when scrolled > 0
      if (window.scrollY > 0) {
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-[1.5rem] font-bold tracking-wider text-primary">
          EpoxySista
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-10 font-medium text-primary">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative py-1 transition-colors duration-300 font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${pathname === link.href ? 'after:w-full' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-primary hover:text-primary-hover transition-colors"
          >
            <Search size={22} strokeWidth={2} />
          </button>

          <div className="group relative">
            <button className="text-primary hover:text-primary-hover transition-colors pt-1">
              <User size={22} strokeWidth={2} />
            </button>
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-40 py-4 px-5 bg-white shadow-lg border border-gray-100 rounded-md text-gray-500 text-sm">
                <Link href="/my-orders" className="cursor-pointer hover:text-primary transition-colors">My Orders</Link>
                <Link href="/login" className="cursor-pointer hover:text-primary transition-colors">Login</Link>
              </div>
            </div>
          </div>

          <Link href="/cart" className="relative text-primary hover:text-primary-hover transition-colors">
            <ShoppingBag size={22} strokeWidth={2} />
            <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-primary text-white rounded-full text-[10px] font-bold">
              {getCartTotalItems()}
            </span>
          </Link>

          <button onClick={() => setVisible(true)} className="md:hidden text-primary">
            <Menu size={28} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${visible ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setVisible(false)} />

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 transition-transform duration-300 ease-in-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <span className="text-xl font-bold text-primary">Menu</span>
            <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-primary">
              <X size={28} strokeWidth={2} />
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