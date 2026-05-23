import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { TrustStrip } from "@/components/site/TrustStrip";
import { Categories } from "@/components/site/Categories";
import { LatestProducts } from "@/components/site/LatestProducts";
import { Testimonials } from "@/components/site/Testimonials";
import { WhyShop } from "@/components/site/WhyShop";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Categories />
        {/* Empty by default — wire up your DB and pass `products` prop */}
        <LatestProducts />
        <Testimonials />
        <WhyShop />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
