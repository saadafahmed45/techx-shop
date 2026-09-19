"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DEFAULT_SLIDES = [
  {
    _id: "slide-flagship-phone",
    badge: "NEW LAUNCH",
    title: "Next Level Performance",
    description:
      "Experience power, speed, and innovation like never before. Engineered with aerospace titanium and next-gen processing architecture.",
    primaryCta: "Shop Now",
    primaryLink: "/product",
    secondaryCta: "Explore More",
    secondaryLink: "/collections",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop",
  },
  {
    _id: "slide-headphones",
    badge: "AUDIO REVOLUTION",
    title: "Pure Spatial Acoustic",
    description:
      "Lose yourself in lossless high-fidelity acoustics with adaptive active noise cancellation and ultra-plush ergonomic fit.",
    primaryCta: "Shop Now",
    primaryLink: "/product?category=Headphone",
    secondaryCta: "Explore More",
    secondaryLink: "/collections",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    _id: "slide-smartwatch",
    badge: "SMART WEARABLE",
    title: "Precision In Motion",
    description:
      "Ultra-bright AMOLED display, sapphire crystal glass, and continuous biometric tracking crafted for uncompromising endurance.",
    primaryCta: "Shop Now",
    primaryLink: "/product?category=Gadget",
    secondaryCta: "Explore More",
    secondaryLink: "/collections",
    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/hero-sliders`)
      .then((r) => r.json())
      .then((data) => {
        const active = Array.isArray(data)
          ? data.filter((s) => s.status === "active" && s.image)
          : [];

        if (active.length > 0) {
          const mapped = active.map((s, idx) => ({
            _id: s._id || `db-slide-${idx}`,
            badge: s.badge || "FEATURED GEAR",
            title: s.title || "Next Level Performance",
            description:
              s.description ||
              "Experience power, speed, and innovation like never before.",
            primaryCta: s.buttonText || "Shop Now",
            primaryLink: "/product",
            secondaryCta: "Explore More",
            secondaryLink: "/collections",
            image: s.image,
          }));
          setSlides(mapped);
        } else {
          setSlides(DEFAULT_SLIDES);
        }
      })
      .catch(() => setSlides(DEFAULT_SLIDES))
      .finally(() => setLoading(false));
  }, []);

  const go = useCallback(
    (next) => {
      setCurrent(next);
    },
    []
  );

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      go((current + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, [slides, current, paused, go]);

  const handlePrev = () => {
    clearInterval(timerRef.current);
    go((current - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    clearInterval(timerRef.current);
    go((current + 1) % slides.length);
  };

  if (loading) {
    return (
      <div className="w-full h-[460px] sm:h-[520px] lg:h-[560px] bg-[#0B0F19] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const slide = slides[current] || DEFAULT_SLIDES[0];

  return (
    <section
      className="relative w-full bg-[#0B0F19] overflow-hidden select-none border-b border-white/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center">
          
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-10 sm:py-14 lg:py-16">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 z-20 flex flex-col justify-center text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 self-start mb-3 sm:mb-4">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-blue-400">
                  {slide.badge || "NEW LAUNCH"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-3.5 sm:mb-4 drop-shadow-md">
                {slide.title}
              </h1>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-xl mb-7 sm:mb-8 leading-relaxed font-normal">
                {slide.description}
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Link
                  href={slide.primaryLink || "/product"}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold px-6 sm:px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>{slide.primaryCta || "Shop Now"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={slide.secondaryLink || "/collections"}
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white text-xs sm:text-sm font-semibold px-6 sm:px-7 py-3.5 rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer"
                >
                  <span>{slide.secondaryCta || "Explore More"}</span>
                </Link>
              </div>

            </div>

            {/* Right Visual Image Showcase Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center z-10">
              <div className="relative w-full max-w-[360px] sm:max-w-[440px] lg:max-w-none aspect-[4/3] sm:aspect-[16/11] lg:aspect-square flex items-center justify-center">
                
                {/* Floating Product Image Frame */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 group bg-slate-900/40">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0B0F19] via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

              </div>
            </div>

          </div>

          {/* ─── Circular Floating Navigation Arrows ─── */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Slide"
                className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* ─── Pagination Dots Indicator (Bottom Center) ─── */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => go(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === current
                      ? "w-8 h-2 bg-blue-500 shadow-md shadow-blue-500/50"
                      : "w-2 h-2 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
