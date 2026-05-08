"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const products = [
  {
    id: 1,
    title: "Xiaomi Book Air",
    subtitle: "WITH 2K OLED DISPLAY",
    price: "$950",
    image: "https://images.pexels.com/photos/11790883/pexels-photo-11790883.jpeg", // replace with your image
  },
  {
    id: 2,
    title: "MacBook Pro",
    subtitle: "M3 CHIP POWER",
    price: "$1499",
    image: "https://images.pexels.com/photos/9714547/pexels-photo-9714547.jpeg",
  },
  {
    id: 3,
    title: "Dell XPS 13",
    subtitle: "ULTRA THIN DESIGN",
    price: "$1200",
    image: "https://images.pexels.com/photos/1777023/pexels-photo-1777023.jpeg",
  },
];

export default function ProductSlider() {
  return (
    <div className="w-full bg-gray-100 py-10">
      <div className=" mx-auto relative">

        {/* Custom Arrows */}
        <button className="prev absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white p-2 rounded-full shadow">
          <FiChevronLeft size={20} />
        </button>
        <button className="next absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white p-2 rounded-full shadow">
          <FiChevronRight size={20} />
        </button>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: ".prev",
            nextEl: ".next",
          }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-100"
        >
          {products.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="flex items-center justify-between h-full px-10">

                {/* Left Content */}
                <div className="max-w-md">
                  <h2 className="text-4xl font-bold text-gray-900">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-gray-500">{item.subtitle}</p>

                  <p className="mt-6 text-sm text-gray-400">STARTING AT</p>
                  <h3 className="text-3xl font-semibold text-gray-900">
                    {item.price}
                  </h3>
                </div>

                {/* Right Image */}
                <div className="relative w-125 h-75">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}