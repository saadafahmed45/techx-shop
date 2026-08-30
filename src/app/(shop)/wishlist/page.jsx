"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

const FALLBACK = "https://picsum.photos/400/400";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, hydrate } = useWishlistStore();
  const { addToCart, openCart } = useCart();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleAddToCart = (product) => {
    addToCart(product);
    openCart();
  };

  return (
    <div className="min-h-[75vh] bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-neutral-200 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Saved Products
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-950 mt-1">
              Your Wishlist ({items.length})
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-semibold text-neutral-500 hover:text-red-600 transition-colors self-start sm:self-auto cursor-pointer"
            >
              Clear All Items
            </button>
          )}
        </div>

        {/* Wishlist Items Grid / Empty State */}
        {items.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mb-1">
              Your wishlist is empty
            </h2>
            <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
              Explore our tech catalog and click the heart icon on any device to save it for later.
            </p>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {items.map((product) => {
              const rawImg = Array.isArray(product.images) ? product.images[0] : product.images;
              const img =
                typeof rawImg === "string" ? rawImg.replace(/[\[\]"]/g, "") : FALLBACK;

              return (
                <div
                  key={product._id}
                  className="group relative flex flex-col bg-white rounded-xl border border-neutral-200/80 hover:border-neutral-300 transition-all overflow-hidden"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${product.slug || product._id}`}
                    className="relative block aspect-square w-full bg-[#f6f6f7] p-4 overflow-hidden"
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(product._id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 border border-neutral-200 text-neutral-400 hover:text-red-500 hover:bg-white flex items-center justify-center transition-colors z-10"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </Link>

                  {/* Info */}
                  <div className="flex flex-col flex-1 p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      {product.vendor || product.productType || "Gadget"}
                    </span>
                    <Link
                      href={`/product/${product.slug || product._id}`}
                      className="mb-2"
                    >
                      <h3 className="text-xs font-medium text-neutral-900 line-clamp-2 leading-snug hover:text-neutral-600">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="flex items-baseline justify-between mt-auto pt-2 border-t border-neutral-100">
                      <span className="text-sm font-bold text-neutral-950">
                        ৳{Number(product.price || 0).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-medium transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}