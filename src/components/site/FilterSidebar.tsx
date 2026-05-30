import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDisplayName, androidBrands } from "@/lib/mock-data";
import { useState } from "react";

interface FilterSidebarProps {
  category: string;
  subcategory: string;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  minPrice: number;
  maxPrice: number;
}

export function FilterSidebar({
  category,
  subcategory,
  selectedBrand,
  onBrandChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  minPrice,
  maxPrice,
}: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const showBrandFilter = category === 'smartphones' && subcategory === 'android';

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-purple-400" />
          Sort By
        </h3>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setMobileOpen(false);
              }}
              className={`
                w-full rounded-lg px-4 py-2.5 text-left text-sm transition-all duration-200
                ${sortBy === option.value
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'bg-surface/60 text-foreground/80 hover:bg-surface hover:text-foreground'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Min</span>
            <Badge variant="secondary">₦{priceRange[0].toLocaleString()}</Badge>
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={10000}
            value={priceRange[0]}
            onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
            className="w-full accent-purple-500"
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Max</span>
            <Badge variant="secondary">₦{priceRange[1].toLocaleString()}</Badge>
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={10000}
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-purple-500"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPriceRangeChange([minPrice, maxPrice])}
            className="w-full"
          >
            Reset Price
          </Button>
        </div>
      </div>

      {/* Brand Filter (Android Smartphones Only) */}
      {showBrandFilter && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">Brand</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {androidBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  onBrandChange(brand);
                  setMobileOpen(false);
                }}
                className={`
                  w-full rounded-lg px-4 py-2.5 text-left text-sm transition-all duration-200
                  ${selectedBrand === brand
                    ? 'bg-gradient-primary text-white shadow-md'
                    : 'bg-surface/60 text-foreground/80 hover:bg-surface hover:text-foreground'
                  }
                `}
              >
                {getDisplayName(brand)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={() => setMobileOpen(true)}
          className="w-full bg-gradient-primary"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters & Sort
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-border/50 bg-surface/30 backdrop-blur p-6">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background border-r border-border/50 overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur p-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6">
              <FilterContent />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
