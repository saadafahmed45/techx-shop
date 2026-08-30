"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#fafafa] border-t border-neutral-200/80 text-neutral-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-neutral-200/60">
          {/* Brand Column (2 cols on desktop) */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#09090b] text-white flex items-center justify-center font-bold text-xs">
                TX
              </div>
              <span className="font-semibold text-base tracking-tight text-neutral-950">
                TechX<span className="text-neutral-400 font-normal">Shop</span>
              </span>
            </Link>

            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
              Curated modern technology, audio, computing hardware, and accessories engineered for everyday performance and minimalist workspaces.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-900 block mb-2">
                Stay updated
              </span>
              <div className="flex max-w-sm gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-neutral-900"
                />
                <button className="px-4 py-2 bg-[#09090b] hover:bg-neutral-800 text-white rounded-lg text-xs font-medium transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/product" className="hover:text-neutral-950 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/product?category=smartphones" className="hover:text-neutral-950 transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link href="/product?category=laptops" className="hover:text-neutral-950 transition-colors">
                  Laptops & PCs
                </Link>
              </li>
              <li>
                <Link href="/product?category=audio" className="hover:text-neutral-950 transition-colors">
                  Audio & Headphones
                </Link>
              </li>
              <li>
                <Link href="/product?category=accessories" className="hover:text-neutral-950 transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/track-order" className="hover:text-neutral-950 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-neutral-950 transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-neutral-950 transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-neutral-950 transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <span className="text-neutral-500 block">support@techx.shop</span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-neutral-950 transition-colors">
                  About TechX
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-neutral-950 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-neutral-950 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-neutral-950 transition-colors">
                  Warranty & Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & payment methods */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-xs text-neutral-500">
          <p>© 2026 TechX Shop. All rights reserved.</p>

          <div className="flex items-center gap-4 text-neutral-400">
            <span className="text-[11px]">Official Tech Retailer</span>
            <span>•</span>
            <span className="text-[11px]">Cash on Delivery</span>
            <span>•</span>
            <span className="text-[11px]">Nationwide Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
}