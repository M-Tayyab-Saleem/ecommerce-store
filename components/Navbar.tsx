"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShopContext, ShopContextType } from "@/context/ShopContext";
import { Menu, X, Search, User, ShoppingBag, ChevronDown } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
  dropdown?: { name: string; href: string }[];
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  {
    name: "Categories",
    href: "#",
    dropdown: [
      { name: "Jewelry", href: "/products?category=jewelry" },
      { name: "Keychains", href: "/products?category=keychains" },
      { name: "Home Décor", href: "/products?category=home-decor" },
      { name: "Custom Orders", href: "/contact" },
    ],
  },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { setShowSearch, showSearch, getCartTotalItems } = useContext(
    ShopContext
  ) as ShopContextType;
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-3" : "bg-white/95 backdrop-blur-sm py-4"
        }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide text-primary"
        >
          EpoxySista
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name} className="relative group">
              {link.dropdown ? (
                <>
                  <button
                    className={`flex items-center gap-1 py-2 font-medium transition-colors hover:text-primary ${pathname.startsWith("/products?category")
                      ? "text-primary"
                      : "text-gray-700"
                      }`}
                    onClick={() => toggleDropdown(link.name)}
                    onMouseEnter={() => setActiveDropdown(link.name)}
                  >
                    {link.name}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${activeDropdown === link.name ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {/* Dropdown Menu */}
                  <div
                    className={`absolute top-full left-0 pt-2 transition-all duration-200 ${activeDropdown === link.name
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                      }`}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[180px]">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  className={`py-2 font-medium transition-colors hover:text-primary relative ${pathname === link.href ? "text-primary" : "text-gray-700"
                    }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-gray-700 hover:text-primary transition-colors rounded-full hover:bg-gray-100"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* User Dropdown */}
          <div className="relative group">
            <button
              className="p-2 text-gray-700 hover:text-primary transition-colors rounded-full hover:bg-gray-100"
              aria-label="Account"
            >
              <User size={20} />
            </button>
            <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[160px]">
                {/* TODO: Show only for admin users - will need auth context */}
                <Link
                  href="/admin"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  Admin Dashboard
                </Link>
                <Link
                  href="/my-orders"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  My Orders
                </Link>
                <Link
                  href="/login"
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  Login / Register
                </Link>
              </div>
            </div>
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 text-gray-700 hover:text-primary transition-colors rounded-full hover:bg-gray-100"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {getCartTotalItems() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center bg-primary text-white rounded-full text-[10px] font-bold">
                {getCartTotalItems()}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-xl font-bold text-primary">EpoxySista</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className="w-full flex items-center justify-between px-6 py-3 text-lg font-medium text-gray-700"
                    >
                      {link.name}
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${activeDropdown === link.name ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    <div
                      className={`bg-gray-50 overflow-hidden transition-all duration-300 ${activeDropdown === link.name
                        ? "max-h-60 opacity-100"
                        : "max-h-0 opacity-0"
                        }`}
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-10 py-3 text-gray-600 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`block px-6 py-3 text-lg font-medium transition-colors ${pathname === link.href ? "text-primary" : "text-gray-700"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link
              href="/login"
              className="btn-primary w-full text-center block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login / Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;