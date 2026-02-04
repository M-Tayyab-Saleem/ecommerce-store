"use client";

import React, { useContext } from "react";
import { ShopContext } from "@/context/ShopContext";
import { assets } from "@/lib/assets";
import { usePathname } from "next/navigation"; // The Next.js replacement
import Image from "next/image";

const SearchBar = () => {
  const context = useContext(ShopContext);
  const pathname = usePathname();
  const visible = pathname.includes("collection");

  // Guard clause for TS
  if (!context) return null;
  const { search, setSearch, showSearch, setShowSearch } = context;

  if (!showSearch || !visible) return null;

  return (
    <div className="border-t border-b bg-gray-50 text-center">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search"
          className="flex-1 outline-none bg-inherit text-sm"
        />
        <Image src={assets.search_icon} alt="search" className="w-4" />
      </div>
      <Image
        src={assets.cross_icon}
        alt="close"
        onClick={() => setShowSearch(false)}
        className="inline w-3 cursor-pointer"
      />
    </div>
  );
};

export default SearchBar;