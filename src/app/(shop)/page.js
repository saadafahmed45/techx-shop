import Category from "@/components/Category";
import FeaturedProducts from "@/components/FeatureProduct";
import HeroBanner from "@/components/HeroBanner";
import HeroSlider from "@/components/HeroSlider";
import ProductSection from "@/components/ProductSection ";
import ProductsFilterTabs from "@/components/ProductsFilterTabs";
import ProductSlider from "@/components/ProductSlider";
import TopSellingSlider from "@/components/TopSellingSlider";
import TrendingProducts from "@/components/TrendingProducts";

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
 {/* <FeaturedProducts/> */}
 <ProductsFilterTabs/>
 <TopSellingSlider/>
  </div>
  );
}
