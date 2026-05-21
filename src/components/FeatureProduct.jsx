"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  AiFillStar,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";

import {
  HiArrowRight,
  HiOutlineShoppingBag,
} from "react-icons/hi";

import {
  TbHeadphones,
  TbDeviceMobile,
  TbDeviceWatch,
  TbEar,
} from "react-icons/tb";

// =======================================
// API
// =======================================

const API =
  process.env.NEXT_PUBLIC_API_URL;

// =======================================
// CATEGORY ICON
// =======================================

const getCategoryIcon = (
  type
) => {
  const t =
    type?.toLowerCase() || "";

  if (
    t.includes("headphone")
  ) {
    return <TbHeadphones />;
  }

  if (
    t.includes("earbud")
  ) {
    return <TbEar />;
  }

  if (
    t.includes("watch")
  ) {
    return <TbDeviceWatch />;
  }

  return <TbDeviceMobile />;
};

// =======================================
// PRODUCT CARD
// =======================================

function ProductCard({
  product,
  index,
}) {
  const [wished, setWished] =
    useState(false);

  const [hovered, setHovered] =
    useState(false);

  const image =
    product.images?.[0] ||
    "https://picsum.photos/500";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 32,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-60px",
      }}
      transition={{
        delay: index * 0.08,
        duration: 0.55,
        ease: "easeOut",
      }}
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100"
      style={{
        boxShadow: hovered
          ? "0 20px 60px rgba(26,58,255,0.12), 0 4px 16px rgba(0,0,0,0.06)"
          : "0 2px 16px rgba(0,0,0,0.05)",

        transform: hovered
          ? "translateY(-4px)"
          : "translateY(0)",

        transition:
          "all 0.35s ease",
      }}
    >
      {/* IMAGE */}
        <Link
          href={`/product/${product._id}`}
        className="relative overflow-hidden   bg-linear-to-b from-[#f0f4ff] to-[#e8eeff]"
        style={{
          aspectRatio:
            "1 / 1",
        }}
      >
        <img
          src={image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{
            transform:
              hovered
                ? "scale(1.06)"
                : "scale(1)",
          }}
        />

        {/* OVERLAY */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, rgba(10,18,80,0.35) 0%, transparent 55%)",

            opacity: hovered
              ? 1
              : 0.4,
          }}
        />

        {/* FEATURED BADGE */}
        {product.featured && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase text-white"
            style={{
              background:
                "linear-gradient(135deg, #1a3aff, #2a4aff)",

              boxShadow:
                "0 2px 10px rgba(26,58,255,0.4)",
            }}
          >
            FEATURED
          </span>
        )}

        {/* WISHLIST */}
        <motion.button
          whileTap={{
            scale: 0.85,
          }}
          onClick={(e) => {
            e.preventDefault();

            setWished(
              !wished
            );
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background:
              "rgba(255,255,255,0.92)",

            backdropFilter:
              "blur(8px)",

            boxShadow:
              "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          {wished ? (
            <AiFillHeart className="text-red-500 text-sm" />
          ) : (
            <AiOutlineHeart className="text-gray-500 text-sm" />
          )}
        </motion.button>

        {/* ADD TO CART */}
        <motion.button
          initial={false}
          animate={{
            y: hovered
              ? 0
              : 12,

            opacity:
              hovered
                ? 1
                : 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-semibold text-white tracking-wide"
          style={{
            background:
              "linear-gradient(135deg, #1a3aff, #2a50ff)",

            boxShadow:
              "0 4px 16px rgba(26,58,255,0.4)",
          }}
        >
          <HiOutlineShoppingBag className="text-sm" />
          Add to Cart
        </motion.button>
      </Link>

      {/* INFO */}
      <div className="flex flex-col gap-1.5 px-4 pt-4 pb-5">
        {/* CATEGORY */}
        <div className="flex items-center gap-1.5">
          <span className="text-blue-500 text-[13px]">
            {getCategoryIcon(
              product.productType
            )}
          </span>

          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#7a8ab0]">
            {product.productType ||
              "PRODUCT"}
          </span>
        </div>

        {/* TITLE */}
        <Link
          href={`/product/${product._id}`}
        >
          <h3 className="text-[17px] font-bold text-gray-900 leading-tight hover:text-blue-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* RATING */}
        {/* <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map(
            (star) => (
              <AiFillStar
                key={star}
                className={`text-[12px] ${
                  star <=
                  Math.round(
                    product
                      .rating
                      ?.average || 0
                  )
                    ? "text-yellow-400"
                    : "text-gray-200"
                }`}
              />
            )
          )}

          <span className="text-[11px] text-gray-400 ml-1">
            {product
              .rating
              ?.average || 0}{" "}
            (
            {product
              .rating
              ?.count || 0}
            )
          </span>
        </div> */}

        {/* DESCRIPTION */}
        {/* <p className="text-[13px] text-gray-500 line-clamp-2 leading-6 mt-1">
          {product.description}
        </p> */}

        {/* PRICE */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
          <span className="text-[20px] font-extrabold text-[#1a3aff]">
            $
            {Number(
              product.price || 0
            ).toFixed(2)}
          </span>

          <Link
            href={`/product/${product._id}`}
            className="flex items-center gap-1 text-[12px] font-semibold text-gray-400 hover:text-blue-600 hover:gap-2 transition-all duration-200"
          >
            Details{" "}
            <HiArrowRight className="text-[13px]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// =======================================
// MAIN COMPONENT
// =======================================

export default function FeaturedProducts() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =======================================
  // FETCH PRODUCTS
  // =======================================

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          const res =
            await fetch(
              `${API}/products`
            );

          const data =
            await res.json();

          if (
            Array.isArray(
              data
            )
          ) {
          setProducts(
  data
    .filter(
      (product) =>
        product.featured
    )
    .slice(0, 6)
);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, []);

  return (
    <section className="py-16 px-4 md:px-12 lg:px-32 md:py-24">
      <div className="mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.55,
          }}
          className="flex flex-col items-center text-center mb-12 md:mb-14"
        >
          <h2 className="text-[36px] md:text-[38px] font-bold text-gray-900 leading-tight">
            Featured Products
          </h2>

          <p className="text-[15px] text-gray-400 mt-2 max-w-sm leading-relaxed">
            Engineered for
            precision.
            Designed for
            you.
          </p>

          <motion.div
            initial={{
              scaleX: 0,
            }}
            whileInView={{
              scaleX: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.3,
              duration: 0.6,
            }}
            className="mt-5 h-0.75 w-14 rounded-full origin-center"
            style={{
              background:
                "linear-gradient(90deg, #1a3aff, #7a9fff)",
            }}
          />
        </motion.div>

        {/* PRODUCTS */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {Array.from({
              length: 6,
            }).map(
              (_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-100" />

                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />

                    <div className="h-4 bg-gray-100 rounded w-3/4" />

                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {products.map(
              (
                product,
                i
              ) => (
                <ProductCard
                  key={
                    product._id
                  }
                  product={
                    product
                  }
                  index={i}
                />
              )
            )}
          </div>
        )}

        {/* BUTTON */}
        <motion.div
          initial={{
            opacity: 0,
            y: 16,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.5,
            duration: 0.45,
          }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/product"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-[13px] font-semibold text-white tracking-wide transition-all duration-300"
            style={{
              background:
                "linear-gradient(135deg, #1a3aff 0%, #2a50ff 100%)",

              boxShadow:
                "0 4px 20px rgba(26,58,255,0.25)",
            }}
          >
            Browse All Products

            <HiArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}