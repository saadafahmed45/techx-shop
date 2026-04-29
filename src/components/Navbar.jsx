"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineShopping,
} from "react-icons/ai";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─────────────────────────────────────────────
// Nav data
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Product", href: "/product", hasDropdown: false },
  { label: "Computing", href: "/computing", hasDropdown: false },
  {
    label: "Accessories",
    href: "/accessories",
    hasDropdown: true,
    items: [
      { label: "Cables", href: "/accessories/cables" },
      { label: "Chargers", href: "/accessories/chargers" },
      { label: "Cases", href: "/accessories/cases" },
    ],
  },
];

// ─────────────────────────────────────────────
// Desktop Dropdown
// ─────────────────────────────────────────────
const DesktopDropdown = memo(function DesktopDropdown({ items, isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          // FIX: z-[60] > header z-50 so dropdown always shows on top
          className="absolute top-full left-0 mt-2 bg-white border border-gray-100 shadow-xl min-w-45 z-60 rounded-lg overflow-hidden"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={item.href}
                className="block px-5 py-2.5 text-[14px] text-gray-600 hover:text-black hover:bg-gray-50 tracking-wide transition-colors"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─────────────────────────────────────────────
// Mobile Nav Item  (memoized to avoid re-render on every route change)
// ─────────────────────────────────────────────
const MobileNavItem = memo(function MobileNavItem({ link, index, pathname }) {
  const [open, setOpen] = useState(false);

  // FIX: derive isActive inside render — no extra effect needed
  const isActive =
    pathname === link.href || pathname.startsWith(link.href + "/");

  return (
    <div className="border-b border-gray-100">
      {link.hasDropdown ? (
        <>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between px-5 py-4 text-[14px] font-medium tracking-widest uppercase transition-colors ${
              isActive ? "text-black" : "text-gray-500 hover:text-black"
            }`}
          >
            <span>{link.label}</span>
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.22 }}
            >
              <MdKeyboardArrowDown className="text-gray-400 text-lg" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="dropdown"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.26, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {link.items.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      className="block pl-10 pr-5 py-2.5 text-[13px] text-gray-500 hover:text-black tracking-wide transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          href={link.href}
          className={`flex items-center justify-between px-5 py-4 text-[14px] font-medium tracking-widest uppercase transition-colors ${
            isActive ? "text-black" : "text-gray-500 hover:text-black"
          }`}
        >
          <span>{link.label}</span>
          {/* FIX: unique layoutId per item to avoid collision */}
          {isActive && (
            <motion.span
              layoutId={`mobile-dot-${link.href}`}
              className="w-1.5 h-1.5 rounded-full bg-black"
            />
          )}
        </Link>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────
export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const pathname                      = usePathname();

  // Ref to know which nav div was clicked so the global listener doesn't
  // immediately close the dropdown that was just opened
  const navRef = useRef(null);

  // ── scroll shadow ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── close everything on route change ──
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // FIX: global click listener — only close if click is OUTSIDE the nav
  useEffect(() => {
    const handleOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // ── lock body scroll when mobile drawer is open ──
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleDropdown = (label) =>
    setOpenDropdown((prev) => (prev === label ? null : label));

  return (
    <>
      {/* ═══════════════════════════════
          DESKTOP HEADER
      ═══════════════════════════════ */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        // FIX: z-50 (header) < z-[60] (dropdown) so dropdowns render above
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        {/* FIX: consistent max-w container for both bar and search */}
        <div
          ref={navRef}
          className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between"
        >
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none select-none shrink-0">
            <span
              style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.04em" }}
              className="text-[22px] font-normal text-gray-900"
            >
              TechX Shop<span className="text-gray-400">·</span>
            </span>
            <span className="text-[9px] tracking-[0.25em] text-gray-400 uppercase -mt-0.5">
              we make technology
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <div key={link.label} className="relative">
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={(e) => {
                          // FIX: stopPropagation not needed — we use mousedown + ref
                          toggleDropdown(link.label);
                        }}
                        className={`group flex items-center gap-1 text-[14px] tracking-wide transition-colors py-1 relative ${
                          isActive
                            ? "text-black font-semibold"
                            : "text-gray-500 hover:text-black"
                        }`}
                      >
                        {link.label}
                        <MdKeyboardArrowDown
                          className={`text-sm transition-transform duration-200 ${
                            openDropdown === link.label ? "rotate-180" : ""
                          }`}
                        />
                        {/* FIX: each link has its own unique layoutId */}
                        {isActive ? (
                          <motion.span
                            layoutId={`underline-${link.href}`}
                            className="absolute bottom-0 left-0 h-[1.5px] bg-black w-full"
                          />
                        ) : (
                          <span className="absolute bottom-0 left-0 h-px bg-black w-0 group-hover:w-full transition-all duration-300" />
                        )}
                      </button>

                      <DesktopDropdown
                        items={link.items}
                        isOpen={openDropdown === link.label}
                      />
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={`group flex items-center text-[14px] tracking-wide transition-colors py-1 relative ${
                        isActive
                          ? "text-black font-semibold"
                          : "text-gray-500 hover:text-black"
                      }`}
                    >
                      {link.label}
                      {isActive ? (
                        <motion.span
                          layoutId={`underline-${link.href}`}
                          className="absolute bottom-0 left-0 h-[1.5px] bg-black w-full"
                        />
                      ) : (
                        <span className="absolute bottom-0 left-0 h-px bg-black w-0 group-hover:w-full transition-all duration-300" />
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop icons */}
          <div className="hidden md:flex items-center gap-5 text-gray-700">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setSearchOpen((s) => !s)}
              className="hover:text-black transition-colors"
              aria-label="Search"
            >
              <AiOutlineSearch className="text-[22px]" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              className="hover:text-black transition-colors"
              aria-label="Account"
            >
              <AiOutlineUser className="text-[22px]" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              className="hover:text-black transition-colors"
              aria-label="Wishlist"
            >
              <AiOutlineHeart className="text-[22px]" />
            </motion.button>

            {/* Cart with badge */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              className="relative hover:text-black transition-colors"
              aria-label="Cart"
            >
              <AiOutlineShopping className="text-[22px]" />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium leading-none">
                2
              </span>
            </motion.button>
          </div>

          {/* Mobile: icons + hamburger */}
          <div className="md:hidden flex items-center gap-4 text-gray-700">
            <motion.button whileTap={{ scale: 0.88 }} aria-label="Wishlist">
              <AiOutlineHeart className="text-[22px]" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              className="relative"
              aria-label="Cart"
            >
              <AiOutlineShopping className="text-[22px]" />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center leading-none">
                2
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <HiX className="text-[22px]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <HiOutlineMenuAlt3 className="text-[22px]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Search bar — consistent container */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              key="searchbar"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center gap-3">
                <AiOutlineSearch className="text-gray-400 text-lg shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for products…"
                  className="flex-1 text-[13px] text-gray-700 placeholder-gray-300 outline-none tracking-wide bg-transparent"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-gray-400 hover:text-black text-[11px] tracking-widest uppercase shrink-0 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ═══════════════════════════════
          MOBILE DRAWER
          FIX: z-[55] — above header (z-50) but below nothing
      ═══════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 bg-black z-54 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 bottom-0 w-75 bg-white z-55 md:hidden flex flex-col overflow-y-auto"
              style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.12)" }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
                <button
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label="Search"
                  onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
                >
                  <AiOutlineSearch className="text-[20px]" />
                </button>

                <Link
                  href="/"
                  className="flex flex-col items-center leading-none"
                  onClick={() => setMobileOpen(false)}
                >
                  <span
                    style={{ fontFamily: "'Georgia', serif" }}
                    className="text-[18px] text-gray-900"
                  >
                    TechX Shop<span className="text-gray-400">·</span>
                  </span>
                  <span className="text-[8px] tracking-[0.22em] text-gray-400 uppercase">
                    we make technology
                  </span>
                </Link>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-600 hover:text-black transition-colors"
                  aria-label="Close"
                >
                  <HiX className="text-[20px]" />
                </button>
              </div>

              {/* Drawer nav — pass pathname as prop to avoid hook-in-loop */}
              <nav className="flex-1 pt-2">
                {NAV_LINKS.map((link, i) => (
                  <MobileNavItem
                    key={link.label}
                    link={link}
                    index={i}
                    pathname={pathname}
                  />
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="px-5 py-6 border-t border-gray-100 flex items-center gap-6 text-gray-600">
                <button className="flex items-center gap-2 text-[12px] tracking-wide hover:text-black transition-colors">
                  <AiOutlineUser className="text-lg" /> Account
                </button>
                <button className="flex items-center gap-2 text-[12px] tracking-wide hover:text-black transition-colors">
                  <AiOutlineHeart className="text-lg" /> Wishlist
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so page content clears the fixed header */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}