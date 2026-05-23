import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const items = [
  {
    quote: "Amazing service and fast delivery! Got my laptop in perfect condition.",
    name: "Emily Johnson",
    city: "Lagos, Nigeria",
  },
  {
    quote: "Best prices I've seen for original products. Highly recommended!",
    name: "David Okafor",
    city: "Abuja, Nigeria",
  },
  {
    quote: "Their customer support is excellent. Very responsive and helpful.",
    name: "Aisha Bello",
    city: "Kano, Nigeria",
  },
  {
    quote: "Quality is top notch. I always come back for more gadgets.",
    name: "Chinedu Eze",
    city: "Enugu, Nigeria",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="container mx-auto px-4 py-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold tracking-[0.25em] text-primary-glow">
          WHAT OUR CUSTOMERS SAY
        </p>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          Trusted by Hundreds of Happy Customers
        </h2>
      </div>

      <Carousel opts={{ align: "start", loop: true }}>
        <CarouselContent>
          {items.map((t, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex h-full flex-col rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-card"
              >
                <Quote className="h-7 w-7 text-primary-glow" />
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm text-foreground/90">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary font-display text-sm font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.city}</div>
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
