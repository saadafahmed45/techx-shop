"use client";

import React, { useRef, useState } from "react";
import { useShopData } from "@/context/ShopDataContext";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";

export { ProductCard };

const FEATURED_FALLBACKS = [
  { _id: "fb-feat-1", slug: "airpods-pro-2", title: "AirPods Pro 2 with MagSafe Case", category: "Audio", vendor: "Apple", price: 1890, compareAtPrice: 2390, badge: "-20%", images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.9, count: 1248 }, stock: 50 },
  { _id: "fb-feat-2", slug: "galaxy-watch-6-classic", title: "Galaxy Watch 6 Classic Bluetooth", category: "Smartwatch", vendor: "Samsung", price: 2990, compareAtPrice: 3490, badge: "-15%", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.8, count: 892 }, stock: 35 },
  { _id: "fb-feat-3", slug: "classic-everyday-backpack", title: "Classic Everyday Tech Backpack", category: "Bags", vendor: "Herschel", price: 890, compareAtPrice: 0, badge: "New", images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.7, count: 664 }, stock: 20 },
  { _id: "fb-feat-4", slug: "wh-1000xm5-headphones", title: "WH-1000XM5 Wireless Noise-Cancelling", category: "Headphones", vendor: "Sony", price: 2990, compareAtPrice: 3690, badge: "-20%", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.9, count: 1365 }, stock: 45 },
  { _id: "fb-feat-5", slug: "logitech-mx-master-3", title: "Logitech MX Master 3S Wireless Mouse", category: "Accessories", vendor: "Logitech", price: 990, compareAtPrice: 1190, badge: "-17%", images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.8, count: 2140 }, stock: 60 },
  { _id: "fb-feat-6", slug: "samsung-t7-ssd", title: "Samsung T7 Portable SSD 1TB", category: "Storage", vendor: "Samsung", price: 1090, compareAtPrice: 1390, badge: "-22%", images: ["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.9, count: 3210 }, stock: 40 },
];

const NEW_ARRIVALS_FALLBACKS = [
  { _id: "fb-new-1", slug: "go-3-portable-speaker", title: "Go 3 Waterproof Ultra-Portable Speaker", category: "Speakers", vendor: "JBL", price: 490, compareAtPrice: 0, badge: "New", images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.8, count: 2365 }, stock: 40 },
  { _id: "fb-new-2", slug: "k2-wireless-keyboard", title: "K2 Wireless Mechanical Keyboard RGB", category: "Keyboards", vendor: "Keychron", price: 890, compareAtPrice: 0, badge: "New", images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.9, count: 892 }, stock: 25 },
  { _id: "fb-new-3", slug: "737-power-bank-24k", title: "737 Power Bank (PowerCore 24K)", category: "Power Bank", vendor: "Anker", price: 990, compareAtPrice: 0, badge: "New", images: ["https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.8, count: 654 }, stock: 30 },
  { _id: "fb-new-4", slug: "gen-6-smartwatch-black", title: "Gen 6 Smartwatch Stainless Steel", category: "Smartwatch", vendor: "Fossil", price: 1990, compareAtPrice: 0, badge: "New", images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.6, count: 785 }, stock: 18 },
  { _id: "fb-new-5", slug: "bose-qc45", title: "Bose QuietComfort 45 Headphones", category: "Headphones", vendor: "Bose", price: 2790, compareAtPrice: 3290, badge: "New", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.8, count: 1120 }, stock: 22 },
  { _id: "fb-new-6", slug: "gopro-hero-12", title: "GoPro HERO12 Black Action Camera", category: "Cameras", vendor: "GoPro", price: 3490, compareAtPrice: 3990, badge: "New", images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80"], rating: { average: 4.7, count: 430 }, stock: 15 },
];

export default function ProductSection({
  title = "Featured Products",
  subtitle,
  eyebrow,
  filterValue,
  viewAllLink = "/product",
  viewAllText,
  isNewArrivals = false,
}) {
  const { products: allProducts, loading } = useShopData();
  const swiperRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const realProducts = (allProducts || []).filter((p) => p && p.status === "active");

  const filtered = filterValue
    ? realProducts.filter((p) => Array.isArray(p.featured) && p.featured.includes(filterValue))
    : realProducts;

  const fallbackList = isNewArrivals || title.toLowerCase().includes("arrival")
    ? NEW_ARRIVALS_FALLBACKS
    : FEATURED_FALLBACKS;

  const displayProducts =
    filtered.length >= 4 ? filtered
    : filtered.length > 0 ? [...filtered, ...fallbackList.slice(filtered.length, 8)]
    : fallbackList;

  const resolvedEyebrow =
    eyebrow ||
    (title.toLowerCase().includes("seller") || title.toLowerCase().includes("best")
      ? "COMMUNITY PICKS"
      : title.toLowerCase().includes("arrival") || isNewArrivals
      ? "JUST ARRIVED"
      : "CURATED SELECTION");

  const resolvedViewAllText = (viewAllText || "VIEW ALL").toUpperCase();

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-end justify-between pb-5 sm:pb-6 border-b border-neutral-200/80 mb-8 sm:mb-10">
          <div>
            <span className="text-xs sm:text-sm font-bold text-neutral-500 uppercase tracking-widest block mb-1">
              {resolvedEyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 uppercase tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* VIEW ALL link */}
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-900 hover:text-black uppercase tracking-wider transition-colors group"
              >
                <span>{resolvedViewAllText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            {/* Circular Next & Prev Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                disabled={isBeginning}
                aria-label="Previous products"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center transition-all duration-200 shadow-2xs active:scale-95 ${
                  isBeginning
                    ? "opacity-35 cursor-not-allowed text-neutral-300"
                    : "hover:border-neutral-950 hover:bg-neutral-950 hover:text-white text-neutral-700 cursor-pointer"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                disabled={isEnd}
                aria-label="Next products"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center transition-all duration-200 shadow-2xs active:scale-95 ${
                  isEnd
                    ? "opacity-35 cursor-not-allowed text-neutral-300"
                    : "hover:border-neutral-950 hover:bg-neutral-950 hover:text-white text-neutral-700 cursor-pointer"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Slider */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-neutral-100 animate-pulse rounded-xs" />
            ))}
          </div>
        ) : (
          <div>
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setScrollProgress(swiper.progress || 0);
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setScrollProgress(swiper.progress || 0);
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onProgress={(swiper, progress) => {
                setScrollProgress(progress);
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              modules={[Navigation, A11y]}
              spaceBetween={20}
              slidesPerView={1.3}
              breakpoints={{
                500:  { slidesPerView: 2, spaceBetween: 16 },
                768:  { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 28 },
              }}
              loop={false}
              className="!overflow-hidden"
            >
              {displayProducts.map((product, i) => (
                <SwiperSlide key={product.slug || product._id || i} className="!h-auto pb-1">
                  <ProductCard product={product} index={i} variant="carousel" />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Bottom Progress Bar Indicator */}
            <div className="flex justify-center mt-8 sm:mt-12">
              <div className="w-48 sm:w-64 h-[3px] bg-neutral-200 rounded-full overflow-hidden relative">
                <div
                  className="absolute top-0 h-full bg-neutral-950 rounded-full transition-all duration-200 ease-out"
                  style={{
                    width: "35%",
                    left: `${Math.min(Math.max(scrollProgress * 65, 0), 65)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}