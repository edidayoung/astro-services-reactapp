import { motion } from "framer-motion";
import { Search, ShoppingBag, Sparkles, Package, Smartphone, Laptop, Headphones, Wrench, Grid3x3, Star, Menu, X, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

const categories = [
  { label: "Smartphones", href: "/category/smartphones", icon: Smartphone },
  { label: "Laptops", href: "/category/laptops", icon: Laptop },
  { label: "Audio", href: "/category/audio", icon: Headphones },
  { label: "Accessories", href: "/category/accessories", icon: Package },
];

const linksBeforeCategories = [
  { label: "New Arrivals", href: "#new-arrivals", icon: Sparkles },
  { label: "Reviews", href: "#reviews", icon: Star },
  { label: "AstroFix", href: "/category/astrofix", icon: Wrench },
];

const linksAfterCategories = [
  { label: "About Us", href: "#about", icon: Info },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  // Smooth scroll to section
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-20 items-center gap-6 px-4">
        {/* Logo - Now acts as Home button */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-transform group-hover:scale-105">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold">Astro Services</div>
            <div className="text-[11px] text-muted-foreground">Premium Electronics Store</div>
          </div>
        </Link>

        {/* Desktop Navigation - with modern hover effects */}
        <nav className="ml-6 hidden items-center gap-7 lg:flex">
          {/* Links before Categories */}
          {linksBeforeCategories.map((l, index) => {
            const isAnchor = l.href.startsWith('#');
            const isRoute = l.href.startsWith('/');
            
            if (isRoute) {
              return (
                <motion.div key={l.label}>
                  <Link
                    to={l.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="group relative flex items-center gap-2 text-sm font-medium text-foreground/80 transition-all duration-300 hover:text-foreground"
                  >
                    {/* Background glow effect */}
                    <span className="absolute -inset-2 -z-10 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-blue-500/0 opacity-0 blur-lg transition-all duration-500 group-hover:from-purple-500/20 group-hover:via-purple-500/10 group-hover:to-blue-500/20 group-hover:opacity-100" />
                    
                    {/* Background highlight */}
                    <span className="absolute -inset-2 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
                    
                    {/* Icon with bounce animation */}
                    <l.icon className="h-4 w-4 text-purple-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:text-purple-300" />
                    
                    {/* Text */}
                    <span className="relative">
                      {l.label}
                    </span>
                  </Link>
                </motion.div>
              );
            }
            
            return (
              <motion.a
                key={l.label}
                href={l.href}
                onClick={(e) => scrollToSection(e, l.href)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="group relative flex items-center gap-2 text-sm font-medium text-foreground/80 transition-all duration-300 hover:text-foreground cursor-pointer"
              >
                {/* Background glow effect */}
                <span className="absolute -inset-2 -z-10 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-blue-500/0 opacity-0 blur-lg transition-all duration-500 group-hover:from-purple-500/20 group-hover:via-purple-500/10 group-hover:to-blue-500/20 group-hover:opacity-100" />
                
                {/* Background highlight */}
                <span className="absolute -inset-2 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
                
                {/* Icon with bounce animation */}
                <l.icon className="h-4 w-4 text-purple-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:text-purple-300" />
                
                {/* Text */}
                <span className="relative">
                  {l.label}
                </span>
              </motion.a>
            );
          })}
          
          {/* Categories Dropdown - positioned after New Arrivals */}
          <div 
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="group relative flex items-center gap-2 text-sm font-medium text-foreground/80 transition-all duration-300 hover:text-foreground cursor-pointer"
            >
              {/* Background glow effect */}
              <span className="absolute -inset-2 -z-10 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-blue-500/0 opacity-0 blur-lg transition-all duration-500 group-hover:from-purple-500/20 group-hover:via-purple-500/10 group-hover:to-blue-500/20 group-hover:opacity-100" />
              
              {/* Background highlight */}
              <span className="absolute -inset-2 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
              
              {/* Icon with bounce animation */}
              <Grid3x3 className="h-4 w-4 text-purple-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:text-purple-300" />
              
              {/* Text */}
              <span className="relative">
                Categories
              </span>
              
              <ChevronDown className={`h-3.5 w-3.5 text-purple-400 transition-all duration-300 ${categoriesOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            
            {/* Dropdown Menu with padding area to prevent closing */}
            <div className={`absolute left-0 top-full ${categoriesOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              {/* Invisible padding area to keep dropdown open */}
              <div className="h-2 w-full" />
              
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: categoriesOpen ? 1 : 0,
                  y: categoriesOpen ? 0 : -10,
                }}
                transition={{ duration: 0.2 }}
                className="w-56 rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl"
              >
                <div className="p-2">
                  {categories.map((cat, index) => (
                    <Link
                      key={cat.label}
                      to={cat.href}
                      className="group/item relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground/80 transition-all duration-200 hover:bg-surface/60 hover:text-foreground cursor-pointer"
                    >
                      {/* Icon */}
                      <cat.icon className="h-4 w-4 text-purple-400 transition-all duration-200 group-hover/item:scale-110 group-hover/item:text-purple-300" />
                      
                      {/* Label */}
                      <span>{cat.label}</span>
                      
                      {/* Hover indicator */}
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Links after Categories */}
          {linksAfterCategories.map((l, index) => {
            const isAnchor = l.href.startsWith('#');
            const isRoute = l.href.startsWith('/');
            
            if (isRoute) {
              return (
                <motion.div key={l.label}>
                  <Link
                    to={l.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 4) * 0.1, duration: 0.3 }}
                    className="group relative flex items-center gap-2 text-sm font-medium text-foreground/80 transition-all duration-300 hover:text-foreground"
                  >
                    {/* Background glow effect */}
                    <span className="absolute -inset-2 -z-10 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-blue-500/0 opacity-0 blur-lg transition-all duration-500 group-hover:from-purple-500/20 group-hover:via-purple-500/10 group-hover:to-blue-500/20 group-hover:opacity-100" />
                    
                    {/* Background highlight */}
                    <span className="absolute -inset-2 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
                    
                    {/* Icon with bounce animation */}
                    <l.icon className="h-4 w-4 text-purple-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:text-purple-300" />
                    
                    {/* Text */}
                    <span className="relative">
                      {l.label}
                    </span>
                  </Link>
                </motion.div>
              );
            }
            
            return (
              <motion.a
                key={l.label}
                href={l.href}
                onClick={(e) => scrollToSection(e, l.href)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 4) * 0.1, duration: 0.3 }}
                className="group relative flex items-center gap-2 text-sm font-medium text-foreground/80 transition-all duration-300 hover:text-foreground cursor-pointer"
              >
                {/* Background glow effect */}
                <span className="absolute -inset-2 -z-10 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-blue-500/0 opacity-0 blur-lg transition-all duration-500 group-hover:from-purple-500/20 group-hover:via-purple-500/10 group-hover:to-blue-500/20 group-hover:opacity-100" />
                
                {/* Background highlight */}
                <span className="absolute -inset-2 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
                
                {/* Icon with bounce animation */}
                <l.icon className="h-4 w-4 text-purple-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:text-purple-300" />
                
                {/* Text */}
                <span className="relative">
                  {l.label}
                </span>
              </motion.a>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-3">
          {/* Search - Modern design */}
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
            <Input
              placeholder="Search products..."
              className="h-11 w-64 rounded-xl border-purple-500/20 bg-surface/60 pl-10 backdrop-blur focus:border-purple-500/40 transition-colors"
            />
          </div>

          {/* Cart - Modern design with ShoppingBag icon */}
          <button className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-surface/60 backdrop-blur transition-all hover:bg-surface hover:scale-105 group">
            <ShoppingBag className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-gradient-primary px-1 text-[10px] shadow-lg">
              0
            </Badge>
          </button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden h-11 w-11 rounded-xl hover:bg-surface/60"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l border-border/50">
              <nav className="mt-10 flex flex-col gap-4">
                {/* Links before categories */}
                {linksBeforeCategories.map((l, index) => {
                  const isRoute = l.href.startsWith('/');
                  
                  if (isRoute) {
                    return (
                      <Link
                        key={l.label}
                        to={l.href}
                        className="group relative flex items-center gap-3 text-lg font-medium transition-all duration-300 hover:text-purple-400 hover:translate-x-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="absolute -inset-3 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
                        <l.icon className="h-5 w-5 text-purple-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="relative">{l.label}</span>
                      </Link>
                    );
                  }
                  
                  return (
                    <motion.a 
                      key={l.label} 
                      href={l.href}
                      onClick={(e) => {
                        scrollToSection(e, l.href);
                        setMobileMenuOpen(false);
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="group relative flex items-center gap-3 text-lg font-medium transition-all duration-300 hover:text-purple-400 hover:translate-x-2 cursor-pointer"
                    >
                      <span className="absolute -inset-3 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
                      <l.icon className="h-5 w-5 text-purple-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                      <span className="relative">{l.label}</span>
                    </motion.a>
                  );
                })}
                
                {/* Categories Section in Mobile */}
                <div className="border-t border-border/50 pt-4">
                  <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground px-3">
                    Categories
                  </p>
                  {categories.map((cat, index) => (
                    <Link
                      key={cat.label}
                      to={cat.href}
                      className="group relative flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-all duration-300 hover:bg-surface/60 hover:text-purple-400 hover:translate-x-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {/* Background highlight */}
                      <span className="absolute -inset-2 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
                      
                      {/* Icon */}
                      <cat.icon className="h-5 w-5 text-purple-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                      
                      {/* Text */}
                      <span className="relative">
                        {cat.label}
                      </span>
                    </Link>
                  ))}
                </div>
                
                {/* Links after categories */}
                <div className="border-t border-border/50 pt-4">
                  {linksAfterCategories.map((l, index) => {
                    const isRoute = l.href.startsWith('/');
                    
                    if (isRoute) {
                      return (
                        <Link
                          key={l.label}
                          to={l.href}
                          className="group relative flex items-center gap-3 text-lg font-medium transition-all duration-300 hover:text-purple-400 hover:translate-x-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="absolute -inset-3 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
                          <l.icon className="h-5 w-5 text-purple-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                          <span className="relative">{l.label}</span>
                        </Link>
                      );
                    }
                    
                    return (
                      <motion.a 
                        key={l.label} 
                        href={l.href}
                        onClick={(e) => {
                          scrollToSection(e, l.href);
                          setMobileMenuOpen(false);
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index + categories.length + 1) * 0.1, duration: 0.3 }}
                        className="group relative flex items-center gap-3 text-lg font-medium transition-all duration-300 hover:text-purple-400 hover:translate-x-2 cursor-pointer"
                      >
                        <span className="absolute -inset-3 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
                        <l.icon className="h-5 w-5 text-purple-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="relative">{l.label}</span>
                      </motion.a>
                    );
                  })}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
