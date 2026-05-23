import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import mobile from "@/assets/cat-mobile.png";
import laptop from "@/assets/cat-laptop.png";
import audio from "@/assets/cat-audio.png";
import gaming from "@/assets/cat-gaming.png";
import accessories from "@/assets/cat-accessories.png";
import smart from "@/assets/cat-smart.png";

const cats = [
  { name: "Mobile Phones", img: mobile },
  { name: "Laptops", img: laptop },
  { name: "Audio", img: audio },
  { name: "Gaming", img: gaming },
  { name: "Accessories", img: accessories },
  { name: "Smart Devices", img: smart },
];

export function Categories() {
  return (
    <section id="categories" className="container mx-auto px-4 py-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-primary-glow">
          EXPLORE BY CATEGORY
        </p>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">Find What You Need</h2>
        <p className="mt-3 text-muted-foreground">
          Browse our wide range of high-quality electronics
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cats.map((c, i) => (
          <motion.a
            key={c.name}
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-5 shadow-card transition-colors hover:border-primary/60"
          >
            <div className="relative mb-3 flex aspect-square items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30" />
              <img
                src={c.img}
                alt={c.name}
                width={640}
                height={640}
                loading="lazy"
                className="relative max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="font-display text-sm font-semibold">{c.name}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-primary-glow">
              View All <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
