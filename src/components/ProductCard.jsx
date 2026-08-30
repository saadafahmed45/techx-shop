"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function ProductCard({
  product,
  index = 0,
  showQuickAdd = true,
  showWishlist = true,
  showRating = true,
}) {
  const { addToCart, openCart } = useCart();
  const { items, toggleWishlist, hydrate } = useWishlistStore();

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
  const comparePrice = product.compareAtPrice || product.originalPrice || (price > 0 ? price * 1.2 : 0);
  const hasDiscount = comparePrice > price;
  
  const category =
    product.category?.name || product.productType || product.collections?.[0]?.name || "Device";
  const averageRating = product.rating?.average || 4.5;
  const totalReviews = product.rating?.count || product.rating?.reviews?.length || 8;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    openCart();
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const productUrl = `/product/${product.slug || product._id}`;

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-neutral-200/80 hover:border-neutral-300 transition-all duration-300 overflow-hidden">
      {/* Image Area */}
      <Link
        href={productUrl}
        className="relative block aspect-square w-full bg-[#f6f6f7] p-4 overflow-hidden"
      >
        <div className="relative w-full h-full">
          <Image
            src={imgSrc}
            alt={product.title || "Product"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
            onError={() => {
              setImgSrc(`https://picsum.photos/seed/${product.slug || product._id}/500/500`);
            }}
          />
        </div>

        {/* Featured Tag */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-neutral-900 text-white z-10">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        {showWishlist && (
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center border transition-all z-10 ${
              isWished
                ? "bg-red-50 border-red-200 text-red-500"
                : "bg-white/90 backdrop-blur-xs border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:bg-white"
            }`}
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${isWished ? "fill-current text-red-500" : ""}`}
            />
          </button>
        )}

        {/* Quick Add Button on Hover */}
        {showQuickAdd && product.stock !== 0 && (
          <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-10">
            <button
              onClick={handleQuickAdd}
              className="w-full flex items-center justify-center gap-1.5 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm shadow-indigo-600/20 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        )}

        {/* Out of Stock Label */}
        {product.stock === 0 && (
          <div className="absolute inset-x-3 bottom-3 py-1.5 bg-neutral-100/90 border border-neutral-200 text-neutral-500 text-[11px] font-medium text-center rounded-lg">
            Out of Stock
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        {/* Category Tag */}
        <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase mb-1">
          {category}
        </span>

        {/* Product Title */}
        <Link href={productUrl} className="mb-2">
          <h3 className="text-xs sm:text-[13px] font-medium text-neutral-900 line-clamp-2 leading-snug hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        {showRating && (
          <div className="flex items-center gap-1.5 mb-3 mt-auto">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
            </div>
            <span className="text-[11px] font-semibold text-neutral-800">
              {Number(averageRating).toFixed(1)}
            </span>
            <span className="text-[10px] text-neutral-400">
              ({totalReviews})
            </span>
          </div>
        )}

        {/* Price Row */}
        <div className="flex items-baseline justify-between pt-1 border-t border-neutral-100 mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-semibold text-neutral-950">
              ৳{price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-neutral-400 line-through">
                ৳{Math.round(comparePrice).toLocaleString()}
              </span>
            )}
          </div>

          <Link
            href={productUrl}
            className="text-neutral-400 group-hover:text-indigo-600 transition-colors p-1"
            aria-label="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}