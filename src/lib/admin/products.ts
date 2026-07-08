// Admin Product Management Functions
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDocs,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Product } from '../mock-data';

export interface NewProductData {
  name: string;
  description: string;
  price: number;
  onSale: boolean;
  salePrice?: number;
  category: 'smartphones' | 'laptops' | 'audio' | 'accessories';
  subcategory: string;
  platform?: 'ios' | 'android';
  brand?: string;
  images: Array<{
    url: string;
    isPrimary: boolean;
    order: number;
  }>;
  badges: string[];
  inStock: boolean;
}

// Add new product
export async function addProduct(productData: NewProductData): Promise<string> {
  try {
    // Clean up undefined fields - Firebase doesn't accept undefined values
    const cleanData: any = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      onSale: productData.onSale,
      category: productData.category,
      subcategory: productData.subcategory,
      images: productData.images,
      badges: productData.badges,
      inStock: productData.inStock,
      id: `product-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Only add optional fields if they have values
    if (productData.salePrice !== undefined && productData.salePrice !== null) {
      cleanData.salePrice = productData.salePrice;
    }
    
    if (productData.platform) {
      cleanData.platform = productData.platform;
    }
    
    if (productData.brand) {
      cleanData.brand = productData.brand;
    }
    
    const docRef = await addDoc(collection(db, 'products'), cleanData);
    
    console.log('✅ Product added:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding product:', error);
    throw error;
  }
}

// Update existing product
export async function updateProduct(
  firebaseId: string, 
  productData: Partial<NewProductData>
): Promise<void> {
  try {
    // Clean up undefined fields - Firebase doesn't accept undefined values
    const cleanData: any = {
      updatedAt: Date.now(),
    };

    // Only add fields that have values
    if (productData.name !== undefined) cleanData.name = productData.name;
    if (productData.description !== undefined) cleanData.description = productData.description;
    if (productData.price !== undefined) cleanData.price = productData.price;
    if (productData.onSale !== undefined) cleanData.onSale = productData.onSale;
    if (productData.category !== undefined) cleanData.category = productData.category;
    if (productData.subcategory !== undefined) cleanData.subcategory = productData.subcategory;
    if (productData.images !== undefined) cleanData.images = productData.images;
    if (productData.badges !== undefined) cleanData.badges = productData.badges;
    if (productData.inStock !== undefined) cleanData.inStock = productData.inStock;
    
    // Handle optional fields - only add if they have actual values
    if (productData.salePrice !== undefined && productData.salePrice !== null) {
      cleanData.salePrice = productData.salePrice;
    }
    
    if (productData.platform) {
      cleanData.platform = productData.platform;
    }
    
    if (productData.brand) {
      cleanData.brand = productData.brand;
    }
    
    const docRef = doc(db, 'products', firebaseId);
    await updateDoc(docRef, cleanData);
    
    console.log('✅ Product updated:', firebaseId);
  } catch (error) {
    console.error('❌ Error updating product:', error);
    throw error;
  }
}

// Delete product
export async function deleteProduct(firebaseId: string): Promise<void> {
  try {
    const docRef = doc(db, 'products', firebaseId);
    await deleteDoc(docRef);
    
    console.log('✅ Product deleted:', firebaseId);
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    throw error;
  }
}

// Toggle stock status
export async function toggleProductStock(
  firebaseId: string, 
  inStock: boolean
): Promise<void> {
  try {
    const docRef = doc(db, 'products', firebaseId);
    await updateDoc(docRef, {
      inStock,
      updatedAt: Date.now()
    });
    
    console.log('✅ Product stock toggled:', firebaseId, inStock);
  } catch (error) {
    console.error('❌ Error toggling stock:', error);
    throw error;
  }
}

// Bulk delete products
export async function bulkDeleteProducts(firebaseIds: string[]): Promise<void> {
  try {
    const deletePromises = firebaseIds.map(id => 
      deleteDoc(doc(db, 'products', id))
    );
    
    await Promise.all(deletePromises);
    console.log(`✅ Bulk deleted ${firebaseIds.length} products`);
  } catch (error) {
    console.error('❌ Error bulk deleting:', error);
    throw error;
  }
}

// Bulk toggle stock
export async function bulkToggleStock(
  firebaseIds: string[], 
  inStock: boolean
): Promise<void> {
  try {
    const updatePromises = firebaseIds.map(id => 
      updateDoc(doc(db, 'products', id), {
        inStock,
        updatedAt: Date.now()
      })
    );
    
    await Promise.all(updatePromises);
    console.log(`✅ Bulk toggled stock for ${firebaseIds.length} products`);
  } catch (error) {
    console.error('❌ Error bulk toggling:', error);
    throw error;
  }
}
