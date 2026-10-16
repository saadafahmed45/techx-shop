"use client";

import React, { useRef } from "react";
import { useShopData } from "@/context/ShopDataContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";

export { ProductCard };

const FEATURED_FALLBACKS = [
  { _id: "fb-feat-1", slug: "airpods-pro-2", title: "AirPods Pro 2 with MagSafe Case", vendor: "Apple", price: 189, compareAtPrice: 239, badge: "-20%", images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.9, count: 1248 }, stock: 50 },
  { _id: "fb-feat-2", slug: "galaxy-watch-6-classic", title: "Galaxy Watch 6 Classic Bluetooth", vendor: "Samsung", price: 299, compareAtPrice: 349, badge: "-15%", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.8, count: 892 }, stock: 35 },
  { _id: "fb-feat-3", slug: "classic-everyday-backpack", title: "Classic Everyday Tech Backpack", vendor: "Herschel", price: 89, compareAtPrice: 0, badge: "New", images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.7, count: 664 }, stock: 20 },
  { _id: "fb-feat-4", slug: "wh-1000xm5-headphones", title: "WH-1000XM5 Wireless Noise-Cancelling", vendor: "Sony", price: 299, compareAtPrice: 369, badge: "-20%", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.9, count: 1365 }, stock: 45 },
  { _id: "fb-feat-5", slug: "logitech-mx-master-3", title: "Logitech MX Master 3S Wireless Mouse", vendor: "Logitech", price: 99, compareAtPrice: 119, badge: "-17%", images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.8, count: 2140 }, stock: 60 },
  { _id: "fb-feat-6", slug: "samsung-t7-ssd", title: "Samsung T7 Portable SSD 1TB", vendor: "Samsung", price: 109, compareAtPrice: 139, badge: "-22%", images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.9, count: 3210 }, stock: 40 },
];

const NEW_ARRIVALS_FALLBACKS = [
  { _id: "fb-new-1", slug: "go-3-portable-speaker", title: "Go 3 Waterproof Ultra-Portable Speaker", vendor: "JBL", price: 49, compareAtPrice: 0, badge: "New", images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.8, count: 2365 }, stock: 40 },
  { _id: "fb-new-2", slug: "k2-wireless-keyboard", title: "K2 Wireless Mechanical Keyboard RGB", vendor: "Keychron", price: 89, compareAtPrice: 0, badge: "New", images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.9, count: 892 }, stock: 25 },
  { _id: "fb-new-3", slug: "737-power-bank-24k", title: "737 Power Bank (PowerCore 24K)", vendor: "Anker", price: 99, compareAtPrice: 0, badge: "New", images: ["https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.8, count: 654 }, stock: 30 },
  { _id: "fb-new-4", slug: "gen-6-smartwatch-black", title: "Gen 6 Smartwatch Stainless Steel", vendor: "Fossil", price: 199, compareAtPrice: 0, badge: "New", images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.6, count: 785 }, stock: 18 },
  { _id: "fb-new-5", slug: "bose-qc45", title: "Bose QuietComfort 45 Headphones", vendor: "Bose", price: 279, compareAtPrice: 329, badge: "New", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.8, count: 1120 }, stock: 22 },
  { _id: "fb-new-6", slug: "gopro-hero-12", title: "GoPro HERO12 Black Action Camera", vendor: "GoPro", price: 349, compareAtPrice: 399, badge: "New", images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.7, count: 430 }, stock: 15 },
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
  const swiperRef = useRef(null);

  const realProducts = (allProducts || []).filter((p) => p && p.status === "active");

  const filtered = filterValue
    ? realProducts.filter((p) => Array.isArray(p.featured) && p.featured.includes(filterValue))
    : realProducts;

  const fallbackList = isNewArrivals || title.toLowerCase().includes("arrival")
    ? NEW_ARRIVALS_FALLBACKS
    : FEATURED_FALLBACKS;

  const displayProducts =
    filtered.length >= 4 ? filtered
    : filtered.length > 0 ? [...filtered, ...fallbackList.slice(filtered.length, 6)]
    : fallbackList;

  const resolvedViewAllText =
    viewAllText || (title.toLowerCase().includes("arrival") ? "View All" : "View All Products");

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2">
            {/* Arrow buttons */}
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous products"
              className="w-9 h-9 rounded-full border border-neutral-200 bg-white hover:bg-blue-600 hover:border-blue-600 hover:text-white text-neutral-600 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next products"
              className="w-9 h-9 rounded-full border border-neutral-200 bg-white hover:bg-blue-600 hover:border-blue-600 hover:text-white text-neutral-600 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* View All — desktop */}
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="hidden sm:inline-flex items-center gap-1.5 ml-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <span>{resolvedViewAllText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>

        {/* Carousel */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-neutral-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, A11y]}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              640:  { slidesPerView: 2, spaceBetween: 16 },
              768:  { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            loop={displayProducts.length > 4}
            className="!overflow-visible"
          >
            {displayProducts.map((product, i) => (
              <SwiperSlide key={product.slug || product._id || i}>
                <ProductCard product={product} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* View All — mobile */}
        {viewAllLink && (
          <div className="flex justify-center mt-8 sm:hidden">
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <span>{resolvedViewAllText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}