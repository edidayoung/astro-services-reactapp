import { motion } from "framer-motion";
import { getDisplayName, getIconForSubcategory } from "@/lib/mock-data";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CategorySidebarProps {
  // Subcategories
  subcategories: string[];
  activeSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
  subcategoryCounts: Record<string, number>;
  
  // Brands (optional - only for categories with brands)
  brands?: string[];
  selectedBrand: string | null;
  onBrandChange: (brand: string | null) => void;
  brandCounts: Record<string, number>;
  showBrands: boolean;
}

export function CategorySidebar({
  subcategories,
  activeSubcategory,
  onSubcategoryChange,
  subcategoryCounts,
  brands = [],
  selectedBrand,
  onBrandChange,
  brandCounts,
  showBrands
}: CategorySidebarProps) {
  const [brandsExpanded, setBrandsExpanded] = useState(true);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-64 flex-shrink-0"
    >
      {/* Scrollable container with max height */}
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
        {/* Subcategories Section */}
        <div className="rounded-2xl border border-border/50 bg-surface/40 backdrop-blur p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 px-2">
            Categories
          </h3>
          <div className="space-y-1">
            {subcategories.map((subcategory) => {
              const isActive = activeSubcategory === subcategory;
              const count = subcategoryCounts[subcategory] || 0;
              const Icon = getIconForSubcategory(subcategory);
              
              return (
                <motion.button
                  key={subcategory}
                  onClick={() => onSubcategoryChange(subcategory)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 text-sm font-medium group
                    ${isActive 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md' 
                      : 'hover:bg-surface/60 text-foreground/70 hover:text-foreground'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && (
                      <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                    )}
                    <span>{getDisplayName(subcategory)}</span>
                  </div>
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full font-bold
                    ${isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20'
                    }
                  `}>
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Brands Section (Collapsible) */}
        {showBrands && brands.length > 0 && (
          <div className="rounded-2xl border border-border/50 bg-surface/40 backdrop-blur p-4">
            <button
              onClick={() => setBrandsExpanded(!brandsExpanded)}
              className="w-full flex items-center justify-between mb-4 px-2 group"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Brands
              </h3>
              <motion.div
                animate={{ rotate: brandsExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </motion.div>
            </button>
            
            <motion.div
              initial={false}
              animate={{ 
                height: brandsExpanded ? 'auto' : 0,
                opacity: brandsExpanded ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-1">
                {brands.map((brand) => {
                  const isActive = selectedBrand === brand || (brand === 'all' && !selectedBrand);
                  const count = brandCounts[brand] || 0;
                  
                  return (
                    <motion.button
                      key={brand}
                      onClick={() => onBrandChange(brand === 'all' ? null : brand)}
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
                      <span>{getDisplayName(brand)}</span>
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full font-bold
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20'
                        }
                      `}>
                        {count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
