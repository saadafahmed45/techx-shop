"use client";

import { useShopData } from "@/context/ShopDataContext";
import ProductCard from "@/components/ProductCard";

export { ProductCard };

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