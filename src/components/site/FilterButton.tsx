import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface FilterDropdownProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  productCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const sortOptions = [
  { value: 'default', label: 'Default Order', icon: '📌' },
  { value: 'date-desc', label: 'Newest First', icon: '✨' },
  { value: 'price-asc', label: 'Price: Low to High', icon: '💰' },
  { value: 'price-desc', label: 'Price: High to Low', icon: '💎' },
];

export function FilterDropdown({
  sortBy,
  onSortChange,
  productCount,
  hasActiveFilters,
  onClearFilters,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const activeSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort';

  return (
    <div ref={dropdownRef} className="relative">
      {/* Sort Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="
          flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm
          bg-surface/60 backdrop-blur-sm text-foreground border-2 border-border/30
          hover:border-purple-500/40 hover:bg-surface/80
          transition-all duration-300 shadow-lg
        "
      >
        <ArrowUpDown className="h-4 w-4 text-purple-400" />
        <span className="hidden sm:inline">{activeSortLabel}</span>
        <span className="sm:hidden">Sort</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
            className="
              absolute top-full right-0 mt-2 w-64
              bg-surface/95 backdrop-blur-xl border-2 border-border/50 
              rounded-2xl shadow-2xl z-50 overflow-hidden
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-purple-500/5 to-indigo-500/5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-bold">Sort Options</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-purple-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Product Count */}
            <div className="px-4 py-3 bg-purple-500/5 border-b border-border/30">
              <p className="text-sm text-center">
                <span className="font-bold text-purple-400 text-lg">{productCount}</span>
                <span className="text-muted-foreground ml-1">
                  {productCount === 1 ? 'product' : 'products'} found
                </span>
              </p>
            </div>

            {/* Sort Options */}
            <div className="p-3 space-y-1">
              {sortOptions.map((option) => {
                const isActive = sortBy === option.value;
                
                return (
                  <motion.button
                    key={option.value}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 border-2 border-purple-500/40' 
                        : 'hover:bg-surface/50 border-2 border-transparent'
                      }
                    `}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span className="flex-1 text-left">{option.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeSort"
                        className="w-2 h-2 rounded-full bg-purple-500"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="p-3 border-t border-border/50">
                <button
                  onClick={() => {
                    onClearFilters();
                    setIsOpen(false);
                  }}
                  className="
                    w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                    bg-gradient-to-r from-red-500/10 to-orange-500/10 text-red-400
                    border-2 border-red-500/30 hover:border-red-500/50
                    font-semibold text-sm transition-all duration-300
                  "
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
