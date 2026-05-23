import { motion } from "framer-motion";
import { Truck, ShieldCheck, Headset, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-products.png";

const trustItems = [
  { icon: Truck, title: "Free Delivery", sub: "Nationwide" },
  { icon: ShieldCheck, title: "Warranty", sub: "On Every Product" },
  { icon: Headset, title: "24/7 Support", sub: "We're Here" },
];

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="container mx-auto grid gap-12 px-4 pb-16 pt-12 lg:grid-cols-2 lg:gap-8 lg:pt-20">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col justify-center"
        >
          <p className="mb-5 text-xs font-semibold tracking-[0.25em] text-primary-glow">
            PREMIUM QUALITY • BEST PRICES
          </p>
          <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            Your One-Stop Hub <br /> for Premium <br />
            <span className="text-gradient-primary">Electronics</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground">
            Discover the latest in mobile devices, laptops, gaming gear, and audio equipment at unbeatable prices.
          </p>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap gap-4">
            {trustItems.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/50 px-4 py-3 backdrop-blur"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary-glow">
                  <t.icon className="h-4 w-4" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="hero" size="xl">
              Shop Now <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="glass" size="xl">
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </Button>
          </div>
        </motion.div>

        {/* Right — hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative flex items-center justify-center"
        >
          {/* Glow */}
          <div className="absolute inset-0 hero-glow" />
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 [mask-image:linear-gradient(180deg,white,transparent_70%)]" />

          {/* Floating spheres */}
          {[
            { x: "10%", y: "20%", size: 14, delay: 0 },
            { x: "85%", y: "15%", size: 10, delay: 0.5 },
            { x: "90%", y: "60%", size: 16, delay: 1 },
            { x: "5%", y: "75%", size: 12, delay: 0.3 },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-primary shadow-glow"
              style={{ left: s.x, top: s.y, width: s.size, height: s.size }}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          <motion.img
            src={heroImg}
            alt="Premium electronics: laptop, smartphone, headphones and JBL speaker"
            width={1024}
            height={1024}
            className="relative z-10 max-h-[560px] w-full object-contain drop-shadow-[0_20px_60px_oklch(0.62_0.24_295/0.5)]"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Podium */}
          <div className="absolute bottom-4 left-1/2 h-3 w-[70%] -translate-x-1/2 rounded-full bg-gradient-primary opacity-70 blur-md" />
        </motion.div>
      </div>
    </section>
  );
}
