import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  priceNaira: number;
  imageUrl?: string;
  isNew?: boolean;
}

interface Props {
  products?: Product[];
  loading?: boolean;
}

export function LatestProducts({ products = [], loading = false }: Props) {
  return (
    <section id="new-arrivals" className="container mx-auto px-4 py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-primary-glow">
            NEW ARRIVALS
          </p>
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Latest Products Just for You
          </h2>
        </div>
        <Button variant="glass" size="lg">
          View All Products
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl bg-surface/60" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-surface/30 px-6 py-20 text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary-glow">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="font-display text-xl font-semibold">Products coming soon</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Connect this section to your database to display the latest products. The product card and grid are ready to receive data.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-4 shadow-card"
    >
      {product.isNew && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-gradient-primary px-2 py-1 text-[10px] font-bold tracking-wider text-primary-foreground">
          NEW
        </span>
      )}
      <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-surface/40">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <Package className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      <div className="font-display text-sm font-semibold leading-tight">{product.name}</div>
      {product.subtitle && (
        <div className="mt-0.5 text-xs text-muted-foreground">{product.subtitle}</div>
      )}
      <div className="mt-3 flex items-center justify-between">
        <div className="font-display font-bold">
          ₦{product.priceNaira.toLocaleString()}
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-button transition-transform hover:scale-110">
          <Package className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
