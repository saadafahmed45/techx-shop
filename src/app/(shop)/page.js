import { Suspense } from "react";
import HeroModern from "@/components/HeroModern";
import FeaturesBar from "@/components/FeaturesBar";
import CategoryGrid from "@/components/CategoryGrid";
import ProductSection from "@/components/ProductSection";
import FlashSaleBanner from "@/components/FlashSaleBanner";
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
      {/* 1. Hero — Dynamic showcase */}
      <HeroSlider initialSlides={heroSliders} />
      {/* <HeroModern /> */}
      {/* 2. Value Propositions Bar (Free Shipping, Returns, Checkout, Support) */}
      <FeaturesBar />

      {/* 3. Shop by Category (Dynamic collections from database) */}
      <FadeIn delay={60}>
        <Suspense fallback={<SectionFallback height="h-64" />}>
          <CategoryGrid initialCollections={collections} />
        </Suspense>
      </FadeIn>

<ProductsFilterTabs/>

      {/* 4. Featured Products (Card grid with discount badges, ratings, full-width blue CTA) */}
      <FadeIn delay={80}>
        <Suspense fallback={<SectionFallback height="h-96" />}>
          <ProductSection
            title="Featured Products"
            filterValue="Featured"
            viewAllLink="/product?sort=featured"
            viewAllText="View All Products"
          />
        </Suspense>
      </FadeIn>

      {/* 5. Flash Sale Banner (Dark high-tech countdown timer + glowing visual) */}
      <FadeIn direction="none" duration={700}>
        <FlashSaleBanner />
      </FadeIn>


      {/* 7. New Arrivals (Latest gear with "New" badges) */}
      <FadeIn delay={80}>
        <Suspense fallback={<SectionFallback height="h-96" />}>
          <ProductSection
            title="New Arrivals"
            filterValue="New Arrivals"
            viewAllLink="/product?sort=newest"
            viewAllText="View All"
            isNewArrivals={true}
          />
        </Suspense>
      </FadeIn>

      {/* 6. Featured Collections (Tech Essentials & Travel Collection split cards) */}
      <FadeIn delay={80}>
        <FeaturedCollections />
      </FadeIn>
      {/* 7. Top Selling Products */}
      <FadeIn delay={80}>
        <Suspense fallback={<SectionFallback height="h-96" />}>
          <ProductSection
            title="Top Selling Products"
            filterValue="Top Selling Products"
            viewAllLink="/product?sort=newest"
            viewAllText="View All"
            isNewArrivals={true}
          />
        </Suspense>
      </FadeIn>
      {/* 8. Why TechX (Trust & Warranty Pillars) */}
      <FadeIn delay={100} duration={800}>
        <WhyTechX />
      </FadeIn>
    </div>
  );
}
