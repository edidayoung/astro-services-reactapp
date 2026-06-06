import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { ProductCard } from "@/components/site/ProductCard";
import { ReviewsMarquee } from "@/components/site/ReviewsMarquee";
import { motion } from "framer-motion";
import { useFeaturedProducts } from "@/lib/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Fetch products from Firebase
  const { data: newArrivals, isLoading, error } = useFeaturedProducts(8);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        
        {/* Section Divider */}
        <div className="container mx-auto px-4 py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        
        {/* New Arrivals Section */}
        <section id="new-arrivals" className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="text-4xl font-bold font-display mb-4">Our New Arrivals</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the newest additions to our collection
              </p>
            </motion.div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border/50 bg-surface/30 backdrop-blur p-5">
                    <Skeleton className="aspect-square w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-6 w-1/2" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">Failed to load products</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && newArrivals && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {newArrivals.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && newArrivals?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products available</p>
              </div>
            )}
          </div>
        </section>

        {/* Section Divider */}
        <div className="container mx-auto px-4 py-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Reviews Marquee Section */}
        <ReviewsMarquee />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
