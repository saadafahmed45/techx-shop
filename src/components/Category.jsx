import React from "react";
import Image from "next/image";
import Link from "next/link";




// API

const API =
  process.env.NEXT_PUBLIC_API_URL;

// FETCH CATEGORIES
// fetch(`${API}/collections`)

async function getCategories() {
  const res = await fetch(
    `${API}/collections`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const json = await res.json();
  return Array.isArray(json) ? json : (json?.data || []);
}



const Category = async () => {
  const categories = await getCategories();
  return (
    <section className="px-5 md:px-32 py-16 bg-linear-to-b from-gray-50 to-white">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold">
          Featured Categories
        </h1>
        {/* <p className="text-gray-500 mt-3">
          Discover our most popular product categories curated just for you.
        </p> */}
         <div className="w-16 h-1 bg-indigo-500 mx-auto mt-5 rounded-full" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {categories.map((cat) => (
          <Link key={cat._id} href={`/product?category=${cat.slug}`}>
            
            <div className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition duration-300">
              
              {/* Image */}
              <div className="relative w-full h-44 md:h-72">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 p-4 w-full text-white">
                
                {/* Badge */}
                {/* <span className="text-xs bg-white/20 backdrop-blur px-2 py-1 rounded-full">
                  Category
                </span> */}

                <h2 className="text-lg font-semibold mt-2">
                  {cat.name}
                </h2>

                {/* Description (show on hover) */}
                <p className="text-sm opacity-0 group-hover:opacity-100 transition mt-1">
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