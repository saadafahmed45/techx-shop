"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, RotateCcw, ShieldCheck, ChevronDown, Check } from "lucide-react";

export default function AnnouncementBar() {
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");

  return (
    <div className="bg-[#0B0F19] text-white text-xs border-b border-white/[0.08] select-none relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Perks matching the reference image */}
        <div className="flex items-center flex-wrap justify-center sm:justify-start gap-4 sm:gap-7 text-slate-300 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2 hover:text-white transition-colors">
            <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Free Shipping on Orders Over $99</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
            <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>30-Day Easy Returns</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 hover:text-white transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>1 Year Warranty</span>
          </div>
        </div>

        {/* Right: Support, Track Order & Language Selector */}
        <div className="flex items-center gap-4 sm:gap-5 text-slate-300 text-[11px] sm:text-xs">
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
              onClick={() => setLangOpen((prev) => !prev)}
              className="flex items-center gap-1 hover:text-white transition-colors font-medium cursor-pointer"
            >
              <span>{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-1.5 bg-[#0f1523] border border-white/10 rounded-xl shadow-xl py-1 min-w-[90px] z-50 animate-in fade-in zoom-in-95 duration-150">
                {["EN", "BN"].map((code) => (
                  <button
                    key={code}
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