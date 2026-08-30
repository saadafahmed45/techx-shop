"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useShopData } from "@/context/ShopDataContext";
import { useCart } from "@/context/CartContext";
import { useWishlistStore } from "@/stores/wishlistStore";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import AddReview from "@/components/AddReview";
import ProductCard from "@/components/ProductCard";

const FALLBACK = "https://picsum.photos/600/600";

function Stars({ value = 0, size = "w-3.5 h-3.5" }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${size} ${
            s <= Math.round(value) ? "fill-amber-400" : "text-neutral-200 fill-transparent"
          }`}
        />
      ))}
    </div>
  );
}

export default function ProductDetailClient({ product: serverProduct }) {
  const params = useParams();
  const router = useRouter();
  const { products: allProducts } = useShopData();
  const { addToCart, openCart } = useCart();
  const { items, toggleWishlist, hydrate } = useWishlistStore();

  const [product, setProduct] = useState(serverProduct);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(
    serverProduct?.images?.[0] || FALLBACK
  );
  const [activeTab, setActiveTab] = useState("description");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Fallback fetch if serverProduct was not supplied
  useEffect(() => {
    if (product) return;
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    (async () => {
      try {
        const res = await fetch(`${API}/products/${params.id}`);
        const p = await res.json();
        setProduct(p);
        setActiveImage(p.images?.[0] || FALLBACK);
      } catch {}
    })();
  }, [params.id, product]);

  // Related products
  useEffect(() => {
    if (!product || !Array.isArray(allProducts)) return;
    const related = allProducts.filter(
      (item) =>
        item._id !== product._id &&
        item.status === "active" &&
        item.collections?.some((col) =>
          product.collections?.some((pc) => pc._id === col._id || pc.name === col.name)
        )
    );
    setRelatedProducts(related.slice(0, 4));
  }, [product, allProducts]);

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-xl font-bold text-neutral-900">Product Not Found</p>
        <Link
          href="/product"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-950 font-medium text-xs border border-neutral-200 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
        </Link>
      </div>
    );
  }

  const isWished = items.some((item) => item._id === product._id);
  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [FALLBACK];
  const price = Number(product.price || 0);
  const comparePrice = product.compareAtPrice || (price > 0 ? Math.round(price * 1.25) : 0);
  const avgRating = Number(product.rating?.average || 4.5);
  const reviewCount = Number(product.rating?.count || product.rating?.reviews?.length || 0);
  const reviews = Array.isArray(product.rating?.reviews) ? product.rating.reviews : [];

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    openCart();
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    router.push("/checkout");
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8 font-medium">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/product" className="hover:text-neutral-900 transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-neutral-900 truncate max-w-xs">{product.title}</span>
        </nav>

        {/* 2-Column Product Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div
              onClick={() => {
                const idx = images.indexOf(activeImage);
                setLightboxIndex(idx !== -1 ? idx : 0);
                setIsLightboxOpen(true);
              }}
              className="relative aspect-square w-full rounded-2xl bg-[#f6f6f7] border border-neutral-200/80 p-8 flex items-center justify-center cursor-zoom-in group overflow-hidden"
            >
              <div className="relative w-full h-full">
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className={`absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center border transition-all z-10 ${
                  isWished
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "bg-white/90 backdrop-blur-xs border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:bg-white"
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWished ? "fill-current text-red-500" : ""}`} />
              </button>

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-neutral-900 text-white">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    onMouseEnter={() => setActiveImage(img)}
                    className={`relative w-16 h-16 rounded-xl bg-[#f6f6f7] p-1.5 shrink-0 border transition-all ${
                      activeImage === img
                        ? "border-indigo-600 ring-1 ring-indigo-600"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      sizes="64px"
                      className="object-contain mix-blend-multiply p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Information & Controls */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  {product.vendor || product.productType || "Hardware"}
                </span>
                {product.collections?.map((c) => (
                  <span
                    key={c._id || c.name}
                    className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[10px] font-medium"
                  >
                    {c.name}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 leading-snug">
                {product.title}
              </h1>

              {/* Rating and Stock */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5">
                  <Stars value={avgRating} />
                  <span className="text-xs font-semibold text-neutral-900">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-neutral-400">
                    ({reviewCount} reviews)
                  </span>
                </div>
                <span className="text-neutral-300">•</span>
                <span
                  className={`text-xs font-medium ${
                    product.stock > 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 py-3 border-y border-neutral-200/80">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-neutral-950">
                  ৳{price.toLocaleString()}
                </span>
                {comparePrice > price && (
                  <span className="text-sm text-neutral-400 line-through">
                    ৳{comparePrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-sm text-neutral-600 leading-relaxed line-clamp-4">
                {product.description}
              </p>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center h-11 border border-neutral-300 rounded-lg bg-white px-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white text-xs font-medium transition-colors shadow-sm shadow-indigo-600/20 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center h-11 px-6 rounded-lg border border-neutral-300 hover:bg-indigo-50 hover:border-indigo-600 hover:text-indigo-600 text-neutral-900 text-xs font-medium transition-colors cursor-pointer"
              >
                Buy It Now
              </button>
            </div>

            {/* Minimalist Trust Features */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200/80">
              <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                <Truck className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Express Nationwide Shipping</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>100% Genuine Warranty</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                <RotateCcw className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>7-Day Return Policy</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-600">
                <Headphones className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>24/7 Priority Tech Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Section Below: Description, Specifications, Reviews */}
        <div className="mt-16 border-t border-neutral-200">
          <div className="flex items-center gap-6 border-b border-neutral-200">
            {["description", "specifications", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 text-xs font-semibold capitalize tracking-wide transition-all border-b-2 -mb-px cursor-pointer ${
                  activeTab === tab
                    ? "border-indigo-600 text-indigo-600 font-bold"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {tab === "reviews" ? `Reviews (${reviewCount})` : tab}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="max-w-3xl space-y-4 text-sm text-neutral-600 leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-2xl border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200 text-xs">
                <div className="grid grid-cols-3 p-3 bg-neutral-50">
                  <span className="font-semibold text-neutral-700">Brand / Vendor</span>
                  <span className="col-span-2 text-neutral-600">{product.vendor || "TechX Authentic"}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-semibold text-neutral-700">Category</span>
                  <span className="col-span-2 text-neutral-600">{product.productType || "Gadget"}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-neutral-50">
                  <span className="font-semibold text-neutral-700">Stock Availability</span>
                  <span className="col-span-2 text-neutral-600">{product.stock > 0 ? "In Stock" : "Backorder"}</span>
                </div>
                <div className="grid grid-cols-3 p-3 bg-white">
                  <span className="font-semibold text-neutral-700">Warranty</span>
                  <span className="col-span-2 text-neutral-600">1 Year Official Standard Warranty</span>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-3xl space-y-8">
                {/* Review Header */}
                <div className="flex items-center justify-between p-6 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div>
                    <h3 className="text-base font-bold text-neutral-950">Customer Rating</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Based on {reviewCount} customer reviews
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-neutral-950">{avgRating.toFixed(1)}</div>
                    <Stars value={avgRating} size="w-4 h-4" />
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-3">
                  {reviews.length > 0 ? (
                    reviews.map((rev, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-neutral-200/80 bg-white space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-neutral-900">
                              {rev.customerName || "Verified Buyer"}
                            </span>
                            <Stars value={rev.rating} size="w-3 h-3" />
                          </div>
                          <span className="text-[11px] text-neutral-400">
                            {rev.createdAt
                              ? new Date(rev.createdAt).toLocaleDateString()
                              : "Recent"}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center border border-dashed border-neutral-200 rounded-xl">
                      <p className="text-xs text-neutral-400">
                        No reviews yet. Be the first to share your thoughts on this product.
                      </p>
                    </div>
                  )}
                </div>

                {/* Add Review Form */}
                <div className="pt-6 border-t border-neutral-200">
                  <AddReview productId={product._id} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Recommendations
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 mt-1">
                  Related Hardware
                </h2>
              </div>
              <Link
                href="/product"
                className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                Browse All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.slug || item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
              }}
              className="absolute left-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div
            className="relative max-w-3xl w-full h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt="Lightbox View"
              fill
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
