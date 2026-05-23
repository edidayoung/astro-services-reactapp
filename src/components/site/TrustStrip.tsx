import { motion } from "framer-motion";
import { BadgeCheck, Tag, CreditCard, RotateCcw } from "lucide-react";

const items = [
  { icon: BadgeCheck, title: "100% Authentic", sub: "Genuine products" },
  { icon: Tag, title: "Best Price", sub: "Unbeatable deals" },
  { icon: CreditCard, title: "Secure Payment", sub: "Safe & reliable" },
  { icon: RotateCcw, title: "Easy Returns", sub: "Hassle-free returns" },
];

export function TrustStrip() {
  return (
    <section className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-surface/50 p-6 backdrop-blur md:grid-cols-4"
      >
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-glow">
              <it.icon className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{it.title}</div>
              <div className="text-xs text-muted-foreground">{it.sub}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
