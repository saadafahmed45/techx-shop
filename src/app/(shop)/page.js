import { Suspense } from "react";
import Category from "@/components/Category";
import HeroSlider from "@/components/HeroSlider";
import ProductSection from "@/components/ProductSection";
import ProductsFilterTabs from "@/components/ProductsFilterTabs";
import TopSellingSlider from "@/components/TopSellingSlider";
import PromoBanner from "@/components/PromoBanner";
import WhyTechX from "@/components/WhyTechX";
import FadeIn from "@/components/FadeIn";

export const metadata = {
  title: "TechX Shop | #1 Online Tech, Electronics & Gadgets Store Bangladesh",
  description:
    "Shop authentic tech gadgets, mechanical keyboards, gaming mice, headphones, PC components, and smart electronics with fast nationwide delivery at TechX Shop Bangladesh.",
  alternates: {
    canonical: "/",
  },
};

function SectionFallback({ height = "h-72" }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10`}>
      <div className={`${height} bg-neutral-100 animate-pulse rounded-2xl`} />
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. Hero — no fade, loads first */}
      <Suspense fallback={<SectionFallback height="h-96" />}>
        <HeroSlider />
      </Suspense>

      {/* 2. Curated Categories */}
      <FadeIn>
        <Suspense fallback={<SectionFallback height="h-64" />}>
          <Category />
        </Suspense>
      </FadeIn>

      {/* 3. Featured Products */}
      <FadeIn delay={80}>
        <Suspense fallback={<SectionFallback height="h-96" />}>
          <ProductSection
            title="Featured Products"
            subtitle="Handpicked Selection"
            filterValue="Featured"
            bgColor="bg-white"
          />
        </Suspense>
      </FadeIn>

      {/* 4. Promotional Banner */}
      <FadeIn direction="none" duration={900}>
        <PromoBanner />
      </FadeIn>

      {/* 5. Trending Now */}
      <FadeIn delay={80}>
        <Suspense fallback={<SectionFallback height="h-96" />}>
          <ProductSection
            title="Trending Now"
            subtitle="Most Popular Gear"
            filterValue="Trending Now"
            bgColor="bg-white"
          />
        </Suspense>
      </FadeIn>

      {/* 6. Filter Tabs */}
      <FadeIn delay={100}>
        <Suspense fallback={<SectionFallback height="h-96" />}>
          <ProductsFilterTabs />
        </Suspense>
      </FadeIn>

      {/* 7. Top Selling Carousel */}
      <FadeIn delay={80}>
        <Suspense fallback={<SectionFallback height="h-80" />}>
          <TopSellingSlider />
        </Suspense>
      </FadeIn>

      {/* 8. Why TechX */}
      <FadeIn delay={120} duration={800}>
        <WhyTechX />
      </FadeIn>
    </div>
  );
}
