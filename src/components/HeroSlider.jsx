"use client";

import { FloatingWhatsApp } from "@digicroz/react-floating-whatsapp";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const DUMMY_SLIDES = [
  {
    _id: "dummy-1",
    image: "https://images.pexels.com/photos/29457406/pexels-photo-29457406.jpeg",
    title: "Nike Air Max 2026",
    description:
      "Experience next-level comfort with the all-new Nike Air Max. Designed for everyday performance and bold street style.",
    badge: "Best Seller",
    buttonText: "SHOP NOW",
  },
];

// ─── Skeleton ───────────────────────────────────────────
const Skeleton = () => (
  <div className="w-full">
    <div className="relative w-full h-[55vw] max-h-[88vh] min-h-65 bg-neutral-200 overflow-hidden rounded-none">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/25 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-14">
        <div className="h-4 w-28 bg-neutral-300 rounded-full mb-4 animate-pulse" />
        <div className="h-8 sm:h-12 w-2/3 bg-neutral-300 rounded-xl mb-3 animate-pulse" />
        <div className="h-3.5 w-full bg-neutral-300/70 rounded-lg mb-2 animate-pulse" />
        <div className="h-3.5 w-4/5 bg-neutral-300/70 rounded-lg mb-6 animate-pulse" />
        <div className="h-9 w-28 bg-neutral-300 rounded-lg animate-pulse" />
      </div>
    </div>
    <style>{`@keyframes shimmer { 100% { transform: translateX(300%); } }`}</style>
  </div>
);

// ─── Main Component ──────────────────────────────────────
export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);       // outgoing slide index
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // ── Fetch ──
  useEffect(() => {
    fetch(`${API}/hero-sliders`)
      .then((r) => r.json())
      .then((data) => {
        const active = Array.isArray(data)
          ? data.filter((s) => s.status === "active" && s.image)
          : [];
        setSlides(active.length > 0 ? active : DUMMY_SLIDES);
      })
      .catch(() => setSlides(DUMMY_SLIDES))
      .finally(() => setLoading(false));
  }, []);

  // ── Preload all images once slides arrive ──
  useEffect(() => {
    slides.forEach((s) => {
      const img = new window.Image();
      img.src = s.image;
    });
  }, [slides]);

  // ── Auto-advance ──
  const go = useCallback(
    (next) => {
      setPrev(current);
      setCurrent(next);
      // clear outgoing after transition
      setTimeout(() => setPrev(null), 700);
    },
    [current]
  );

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      go((current + 1) % slides.length);
    }, 4500);
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
  const handleDot = (i) => {
    clearInterval(timerRef.current);
    go(i);
  };

  if (loading) return <Skeleton />;

  const slide = slides[current];

  return (
    <div
      className="w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

          <FloatingWhatsApp
      phoneNumber='1234567890'
      accountName='TechX Shop'
      avatar='techx-img.jpg'
      statusMessage='Typically replies within 1 hour'
      chatMessage='Hello! 👋 How can we help you today?'
      darkMode={false}
      allowClickAway={true}
      allowEsc={true}
      notification={true}
      notificationSound={true}
    />
      {/* ── Main stage ── */}
      <div className="relative w-full h-[55vw] max-h-[88vh] min-h-65 overflow-hidden bg-neutral-900">

        {/* ── All slides stacked; opacity controlled ── */}
        {slides.map((s, idx) => {
          const isActive = idx === current;
          const isLeaving = idx === prev;
          return (
            <div
              key={s._id}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{
                opacity: isActive ? 1 : isLeaving ? 0 : 0,
                zIndex: isActive ? 2 : isLeaving ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              <Image
                src={s.image}
                alt={s.title || `Slide ${idx + 1}`}
                fill
                sizes="100vw"
                quality={90}
                priority={idx === 0}
                className="object-cover"
                // no key change — stable mount
              />
            </div>
          );
        })}

        {/* ── Dark gradient overlay ── */}
        <div className="absolute inset-0 z-10 bg-linear-to-r from-black/70 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-2/5 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />

        {/* ── Content ── */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-8 lg:p-14 max-w-3xl">

          {/* Badge */}
          {slide.badge && (
            <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                {slide.badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white leading-none tracking-tight mb-2 sm:mb-3 lg:mb-4 drop-shadow-lg">
            {slide.title}
          </h2>

          {/* Description */}
          {/* {slide.description && (
            <p className="text-xs   sm:text-sm lg:text-base text-white/75 mb-4 sm:mb-6 lg:mb-8 line-clamp-2 max-w-xl leading-relaxed">
              {slide.description}
            </p>
          )} */}

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button className="group relative overflow-hidden bg-white text-black text-xs sm:text-sm font-extrabold px-5 sm:px-7 py-2.5 sm:py-3 rounded-full tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20">
              <span className="relative z-10">{slide.buttonText || "SHOP NOW"}</span>
              <span className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
              <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-extrabold text-xs sm:text-sm tracking-wider">
                {slide.buttonText || "SHOP NOW"}
              </span>
            </button>

            <button className="text-white/60 hover:text-white text-xs sm:text-sm font-semibold tracking-wide transition-colors underline underline-offset-4">
              Learn more
            </button>
          </div>
        </div>

        {/* ── Prev / Next ── */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* ── Slide counter (top-right) ── */}
        {slides.length > 1 && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
            <span className="text-white text-xs font-bold">{String(current + 1).padStart(2, "0")}</span>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-white/50 text-xs">{String(slides.length).padStart(2, "0")}</span>
          </div>
        )}

        {/* ── Thumbnail strip — desktop ── */}
        {slides.length > 1 && (
          <div className="hidden lg:flex flex-col gap-3 absolute right-5 bottom-8 z-30">
            {slides.map((s, idx) => (
              <button
                key={s._id}
                onClick={() => handleDot(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden transition-all duration-300 ${
                  idx === current
                    ? "ring-2 ring-white scale-105 opacity-100"
                    : "opacity-40 hover:opacity-70 hover:scale-105"
                }`}
              >
                <Image
                  src={s.image}
                  alt={`Slide ${idx + 1}`}
                  fill
                  sizes="96px"
                  quality={60}
                  className="object-cover"
                />
                {idx === current && (
                  <div className="absolute inset-0 bg-blue-500/20" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Progress bar ── */}
        {slides.length > 1 && !paused && (
          <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/10">
            <div
              key={current}
              className="h-full bg-white/60 animate-[progress_4.5s_linear_forwards]"
            />
          </div>
        )}
      </div>

      {/* ── Dot indicators — mobile/tablet ── */}
      {slides.length > 1 && (
        <div className="flex lg:hidden gap-2 mt-4 justify-center items-center">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDot(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`rounded-full transition-all duration-300 ${
                idx === current ? "bg-neutral-800 w-6 h-2" : "bg-neutral-300 w-2 h-2 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}