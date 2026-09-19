"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutGrid, Package } from "lucide-react";
import { useShopData } from "@/context/ShopDataContext";

export default function CategoryGrid({ initialCollections = [] }) {
  const { collections: contextCollections, products, loading } = useShopData();

  // Prefer context collections if loaded, otherwise use SSR initialCollections
  const activeCollections =
    contextCollections && contextCollections.length > 0
      ? contextCollections
      : initialCollections;

  // Calculate product count for each collection
  const getProductCount = (collection) => {
    if (!products || products.length === 0) return null;
    const count = products.filter((p) => {
      if (!p) return false;
      if (Array.isArray(p.collections)) {
        return p.collections.some(
          (col) =>
            col._id === collection._id ||
            col.slug === collection.slug ||
            col.name?.toLowerCase() === collection.name?.toLowerCase()
        );
      }
      return (
        p.category?.name?.toLowerCase() === collection.name?.toLowerCase() ||
        p.productType?.toLowerCase() === collection.name?.toLowerCase()
      );
    }).length;
    return count;
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Shop by Category
          </h2>
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dynamic Collections Grid */}
        {activeCollections && activeCollections.length > 0 ? (
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 ${
              activeCollections.length <= 6
                ? "lg:grid-cols-6"
                : "lg:grid-cols-4 xl:grid-cols-8"
            } gap-3 sm:gap-4`}
          >
            {activeCollections.map((cat, idx) => {
              const productCount = getProductCount(cat);
              const countText =
                productCount !== null
                  ? `${productCount} ${productCount === 1 ? "Item" : "Items"}`
                  : "Explore";

              const categoryUrl = `/product?category=${encodeURIComponent(
                cat.slug || cat.name
              )}`;

              return (
                <Link
                  key={cat._id || cat.slug || idx}
                  href={categoryUrl}
                  className="group flex flex-col items-center text-center p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-200/80 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-50 mb-3 flex items-center justify-center border border-neutral-100 group-hover:border-blue-100 transition-colors">
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          // Handled cleanly
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 group-hover:text-blue-600 transition-colors">
                        <Package className="w-8 h-8 stroke-[1.8]" />
                      </div>
                    )}
                  </div>

                  {/* Title & Product Count */}
                  <h3 className="text-sm sm:text-[15px] font-bold text-neutral-900 group-hover:text-blue-600 transition-colors truncate w-full">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-normal mt-0.5 truncate w-full">
                    {countText}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : loading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-3.5 sm:p-4 rounded-2xl bg-white border border-neutral-100 animate-pulse"
              >
                <div className="w-full aspect-square rounded-xl sm:rounded-2xl bg-neutral-100 mb-3" />
                <div className="h-3.5 w-20 bg-neutral-100 rounded mb-1.5" />
                <div className="h-3 w-12 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center rounded-2xl border border-dashed border-neutral-200">
            <p className="text-sm text-neutral-400">No categories found.</p>
          </div>
        )}

      </div>
    </section>
  );
}
