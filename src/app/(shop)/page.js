import Category from "@/components/Category";
import FeaturedProducts from "@/components/FeatureProduct";
import HeroBanner from "@/components/HeroBanner";
import HeroSlider from "@/components/HeroSlider";
import ProductsFilterTabs from "@/components/ProductsFilterTabs";
import ProductSlider from "@/components/ProductSlider";
import TopSellingSlider from "@/components/TopSellingSlider";

export default function Home() {
  return (
  <div >
    <HeroSlider/>
 {/* <HeroBanner/> */}
 <Category/>
 <FeaturedProducts/>
 <ProductsFilterTabs/>
 <TopSellingSlider/>
  </div>
  );
}
