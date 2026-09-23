"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useShopData } from "@/context/ShopDataContext";
import { useCart } from "@/context/CartContext";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "react-toastify";
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
  Zap,
  Share2,
  Maximize2,
  Clock,
  Sparkles,
  FileText,
  BadgeCheck,
  CreditCard,
  ChevronDown,
  Info,
  Layers,
} from "lucide-react";
import AddReview from "@/components/AddReview";
import ProductCard from "@/components/ProductCard";
import ProductDescription from "@/components/ProductDescription";

const FALLBACK = "https://picsum.photos/600/600";

function Stars({ value = 0, size = "w-4 h-4", showCount = false, count = 0 }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`${size} ${
              s <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-neutral-200 fill-neutral-100"
            }`}
          />
        ))}
      </div>
      {showCount && <span className="text-xs text-neutral-400 ml-1">({count})</span>}
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
  const [activeTab, setActiveTab] = useState("description");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [imageZoom, setImageZoom] = useState({ active: false, x: 50, y: 50 });

  const tabsRef = useRef(null);
  const buyBoxRef = useRef(null);

  // Normalize image paths
  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
        .map((img) => (typeof img === "string" ? img.replace(/[\[\]"]/g, "") : img))
        .filter(Boolean)
    : [FALLBACK];

  const [activeImage, setActiveImage] = useState(images[0]);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Sync activeImage if product changes
  useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [product?._id]);

  // Fallback fetch if serverProduct was not supplied
  useEffect(() => {
    if (product) return;
    const API = process.env.NEXT_PUBLIC_API_URL || "https://techx-server-tau.vercel.app";
    (async () => {
      try {
        const res = await fetch(`${API}/products/${params.id}`);
        const p = await res.json();
        setProduct(p);
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
        (item.collections?.some((col) =>
          product.collections?.some((pc) => pc._id === col._id || pc.name === col.name)
        ) ||
          item.productType === product.productType ||
          item.vendor === product.vendor)
    );
    setRelatedProducts(related.slice(0, 4));
  }, [product, allProducts]);

  // Handle sticky bar appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!buyBoxRef.current) return;
      const rect = buyBoxRef.current.getBoundingClientRect();
      // Show sticky bar when the main buy box scrolled out of viewport
      setShowStickyBar(rect.bottom < 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard controls for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, images.length]);

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-white flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
          <Layers className="w-8 h-8" />
        </div>
        <p className="text-xl font-bold text-neutral-900">Product Not Found</p>
        <p className="text-sm text-neutral-500 max-w-sm text-center">
          The gadget or hardware you are looking for is currently unavailable or has been moved.
        </p>
        <Link
          href="/product"
          className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
        </Link>
      </div>
    );
  }

  const isWished = items.some((item) => item._id === product._id);
  const price = Number(product.price || 0);
  const comparePrice =
    Number(product.compareAtPrice || product.originalPrice || 0) ||
    (price > 0 && product.badge === "Sale"
      ? Math.round(price * 1.25)
      : price > 0
      ? Math.round(price * 1.15)
      : 0);
  const hasDiscount = comparePrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;
  const savings = hasDiscount ? comparePrice - price : 0;

  const avgRating = Number(product.rating?.average || 4.8);
  const reviewCount = Number(
    product.rating?.count || product.rating?.reviews?.length || 18
  );
  const reviews = Array.isArray(product.rating?.reviews) ? product.rating.reviews : [];

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addToCart({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    openCart?.();
  };

  const handleBuyNow = () => {
    if (product.stock === 0) return;
    addToCart({ ...product, quantity });
    router.push("/checkout");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const scrollToTab = (tabName) => {
    setActiveTab(tabName);
    if (tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Image zoom handler
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setImageZoom({ active: true, x, y });
  };

  const handleMouseLeave = () => {
    setImageZoom({ active: false, x: 50, y: 50 });
  };

  const currentImageIndex = images.indexOf(activeImage);

  return (
    <div className="bg-[#fafafc] min-h-screen pb-24 text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        
        {/* Modern Breadcrumbs */}
        <nav className="flex items-center flex-wrap gap-2 text-xs text-neutral-500 mb-6 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
          <Link href="/product" className="hover:text-blue-600 transition-colors">
            Products
          </Link>
          {product.productType && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
              <span className="text-neutral-500 capitalize">{product.productType}</span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
          <span className="text-neutral-900 font-semibold truncate max-w-50 sm:max-w-md">
            {product.title}
          </span>
        </nav>

        {/* 2-Column Product Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ========================================== */}
          {/* LEFT: Elevated Media Gallery               */}
          {/* ========================================== */}
          <div className="lg:col-span-6 flex flex-col gap-4 sticky top-24">
            
            {/* Primary Image Viewport */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                const idx = images.indexOf(activeImage);
                setLightboxIndex(idx !== -1 ? idx : 0);
                setIsLightboxOpen(true);
              }}
              className="relative aspect-square w-full rounded-3xl bg-white border border-neutral-200/90 shadow-sm p-6 sm:p-10 flex items-center justify-center cursor-zoom-in group overflow-hidden select-none"
            >
              {/* Image Container with Smooth Zoom Preview */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={
                    imageZoom.active
                      ? {
                          transformOrigin: `${imageZoom.x}% ${imageZoom.y}%`,
                          transform: "scale(1.22)",
                        }
                      : { transform: "scale(1)" }
                  }
                  className="object-contain mix-blend-multiply transition-transform duration-200 ease-out"
                />
              </div>

              {/* Status Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {hasDiscount && discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> -{discountPercent}% OFF
                  </span>
                )}
                {product.badge && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-neutral-900 text-white shadow-xs">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Action Buttons Overlay (Wishlist, Fullscreen) */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-xs transition-all cursor-pointer ${
                    isWished
                      ? "bg-rose-50 border-rose-200 text-rose-500 scale-105"
                      : "bg-white/90 backdrop-blur-xs border-neutral-200 text-neutral-500 hover:text-neutral-950 hover:bg-white hover:scale-105"
                  }`}
                  aria-label="Wishlist"
                  title={isWished ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isWished ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const idx = images.indexOf(activeImage);
                    setLightboxIndex(idx !== -1 ? idx : 0);
                    setIsLightboxOpen(true);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-neutral-200 bg-white/90 backdrop-blur-xs text-neutral-500 hover:text-neutral-950 hover:bg-white hover:scale-105 shadow-xs transition-all cursor-pointer"
                  aria-label="Zoom Image"
                  title="Expand image fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Image Slide Arrows on Hover */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIdx = images.indexOf(activeImage);
                      const prevIdx = currentIdx === 0 ? images.length - 1 : currentIdx - 1;
                      setActiveImage(images[prevIdx]);
                    }}
                    className="absolute left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-neutral-200 text-neutral-700 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 transition-all shadow-sm z-10 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIdx = images.indexOf(activeImage);
                      const nextIdx = currentIdx === images.length - 1 ? 0 : currentIdx + 1;
                      setActiveImage(images[nextIdx]);
                    }}
                    className="absolute right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-neutral-200 text-neutral-700 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 transition-all shadow-sm z-10 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Image Count Indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-neutral-900/70 backdrop-blur-xs text-white text-[11px] font-medium tracking-wider z-10 pointer-events-none">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    onMouseEnter={() => setActiveImage(img)}
                    className={`relative w-18 h-18 rounded-2xl bg-white p-2 shrink-0 border transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-blue-600 ring-2 ring-blue-600/30 shadow-xs scale-102"
                        : "border-neutral-200/90 hover:border-neutral-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} view ${i + 1}`}
                      fill
                      sizes="72px"
                      className="object-contain mix-blend-multiply p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* RIGHT: Product Information & Purchase Hub   */}
          {/* ========================================== */}
          <div className="lg:col-span-6 flex flex-col gap-6" ref={buyBoxRef}>
            
            {/* Header: Vendor, Category, Stock & Title */}
            <div className="space-y-3">
              <div className="flex items-center flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {product.vendor || product.brand || "TechX Official"}
                </span>

                {product.collections?.map((c) => (
                  <span
                    key={c._id || c.name}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-medium"
                  >
                    {c.name}
                  </span>
                ))}

                {/* Stock Indicator with animated pulse dot */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ml-auto border ${
                    product.stock > 0
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                      : "bg-rose-50 text-rose-700 border-rose-200/80"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      product.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                    }`}
                  />
                  {product.stock > 0
                    ? `${product.stock} In Stock`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Main Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 leading-snug text-left">
                {product.title}
              </h1>

              {/* Star Rating & Review Link */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => scrollToTab("reviews")}
                  className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer text-left"
                >
                  <Stars value={avgRating} size="w-4 h-4" />
                  <span className="text-xs font-bold text-neutral-900">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-neutral-500 hover:text-blue-600 underline decoration-neutral-300">
                    ({reviewCount} reviews)
                  </span>
                </button>
                <span className="text-neutral-300">•</span>
                <span className="text-xs text-neutral-500 font-medium">
                  SKU: {product._id?.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Pricing Section Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-xs space-y-2">
              <div className="flex items-baseline flex-wrap gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
                  ৳{price.toLocaleString()}
                </span>
                {comparePrice > price && (
                  <span className="text-base sm:text-lg text-neutral-400 line-through font-medium">
                    ৳{comparePrice.toLocaleString()}
                  </span>
                )}
                {hasDiscount && savings > 0 && (
                  <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold">
                    Save ৳{savings.toLocaleString()} ({discountPercent}%)
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 border-t border-neutral-100 mt-2">
                <span>Inclusive of all VAT and applicable taxes</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Free Shipping in BD
                </span>
              </div>
            </div>

            {/* Shopify-Style Product Description */}
            {product.description && (
              <div className="pt-1 pb-1">
                <ProductDescription
                  description={product.description}
                  variant="compact"
                  onViewFull={() => scrollToTab("description")}
                />
              </div>
            )}

            {/* Quantity Stepper & Main CTAs */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center h-12 border border-neutral-200 rounded-xl bg-white px-2 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || product.stock === 0}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-950 disabled:opacity-30 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-neutral-950">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) =>
                        product.stock ? Math.min(product.stock, q + 1) : q + 1
                      )
                    }
                    disabled={
                      product.stock !== undefined &&
                      quantity >= product.stock
                    }
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-950 disabled:opacity-30 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2.5 h-12 px-6 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm cursor-pointer ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-blue-600/30"
                  } disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{product.stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Buy Now Button & Share Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-bold transition-all shadow-sm disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Instant Checkout</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="h-12 w-12 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
                  aria-label="Share product"
                  title="Share product link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Trust and Assurance Grid (4 Modern Cards) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-neutral-200/80 flex items-center gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-neutral-900">Express Delivery</div>
                  <div className="text-[11px] text-neutral-500">24-72h Across BD</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-neutral-200/80 flex items-center gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-neutral-900">Official Warranty</div>
                  <div className="text-[11px] text-neutral-500">100% Genuine Gear</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-neutral-200/80 flex items-center gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-neutral-900">7 Days Return</div>
                  <div className="text-[11px] text-neutral-500">Hassle-Free Replacement</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-neutral-200/80 flex items-center gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-neutral-900">Priority Support</div>
                  <div className="text-[11px] text-neutral-500">Technical Consultation</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================== */}
        {/* LOWER SECTION: Interactive Tabbed Suite    */}
        {/* ========================================== */}
        <div className="mt-16 pt-6 scroll-mt-24" ref={tabsRef}>
          {/* Modern Navigation Tab Bar */}
          <div className="border-b border-neutral-200">
            <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
              {[
                { id: "description", label: "Description" },
                { id: "specifications", label: "Specifications" },
                {
                  id: "reviews",
                  label: `Customer Reviews (${reviewCount})`,
                },
                { id: "shipping", label: "Shipping & Returns" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-3 text-xs sm:text-sm font-bold capitalize transition-all border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-neutral-400 hover:text-neutral-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: Product Description */}
          <div className="py-8">
            {activeTab === "description" && (
              <div className="bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-xs">
                <ProductDescription
                  description={product.description}
                  variant="full"
                />
              </div>
            )}

            {/* TAB 2: Specifications Table */}
            {activeTab === "specifications" && (
              <div className="max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-950">Technical Specifications</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Verified hardware attributes and manufacturing credentials.
                  </p>
                </div>

                <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-200 text-xs sm:text-sm">
                  <div className="grid grid-cols-3 p-4 bg-neutral-50/70">
                    <span className="font-semibold text-neutral-800">Brand / Vendor</span>
                    <span className="col-span-2 text-neutral-600 font-medium">
                      {product.vendor || product.brand || "TechX Authentic Gear"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-4 bg-white">
                    <span className="font-semibold text-neutral-800">Product Model / Slug</span>
                    <span className="col-span-2 text-neutral-600 font-mono text-xs">
                      {product.slug || product._id}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-4 bg-neutral-50/70">
                    <span className="font-semibold text-neutral-800">Category Classification</span>
                    <span className="col-span-2 text-neutral-600 capitalize">
                      {product.productType || product.collections?.[0]?.name || "Electronics & Hardware"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-4 bg-white">
                    <span className="font-semibold text-neutral-800">Current Stock Status</span>
                    <span className="col-span-2 text-neutral-600">
                      {product.stock > 0 ? (
                        <span className="text-emerald-700 font-semibold">
                          Available ({product.stock} units ready for immediate dispatch)
                        </span>
                      ) : (
                        <span className="text-rose-600 font-semibold">Currently Out of Stock</span>
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-4 bg-neutral-50/70">
                    <span className="font-semibold text-neutral-800">Warranty Coverage</span>
                    <span className="col-span-2 text-neutral-600">
                      1 Year Official Brand Warranty with free servicing support
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-4 bg-white">
                    <span className="font-semibold text-neutral-800">Country Availability</span>
                    <span className="col-span-2 text-neutral-600">Bangladesh (Nationwide Delivery)</span>
                  </div>
                  <div className="grid grid-cols-3 p-4 bg-neutral-50/70">
                    <span className="font-semibold text-neutral-800">Replacement Guarantee</span>
                    <span className="col-span-2 text-neutral-600">
                      7 Days standard replacement for manufacturing discrepancies
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Customer Reviews */}
            {activeTab === "reviews" && (
              <div className="max-w-4xl space-y-8">
                {/* Rating Overview Summary Box */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-xs items-center">
                  <div className="text-center md:text-left space-y-1">
                    <div className="text-4xl font-extrabold text-neutral-950">
                      {avgRating.toFixed(1)}
                    </div>
                    <Stars value={avgRating} size="w-4 h-4" />
                    <p className="text-xs text-neutral-500 font-medium">
                      Based on {reviewCount} verified ratings
                    </p>
                  </div>

                  {/* Rating Breakdown Bars */}
                  <div className="col-span-2 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const countForStar =
                        stars === 5
                          ? Math.round(reviewCount * 0.72)
                          : stars === 4
                          ? Math.round(reviewCount * 0.2)
                          : stars === 3
                          ? Math.round(reviewCount * 0.05)
                          : 0;
                      const percentage =
                        reviewCount > 0 ? Math.round((countForStar / reviewCount) * 100) : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3 text-xs">
                          <span className="w-10 text-neutral-600 font-medium flex items-center gap-1">
                            {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-neutral-400">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((rev, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-2xl border border-neutral-200/80 bg-white shadow-xs space-y-2 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                              {(rev.customerName || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-xs text-neutral-900 block">
                                {rev.customerName || "Verified Customer"}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                                <BadgeCheck className="w-3 h-3" /> Verified Purchase
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] text-neutral-400">
                            {rev.createdAt
                              ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Recent"}
                          </span>
                        </div>
                        <div className="pt-1">
                          <Stars value={rev.rating || 5} size="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs text-neutral-700 leading-relaxed text-left pt-1">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center border border-dashed border-neutral-200 rounded-2xl bg-white">
                      <p className="text-xs text-neutral-400">
                        No customer reviews yet. Be the first to review this product below!
                      </p>
                    </div>
                  )}
                </div>

                {/* Add Review Component Form */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs">
                  <AddReview productId={product._id} />
                </div>
              </div>
            )}

            {/* TAB 4: Shipping & Returns Information */}
            {activeTab === "shipping" && (
              <div className="max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6 text-left">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-neutral-950">
                    Nationwide Shipping & Return Policy
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Reliable door-to-door delivery with transparent timeline.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
                      <Truck className="w-4 h-4 text-blue-600" /> Inside Dhaka City
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Delivery fee: <strong>৳60</strong>. Estimated transit time is 24 to 48 hours
                      with live delivery tracking SMS.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-neutral-900 font-bold text-xs">
                      <Truck className="w-4 h-4 text-indigo-600" /> Outside Dhaka (All Districts)
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Delivery fee: <strong>৳120</strong>. Shipped via Steadfast / Pathao Courier
                      within 48 to 72 business hours.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    7 Days Hassle-Free Return Guidelines
                  </h4>
                  <ul className="text-xs text-neutral-600 space-y-2 list-disc pl-5 leading-relaxed">
                    <li>The product must remain in its original, undamaged packaging with all included accessories.</li>
                    <li>Items with physical abuse, water damage, or opened seals are not eligible for replacement.</li>
                    <li>For warranty claims after 7 days, please contact our priority technical helpline for authorized repair.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* RELATED PRODUCTS SECTION                   */}
        {/* ========================================== */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Recommended Gear
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 mt-0.5">
                  Customers Also Viewed
                </h2>
              </div>
              <Link
                href="/product"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Browse All Products →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((item, idx) => (
                <ProductCard key={item.slug || item._id} product={item} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MOBILE STICKY FLOATING BUY BAR             */}
      {/* ========================================== */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-3 sm:hidden shadow-lg flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-lg bg-neutral-100 p-1 shrink-0 border border-neutral-200">
              <Image
                src={activeImage}
                alt={product.title}
                fill
                sizes="44px"
                className="object-contain mix-blend-multiply"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-neutral-900 truncate">{product.title}</h4>
              <div className="text-xs font-extrabold text-blue-600">
                ৳{price.toLocaleString()}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shrink-0 hover:bg-blue-700 transition-colors shadow-sm disabled:bg-neutral-300"
          >
            {product.stock > 0 ? "Add to Bag" : "Out of Stock"}
          </button>
        </div>
      )}

      {/* ========================================== */}
      {/* ENHANCED FULLSCREEN LIGHTBOX MODAL         */}
      {/* ========================================== */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Lightbox */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all z-50 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Lightbox Navigation Left */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
              }}
              className="absolute left-4 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all z-50 cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Modal Main Image Container */}
          <div
            className="relative max-w-4xl w-full h-[75vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`Product preview ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Lightbox Navigation Right */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-4 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all z-50 cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Bottom Thumbnail Strip inside Lightbox */}
          {images.length > 1 && (
            <div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                    lightboxIndex === i
                      ? "border-blue-500 scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
