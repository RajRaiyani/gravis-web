import { Categories } from "@/components/pages/home/categories";
import Hero from "@/components/pages/home/hero";
import { PopularProducts } from "@/components/pages/home/populer-products";
import { AboutSection } from "@/components/pages/home/about-section";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Hero />
      <Categories />
      <PopularProducts />
      <AboutSection />
    </div>
  );
}
