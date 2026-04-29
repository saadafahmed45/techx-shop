"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AiFillStar, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlineAdjustments, HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { TbArrowsSort } from "react-icons/tb";
import { BsCheckLg } from "react-icons/bs";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const CATEGORIES = ["Electronics", "Clothes", "Furniture", "Shoes", "Miscellaneous"];
const BRANDS     = ["Apple", "Samsung", "Sony", "Garmin", "Fitbit"];
const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Best Rating", value: "rating" },
];
const PER_PAGE = 9;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function cleanImg(raw, id) {
  const url = Array.isArray(raw) ? raw[0] : raw;
  const s = (url || "").replace(/[\[\]"]/g, "").trim();
  if (s.startsWith("http")) return s;
  return `https://picsum.photos/seed/${id}/480/480`;
}

// ─────────────────────────────────────────────
// Checkbox
// ─────────────────────────────────────────────
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer py-1">
      <span
        onClick={onChange}
        className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-150"
        style={{
          border: checked ? "none" : "1.5px solid #d1d5db",
          background: checked ? "#1a3aff" : "white",
          boxShadow: checked ? "0 0 0 3px rgba(26,58,255,0.12)" : "none",
        }}
      >
        {checked && <BsCheckLg className="text-white text-[9px]" />}
      </span>
      <span
        className="text-[13px] transition-colors select-none"
        style={{ color: checked ? "#1a3aff" : "#4b5563", fontWeight: checked ? 600 : 400 }}
      >
        {label}
      </span>
    </label>
  );
}

// ─────────────────────────────────────────────
// ProductCard
// ─────────────────────────────────────────────
function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const img      = cleanImg(product.images, product.id);
  const isNew    = product.id % 3 === 0;
  const isSale   = product.id % 5 === 0;
  const origPrice = isSale ? (product.price * 1.25).toFixed(2) : null;

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "box-shadow 0.3s, transform 0.3s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(26,58,255,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative block overflow-hidden bg-gray-50" style={{ aspectRatio: "1/1" }}>
        <img
          src={img}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = `https://picsum.photos/seed/${product.id + 99}/480/480`; }}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {isNew  && <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest text-white uppercase" style={{ background: "#1a3aff" }}>NEW</span>}
          {isSale && <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest text-white uppercase" style={{ background: "#ef4444" }}>SALE</span>}
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); setWished(w => !w); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white shadow-md"
        >
          {wished ? <AiFillHeart className="text-red-500 text-sm" /> : <AiOutlineHeart className="text-gray-400 text-sm" />}
        </button>

        {/* Free Shipping */}
        {product.id % 4 === 0 && (
          <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-600 border border-green-100">
            Free Shipping
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-1 px-4 pt-3.5 pb-4">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400">
          {product.category?.name || "General"}
        </p>

        <Link href={`/product/${product.id}`}>
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-1 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-0.5">
          {[1,2,3,4,5].map(s => (
            <AiFillStar key={s} className={`text-[11px] ${s <= 4 ? "text-amber-400" : "text-gray-200"}`} />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">4.{product.id % 10}</span>
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[17px] font-extrabold" style={{ color: "#1a3aff" }}>
            ${product.price?.toFixed(2)}
          </span>
          {origPrice && <span className="text-[13px] text-gray-300 line-through">${origPrice}</span>}
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
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-100" />
          <div className="p-4 flex flex-col gap-2">
            <div className="h-2.5 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/4 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────
function Pagination({ current, total, onChange }) {
  const pages = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push("…");
    pages.push(total);
  }

  const base = "w-9 h-9 rounded-lg flex items-center justify-center text-[13px] font-semibold transition-all duration-150 select-none";

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className={`${base} border border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <HiChevronLeft />
      </button>

      {pages.map((p, i) =>
        p === "…"
          ? <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-300 text-sm">…</span>
          : <button
              key={p}
              onClick={() => onChange(p)}
              className={base}
              style={current === p
                ? { background: "#1a3aff", color: "white", boxShadow: "0 4px 14px rgba(26,58,255,0.3)" }
                : { border: "1px solid #e5e7eb", color: "#6b7280" }}
            >
              {p}
            </button>
      )}

      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className={`${base} border border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <HiChevronRight />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// SidebarContent  (pure UI — no hooks)
// ─────────────────────────────────────────────
function SidebarContent({ selectedCategories, selectedBrands, price, setPrice, hasFilters, toggleParam, clearAll }) {
  return (
    <div className="flex flex-col gap-7">
      {/* Category */}
      <div>
        <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">Category</h3>
        {CATEGORIES.map(cat => (
          <Checkbox
            key={cat}
            label={cat}
            checked={selectedCategories.map(c => c.toLowerCase()).includes(cat.toLowerCase())}
            onChange={() => toggleParam("category", cat.toLowerCase())}
          />
        ))}
      </div>

      <div className="h-px bg-gray-100" />

      {/* Brand */}
      <div>
        <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">Brand</h3>
        {BRANDS.map(brand => (
          <Checkbox
            key={brand}
            label={brand}
            checked={selectedBrands.map(b => b.toLowerCase()).includes(brand.toLowerCase())}
            onChange={() => toggleParam("brand", brand.toLowerCase())}
          />
        ))}
      </div>

      <div className="h-px bg-gray-100" />

      {/* Price */}
      <div>
        <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">Price Range</h3>
        <input
          type="range" min={0} max={1000} value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: "#1a3aff" }}
        />
        <div className="flex justify-between text-[12px] text-gray-400 mt-2">
          <span>$0</span>
          <span className="font-semibold text-gray-700">${price.toLocaleString()}+</span>
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-[12px] font-semibold text-red-400 hover:text-red-600 transition-colors text-left"
        >
          Clear all filters ×
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ★  Inner component — uses useSearchParams
//    Must be wrapped in <Suspense> by its parent
// ─────────────────────────────────────────────
function ProductPageInner() {
  const [allProducts, setAllProducts] = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [price, setPrice]             = useState(1000);
  const [sort, setSort]               = useState("newest");
  const [page, setPage]               = useState(1);
  const [mobileFilter, setMobileFilter] = useState(false);

  // ★ useSearchParams is ONLY called inside this inner component
  //   which will always be inside a <Suspense> boundary
  const searchParams = useSearchParams();
  const router       = useRouter();

  const selectedCategories = searchParams.getAll("category");
  const selectedBrands     = searchParams.getAll("brand");

  // Fetch
  useEffect(() => {
    setLoading(true);
    fetch("https://api.escuelajs.co/api/v1/products?limit=60")
      .then(r => r.json())
      .then(data => { setAllProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Filter + Sort
  useEffect(() => {
    let tmp = [...allProducts];

    if (selectedCategories.length) {
      tmp = tmp.filter(p =>
        selectedCategories.some(c => p.category?.name?.toLowerCase() === c.toLowerCase())
      );
    }
    if (selectedBrands.length) {
      tmp = tmp.filter(p =>
        selectedBrands.some(b => p.title?.toLowerCase().includes(b.toLowerCase()))
      );
    }
    tmp = tmp.filter(p => (p.price ?? 0) <= price);

    if (sort === "price_asc")  tmp.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") tmp.sort((a, b) => b.price - a.price);
    if (sort === "newest")     tmp.sort((a, b) => b.id - a.id);

    setFiltered(tmp);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts, selectedCategories.join(","), selectedBrands.join(","), price, sort]);

  // Toggle URL param
  const toggleParam = useCallback((key, value) => {
    const params  = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    if (current.includes(value)) {
      current.filter(v => v !== value).forEach(v => params.append(key, v));
    } else {
      [...current, value].forEach(v => params.append(key, v));
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const clearAll = useCallback(() => {
    router.push("?", { scroll: false });
    setPrice(1000);
    setSort("newest");
  }, [router]);

  // Paginate
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const hasFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || price < 1000;

  const sidebarProps = { selectedCategories, selectedBrands, price, setPrice, hasFilters, toggleParam, clearAll };

  const pageTitle = selectedCategories.length === 1
    ? selectedCategories[0].charAt(0).toUpperCase() + selectedCategories[0].slice(1)
    : "All Products";

  return (
    <div className="min-h-screen" style={{ background: "#f7f8fc" }}>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className=" mx-auto px-5 md:px-10 h-11 flex items-center gap-1.5 text-[12px] text-gray-400">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
          <span>/</span>
          <span className="font-semibold text-gray-700">{pageTitle}</span>
        </div>
      </div>

      <div className=" mx-auto px-5 md:px-10 py-8 flex gap-7">

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-56 shrink-0 self-start sticky top-20">
          <div className="bg-white rounded-2xl p-5 border border-gray-100" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <SidebarContent {...sidebarProps} />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">

          {/* Header */}
          <div className="flex items-start md:items-center justify-between gap-3 mb-6 flex-wrap">
            <div>
              <h1 className="text-[26px] md:text-[32px] font-extrabold text-gray-900 leading-tight">
                {pageTitle}
              </h1>
              <p className="text-[13px] text-gray-400 mt-0.5">
                Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile filter btn */}
              <button
                onClick={() => setMobileFilter(true)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-600 bg-white hover:border-blue-300 transition-colors"
              >
                <HiOutlineAdjustments className="text-sm" /> Filters
                {hasFilters && (
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "#1a3aff" }}>
                    {selectedCategories.length + selectedBrands.length + (price < 1000 ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <TbArrowsSort className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-gray-700 appearance-none cursor-pointer hover:border-blue-300 focus:outline-none focus:border-blue-400 transition-colors"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Active filter pills */}
          {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedCategories.map(c => (
                <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border"
                  style={{ background: "rgba(26,58,255,0.06)", borderColor: "rgba(26,58,255,0.2)", color: "#1a3aff" }}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                  <button onClick={() => toggleParam("category", c)} className="hover:text-red-500">×</button>
                </span>
              ))}
              {selectedBrands.map(b => (
                <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border"
                  style={{ background: "rgba(26,58,255,0.06)", borderColor: "rgba(26,58,255,0.2)", color: "#1a3aff" }}>
                  {b.charAt(0).toUpperCase() + b.slice(1)}
                  <button onClick={() => toggleParam("brand", b)} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <SkeletonGrid />
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gray-100">
                <HiOutlineAdjustments className="text-gray-300 text-2xl" />
              </div>
              <p className="text-[16px] font-semibold text-gray-700 mb-1">No products found</p>
              <p className="text-[13px] text-gray-400 mb-5">Try adjusting your filters</p>
              <button onClick={clearAll} className="px-5 py-2 rounded-xl text-[13px] font-semibold text-white" style={{ background: "#1a3aff" }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {paginated.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <Pagination
              current={page}
              total={totalPages}
              onChange={p => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilter && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilter(false)} />
          <div className="relative ml-auto w-72 h-full bg-white flex flex-col" style={{ boxShadow: "-4px 0 30px rgba(0,0,0,0.12)" }}>
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100">
              <span className="font-bold text-gray-900">Filters</span>
              <button onClick={() => setMobileFilter(false)} className="text-gray-400 hover:text-gray-700">
                <HiX className="text-xl" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <SidebarContent {...sidebarProps} />
            </div>
            <div className="px-5 pb-6 pt-3 border-t border-gray-100">
              <button
                onClick={() => setMobileFilter(false)}
                className="w-full py-3 rounded-xl text-[14px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #1a3aff, #2a50ff)", boxShadow: "0 4px 16px rgba(26,58,255,0.3)" }}
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ★  Page export — wraps inner in <Suspense>
//    This is what fixes the Next.js build error
// ─────────────────────────────────────────────
export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#f7f8fc" }}>
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-9 h-9 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin"
            />
            <p className="text-[13px] text-gray-400 tracking-wide">Loading products…</p>
          </div>
        </div>
      }
    >
      <ProductPageInner />
    </Suspense>
  );
}