"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineShopping,
} from "react-icons/ai";

import {
  HiOutlineMenuAlt3,
  HiX,
} from "react-icons/hi";

import { MdKeyboardArrowDown } from "react-icons/md";

import Link from "next/link";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/context/CartContext";

// ─────────────────────────────────────────────
// Nav Data
// ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/product" },
  // { label: "About", href: "/about" },
  // { label: "Collections", href: "/collections" },
  { label: "Dashboard", href: "/admin" },
  { label: "Search", href: "/search" },
  { label: "track-order", href: "/track-order" },

  {
    label: "Accessories",
    href: "/accessories",
    hasDropdown: true,
    items: [
      { label: "Electronics", href: "electronics" },
      { label: "Shoes", href: "shoes" },
      { label: "Cases", href: "cases" },
    ],
  },
];


//  cart context

export default function Navbar() {

    const {
    cart,
  } = useCart();

  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

const API = process.env.NEXT_PUBLIC_API_URL;


   const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API}/collections`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array ensures it runs once on mount
  return (
    <>
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className=" mx-auto px-5 md:px-32 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col leading-none"
          >
            <span
              style={{
                fontFamily: "'Georgia', serif",
              }}
              className="text-[22px] text-gray-900"
            >
              TechX Shop
              <span className="text-gray-400">·</span>
            </span>

            <span className="text-[9px] tracking-[0.25em] text-gray-400 uppercase">
              we make technology
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href;

              return (
                <div
                  key={link.label}
                  className="relative"
                >
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            !dropdownOpen
                          )
                        }
                        className="flex items-center gap-1 text-[14px] text-gray-600 hover:text-black"
                      >
                        {link.label}

                        <MdKeyboardArrowDown className="text-lg" />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 shadow-lg rounded-md overflow-hidden min-w-42.5">
                          {data?.map((item) => (
                            <Link
                              key={item.href}
                              href={`/product?category=${item.slug}`}
                              className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black"
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
                      className={`text-[14px] ${
                        isActive
                          ? "text-black font-semibold"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-5 text-gray-700">
            <button
              onClick={() =>
                setSearchOpen(!searchOpen)
              }
            >
              <AiOutlineSearch className="text-[22px]" />
            </button>

            <button>
              <AiOutlineUser className="text-[22px]" />
            </button>

            <button>
              <AiOutlineHeart className="text-[22px]" />
            </button>
 <CartDrawer />
            <Link
              href="/cart"
              className="relative"
            >
              <AiOutlineShopping className="text-[22px]" />

              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
           {cart.length}
              </span>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-4">
            <button>
              <AiOutlineHeart className="text-[22px]" />
            </button>

            <Link
              href="/cart"
              className="relative"
            >
              <AiOutlineShopping className="text-[22px]" />

              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </Link>

            <button
              onClick={() =>
                setMobileOpen(!mobileOpen)
              }
            >
              {mobileOpen ? (
                <HiX className="text-[22px]" />
              ) : (
                <HiOutlineMenuAlt3 className="text-[22px]" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-5 md:px-10 py-3 flex items-center gap-3">
              <AiOutlineSearch className="text-gray-400" />

              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 outline-none text-sm"
              />

              <button
                onClick={() =>
                  setSearchOpen(false)
                }
                className="text-sm text-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() =>
              setMobileOpen(false)
            }
          />

          {/* Drawer */}
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 md:hidden overflow-y-auto">
            <div className="h-16 px-5 border-b border-gray-100 flex items-center justify-between">
              <span className="font-semibold text-lg">
                Menu
              </span>

              <button
                onClick={() =>
                  setMobileOpen(false)
                }
              >
                <HiX className="text-[22px]" />
              </button>
            </div>

            <nav className="py-3">
              {NAV_LINKS.map((link) => (
                <div key={link.label}>
                  {link.hasDropdown ? (
                    <>
                      <div className="px-5 py-3 text-sm font-medium text-gray-700">
                        {link.label}
                      </div>

                      {link.items.map((item) => (
                        <Link
                          key={item.href}
                          href={`/product?category=${item.href}`}
                          className="block pl-10 pr-5 py-2 text-sm text-gray-500 hover:text-black"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={`block px-5 py-3 text-sm ${
                        pathname === link.href
                          ? "text-black font-semibold"
                          : "text-gray-600"
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