"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over $99",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    subtitle: "Hassle-free returns",
  },
  {
    icon: ShieldCheck,
    title: "1 Year Warranty",
    subtitle: "Quality you can trust",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    subtitle: "24/7 customer support",
  },
];

export default function FeaturesBar() {
  return (
    <section className="bg-white py-6 sm:py-8 border-b border-slate-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-6 sm:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
            {FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 pt-4 sm:pt-0 lg:px-6 first:pl-0 last:pr-0 group"
                >
                  <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-slate-900 stroke-[1.6] shrink-0 group-hover:text-blue-600 transition-colors" />
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-500 font-normal mt-0.5 truncate leading-snug">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
