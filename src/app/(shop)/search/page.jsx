"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import ProductCard from "@/components/ProductCard";

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function SearchParamsReader({ onQuery }) {
  const searchParams = useSearchParams();
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      onQuery(searchParams.get("q") || "");
    }
  }, [searchParams, onQuery]);
  return null;
}

function SearchParamsWriter({ query }) {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    const newUrl = params.toString() ? `/search?${params.toString()}` : "/search";
    router.replace(newUrl, { scroll: false });
  }, [query, router]);

  return null;
}

function useSearchProducts(query) {
  const debouncedQuery = useDebounce(query, 300);
  return useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
      const url = `/api/search${params.toString() ? "?" + params.toString() : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      return data.results || [];
    },
    staleTime: 60_000,
  });
}

function SearchContent() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedType, setSelectedType] = useState("all");

  const { data: products = [], isLoading } = useSearchProducts(query);
  const inputRef = useRef(null);

  const productTypes = useMemo(() => {
    return [...new Set(products.map((p) => p.productType).filter(Boolean))];
  }, [products]);

  const results = useMemo(() => {
    let list = [...products];
    if (selectedType !== "all") {
      list = list.filter((p) => p.productType === selectedType);
    }
    if (sortBy === "price_asc") list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price_desc") list.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === "rating") list.sort((a, b) => Number(b.rating?.average || 0) - Number(a.rating?.average || 0));
    return list;
  }, [products, selectedType, sortBy]);

  return (
    <div className="bg-white min-h-[75vh] py-10 sm:py-14">
      <Suspense fallback={null}>
        <SearchParamsReader onQuery={setQuery} />
        <SearchParamsWriter query={query} />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Instant Catalog Search
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950">
            Search Hardware
          </h1>

          {/* Search Input */}
          <div className="relative flex items-center h-12 px-4 rounded-xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 focus-within:border-neutral-900 focus-within:bg-white transition-all shadow-2xs">
            <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name, category, or brand..."
              className="flex-1 bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters and Count */}
        <div className="flex flex-wrap items-center justify-between pb-6 border-b border-neutral-200 gap-4">
          <p className="text-xs text-neutral-500 font-medium">
            {isLoading
              ? "Searching..."
              : `Found ${results.length} item${results.length !== 1 ? "s" : ""}`}
            {query ? ` for "${query}"` : ""}
          </p>

          <div className="flex items-center gap-3">
            {/* Category Filter */}
            {productTypes.length > 0 && (
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 h-9 text-xs">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-transparent outline-none cursor-pointer"
                >
                  <option value="all">All Types</option>
                  {productTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort */}
            <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 h-9 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none cursor-pointer"
              >
                <option value="default">Default Sort</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="pt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-neutral-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 max-w-lg mx-auto">
              <p className="text-sm font-semibold text-neutral-800">
                No matching devices found
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Try searching with different keywords like "Headphones", "MacBook", or "Gaming".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {results.map((product, i) => (
                <ProductCard
                  key={product._id || i}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SearchContent />
    </Suspense>
  );
}
