import Category from "@/components/Category";
import HeroBanner from "@/components/HeroBanner";
import HeroSlider from "@/components/HeroSlider";
import ProductSection from "@/components/ProductSection ";
import ProductsFilterTabs from "@/components/ProductsFilterTabs";
import ProductSlider from "@/components/ProductSlider";
import TopSellingSlider from "@/components/TopSellingSlider";

export default function Home() {
  return (
  <div >
    <HeroSlider/>
 {/* <HeroBanner/> */}
 <Category/>
 {/* <TrendingProducts/> */}
   <ProductSection
        title="Trending Products"
        filterValue="Trending Now"
        bgColor="bg-white"
        accentColor="bg-indigo-500"
      />

       {/* Featured Products */}
      <ProductSection
        title="Featured Products"
        filterValue="Featured"
        bgColor="bg-slate-50"
        accentColor="bg-indigo-500"
      />
 <ProductsFilterTabs/>
 <TopSellingSlider/>
  </div>
  );
}
