"use client";

import { ShieldCheck, Truck, Lock, RotateCcw, Headphones } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Direct official manufacturer warranty and guaranteed genuine hardware.",
  },
  {
    icon: Truck,
    title: "Express Delivery",
    description: "Fast, reliable dispatch across the country with live parcel tracking.",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    description: "Bank-level encryption with cash on delivery & multi-payment options.",
  },
  {
    icon: RotateCcw,
    title: "7-Day Easy Returns",
    description: "Hassle-free replacement policy if your order is defective or damaged.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Prompt assistance and tech consultation 7 days a week.",
  },
];

export default function WhyTechX() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            The TechX Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mt-1">
            Why Shop With TechX?
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col p-5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 hover:border-indigo-200 hover:shadow-xs transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 mb-4 shrink-0 shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-semibold text-neutral-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-[11.5px] text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
