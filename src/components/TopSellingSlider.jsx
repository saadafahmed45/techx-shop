"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShopData } from "@/context/ShopDataContext";
import { useCart } from "@/context/CartContext";
import { useWishlistStore } from "@/stores/wishlistStore";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Star,
  Heart,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function TopSellingSlider() {
  const { products: allProducts, loading } = useShopData();
  const { addToCart, openCart } = useCart();
  const { items, toggleWishlist } = useWishlistStore();

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const topSellingProducts = useMemo(() => {
    if (!allProducts?.length) return [];
    const active = allProducts.filter((p) => p && p.status === "active");
    const featured = active.filter(
      (p) => Array.isArray(p.featured) && p.featured.includes("Top Selling Products")
    );
    return featured.length > 0 ? featured : active.slice(0, 12);
  }, [allProducts]);

  // ── Scroll state tracker ──
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [topSellingProducts]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-card]")?.offsetWidth || 280;
    el.scrollBy({ left: direction * (cardWidth + 16), behavior: "smooth" });
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    openCart();
  };

  const handleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#f7f8fc] border-b border-neutral-200/60 relative overflow-hidden">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                Community Favorites
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950">
              Top Selling Hardware
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/product"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors group"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll(-1)}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll(1)}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Skeleton ── */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-65 sm:w-70 rounded-2xl bg-white animate-pulse"
              >
                <div className="aspect-square rounded-t-2xl bg-neutral-200/70" />
                <div className="p-4 space-y-2.5">
                  <div className="h-3 w-2/3 bg-neutral-200 rounded" />
                  <div className="h-3 w-full bg-neutral-200 rounded" />
                  <div className="h-5 w-1/3 bg-neutral-300 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : topSellingProducts.length === 0 ? (
          <div className="py-16 text-center text-sm text-neutral-400 bg-white rounded-2xl border border-dashed border-neutral-200">
            No top selling products available.
          </div>
        ) : (
          /* ── Horizontal scroll container ── */
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
            {/* Left fade */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-linear-to-r from-[#f7f8fc] to-transparent z-10 pointer-events-none" />
            )}
            {/* Right fade */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-linear-to-l from-[#f7f8fc] to-transparent z-10 pointer-events-none" />
            )}

            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-4 hide-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {topSellingProducts.map((product, i) => {
                const rawImage = Array.isArray(product.images)
                  ? product.images[0]
                  : product.images;
                const imgSrc =
                  typeof rawImage === "string"
                    ? rawImage.replace(/[\[\]"]/g, "")
                    : `https://picsum.photos/seed/${product.slug || product._id}/400/400`;

                const price = Number(product.price ?? 0);
                const comparePrice =
                  product.compareAtPrice ||
                  product.originalPrice ||
                  (price > 0 ? price * 1.2 : 0);
                const hasDiscount = comparePrice > price;
                const discountPct = hasDiscount
                  ? Math.round(((comparePrice - price) / comparePrice) * 100)
                  : 0;

                const rating = Number(product.rating?.average || 4.5);
                const reviews = product.rating?.count || product.rating?.reviews?.length || 0;
                const isWished = items.some((item) => item._id === product._id);
                const productUrl = `/product/${product.slug || product._id}`;

                return (
                  <div
                    key={product._id || i}
                    data-card
                    className="shrink-0 w-[72vw] sm:w-70 lg:w-[calc(25%-12px)] snap-start group relative flex flex-col bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    {/* Image */}
                    <Link
                      href={productUrl}
                      className="relative block aspect-square bg-[#f6f6f7] overflow-hidden"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={imgSrc}
                          alt={product.title || "Product"}
                          fill
                          sizes="(max-width:640px) 72vw, (max-width:1024px) 280px, 25vw"
                          className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 p-6"
                          onError={(e) => {
                            e.currentTarget.src = `https://picsum.photos/seed/${product.slug || product._id}/400/400`;
                          }}
                        />
                      </div>

                      {/* Rank */}
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-neutral-900 text-white text-[10px] font-bold z-10">
                        #{i + 1}
                      </span>

                      {/* Discount */}
                      {hasDiscount && (
                        <span className="absolute top-3 right-11 px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-semibold z-10">
                          -{discountPct}%
                        </span>
                      )}

                      {/* Wishlist */}
                      <button
                        onClick={(e) => handleWishlist(e, product)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center border transition-all z-10 ${
                          isWished
                            ? "bg-red-50 border-red-200 text-red-500"
                            : "bg-white/80 border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:bg-white"
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWished ? "fill-current text-red-500" : ""}`} />
                      </button>

                      {/* Quick Add */}
                      {product.stock !== 0 ? (
                        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 z-10">
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full flex items-center justify-center gap-1.5 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Add to Cart
                          </button>
                        </div>
                      ) : (
                        <div className="absolute inset-x-3 bottom-3 py-1.5 text-center text-[11px] font-medium text-neutral-500 bg-neutral-100/90 border border-neutral-200 rounded-xl">
                          Out of Stock
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-1.5 flex-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                        {product.category?.name || product.productType || product.collections?.[0]?.name || "Device"}
                      </span>

                      <Link href={productUrl}>
                        <h3 className="text-[13px] font-medium text-neutral-900 line-clamp-2 leading-snug hover:text-indigo-600 transition-colors">
                          {product.title}
                        </h3>
                      </Link>

                      {/* Stars */}
                      <div className="flex items-center gap-1.5 mt-auto">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= Math.round(rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-neutral-200 text-neutral-200"
                              }`}
                            />
                          ))}
                        </div>
                        {reviews > 0 && (
                          <span className="text-[10px] text-neutral-400">({reviews})</span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 pt-2 mt-1 border-t border-neutral-100">
                        <span className="text-sm font-bold text-neutral-950">
                          ৳{price.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-neutral-400 line-through">
                            ৳{Math.round(comparePrice).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-white transition-colors"
          >
            View All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
