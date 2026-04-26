"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import { HiArrowRight } from "react-icons/hi";

export default function ProductCard({ product, index = 0 }) {
  const image = Array.isArray(product.images) ? product.images[0] : product.images;
  const cleanImage = image?.replace(/[\[\]"]/g, "") || "/placeholder.png";
  const price = product.price ?? 0;
  const category = product.category?.name ?? "General";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: "easeOut" }}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-100 hover:shadow-[0_8px_40px_rgba(58,90,255,0.1)] transition-all duration-400"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block overflow-hidden aspect-[4/3] bg-gray-50">
        <img
          src={cleanImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/400/300`; }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase"
          style={{ background: "rgba(255,255,255,0.92)", color: "#3a5aff", backdropFilter: "blur(8px)" }}
        >
          {category}
        </span>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)" }}>
          <AiOutlineHeart className="text-gray-500 text-[15px]" />
        </button>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-[14px] font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-auto">
          {[1,2,3,4,5].map(s => (
            <AiOutlineStar key={s} className={`text-[12px] ${s <= 4 ? "text-amber-400" : "text-gray-200"}`} />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">(24)</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-[18px] font-bold text-gray-900">${price.toFixed(2)}</span>
          <Link
            href={`/product/${product.id}`}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:gap-2 transition-all duration-200"
          >
            View <HiArrowRight className="text-[12px]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}