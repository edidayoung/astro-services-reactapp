import { motion } from "framer-motion";
import { getDisplayName } from "@/lib/mock-data";

interface SubcategoryTabsProps {
  subcategories: string[];
  activeSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
}

export function SubcategoryTabs({
  subcategories,
  activeSubcategory,
  onSubcategoryChange,
}: SubcategoryTabsProps) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {subcategories.map((subcategory, index) => {
          const isActive = activeSubcategory === subcategory;
          
          return (
            <motion.button
              key={subcategory}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => onSubcategoryChange(subcategory)}
              className={`
                relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-primary text-white shadow-lg shadow-purple-500/30' 
                  : 'bg-surface/60 text-foreground/80 hover:bg-surface hover:text-foreground'
                }
              `}
            >
              {getDisplayName(subcategory)}
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-gradient-primary -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
