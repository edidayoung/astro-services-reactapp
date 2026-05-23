import { motion } from "framer-motion";
import { Search, ShoppingCart, ChevronDown, Wifi, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { label: "Home", href: "#home" },
  { label: "New Arrivals", href: "#new-arrivals" },
  { label: "Categories", href: "#categories", chevron: true },
  { label: "Reviews", href: "#reviews" },
  { label: "Deals", href: "#deals" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-20 items-center gap-6 px-4">
        <a href="#home" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Wifi className="h-5 w-5 text-primary-foreground rotate-45" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold">Astro Services</div>
            <div className="text-[11px] text-muted-foreground">Premium Electronics Store</div>
          </div>
        </a>

        <nav className="ml-6 hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {l.label}
              {l.chevron && <ChevronDown className="h-3.5 w-3.5" />}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-gradient-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="h-11 w-64 rounded-xl border-border/60 bg-surface/60 pl-10 backdrop-blur"
            />
          </div>

          <button className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-surface/60 backdrop-blur transition-colors hover:bg-surface">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-gradient-primary px-1 text-[10px]">
              0
            </Badge>
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="glass" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <nav className="mt-10 flex flex-col gap-4">
                {links.map((l) => (
                  <a key={l.label} href={l.href} className="text-lg font-medium">
                    {l.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
