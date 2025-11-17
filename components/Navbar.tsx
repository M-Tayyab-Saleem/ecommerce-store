"use client"; // Needs to be a Client Component to use context

import React, { useContext, useState } from "react";
import { assets } from "@/lib/assets";
import Link from "next/link"; // Use next/link
import { usePathname } from "next/navigation"; // Use usePathname
import { ShopContext, ShopContextType } from "@/context/ShopContext";
import Image from "next/image";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, showSearch, getCartTotalItems } = useContext(
    ShopContext
  ) as ShopContextType;
  
  const pathname = usePathname(); // Get current path

  // Helper to determine if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex items-center justify-between py-2 font-medium">
      <Link href="/">
        <Image src={assets.logo1} alt="logo-image" className="w-36" width={144} height={40} />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <Link href="/" className="flex flex-col items-center gap-1">
          <p>Home</p>
          <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${isActive('/') ? 'block' : 'hidden'}`} />
        </Link>
        <Link href="/collection" className="flex flex-col items-center gap-1">
          <p>Collection</p>
          <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${isActive('/collection') ? 'block' : 'hidden'}`} />
        </Link>
        <Link href="/about" className="flex flex-col items-center gap-1">
          <p>About</p>
          <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${isActive('/about') ? 'block' : 'hidden'}`} />
        </Link>
        <Link href="/contact" className="flex flex-col items-center gap-1">
          <p>Contact</p>
          <hr className={`w-2/4 border-none h-[1.5px] bg-gray-700 ${isActive('/contact') ? 'block' : 'hidden'}`} />
        </Link>
      </ul>
      <div className="flex items-center gap-6">
        <Image src={assets.search_icon} alt="search" className="w-5 cursor-pointer" width={20} height={20} onClick={() => setShowSearch(!showSearch)} />
        <div className="group relative">
          <Image
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="profile"
            width={20}
            height={20}
          />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded z-10">
              <Link href="/my-orders" className="cursor-pointer hover:text-black">Orders</Link>
              <Link href="/login" className="cursor-pointer hover:text-black">Logout</Link>
            </div>
          </div>
        </div>
        <Link href="/cart" className="relative">
          <Image src={assets.cart_icon} className="w-5 min-w-4" alt="cart" width={20} height={20} />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartTotalItems()}
          </p>
        </Link>
        <Image onClick={() => setVisible(true)} src={assets.menu_icon} className="w-5 cursor-pointer sm:hidden" alt="menu" width={20} height={20} />
      </div>

      {/* Sidebar menu for small screen size */}
      <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-20 ${visible ? 'w-full' : 'w-0'}`}>
        <div className="flex flex-col text-gray-600">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
            <Image src={assets.dropdown_icon} className="h-4 w-auto rotate-180" alt="back" width={16} height={16} />
            <p>back</p>
          </div>
          <Link onClick={() => setVisible(false)} className="py-6 pl-4 border" href="/">Home</Link>
          <Link onClick={() => setVisible(false)} className="py-6 pl-4 border" href="/collection">Collection</Link>
          <Link onClick={() => setVisible(false)} className="py-6 pl-4 border" href="/about">About</Link>
          <Link onClick={() => setVisible(false)} className="py-6 pl-4 border" href="/contact">Contact</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;