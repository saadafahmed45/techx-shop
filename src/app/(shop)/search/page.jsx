"use client"

import { useState, useCallback, useMemo, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  Search, X, SlidersHorizontal, Package, Star,
  ChevronDown, ShoppingCart, Heart, Tag,
  ArrowUpDown, LayoutGrid, LayoutList,
  DollarSign,
} from "lucide-react";

function useDebounce(value, delay = 350) {
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

function useProducts(query) {
  const debouncedQuery = useDebounce(query, 350);
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
    placeholderData: (prev) => prev,
  });
}

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceMax, setPriceMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState("grid");
  const [wishlist, setWishlist] = useState([]);

  const { data: products = [], isLoading } = useProducts(query);
  const inputRef = useRef(null);

  const productTypes = useMemo(() => {
    return [...new Set(products.map(p => p.productType).filter(Boolean))];
  }, [products]);

  const results = useMemo(() => {
    let list = [...products];

    if (statusFilter !== "all") list = list.filter(p => p.status === statusFilter);
    if (typeFilter !== "all")   list = list.filter(p => p.productType === typeFilter);
    if (priceMax !== "")        list = list.filter(p => Number(p.price) <= Number(priceMax));

    if (sortBy === "price-asc")  list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sortBy === "price-desc") list.sort((a, b) => Number(b.price) - Number(a.price));
    if (sortBy === "name-asc")   list.sort((a, b) => a.title?.localeCompare(b.title));
    if (sortBy === "name-desc")  list.sort((a, b) => b.title?.localeCompare(a.title));
    if (sortBy === "stock-desc") list.sort((a, b) => Number(b.stock) - Number(a.stock));

    return list;
  }, [products, statusFilter, typeFilter, priceMax, sortBy]);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const clearFilters = () => {
    setQuery(""); setStatus("all"); setSortBy("default");
    setTypeFilter("all"); setPriceMax("");
    inputRef.current?.focus();
  };

  const activeFilterCount = [
    statusFilter !== "all",
    typeFilter !== "all",
    priceMax !== "",
    sortBy !== "default",
  ].filter(Boolean).length;

  const selectCls = "appearance-none h-10 pl-3 pr-8 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer transition-all";

  return (
    <div className="min-h-screen bg-slate-50">

      <Suspense fallback={null}>
        <SearchParamsReader onQuery={setQuery} />
      </Suspense>

      <Suspense fallback={null}>
        <SearchParamsWriter query={query} />
      </Suspense>

      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products by name, brand, type…"
                className="w-full h-12 rounded-2xl bg-slate-50 border border-slate-200 pl-11 pr-10 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-500 flex items-center justify-center transition-all"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(p => !p)}
              className={`h-12 px-4 rounded-2xl border text-sm font-semibold flex items-center gap-2 transition-all shrink-0 ${
                showFilters || activeFilterCount > 0
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-500"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-indigo-600 text-[11px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white shrink-0">
              <button
                onClick={() => setView("grid")}
                className={`w-11 h-12 flex items-center justify-center transition-all ${view === "grid" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600"}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`w-11 h-12 flex items-center justify-center transition-all ${view === "list" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600"}`}
              >
                <LayoutList size={15} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-100">

              <div className="relative">
                <select value={statusFilter} onChange={e => setStatus(e.target.value)} className={selectCls}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={selectCls}>
                  <option value="all">All Types</option>
                  {productTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectCls}>
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="name-asc">Name: A → Z</option>
                  <option value="name-desc">Name: Z → A</option>
                  <option value="stock-desc">Most In Stock</option>
                </select>
                <ArrowUpDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="relative">
                <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="number"
                  value={priceMax}
                  onChange={e => setPriceMax(e.target.value)}
                  placeholder="Max price"
                  className="h-10 w-36 rounded-xl bg-white border border-slate-200 pl-8 pr-3 text-sm text-slate-600 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="h-10 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-500 text-sm font-semibold flex items-center gap-1.5 hover:bg-rose-100 transition-all"
                >
                  <X size={13} /> Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">

        <div className="flex items-center justify-between mb-5">
          <div>
            {isLoading ? (
              <div className="h-4 w-40 bg-slate-200 rounded-full animate-pulse" />
            ) : (
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-800">{results.length}</span>
                {" "}product{results.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold">
                {statusFilter}
                <button onClick={() => setStatus("all")}><X size={10} /></button>
              </span>
            )}
            {typeFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold">
                {typeFilter}
                <button onClick={() => setTypeFilter("all")}><X size={10} /></button>
              </span>
            )}
            {priceMax && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold">
                ≤ ${priceMax}
                <button onClick={() => setPriceMax("")}><X size={10} /></button>
              </span>
            )}
          </div>
        </div>

        {isLoading && (
          <div className={`grid gap-4 ${view === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="bg-slate-100 h-52" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                  <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-full w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-5">
              <Package size={36} strokeWidth={1.5} className="text-slate-300" />
            </div>
            <p className="font-bold text-slate-600 text-lg">No products found</p>
            <p className="text-sm mt-1 text-slate-400">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="mt-5 h-10 px-5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-200"
            >
              Clear all filters
            </button>
          </div>
        )}

        {!isLoading && results.length > 0 && view === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(product => (
              <GridCard
                key={product._id}
                product={product}
                wishlisted={wishlist.includes(product._id)}
                onWishlist={() => toggleWishlist(product._id)}
              />
            ))}
          </div>
        )}

        {!isLoading && results.length > 0 && view === "list" && (
          <div className="space-y-3">
            {results.map(product => (
              <ListCard
                key={product._id}
                product={product}
                wishlisted={wishlist.includes(product._id)}
                onWishlist={() => toggleWishlist(product._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GridCard({ product, wishlisted, onWishlist }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col">
      <div className="relative overflow-hidden bg-slate-50 aspect-square">
        {product.images?.[0] && !imgErr ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImgErr(true)}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Package size={40} strokeWidth={1.5} />
          </div>
        )}
        <button
          onClick={onWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 ${
            wishlisted ? "bg-rose-500 text-white scale-110" : "bg-white/90 text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
        </button>
        {product.status === "draft" && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 text-[10px] font-bold uppercase tracking-wider">Draft</span>
        )}
        {product.featured && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold flex items-center gap-1">
            <Star size={9} fill="currentColor" /> Featured
          </span>
        )}
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        {product.vendor && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-1">{product.vendor}</p>
        )}
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-1.5">{product.title}</h3>
        {product.productType && (
          <span className="inline-flex items-center gap-1 mb-2 text-[11px] text-slate-400">
            <Tag size={9} /> {product.productType}
          </span>
        )}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-base font-black text-indigo-600">${Number(product.price || 0).toFixed(2)}</span>
          <span className={`text-[11px] font-semibold ${Number(product.stock) === 0 ? "text-rose-400" : "text-emerald-500"}`}>
            {Number(product.stock) === 0 ? "Out of stock" : `${product.stock} left`}
          </span>
        </div>
        {product.collections?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-slate-100">
            {product.collections.slice(0, 2).map(c => (
              <span key={c._id} className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium">{c.name}</span>
            ))}
            {product.collections.length > 2 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px] font-medium">+{product.collections.length - 2}</span>
            )}
          </div>
        )}
        <button className="mt-3 w-full h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-indigo-200">
          <ShoppingCart size={13} /> Add to Cart
        </button>
      </div>
    </div>
  );
}

function ListCard({ product, wishlisted, onWishlist }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex items-center gap-4 p-4">
      <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 relative">
        {product.images?.[0] && !imgErr ? (
          <Image src={product.images[0]} alt={product.title} onError={() => setImgErr(true)}
            fill
            sizes="80px"
            className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Package size={24} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {product.vendor && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-0.5">{product.vendor}</p>
            )}
            <h3 className="text-sm font-bold text-slate-800 truncate">{product.title}</h3>
            {product.description && (
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{product.description}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <div className="text-lg font-black text-indigo-600">${Number(product.price || 0).toFixed(2)}</div>
            <div className={`text-[11px] font-semibold ${Number(product.stock) === 0 ? "text-rose-400" : "text-emerald-500"}`}>
              {Number(product.stock) === 0 ? "Out of stock" : `${product.stock} in stock`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {product.productType && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-medium flex items-center gap-1">
              <Tag size={9} /> {product.productType}
            </span>
          )}
          {product.status === "draft" && (
            <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-600 text-[11px] font-bold uppercase tracking-wider">Draft</span>
          )}
          {product.featured && (
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-bold flex items-center gap-1">
              <Star size={9} fill="currentColor" /> Featured
            </span>
          )}
          {product.collections?.slice(0, 2).map(c => (
            <span key={c._id} className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-500 text-[10px] font-semibold">{c.name}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={onWishlist}
          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
            wishlisted ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-white border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-400"
          }`}
        >
          <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
        </button>
        <button className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-sm shadow-indigo-200">
          <ShoppingCart size={14} />
        </button>
      </div>
    </div>
  );
}
