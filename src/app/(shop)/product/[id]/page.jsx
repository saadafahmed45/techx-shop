"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart, Heart, Star, StarHalf, Share2, ChevronRight,
  Truck, ShieldCheck, RotateCcw, Package, Plus, Minus,
  Check, X, ThumbsUp, Send, ImageIcon,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const API = process.env.NEXT_PUBLIC_API_URL;

// ── Star renderer ──
function Stars({ rating = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

// ── Interactive star picker ──
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-125"
        >
          <Star
            size={22}
            className={i <= (hovered || value) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // description | reviews
  const [added, setAdded] = useState(false);

  // ── Reviews state ──
  const [reviews, setReviews] = useState([
    { id: 1, name: "Rahim Uddin", rating: 5, date: "2 days ago", text: "Excellent product! Build quality is great and delivery was fast. Highly recommend.", helpful: 12 },
    { id: 2, name: "Tasnim Akter", rating: 4, date: "1 week ago", text: "Good product, matches the description. Only minor issue is packaging could be better.", helpful: 7 },
  ]);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 0, text: "" });
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // ── Fetch product ──
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        // fetch related by productType
        if (data?.productType) {
          return fetch(`${API}/products?productType=${encodeURIComponent(data.productType)}&limit=4`);
        }
      })
      .then((r) => r?.json())
      .then((rel) => {
        if (Array.isArray(rel)) setRelated(rel.filter((p) => p._id !== id).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim()) return setReviewError("Please enter your name");
    if (reviewForm.rating === 0) return setReviewError("Please select a rating");
    if (reviewForm.text.trim().length < 10) return setReviewError("Review must be at least 10 characters");
    setReviewError("");
    const newReview = {
      id: Date.now(),
      name: reviewForm.name.trim(),
      rating: reviewForm.rating,
      date: "Just now",
      text: reviewForm.text.trim(),
      helpful: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    setReviewForm({ name: "", rating: 0, text: "" });
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // ── Loading skeleton ──
  if (loading) return (
    <div className="min-h-screen bg-[#f7f7f5] py-10">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="bg-white rounded-3xl aspect-square" />
          <div className="space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded-full" />
            <div className="h-8 w-3/4 bg-gray-200 rounded-xl" />
            <div className="h-6 w-1/4 bg-gray-200 rounded-xl" />
            <div className="h-20 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Product not found.</p>
    </div>
  );

  const images = product.images?.length ? product.images : ["/placeholder.png"];
  const inStock = Number(product.stock) > 0;

  return (
    <div className="min-h-screen bg-[#f7f7f5]">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-3.5 flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/product" className="hover:text-gray-700 transition-colors">Products</Link>
          <ChevronRight size={12} />
          {product.productType && (
            <>
              <Link href={`/product?category=${product.productType}`} className="hover:text-gray-700 transition-colors">{product.productType}</Link>
              <ChevronRight size={12} />
            </>
          )}
          <span className="text-gray-600 font-medium truncate max-w-48">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8 md:py-12 space-y-8">

        {/* ═══════════════════════════════════════
            PRODUCT MAIN — image + info
        ════════════════════════════════════════ */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">

          {/* ── Images ── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative bg-white rounded-3xl overflow-hidden aspect-square border border-gray-100">
              <img
                src={images[activeImg]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="bg-amber-400 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wide">
                    Featured
                  </span>
                )}
                {!inStock && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wide">
                    Out of Stock
                  </span>
                )}
              </div>
              {/* Wishlist */}
              <button
                onClick={() => setWishlisted((p) => !p)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${
                  wishlisted ? "bg-red-500 border-red-500 text-white" : "bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400"
                }`}
              >
                <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? "border-gray-900 scale-105" : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col gap-5">

            {/* Vendor + type */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.vendor && (
                <span className="text-xs font-black uppercase tracking-widest text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                  {product.vendor}
                </span>
              )}
              {product.productType && (
                <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                  {product.productType}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Ratings row */}
            {reviews.length > 0 && (
              <div className="flex items-center gap-3">
                <Stars rating={avgRating} size={15} />
                <span className="text-sm font-bold text-gray-700">{avgRating}</span>
                <span className="text-sm text-gray-400">({reviews.length} reviews)</span>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 transition-colors"
                >
                  Write a review
                </button>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3">
              <p className="text-4xl font-black text-gray-900">৳{Number(product.price || 0).toLocaleString()}</p>
              {product.comparePrice && (
                <p className="text-lg text-gray-400 line-through mb-1">৳{Number(product.comparePrice).toLocaleString()}</p>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${inStock ? "bg-green-500 animate-pulse" : "bg-red-400"}`} />
              <span className={`text-sm font-semibold ${inStock ? "text-green-600" : "text-red-500"}`}>
                {inStock ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex gap-3 items-center flex-wrap">
              <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-gray-600"
                >
                  <Minus size={13} />
                </button>
                <span className="w-10 text-center text-sm font-black text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm transition-all text-gray-600"
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all ${
                  added
                    ? "bg-green-600 text-white"
                    : inStock
                    ? "bg-gray-900 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {added ? <><Check size={15} /> Added!</> : <><ShoppingCart size={15} /> Add to Cart</>}
              </button>

              <button className="w-11 h-11 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-all">
                <Share2 size={15} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { icon: <Truck size={14} />, text: "Free delivery over ৳2000" },
                { icon: <RotateCcw size={14} />, text: "7-day easy return" },
                { icon: <ShieldCheck size={14} />, text: "Secure payment" },
              ].map((b, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-3 text-center">
                  <div className="flex justify-center text-gray-500 mb-1">{b.icon}</div>
                  <p className="text-[10px] text-gray-500 leading-tight">{b.text}</p>
                </div>
              ))}
            </div>

            {/* Collections */}
            {product.collections?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.collections.map((c) => (
                  <span key={c._id} className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg font-medium">
                    {c.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════
            TABS — Description / Reviews
        ════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">

          {/* Tab bar */}
          <div className="flex border-b border-gray-100">
            {[
              { key: "description", label: "Description" },
              { key: "reviews", label: `Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 sm:flex-none px-6 md:px-10 py-4 text-sm font-bold transition-all border-b-2 ${
                  activeTab === tab.key
                    ? "border-gray-900 text-gray-900 bg-gray-50"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Description tab ── */}
          {activeTab === "description" && (
            <div className="p-6 md:p-10">
              {product.description ? (
                <div className="prose prose-gray max-w-none text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-300">
                  <Package size={36} strokeWidth={1.5} className="mx-auto mb-3" />
                  <p className="text-gray-400">No description available.</p>
                </div>
              )}

              {/* Specs table */}
              {(product.vendor || product.productType || product.stock) && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Specifications</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {[
                      { label: "Brand", value: product.vendor },
                      { label: "Category", value: product.productType },
                      { label: "SKU", value: product._id?.slice(-8).toUpperCase() },
                      { label: "Stock", value: `${product.stock} units` },
                      { label: "Status", value: product.status },
                    ].filter((r) => r.value).map((row) => (
                      <div key={row.label} className="flex justify-between py-2.5 px-4 rounded-xl bg-gray-50 text-sm">
                        <span className="text-gray-400 font-medium">{row.label}</span>
                        <span className="text-gray-700 font-semibold capitalize">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Reviews tab ── */}
          {activeTab === "reviews" && (
            <div className="p-6 md:p-10 space-y-8">

              {/* Rating overview */}
              <div className="flex items-center gap-6 p-5 bg-gray-50 rounded-2xl">
                <div className="text-center shrink-0">
                  <p className="text-5xl font-black text-gray-900">{avgRating}</p>
                  <Stars rating={avgRating} size={14} />
                  <p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length;
                    const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-4 shrink-0">{star}</span>
                        <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 w-4 text-right shrink-0">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                          {review.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                          <p className="text-xs text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <Stars rating={review.rating} size={12} />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                        <ThumbsUp size={11} /> Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Add Review Form ── */}
              <div className="border-t border-gray-100 pt-8">
                <p className="text-base font-black text-gray-900 mb-6">Write a Review</p>

                {reviewSuccess && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 rounded-2xl px-4 py-3 mb-5 text-sm font-semibold">
                    <Check size={14} /> Review submitted! Thank you.
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Your Name *</label>
                      <input
                        type="text"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Enter your name"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-all placeholder-gray-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Rating *</label>
                      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                        <StarPicker value={reviewForm.rating} onChange={(v) => setReviewForm((p) => ({ ...p, rating: v }))} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Your Review *</label>
                    <textarea
                      value={reviewForm.text}
                      onChange={(e) => setReviewForm((p) => ({ ...p, text: e.target.value }))}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-all resize-none placeholder-gray-300"
                    />
                  </div>

                  {reviewError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-500 font-semibold">
                      <X size={12} /> {reviewError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
                  >
                    <Send size={13} /> Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════
            RELATED PRODUCTS
        ════════════════════════════════════════ */}
        {related.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">You might also like</p>
                <h2 className="text-2xl font-black text-gray-900">Related Products</h2>
              </div>
              <Link href={`/product?category=${product.productType}`} className="text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1">
                View all <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p._id}
                  href={`/product/${p._id}`}
                  className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <ImageIcon size={32} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {p.vendor && <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{p.vendor}</p>}
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-2">{p.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-black text-gray-900">৳{Number(p.price || 0).toLocaleString()}</p>
                      <span className={`text-[10px] font-bold ${Number(p.stock) > 0 ? "text-green-500" : "text-red-400"}`}>
                        {Number(p.stock) > 0 ? "In stock" : "Out"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}