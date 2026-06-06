import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/contexts/CartContext";

export function CartModal() {
  const { cart, cartCount, cartTotal, removeFromCart, isCartOpen, closeCart, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    // Build WhatsApp message
    let message = '🛒 *ORDER REQUEST*\n\n';
    message += 'Hi! I would like to place an order for the following items:\n\n';

    cart.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*\n`;
      message += `💰 Price: ${formatPrice(item.price)}\n`;
      message += `📦 Quantity: ${item.quantity}\n`;
      
      // Include image URL if it's a full URL
      if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
        message += `🖼️ Product Image: ${item.image}\n`;
      }
      
      message += `\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💵 *Total Amount: ${formatPrice(cartTotal)}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `💳 *Payment Details*\n\n`;
    message += `Please confirm your account info for payments...\n\n`;
    message += `🏦 Bank: Opay\n`;
    message += `👤 Account Name: Akanimo Ekpanya\n`;
    message += `🔢 Account Number: 9133993369\n\n`;
    message += `Thank you 🙏`;

    const phoneNumber = '2349133993369';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Show instruction notification
    setTimeout(() => {
      closeCart();
      clearCart();
    }, 500);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000]"
          />

          {/* Cart Modal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-border/50 shadow-2xl z-[2001] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-purple-400" />
                Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="rounded-full p-2 hover:bg-purple-500/10 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    Add some products to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 rounded-xl border border-border/50 bg-surface/30 p-4 hover:border-purple-500/50 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/5 to-blue-500/5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=Product';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-purple-400">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-xs text-purple-400">
                              • Total: {formatPrice(item.price * item.quantity)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex-shrink-0 rounded-full p-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border/50 p-6 space-y-4 bg-surface/50 backdrop-blur">
                {/* Total */}
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-purple-400">{formatPrice(cartTotal)}</span>
                </div>

                {/* Checkout Button */}
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 shadow-lg shadow-green-500/30 text-lg font-semibold"
                  onClick={handleCheckout}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Checkout on WhatsApp
                </Button>

                {/* Item Count */}
                <p className="text-center text-sm text-muted-foreground">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
