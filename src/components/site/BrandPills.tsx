import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "./BrandLogo";
import { getDisplayName } from "@/lib/mock-data";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface BrandPillsProps {
  brands: string[];
  selectedBrand: string | null;
  onBrandChange: (brand: string | null) => void;
  brandCounts: Record<string, number>;
  maxVisible?: number;
}

export function BrandPills({
  brands,
  selectedBrand,
  onBrandChange,
  brandCounts,
  maxVisible = 6,
}: BrandPillsProps) {
  const [showAll, setShowAll] = useState(false);
  
  const visibleBrands = showAll ? brands : brands.slice(0, maxVisible);
  const hasMore = brands.length > maxVisible;
  const remainingCount = brands.length - maxVisible;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-center gap-2.5 px-4">
        {visibleBrands.map((brand, index) => {
          const isActive = selectedBrand === brand;
          const count = brandCounts[brand] || 0;
          
          return (
            <motion.button
              key={brand}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                delay: index * 0.03,
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onBrandChange(brand === 'all' ? null : brand)}
              className={`
                group relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm 
                transition-all duration-300 border-2
                ${isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400/50 shadow-lg shadow-orange-500/40' 
                  : 'bg-surface/30 backdrop-blur-sm text-foreground/80 border-border/30 hover:border-orange-500/40 hover:bg-surface/50'
                }
              `}
            >
              {/* Glow for active */}
              {isActive && (
                <motion.div
                  layoutId="activeBrand"
                  className="absolute inset-0 rounded-xl bg-orange-500/20 blur-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative flex items-center gap-2">
                {brand !== 'all' && (
                  <BrandLogo brand={brand} size="sm" />
                )}
                <span className="font-semibold">
                  {getDisplayName(brand)}
                </span>
                <span className={`
                  text-xs px-2 py-0.5 rounded-full font-bold
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20'
                  }
                `}>
                  {count}
                </span>
              </div>
            </motion.button>
          );
        })}
        
        {/* Show More/Less Button */}
        {hasMore && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(!showAll)}
            className="
              flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium text-sm
              bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-400
              border-2 border-purple-500/30 hover:border-purple-500/50
              backdrop-blur-sm transition-all duration-300
            "
          >
            <span>{showAll ? 'Less' : `+${remainingCount} More`}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
