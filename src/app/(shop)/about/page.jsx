import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Headphones, Award, CheckCircle2, ArrowRight } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://techx-shop.vercel.app";

export const metadata = {
  title: "About Us | TechX Shop - Premier Tech & Electronics Store in Bangladesh",
  description:
    "Learn about TechX Shop, Bangladesh's trusted tech store delivering authentic PC components, gaming gear, smart gadgets, and electronics with nationwide delivery and warranty.",
  keywords: [
    "About TechX Shop",
    "Tech shop in Bangladesh",
    "Authentic tech store",
    "Computer accessories shop Dhaka",
    "Electronics retailer Bangladesh",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About TechX Shop | Leading Electronics & Tech Store in Bangladesh",
    description:
      "TechX Shop is dedicated to delivering high-performance tech gadgets, gaming gear, PC hardware, and audio devices with 100% authenticity and nationwide warranty.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About TechX Shop",
    description: "About TechX Shop, an authentic electronics and tech accessories provider in Bangladesh.",
    url: `${SITE_URL}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "TechX Shop",
      url: SITE_URL,
      logo: `${SITE_URL}/apple-touch-icon.png`,
      description:
        "TechX Shop is a leading online retailer in Bangladesh providing authentic electronics, gaming gear, and tech gadgets.",
    },
  };

  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            About TechX Shop
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight leading-tight">
            Empowering Your Digital Lifestyle with Authentic Tech
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            TechX Shop is Bangladesh&apos;s destination for genuine electronics, premium PC components, gaming gear, and modern smart gadgets. We bridge the gap between quality technology and passionate enthusiasts.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-neutral-950">100% Authentic</h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every item sold on TechX Shop is sourced directly from certified distributors and manufacturers with official warranties.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-neutral-950">Fast Nationwide Delivery</h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Swift doorstep shipping across all 64 districts in Bangladesh with reliable cash-on-delivery options.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Headphones className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-neutral-950">Dedicated Support</h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Our expert technical support team is always ready to assist you before, during, and after your purchase.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-neutral-950">Best Value Deals</h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We offer competitive pricing, exclusive seasonal discounts, and transparent service on every single order.
            </p>
          </div>
        </div>

        {/* Brand Mission & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-neutral-900 text-white rounded-3xl p-8 sm:p-12">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Our Story
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Built for Tech Lovers, Gamers & Creators
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              TechX Shop was established with a singular goal: to create a seamless shopping experience for tech lovers across Bangladesh. We understand how important genuine hardware, dependable peripherals, and responsive customer service are.
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Whether you are upgrading your gaming rig, looking for ergonomic work-from-home setups, or seeking the newest wireless sound gear, TechX Shop delivers perfection.
            </p>
          </div>

          <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-300 mb-2">
              Why Customers Trust TechX Shop
            </h3>
            {[
              "Verified Brand-New Products with Brand Warranty",
              "Transparent Pricing & No Hidden Charges",
              "Hassle-Free Replacement & Return Policies",
              "Secure Online & Cash-on-Delivery Payment Methods",
            ].map((point, index) => (
              <div key={index} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-neutral-950">
            Ready to explore the best tech in Bangladesh?
          </h2>
          <Link
            href="/product"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}