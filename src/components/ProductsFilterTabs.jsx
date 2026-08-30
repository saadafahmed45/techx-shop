"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useShopData } from "@/context/ShopDataContext";
import ProductCard from "@/components/ProductCard";

export default function ProductsFilterTabs() {
  const { products, collections, loading } = useShopData();
  const [activeCollection, setActiveCollection] = useState("All");

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    let list =
      activeCollection === "All"
        ? products
        : products.filter((product) =>
            product.collections?.some((col) => col.name === activeCollection),
          );

    return list.slice(0, 4);
  }, [products, activeCollection]);

  return (
    <section className="bg-[#fafafa] py-16 sm:py-20 border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Selected Essentials
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mt-1">
            Explore Modern Hardware
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            High-performance gear crafted for creators, professionals, and tech
            enthusiasts.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveCollection("All")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeCollection === "All"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                  : "bg-white text-neutral-600 hover:text-indigo-600 border border-neutral-200/80 hover:border-indigo-300"
              }`}
            >
              All Items
            </button>

            {collections &&
              collections.map((collection) => (
                <button
                  key={collection._id}
                  onClick={() => setActiveCollection(collection.name)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeCollection === collection.name
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                      : "bg-white text-neutral-600 hover:text-indigo-600 border border-neutral-200/80 hover:border-indigo-300"
                  }`}
                >
                  {collection.name}
                </button>
              ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-neutral-200/60 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-14 text-center border border-dashed border-neutral-200 rounded-xl bg-white">
            <p className="text-sm text-neutral-400">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.slug || product._id}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Link
            href="/product"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900 text-xs font-medium transition-all shadow-xs"
          >
            <span>Browse Entire Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
