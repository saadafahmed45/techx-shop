"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Loader2,
  ArrowRight,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function ProductsFilterTabs() {
  const [products, setProducts] =
    useState([]);

  const [collections, setCollections] =
    useState([]);

  const [activeCollection, setActiveCollection] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  // =========================================
  // FETCH
  // =========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productRes,
          collectionRes,
        ] = await Promise.all([
          fetch(`${API}/products`),
          fetch(`${API}/collections`),
        ]);

        const productData =
          await productRes.json();

        const collectionData =
          await collectionRes.json();

        setProducts(
          Array.isArray(productData)
            ? productData
            : []
        );

        setCollections(
          Array.isArray(collectionData)
            ? collectionData
            : []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================================
  // FILTER PRODUCTS
  // =========================================

  const filteredProducts =
    useMemo(() => {
      let filtered =
        activeCollection ===
        "All"
          ? products
          : products.filter(
              (product) =>
                product.collections?.some(
                  (col) =>
                    col.name ===
                    activeCollection
                )
            );

      // ONLY 4 PRODUCTS
      return filtered.slice(0, 5);
    }, [
      products,
      activeCollection,
    ]);

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-black" />
      </div>
    );
  }

  return (
    <section className="bg-[#f5f5f7] py-20 px-4 md:px-32 overflow-hidden">

      <div className=" mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="text-center max-w-3xl mx-auto">

          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-black leading-tight">
            Explore Our Premium
            Gear
          </h2>

          <p className="mt-3 text-slate-500 text-lg leading-relaxed">
            Top-rated tech and
            lifestyle essentials to
            power your day.
          </p>

           <div className="w-16 h-1 bg-indigo-500 mx-auto mt-2 rounded-full" />
{/* 
          <Link
            href="/products"
            className="inline-flex items-center gap-2 mt-8 h-13 px-8 rounded-2xl bg-black text-white font-semibold hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Shop Now

            <ArrowRight className="w-4 h-4" />
          </Link> */}
        </div>

        {/* ======================================
            FILTER BUTTONS
        ====================================== */}

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">

          <button
            onClick={() =>
              setActiveCollection(
                "All"
              )
            }
            className={`px-6 h-11 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeCollection ===
              "All"
                ? "bg-black text-white shadow-lg"
                : "bg-white text-slate-600 hover:bg-black hover:text-white"
            }`}
          >
            All
          </button>

          {collections.map(
            (collection) => (
              <button
                key={
                  collection._id
                }
                onClick={() =>
                  setActiveCollection(
                    collection.name
                  )
                }
                className={`px-6 h-11 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCollection ===
                  collection.name
                    ? "bg-black text-white shadow-lg"
                    : "bg-white text-slate-600 hover:bg-black hover:text-white"
                }`}
              >
                {
                  collection.name
                }
              </button>
            )
          )}
        </div>

        {/* ======================================
            PRODUCTS
        ====================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-16">

          {filteredProducts.map(
            (product) => (
              <div
                key={product._id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-500"
              >

                {/* IMAGE */}
                <div className="relative overflow-hidden bg-slate-100">

                  <img
                    src={
                      product
                        .images?.[0] ||
                      "/placeholder.png"
                    }
                    alt={
                      product.title
                    }
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition duration-700"
                  />

                  {/* TYPE */}
                  {product.productType && (
                    <span className="absolute top-4 right-4 bg-black text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full">
                      {
                        product.productType
                      }
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4 md:p-5">
            <Link href={`/product/${product._id}`} className="transition-colors duration-300 hover:text-slate-700">
             <h3 className="text-sm md:text-lg font-bold text-slate-900 line-clamp-2 leading-snug">
                {product.title}
               </h3>
            </Link>

                  <div className="mt-4 flex items-center justify-between">

                    <span className="text-lg md:text-xl font-black text-blue-700">
                      $
                      {Number(
                        product.price
                      ).toFixed(
                        2
                      )}
                    </span>

                    {product
                      .collections?.[0] && (
                      <span className="hidden md:flex text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                        {
                          product
                            .collections[0]
                            .name
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* ======================================
            SEE ALL BUTTON
        ====================================== */}

        <div className="flex justify-center mt-14">

          <Link
            href="/product"
            className="inline-flex items-center gap-2 h-13 px-8 rounded-2xl border border-slate-300 bg-white text-black font-semibold hover:bg-black hover:text-white transition-all duration-300"
          >
            See All Products

            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}