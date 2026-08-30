"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Loader2 } from "lucide-react";

export default function AddToCartButton({ product }) {
  const { addToCart, openCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (product?.stock === 0) return;
    setLoading(true);
    setTimeout(() => {
      addToCart(product);
      openCart();
      setLoading(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }, 250);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading || product?.stock === 0}
      className={`relative flex-1 flex items-center justify-center gap-2 h-11 px-6 rounded-lg font-medium text-xs transition-all cursor-pointer ${
        product?.stock === 0
          ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed"
          : added
          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20"
      } disabled:opacity-70`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ShoppingBag className="w-4 h-4" />
      )}
      <span>
        {product?.stock === 0
          ? "Out of Stock"
          : loading
          ? "Adding..."
          : added
          ? "Added!"
          : "Add to Cart"}
      </span>
    </button>
  );
}