"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-[#09090b] text-white py-2.5 px-4 text-sm font-medium border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center text-neutral-300">
        <span className="inline-flex items-center gap-2 font-normal text-[13.5px] sm:text-sm">
          <Sparkles className="w-4 h-4 text-neutral-400" />
          <span>Complimentary express delivery on all orders over $300</span>
        </span>
        <span className="hidden sm:inline-block text-neutral-600">•</span>
        <Link
          href="/product"
          className="hidden sm:inline-flex items-center gap-1.5 text-white hover:text-neutral-300 font-medium underline underline-offset-4 text-sm transition-colors"
        >
          Shop Latest Tech
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}