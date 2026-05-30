import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/mock-data";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
  const hasDiscount = product.onSale && product.salePrice;

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-surface/30 backdrop-blur transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10"
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
        {product.badges.includes('hot') && (
          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg">
            🔥 HOT
          </Badge>
        )}
        {product.badges.includes('new') && (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
            ✨ NEW
          </Badge>
        )}
        {hasDiscount && (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
            {Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)}% OFF
          </Badge>
        )}
      </div>

      {/* Image Count Badge */}
      {product.images.length > 1 && (
        <div className="absolute right-3 top-3 z-10">
          <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur">
            📷 {product.images.length}
          </Badge>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-500/5 to-blue-500/5 p-6">
        <img
          src={primaryImage.url}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Stock Status Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Badge variant="destructive" className="text-lg">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category & Brand */}
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="capitalize">{product.category}</span>
          {product.brand && (
            <>
              <span>•</span>
              <span className="capitalize">{product.brand.replace(/-/g, ' ')}</span>
            </>
          )}
        </div>

        {/* Product Name */}
        <h3 className="mb-2 line-clamp-2 font-semibold text-foreground group-hover:text-purple-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-purple-400">
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-1.5 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-transparent" />
      </div>
    </motion.div>
  );
}
