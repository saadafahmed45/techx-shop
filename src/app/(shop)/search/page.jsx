"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AiFillStar } from "react-icons/ai";
import { HiOutlineSearch } from "react-icons/hi";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function cleanImg(raw, id) {
  const url = Array.isArray(raw) ? raw[0] : raw;
  const s = (url || "").replace(/[\[\]"]/g, "").trim();

  if (s.startsWith("http")) return s;

  return `https://picsum.photos/seed/${id}/500/500`;
}

// ─────────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────────
function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={cleanImg(product.images, product.id)}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
          {product.category?.name}
        </p>

        <Link href={`/product/${product.id}`}>
          <h3 className="mt-1 text-[15px] font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <AiFillStar
              key={s}
              className={`text-[12px] ${
                s <= 4 ? "text-amber-400" : "text-gray-200"
              }`}
            />
          ))}

          <span className="text-[11px] text-gray-400 ml-1">
            4.{product.id % 10}
          </span>
        </div>

        <div className="mt-3">
          <span className="text-[18px] font-extrabold text-blue-600">
            ${product.price}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-gray-100" />

          <div className="p-4 space-y-3">
            <div className="h-2 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Search Content
// ─────────────────────────────────────────────
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query") || "";

  const [searchValue, setSearchValue] = useState(query);

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products
  useEffect(() => {
    setLoading(true);

    fetch("https://api.escuelajs.co/api/v1/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter Products
  useEffect(() => {
    const q = query.toLowerCase();

    const result = products.filter((product) => {
      return (
        product.title?.toLowerCase().includes(q) ||
        product.category?.name?.toLowerCase().includes(q)
      );
    });

    setFiltered(result);
  }, [products, query]);

  // Search Submit
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchValue.trim()) return;

    router.push(`/search?query=${encodeURIComponent(searchValue)}`);
  };

  return (
    <div
      className="min-h-screen py-10 px-5 md:px-10"
      style={{ background: "#f7f8fc" }}
    >
      {/* Heading */}
      <div className="mb-8 text-center">
        <p className="text-[12px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
          Search Results
        </p>

        <h1 className="text-[28px] md:text-[38px] font-extrabold text-gray-900 mt-1">
          "{query}"
        </h1>

        {!loading && (
          <p className="text-[14px] text-red-500 mt-2">
            {filtered.length} product
            {filtered.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Search Input */}
      <form
        onSubmit={handleSearch}
        className="bg-white border w-1/2 mx-auto border-gray-100 rounded-2xl p-3 md:p-4 flex items-center gap-3 mb-8 shadow-sm"
      >
        <HiOutlineSearch className="text-gray-400 text-xl shrink-0" />

        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search products..."
          className="flex-1 bg-transparent outline-none text-[14px] text-gray-700 placeholder:text-gray-300"
        />

        <button
          type="submit"
          className="px-5 h-11 rounded-xl bg-blue-600 text-white text-[14px] font-semibold hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Products */}
      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <HiOutlineSearch className="text-2xl text-gray-300" />
          </div>

          <h2 className="text-[18px] font-bold text-gray-800">
            No products found
          </h2>

          <p className="text-[14px] text-gray-400 mt-2">
            Try another keyword
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Export Page
// ─────────────────────────────────────────────
export default function SearchProduct() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <SearchContent />
    </Suspense>
  );
}