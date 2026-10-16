import { Suspense } from "react";
import FeaturesBar from "@/components/FeaturesBar";
import CategoryGrid from "@/components/CategoryGrid";
import ProductSection from "@/components/ProductSection";
import PromoBanner from "@/components/PromoBanner";
import FeaturedCollections from "@/components/FeaturedCollections";
import WhyTechX from "@/components/WhyTechX";
import FadeIn from "@/components/FadeIn";
import ProductsFilterTabs from "@/components/ProductsFilterTabs";
import HeroSlider from "@/components/HeroSlider";

const API = process.env.NEXT_PUBLIC_API_URL || "https://techx-server-tau.vercel.app";

export const metadata = {
  title: "TechX Shop | #1 Online Tech, Electronics & Gadgets Store",
  description:
    "Discover authentic tech gadgets, mechanical keyboards, headphones, smartwatches, travel gear and lifestyle accessories with fast delivery at TechX Shop.",
  alternates: {
    canonical: "/",
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

async function getHeroSliders() {
  try {
    const res = await fetch(`${API}/hero-sliders`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

function SectionFallback({ height = "h-72" }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className={`${height} bg-neutral-100 animate-pulse rounded-2xl`} />
    </div>
  );
}

export default async function Home() {
  const [collections, heroSliders] = await Promise.all([
    getCollections(),
    getHeroSliders(),
  ]);

  return (
    <div className="flex flex-col bg-white">

      {/* 1. Hero Banner — Dynamic showcase */}
      <HeroSlider initialSlides={heroSliders} />

      {/* 2. Trust Bar — Value Propositions (Free Shipping, Returns, Support) */}
      <FeaturesBar />

      {/* 3. Shop by Category — Dynamic collections from database */}
      <FadeIn delay={60}>
        <Suspense fallback={<SectionFallback height="h-64" />}>
          <CategoryGrid initialCollections={collections} />
        </Suspense>
      </FadeIn>

      {/* 4. Best Sellers — Top performing products */}
      <FadeIn delay={80}>
        <Suspense fallback={<SectionFallback height="h-96" />}>
          <ProductSection
            eyebrow="COMMUNITY PICKS"
            title="Best Sellers"
            filterValue="Featured"
            viewAllLink="/product?sort=featured"
            viewAllText="VIEW ALL"
          />
        </Suspense>
      </FadeIn>

      {/* 5. New Arrivals — Latest gear with "New" badges */}
      <FadeIn delay={80}>
        <Suspense fallback={<SectionFallback height="h-96" />}>
          <ProductSection
            eyebrow="JUST ARRIVED"
            title="New Arrivals"
            filterValue="New Arrivals"
            viewAllLink="/product?sort=newest"
            viewAllText="VIEW ALL"
            isNewArrivals={true}
          />
        </Suspense>
      </FadeIn>

      {/* 6. Promotional Banner — Flagship showcase */}
      <FadeIn direction="none" duration={700}>
        <PromoBanner />
      </FadeIn>

      {/* 7. Explore All Products — Interactive category tabs with real data */}
      <ProductsFilterTabs />

      {/* 8. Featured Collections — Tech Essentials & Travel Collection split cards */}
      <FadeIn delay={80}>
        <FeaturedCollections />
      </FadeIn>

      {/* 9. Why Shop With TechX? — Trust & Warranty Pillars */}
      <FadeIn delay={100} duration={800}>
        <WhyTechX />
      </FadeIn>

    </div>
  );
}
