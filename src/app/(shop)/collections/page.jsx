import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Layers, Sparkles } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://techx-server-tau.vercel.app";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://techx-shop.vercel.app";

export const metadata = {
  title: "Explore Tech Categories & Collections | TechX Shop Bangladesh",
  description:
    "Discover authentic gaming gear, mechanical keyboards, studio-grade audio, PC hardware, and premium accessories categorized for your ultimate tech setup.",
  keywords: [
    "tech collections",
    "electronics categories",
    "gaming gear categories",
    "computer parts bangladesh",
    "TechX shop collections",
    "mechanical keyboards bd",
  ],
  alternates: {
    canonical: "/collections",
  },
  openGraph: {
    title: "Explore Tech Categories & Collections | TechX Shop",
    description:
      "Discover authentic gaming gear, mechanical keyboards, audio equipment, and PC components by category at TechX Shop.",
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
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3.5 shadow-2xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Curated Tech Lineup</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight">
            Explore All Categories
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-3 leading-relaxed max-w-xl mx-auto">
            Find everything from high-performance PC components and custom mechanical keyboards to studio audio gear and authentic daily tech essentials.
          </p>
        </div>

        {/* Collections Grid */}
        {collections.length === 0 ? (
          <div className="text-center py-16 px-6 border border-neutral-200/80 rounded-2xl bg-neutral-50/80 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Layers className="w-7 h-7 text-neutral-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">
              No Categories Available Right Now
            </h3>
            <p className="text-sm text-neutral-500 mt-1.5 leading-normal">
              We're currently reorganizing our product departments. In the meantime, browse our complete inventory.
            </p>
            <Link
              href="/product"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/20"
            >
              <span>Browse All Products</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {collections.map((cat) => (
              <Link
                key={cat._id || cat.slug}
                href={`/product?category=${cat.slug || cat.name}`}
                className="group flex flex-col bg-neutral-50 hover:bg-white border border-neutral-200/80 hover:border-indigo-300 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
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
                    <h2 className="text-base font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h2>
                    <span className="text-xs text-neutral-500 font-medium">Browse Collection</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors shrink-0 shadow-2xs">
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