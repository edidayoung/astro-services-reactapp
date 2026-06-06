import { motion } from "framer-motion";
import { ShoppingCart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/mock-data";
import { useState } from "react";
import { useCart } from "@/lib/contexts/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { addToCart } = useCart();
  
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const displayPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
  const hasDiscount = product.onSale && product.salePrice;
  const hasMultipleImages = product.images.length > 1;

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleCardClick = () => {
    setShowImageModal(true);
    setCurrentImageIndex(0);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  const openDetailsFromGallery = () => {
    setShowImageModal(false);
    setTimeout(() => setShowDetailsModal(true), 100);
  };

  const openGalleryFromDetails = () => {
    setShowDetailsModal(false);
    setTimeout(() => setShowImageModal(true), 100);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-surface/30 backdrop-blur transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-2 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Badges - Top Left, Side by Side */}
        {product.badges.length > 0 && (
          <div className="absolute left-2 top-2 z-10 flex gap-1">
            {product.badges.includes('hot') && (
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg text-[10px] px-1.5 py-0.5 h-5">
                HOT
              </Badge>
            )}
            {product.badges.includes('new') && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg text-[10px] px-1.5 py-0.5 h-5">
                NEW
              </Badge>
            )}
          </div>
        )}

        {/* Product Image - Cover style */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-500/5 to-blue-500/5">
          <img
            src={primaryImage.url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Image Count Badge - Bottom Right */}
          {hasMultipleImages && (
            <div className="absolute right-2 bottom-2 z-10">
              <Badge variant="secondary" className="bg-black/70 text-white backdrop-blur text-[10px] px-2 py-0.5 h-5">
                📷 {product.images.length}
              </Badge>
            </div>
          )}
          
          {/* Stock Status Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <Badge variant="destructive" className="text-lg">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="mb-2 line-clamp-1 font-semibold text-foreground group-hover:text-purple-400 transition-colors text-sm">
            {product.name}
          </h3>

          <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
            {product.description}
          </p>

          {/* Price & Action */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              <span className="text-lg font-bold text-purple-400">
                {formatPrice(displayPrice)}
              </span>
            </div>

            <Button
              size="icon"
              className="bg-gradient-primary hover:opacity-90 transition-opacity h-9 w-9"
              disabled={!product.inStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-transparent" />
        </div>
      </motion.div>

      {/* Image Gallery Modal - Like main site */}
      {showImageModal && (
        <div 
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={closeImageModal}
        >
          <div 
            className="relative w-[90%] max-w-[800px] max-h-[85vh] flex flex-col gap-4 pt-[60px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="fixed top-5 right-5 z-[3002] w-11 h-11 rounded-full bg-white/15 border-2 border-white/40 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:rotate-90 flex items-center justify-center"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main Image */}
            <div className="relative w-full h-[50vh] max-h-[500px] bg-black/50 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={product.images[currentImageIndex].url}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-white/10 border-2 border-white/30 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 flex items-center justify-center"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-5 top-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full bg-white/10 border-2 border-white/30 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110 flex items-center justify-center"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-5 py-2 text-sm font-semibold text-white backdrop-blur-md">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {hasMultipleImages && (
              <div className="flex gap-3 justify-center flex-wrap px-5">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-3 transition-all ${
                      idx === currentImageIndex
                        ? 'border-purple-500 opacity-100 shadow-[0_0_0_2px_rgba(139,92,246,0.3)]'
                        : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* View Product Details Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 shadow-[0_5px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_8px_30px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 transition-all"
                onClick={openDetailsFromGallery}
              >
                <Info className="mr-2 h-5 w-5" />
                View Product Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal - Like main site */}
      {showDetailsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeDetailsModal}
        >
          <div 
            className="relative max-w-lg w-full max-h-[90vh] bg-surface/95 backdrop-blur rounded-2xl border border-border/50 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeDetailsModal}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-2 text-white backdrop-blur transition-all hover:bg-black/40"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Fixed Header Section */}
            <div className="flex-shrink-0 p-6 pb-4 border-b border-border/30">
              {/* Product Name */}
              <h2 className="text-2xl font-bold mb-4 pr-8">{product.name}</h2>

              {/* Price Row with Action Buttons */}
              <div className="flex items-center justify-between">
                <div>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-muted-foreground line-through block">
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-purple-400">
                          {formatPrice(displayPrice)}
                        </span>
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          SALE
                        </Badge>
                      </div>
                    </>
                  )}
                  {!hasDiscount && (
                    <span className="text-3xl font-bold text-purple-400">
                      {formatPrice(displayPrice)}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    className="bg-gradient-primary hover:opacity-90 h-12 w-12"
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                    title="Add to Cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-12 w-12"
                    onClick={openGalleryFromDetails}
                    title="View Images"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>

            {/* Scrollable Description Section */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 sticky top-0 bg-surface/95 backdrop-blur pb-2 pt-1">
                <Info className="h-4 w-4 text-purple-400" />
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
