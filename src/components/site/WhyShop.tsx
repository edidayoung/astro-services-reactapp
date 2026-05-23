import { motion } from "framer-motion";
import { Truck, Lock, ShieldCheck, Headset } from "lucide-react";

const items = [
  { icon: Truck, title: "Fast Delivery", sub: "Quick delivery to your doorstep" },
  { icon: Lock, title: "Secure Shopping", sub: "100% secure payment and data protection" },
  { icon: ShieldCheck, title: "Product Warranty", sub: "Warranty on all eligible products" },
  { icon: Headset, title: "24/7 Support", sub: "Dedicated support whenever you need" },
];

export function WhyShop() {
  return (
    <section id="deals" className="container mx-auto px-4 pt-8">
      <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-primary-glow">
        WHY SHOP WITH US?
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="flex items-start gap-4 rounded-2xl border border-border/60 bg-gradient-card p-5 shadow-card"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-glow">
              <it.icon className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-semibold">{it.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{it.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
