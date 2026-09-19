"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useShopData } from "@/context/ShopDataContext";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";

const SECONDARY_LINKS = [
  { label: "Home", href: "/", hasDropdown: true, exact: true },
  { label: "Shop", href: "/product", hasDropdown: true },
  { label: "Deals", href: "/product?sale=true", hasDropdown: true },
  { label: "New Arrivals", href: "/product?sort=newest" },
  { label: "Brands", href: "/collections" },
  { label: "Blog", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Navbar() {
  const { cart, openCart } = useCart();
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const categoriesRef = useRef(null);
  const categoryFilterRef = useRef(null);
  const searchRef = useRef(null);

  const { products: allProducts, collections } = useShopData();
  const { items: wishlistItems, hydrate: hydrateWishlist } = useWishlistStore();

  useEffect(() => {
    hydrateWishlist();
  }, [hydrateWishlist]);

  const wishlistCount = wishlistItems?.length || 0;
  const totalCartCount =
    cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 250);

  // Filter products by search and category
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const q = debouncedQuery.toLowerCase();
    const filtered = (allProducts || [])
      .filter((p) => {
        const matchesQuery =
          p.title?.toLowerCase().includes(q) ||
          p.vendor?.toLowerCase().includes(q) ||
          p.productType?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q);

        if (!matchesQuery) return false;

        if (selectedCategory !== "All Categories") {
          const catName =
            p.category?.name ||
            p.productType ||
            (Array.isArray(p.collections) ? p.collections[0]?.name : "");
          return catName?.toLowerCase() === selectedCategory.toLowerCase();
        }

        return true;
      })
      .slice(0, 6);

    setSearchResults(filtered);
    setSearchLoading(false);
  }, [debouncedQuery, selectedCategory, allProducts]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
      if (
        categoryFilterRef.current &&
        !categoryFilterRef.current.contains(e.target)
      ) {
        setCategoryFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const executeSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;

    let url = `/search?q=${encodeURIComponent(q)}`;
    if (selectedCategory && selectedCategory !== "All Categories") {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }
    router.push(url);
    setSearchOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  const handleResultClick = (productId) => {
    router.push(`/product/${productId}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-40 bg-[#0B0F19] text-white select-none shadow-2xl transition-all">
        {/* ─── TIER 1: MAIN NAVIGATION BAR ─── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-4 sm:gap-8">
          {/* Brand Logo: TechX Shop matching the typography of reference image */}
          <Link href="/" className="flex items-center gap-1 shrink-0 group">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white select-none flex items-center">
              Tech<span className="text-blue-500 transition-colors group-hover:text-blue-400">X</span>
              <span className="text-white font-bold ml-1.5 transition-colors group-hover:text-slate-200">Shop</span>
            </span>
          </Link>

          {/* Central Category-Integrated Search Bar */}
          <div
            ref={searchRef}
            className="hidden md:flex flex-1 max-w-2xl relative"
          >
            <div className="w-full bg-white rounded-lg sm:rounded-xl flex items-center h-11 sm:h-12 shadow-sm overflow-hidden">
              {/* Category Dropdown Picker */}
              <div ref={categoryFilterRef} className="relative shrink-0 h-full">
                <button
                  type="button"
                  onClick={() => setCategoryFilterOpen((prev) => !prev)}
                  className="h-full px-4 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-600 flex items-center gap-2 border-r border-slate-200 transition-colors bg-white hover:bg-slate-50 cursor-pointer"
                >
                  <span className="max-w-[110px] truncate">
                    {selectedCategory}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      categoryFilterOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {/* Category Selection Dropdown */}
                {categoryFilterOpen && (
                  <div className="absolute left-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 w-56 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory("All Categories");
                        setCategoryFilterOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                        selectedCategory === "All Categories"
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>All Categories</span>
                    </button>
                    {collections?.map((col) => (
                      <button
                        key={col._id || col.slug}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(col.name);
                          setCategoryFilterOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                          selectedCategory === col.name
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="truncate">{col.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Text Input */}
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => searchQuery && setSearchOpen(true)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-full px-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none min-w-0 bg-transparent"
              />

              {/* Clear Query button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 mr-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Solid Royal Blue Search Submit Button */}
              <button
                type="button"
                onClick={executeSearch}
                aria-label="Search"
                className="h-full px-5 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Search className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Live Autocomplete Results Overlay */}
            {searchOpen && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
                {searchLoading ? (
                  <div className="p-4 text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Searching products...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Products ({searchResults.length})
                    </div>
                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                      {searchResults.map((p) => {
                        const img = Array.isArray(p.images)
                          ? p.images[0]
                          : p.images || p.imageUrl;
                        return (
                          <button
                            key={p._id}
                            onClick={() => handleResultClick(p.slug || p._id)}
                            className="w-full p-3 flex items-center gap-3.5 hover:bg-blue-50/60 transition text-left cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 relative flex items-center justify-center">
                              {img ? (
                                <Image
                                  src={img}
                                  alt={p.title}
                                  fill
                                  sizes="44px"
                                  className="object-cover"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-slate-300" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {p.title}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {p.productType ||
                                  p.category?.name ||
                                  "Hardware"}
                              </p>
                            </div>
                            <span className="text-xs sm:text-sm font-black text-blue-600 shrink-0">
                              ${Number(p.price || 0).toLocaleString()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                      <button
                        type="button"
                        onClick={executeSearch}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                      >
                        View all results for &ldquo;{searchQuery}&rdquo; →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No products found matching &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons matching reference image */}
          <div className="flex items-center gap-5 sm:gap-7 shrink-0">
            {/* User Account */}
            <Link
              href={user ? "/profile" : "/login"}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <User className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors stroke-[1.8]" />
              <div className="hidden lg:flex flex-col">
                <span className="text-[11px] text-slate-400 leading-tight">
                  {user
                    ? `Hello, ${user.name?.split(" ")[0] || "User"}`
                    : "Sign In"}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                  My Account
                </span>
              </div>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div className="relative">
                <Heart className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors stroke-[1.8]" />
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                  Wishlist
                </span>
              </div>
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={openCart}
              className="flex items-center gap-2 group cursor-pointer text-left"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors stroke-[1.8]" />
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                  Cart
                </span>
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="md:hidden p-2 text-white hover:text-blue-400 transition cursor-pointer"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* ─── TIER 2: SECONDARY NAVIGATION & CATEGORIES BAR ─── */}
        <div className="border-t border-white/[0.08] bg-[#0B0F19] hidden md:block select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            {/* Left: Categories Hamburger Dropdown Trigger */}
            <div ref={categoriesRef} className="relative">
              <button
                type="button"
                onClick={() => setCategoriesOpen((prev) => !prev)}
                className="flex items-center gap-2.5 py-3 text-sm font-bold text-white hover:text-blue-400 transition-colors cursor-pointer pr-8 border-r border-white/10"
              >
                <Menu className="w-4 h-4 text-white" />
                <span>Categories</span>
              </button>

              {/* Categories Dropdown Menu */}
              {categoriesOpen && (
                <div className="absolute left-0 top-full bg-[#0f1523] border border-white/10 rounded-b-2xl shadow-2xl py-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-white/5">
                    Browse Categories
                  </div>
                  {collections && collections.length > 0 ? (
                    collections.map((cat) => (
                      <Link
                        key={cat._id || cat.slug}
                        href={`/product?category=${encodeURIComponent(cat.slug || cat.name)}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-600/20 transition-colors"
                      >
                        <span className="truncate">{cat.name}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-slate-500">
                      No categories found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Center: Main Navigation Links */}
            <nav className="flex items-center gap-6 lg:gap-8 pl-8">
              {SECONDARY_LINKS.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative py-3 text-sm font-medium transition-colors flex items-center gap-1 ${
                      isActive
                        ? "text-blue-500 font-bold"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && (
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                    )}
                  </Link>
                );
              })}

              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="py-3 text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* ─── MOBILE SEARCH BAR & DRAWER ─── */}
        <div className="md:hidden px-4 pb-3">
          <div className="w-full bg-white rounded-lg flex items-center h-10 px-3 overflow-hidden">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-full px-2.5 text-xs text-slate-900 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={executeSearch}
                className="bg-blue-600 text-white rounded-md px-3 py-1 text-xs font-bold"
              >
                Go
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav Slide-Down Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0f1523] border-t border-white/10 px-4 py-4 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Navigation
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SECONDARY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg bg-white/5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                Categories
              </div>
              <div className="space-y-1">
                {collections?.slice(0, 6).map((cat) => (
                  <Link
                    key={cat._id || cat.slug}
                    href={`/product?category=${encodeURIComponent(cat.slug || cat.name)}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-2 px-3 rounded-lg text-xs text-slate-300 hover:bg-white/5 transition"
                  >
                    <span>{cat.name}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
