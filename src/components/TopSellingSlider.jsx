"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useShopData } from "@/context/ShopDataContext";
import ProductCard from "@/components/ProductCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import {
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiShoppingCart,
} from "react-icons/fi";

import "swiper/css";
import "swiper/css/navigation";

export default function TopSellingSlider() {
  const { products: allProducts, loading } = useShopData();

  // Top Selling Products
  const topSellingProducts = useMemo(() => {
    const active = allProducts.filter(
      (product) =>
        product &&
        product.status === "active" &&
        Array.isArray(product.featured)
    );
    return active.filter((product) =>
      product.featured?.includes("Top Selling Products")
    );
  }, [allProducts]);

  return (
    <section className="relative overflow-hidden  px-4 md:px-32 bg-[#f7f8fc] py-18">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,#d1d5db_1px,transparent_1px)] bg-size-[28px_28px]" />
      </div>

      <div className="relative z-10 mx-auto   px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="relative overflow-hidden rounded-4xl bg-white p-8 shadow-lg lg:p-12">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-100 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center gap-10 lg:flex-row">
              {/* TEXT */}
              <div className="flex-1">
                <span className="mb-4 inline-block rounded-full bg-black px-4 py-1 text-sm font-medium text-white">
                  New Arrival
                </span>

                <h2 className="text-4xl font-extrabold leading-tight text-black md:text-5xl">
                 Sony Headphones 
                  <br />
                  Special Offer
                </h2>

                <p className="mt-4 text-lg text-gray-500">
                  Sony WH-1000XM4 Wireless Noise-Canceling Headphones
                </p>

                <div className="mt-8">
                  <p className="text-sm uppercase tracking-[4px] text-gray-400">
                    Starting At
                  </p>

                  <h3 className="mt-2 text-5xl font-bold text-black">
                    $1,750
                  </h3>
                </div>

                <button className="mt-8 rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
                  Shop Now
                </button>
              </div>

              {/* IMAGE */}
              <div className="relative h-80 w-full flex-1">
                <Image
                  src="https://images.pexels.com/photos/29581125/pexels-photo-29581125.jpeg"
                  alt="TV"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="rounded-2xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            {/* HEADER */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-black md:text-4xl">
                  Top Selling Products
                </h2>

                <p className="mt-2 text-gray-500">
                  Top selling products for your store
                </p>
              </div>

              {/* NAVIGATION */}
              <div className="flex items-center gap-3">
                <button className="custom-prev flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white transition hover:bg-black hover:text-white">
                  <FiChevronLeft size={22} />
                </button>

                <button className="custom-next flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white transition hover:bg-black hover:text-white">
                  <FiChevronRight size={22} />
                </button>
              </div>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-87.5 animate-pulse rounded-3xl bg-white"
                  />
                ))}
              </div>
            ) : topSellingProducts.length === 0 ? (
              <div className="flex h-75 items-center justify-center rounded-3xl bg-white shadow">
                <p className="text-lg text-gray-500">
                  No top selling products found
                </p>
              </div>
            ) : (
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation={{
                  prevEl: ".custom-prev",
                  nextEl: ".custom-next",
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={topSellingProducts.length > 3}
                spaceBetween={20}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  640: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
              >
                {topSellingProducts.map((product, i) => (
                  <SwiperSlide key={product._id} className="py-4">
                    <ProductCard product={product} index={i} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}