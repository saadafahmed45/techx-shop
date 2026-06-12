"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";

import {
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineShopping,
} from "react-icons/ai";

import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { HiMagnifyingGlass } from "react-icons/hi2";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

// ─────────────────────────────────────────────
// Nav Data
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  { label: "Dashboard", href: "/admin" },
  // { label: "Dashboard", href: "/admin" },
  { label: "Track Order", href: "/track-order" },
  {
    label: "Categories",
    href: "/accessories",
    hasDropdown: true,
    items: [],
  },
];

// ─── debounce ───
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Navbar() {
  const { cart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [collections, setCollections] = useState([]);

  // ── Live Search State ──
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // ── Fetch collections for dropdown ──
  useEffect(() => {
    fetch(`${API}/collections`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setCollections)
      .catch(() => {});
  }, []);

  // ── Fetch all products once for live search ──
  useEffect(() => {
    fetch(`${API}/products`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setAllProducts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // ── Filter products on debounced query ──
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const q = debouncedQuery.toLowerCase();
    const filtered = allProducts
      .filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.vendor?.toLowerCase().includes(q) ||
          p.productType?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
      .slice(0, 6);
    setSearchResults(filtered);
    setSearchLoading(false);
  }, [debouncedQuery, allProducts]);

  // ── Close search dropdown on outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
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
        setSearchQuery("");
      }
    },
    [searchQuery, router]
  );

  const handleResultClick = useCallback(
    (productId) => {
      router.push(`/product/${productId}`);
      setSearchOpen(false);
      setSearchQuery("");
    },
    [router]
  );

  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <>
      {/* ════ NAVBAR ════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f] border-b border-white/6">
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-6">

          {/* ── Logo (Left) ── */}
          <Link href="/" className="flex flex-col leading-none shrink-0">
            <span
              style={{ fontFamily: "'Georgia', serif" }}
              className="text-[20px] text-white"
            >
              TechX<span className="text-white/30">·</span>Shop
            </span>
            <span className="text-[8px] tracking-[0.3em] text-white/30 uppercase">
              we make technology
            </span>
          </Link>

          {/* ── Center Nav (Desktop) ── */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <div key={link.label} className="relative">
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] text-white/60 hover:text-white hover:bg-white/6 transition-all"
                      >
                        {link.label}
                        <MdKeyboardArrowDown
                          className={`text-base transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-[#1a1a1a] border border-white/10 shadow-2xl shadow-black/50 rounded-xl overflow-hidden min-w-44 py-1">
                          {collections.map((item) => (
                            <Link
                              key={item._id || item.slug}
                              href={`/product?category=${item.slug}`}
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2.5 text-sm text-white/60 hover:bg-white/6 hover:text-white transition-all"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={`px-3.5 py-2 rounded-lg text-[13px] transition-all ${
                        isActive
                          ? "text-white bg-white/8 font-medium"
                          : "text-white/60 hover:text-white hover:bg-white/6"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── Right: Search + Icons (Desktop) ── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">

            {/* Live Search Bar */}
            <div ref={searchRef} className="relative">
              <div className="flex items-center gap-2 h-9 px-3 rounded-xl bg-white/6 border border-white/10 hover:border-white/20 focus-within:border-white/25 focus-within:bg-white/8 transition-all w-52">
                <HiMagnifyingGlass
                  className="text-white/40 shrink-0 cursor-pointer hover:text-white/70 transition-colors text-[16px]"
                  onClick={handleSearchIconClick}
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
                  placeholder="Search products..."
                  className="flex-1 bg-transparent outline-none text-[13px] text-white placeholder-white/30 min-w-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setSearchOpen(false);
                    }}
                    className="text-white/30 hover:text-white/70 transition-colors"
                  >
                    <HiX className="text-[13px]" />
                  </button>
                )}
              </div>

              {/* Search Dropdown */}
              {searchOpen && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50 min-w-72">
                  {searchLoading ? (
                    <div className="px-4 py-3 text-sm text-white/40 flex items-center gap-2">
                      <span className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin shrink-0" />
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="px-3 pt-2.5 pb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                          Products
                        </span>
                      </div>
                      {searchResults.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="w-full cursor-pointer  flex items-center gap-3 px-3 py-2.5 hover:bg-white/6 transition-all text-left"
                        >
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-9 h-9 rounded-lg object-cover bg-white/10 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-white/6 border border-white/10 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/85 truncate leading-tight">
                              {product.title}
                            </p>
                            {product.productType && (
                              <p className="text-[11px] text-white/35 mt-0.5">
                                {product.productType}
                              </p>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-white/60 shrink-0">
                            ${Number(product.price || 0).toFixed(2)}
                          </span>
                        </button>
                      ))}
                      <div className="border-t border-white/6 mt-1">
                        <button
                          onClick={() => {
                            router.push(
                              `/search?q=${encodeURIComponent(searchQuery.trim())}`
                            );
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm text-white/50 hover:text-white hover:bg-white/4 transition-all"
                        >
                          <span>
                            See all results for{" "}
                            <span className="text-white font-medium">
                              "{searchQuery}"
                            </span>
                          </span>
                          <HiMagnifyingGlass className="text-[14px]" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-4 text-sm text-white/35">
                      No products found for{" "}
                      <span className="text-white/60">"{searchQuery}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Icons */}
            <Link href="/profile" className="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/6 transition-all">
              <AiOutlineUser className="text-[18px]" />
            </Link>

             {/* <Link href="/login" className="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/6 transition-all">
              <AiOutlineUser className="text-[18px]" />
            </Link> */}
            <Link href="/wishlist" className="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/6 transition-all">
              <AiOutlineHeart className="text-[18px]" />
            </Link>


            <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/6 transition-all">
              <AiOutlineShopping className="text-[18px]" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* ── Mobile Right ── */}
          <div className="md:hidden flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white">
              <AiOutlineHeart className="text-[20px]" />
            </button>
            <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white">
              <AiOutlineShopping className="text-[20px]" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-white text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white"
            >
              {mobileOpen ? (
                <HiX className="text-[20px]" />
              ) : (
                <HiOutlineMenuAlt3 className="text-[20px]" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Search Bar ── */}
        <div className="md:hidden px-5 pb-3">
          <div ref={null} className="relative">
            <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-white/6 border border-white/10 focus-within:border-white/20 transition-all">
              <HiMagnifyingGlass className="text-white/40 text-[16px] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/30"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ════ MOBILE DRAWER ════ */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-[#111111] z-50 md:hidden overflow-y-auto border-r border-white/6">
            <div className="h-16 px-5 border-b border-white/6 items-center justify-between">
              <span
                style={{ fontFamily: "'Georgia', serif" }}
                className="text-white text-[18px]"
              >
                TechX·Shop
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/6"
              >
                <HiX className="text-[18px]" />
              </button>
            </div>

            <nav className="py-2">
              {NAV_LINKS.map((link) => (
                <div key={link.label}>
                  {link.hasDropdown ? (
                    <>
                      <div className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-white/25">
                        {link.label}
                      </div>
                      {collections.map((item) => (
                        <Link
                          key={item._id || item.slug}
                          href={`/product?category=${item.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block pl-8 pr-5 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/4 transition-all"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-5 py-3 text-sm transition-all ${
                        pathname === link.href
                          ? "text-white font-semibold bg-white/6"
                          : "text-white/60 hover:text-white hover:bg-white/4"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}