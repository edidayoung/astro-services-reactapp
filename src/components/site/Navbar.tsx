import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Sparkles, Package, Smartphone, Laptop, Headphones, Wrench, Grid3x3, Star, Menu, X, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/contexts/CartContext";
import { useAllProducts } from "@/lib/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/mock-data";

const categories = [
  { label: "Smartphones", categoryId: "smartphones", icon: Smartphone },
  { label: "Laptops", categoryId: "laptops", icon: Laptop },
  { label: "Audio", categoryId: "audio", icon: Headphones },
  { label: "Accessories", categoryId: "accessories", icon: Package },
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const { cartCount, openCart } = useCart();
  const { data: allProducts = [] } = useAllProducts();

  // Filter products based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const query = searchQuery.toLowerCase().trim();
    
    return allProducts.filter((product: Product) => {
      if (product.name.toLowerCase().includes(query)) return true;
      if (product.description.toLowerCase().includes(query)) return true;
      if (product.brand?.toLowerCase().includes(query)) return true;
      if (product.category.toLowerCase().includes(query)) return true;
      if (product.subcategory?.toLowerCase().includes(query)) return true;
      return false;
    }).slice(0, 8); // Limit to 8 results
  }, [searchQuery, allProducts]);

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
    <>
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
              const isRoute = l.href.startsWith('/');
              
              if (isRoute) {
                return (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      to={l.href}
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
                    {categories.map((cat) => (
                      <Link
                        key={cat.label}
                        to="/category/$categoryId"
                        params={{ categoryId: cat.categoryId }}
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
              const isRoute = l.href.startsWith('/');
              
              if (isRoute) {
                return (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 4) * 0.1, duration: 0.3 }}
                  >
                    <Link
                      to={l.href}
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
            {/* Desktop Search - Inline */}
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="h-11 w-64 rounded-xl border-purple-500/20 bg-surface/60 pl-10 backdrop-blur focus:border-purple-500/40 transition-colors"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchQuery.trim() && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowSearchResults(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-[480px] max-h-[500px] overflow-hidden rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl z-50">
                    {searchResults.length > 0 ? (
                      <>
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-surface/30">
                          <p className="text-sm font-semibold">
                            Found <span className="text-purple-400">{searchResults.length}</span> result{searchResults.length !== 1 ? 's' : ''}
                          </p>
                          <button
                            onClick={() => setShowSearchResults(false)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Results List */}
                        <div className="overflow-y-auto max-h-[400px]">
                          {searchResults.slice(0, 6).map((product: Product) => {
                            const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
                            const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
                            const hasDiscount = product.onSale && product.salePrice;
                            
                            return (
                              <Link
                                key={product.id}
                                to="/category/$categoryId"
                                params={{ categoryId: product.category }}
                                onClick={() => {
                                  setShowSearchResults(false);
                                  setSearchQuery("");
                                }}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-surface/60 transition-colors border-b border-border/30 last:border-0 group cursor-pointer"
                              >
                                {/* Product Thumbnail */}
                                <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-surface/50">
                                  <img
                                    src={primaryImage.url}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                  {!product.inStock && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                      <span className="text-[10px] text-red-400 font-bold">OUT</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium line-clamp-1 group-hover:text-purple-400 transition-colors">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                                    {product.category}
                                  </p>
                                </div>
                                
                                {/* Price */}
                                <div className="flex-shrink-0 text-right">
                                  {hasDiscount ? (
                                    <div>
                                      <p className="text-xs text-muted-foreground line-through">
                                        ₦{product.price.toLocaleString()}
                                      </p>
                                      <p className="text-sm font-bold text-purple-400">
                                        ₦{displayPrice.toLocaleString()}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-sm font-bold text-purple-400">
                                      ₦{displayPrice.toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                        
                        {/* Footer - View All */}
                        {searchResults.length > 6 && (
                          <div className="px-4 py-3 border-t border-border/50 bg-surface/30">
                            <button
                              onClick={() => {
                                // Could navigate to a search results page
                                setShowSearchResults(false);
                              }}
                              className="w-full text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
                            >
                              View all {searchResults.length} results →
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="text-4xl mb-3 opacity-50">🔍</div>
                        <p className="text-sm text-muted-foreground">No products found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden flex h-11 w-11 items-center justify-center rounded-xl bg-surface/60 backdrop-blur transition-all hover:bg-surface hover:scale-105"
            >
              <Search className="h-5 w-5 text-purple-400" />
            </button>

            {/* Cart - Modern design with ShoppingBag icon */}
            <button 
              onClick={openCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-surface/60 backdrop-blur transition-all hover:bg-surface hover:scale-105 group"
            >
              <ShoppingBag className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
              {cartCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-1 text-[10px] shadow-lg">
                  {cartCount}
                </Badge>
              )}
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
                        <motion.div
                          key={l.label}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                        >
                          <Link
                            to={l.href}
                            className="group relative flex items-center gap-3 text-lg font-medium transition-all duration-300 hover:text-purple-400 hover:translate-x-2"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className="absolute -inset-3 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
                            <l.icon className="h-5 w-5 text-purple-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                            <span className="relative">{l.label}</span>
                          </Link>
                        </motion.div>
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
                    {categories.map((cat) => (
                      <Link
                        key={cat.label}
                        to="/category/$categoryId"
                        params={{ categoryId: cat.categoryId }}
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
                          <motion.div
                            key={l.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index + categories.length + 1) * 0.1, duration: 0.3 }}
                          >
                            <Link
                              to={l.href}
                              className="group relative flex items-center gap-3 text-lg font-medium transition-all duration-300 hover:text-purple-400 hover:translate-x-2"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span className="absolute -inset-3 -z-10 rounded-xl bg-surface/0 transition-all duration-300 group-hover:bg-surface/60" />
                              <l.icon className="h-5 w-5 text-purple-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                              <span className="relative">{l.label}</span>
                            </Link>
                          </motion.div>
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

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSearchOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 right-0 z-[61] bg-background border-b border-border/50 p-4"
            >
              <div className="container mx-auto">
                <div className="relative flex items-center gap-2">
                  <Search className="absolute left-3 h-5 w-5 text-purple-400 pointer-events-none" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="h-12 pl-10 pr-4 rounded-xl border-purple-500/20 bg-surface/60 backdrop-blur focus:border-purple-500/40 transition-colors"
                  />
                  <button
                    onClick={() => {
                      setMobileSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface/60 hover:bg-surface transition-colors flex-shrink-0"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Mobile Search Results */}
                {searchQuery.trim() && (
                  <div className="mt-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <>
                        <p className="text-sm font-semibold mb-4">
                          Found <span className="text-purple-400">{searchResults.length}</span> result{searchResults.length !== 1 ? 's' : ''}
                        </p>
                        
                        {/* Compact List */}
                        <div className="space-y-2">
                          {searchResults.slice(0, 8).map((product: Product) => {
                            const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
                            const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
                            const hasDiscount = product.onSale && product.salePrice;
                            
                            return (
                              <Link
                                key={product.id}
                                to="/category/$categoryId"
                                params={{ categoryId: product.category }}
                                onClick={() => {
                                  setMobileSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-surface/30 hover:bg-surface/60 transition-colors"
                              >
                                {/* Product Thumbnail */}
                                <div className="relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-surface/50">
                                  <img
                                    src={primaryImage.url}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                  {!product.inStock && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                      <span className="text-[9px] text-red-400 font-bold">OUT</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium line-clamp-1">
                                    {product.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {product.category}
                                  </p>
                                </div>
                                
                                {/* Price */}
                                <div className="flex-shrink-0 text-right">
                                  {hasDiscount ? (
                                    <div>
                                      <p className="text-xs text-muted-foreground line-through">
                                        ₦{product.price.toLocaleString()}
                                      </p>
                                      <p className="text-sm font-bold text-purple-400">
                                        ₦{displayPrice.toLocaleString()}
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-sm font-bold text-purple-400">
                                      ₦{displayPrice.toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="text-4xl mb-3 opacity-50">🔍</div>
                        <p className="text-sm text-muted-foreground">No products found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
