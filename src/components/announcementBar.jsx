"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Truck, Package, Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="relative bg-gradient-to-r from-[#060a14] via-[#0c1427] to-[#060a14] text-white py-2 sm:py-2.5 px-4 text-xs border-b border-neutral-800/70 select-none overflow-hidden">
      {/* Subtle background ambient light */}
      <div className="absolute top-0 left-1/3 w-72 h-8 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 relative z-10">
        
        {/* Left: Highlight Offer with mini badge */}
        <div className="flex items-center flex-wrap justify-center sm:justify-start gap-2 text-neutral-300">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10.5px] font-bold uppercase tracking-wider">
            <span className="text-xs">🔥</span>
            <span>Summer Sale</span>
          </span>

          <span className="text-[12px] sm:text-[13px] font-normal text-neutral-300">
            Get Up to <span className="font-bold text-white">60% OFF</span> on Selected Accessories
          </span>

          <Link
            href="/product?sale=true"
            className="group inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold text-[12px] sm:text-[13px] transition-colors ml-0.5"
          >
            <span className="underline underline-offset-4 decoration-blue-500/50 group-hover:decoration-blue-400">
              Shop Now
            </span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Right: Free Shipping & Track Order Pill Button */}
        <div className="flex items-center gap-3 sm:gap-4 text-neutral-300">
          {/* Shipping Perks */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-300">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>Free Express Delivery over $99</span>
          </div>

          <span className="hidden md:inline-block w-1 h-1 rounded-full bg-neutral-700" />

          {/* Track Order Chip Button */}
          <Link
            href="/track-order"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-blue-600/15 border border-white/10 hover:border-blue-500/40 text-neutral-200 hover:text-white text-xs font-semibold transition-all duration-200 shadow-xs group"
          >
            <Package className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>Track Order</span>
          </Link>
        </div>

      </div>
    </div>
  );
}