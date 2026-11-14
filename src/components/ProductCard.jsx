"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Heart, ShoppingBag, Check, Zap, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function ProductCard({
  product,
  index = 0,
  showWishlist = true,
  showRating = true,
  variant = "default",
}) {
  const router = useRouter();
  const { addToCart, openCart, closeCart } = useCart();
  const { items, toggleWishlist, hydrate } = useWishlistStore();
  const [added, setAdded] = useState(false);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!product) return null;

  const isWished = items.some((item) => item._id === product._id);

  // Clean image resolution
  const rawImage = Array.isArray(product.images) ? product.images[0] : product.images;
  const cleanImage =
    typeof rawImage === "string" ? rawImage.replace(/[\[\]"]/g, "") : null;
  const initialImg =
    cleanImage || `https://picsum.photos/seed/${product.slug || product._id}/500/500`;

  const [imgSrc, setImgSrc] = useState(initialImg);

  const price = Number(product.price ?? 0);
  const comparePrice =
    product.compareAtPrice ||
    product.originalPrice ||
    (price > 0 && (product.badge === "Sale" || index % 2 === 0)
      ? Math.round(price * 1.25)
      : 0);
  const hasDiscount = comparePrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  const brand = product.vendor || product.brand || "TechX";
  const averageRating = product.rating?.average || 4.8;
  const totalReviews =
    product.rating?.count ||
    product.rating?.reviews?.length ||
    Math.floor(100 + ((index * 347) % 1500));

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    // Open cart drawer after small delay
    setTimeout(() => {
      openCart?.();
    }, 300);
  };

  const handleOrderNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0 || ordering) return;
    setOrdering(true);
    addToCart(product);
    closeCart?.();
    router.push("/checkout");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const rawCat =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;
  const categoryName =
    (rawCat && !rawCat.match(/^[0-9a-fA-F]{24}$/) ? rawCat : null) ||
    product.brand ||
    "TECH";

  const productUrl = `/product/${product.slug || product._id}`;

  if (variant === "carousel") {
    return (
      <div className="group relative flex flex-col h-full bg-transparent overflow-hidden select-none">
        {/* Media Container — light neutral background with smooth rounded corners */}
        <div className="relative aspect-4/5 sm:aspect-square w-full bg-[#f4f4f4] overflow-hidden flex items-center justify-center mb-3 sm:mb-3.5 p-4 rounded-xl">
          
          {/* Lime Green Discount / New Badge */}
          {hasDiscount && discountPercent > 0 ? (
            <span className="absolute top-3 left-3 px-2 py-0.5 text-[11px] font-black uppercase tracking-tight bg-[#bdf338] text-neutral-950 z-10 shadow-2xs rounded-xs">
              -{discountPercent}%
            </span>
          ) : product.badge || index % 3 === 0 ? (
            <span className="absolute top-3 left-3 px-2 py-0.5 text-[11px] font-black uppercase tracking-tight bg-[#bdf338] text-neutral-950 z-10 shadow-2xs rounded-xs">
              {product.badge || "NEW"}
            </span>
          ) : null}

          {/* Circular Wishlist Button */}
          {showWishlist && (
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border transition-all z-10 shadow-2xs ${
                isWished
                  ? "bg-rose-50 border-rose-200 text-rose-500"
                  : "bg-white border-neutral-200/80 text-neutral-700 hover:text-black hover:bg-neutral-50"
              }`}
              aria-label="Wishlist"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                  isWished ? "fill-current text-rose-500" : ""
                }`}
              />
            </button>
          )}

          {/* Product Image */}
          <Link href={productUrl} className="relative w-full h-full flex items-center justify-center">
            <Image
              src={imgSrc}
              alt={product.title || "Product"}
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              onError={() => {
                setImgSrc(
                  `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80`
                );
              }}
            />
          </Link>
        </div>

        {/* Content Area */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            {/* Category */}
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1 truncate">
              {categoryName}
            </span>

            {/* Product Title */}
            <Link href={productUrl} className="block mb-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900 uppercase tracking-tight line-clamp-1 hover:text-blue-600 transition-colors">
                {product.title}
              </h3>
            </Link>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-sm sm:text-base font-black text-neutral-950">
                ৳{price > 0 ? price.toLocaleString() : "650"}
              </span>
              {hasDiscount && (
                <span className="text-xs sm:text-sm text-neutral-400 line-through font-normal">
                  ৳{Math.round(comparePrice).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart & Order Now Buttons */}
          {product.stock === 0 ? (
            <button
              disabled
              className="w-full h-10 rounded-xl bg-neutral-100 text-neutral-400 text-xs sm:text-sm font-bold flex items-center justify-center border border-neutral-200 cursor-not-allowed mt-auto"
            >
              Out of Stock
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-auto">
              <button
                type="button"
                onClick={handleQuickAdd}
                className={`h-10 px-1.5 sm:px-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer border active:scale-[0.98] ${
                  added
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                    : "bg-blue-50 hover:bg-blue-100 border-blue-200/80 text-blue-700"
                }`}
                title="Add to Cart"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 shrink-0 animate-in zoom-in-50 duration-200" />
                    <span className="truncate">Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span className="truncate">Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOrderNow}
                disabled={ordering}
                className="h-10 px-1.5 sm:px-2 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white transition-all duration-200 cursor-pointer shadow-xs shadow-blue-500/20 disabled:opacity-75"
                title="Order Now"
              >
                {ordering ? (
                  <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 shrink-0 fill-current" />
                )}
                <span className="truncate">{ordering ? "Ordering..." : "Order Now"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-neutral-200/80 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden p-3.5 sm:p-4">
      
      {/* Top Media Container */}
      <div className="relative aspect-square w-full rounded-xl bg-[#f8f9fb] overflow-hidden flex items-center justify-center mb-3.5 p-3 sm:p-4">
        
        {/* Discount or New Badge */}
        {hasDiscount && discountPercent > 0 ? (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-500 text-white z-10 shadow-xs">
            -{discountPercent}%
          </span>
        ) : product.badge || index % 3 === 0 ? (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-600 text-white z-10 shadow-xs">
            {product.badge || "New"}
          </span>
        ) : null}

        {/* Wishlist Heart Button */}
        {showWishlist && (
          <button
            onClick={handleWishlist}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center border transition-all z-10 shadow-xs ${
              isWished
                ? "bg-rose-50 border-rose-200 text-rose-500"
                : "bg-white/90 backdrop-blur-xs border-neutral-200/80 text-neutral-400 hover:text-neutral-900 hover:bg-white"
            }`}
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isWished ? "fill-current text-rose-500" : ""
              }`}
            />
          </button>
        )}

        {/* Product Image */}
        <Link href={productUrl} className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imgSrc}
            alt={product.title || "Product"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            onError={() => {
              setImgSrc(
                `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80`
              );
            }}
          />
        </Link>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1">
        {/* Brand / Vendor */}
        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
          {brand}
        </span>

        {/* Title */}
        <Link href={productUrl} className="mb-1.5">
          <h3 className="text-sm font-bold text-neutral-900 line-clamp-1 hover:text-blue-600 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Star Rating */}
        {showRating && (
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400" />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-neutral-800">
              ({totalReviews})
            </span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-3.5 mt-auto">
          <span className="text-base sm:text-lg font-black text-neutral-950">
            ৳{price > 0 ? price.toLocaleString() : "189.00"}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-neutral-400 line-through font-medium">
              ৳{Math.round(comparePrice).toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart & Order Now Buttons */}
        {product.stock === 0 ? (
          <button
            disabled
            className="w-full h-10 rounded-xl bg-neutral-100 text-neutral-400 text-xs sm:text-sm font-semibold flex items-center justify-center border border-neutral-200 cursor-not-allowed mt-auto"
          >
            Out of Stock
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-auto">
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`h-10 px-1.5 sm:px-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer border active:scale-[0.98] ${
                added
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/20"
                  : "bg-blue-50 hover:bg-blue-100 border-blue-200/80 text-blue-700"
              }`}
              title="Add to Cart"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 shrink-0 animate-in zoom-in-50 duration-200" />
                  <span className="truncate">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="truncate">Add to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleOrderNow}
              disabled={ordering}
              className="h-10 px-1.5 sm:px-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white transition-all duration-200 cursor-pointer shadow-sm shadow-blue-500/20 disabled:opacity-75"
              title="Order Now"
            >
              {ordering ? (
                <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 shrink-0 fill-current" />
              )}
              <span className="truncate">{ordering ? "Ordering..." : "Order Now"}</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}