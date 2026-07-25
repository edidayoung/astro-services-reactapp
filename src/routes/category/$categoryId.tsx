import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { ProductCard } from "@/components/site/ProductCard";
import { SubcategoryTabs } from "@/components/site/SubcategoryTabs";
import { AstroFixPage } from "@/components/site/AstroFixPage";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Smartphone, Laptop, Headphones, Package, Wrench, MessageCircle, CheckCircle, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect, useRef } from "react";
import { useProductsByCategory } from "@/lib/hooks/useProducts";
import { subcategoryConfig, androidBrands, laptopBrands } from "@/lib/mock-data";

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
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  
  // Fetch products from Firebase
  const { data: categoryProducts = [], isLoading, error } = useProductsByCategory(categoryId);

  // Reset filters when category changes
  useEffect(() => {
    setActiveSubcategory('all');
    setSelectedBrand(null);
    setSortBy('default');
    setMinPrice(null);
    setMaxPrice(null);
  }, [categoryId]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }
    }
    if (sortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [sortOpen]);

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

  // Calculate brand counts (for Android smartphones and Laptops)
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    if (categoryId === 'smartphones' && activeSubcategory === 'android') {
      // Android smartphones - filter by subcategory
      const androidProducts = categoryProducts.filter(p => p.subcategory === 'android');
      const brands = ['all', ...androidBrands.filter(b => b !== 'all')];
      brands.forEach(brand => {
        if (brand === 'all') {
          counts[brand] = androidProducts.length;
        } else {
          counts[brand] = androidProducts.filter(p => p.brand === brand).length;
        }
      });
    } else if (categoryId === 'laptops') {
      // Laptops - filter by subcategory for brand counts
      let laptopProducts = categoryProducts;
      
      // If a specific subcategory is selected (not 'all'), filter by it
      if (activeSubcategory !== 'all') {
        laptopProducts = categoryProducts.filter(p => p.subcategory === activeSubcategory);
      }
      
      const brands = ['all', ...laptopBrands.filter(b => b !== 'all')];
      brands.forEach(brand => {
        if (brand === 'all') {
          counts[brand] = laptopProducts.length;
        } else {
          counts[brand] = laptopProducts.filter(p => p.brand === brand).length;
        }
      });
    }
    
    return counts;
  }, [categoryProducts, categoryId, activeSubcategory]);

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
      
      // Special case: "Budget" laptops (0-400k price range)
      if (categoryId === 'laptops' && activeSubcategory === 'budget') {
        filtered = categoryProducts.filter(p => {
          const price = (p.onSale && p.salePrice) ? p.salePrice : p.price;
          return price >= 0 && price <= 400000;
        });
      }
    }

    // Filter by brand (Android smartphones and Laptops)
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
      filtered.sort((a, b) => {
        const priceA = (a.onSale && a.salePrice) ? a.salePrice : a.price;
        const priceB = (b.onSale && b.salePrice) ? b.salePrice : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => {
        const priceA = (a.onSale && a.salePrice) ? a.salePrice : a.price;
        const priceB = (b.onSale && b.salePrice) ? b.salePrice : b.price;
        return priceB - priceA;
      });
    } else {
      // Default: newest first
      filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return filtered;
  }, [categoryProducts, categoryId, activeSubcategory, selectedBrand, minPrice, maxPrice, sortBy]);

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
    setMinPrice(null);
    setMaxPrice(null);
  };

  // Special handling for AstroFix - AFTER all hooks
  if (categoryId === 'astrofix') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          {/* Centered Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 flex items-center justify-center gap-2 text-sm"
          >
            <Link to="/" className="text-muted-foreground hover:text-purple-400 transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">›</span>
            <span className="text-green-400 font-medium">AstroFix</span>
          </motion.div>

          <AstroFixPage />
        </main>
        <Footer />
        <WhatsAppFab />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Centered Hero Section - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm mb-6">
            <Link to="/" className="text-muted-foreground hover:text-purple-400 transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">›</span>
            <span className="text-purple-400 font-medium">{category.title}</span>
          </div>

          {/* Icon + Title + Description */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Icon className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl font-bold font-display">{category.title}</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
          </div>

          {/* Subcategory Tabs - Show skeleton or real tabs */}
          {isLoading ? (
            <div className="flex gap-3 justify-center flex-wrap px-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            <SubcategoryTabs
              subcategories={subcategories}
              activeSubcategory={activeSubcategory}
              onSubcategoryChange={handleSubcategoryChange}
              productCounts={subcategoryCounts}
            />
          )}
        </motion.div>

        {/* Products Bar + Grid Layout */}
        <div className="flex gap-8">
          {/* Left Sidebar - Brands + Price Range (when applicable) */}
          {isLoading ? (
            // Sidebar skeleton (conditionally shown for categories with brands)
            (categoryId === 'smartphones' || categoryId === 'laptops') && (
              <div className="w-64 flex-shrink-0">
                <div className="space-y-4">
                  {/* Brands section skeleton */}
                  <div className="rounded-2xl border border-border/50 bg-surface/30 backdrop-blur p-4">
                    <Skeleton className="h-4 w-20 mb-4" />
                    <div className="space-y-2">
                      {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-xl" />
                      ))}
                    </div>
                  </div>

                  {/* Price range section skeleton */}
                  <div className="rounded-2xl border border-border/50 bg-surface/30 backdrop-blur p-4">
                    <Skeleton className="h-4 w-24 mb-4" />
                    <div className="space-y-3">
                      <div>
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </div>
                      <div>
                        <Skeleton className="h-3 w-20 mb-2" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            !error && categoryProducts.length > 0 && (
              ((categoryId === 'smartphones' && activeSubcategory === 'android') || categoryId === 'laptops') && (
                <div className="w-64 flex-shrink-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent space-y-4"
                  >
                    {/* Brands Section */}
                    <div className="rounded-2xl border border-border/50 bg-surface/40 backdrop-blur p-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 px-2">
                        Brands
                      </h3>
                      <div className="space-y-1">
                        {(categoryId === 'smartphones' 
                          ? ['all', ...androidBrands.filter(b => b !== 'all')]
                          : ['all', ...laptopBrands.filter(b => b !== 'all')]
                        )
                          .filter(brand => {
                            // Only show brands that have products
                            const count = brandCounts[brand] || 0;
                            return count > 0;
                          })
                          .map((brand) => {
                          const isActive = selectedBrand === brand || (brand === 'all' && !selectedBrand);
                          const count = brandCounts[brand] || 0;
                          
                          return (
                            <motion.button
                              key={brand}
                              onClick={() => setSelectedBrand(brand === 'all' ? null : brand)}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className={`
                                w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl
                                transition-all duration-200 text-sm font-medium
                                ${isActive 
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' 
                                  : 'hover:bg-surface/60 text-foreground/70 hover:text-foreground'
                                }
                              `}
                            >
                              <span>{brand === 'all' ? 'All Brands' : brand.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                              <span className={`
                                text-xs px-2 py-0.5 rounded-full font-bold
                                ${isActive 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-orange-500/10 text-orange-500'
                                }
                              `}>
                                {count}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Price Range Section */}
                    <div className="rounded-2xl border border-border/50 bg-surface/40 backdrop-blur p-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 px-2">
                        Price Range
                      </h3>
                      <div className="space-y-3 px-2">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1.5 block">Min Price (₦)</label>
                          <input
                            type="number"
                            value={minPrice || ''}
                            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
                            placeholder="0"
                            className="w-full px-3 py-2 rounded-lg bg-surface/60 border border-border/30 text-sm focus:border-purple-500/50 focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1.5 block">Max Price (₦)</label>
                          <input
                            type="number"
                            value={maxPrice || ''}
                            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
                            placeholder={priceRange.max.toLocaleString()}
                            className="w-full px-3 py-2 rounded-lg bg-surface/60 border border-border/30 text-sm focus:border-purple-500/50 focus:outline-none transition-colors"
                          />
                        </div>
                        {(minPrice !== null || maxPrice !== null) && (
                          <button
                            onClick={() => {
                              setMinPrice(null);
                              setMaxPrice(null);
                            }}
                            className="w-full text-xs text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Clear Price Filter
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            )
          )}

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {isLoading && (
              <>
                {/* Top Bar skeleton */}
                <div className="flex items-center justify-between mb-6">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-10 w-48 rounded-xl" />
                </div>

                {/* Product Grid skeleton */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="rounded-2xl border border-border/50 bg-surface/30 backdrop-blur p-5"
                    >
                      <Skeleton className="aspect-square w-full mb-4 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-5/6" />
                        <div className="flex items-center justify-between pt-2">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-9 w-9 rounded-lg" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">Failed to load products</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
            )}

            {/* Content */}
            {!isLoading && !error && categoryProducts.length > 0 && (
              <>
                {/* Top Bar: Product Count + Custom Sort Dropdown */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm font-semibold text-foreground">
                    {filteredProducts.length} Products
                  </div>
                  
                  {/* Custom Sort Dropdown */}
                  <div ref={sortRef} className="relative">
                    <motion.button
                      onClick={() => setSortOpen(!sortOpen)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="
                        flex items-center gap-3 px-5 py-2.5 rounded-xl font-medium text-sm
                        bg-surface/60 backdrop-blur-sm text-foreground 
                        border-2 border-border/30 hover:border-purple-500/40
                        transition-all duration-300 shadow-lg hover:shadow-xl
                      "
                    >
                      <span>
                        {sortBy === 'default' && '✨ Newest First'}
                        {sortBy === 'price-asc' && '💰 Price: Low to High'}
                        {sortBy === 'price-desc' && '💎 Price: High to Low'}
                      </span>
                      <motion.div
                        animate={{ rotate: sortOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4 text-purple-400" />
                      </motion.div>
                    </motion.button>

                    {/* Dropdown Menu */}
                    {sortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="
                          absolute top-full right-0 mt-2 w-56
                          bg-surface/95 backdrop-blur-xl border-2 border-border/50 
                          rounded-xl shadow-2xl z-50 overflow-hidden
                        "
                      >
                        <div className="p-2">
                          {[
                            { value: 'default', label: '✨ Newest First' },
                            { value: 'price-asc', label: '💰 Price: Low to High' },
                            { value: 'price-desc', label: '💎 Price: High to Low' }
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setSortBy(option.value as any);
                                setSortOpen(false);
                              }}
                              className={`
                                w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium
                                transition-all duration-200
                                ${sortBy === option.value
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'hover:bg-surface/50 text-foreground/70 hover:text-foreground'
                                }
                              `}
                            >
                              {option.label}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Products Grid - 4 columns */}
                {filteredProducts.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                )}

                {/* Empty State */}
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
                    <div className="flex gap-3">
                      <Button onClick={handleClearFilters} variant="outline">
                        Reset Filters
                      </Button>
                      <Button
                        onClick={() => window.open('https://wa.me/YOUR_WHATSAPP_NUMBER', '_blank')}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Contact Support
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

