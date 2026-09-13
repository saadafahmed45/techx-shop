"use client";

import React from "react";
import { useShopData } from "@/context/ShopDataContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export { ProductCard };

const FEATURED_FALLBACKS = [
  {
    _id: "fb-feat-1",
    slug: "airpods-pro-2",
    title: "AirPods Pro 2 with MagSafe Case",
    vendor: "Apple",
    price: 189,
    compareAtPrice: 239,
    badge: "-20%",
    images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80"],
    rating: { average: 4.9, count: 1248 },
    stock: 50,
  },
  {
    _id: "fb-feat-2",
    slug: "galaxy-watch-6-classic",
    title: "Galaxy Watch 6 Classic Bluetooth",
    vendor: "Samsung",
    price: 299,
    compareAtPrice: 349,
    badge: "-15%",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80"],
    rating: { average: 4.8, count: 892 },
    stock: 35,
  },
  {
    _id: "fb-feat-3",
    slug: "classic-everyday-backpack",
    title: "Classic Everyday Tech Backpack",
    vendor: "Herschel",
    price: 89,
    compareAtPrice: 0,
    badge: "New",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80"],
    rating: { average: 4.7, count: 664 },
    stock: 20,
  },
  {
    _id: "fb-feat-4",
    slug: "wh-1000xm5-headphones",
    title: "WH-1000XM5 Wireless Noise-Cancelling",
    vendor: "Sony",
    price: 299,
    compareAtPrice: 369,
    badge: "-20%",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"],
    rating: { average: 4.9, count: 1365 },
    stock: 45,
  },
];

const NEW_ARRIVALS_FALLBACKS = [
  {
    _id: "fb-new-1",
    slug: "go-3-portable-speaker",
    title: "Go 3 Waterproof Ultra-Portable Speaker",
    vendor: "JBL",
    price: 49,
    compareAtPrice: 0,
    badge: "New",
    images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80"],
    rating: { average: 4.8, count: 2365 },
    stock: 40,
  },
  {
    _id: "fb-new-2",
    slug: "k2-wireless-keyboard",
    title: "K2 Wireless Mechanical Keyboard RGB",
    vendor: "Keychron",
    price: 89,
    compareAtPrice: 0,
    badge: "New",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80"],
    rating: { average: 4.9, count: 892 },
    stock: 25,
  },
  {
    _id: "fb-new-3",
    slug: "737-power-bank-24k",
    title: "737 Power Bank (PowerCore 24K)",
    vendor: "Anker",
    price: 99,
    compareAtPrice: 0,
    badge: "New",
    images: ["https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop&q=80"],
    rating: { average: 4.8, count: 654 },
    stock: 30,
  },
  {
    _id: "fb-new-4",
    slug: "gen-6-smartwatch-black",
    title: "Gen 6 Smartwatch Stainless Steel",
    vendor: "Fossil",
    price: 199,
    compareAtPrice: 0,
    badge: "New",
    images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80"],
    rating: { average: 4.6, count: 785 },
    stock: 18,
  },
];

export default function ProductSection({
  title = "Featured Products",
  subtitle,
  filterValue,
  viewAllLink = "/product",
  viewAllText,
  isNewArrivals = false,
}) {
  const { products: allProducts, loading } = useShopData();

  const realProducts = (allProducts || []).filter(
    (p) => p && p.status === "active"
  );

  const filtered = filterValue
    ? realProducts.filter((p) => {
        if (Array.isArray(p.featured)) {
          return p.featured.includes(filterValue);
        }
        return false;
      })
    : realProducts;

  // Fallback if not enough products from API
  const fallbackList = isNewArrivals || title.toLowerCase().includes("arrival")
    ? NEW_ARRIVALS_FALLBACKS
    : FEATURED_FALLBACKS;

  const displayProducts =
    filtered.length >= 4
      ? filtered.slice(0, 4)
      : filtered.length > 0
      ? [...filtered, ...fallbackList.slice(filtered.length, 4)]
      : fallbackList;

  const resolvedViewAllText =
    viewAllText ||
    (title.toLowerCase().includes("arrival")
      ? "View All"
      : "View All Products");

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <span>{resolvedViewAllText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product, i) => (
            <ProductCard
              key={product.slug || product._id || i}
              product={product}
              index={i}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
