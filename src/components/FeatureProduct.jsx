"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";

import {
  TbHeadphones,
  TbDeviceMobile,
  TbDeviceWatch,
  TbEar,
} from "react-icons/tb";

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

function ProductCard({ product, index }) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 transition-all duration-300"
      style={{
        boxShadow: hovered
          ? "0 20px 40px rgba(0,0,0,0.10)"
          : "0 4px 14px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* IMAGE */}
      <Link
        href={`/product/${product?._id}`}
        className="block relative aspect-square bg-linear-to-b from-slate-50 to-slate-100 overflow-hidden"
      >
        <img
          src={image}
          alt={product?.title || "product"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* WISH BUTTON */}
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
        <Link href={`/product/${product?._id}`}>
          <h3 className="font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 transition">
            {product?.title || "Untitled Product"}
          </h3>
        </Link>

        {/* PRICE */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-lg font-black text-indigo-600">
            ${Number(product?.price || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================
// MAIN COMPONENT
// ============================

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/products`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(
            data.filter(
              (product) =>
                product &&
                product.status === "active" &&
                Array.isArray(product.featured) // ✅ FIX: was product.features
            )
          );
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ FIX: was product.features?.includes — field is "featured"
  const newArrivalsProducts = products.filter((product) =>
    product.featured?.includes("Trending Now")
  );

  return (
    <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-32 bg-slate-50">
      <div className="mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Featured Products
          </h2>
          <p className="text-slate-400 mt-2">Premium picks curated for you</p>
          <div className="w-16 h-1 bg-indigo-500 mx-auto mt-5 rounded-full" />
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : newArrivalsProducts.length === 0 ? (
          <p className="text-center text-slate-400 py-16">
            No New Arrivals products found.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {newArrivalsProducts.map((product, i) => (
              <ProductCard
                key={product?._id || i}
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