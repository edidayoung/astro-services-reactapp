import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-products.png";
import { useState, useEffect } from "react";

const shopWords = ["Shop", "Plug", "Vault", "Spot", "Mart"];

export function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % shopWords.length);
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="container mx-auto grid gap-12 px-4 pb-16 pt-4 lg:grid-cols-2 lg:gap-8 lg:pt-8">
        {/* Left - Updated text styling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 flex flex-col justify-center"
        >
          {/* Top badge - matching your main site */}
          <p className="mb-6 text-xs font-bold tracking-[0.25em] text-purple-400 uppercase">
            PREMIUM QUALITY • BEST PRICES
          </p>
          
          {/* Main heading - with animated "Shop" word */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-white">Your One-Stop </span>
            
            {/* Animated word container - no fixed width */}
            <span className="inline-block relative align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={shopWords[currentWordIndex]}
                  initial={{ 
                    opacity: 0,
                    filter: "blur(10px)",
                    scale: 0.8,
                    x: -30
                  }}
                  animate={{ 
                    opacity: 1,
                    filter: "blur(0px)",
                    scale: 1,
                    x: 0
                  }}
                  exit={{ 
                    opacity: 0,
                    filter: "blur(10px)",
                    scale: 1.2,
                    x: 50,
                    transition: { duration: 0.6 }
                  }}
                  transition={{ 
                    duration: 0.7,
                    ease: "easeOut"
                  }}
                  className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent inline-block"
                >
                  {shopWords[currentWordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            
            <span className="text-white"> for Premium </span>
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Electronics
            </span>
          </h1>
          
          {/* Description with highlighted keywords - matching your main site */}
          <p className="text-lg text-gray-400 max-w-2xl mb-8 leading-relaxed">
            Discover the latest in mobile devices, laptops, gaming gear, and audio equipment all at unbeatable prices, with{" "}
            <span className="text-green-400 font-semibold">free delivery</span>
            {" "}and{" "}
            <span className="text-orange-400 font-semibold">reliable product warranty</span>
            {" "}on every purchase.
          </p>

          {/* CTA Buttons - Updated aesthetic */}
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-8 py-6 text-base rounded-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 border-0"
            >
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              className="bg-transparent border-2 border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold px-8 py-6 text-base rounded-lg backdrop-blur-sm transition-all duration-300"
            >
              <MessageCircle className="mr-2 h-5 w-5" /> Chat on WhatsApp
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
