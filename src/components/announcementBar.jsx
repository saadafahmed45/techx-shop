"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Package,
} from "lucide-react";

const ANNOUNCEMENTS = [
  {
    icon: Truck,
    text: "Free Shipping on Orders Over $99",
    href: "/product",
  },
  {
    icon: RotateCcw,
    text: "30-Day Easy & Hassle-Free Returns",
    href: "/about",
  },
  {
    icon: ShieldCheck,
    text: "1-Year Official Manufacturer Warranty",
    href: "/about",
  },
  {
    icon: Package,
    text: "Real-Time Order & Shipment Tracking",
    href: "/track-order",
  },
  {
    icon: Headphones,
    text: "24/7 Dedicated Customer Support",
    href: "/contact",
  },
];

export default function AnnouncementBar() {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotate on mobile every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = useCallback(() => {
    setActiveIdx((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  }, []);

  const current = ANNOUNCEMENTS[activeIdx];
  const CurrentIcon = current.icon;

  return (
    <div className="bg-[#0B0F19] text-white text-xs border-b border-white/8 select-none relative z-50">
      {/* ─── MOBILE VIEW: Sleek, Single-Line Animated Carousel ─── */}
      <div
        className="md:hidden max-w-7xl mx-auto px-2 flex items-center justify-between h-8 text-[11px] text-slate-300"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <Link
          href={current.href}
          className="flex-1 flex items-center justify-center gap-1.5 px-2 overflow-hidden text-center truncate hover:text-white transition-colors"
        >
          <CurrentIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate font-medium tracking-tight">
            {current.text}
          </span>
        </Link>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next announcement"
          className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ─── DESKTOP VIEW: Full Wide Layout with Perks & Utilities ─── */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 items-center justify-between gap-4">
        {/* Left: Perks */}
        <div className="flex items-center gap-6 text-slate-300 text-xs">
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Free Shipping on Orders Over $99</span>
          </div>

          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>30-Day Easy Returns</span>
          </div>

          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>1 Year Warranty</span>
          </div>
        </div>

        {/* Right: Support, Track Order & Language Selector */}
        <div className="flex items-center gap-4 text-slate-300 text-xs">
          <Link
            href="/contact"
            className="hover:text-white transition-colors"
          >
            Support
          </Link>

          <span className="w-1 h-1 rounded-full bg-slate-700" />

          <Link
            href="/track-order"
            className="hover:text-white transition-colors"
          >
            Track Order
          </Link>

          <span className="w-1 h-1 rounded-full bg-slate-700" />

          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((prev) => !prev)}
              className="flex items-center gap-1 hover:text-white transition-colors font-medium cursor-pointer"
            >
              <span>{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-1.5 bg-[#0f1523] border border-white/10 rounded-xl shadow-xl py-1 min-w-22.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {["EN", "BN"].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setCurrentLang(code);
                      setLangOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-blue-600/20 hover:text-blue-400 flex items-center justify-between transition cursor-pointer"
                  >
                    <span>{code}</span>
                    {currentLang === code && <Check className="w-3 h-3 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}