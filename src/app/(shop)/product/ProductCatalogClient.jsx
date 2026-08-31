"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useShopData } from "@/context/ShopDataContext";
import ProductCard from "@/components/ProductCard";
import {
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  Check,
} from "lucide-react";

const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

const PER_PAGE = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products: allProducts, collections, loading } = useShopData();

  const categoryParam = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSort, setSelectedSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(100000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [categoryParam]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];

    let list = allProducts.filter((p) => p && p.status === "active");

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const title = p.title?.toLowerCase() || "";
        const vendor = p.vendor?.toLowerCase() || "";
        const pType = p.productType?.toLowerCase() || "";
        const catName = p.category?.name?.toLowerCase() || "";
        return (
          title.includes(q) ||
          vendor.includes(q) ||
          pType.includes(q) ||
          catName.includes(q)
        );
      });
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      const target = selectedCategory.toLowerCase();
      list = list.filter((p) => {
        const catName = p.category?.name?.toLowerCase() || "";
        const catSlug = p.category?.slug?.toLowerCase() || "";
        const pType = p.productType?.toLowerCase() || "";
        const hasCol = p.collections?.some(
          (c) => c.slug?.toLowerCase() === target || c.name?.toLowerCase() === target
        );
        return catName === target || catSlug === target || pType === target || hasCol;
      });
    }

    // In-stock filter
    if (inStockOnly) {
      list = list.filter((p) => (p.stock ?? 1) > 0);
    }

    // Price filter
    list = list.filter((p) => Number(p.price || 0) <= priceRange);

    // Sort
    list.sort((a, b) => {
      if (selectedSort === "price_asc") {
        return Number(a.price || 0) - Number(b.price || 0);
      }
      if (selectedSort === "price_desc") {
        return Number(b.price || 0) - Number(a.price || 0);
      }
      if (selectedSort === "rating") {
        return Number(b.rating?.average || 0) - Number(a.rating?.average || 0);
      }
      // Newest fallback
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return list;
  }, [allProducts, searchQuery, selectedCategory, inStockOnly, priceRange, selectedSort]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredProducts.slice(start, start + PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    router.push(`/product${slug === "all" ? "" : `?category=${slug}`}`);
  };

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-neutral-200 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Hardware & Devices
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-950 mt-1">
              All Products & Tech Gadgets
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Showing {filteredProducts.length} items available in Bangladesh
            </p>
          </div>

          {/* Controls bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input Bar */}
            <div className="relative flex items-center h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 focus-within:border-indigo-600 focus-within:bg-white transition-all w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-xs text-neutral-900 placeholder:text-neutral-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-900 bg-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200/80 rounded-lg px-3 h-10">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="bg-transparent text-xs text-neutral-900 font-medium outline-none cursor-pointer pr-2"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 items-start">
          {/* DESKTOP SIDEBAR (3 cols) */}
          <aside className="hidden md:block md:col-span-3 space-y-6 sticky top-24">
            {/* Categories */}
            <div className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect("all")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-indigo-600 text-white font-medium shadow-sm shadow-indigo-600/20"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <span>All Categories</span>
                  {selectedCategory === "all" && <Check className="w-3 h-3" />}
                </button>
                {collections &&
                  collections.map((col) => {
                    const isSelected =
                      selectedCategory.toLowerCase() === col.slug?.toLowerCase() ||
                      selectedCategory.toLowerCase() === col.name?.toLowerCase();
                    return (
                      <button
                        key={col._id || col.slug}
                        onClick={() => handleCategorySelect(col.slug || col.name)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 text-white font-medium shadow-sm shadow-indigo-600/20"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                        }`}
                      >
                        <span>{col.name}</span>
                        {isSelected && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-950">
                  Max Price
                </span>
                <span className="font-semibold text-indigo-600">
                  ৳{priceRange.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* In-Stock Toggle */}
            <div className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/50 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900">
                In-Stock Only
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
              />
            </div>
          </aside>

          {/* MAIN PRODUCT GRID (9 cols) */}
          <main className="md:col-span-9 space-y-8">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-neutral-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
                <p className="text-sm font-semibold text-neutral-800">
                  No products matched your criteria
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Try adjusting your price range or category filter.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setPriceRange(100000);
                    setInStockOnly(false);
                    router.push("/product");
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium cursor-pointer shadow-sm shadow-indigo-600/20"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5">
                {paginatedProducts.map((p, i) => (
                  <ProductCard key={p._id || i} product={p} index={i} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 border-t border-neutral-100">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 disabled:opacity-30 hover:bg-neutral-50 cursor-pointer"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                          : "border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 disabled:opacity-30 hover:bg-neutral-50"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER MODAL */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h2 className="text-sm font-bold text-neutral-900">Filters</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-neutral-950">
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    handleCategorySelect("all");
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                    selectedCategory === "all"
                      ? "bg-neutral-900 text-white font-medium"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  All Categories
                </button>
                {collections &&
                  collections.map((col) => (
                    <button
                      key={col._id || col.slug}
                      onClick={() => {
                        handleCategorySelect(col.slug || col.name);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                        selectedCategory.toLowerCase() === col.slug?.toLowerCase() ||
                        selectedCategory.toLowerCase() === col.name?.toLowerCase()
                          ? "bg-neutral-900 text-white font-medium"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {col.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Max Price</span>
                <span>৳{priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-neutral-900"
              />
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full h-11 bg-neutral-900 text-white rounded-lg text-xs font-medium mt-auto"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductCatalogClient() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="h-96 bg-neutral-100 rounded-2xl animate-pulse" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
