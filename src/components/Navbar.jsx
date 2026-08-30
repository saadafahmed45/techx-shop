"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useShopData } from "@/context/ShopDataContext";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/product" },
  {
    label: "Categories",
    href: "/product",
    hasDropdown: true,
  },
  { label: "Track Order", href: "/track-order" },
  { label: "Admin", href: "/admin" },
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { products: allProducts, collections } = useShopData();
  const { items: wishlistItems, hydrate: hydrateWishlist } = useWishlistStore();

  useEffect(() => {
    hydrateWishlist();
  }, [hydrateWishlist]);

  const wishlistCount = wishlistItems?.length || 0;

  const navLinksToDisplay = NAV_LINKS.filter((link) => {
    if (link.href === "/admin") {
      return user?.role === "admin";
    }
    return true;
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const debouncedQuery = useDebounce(searchQuery, 250);

  const totalCartCount = cart?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;

  // Filter products
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const q = debouncedQuery.toLowerCase();
    const filtered = (allProducts || [])
      .filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.vendor?.toLowerCase().includes(q) ||
          p.productType?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
      .slice(0, 5);
    setSearchResults(filtered);
    setSearchLoading(false);
  }, [debouncedQuery, allProducts]);

  // Click outside to close search and dropdown
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchSubmit = useCallback(
    (e) => {
      if (e.key === "Enter" && searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchOpen(false);
        setMobileSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery, router]
  );

  const handleResultClick = useCallback(
    (productId) => {
      router.push(`/product/${productId}`);
      setSearchOpen(false);
      setMobileSearchOpen(false);
      setSearchQuery("");
    },
    [router]
  );

  const executeSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo (Left) */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm tracking-tighter shadow-sm shadow-indigo-600/20">
              TX
            </div>
            <span className="font-semibold text-lg tracking-tight text-neutral-900 group-hover:text-indigo-600 transition-colors">
              TechX<span className="text-indigo-600 font-normal">Shop</span>
            </span>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinksToDisplay.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              if (link.hasDropdown) {
                return (
                  <div key={link.label} ref={dropdownRef} className="relative">
                    <button
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-all ${
                        dropdownOpen
                          ? "text-neutral-900 bg-neutral-100"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180 text-neutral-900" : "text-neutral-400"
                        }`}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200/90 rounded-xl shadow-xl shadow-neutral-900/5 min-w-52 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                          Categories
                        </div>
                        {collections && collections.length > 0 ? (
                          collections.map((item) => (
                            <Link
                              key={item._id || item.slug}
                              href={`/product?category=${item.slug || item.name}`}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center justify-between px-3.5 py-2 text-[13px] text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                            >
                              <span>{item.name}</span>
                              <ArrowRight className="w-3 h-3 text-neutral-300" />
                            </Link>
                          ))
                        ) : (
                          <div className="px-3.5 py-2 text-xs text-neutral-400">
                            No categories
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-all ${
                    isActive
                      ? "text-neutral-900 bg-neutral-100/90"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Live Search Input */}
            <div ref={searchRef} className="relative">
              <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 focus-within:border-neutral-900 focus-within:bg-white transition-all w-52 lg:w-64">
                <Search
                  className="w-3.5 h-3.5 text-neutral-400 shrink-0 cursor-pointer hover:text-neutral-700"
                  onClick={executeSearch}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => searchQuery && setSearchOpen(true)}
                  onKeyDown={handleSearchSubmit}
                  placeholder="Search devices, accessories..."
                  className="flex-1 bg-transparent outline-none text-[13px] text-neutral-900 placeholder-neutral-400 min-w-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setSearchOpen(false);
                    }}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              {searchOpen && searchQuery.trim() && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl shadow-neutral-900/10 overflow-hidden z-50 w-80">
                  {searchLoading ? (
                    <div className="px-4 py-3 text-xs text-neutral-500 flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin shrink-0" />
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-1.5">
                      <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                        Products
                      </div>
                      {searchResults.map((product) => {
                        const img = Array.isArray(product.images)
                          ? product.images[0]
                          : product.images;
                        return (
                          <button
                            key={product._id}
                            onClick={() => handleResultClick(product.slug || product._id)}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 transition-colors text-left group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200/60 overflow-hidden shrink-0 relative flex items-center justify-center">
                              {img ? (
                                <Image
                                  src={img}
                                  alt={product.title}
                                  fill
                                  sizes="36px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="text-[10px] text-neutral-400">No img</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-neutral-900 group-hover:text-neutral-600 truncate leading-snug">
                                {product.title}
                              </p>
                              <p className="text-[11px] text-neutral-400">
                                {product.productType || "Gadget"}
                              </p>
                            </div>
                            <span className="text-xs font-semibold text-neutral-900 shrink-0">
                              ৳{Number(product.price || 0).toLocaleString()}
                            </span>
                          </button>
                        );
                      })}
                      <div className="border-t border-neutral-100 mt-1 pt-1">
                        <button
                          onClick={executeSearch}
                          className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                        >
                          <span>See all results for "{searchQuery}"</span>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-4 text-xs text-neutral-400 text-center">
                      No products found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Link with Quantity Badge */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 min-w-4 h-4 px-1 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Link */}
            <Link
              href="/profile"
              aria-label="Account"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Cart Link to Cart Page */}
            <Link
              href="/cart"
              aria-label="View Cart"
              className="relative flex items-center gap-1.5 h-9 px-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-medium transition-colors ml-1 shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart</span>
              {totalCartCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-white text-indigo-700 rounded-full text-[10px] font-bold">
                  {totalCartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={() => {
                setMobileSearchOpen((prev) => !prev);
                setTimeout(() => mobileInputRef.current?.focus(), 50);
              }}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/cart"
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-neutral-100 bg-white">
            <div className="flex items-center gap-2 h-10 px-3 rounded-lg bg-neutral-50 border border-neutral-200">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-sm text-neutral-900 placeholder-neutral-400 min-w-0"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {debouncedQuery && searchResults.length > 0 && (
              <div className="mt-2 divide-y divide-neutral-100 border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-lg">
                {searchResults.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleResultClick(product.slug || product._id)}
                    className="w-full flex items-center justify-between p-2.5 text-left text-xs"
                  >
                    <span className="truncate text-neutral-900 font-medium">{product.title}</span>
                    <span className="font-semibold text-neutral-700 shrink-0 ml-2">
                      ৳{Number(product.price || 0).toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 bottom-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 flex flex-col">
            <div className="h-16 px-5 border-b border-neutral-100 flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-md bg-[#09090b] text-white flex items-center justify-center font-bold text-xs">
                  TX
                </div>
                <span className="font-semibold text-base tracking-tight text-neutral-900">
                  TechX Shop
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {navLinksToDisplay.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-neutral-100 text-neutral-900 font-semibold"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}

              {collections && collections.length > 0 && (
                <div className="pt-4 border-t border-neutral-100 mt-3">
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Collections
                  </div>
                  {collections.map((item) => (
                    <Link
                      key={item._id || item.slug}
                      href={`/product?category=${item.slug || item.name}`}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-2">
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-medium shadow-sm shadow-indigo-600/20"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Cart ({totalCartCount})
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white border border-neutral-200 text-xs font-medium text-neutral-700 hover:border-neutral-300"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-neutral-400" />
                  Wishlist
                </span>
                {wishlistCount > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold">
                    {wishlistCount}
                  </span>
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                )}
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white border border-neutral-200 text-xs font-medium text-neutral-700"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  My Account
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
