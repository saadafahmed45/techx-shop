"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { AiFillStar, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiArrowRight, HiOutlineShoppingBag } from "react-icons/hi";
import { TbHeadphones, TbDeviceMobile, TbDeviceWatch, TbEar } from "react-icons/tb";

const PRODUCTS = [
  {
    id: 1,
    category: "AUDIO",
    categoryIcon: <TbHeadphones />,
    name: "Sonic-Pro X1",
    price: 349.0,
    rating: 4.7,
    reviews: 218,
    badge: null,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    accent: "#1a3aff",
    description: "Active noise cancellation, 40mm drivers",
  },
  {
    id: 2,
    category: "AUDIO",
    categoryIcon: <TbEar />,
    name: "Evo Buds Pro",
    price: 199.0,
    rating: 4.9,
    reviews: 504,
    badge: "BEST SELLER",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80",
    accent: "#1a3aff",
    description: "Spatial audio, 36hr total battery",
  },
  {
    id: 3,
    category: "COMPUTING",
    categoryIcon: <TbDeviceMobile />,
    name: "Horizon Phone 15",
    price: 999.0,
    rating: 4.6,
    reviews: 382,
    badge: null,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    accent: "#1a3aff",
    description: "6.7\" AMOLED, 200MP camera system",
  },
  {
    id: 4,
    category: "WEARABLES",
    categoryIcon: <TbDeviceWatch />,
    name: "Vantage Sport 3",
    price: 249.0,
    rating: 4.5,
    reviews: 167,
    badge: null,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    accent: "#1a3aff",
    description: "GPS, health suite, 14-day battery",
  },
];

function ProductCard({ product, index }) {
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-400"
      style={{
        boxShadow: hovered
          ? "0 20px 60px rgba(26,58,255,0.12), 0 4px 16px rgba(0,0,0,0.06)"
          : "0 2px 16px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "box-shadow 0.35s ease, transform 0.35s ease",
      }}
    >
      {/* ── Image container ── */}
      <div className="relative overflow-hidden bg-linear-to-b from-[#f0f4ff] to-[#e8eeff]" style={{ aspectRatio: "1 / 1" }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-600"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/500/500`; }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(10,18,80,0.35) 0%, transparent 55%)",
            opacity: hovered ? 1 : 0.4,
          }}
        />

        {/* Badge */}
        {product.badge && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase text-white"
            style={{ background: "linear-gradient(135deg, #1a3aff, #2a4aff)", boxShadow: "0 2px 10px rgba(26,58,255,0.4)" }}
          >
            {product.badge}
          </motion.span>
        )}

        {/* Wishlist button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
        >
          {wished
            ? <AiFillHeart className="text-red-500 text-sm" />
            : <AiOutlineHeart className="text-gray-500 text-sm" />}
        </motion.button>

        {/* Quick add — slides up on hover */}
        <motion.button
          initial={false}
          animate={{ y: hovered ? 0 : 12, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-semibold text-white tracking-wide"
          style={{
            background: "linear-gradient(135deg, #1a3aff, #2a50ff)",
            boxShadow: "0 4px 16px rgba(26,58,255,0.4)",
          }}
        >
          <HiOutlineShoppingBag className="text-sm" /> Add to Cart
        </motion.button>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-1.5 px-4 pt-4 pb-5">
        {/* Category */}
        <div className="flex items-center gap-1.5">
          <span className="text-blue-500 text-[13px]">{product.categoryIcon}</span>
          <span
            className="text-[10px] font-bold tracking-[0.18em] uppercase"
            style={{ color: "#7a8ab0" }}
          >
            {product.category}
          </span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3
            className="text-[17px] font-bold text-gray-900 leading-tight hover:text-blue-600 transition-colors"
          >
            {product.name}
          </h3>
        </Link>

 

        {/* Price + link */}
        <div className="flex items-center justify-between mt-1.5 pt-3 border-t border-gray-50">
          <span
            className="text-[20px] font-extrabold"
          >
            ${product.price.toFixed(2)}
          </span>
          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-1 text-[12px] font-semibold text-gray-400 hover:text-blue-600 hover:gap-2 transition-all duration-200"
          >
            Details <HiArrowRight className="text-[13px]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  return (
    <>
      <section
        className="py-16 px-4 md:px-13 lg:24 md:py-24">
        <div className=" mx-auto  ">

          {/* ── Section header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col items-center text-center mb-12 md:mb-14"
          >
  

            <h2
              className="text-[36px] md:text-[38px] font-bold text-gray-900 leading-tight"
            >
              Featured Products
            </h2>
            <p className="text-[15px] text-gray-400 mt-2 max-w-sm leading-relaxed">
              Engineered for precision. Designed for you.
            </p>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-5 h-0.75 w-14 rounded-full origin-center"
              style={{ background: "linear-gradient(90deg, #1a3aff, #7a9fff)" }}
            />
          </motion.div>

          {/* ── Product grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6">
            {PRODUCTS.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {/* ── View all CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.45 }}
            className="flex justify-center mt-12"
          >
            <Link
              href="/product"
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-[13px] font-semibold text-white tracking-wide transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #1a3aff 0%, #2a50ff 100%)",
                boxShadow: "0 4px 20px rgba(26,58,255,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(26,58,255,0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,58,255,0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Browse All Products
              <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}