"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#09090b] text-white border border-neutral-800">
          {/* Subtle ambient light */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
            {/* Left Content */}
            <div className="lg:col-span-6 z-10 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700/60 text-indigo-300 text-[11px] font-medium tracking-wide">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Special Flagship Showcase</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Upgrade Your Everyday Tech.
              </h2>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-lg">
                Engineered with aerospace-grade materials, adaptive acoustic drivers, and all-day battery life. Designed to keep you focused wherever your work takes you.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/product"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-white hover:bg-neutral-100 text-neutral-950 font-medium text-xs transition-colors"
                >
                  <span>Explore Flagship</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/product"
                  className="inline-flex items-center h-11 px-5 rounded-lg border border-neutral-700 hover:border-neutral-500 text-neutral-300 hover:text-white font-medium text-xs transition-colors"
                >
                  Learn Specifications
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full aspect-16/10 sm:aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/80">
                <Image
                  src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg"
                  alt="Flagship Audio Device"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
