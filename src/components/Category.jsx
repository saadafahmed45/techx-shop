import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getCategories() {
  try {
    const res = await fetch(`${API}/collections`, {
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : json?.data || [];
  } catch {
    return [];
  }
}

export default async function Category() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-white border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Browse by Department
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mt-1">
              Curated Categories
            </h2>
          </div>
          <Link
            href="/product"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 transition-colors group self-start md:self-auto"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Minimalist Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat._id || cat.slug}
              href={`/product?category=${cat.slug || cat.name}`}
              className="group flex flex-col bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/80 rounded-xl p-3 transition-all duration-300 hover:border-neutral-300"
            >
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white border border-neutral-200/50 mb-3">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                    {cat.name}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-semibold text-neutral-900 truncate">
                  {cat.name}
                </span>
                <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
