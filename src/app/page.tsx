import FeaturedProducts from "@/components/FeaturedProduct";
import Hero from "@/components/Hero";
import NearbyStore from "@/components/homepage/NearbyStore";
import ShopCategories from "@/components/ShopCategories";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <NearbyStore />
      <FeaturedProducts />
      <ShopCategories />
    </main>
  );
}
