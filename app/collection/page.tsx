"use client";

import React, { useContext, useEffect, useState } from "react";
import { ShopContext, ShopContextType } from "@/context/ShopContext";
import ProductItem from "@/components/ProductItem";
import SectionHeading from "@/components/SectionHeading";
import EmptyState from "@/components/EmptyState";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";

// Filter configurations for resin business
const categoryFilters = [
  { value: "jewelry", label: "Jewelry" },
  { value: "keychains", label: "Keychains" },
  { value: "home-decor", label: "Home Décor" },
];

const priceFilters = [
  { value: "0-500", label: "Under PKR 500", min: 0, max: 500 },
  { value: "500-1000", label: "PKR 500 - 1,000", min: 500, max: 1000 },
  { value: "1000-2000", label: "PKR 1,000 - 2,000", min: 1000, max: 2000 },
  { value: "2000+", label: "Above PKR 2,000", min: 2000, max: Infinity },
];

const colorFilters = [
  { value: "clear", label: "Clear/Transparent" },
  { value: "blue", label: "Blue" },
  { value: "pink", label: "Pink" },
  { value: "purple", label: "Purple" },
  { value: "gold", label: "Gold" },
  { value: "multi", label: "Multi-color" },
];

const sortOptions = [
  { value: "relevant", label: "Relevant" },
  { value: "newest", label: "Newest First" },
  { value: "low-high", label: "Price: Low to High" },
  { value: "high-low", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

const Collection = () => {
  const context = useContext(ShopContext);

  // State
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filterProducts, setFilterProducts] = useState(context?.products || []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showBestsellers, setShowBestsellers] = useState(false);
  const [showCustomizable, setShowCustomizable] = useState(false);
  const [showInStock, setShowInStock] = useState(false);
  const [sortType, setSortType] = useState("relevant");

  // Guard clause for context
  if (!context) return <div className="py-32 text-center">Loading...</div>;

  const { products, search, showSearch } = context;

  // Toggle functions
  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const togglePriceRange = (value: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleColor = (value: string) => {
    setSelectedColors((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSelectedColors([]);
    setShowBestsellers(false);
    setShowCustomizable(false);
    setShowInStock(false);
    setSortType("relevant");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedPriceRanges.length > 0 ||
    selectedColors.length > 0 ||
    showBestsellers ||
    showCustomizable ||
    showInStock;

  // Filter and sort products
  useEffect(() => {
    let filtered = products.slice();

    // Search filter
    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.some(
          (cat) =>
            item.category.toLowerCase().includes(cat) ||
            item.subCategory?.toLowerCase().includes(cat)
        )
      );
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((item) => {
        return selectedPriceRanges.some((range) => {
          const priceFilter = priceFilters.find((pf) => pf.value === range);
          if (priceFilter) {
            return item.price >= priceFilter.min && item.price <= priceFilter.max;
          }
          return true;
        });
      });
    }

    // Bestseller filter
    if (showBestsellers) {
      filtered = filtered.filter((item) => item.bestseller);
    }

    // Sorting
    switch (sortType) {
      case "low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => (b.date || 0) - (a.date || 0));
        break;
      case "popular":
        // Sort by bestseller first, then by other criteria
        filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
        break;
      default:
        break;
    }

    setFilterProducts(filtered);
  }, [
    selectedCategories,
    selectedPriceRanges,
    selectedColors,
    showBestsellers,
    showCustomizable,
    showInStock,
    search,
    showSearch,
    sortType,
    products,
  ]);

  // Filter Section Component
  const FilterSection = ({ mobile = false }) => (
    <div className={`space-y-6 ${mobile ? "" : "filter-panel sticky top-24"}`}>
      {/* Categories */}
      <div className="filter-group">
        <span className="filter-label">Category</span>
        <div className="space-y-2">
          {categoryFilters.map((filter) => (
            <label key={filter.value} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes(filter.value)}
                onChange={() => toggleCategory(filter.value)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>{filter.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <span className="filter-label">Price Range</span>
        <div className="space-y-2">
          {priceFilters.map((filter) => (
            <label key={filter.value} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(filter.value)}
                onChange={() => togglePriceRange(filter.value)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>{filter.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="filter-group">
        <span className="filter-label">Features</span>
        <div className="space-y-2">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showBestsellers}
              onChange={() => setShowBestsellers(!showBestsellers)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Best Sellers</span>
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showCustomizable}
              onChange={() => setShowCustomizable(!showCustomizable)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Customizable</span>
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showInStock}
              onChange={() => setShowInStock(!showInStock)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>In Stock</span>
          </label>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="text-sm text-primary hover:underline"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-custom pt-24 pb-16">
      {/* Header */}
      <div className="mb-8">
        <SectionHeading
          label="Browse"
          title="Our Collection"
          subtitle="Discover handcrafted resin jewelry, keychains, and home décor"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterSection />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 btn-ghost"
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {selectedCategories.length +
                    selectedPriceRanges.length +
                    (showBestsellers ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Results Count */}
            <p className="text-sm text-gray-600 hidden lg:block">
              {filterProducts.length} products found
            </p>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Active Filters Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {categoryFilters.find((c) => c.value === cat)?.label}
                  <X size={14} />
                </button>
              ))}
              {selectedPriceRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => togglePriceRange(range)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {priceFilters.find((p) => p.value === range)?.label}
                  <X size={14} />
                </button>
              ))}
              {showBestsellers && (
                <button
                  onClick={() => setShowBestsellers(false)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  Best Sellers
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filterProducts.length > 0 ? (
            <div className="product-grid">
              {filterProducts.map((item, index) => (
                <ProductItem
                  key={item._id || index}
                  id={item._id}
                  image={item.image}
                  price={item.price}
                  name={item.name}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="products"
              title="No products found"
              message="Try adjusting your filters or search terms"
              actionLabel="Clear Filters"
              actionHref="/collection"
            />
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden ${showMobileFilters ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={() => setShowMobileFilters(false)}
      />
      <div
        className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 transition-transform lg:hidden ${showMobileFilters ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <span className="text-lg font-semibold">Filters</span>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex-1 overflow-y-auto p-4">
            <FilterSection mobile />
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex gap-3">
            <button
              onClick={clearAllFilters}
              className="btn-ghost flex-1 text-center"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="btn-primary flex-1 text-center"
            >
              Apply ({filterProducts.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;