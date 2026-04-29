import Category from "@/components/Category";
import FeaturedProducts from "@/components/FeatureProduct";
import HeroBanner from "@/components/HeroBanner";
import HeroSlider from "@/components/HeroSlider";

export default function Home() {
  return (
  <div >
    <HeroSlider/>
 {/* <HeroBanner/> */}
 <Category/>
 <FeaturedProducts/>
  </div>
  );
}
