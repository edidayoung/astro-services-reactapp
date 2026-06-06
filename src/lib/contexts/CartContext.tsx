import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/lib/mock-data';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('astroServicesCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('astroServicesCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
    const effectivePrice = (product.onSale && product.salePrice) ? product.salePrice : product.price;
    
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // Item exists, increment quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        toast.success(`${product.name} quantity increased!`, { 
          id: `cart-${product.id}`,
          duration: 2000 
        });
        return newCart;
      } else {
        // New item, add to cart
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: effectivePrice,
          originalPrice: (product.onSale && product.salePrice) ? product.price : undefined,
          image: primaryImage.url,
          quantity: 1,
        };
        toast.success(`${product.name} added to cart!`, { 
          id: `cart-${product.id}`,
          duration: 2000 
        });
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.info('Item removed from cart', { duration: 1500 });
  };

  const clearCart = () => {
    setCart([]);
    toast.info('Cart cleared', { duration: 1500 });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
