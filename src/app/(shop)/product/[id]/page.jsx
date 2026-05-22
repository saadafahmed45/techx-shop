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
} from "react-icons/hi";
import AddReview from "@/components/AddReview";
import AddToCartButton from "@/components/AddToCartButton";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const reviewsData = [
  {
    id: 1,
    name: "Arian",
    rating: 5,
    comment:
      "Premium quality product. Fabric and finishing both are amazing.",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Rahim",
    rating: 4,
    comment:
      "Product quality is very good and delivery was fast.",
    date: "5 days ago",
  },
  {
    id: 3,
    name: "Sakib",
    rating: 5,
    comment:
      "Exactly same as picture. Highly recommended.",
    date: "1 week ago",
  },
];

const ProductDetailsPage = () => {
  const params = useParams();

  const id = params.id;

  const [product, setProduct] =
    useState(null);

  const [relatedProducts, setRelatedProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [wished, setWished] =
    useState(false);

  const [activeImage, setActiveImage] =
    useState("");

  // =========================
  // LOAD PRODUCT
  // =========================
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // PRODUCT
        const res = await fetch(
          `${API}/products/${id}`
        );

        const p = await res.json();

        setProduct(p);

        setActiveImage(
          p.images?.[0] ||
            "https://via.placeholder.com/600"
        );

        // ALL PRODUCTS
        const allRes = await fetch(
          `${API}/products`
        );

        const allProducts =
          await allRes.json();

        // RELATED
        const related =
          allProducts.filter(
            (item) =>
              item._id !== p._id &&
              item.collections?.some(
                (col) =>
                  p.collections?.some(
                    (pc) =>
                      pc._id === col._id
                  )
              )
          );

        setRelatedProducts(
          related.slice(0, 4)
        );
      } catch (error) {
        console.error(
          "Error fetching data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc]">
        <div className="animate-pulse text-lg font-semibold">
          Loading Product...
        </div>
      </div>
    );
  }

  // =========================
  // NOT FOUND
  // =========================
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product Not Found
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : [
          "https://via.placeholder.com/600",
        ];

  return (
    <div className="bg-[#f7f8fc] min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link
            href="/"
            className="hover:text-black"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/product"
            className="hover:text-black"
          >
            Products
          </Link>

          <span>/</span>

          <span className="text-gray-900 font-medium line-clamp-1">
            {product.title}
          </span>
        </div>

        {/* TOP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-4xl p-5 md:p-10 border border-gray-100">

          {/* LEFT */}
          <div>

            {/* MAIN IMAGE */}
            <div className="rounded-[28px] overflow-hidden bg-gray-100 border border-gray-100">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {images.map(
                (img, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setActiveImage(
                        img
                      )
                    }
                    className={`w-24 h-24 rounded-2xl overflow-hidden border-2 shrink-0 ${
                      activeImage === img
                        ? "border-blue-600"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumb"
                      className="w-full h-full object-cover"
                    />
                  </button>
                )
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col">

            {/* TITLE */}
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  {product.vendor ||
                    "Brand"}
                </p>

                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mt-2 leading-tight">
                  {product.title}
                </h1>
              </div>

              <button
                onClick={() =>
                  setWished(
                    !wished
                  )
                }
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
              >
                {wished ? (
                  <AiFillHeart className="text-red-500 text-xl" />
                ) : (
                  <AiOutlineHeart className="text-gray-400 text-xl" />
                )}
              </button>
            </div>

            {/* RATING */}
            <div className="flex items-center gap-2 mt-5">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <AiFillStar
                      key={star}
                      className={`text-lg ${
                        star <=
                        Math.round(
                          product.rating
                            ?.average ||
                            4
                        )
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  )
                )}
              </div>

              <span className="text-gray-600 text-sm">
                {product.rating
                  ?.average || 4.8}
              </span>

              <span className="text-gray-400">
                •
              </span>

              <span className="text-gray-500 text-sm">
                {product.rating
                  ?.count || 124}{" "}
                Reviews
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-7 flex items-end gap-3">
              <h2 className="text-5xl font-black text-blue-600">
                $
                {Number(
                  product.price || 0
                ).toFixed(2)}
              </h2>

              <span className="text-gray-400 line-through text-lg">
                $
                {(
                  Number(
                    product.price || 0
                  ) + 120
                ).toFixed(2)}
              </span>
            </div>

            {/* STOCK */}
            <div className="mt-5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />

              <span className="text-sm font-medium text-green-600">
                In Stock (
                {product.stock || 0}
                )
              </span>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Description
              </h3>

              <p className="text-gray-600 leading-8">
                {product.description}
              </p>
            </div>

            {/* COLLECTIONS */}
            <div className="flex flex-wrap gap-2 mt-7">
              {product.collections?.map(
                (collection) => (
                  <span
                    key={
                      collection._id
                    }
                    className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold"
                  >
                    {collection.name}
                  </span>
                )
              )}
            </div>

            {/* FEATURES */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-[#f7f8fc] rounded-2xl p-4 flex items-center gap-3">
                <HiOutlineTruck className="text-2xl text-blue-600" />

                <div>
                  <p className="font-semibold text-sm">
                    Free Delivery
                  </p>

                  <p className="text-xs text-gray-500">
                    2-5 days delivery
                  </p>
                </div>
              </div>

              <div className="bg-[#f7f8fc] rounded-2xl p-4 flex items-center gap-3">
                <HiOutlineShieldCheck className="text-2xl text-blue-600" />

                <div>
                  <p className="font-semibold text-sm">
                    Secure Payment
                  </p>

                  <p className="text-xs text-gray-500">
                    100% protected
                  </p>
                </div>
              </div>

              <div className="bg-[#f7f8fc] rounded-2xl p-4 flex items-center gap-3">
                <HiOutlineRefresh className="text-2xl text-blue-600" />

                <div>
                  <p className="font-semibold text-sm">
                    Easy Return
                  </p>

                  <p className="text-xs text-gray-500">
                    7 days return
                  </p>
                </div>
              </div>

              <div className="bg-[#f7f8fc] rounded-2xl p-4 flex items-center gap-3">
                <HiOutlineShoppingBag className="text-2xl text-blue-600" />

                <div>
                  <p className="font-semibold text-sm">
                    Premium Quality
                  </p>

                  <p className="text-xs text-gray-500">
                    Export standard
                  </p>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              {/* <button className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-bold text-sm flex-1">
                Add To Cart
              </button> */}
                <AddToCartButton
                  product={product}
                />
              <button className="h-14 px-10 rounded-2xl border border-gray-200 hover:bg-gray-50 transition font-semibold">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-14 bg-white rounded-4xl border border-gray-100 p-6 md:p-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900">
                Customer Reviews
              </h2>

              <p className="text-gray-500 mt-2">
                See what customers are saying
              </p>
            </div>
 <div className="bg-[#f7f8fc] rounded-3xl px-8 py-5 text-center">
      <h3 className="text-5xl font-black text-blue-600">
        {product.rating?.average || 0}
      </h3>

      <div className="flex items-center justify-center gap-1 mt-2">
        {[1, 2, 3, 4, 5].map(
          (star) => (
            <AiFillStar
              key={star}
              className={`text-lg ${
                star <=
                Math.round(
                  product.rating
                    ?.average || 0
                )
                  ? "text-yellow-400"
                  : "text-gray-200"
              }`}
            />
          )
        )}
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Based on{" "}
        {product.rating
          ?.count || 0}{" "}
        reviews
      </p>
    </div>
  </div>

  {/* REVIEW LIST */}
  <div className="space-y-5">
    {product.rating?.reviews
      ?.length > 0 ? (
      product.rating.reviews.map(
        (
          review,
          index
        ) => (
          <div
            key={index}
            className="border border-gray-100 rounded-3xl p-5 hover:shadow-sm transition"
          >
            <div className="flex items-start justify-between gap-4">

              {/* LEFT */}
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
                    {review.customerName
                      ?.charAt(0) ||
                      "U"}
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900">
                      {review.customerName ||
                        "Anonymous User"}
                    </h4>

                    <div className="flex items-center gap-1 mt-1">
                      {[
                        1,
                        2,
                        3,
                        4,
                        5,
                      ].map(
                        (
                          star
                        ) => (
                          <AiFillStar
                            key={
                              star
                            }
                            className={`text-sm ${
                              star <=
                              review.rating
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 leading-7 mt-4">
                  {
                    review.comment
                  }
                </p>
              </div>

              {/* DATE */}
              <span className="text-sm text-gray-400 whitespace-nowrap">
                {new Date(
                  review.createdAt
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        )
      )
    ) : (
      <div className="text-center py-12 bg-[#f7f8fc] rounded-3xl">
        <h3 className="text-lg font-bold text-gray-800">
          No Reviews Yet
        </h3>

        <p className="text-gray-500 mt-2">
          Be the first to review this product
        </p>
      </div>
    )}
    </div>

          {/* ADD REVIEW */}
          <div className="mt-10">
            <AddReview productId={product._id} />
          </div>
        </div>

        {/* RELATED */}
        {relatedProducts.length >
          0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-3xl font-black text-gray-900">
                Related Products
              </h2>

              <Link
                href="/product"
                className="text-blue-600 font-semibold"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map(
                (item) => (
                  <Link
                    key={item._id}
                    href={`/product/${item._id}`}
                    className="group bg-white rounded-[28px] overflow-hidden border border-gray-100 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="overflow-hidden">
                      <img
                        src={
                          item
                            .images?.[0]
                        }
                        alt={
                          item.title
                        }
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                        {item.vendor}
                      </p>

                      <h3 className="font-bold text-gray-900 mt-2 line-clamp-1">
                        {item.title}
                      </h3>

                      <p className="text-blue-600 font-black text-xl mt-3">
                        $
                        {Number(
                          item.price || 0
                        ).toFixed(
                          2
                        )}
                      </p>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;