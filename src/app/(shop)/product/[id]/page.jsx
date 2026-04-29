"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiFillStar, AiOutlineStar, AiOutlineHeart, AiFillHeart,
  AiOutlineCheck, AiOutlineMinus, AiOutlinePlus,
} from "react-icons/ai";
import { HiArrowLeft, HiOutlineShare } from "react-icons/hi";
import { BsBoxSeam } from "react-icons/bs";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";

export default function ProductDetailPage({ params }) {
  // Next.js 15 params handle
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // ইমেজ ক্লিনআপ ফাংশন
  const cleanUrl = (url) => {
    if (!url) return "";
    return url.replace(/[\[\]"\\]/g, "").trim();
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const pRes = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
        const p = await pRes.json();
        
        const allRes = await fetch(`https://api.escuelajs.co/api/v1/products?categoryId=${p.category.id}&limit=10`);
        const all = await allRes.json();

        setProduct(p);
        setRelated(all.filter((item) => item.id !== p.id).slice(0, 4));
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="text-center mt-20">Product not found!</div>;

  const images = product.images.map(img => cleanUrl(img));

  return (
    <main className="min-h-screen bg-[#f7f8fc] pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-10">
            <Breadcrumb customLast={product.title}/>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Images */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100">
              <img 
                src={images[activeImage]} 
                alt={product.title} 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/600`; }}
              />
            </div>
            <div className="flex gap-4">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-blue-600" : "border-transparent"}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-3xl font-bold text-blue-600">${product.price}</p>
            <p className="text-gray-500 leading-relaxed">{product.description}</p>
            <button 
              onClick={() => { setAddedToCart(true); setTimeout(() => setAddedToCart(false), 2000); }}
              className="h-14 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              {addedToCart ? "Added to Cart ✓" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* ── Related Products Section ── */}
        <div className="mt-10 border-t border-gray-200 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
              <p className="text-gray-500 text-sm mt-1">Customers who bought this also looked at these</p>
            </div>
            <Link href="/product" className="text-blue-600 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
           <ProductCard key={item.id} product={item} index={0} />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}