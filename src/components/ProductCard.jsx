"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function ProductCard({
  product,
  index = 0,
  showWishlist = true,
  showRating = true,
}) {
  const { addToCart, openCart } = useCart();
  const { items, toggleWishlist, hydrate } = useWishlistStore();
  const [added, setAdded] = useState(false);

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
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    // Open cart drawer after small delay
    setTimeout(() => {
      openCart?.();
    }, 300);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const productUrl = `/product/${product.slug || product._id}`;

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

        {/* Full-width Electric Blue Add to Cart Button */}
        <button
          onClick={handleQuickAdd}
          disabled={product.stock === 0}
          className={`w-full h-10 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm ${
            product.stock === 0
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
              : added
              ? "bg-emerald-600 text-white shadow-emerald-500/20"
              : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-blue-500/20"
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 animate-in zoom-in-50 duration-200" />
              <span>Added to Cart!</span>
            </>
          ) : product.stock === 0 ? (
            <span>Out of Stock</span>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
}