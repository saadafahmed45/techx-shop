"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { TbShoppingBag, TbHeart, TbHeartFilled, TbArrowUpRight } from "react-icons/tb";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product, index = 0, showQuickAdd = true, showWishlist = true, showRating = true }) {
  const { addToCart, openCart } = useCart();
  const [wished, setWished] = useState(false);

  if (!product) return null;

  // Handle image URLs and array shapes
  const image = Array.isArray(product.images) ? product.images[0] : product.images;
  const cleanImage = image?.replace(/[\[\]"]/g, "") || "/placeholder.png";
  const [imgSrc, setImgSrc] = useState(cleanImage);

  const price = product.price ?? 0;
  const category = product.category?.name || product.productType || "General";
  const averageRating = product.rating?.average || 4.2; // default fallback if none
  const totalRating = product.rating?.count || 12;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    openCart();
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWished(!wished);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_rgba(58,90,255,0.05)] transition-all duration-300"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Image Section */}
      <Link href={`/product/${product.slug || product._id}`} className="relative block overflow-hidden aspect-square bg-slate-50/60 p-3">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Image
            src={imgSrc}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={() => {
              setImgSrc(`https://picsum.photos/seed/${product.slug || product._id}/500/500`);
            }}
          />
        </div>

        {/* Floating Badges */}
        {product.badge && (
          <span className="absolute top-5 left-5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase bg-indigo-600 text-white shadow-sm z-10">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        {showWishlist && (
          <button
            onClick={handleWishlist}
            className="absolute top-5 right-5 w-8.5 h-8.5 rounded-full flex items-center justify-center bg-white/90 hover:bg-white border border-slate-100 shadow-sm transition-all duration-200 hover:scale-110 z-10 cursor-pointer"
            style={{ backdropFilter: "blur(8px)" }}
            aria-label="Add to wishlist"
          >
            {wished ? (
              <TbHeartFilled className="text-red-500 text-[16px] animate-pulse" />
            ) : (
              <TbHeart className="text-slate-500 hover:text-slate-800 text-[16px]" />
            )}
          </button>
        )}

        {/* Quick Add Button (Fades & slides up on hover) */}
        {showQuickAdd && product.stock > 0 && (
          <div className="absolute bottom-5 left-5 right-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={handleQuickAdd}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-all duration-200 cursor-pointer"
            >
              <TbShoppingBag className="text-[14px]" />
              Add to Cart
            </button>
          </div>
        )}
        
        {/* Out of Stock Badge */}
        {product.stock <= 0 && (
          <span className="absolute bottom-5 left-5 right-5 py-2 rounded-xl text-[10px] font-bold text-center uppercase tracking-wider bg-slate-100 text-slate-400 border border-slate-200 z-10">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Info Section */}
      <div className="flex flex-col flex-1 p-4.5 pt-2">
        {/* Category / Type */}
        <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
          {category}
        </span>

        {/* Title */}
        <Link href={`/product/${product.slug || product._id}`} className="mb-2">
          <h3 className="text-[13.5px] font-medium text-slate-800 line-clamp-2 leading-snug hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating Row */}
        {showRating && (
          <div className="flex items-center gap-1 mb-3.5 mt-auto">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s}>
                  {s <= Math.round(averageRating) ? (
                    <AiFillStar className="text-amber-400 text-[12px]" />
                  ) : (
                    <AiOutlineStar className="text-slate-200 text-[12px]" />
                  )}
                </span>
              ))}
            </div>
            <span className="text-[10.5px] text-slate-400 font-medium">({totalRating})</span>
          </div>
        )}

        {/* Price & Action */}
        <div className={`flex items-center justify-between mt-auto ${!showRating ? "pt-2" : ""}`}>
          <span className="text-[16px] font-bold text-slate-900">
            ৳{price.toLocaleString()}
          </span>
          <Link
            href={`/product/${product.slug || product._id}`}
            className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-indigo-50 border border-slate-100 group-hover:border-indigo-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all duration-300"
          >
            <TbArrowUpRight className="text-[14px]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}