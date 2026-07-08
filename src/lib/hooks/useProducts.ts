import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import type { Product } from '../mock-data';

// Fetch all products from Firebase
async function fetchProducts(): Promise<Product[]> {
  try {
    console.log('Fetching products from Firebase...');
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    
    const products: Product[] = [];
    
    productsSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Transform Firebase data to match our Product interface
      const product: Product = {
        id: data.id || doc.id,
        firebaseId: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        onSale: data.onSale || false,
        salePrice: data.salePrice,
        category: data.category,
        subcategory: data.subcategory || (data.category === 'smartphones' ? data.platform || 'android' : 'all'),
        platform: data.platform,
        brand: data.brand,
        // Handle both old single image and new multi-image format
        images: data.images || (data.image ? [{
          url: data.image,
          isPrimary: true,
          order: 0
        }] : []),
        badges: data.badges || (data.badge ? [data.badge] : []),
        inStock: data.inStock !== false, // Default to true if not specified
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now()
      };
      
      // Validate and warn about missing fields
      if (!product.subcategory) {
        console.warn(`Product ${product.id} missing subcategory field`);
      }
      
      if (product.category === 'smartphones' && 
          product.platform === 'android' && 
          !product.brand) {
        console.warn(`Android product ${product.id} missing brand field`);
      }
      
      products.push(product);
    });
    
    // Sort by creation date - newest first
    products.sort((a, b) => {
      const aTime = a.createdAt || 0;
      const bTime = b.createdAt || 0;
      
      if (aTime && bTime) {
        return bTime - aTime;
      }
      
      if (aTime && !bTime) return -1;
      if (!aTime && bTime) return 1;
      
      return 0;
    });
    
    console.log(`✅ Loaded ${products.length} products from Firebase`);
    return products;
    
  } catch (error) {
    console.error('❌ Error loading products from Firebase:', error);
    throw error;
  }
}

// Hook to fetch all products
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

// Hook to fetch products by category
export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    select: (data) => data.filter(p => p.category === category && p.inStock),
  });
}

// Hook to fetch products by subcategory
export function useProductsBySubcategory(category: string, subcategory: string) {
  const { data: allProducts, ...rest } = useProducts();
  
  const products = allProducts?.filter(p => {
    if (!p.inStock) return false;
    if (p.category !== category) return false;
    if (subcategory === 'all') return true;
    return p.subcategory === subcategory;
  }) || [];
  
  return {
    data: products,
    ...rest
  };
}

// Hook to get featured/newest products
export function useFeaturedProducts(limit: number = 8) {
  const { data: allProducts, ...rest } = useProducts();
  
  const products = allProducts
    ?.filter(p => p.inStock)
    .slice(0, limit) || [];
  
  return {
    data: products,
    ...rest
  };
}

// Hook to fetch all products (for search functionality)
export function useAllProducts() {
  return useProducts();
}
