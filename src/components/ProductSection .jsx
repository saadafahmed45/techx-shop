"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useShopData } from "@/context/ShopDataContext";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { TbHeadphones, TbDeviceMobile, TbDeviceWatch, TbEar } from "react-icons/tb";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { useCart } from "@/context/CartContext";

const API = process.env.NEXT_PUBLIC_API_URL;

// ============================
// CATEGORY ICON
// ============================

const getCategoryIcon = (type) => {
  const t = type?.toLowerCase() || "";
  if (t.includes("headphone")) return <TbHeadphones />;
  if (t.includes("earbud")) return <TbEar />;
  if (t.includes("watch")) return <TbDeviceWatch />;
  return <TbDeviceMobile />;
};

// ============================
// PRODUCT CARD
// ============================

export function ProductCard({ product, index }) {
  if (!product) return null;

  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { addToCart, openCart } = useCart();

  const image = product?.images?.[0] || "https://picsum.photos/500";

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    openCart();
  };
// box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300"
      style={{
        boxShadow: hovered
          ? "0 10px 20px rgba(0,0,0,0.10)"
          : "0 4px 14px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* IMAGE */}
      <Link
        href={`/product/${product?.slug || product?._id}`}
        className="block relative aspect-square bg-linear-to-b from-slate-50 to-slate-100 overflow-hidden"
      >
        <Image
          src={image}
          alt={product?.title || "product"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* WISHLIST BUTTON */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWished(!wished);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow"
        >
          {wished ? (
            <AiFillHeart className="text-red-500" />
          ) : (
            <AiOutlineHeart className="text-slate-500" />
          )}
        </button>

        {/* QUICK ADD */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={handleAdd}
            className="w-full flex cursor-pointer items-center justify-center gap-2 bg-black text-white py-2.5 rounded-xl font-semibold hover:bg-slate-900 transition"
          >
            <HiOutlineShoppingBag />
            Add to Cart
          </button>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4 space-y-3">
        {/* CATEGORY */}
        <div className="flex items-center gap-2 text-indigo-500 text-sm">
          {getCategoryIcon(product?.productType)}
          <span className="text-[11px] uppercase tracking-widest text-slate-400">
            {product?.productType || "product"}
          </span>
        </div>

        {/* TITLE */}
        <Link href={`/product/${product?.slug || product?._id}`}>
          <h3 className="font-semibold text-slate-900 line-clamp-2 transition">
            {product?.title || "Untitled Product"}
          </h3>
        </Link>

        {/* PRICE */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-lg font-black text-indigo-600">
            ৳ {Number(product?.price || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================
// GENERIC PRODUCT SECTION
// ============================

/**
 * Props:
 * - title        {string}  — Section heading, e.g. "Featured Products"
 * - filterValue  {string}  — The value inside product.featured[] to filter by, e.g. "Featured" | "Trending Now"
 * - bgColor      {string}  — Tailwind bg class, e.g. "bg-slate-50" | "bg-white" (default: "bg-slate-50")
 * - accentColor  {string}  — Tailwind bg class for the underline bar, e.g. "bg-indigo-500" (default: "bg-indigo-500")
 * - emptyMessage {string}  — Custom empty state text (optional)
 */
export default function ProductSection({
  title = "Products",
  filterValue,
  bgColor = "bg-slate-50",
  accentColor = "bg-indigo-500",
  emptyMessage,
}) {
  const { products: allProducts, loading } = useShopData();

  const products = allProducts.filter(
    (p) => p && p.status === "active" && Array.isArray(p.featured)
  );
  // Filter by the given filterValue prop (e.g. "Featured", "Trending Now", "New Arrival")
  const filtered = filterValue
    ? products.filter((p) => p.featured?.includes(filterValue))
    : products;

  return (
    <section className={`py-14 md:py-24 px-4 sm:px-6 lg:px-32 ${bgColor}`}>
      <div className="mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            {title}
          </h2>
          <div className={`w-16 h-1 ${accentColor} mx-auto mt-5 rounded-full`} />
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-16">
            {emptyMessage || `No ${title} found.`}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filtered.map((product, i) => (
              <ProductCard
                key={product?.slug || product?._id || i}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}