"use client";

import {
  useEffect,
  useState,
  useCallback,
  Suspense,
} from "react";

import Link from "next/link";
import Image from "next/image";
import { useShopData } from "@/context/ShopDataContext";
import { motion } from "framer-motion";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import {
  AiFillStar,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";

import {
  HiOutlineAdjustments,
  HiX,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

import { TbArrowsSort } from "react-icons/tb";

import { BsCheckLg } from "react-icons/bs";

// ========================================
// API
// ========================================

const API =
  process.env.NEXT_PUBLIC_API_URL;

// ========================================
// CONSTANTS
// ========================================

const SORT_OPTIONS = [
  {
    label: "Newest Arrivals",
    value: "newest",
  },
  {
    label: "Price: Low → High",
    value: "price_asc",
  },
  {
    label: "Price: High → Low",
    value: "price_desc",
  },
  {
    label: "Best Rating",
    value: "rating",
  },
];

const PER_PAGE = 8;

// ========================================
// IMAGE
// ========================================

function cleanImg(images) {
  if (
    Array.isArray(images) &&
    images.length > 0
  ) {
    return images[0];
  }

  return "https://picsum.photos/500";
}

// ========================================
// CHECKBOX
// ========================================

function Checkbox({
  label,
  checked,
  onChange,
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer py-1">
      <span
        onClick={onChange}
        className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-150"
        style={{
          border: checked
            ? "none"
            : "1.5px solid #d1d5db",

          background: checked
            ? "#1a3aff"
            : "white",

          boxShadow: checked
            ? "0 0 0 3px rgba(26,58,255,0.12)"
            : "none",
        }}
      >
        {checked && (
          <BsCheckLg className="text-white text-[9px]" />
        )}
      </span>

      <span
        className="text-[13px] transition-colors select-none"
        style={{
          color: checked
            ? "#1a3aff"
            : "#4b5563",

          fontWeight: checked
            ? 600
            : 400,
        }}
      >
        {label}
      </span>
    </label>
  );
}

// ========================================
// PRODUCT CARD
// ========================================

function ProductCard({
  product,
}) {
  const [wished, setWished] =
    useState(false);

  const img = cleanImg(
    product.images
  );

  const averageRating =
    product.rating?.average || 0;

  const totalRating =
    product.rating?.count || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: product.length * 0.05 }}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 flex flex-col"
      style={{
        boxShadow:
          "0 1px 4px rgba(0,0,0,0.06)",
        transition:
          "box-shadow 0.3s, transform 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 12px 40px rgba(26,58,255,0.1)";

        e.currentTarget.style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 1px 4px rgba(0,0,0,0.06)";

        e.currentTarget.style.transform =
          "translateY(0)";
      }}
    >
      <Link
        href={`/product/${product._id}`}
        className="relative block overflow-hidden bg-gray-50"
        style={{
          aspectRatio: "1/1",
        }}
      >
        <Image
          src={img}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <button
          onClick={(e) => {
            e.preventDefault();

            setWished(
              (w) => !w
            );
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white shadow-md"
        >
          {wished ? (
            <AiFillHeart className="text-red-500 text-sm" />
          ) : (
            <AiOutlineHeart className="text-gray-400 text-sm" />
          )}
        </button>
      </Link>

      <div className="flex flex-col gap-1 px-4 pt-3.5 pb-4">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400">
          {product.productType ||
            "General"}
        </p>

        <Link
          href={`/product/${product.slug}`}
        >
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-3 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-0.5">
          {[1, 2, 3, 4, 5].map(
            (s) => (
              <AiFillStar
                key={s}
                className={`text-[11px] ${
                  s <=
                  Math.round(
                    averageRating
                  )
                    ? "text-amber-400"
                    : "text-gray-200"
                }`}
              />
            )
          )}

          <span className="text-[11px] text-gray-400 ml-1">
            {averageRating} (
            {totalRating})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          <span
            className="text-[17px] font-extrabold"
            style={{
              color: "#1a3aff",
            }}
          >
            $
            {Number(
              product.price || 0
            ).toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ========================================
// SKELETON
// ========================================

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {Array.from({
        length: 8,
      }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse"
        >
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

// ========================================
// PAGINATION
// ========================================

function Pagination({
  current,
  total,
  onChange,
}) {
  const pages = [];

  for (
    let i = 1;
    i <= total;
    i++
  ) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() =>
          onChange(current - 1)
        }
        disabled={current === 1}
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center"
      >
        <HiChevronLeft />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() =>
            onChange(p)
          }
          className={`w-9 h-9 rounded-xl text-sm font-medium ${
            current === p
              ? "bg-blue-600 text-white"
              : "border border-gray-200"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() =>
          onChange(current + 1)
        }
        disabled={
          current === total
        }
        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center"
      >
        <HiChevronRight />
      </button>
    </div>
  );
}

// ========================================
// SIDEBAR
// ========================================

function SidebarContent({
  collections,
  brands,
  selectedCategories,
  selectedBrands,
  price,
  setPrice,
  hasFilters,
  toggleParam,
  clearAll,
}) {
  return (
    <div className="flex flex-col gap-7">
      {/* COLLECTION */}
      <div>
        <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">
          Collections
        </h3>

        {collections.map(
          (collection) => (
            <Checkbox
              key={
                collection._id
              }
              label={
                collection.name
              }
              checked={selectedCategories.includes(
                collection.slug
              )}
              onChange={() =>
                toggleParam(
                  "category",
                  collection.slug
                )
              }
            />
          )
        )}
      </div>

      <div className="h-px bg-gray-100" />

      {/* BRAND */}
      <div>
        <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">
          Brand
        </h3>

        {brands.map((brand) => (
          <Checkbox
            key={brand}
            label={brand}
            checked={selectedBrands.includes(
              brand.toLowerCase()
            )}
            onChange={() =>
              toggleParam(
                "brand",
                brand.toLowerCase()
              )
            }
          />
        ))}
      </div>

      <div className="h-px bg-gray-100" />

      {/* PRICE */}
      <div>
        <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">
          Price Range
        </h3>

        <input
          type="range"
          min={0}
          max={5000}
          value={price}
          onChange={(e) =>
            setPrice(
              Number(
                e.target.value
              )
            )
          }
          className="w-full"
        />

        <div className="flex justify-between text-sm mt-2">
          <span>$0</span>

          <span>
            ${price}
          </span>
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-sm text-red-500"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

// ========================================
// INNER PAGE
// ========================================

function ProductPageInner() {
  const { products: allProducts, collections, loading } = useShopData();

  const [filtered, setFiltered] =
    useState([]);

  const [price, setPrice] =
    useState(5000);

  const [sort, setSort] =
    useState("newest");

  const [page, setPage] =
    useState(1);

  const [mobileFilter, setMobileFilter] =
    useState(false);

  const searchParams =
    useSearchParams();

  const router = useRouter();

  const selectedCategories =
    searchParams.getAll(
      "category"
    );

  const selectedBrands =
    searchParams.getAll(
      "brand"
    );

  // ====================================
  // DYNAMIC BRANDS
  // ====================================

  const brands = [
    ...new Set(
      allProducts
        .map((item) =>
          item.vendor?.trim()
        )
        .filter(Boolean)
    ),
  ];

  // ====================================
  // FILTER
  // ====================================
useEffect(() => {
  let tmp = [...allProducts];

  // =========================
  // COLLECTION FILTER
  // =========================
  if (selectedCategories.length) {
    tmp = tmp.filter((product) =>
      product.collections?.some((collection) =>
        selectedCategories.includes(
          collection.slug
        )
      )
    );
  }

  // =========================
  // BRAND FILTER
  // =========================
  if (selectedBrands.length) {
    tmp = tmp.filter((product) =>
      selectedBrands.some((brand) =>
        product.vendor
          ?.toLowerCase()
          .includes(
            brand.toLowerCase()
          )
      )
    );
  }

  // =========================
  // PRICE FILTER
  // =========================
  tmp = tmp.filter(
    (product) =>
      Number(product.price || 0) <=
      price
  );

  // =========================
  // SORTING
  // =========================
  if (sort === "price_asc") {
    tmp.sort(
      (a, b) =>
        Number(a.price || 0) -
        Number(b.price || 0)
    );
  }

  if (sort === "price_desc") {
    tmp.sort(
      (a, b) =>
        Number(b.price || 0) -
        Number(a.price || 0)
    );
  }

  if (sort === "rating") {
    tmp.sort(
      (a, b) =>
        (b.rating?.average || 0) -
        (a.rating?.average || 0)
    );
  }

  if (sort === "newest") {
    tmp.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
  }

  setFiltered(tmp);

  setPage(1);

}, [
  allProducts,
  price,
  sort,
  selectedCategories.join(","),
  selectedBrands.join(","),
]);

  // ====================================
  // TOGGLE PARAM
  // ====================================

  const toggleParam =
    useCallback(
      (key, value) => {
        const params =
          new URLSearchParams(
            searchParams.toString()
          );

        const current =
          params.getAll(key);

        params.delete(key);

        if (
          current.includes(
            value
          )
        ) {
          current
            .filter(
              (v) =>
                v !== value
            )
            .forEach((v) =>
              params.append(
                key,
                v
              )
            );
        } else {
          [
            ...current,
            value,
          ].forEach((v) =>
            params.append(
              key,
              v
            )
          );
        }

        router.push(
          `?${params.toString()}`,
          {
            scroll: false,
          }
        );
      },
      [
        router,
        searchParams,
      ]
    );

  const clearAll =
    useCallback(() => {
      router.push("?");

      setPrice(5000);

      setSort("newest");
    }, [router]);

  // ====================================
  // PAGINATION
  // ====================================

  const totalPages =
    Math.ceil(
      filtered.length /
        PER_PAGE
    );

  const paginated =
    filtered.slice(
      (page - 1) *
        PER_PAGE,
      page * PER_PAGE
    );

  const hasFilters =
    selectedCategories.length >
      0 ||
    selectedBrands.length >
      0 ||
    price < 5000;

  const sidebarProps = {
    collections,
    brands,
    selectedCategories,
    selectedBrands,
    price,
    setPrice,
    hasFilters,
    toggleParam,
    clearAll,
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "#f7f8fc",
      }}
    >
      <div className=" mx-auto px-5 md:px-32 py-14 flex gap-7">
        {/* SIDEBAR */}
        <aside className="hidden md:block w-56 shrink-0 self-start sticky top-20">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <SidebarContent
              {...sidebarProps}
            />
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex-1 min-w-0">
          {/* HEADER */}
          <div className="flex  flex-col md:flex-row items-center justify-between mb-6">
            <div>
              <h1 className="text-[32px] font-extrabold text-gray-900">
                Products
              </h1>

              <p className="text-sm text-gray-400">
                Showing{" "}
                {
                  filtered.length
                }{" "}
                products
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setMobileFilter(
                    true
                  )
                }
                className="md:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white"
              >
                <HiOutlineAdjustments />
                Filters
              </button>

              <div className="relative">
                <TbArrowsSort className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <select
                  value={sort}
                  onChange={(
                    e
                  ) =>
                    setSort(
                      e.target
                        .value
                    )
                  }
                  className="pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm"
                >
                  {SORT_OPTIONS.map(
                    (
                      option
                    ) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* PRODUCTS */}
          {loading ? (
            <SkeletonGrid />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {paginated.map(
                  (
                    product
                  ) => (
                    <ProductCard
                      key={
                        product._id
                      }
                      product={
                        product
                      }
                    />
                  )
                )}
              </div>

              {totalPages >
                1 && (
                <Pagination
                  current={
                    page
                  }
                  total={
                    totalPages
                  }
                  onChange={(
                    p
                  ) =>
                    setPage(p)
                  }
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* MOBILE FILTER */}
      {mobileFilter && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setMobileFilter(
                false
              )
            }
          />

          <div className="relative ml-auto w-72 h-full bg-white flex flex-col">
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100">
              <span className="font-bold">
                Filters
              </span>

              <button
                onClick={() =>
                  setMobileFilter(
                    false
                  )
                }
              >
                <HiX className="text-xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <SidebarContent
                {...sidebarProps}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ProductPageInner />
    </Suspense>
  );
}