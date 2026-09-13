"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedCollections() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Featured Collections
          </h2>
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 2-Column Split Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Collection 1: Tech Essentials */}
          <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#edf2f9] to-[#e1e9f4] border border-neutral-200/80 p-6 sm:p-10 flex flex-col justify-between min-h-[320px] sm:min-h-[360px] transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5">
            <div className="relative z-10 max-w-xs space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Tech Essentials
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
                Smart tech engineered for modern life and seamless daily productivity.
              </p>
              <div className="pt-3">
                <Link
                  href="/product?category=Tech+Essentials"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-900 hover:text-white text-neutral-900 font-semibold text-xs sm:text-sm shadow-sm transition-all duration-300 group/btn"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Showcase Image on Right / Bottom */}
            <div className="absolute right-0 bottom-0 w-3/5 sm:w-1/2 h-4/5 pointer-events-none transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-1">
              <Image
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&auto=format&fit=crop&q=80"
                alt="Tech Essentials Collection"
                fill
                sizes="(max-width: 768px) 60vw, 30vw"
                className="object-contain object-bottom-right drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Collection 2: Travel Collection */}
          <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#f6f2ea] to-[#eee4d3] border border-neutral-200/80 p-6 sm:p-10 flex flex-col justify-between min-h-[320px] sm:min-h-[360px] transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/5">
            <div className="relative z-10 max-w-xs space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                Travel Collection
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
                Built for every adventure with lightweight durability and smart compartments.
              </p>
              <div className="pt-3">
                <Link
                  href="/product?category=Travel"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-900 hover:text-white text-neutral-900 font-semibold text-xs sm:text-sm shadow-sm transition-all duration-300 group/btn"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Showcase Image on Right / Bottom */}
            <div className="absolute right-0 bottom-0 w-3/5 sm:w-1/2 h-4/5 pointer-events-none transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-1">
              <Image
                src="https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=700&auto=format&fit=crop&q=80"
                alt="Travel Collection"
                fill
                sizes="(max-width: 768px) 60vw, 30vw"
                className="object-contain object-bottom-right drop-shadow-2xl"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
