import Category from "@/components/Category";
import FeaturedProducts from "@/components/FeatureProduct";
import HeroBanner from "@/components/HeroBanner";
import HeroSlider from "@/components/HeroSlider";
import ProductSlider from "@/components/ProductSlider";

export default function Home() {
  return (
  <div >
    <HeroSlider/>
 {/* <HeroBanner/> */}
 <Category/>
 <FeaturedProducts/>
 {/* <ProductSlider/> */}
  </div>
  );
}
