import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { ProductCard } from "@/components/site/ProductCard";
import { SubcategoryTabs } from "@/components/site/SubcategoryTabs";
import { BrandPills } from "@/components/site/BrandPills";
import { FilterDropdown } from "@/components/site/FilterDropdown";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Smartphone, Laptop, Headphones, Package, Wrench, MessageCircle, CheckCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { useProductsByCategory } from "@/lib/hooks/useProducts";
import { subcategoryConfig, mockRepairCases, androidBrands } from "@/lib/mock-data";

export const Route = createFileRoute("/category/$categoryId")({
  component: CategoryPage,
});

const categoryData: Record<string, {
  title: string;
  description: string;
  icon: any;
  color: string;
}> = {
  smartphones: {
    title: "Smartphones",
    description: "Discover the latest smartphones with cutting-edge technology, stunning displays, and powerful performance.",
    icon: Smartphone,
    color: "from-blue-500 to-purple-500",
  },
  laptops: {
    title: "Laptops",
    description: "Premium laptops for work, gaming, and creativity. Find the perfect device for your needs.",
    icon: Laptop,
    color: "from-purple-500 to-pink-500",
  },
  audio: {
    title: "Audio",
    description: "Immerse yourself in crystal-clear sound with our premium headphones, speakers, and audio equipment.",
    icon: Headphones,
    color: "from-pink-500 to-red-500",
  },
  accessories: {
    title: "Accessories",
    description: "Complete your setup with essential accessories, chargers, cases, and more.",
    icon: Package,
    color: "from-orange-500 to-yellow-500",
  },
  astrofix: {
    title: "AstroFix",
    description: "Professional repair and maintenance services for all your electronic devices.",
    icon: Wrench,
    color: "from-green-500 to-teal-500",
  },
};

function CategoryPage() {
  const { categoryId } = Route.useParams();
  
  const category = categoryData[categoryId] || categoryData.smartphones;
  const Icon = category.icon;

  // Filter States - ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  
  // Fetch products from Firebase
  const { data: categoryProducts = [], isLoading, error } = useProductsByCategory(categoryId);

  // Get subcategories for this category
  const subcategories = subcategoryConfig[categoryId as keyof typeof subcategoryConfig] || ['all'];

  // Calculate product counts for each subcategory
  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    subcategories.forEach(sub => {
      if (sub === 'all') {
        counts[sub] = categoryProducts.length;
      } else {
        counts[sub] = categoryProducts.filter(p => p.subcategory === sub).length;
      }
    });
    return counts;
  }, [categoryProducts, subcategories]);

  // Calculate brand counts (for Android smartphones)
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (categoryId === 'smartphones') {
      const androidProducts = categoryProducts.filter(p => p.subcategory === 'android');
      const brands = ['all', ...androidBrands.filter(b => b !== 'all')];
      brands.forEach(brand => {
        if (brand === 'all') {
          counts[brand] = androidProducts.length;
        } else {
          counts[brand] = androidProducts.filter(p => p.brand === brand).length;
        }
      });
    }
    return counts;
  }, [categoryProducts, categoryId]);

  // Get price range from products
  const priceRange = useMemo(() => {
    if (categoryProducts.length === 0) {
      return { min: 0, max: 2000000 };
    }
    const prices = categoryProducts.map(p => (p.onSale && p.salePrice) ? p.salePrice : p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    };
  }, [categoryProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...categoryProducts];

    // Filter by subcategory
    if (activeSubcategory !== 'all') {
      filtered = filtered.filter(p => p.subcategory === activeSubcategory);
    }

    // Filter by brand (Android smartphones only)
    if (selectedBrand && selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Filter by price range
    if (minPrice !== null || maxPrice !== null) {
      filtered = filtered.filter(p => {
        const price = (p.onSale && p.salePrice) ? p.salePrice : p.price;
        if (minPrice !== null && price < minPrice) return false;
        if (maxPrice !== null && price > maxPrice) return false;
        return true;
      });
    }

    // Sort products
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'date-desc') {
      filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return filtered;
  }, [categoryProducts, activeSubcategory, selectedBrand, sortBy, minPrice, maxPrice]);

  // Reset brand when subcategory changes
  const handleSubcategoryChange = (subcategory: string) => {
    setActiveSubcategory(subcategory);
    if (subcategory !== 'android') {
      setSelectedBrand(null);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setActiveSubcategory('all');
    setSelectedBrand(null);
    setSortBy('default');
    setMinPrice(null);
    setMaxPrice(null);
  };

  // Special handling for AstroFix - AFTER all hooks
  if (categoryId === 'astrofix') {
    return <AstroFixPage />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center gap-2 text-sm"
        >
          <Link to="/" className="text-muted-foreground hover:text-purple-400 transition-colors">
            Home
          </Link>
          <span className="text-muted-foreground">›</span>
          <span className="text-purple-400 font-medium">{category.title}</span>
        </motion.div>

        {/* Category Header - Clean and Simple */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          {/* Title with inline icon - centered */}
          <h1 className="text-4xl font-bold font-display mb-4 flex items-center justify-center gap-3">
            <Icon className="h-8 w-8 text-purple-400" />
            {category.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
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

        {/* Modern Two-Tier Filtering System */}
        {!isLoading && !error && categoryProducts.length > 0 && (
          <>
            <div className="space-y-6 mb-12">
              {/* Row 1: Subcategory Tabs with Sort Button */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 flex justify-center">
                  <SubcategoryTabs
                    subcategories={subcategories}
                    activeSubcategory={activeSubcategory}
                    onSubcategoryChange={handleSubcategoryChange}
                    productCounts={subcategoryCounts}
                  />
                </div>
                <FilterDropdown
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  productCount={filteredProducts.length}
                  hasActiveFilters={selectedBrand !== null || sortBy !== 'default'}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Row 2: Brand Pills (Only for Android Smartphones) */}
              {categoryId === 'smartphones' && activeSubcategory === 'android' && (
                <BrandPills
                  brands={['all', ...androidBrands.filter(b => b !== 'all')]}
                  selectedBrand={selectedBrand}
                  onBrandChange={setSelectedBrand}
                  brandCounts={brandCounts}
                  maxVisible={7}
                />
              )}
            </div>

            {/* Products Grid - 4 columns like New Arrivals */}
            {filteredProducts.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}

            {/* Empty State - Show when filtered results are empty */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-4 text-6xl opacity-20">📦</div>
                <h3 className="mb-2 text-xl font-semibold">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or check back later
                </p>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                >
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </>
        )}
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

// AstroFix Page Component
function AstroFixPage() {
  const services = [
    {
      title: "Screen Repair",
      description: "Cracked or damaged screens replaced with original parts",
      icon: "📱",
      price: "From ₦15,000"
    },
    {
      title: "Battery Replacement",
      description: "High-capacity original batteries for longer life",
      icon: "🔋",
      price: "From ₦12,000"
    },
    {
      title: "Water Damage",
      description: "Complete motherboard cleaning and restoration",
      icon: "💧",
      price: "From ₦25,000"
    },
    {
      title: "Charging Port",
      description: "Fix charging issues and port replacements",
      icon: "⚡",
      price: "From ₦8,000"
    },
    {
      title: "Software Issues",
      description: "OS installation, virus removal, and optimization",
      icon: "💻",
      price: "From ₦5,000"
    },
    {
      title: "Data Recovery",
      description: "Recover lost data from damaged devices",
      icon: "💾",
      price: "From ₦20,000"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center gap-2 text-sm"
        >
          <Link to="/" className="text-muted-foreground hover:text-purple-400 transition-colors">
            Home
          </Link>
          <span className="text-muted-foreground">›</span>
          <span className="text-green-400 font-medium">AstroFix</span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 shadow-lg mb-6">
            <Wrench className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold font-display mb-4">AstroFix Repairs</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Professional repair services for all your electronic devices
          </p>
          <Button size="lg" className="bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90">
            <MessageCircle className="mr-2 h-5 w-5" />
            Contact Us on WhatsApp
          </Button>
        </motion.div>

        {/* Why Choose AstroFix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-display mb-8 text-center">Why Choose AstroFix?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "⚡", title: "Fast Turnaround", desc: "Most repairs done same day" },
              { icon: "✅", title: "Original Parts", desc: "Genuine replacement parts" },
              { icon: "🛡️", title: "Warranty", desc: "90-day warranty on repairs" },
              { icon: "💰", title: "Fair Pricing", desc: "Transparent, competitive rates" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border border-border/50 bg-surface/30 backdrop-blur"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-display mb-8 text-center">Our Services</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border/50 bg-surface/30 backdrop-blur p-6 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <Badge className="bg-gradient-to-r from-green-500 to-teal-500">
                  {service.price}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Before & After Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-display mb-8 text-center">
            Before & After
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            See the quality of our repair work. We bring your devices back to life!
          </p>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mockRepairCases.map((repair, i) => (
              <motion.div
                key={repair.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border/50 bg-surface/30 backdrop-blur overflow-hidden hover:border-green-500/50 transition-all duration-300"
              >
                {/* Before & After Images */}
                <div className="grid grid-cols-2">
                  <div className="relative aspect-square">
                    <img
                      src={repair.beforeImage}
                      alt="Before repair"
                      className="h-full w-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500">Before</Badge>
                  </div>
                  <div className="relative aspect-square">
                    <img
                      src={repair.afterImage}
                      alt="After repair"
                      className="h-full w-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-500">After</Badge>
                  </div>
                </div>

                {/* Repair Info */}
                <div className="p-6">
                  <Badge variant="secondary" className="mb-3">
                    {repair.category}
                  </Badge>
                  <h3 className="font-semibold mb-2">{repair.title}</h3>
                  <p className="text-sm text-muted-foreground">{repair.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold font-display mb-8 text-center">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { step: "1", title: "Contact Us", desc: "Reach out via WhatsApp or visit our store" },
              { step: "2", title: "Diagnosis", desc: "We inspect and diagnose the issue" },
              { step: "3", title: "Repair", desc: "Expert technicians fix your device" },
              { step: "4", title: "Quality Check", desc: "Thorough testing before return" }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-2xl font-bold text-white mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center rounded-2xl border border-border/50 bg-gradient-to-br from-green-500/10 to-teal-500/10 p-12"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold font-display mb-4">
            Ready to Fix Your Device?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get in touch with our expert technicians today. Fast, reliable, and affordable repairs.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90">
            <MessageCircle className="mr-2 h-5 w-5" />
            Chat on WhatsApp
          </Button>
        </motion.div>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
