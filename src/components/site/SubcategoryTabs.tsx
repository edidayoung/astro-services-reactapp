import { motion } from "framer-motion";
import { getDisplayName, getIconForSubcategory } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

interface SubcategoryTabsProps {
  subcategories: string[];
  activeSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
  productCounts: Record<string, number>;
}

export function SubcategoryTabs({
  subcategories,
  activeSubcategory,
  onSubcategoryChange,
  productCounts,
}: SubcategoryTabsProps) {
  return (
    <div className="flex gap-3 justify-center flex-wrap px-4">
      {subcategories.map((subcategory, index) => {
        const isActive = activeSubcategory === subcategory;
        const Icon = getIconForSubcategory(subcategory);
        const count = productCounts[subcategory] || 0;
        
        return (
          <motion.button
            key={subcategory}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              delay: index * 0.05, 
              duration: 0.4,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSubcategoryChange(subcategory)}
            className={`
              group relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm 
              transition-all duration-300 whitespace-nowrap
              border-2
              ${isActive 
                ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white border-purple-400/50 shadow-xl shadow-purple-500/40' 
                : 'bg-surface/40 backdrop-blur-sm text-foreground/70 border-border/30 hover:border-purple-500/40 hover:text-purple-400 hover:bg-surface/60'
              }
            `}
          >
            {/* Glow effect for active state */}
            {isActive && (
              <motion.div
                layoutId="activeSubcategory"
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 blur-xl"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            
            {/* Content */}
            <div className="relative flex items-center gap-2.5">
              {Icon && (
                <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-12'}`} />
              )}
              <span className="relative">
                {getDisplayName(subcategory)}
              </span>
              <Badge 
                className={`
                  ml-1 px-2 py-0.5 text-xs font-bold rounded-full transition-all duration-300
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20'
                  }
                `}
              >
                {count}
              </Badge>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
