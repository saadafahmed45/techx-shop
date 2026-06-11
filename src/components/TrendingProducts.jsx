"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";

import {
  TbHeadphones,
  TbDeviceMobile,
  TbDeviceWatch,
  TbEar,
} from "react-icons/tb";

import { HiOutlineShoppingBag } from "react-icons/hi";

import { useCart } from "@/context/CartContext";
import { ProductCard } from "./FeatureProduct";

const API = process.env.NEXT_PUBLIC_API_URL;

// ============================
// CATEGORY ICON
// ============================

const getCategoryIcon = (type) => {
  const t = type?.toLowerCase() || "";
  if (t.includes("headphone")) return <TbHeadphones />;
  if (t.includes("earbud")) return <TbEar />;
  if (t.includes("watch")) return <TbDeviceWatch />;
  return <TbDeviceMobile />;
};


// ============================
// MAIN COMPONENT
// ============================

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/products`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(
            data.filter(
              (product) =>
                product &&
                product.status === "active" &&
                Array.isArray(product.featured) // ✅ FIX: was product.features
            )
          );
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ FIX: was product.features?.includes — field is "featured"
  const newArrivalsProducts = products.filter((product) =>
    product.featured?.includes("Trending Now")
  );

  return (
    <section className="py-14 md:py-24 px-4 sm:px-6 lg:px-32 bg-slate-50">
      <div className="mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Trending Products
          </h2>
          {/* <p className="text-slate-400 mt-2">Premium picks curated for you</p> */}
          <div className="w-16 h-1 bg-indigo-500 mx-auto mt-5 rounded-full" />
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : newArrivalsProducts.length === 0 ? (
          <p className="text-center text-slate-400 py-16">
            No Trending products found.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {newArrivalsProducts.map((product, i) => (
              <ProductCard
                key={product?._id || i}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}