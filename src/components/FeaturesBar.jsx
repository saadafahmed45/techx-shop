"use client";

import React from "react";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const FEATURES = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over $99",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    subtitle: "30-day return policy",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    subtitle: "100% secure payment",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "We're here to help",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

export default function FeaturesBar() {
  return (
    <section className="py-8 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/70 hover:border-neutral-300 hover:shadow-md transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${item.bg} ${item.border} ${item.color} border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-xs`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-normal mt-0.5 truncate">
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
