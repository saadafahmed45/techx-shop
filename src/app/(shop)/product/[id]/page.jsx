"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AiFillStar, AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import {
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
  HiOutlineBadgeCheck,
} from "react-icons/hi";
import { HiArrowLeft } from "react-icons/hi2";
import AddReview from "@/components/AddReview";
import AddToCartButton from "@/components/AddToCartButton";
import { ProductCard } from "@/components/FeatureProduct";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const FALLBACK = "https://picsum.photos/600/600";

const BADGE_COLORS = {
  Featured: "bg-violet-50 text-violet-700 border-violet-200",
  "Best Seller": "bg-amber-50 text-amber-700 border-amber-200",
  "New Arrivals": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Popular Sales": "bg-rose-50 text-rose-700 border-rose-200",
  "Limited Edition": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "Trending Now": "bg-orange-50 text-orange-700 border-orange-200",
};

function Stars({ value = 0, size = "text-sm" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <AiFillStar
          key={s}
          className={`${size} ${s <= Math.round(value) ? "text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

function Badge({ label }) {
  const cls = BADGE_COLORS[label] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {label}
    </span>
  );
}

function InfoCard({ icon, title, sub }) {
  return (
    <div className="flex items-center gap-3 bg-stone-50 border border-stone-100 rounded-xl p-3.5 hover:border-stone-300 transition-colors">
      <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-600 text-lg shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-stone-800 text-xs">{title}</p>
        <p className="text-[11px] text-stone-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

const ProductDetailsPage = () => {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wished, setWished] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/products/${id}`);
        const p = await res.json();
        setProduct(p);
        setActiveImage(p.images?.[0] || FALLBACK);

        const allRes = await fetch(`${API}/products`);
        const all = await allRes.json();
        const related = Array.isArray(all)
          ? all.filter(
              (item) =>
                item._id !== p._id &&
                item.status === "active" &&
                item.collections?.some((col) =>
                  p.collections?.some((pc) => pc._id === col._id)
                )
            )
          : [];
        setRelatedProducts(related.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 rounded-full border-4 border-stone-200 border-t-stone-700 animate-spin" />
          <p className="text-stone-400 text-sm font-medium tracking-wide">Loading…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-stone-800">Product Not Found</p>
        <Link href="/product" className="flex items-center gap-2 text-stone-600 font-medium text-sm">
          <HiArrowLeft /> Back to Products
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [FALLBACK];
  const featureBadges = Array.isArray(product.featured) ? product.featured : [];
  const avgRating = product.rating?.average || 0;
  const reviewCount = product.rating?.count || 0;
  const reviews = product.rating?.reviews || [];
  const discountPrice = (Number(product.price || 0) * 1.25).toFixed(2);

  return (
    <div className="min-h-screen bg-stone-50 pt-8 md:pt-2">
      <div className=" mx-auto px-4= sm:px-6 md:px-32 py-8 md:py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8 font-medium">
          <Link href="/" className="hover:text-stone-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/product" className="hover:text-stone-700 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-stone-700 line-clamp-1">{product.title}</span>
        </nav>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Left — Images */}
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-stone-100">
              <div className="relative rounded-xl overflow-hidden bg-stone-50 border border-stone-100 aspect-square">
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <button
                  onClick={() => setWished(!wished)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow border border-stone-100 flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label="Toggle wishlist"
                >
                  {wished ? (
                    <AiFillHeart className="text-rose-500 text-base" />
                  ) : (
                    <AiOutlineHeart className="text-stone-400 text-base" />
                  )}
                </button>
                {featureBadges.length > 0 && (
                  <div className="absolute top-3 left-3">
                    <Badge label={featureBadges[0]} />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`shrink-0 w-17 h-17 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img
                          ? "border-stone-700"
                          : "border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Info */}
            <div className="p-6 md:p-8 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.vendor && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                    {product.vendor}
                  </span>
                )}
                {featureBadges.map((b) => <Badge key={b} label={b} />)}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-stone-900 leading-snug tracking-tight">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 mt-3 mb-5">
                <Stars value={avgRating} />
                <span className="font-semibold text-stone-800 text-sm">{avgRating}</span>
                <span className="text-stone-200 text-sm">|</span>
                <span className="text-stone-400 text-sm">{reviewCount} reviews</span>
                <span className="text-stone-200 text-sm">|</span>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-rose-500 text-sm font-semibold">Out of Stock</span>
                )}
              </div>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-stone-900 tracking-tight">
                  ${Number(product.price || 0).toFixed(2)}
                </span>
                <div className="mb-1 flex flex-col">
                  <span className="text-stone-400 line-through text-sm">${discountPrice}</span>
                  <span className="text-emerald-600 text-xs font-bold">20% OFF</span>
                </div>
              </div>

              <div className="h-px bg-stone-100 mb-5" />

              {product.collections?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {product.collections.map((col) => (
                    <span
                      key={col._id}
                      className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200"
                    >
                      {col.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                <InfoCard icon={<HiOutlineTruck />} title="Free Delivery" sub="2–5 business days" />
                <InfoCard icon={<HiOutlineShieldCheck />} title="Secure Payment" sub="100% protected" />
                <InfoCard icon={<HiOutlineRefresh />} title="Easy Returns" sub="7-day return policy" />
                <InfoCard icon={<HiOutlineBadgeCheck />} title="Premium Quality" sub="Export standard" />
              </div>
              <p className="text-stone-700 leading-relaxed text-md line-clamp-8  mb-8">{product.description}</p>
 
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <AddToCartButton product={product} />
                <button className="h-13 px-7 rounded-xl border-2 border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition font-semibold text-stone-700 text-sm">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Card */}
        <div className="mt-6 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-stone-100">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-7 py-4 text-sm font-semibold capitalize tracking-wide border-b-2 transition-colors -mb-px ${
                  activeTab === tab
                    ? "border-stone-800 text-stone-900"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                {tab === "reviews" ? `Reviews (${reviewCount})` : tab}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="p-7 md:p-10">
              <p className="text-stone-600 leading-relaxed text-md">{product.description}</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="p-7 md:p-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Customer Reviews</h2>
                  <p className="text-stone-400 mt-1 text-sm">Honest opinions from verified buyers</p>
                </div>
                <div className="shrink-0 bg-stone-50 border border-stone-200 rounded-xl px-8 py-5 text-center">
                  <p className="text-4xl font-bold text-stone-900">{avgRating || "—"}</p>
                  <Stars value={avgRating} size="text-base" />
                  <p className="text-xs text-stone-400 mt-2">
                    Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {reviews.length > 0 ? (
                  reviews.map((review, i) => (
                    <div
                      key={i}
                      className="bg-stone-50 border border-stone-100 rounded-xl p-5 hover:border-stone-200 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-600 font-bold text-sm flex items-center justify-center uppercase shrink-0">
                            {review.customerName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-stone-900 text-sm">
                                {review.customerName || "Anonymous"}
                              </h4>
                              <Stars value={review.rating} size="text-xs" />
                            </div>
                            <p className="text-stone-500 text-sm leading-relaxed mt-1.5">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-stone-400 whitespace-nowrap shrink-0">
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
                  <div className="text-center py-14 bg-stone-50 rounded-xl border border-stone-100">
                    <p className="text-3xl mb-3">💬</p>
                    <h3 className="text-base font-semibold text-stone-800">No Reviews Yet</h3>
                    <p className="text-stone-400 mt-1.5 text-sm">Be the first to share your experience</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-stone-100">
                <AddReview productId={product._id} />
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 px-6 py-6 ">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-stone-900">You Might Also Like</h2>
                <p className="text-stone-400 text-sm mt-0.5">From the same collection</p>
              </div>
              <Link href="/product" className="text-stone-600 font-medium text-sm hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;