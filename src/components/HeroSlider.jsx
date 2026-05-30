"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ==========================================
// FALLBACK DUMMY DATA
// ==========================================

const DUMMY_SLIDES = [
  {
    _id: "dummy-1",
    image:
      "https://images.pexels.com/photos/29457406/pexels-photo-29457406.jpeg",
    title: "Nike Air Max 2026 fsdfsdf",
    description:
      "Experience next-level comfort with the all-new Nike Air Max. Designed for everyday performance and bold street style.",
    badge: "Best Seller of the Year",
    buttonText: "SHOP NOW",
  },
];

// ==========================================
// SKELETON
// ==========================================

const HeroSliderSkeleton = () => (
  <div className="w-full">
    {/* Main image area */}
    <div className="relative w-full h-64 md:h-[80vh] bg-gray-200 overflow-hidden">

      {/* Shimmer sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/30 to-transparent" />

      {/* Vertical badge placeholder */}
      <div className="absolute left-2 sm:left-4 lg:left-8 top-4 sm:top-8">
        <div className="w-5 h-24 bg-gray-300 rounded-r-lg animate-pulse" />
      </div>

      {/* Prev / Next button placeholders */}
      <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-300 animate-pulse" />
      </div>
      <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gray-300 animate-pulse" />
      </div>

      {/* Thumbnail placeholders — desktop */}
      <div className="hidden lg:flex flex-col gap-4 absolute right-6 bottom-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-32 h-20 rounded-2xl bg-gray-300 animate-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* Overlay text placeholders */}
      <div className="absolute left-0 bottom-0 w-full p-3 sm:p-4 lg:p-6 bg-linear-to-t from-black/60 via-black/20 to-transparent">
        {/* Title */}
        <div className="h-6 sm:h-8 lg:h-10 w-2/3 bg-gray-300/60 rounded-lg animate-pulse mb-2 sm:mb-3" />
        {/* Description line 1 */}
        <div className="h-3 sm:h-4 w-full bg-gray-300/50 rounded-md animate-pulse mb-1.5" style={{ animationDelay: "0.1s" }} />
        {/* Description line 2 */}
        <div className="h-3 sm:h-4 w-4/5 bg-gray-300/50 rounded-md animate-pulse mb-3 sm:mb-5" style={{ animationDelay: "0.2s" }} />
        {/* Button */}
        <div className="h-7 sm:h-9 w-24 sm:w-28 bg-gray-300/60 rounded-lg animate-pulse" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>

    {/* Dot indicators — mobile/tablet */}
    <div className="flex lg:hidden gap-2 sm:gap-3 mt-4 sm:mt-6 justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`rounded-full bg-gray-300 animate-pulse ${i === 0 ? "w-8 h-2" : "w-2 h-2"}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>

    <style>{`
      @keyframes shimmer {
        100% { transform: translateX(200%); }
      }
    `}</style>
  </div>
);

// ==========================================
// HERO SLIDER
// ==========================================

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch(`${API}/hero-sliders`);
        const data = await res.json();

        const activeSliders = Array.isArray(data)
          ? data.filter((s) => s.status === "active" && s.image)
          : [];

        setSlides(activeSliders.length > 0 ? activeSliders : DUMMY_SLIDES);
      } catch {
        setSlides(DUMMY_SLIDES);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const handlePrev = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleNext = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  if (loading) return <HeroSliderSkeleton />;

  const slide = slides[currentSlide];

  return (
    <div className="">
      <div className="mx-auto">
        <div className="relative flex flex-col gap-4 sm:gap-6">
          <div className="relative w-full">
            <div className="relative h-64 md:h-[80vh] overflow-hidden w-full">

              {/* BACKGROUND IMAGE */}
              <div className="w-full pt-[56.25%] sm:pt-[56.25%] lg:pt-[56.25%] relative bg-gray-100">
                <Image
                  fill
                  key={slide._id}
                  src={slide.image}
                  alt={slide.title || "Hero Slide"}
                  priority
                  fetchPriority="high"
                  sizes="100vw"
                  quality={75}
                  className="absolute inset-0 object-cover transition-opacity duration-500"
                />
              </div>

              {/* VERTICAL BADGE */}
              {slide.badge && (
                <div
                  className="absolute left-2 sm:left-4 lg:left-8 top-4 sm:top-8 bg-black text-white text-xs font-bold px-2 py-2 rounded-r-lg"
                  style={{ writingMode: "vertical-rl", letterSpacing: "0.05em" }}
                >
                  {slide.badge}
                </div>
              )}

              {/* OVERLAY INFO */}
              <div className="absolute left-0 bottom-0 w-full p-3 sm:p-4 lg:p-6 bg-linear-to-t from-black/80 via-black/40 to-transparent">
                <h2 className="text-lg sm:text-2xl lg:text-4xl font-extrabold mb-1 sm:mb-2 text-white">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-white mb-2 sm:mb-4 line-clamp-1 sm:line-clamp-2">
                  {slide.description}
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition">
                  {slide.buttonText || "SHOP NOW"}
                </button>
              </div>

              {/* PREV BUTTON */}
              {slides.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition z-10"
                  aria-label="Previous slide"
                >
                  &#10094;
                </button>
              )}

              {/* NEXT BUTTON */}
              {slides.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 sm:p-3 rounded-full transition z-10"
                  aria-label="Next slide"
                >
                  &#10095;
                </button>
              )}

              {/* THUMBNAILS — Desktop only */}
              {slides.length > 1 && (
                <div className="hidden lg:flex flex-col gap-4 absolute right-6 bottom-6">
                  {slides.map((s, idx) => (
                    <button
                      key={s._id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`rounded-2xl border-2 overflow-hidden w-32 h-20 transition ${
                        idx === currentSlide
                          ? "border-blue-500"
                          : "border-white opacity-60"
                      }`}
                    >
                      <img
                        src={s.image}
                        alt={`Slide ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DOT INDICATORS — Mobile/Tablet */}
        {slides.length > 1 && (
          <div className="flex lg:hidden gap-2 sm:gap-3 mt-4 sm:mt-6 justify-center">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`rounded-full transition-all ${
                  idx === currentSlide
                    ? "bg-blue-600 w-8 h-2"
                    : "bg-gray-300 w-2 h-2"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSlider;