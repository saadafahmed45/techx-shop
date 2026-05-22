"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { motion } from "framer-motion";

export default function AddToCartButton({ product }) {
  const { addToCart, openCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setLoading(true);

    setTimeout(() => {
      addToCart(product);
      openCart();
      setLoading(false);
    }, 300);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleAdd}
      disabled={loading}
      className="
        relative w-full sm:w-auto
        flex items-center justify-center gap-2
        px-4 py-2.5 sm:px-5 sm:py-2.5
        rounded-xl
        bg-black text-white
        font-semibold text-sm
        transition-all duration-300
        hover:bg-slate-900
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {/* ICON */}
      <HiOutlineShoppingBag className="text-lg" />

      {/* TEXT */}
      <span className="whitespace-nowrap">
        {loading ? "Adding..." : "Add to Cart"}
      </span>

      {/* LOADING DOT */}
      {loading && (
        <span className="absolute right-3 flex gap-1">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-150" />
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-300" />
        </span>
      )}
    </motion.button>
  );
}