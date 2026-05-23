import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-gradient-card p-8 shadow-card md:flex-row md:gap-8"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
          <Mail className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-display text-2xl font-bold">Stay Updated with Amazing Deals</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Subscribe to our newsletter and never miss out on exclusive offers and new arrivals.
          </p>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full max-w-md items-center gap-2"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            className="h-12 rounded-xl border-border/60 bg-surface/60 backdrop-blur"
          />
          <Button variant="hero" size="lg" type="submit">
            Subscribe
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
