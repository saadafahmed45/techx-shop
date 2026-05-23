"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  AiFillStar,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";

import {
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
  HiOutlineBadgeCheck,
} from "react-icons/hi";

import { HiArrowLeft } from "react-icons/hi2";

import AddReview from "@/components/AddReview";
import AddToCartButton from "@/components/AddToCartButton";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK = "https://picsum.photos/600/600";

// ============================
// STAR ROW
// ============================

function Stars({ value = 0, size = "text-base" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <AiFillStar
          key={s}
          className={`${size} ${
            s <= Math.round(value) ? "text-amber-400" : "text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

// ============================
// BADGE
// ============================

function Badge({ label }) {
  const colors = {
    "Featured": "bg-violet-100 text-violet-700 border-violet-200",
    "Best Seller": "bg-amber-100 text-amber-700 border-amber-200",
    "New Arrivals": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Popular Sales": "bg-rose-100 text-rose-700 border-rose-200",
    "Limited Edition": "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
    "Top Selling Products": "bg-sky-100 text-sky-700 border-sky-200",
    "Trending Now": "bg-orange-100 text-orange-700 border-orange-200",
  };

  const cls =
    colors[label] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${cls}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

// ============================
// INFO CARD
// ============================

function InfoCard({ icon, title, sub }) {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:border-indigo-100 hover:bg-indigo-50/40 transition-all">
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 text-xl shadow-sm">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-slate-800 text-sm">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ============================
// MAIN PAGE
// ============================

const ProductDetailsPage = () => {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wished, setWished] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  // LOAD DATA
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/products/${id}`);
        const p = await res.json();

        setProduct(p);
        setActiveImage(p.images?.[0] || FALLBACK);

        const allRes = await fetch(`${API}/products`);
        const allProducts = await allRes.json();

        const related = Array.isArray(allProducts)
          ? allProducts.filter(
              (item) =>
                item._id !== p._id &&
                item.status === "active" &&
                item.collections?.some((col) =>
                  p.collections?.some((pc) => pc._id === col._id)
                )
            )
          : [];

        setRelatedProducts(related.slice(0, 4));
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading product…</p>
        </div>
      </div>
    );
  }

  // NOT FOUND
  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-black text-slate-800">Product Not Found</p>
        <Link
          href="/product"
          className="flex items-center gap-2 text-indigo-600 font-semibold"
        >
          <HiArrowLeft /> Back to Products
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [FALLBACK];

  // ✅ FIX: featured is an array
  const featureBadges = Array.isArray(product.featured) ? product.featured : [];

  const avgRating = product.rating?.average || 0;
  const reviewCount = product.rating?.count || 0;
  const reviews = product.rating?.reviews || [];

  const discountPrice = (Number(product.price || 0) * 1.25).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-8 font-medium">
          <Link href="/" className="hover:text-slate-700 transition">Home</Link>
          <span>/</span>
          <Link href="/product" className="hover:text-slate-700 transition">Products</Link>
          <span>/</span>
          <span className="text-slate-700 line-clamp-1">{product.title}</span>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* ── LEFT: IMAGES ── */}
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-100">

              {/* MAIN IMAGE */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 aspect-square">
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {/* WISH */}
                <button
                  onClick={() => setWished(!wished)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform"
                >
                  {wished ? (
                    <AiFillHeart className="text-red-500 text-lg" />
                  ) : (
                    <AiOutlineHeart className="text-slate-400 text-lg" />
                  )}
                </button>

                {/* FEATURE BADGE OVERLAY */}
                {featureBadges.length > 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge label={featureBadges[0]} />
                  </div>
                )}
              </div>

              {/* THUMBNAILS */}
              {images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === img
                          ? "border-indigo-500 shadow-md shadow-indigo-100"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: INFO ── */}
            <div className="p-6 md:p-8 flex flex-col">

              {/* VENDOR + BADGES */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.vendor && (
                  <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    {product.vendor}
                  </span>
                )}
                {featureBadges.map((b) => (
                  <Badge key={b} label={b} />
                ))}
              </div>

              {/* TITLE */}
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                {product.title}
              </h1>

              {/* RATING ROW */}
              <div className="flex items-center gap-3 mt-4">
                <Stars value={avgRating} />
                <span className="font-bold text-slate-800 text-sm">{avgRating}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 text-sm">{reviewCount} reviews</span>
                {product.stock > 0 ? (
                  <>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock ({product.stock})
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-slate-300">|</span>
                    <span className="text-red-500 text-sm font-semibold">Out of Stock</span>
                  </>
                )}
              </div>

              {/* PRICE */}
              <div className="flex items-end gap-3 mt-6">
                <span className="text-4xl md:text-5xl font-black text-indigo-600">
                  ${Number(product.price || 0).toFixed(2)}
                </span>
                <div className="mb-1.5 flex flex-col">
                  <span className="text-slate-400 line-through text-base">${discountPrice}</span>
                  <span className="text-emerald-600 text-xs font-bold">
                    20% OFF
                  </span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="my-6 h-px bg-slate-100" />

              {/* DESCRIPTION */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Description
                  </h3>
                  <p className="text-slate-600 leading-7 text-sm">
                    {product.description}
                  </p>
                </div>
              )}

              {/* COLLECTIONS */}
              {product.collections?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.collections.map((col) => (
                    <span
                      key={col._id}
                      className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200"
                    >
                      {col.name}
                    </span>
                  ))}
                </div>
              )}

              {/* INFO GRID */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <InfoCard
                  icon={<HiOutlineTruck />}
                  title="Free Delivery"
                  sub="2–5 business days"
                />
                <InfoCard
                  icon={<HiOutlineShieldCheck />}
                  title="Secure Payment"
                  sub="100% protected"
                />
                <InfoCard
                  icon={<HiOutlineRefresh />}
                  title="Easy Returns"
                  sub="7-day return policy"
                />
                <InfoCard
                  icon={<HiOutlineBadgeCheck />}
                  title="Premium Quality"
                  sub="Export standard"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <AddToCartButton product={product} />
                <button className="h-14 px-8 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition font-bold text-slate-700 text-sm">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10">

          {/* REVIEW HEADER */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                Customer Reviews
              </h2>
              <p className="text-slate-400 mt-1 text-sm">
                Honest opinions from verified buyers
              </p>
            </div>

            {/* RATING SUMMARY */}
            <div className="shrink-0 bg-slate-50 border border-slate-200 rounded-2xl px-8 py-5 text-center">
              <p className="text-5xl font-black text-indigo-600">{avgRating || "—"}</p>
              <Stars value={avgRating} size="text-lg" />
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* REVIEW LIST */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">

                      {/* AVATAR */}
                      <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 font-black text-lg flex items-center justify-center uppercase shrink-0">
                        {review.customerName?.charAt(0) || "U"}
                      </div>

                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-bold text-slate-900">
                            {review.customerName || "Anonymous"}
                          </h4>
                          <Stars value={review.rating} size="text-sm" />
                        </div>
                        <p className="text-slate-600 text-sm leading-7 mt-2">
                          {review.comment}
                        </p>
                      </div>
                    </div>

                    {/* DATE */}
                    <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-14 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-bold text-slate-800">No Reviews Yet</h3>
                <p className="text-slate-400 mt-2 text-sm">
                  Be the first to share your experience
                </p>
              </div>
            )}
          </div>

          {/* ADD REVIEW */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <AddReview productId={product._id} />
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                  You Might Also Like
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  From the same collection
                </p>
              </div>
              <Link
                href="/product"
                className="text-indigo-600 font-semibold text-sm hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item._id}
                  href={`/product/${item._id}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:-translate-y-1.5 hover:shadow-lg hover:shadow-slate-200 transition-all duration-300"
                >
                  <div className="overflow-hidden bg-slate-50 aspect-square">
                    <img
                      src={item.images?.[0] || FALLBACK}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    {item.vendor && (
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        {item.vendor}
                      </p>
                    )}
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-indigo-600 font-black text-lg mt-2">
                      ${Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;