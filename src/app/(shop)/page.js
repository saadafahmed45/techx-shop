import { Suspense } from "react";
import Category from "@/components/Category";
import HeroSlider from "@/components/HeroSlider";
import ProductSection from "@/components/ProductSection";
import ProductsFilterTabs from "@/components/ProductsFilterTabs";
import TopSellingSlider from "@/components/TopSellingSlider";

function SectionFallback({ height = "h-64" }) {
  return (
    <div className={`${height} bg-slate-50 animate-pulse rounded-2xl mx-5 md:mx-32 my-8`} />
  );
}

export default function Home() {
  return (
    <div>
      <Suspense fallback={<SectionFallback height="h-[55vw] max-h-[88vh]" />}>
        <HeroSlider />
      </Suspense>

      <Suspense fallback={<SectionFallback height="h-96" />}>
        <Category />
      </Suspense>

      <Suspense fallback={<SectionFallback height="h-96" />}>
        <ProductSection
          title="Trending Products"
          filterValue="Trending Now"
          bgColor="bg-white"
          accentColor="bg-indigo-500"
        />
      </Suspense>

      <Suspense fallback={<SectionFallback height="h-96" />}>
        <ProductSection
          title="Featured Products"
          filterValue="Featured"
          bgColor="bg-slate-50"
          accentColor="bg-indigo-500"
        />
      </Suspense>

      <Suspense fallback={<SectionFallback height="h-96" />}>
        <ProductsFilterTabs />
      </Suspense>

      <Suspense fallback={<SectionFallback height="h-80" />}>
        <TopSellingSlider />
      </Suspense>
    </div>
  );
}
