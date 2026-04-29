"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export const categories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    image: "https://images.pexels.com/photos/20385205/pexels-photo-20385205.jpeg",
    description: "Explore gadgets and accessories",
  },
  {
    id: 2,
    name: "Clothes",
    slug: "updated-name-1777491150523",
    image: "https://images.pexels.com/photos/6804613/pexels-photo-6804613.jpeg",
    description: "Latest fashion trends",
  },
  {
    id: 3,
    name: "Furniture",
    slug: "furniture",
    image: "https://images.pexels.com/photos/18662969/pexels-photo-18662969.jpeg",
    description: "Decor and essentials for your home",
  },
  {
    id: 4,
    name: "Shoes",
    slug: "shoes",
    image: "https://images.pexels.com/photos/4432469/pexels-photo-4432469.jpeg",
    description: "Comfortable and stylish footwear",
  },
];

const Category = () => {
  return (
    <section className=" mx-auto px-12 bg-gray-50 py-12">
      
      <h1 className="text-3xl md:text-4xl font-bold text-center">
        Featured Categories
      </h1>
      <p className="text-center text-gray-600 mt-3 max-w-xl mx-auto">
        Discover our most popular product categories.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
        
        {categories.map((cat) => (
          <Link key={cat.id} href={`/product?category=${cat.slug}`}>
            <div className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition">
              
              {/* Image */}
              <div className="relative w-full h-72 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
              </div>

              {/* Content */}
              <div className="p-4 text-center">
                <h2 className="font-semibold">{cat.name}</h2>
                <p className="text-sm text-gray-500">
                  {cat.description}
                </p>
              </div>

            </div>
          </Link>
        ))}

      </div>
    </section>
  );
};

export default Category;