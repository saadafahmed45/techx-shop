"use client";

import { useShopData } from "@/context/ShopDataContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import FadeIn from "@/components/FadeIn";

export { ProductCard };

export default function ProductSection({
  title = "Products",
  subtitle,
  filterValue,
  viewAllLink = "/product",
  bgColor = "bg-white",
  emptyMessage,
}) {
  const { products: allProducts, loading } = useShopData();

  const products = (allProducts || []).filter(
    (p) => p && p.status === "active",
  );

  const filtered = filterValue
    ? products.filter((p) => {
        if (Array.isArray(p.featured)) {
          return p.featured.includes(filterValue);
        }
        return false;
      })
    : products;

  const displayProducts = filtered.slice(0, 4);

  return (
    <section className={`py-16 sm:py-20 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-10 sm:mb-12">
          {/* Left */}
          <div className="space-y-1">
            {subtitle && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-neutral-300" />
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  {subtitle}
                </span>
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 leading-none">
              {title}
            </h2>
          </div>

          {/* Right */}
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              <span className="hidden sm:inline border-b border-transparent group-hover:border-neutral-950 transition-colors pb-0.5">
                Explore All
              </span>
              <span className="sm:hidden text-[11px]">All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* ── Divider line ── */}
        <div className="h-px bg-neutral-200/80 mb-8 sm:mb-10" />

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white border border-neutral-100">
                <div className="aspect-square bg-neutral-100 animate-pulse" />
                <div className="p-4 space-y-2.5">
                  <div className="h-2.5 w-16 bg-neutral-100 rounded-full animate-pulse" />
                  <div className="h-3 w-full bg-neutral-100 rounded animate-pulse" />
                  <div className="h-3 w-3/4 bg-neutral-100 rounded animate-pulse" />
                  <div className="pt-2 border-t border-neutral-50 mt-2">
                    <div className="h-4 w-20 bg-neutral-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/30">
            <p className="text-sm text-neutral-400 font-medium">
              {emptyMessage || `No ${title.toLowerCase()} currently available.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {displayProducts.map((product, i) => (
              <FadeIn key={product?.slug || product?._id || i} delay={i * 80} duration={500}>
                <ProductCard
                  product={product}
                  index={i}
                />
              </FadeIn>
            ))}
          </div>
        )}

        {/* ── Bottom CTA (mobile) ── */}
        {viewAllLink && displayProducts.length > 0 && (
          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              View All {title} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
