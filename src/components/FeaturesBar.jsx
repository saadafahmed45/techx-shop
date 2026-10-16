"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over $99",
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400",
    ring: "ring-blue-500/25",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    subtitle: "Hassle-free returns",
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400",
    ring: "ring-emerald-500/25",
  },
  {
    icon: ShieldCheck,
    title: "1 Year Warranty",
    subtitle: "Quality you can trust",
    color: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-400",
    ring: "ring-violet-500/25",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    subtitle: "24/7 customer support",
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-400",
    ring: "ring-amber-500/25",
  },
];

export default function FeaturesBar() {
  return (
    <section className="bg-[#0a0a0f] border-b border-white/5 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 cursor-default"
              >
                {/* Icon bubble */}
                <div
                  className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${item.color} ring-1 ${item.ring} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.iconColor} stroke-[1.8]`} />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className="text-[12px] sm:text-[13px] font-semibold text-white/90 leading-tight tracking-tight truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-white/40 mt-0.5 leading-tight truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
