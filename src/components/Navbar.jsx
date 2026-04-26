"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineSearch, AiOutlineUser, AiOutlineHeart, AiOutlineShopping } from "react-icons/ai";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
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

// Desktop Dropdown
function DesktopDropdown({ items, isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full left-0 mt-2 bg-white border border-gray-100 shadow-lg min-w-[180px] z-50"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={item.href}
                className="block px-5 py-2.5 text-[16px] text-gray-600 hover:text-black hover:bg-gray-50 tracking-wide transition-colors"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mobile Accordion Item
function MobileNavItem({ link, index }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className="border-b border-gray-100"
    >
      {link.hasDropdown ? (
        <button
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between px-5 py-4 text-[14px] font-medium tracking-widest uppercase transition-colors ${
            isActive ? "text-black" : "text-gray-500 hover:text-black"
          }`}
        >
          <span>{link.label}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <MdKeyboardArrowDown className="text-gray-400 text-lg" />
          </motion.span>
        </button>
      ) : (
        <Link
          href={link.href}
          className={`w-full flex items-center justify-between px-5 py-4 text-[14px] font-medium tracking-widest uppercase transition-colors ${
            isActive ? "text-black" : "text-gray-500 hover:text-black"
          }`}
        >
          <span>{link.label}</span>
          {isActive && (
            <motion.span
              layoutId="mobile-active-dot"
              className="w-1.5 h-1.5 rounded-full bg-black"
            />
          )}
        </Link>
      )}

      <AnimatePresence>
        {open && link.hasDropdown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {link.items.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -8 }}
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
    </motion.div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const close = () => setOpenDropdown(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <>
      {/* ───────────── DESKTOP NAVBAR ───────────── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none select-none">
            <span
              style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.04em" }}
              className="text-[24px] font-normal text-gray-900"
            >
              TechX Shop<span className="text-gray-400">·</span>
            </span>
            <span className="text-[12px] tracking-[0.25em] text-gray-400 uppercase mt-[-2px]">
              we make technology
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <div
                  key={link.label}
                  className="relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (link.hasDropdown) {
                      setOpenDropdown(openDropdown === link.label ? null : link.label);
                    }
                  }}
                >
                  {link.hasDropdown ? (
                    <button
                      className={`group flex items-center gap-1 text-[16px] tracking-wide transition-colors py-1 relative ${
                        isActive ? "text-black font-medium" : "text-gray-500 hover:text-black"
                      }`}
                    >
                      {link.label}
                      <MdKeyboardArrowDown
                        className={`text-sm transition-transform duration-200 ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                      {isActive ? (
                        <motion.span
                          layoutId="desktop-active-underline"
                          className="absolute bottom-0 left-0 h-[1.5px] bg-black w-full"
                        />
                      ) : (
                        <span className="absolute bottom-0 left-0 h-[1px] bg-black w-0 group-hover:w-full transition-all duration-300" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`group flex items-center gap-0.5 text-[16px] tracking-wide transition-colors py-1 relative ${
                        isActive ? "text-black font-medium" : "text-gray-500 hover:text-black"
                      }`}
                    >
                      {link.label}
                      {/* Animated active underline shared across links */}
                      {isActive ? (
                        <motion.span
                          layoutId="desktop-active-underline"
                          className="absolute bottom-0 left-0 h-[1.5px] bg-black w-full"
                        />
                      ) : (
                        <span className="absolute bottom-0 left-0 h-[1px] bg-black w-0 group-hover:w-full transition-all duration-300" />
                      )}
                    </Link>
                  )}

                  {link.hasDropdown && (
                    <DesktopDropdown
                      items={link.items}
                      isOpen={openDropdown === link.label}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-5 text-gray-700">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setSearchOpen(!searchOpen)}
              className="hover:text-black transition-colors"
              aria-label="Search"
            >
              <AiOutlineSearch className="text-[24px]" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              className="hover:text-black transition-colors"
              aria-label="Account"
            >
              <AiOutlineUser className="text-[24px]" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              className="hover:text-black transition-colors relative"
              aria-label="Wishlist"
            >
              <AiOutlineHeart className="text-[24px]" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.88 }}
              className="hover:text-black transition-colors relative"
              aria-label="Cart"
            >
              <AiOutlineShopping className="text-[24px]" />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                2
              </span>
            </motion.button>
          </div>

          {/* Mobile: right icons + hamburger */}
          <div className="md:hidden flex items-center gap-4 text-gray-700">
            <motion.button whileTap={{ scale: 0.88 }} aria-label="Wishlist">
              <AiOutlineHeart className="text-[24px]" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.88 }} className="relative" aria-label="Cart">
              <AiOutlineShopping className="text-[24px]" />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiX className="text-[22px]" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiOutlineMenuAlt3 className="text-[22px]" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-gray-100"
            >
              <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
                <AiOutlineSearch className="text-gray-400 text-lg" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for products…"
                  className="flex-1 text-[13px] text-gray-700 placeholder-gray-300 outline-none tracking-wide bg-transparent"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-gray-400 hover:text-black text-xs tracking-widest uppercase"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ───────────── MOBILE DRAWER ───────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.32, ease: "easeInOut" }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-50 md:hidden flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  className="text-gray-600 hover:text-black"
                  aria-label="Search"
                >
                  <AiOutlineSearch className="text-[20px]" />
                </motion.button>

                <Link href="/" className="flex flex-col items-center leading-none">
                  <span style={{ fontFamily: "'Georgia', serif" }} className="text-[18px] text-gray-900">
                    TechX Shop<span className="text-gray-400">·</span>
                  </span>
                  <span className="text-[8px] tracking-[0.22em] text-gray-400 uppercase">
                    we make technology
                  </span>
                </Link>

                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-600 hover:text-black"
                  aria-label="Close"
                >
                  <HiX className="text-[20px]" />
                </motion.button>
              </div>

              <nav className="flex-1 pt-2">
                {navLinks.map((link, i) => (
                  <MobileNavItem key={link.label} link={link} index={i} />
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="px-5 py-6 border-t border-gray-100 flex items-center gap-6 text-gray-600"
              >
                <button className="flex items-center gap-2 text-[12px] tracking-wide hover:text-black transition-colors">
                  <AiOutlineUser className="text-lg" /> Account
                </button>
                <button className="flex items-center gap-2 text-[12px] tracking-wide hover:text-black transition-colors">
                  <AiOutlineHeart className="text-lg" /> Wishlist
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  );
}