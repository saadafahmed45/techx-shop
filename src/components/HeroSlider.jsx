"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://techx-server-tau.vercel.app";

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
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1920&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1920&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1920&auto=format&fit=crop",
  },
];

/**
 * Optimizes image URLs for ultra-fast CDN delivery:
 * Injects automatic WebP/AVIF format and responsive sizing for Cloudinary images.
 */
function optimizeImageUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (!url.includes("/f_auto") && !url.includes("f_auto,")) {
      return url.replace("/upload/", "/upload/f_auto,q_auto,w_1920,c_limit/");
    }
  }
  return url;
}

/**
 * Maps raw database slide objects to normalized slide models.
 */
function mapSlide(s, idx) {
  const badgeText =
    s.badge?.trim() ||
    (Array.isArray(s.badges) && s.badges.length > 0 && s.badges[0]?.trim()) ||
    "FEATURED GEAR";

  return {
    _id: s._id || `db-slide-${idx}`,
    badge: badgeText,
    title: s.title?.trim() || "Next Level Performance",
    description: s.description?.trim() || "",
    primaryCta: s.buttonText?.trim() || "Shop Now",
    primaryLink: "/product",
    secondaryCta: "Explore More",
    secondaryLink: "/collections",
    image: optimizeImageUrl(s.image),
  };
}

/**
 * Filters and formats slide list.
 */
function formatSlides(data) {
  if (!Array.isArray(data) || data.length === 0) return [];
  const active = data.filter((s) => s.status !== "draft" && s.image);
  if (active.length === 0) return [];
  return active.map(mapSlide);
}

export default function HeroSlider({ initialSlides = [] }) {
  // Initialize state immediately with formatted server data or fallback defaults (0ms loader delay)
  const [slides, setSlides] = useState(() => {
    const formatted = formatSlides(initialSlides);
    return formatted.length > 0 ? formatted : DEFAULT_SLIDES;
  });

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // Background silent revalidation using sessionStorage cache + SWR
  useEffect(() => {
    const CACHE_KEY = "techx_hero_sliders_v2";

    // 1. Check local session storage first
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const formatted = formatSlides(parsed);
        if (formatted.length > 0) {
          setSlides(formatted);
        }
      }
    } catch (e) {
      // Ignore sessionStorage issues
    }

    // 2. Fetch latest data in background without blocking UI
    fetch(`${API}/hero-sliders?status=active`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const formatted = formatSlides(data);
        if (formatted.length > 0) {
          setSlides(formatted);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
          } catch (e) {}
        }
      })
      .catch(() => {
        // Retain current slides on network failure
      });
  }, []);

  // Pre-warm / preload all slide images in browser cache for instantaneous transitions
  useEffect(() => {
    if (typeof window === "undefined" || slides.length <= 1) return;
    slides.forEach((slide) => {
      if (slide.image) {
        const img = new window.Image();
        img.src = slide.image;
      }
    });
  }, [slides]);

  const go = useCallback((next) => {
    setCurrent(next);
  }, []);

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      go((current + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, [slides, current, paused, go]);

  const handlePrev = (e) => {
    e?.stopPropagation?.();
    clearInterval(timerRef.current);
    go((current - 1 + slides.length) % slides.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation?.();
    clearInterval(timerRef.current);
    go((current + 1) % slides.length);
  };

  return (
    <section
      className="relative w-full h-120 sm:h-135 md:h-150 lg:h-165 xl:h-175 bg-neutral-950 overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Homepage Hero Carousel"
    >
      {/* ─── Stack of Full-Width & Full-Height Slides ─── */}
      {slides.map((slide, idx) => {
        const isActive = idx === current;
        return (
          <div
            key={slide._id || idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive
                ? "opacity-100 z-10 pointer-events-auto"
                : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            {/* Full-bleed Background Image */}
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.title || "TechX Hero Banner"}
                fill
                priority={idx === 0}
                fetchPriority={idx === 0 ? "high" : "auto"}
                sizes="100vw"
                quality={90}
                className={`object-cover object-center w-full h-full transition-transform duration-7000 ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />

              {/* Ambient Cinematic Contrast Overlays */}
              {/* Left-to-right subtle gradient for text readability while letting the image shine */}
              <div className="absolute inset-0 bg-linear-to-r from-neutral-950/85 via-neutral-950/45 to-transparent sm:w-2/3" />
              {/* Bottom subtle gradient for clean transition */}
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent" />
              {/* Subtle top vignette */}
              <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-neutral-950/50 to-transparent pointer-events-none" />
            </div>

            {/* Content Container (Layered above the image) */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl sm:max-w-2xl text-left py-12">
                  
                  {/* Badge */}
                  {slide.badge && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/40 backdrop-blur-md mb-4 sm:mb-5 shadow-lg shadow-blue-900/20">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                        {slide.badge}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] mb-3.5 sm:mb-4 drop-shadow-md">
                    {slide.title}
                  </h1>

                  {/* Description (Renders only if available) */}
                  {slide.description ? (
                    <p className="text-slate-200 text-sm sm:text-base lg:text-lg max-w-xl mb-7 sm:mb-8 leading-relaxed font-normal drop-shadow">
                      {slide.description}
                    </p>
                  ) : (
                    <div className="mb-6 sm:mb-8" />
                  )}

                  {/* Call-to-Action Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                    <Link
                      href={slide.primaryLink || "/product"}
                      className="group inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs sm:text-sm font-bold px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl shadow-xl shadow-blue-600/30 transition-all duration-300 hover:shadow-blue-500/50 cursor-pointer"
                    >
                      <span>{slide.primaryCta || "Shop Now"}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      href={slide.secondaryLink || "/collections"}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/25 hover:border-white/40 text-white text-xs sm:text-sm font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg"
                    >
                      <span>{slide.secondaryCta || "Explore More"}</span>
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ─── Circular Floating Navigation Arrows ─── */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/75 border border-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/75 border border-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* ─── Modern Bottom Indicator & Progress Bar ─── */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-xl">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => go(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-500 rounded-full cursor-pointer ${
                idx === current
                  ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-blue-500 shadow-lg shadow-blue-500/60"
                  : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}

      {/* ─── Slide Counter (Top Right) ─── */}
      {slides.length > 1 && (
        <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 hidden sm:flex items-center gap-1 text-xs font-mono font-bold text-white/70 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
          <span className="text-white">0{current + 1}</span>
          <span className="text-white/40">/</span>
          <span>0{slides.length}</span>
        </div>
      )}
    </section>
  );
}
