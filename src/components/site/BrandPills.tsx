import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "./BrandLogo";
import { getDisplayName } from "@/lib/mock-data";
import { ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";

interface BrandPillsProps {
  brands: string[];
  selectedBrand: string | null;
  onBrandChange: (brand: string | null) => void;
  brandCounts: Record<string, number>;
  maxVisible?: number;
}

// Brand-specific gradient colors for better visual identity
const brandGradients: Record<string, string> = {
  'all': 'from-purple-500 via-purple-600 to-indigo-600',
  // Android phone brands
  'tecno': 'from-blue-500 via-blue-600 to-cyan-600',
  'redmi': 'from-orange-500 via-orange-600 to-red-600',
  'samsung-s-series': 'from-blue-400 via-cyan-500 to-teal-500',
  'samsung-a-series': 'from-blue-400 via-blue-500 to-indigo-500',
  'vivo': 'from-blue-600 via-indigo-600 to-purple-600',
  'oppo': 'from-green-500 via-emerald-600 to-teal-600',
  'itel': 'from-yellow-500 via-orange-500 to-red-500',
  'realme': 'from-yellow-400 via-amber-500 to-orange-500',
  'poco': 'from-yellow-500 via-yellow-600 to-amber-600',
  'infinix': 'from-emerald-500 via-green-600 to-teal-600',
  // Laptop brands
  'apple': 'from-gray-700 via-gray-800 to-gray-900',
  'hp': 'from-blue-600 via-blue-700 to-indigo-700',
  'dell': 'from-blue-500 via-cyan-600 to-teal-600',
  'asus': 'from-gray-800 via-slate-900 to-black',
  'acer': 'from-green-600 via-green-700 to-emerald-700',
  'lenovo': 'from-red-600 via-red-700 to-rose-700',
  'msi': 'from-red-600 via-rose-700 to-black',
  'alienware': 'from-cyan-500 via-blue-600 to-indigo-600',
  // Common
  'fairly-used': 'from-slate-500 via-slate-600 to-slate-700'
};

export function BrandPills({
  brands,
  selectedBrand,
  onBrandChange,
  brandCounts,
  maxVisible = 7,
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
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-center gap-3 px-4">
        {visibleBrands.map((brand, index) => {
          const isActive = selectedBrand === brand;
          const count = brandCounts[brand] || 0;
          const gradient = brandGradients[brand] || 'from-gray-500 via-gray-600 to-gray-700';
          
          return (
            <motion.button
              key={brand}
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ 
                delay: index * 0.04,
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onBrandChange(brand === 'all' ? null : brand)}
              className={`
                group relative overflow-hidden flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold text-sm 
                transition-all duration-300 cursor-pointer
                ${isActive 
                  ? 'text-white shadow-2xl' 
                  : 'bg-surface/40 backdrop-blur-sm text-foreground/70 border-2 border-border/30 hover:border-purple-500/40 hover:bg-surface/60'
                }
              `}
            >
              {/* Active gradient background with glow */}
              {isActive && (
                <>
                  <motion.div
                    layoutId="activeBrandBg"
                    className={`absolute inset-0 bg-gradient-to-r ${gradient}`}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-60 blur-xl`}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </>
              )}
              
              <div className="relative flex items-center gap-2.5">
                {/* Brand Logo/Icon */}
                {brand === 'all' ? (
                  <motion.div
                    animate={isActive ? { rotate: [0, 360] } : {}}
                    transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
                  >
                    <Sparkles className={`h-4 w-4 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                  </motion.div>
                ) : (
                  <BrandLogo brand={brand} size="sm" active={isActive} />
                )}
                
                {/* Brand Name */}
                <span className={`
                  font-bold transition-colors duration-300
                  ${isActive ? 'text-white' : 'text-foreground/80 group-hover:text-purple-400'}
                `}>
                  {getDisplayName(brand)}
                </span>
                
                {/* Count Badge with better styling */}
                <motion.span 
                  className={`
                    text-xs px-2.5 py-1 rounded-full font-black transition-all duration-300
                    ${isActive 
                      ? 'bg-white/25 text-white backdrop-blur-sm border border-white/30' 
                      : 'bg-purple-500/10 text-purple-500 border border-purple-500/20 group-hover:bg-purple-500/20 group-hover:border-purple-500/30'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                >
                  {count}
                </motion.span>
              </div>

              {/* Hover shine effect for inactive pills */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </motion.button>
          );
        })}
        
        {/* Show More/Less Button - Enhanced */}
        {hasMore && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAll(!showAll)}
            className="
              group relative overflow-hidden
              flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm
              bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10
              text-purple-400 hover:text-purple-300
              border-2 border-purple-500/30 hover:border-purple-500/50
              backdrop-blur-sm transition-all duration-300 cursor-pointer
            "
          >
            {/* Animated gradient background on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100"
              animate={{ 
                x: ['-100%', '100%']
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            
            <span className="relative font-black">
              {showAll ? 'Show Less' : `+${remainingCount} More`}
            </span>
            <motion.div
              animate={{ rotate: showAll ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

