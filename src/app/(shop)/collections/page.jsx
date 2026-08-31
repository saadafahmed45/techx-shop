import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Layers, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://techx-server-tau.vercel.app";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://techx-shop.vercel.app";

export const metadata = {
  title: "Curated Tech Collections & Categories | TechX Shop Bangladesh",
  description:
    "Explore top tech collections at TechX Shop: Keyboards, Gaming Mice, Audio Devices, PC Hardware, Smart Gadgets, and Accessories. Shop authentic tech in Bangladesh.",
  keywords: [
    "tech collections",
    "electronics categories",
    "gaming gear categories",
    "computer parts bangladesh",
    "TechX shop collections",
  ],
  alternates: {
    canonical: "/collections",
  },
  openGraph: {
    title: "Curated Tech Collections & Categories | TechX Shop",
    description:
      "Discover handpicked electronics, gaming gear, PC components, and audio equipment by category at TechX Shop.",
    url: `${SITE_URL}/collections`,
    type: "website",
  },
};

async function getCollections() {
  try {
    const res = await fetch(`${API}/collections`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : json?.data || [];
  } catch {
    return [];
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "TechX Shop Collections & Categories",
    description: "Curated tech product collections available at TechX Shop Bangladesh.",
    url: `${SITE_URL}/collections`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Collections",
          item: `${SITE_URL}/collections`,
        },
      ],
    },
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Departments</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            Browse All Collections
          </h1>
          <p className="text-sm text-neutral-600 mt-2">
            Explore our carefully organized categories for high-performance PC components, gaming gear, audio equipment, and authentic accessories.
          </p>
        </div>

        {/* Collections Grid */}
        {collections.length === 0 ? (
          <div className="text-center py-16 border border-neutral-200 rounded-2xl bg-neutral-50">
            <Layers className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-neutral-800">
              Collections will be listed here soon
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              In the meantime, explore our full product catalog.
            </p>
            <Link
              href="/product"
              className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {collections.map((cat) => (
              <Link
                key={cat._id || cat.slug}
                href={`/product?category=${cat.slug || cat.name}`}
                className="group flex flex-col bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200/80 rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:border-neutral-300"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-neutral-200/60 mb-4">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-medium text-neutral-400">
                      {cat.name}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-1">
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h2>
                    <span className="text-[11px] text-neutral-500">Explore Collection</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}