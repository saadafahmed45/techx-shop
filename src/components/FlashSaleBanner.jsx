"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function FlashSaleBanner() {
  // Live ticking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 36,
    seconds: 22,
  });

  useEffect(() => {
    // 3 days target from mount
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(targetDate.getHours() + 14);
    targetDate.setMinutes(targetDate.getMinutes() + 36);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, "0");

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#0a0f1d] text-white border border-neutral-800 shadow-2xl">
          
          {/* Radial ambient lighting effects */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 lg:p-14">
            
            {/* Left Column: Offer details & Countdown */}
            <div className="lg:col-span-7 z-10 space-y-6">
              
              {/* Flash Sale Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-inner">
                <Zap className="w-3.5 h-3.5 fill-blue-400 text-blue-400 animate-pulse" />
                <span>FLASH SALE</span>
              </div>

              {/* Huge Headline */}
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
                  Up to 70% OFF
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 font-normal max-w-md">
                  Limited time offer on selected premium audio, smart gear and desktop accessories.
                </p>
              </div>

              {/* Countdown Timer Blocks */}
              <div className="flex items-center gap-2.5 sm:gap-3.5 pt-2">
                {[
                  { label: "Days", value: formatNumber(timeLeft.days) },
                  { label: "Hours", value: formatNumber(timeLeft.hours) },
                  { label: "Mins", value: formatNumber(timeLeft.minutes) },
                  { label: "Secs", value: formatNumber(timeLeft.seconds) },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center bg-neutral-900/90 border border-neutral-800/90 rounded-2xl w-16 sm:w-20 py-3 sm:py-3.5 shadow-inner"
                  >
                    <span className="text-xl sm:text-3xl font-black text-white leading-none font-mono">
                      {item.value}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 mt-1 uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href="/product?sale=true"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-sm shadow-xl shadow-white/10 transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

            </div>

            {/* Right Column: Hero Visual & Floating Badge */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Floating Badge */}
              <div className="absolute top-0 right-2 sm:top-4 sm:right-6 z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600 text-white flex flex-col items-center justify-center p-2 text-center shadow-2xl shadow-blue-500/50 border-2 border-white/80 animate-pulse">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase leading-tight opacity-90">
                  UP TO
                </span>
                <span className="text-lg sm:text-2xl font-black leading-none">
                  70%
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase leading-tight">
                  OFF
                </span>
              </div>

              {/* Glowing ring behind product */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-[spin_12s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-dashed border-cyan-400/40 animate-[spin_8s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full bg-radial from-blue-600/30 via-blue-500/10 to-transparent blur-xl" />

                {/* Product Image */}
                <div className="relative w-52 h-52 sm:w-64 sm:h-64 z-10 transition-transform duration-500 hover:scale-110">
                  <Image
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80"
                    alt="Flash Sale Featured Headphones"
                    fill
                    sizes="(max-width: 768px) 80vw, 30vw"
                    className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)]"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
