"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Sparkles } from "lucide-react";

export default function HeroModern() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8faff] via-[#f1f5fb] to-white py-12 lg:py-20 border-b border-neutral-100">
      {/* Soft ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-20 left-10 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-700">
                New Collection 2026
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight leading-[1.1]">
              Elevate Your Everyday{" "}
              <span className="text-blue-600 inline-block drop-shadow-xs">
                Accessories
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-neutral-600 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Premium accessories engineered for high performance, travel comfort, and modern digital lifestyle.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
              <Link
                href="/product"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/product?sale=true"
                className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-white hover:bg-neutral-50 active:scale-[0.98] text-neutral-800 font-semibold text-sm border border-neutral-200/90 shadow-xs hover:border-neutral-300 transition-all"
              >
                Explore Deals
              </Link>
            </div>

            {/* Social Proof Stack */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 border-t border-neutral-200/60">
              {/* Customer Avatars */}
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar 1"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar 2"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar 3"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover shadow-xs"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Customer avatar 4"
                />
              </div>

              {/* Stats & Rating */}
              <div className="text-left">
                <p className="text-sm font-bold text-neutral-900 leading-snug">
                  25K+ Happy Customers
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-neutral-800">4.9/5</span>
                  <span className="text-xs text-neutral-500">(2.5K Reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Composition Stage */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Floating Discount Badge */}
            <div className="absolute -top-3 right-4 sm:top-2 sm:right-6 z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600 text-white flex flex-col items-center justify-center p-2 text-center shadow-xl shadow-blue-500/35 border-2 border-white/80 animate-bounce duration-1000">
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase leading-tight opacity-90">
                UP TO
              </span>
              <span className="text-lg sm:text-2xl font-black leading-none">
                50%
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase leading-tight">
                OFF
              </span>
            </div>

            {/* Studio Platform Container */}
            <div className="relative w-full aspect-4/3 sm:aspect-16/11 max-w-xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-white to-slate-100/90 border border-neutral-200/80 shadow-2xl shadow-blue-900/5 flex items-center justify-center p-4 sm:p-6 group">
              {/* Product Showcase Image */}
              <div className="relative w-full h-full min-h-[280px] sm:min-h-[380px]">
                <Image
                  src="/hero-showcase.jpg"
                  alt="Elevate Your Everyday Accessories Showcase"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain rounded-2xl transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl pointer-events-none" />

                {/* Floating Micro Product Pills */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/60 shadow-md">
                    <span className="text-xs font-bold text-neutral-900">
                      Noise-Cancelling Gear
                    </span>
                  </div>
                  <div className="bg-neutral-900/85 backdrop-blur-md px-3 py-1 rounded-full border border-neutral-700/60 shadow-md">
                    <span className="text-xs font-medium text-white flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      Studio Series
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
