// Repair Case Types and Functions
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface RepairImage {
  url: string;
  order: number;
}

export interface RepairCase {
  id: string;
  title: string;
  description: string;
  category: string;
  deviceType: string;
  deviceBrand?: string;
  deviceModel?: string;
  beforeImages: RepairImage[];
  afterImages: RepairImage[];
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  visible: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface RepairCaseInput {
  title: string;
  description: string;
  category: string;
  deviceType: string;
  deviceBrand?: string;
  deviceModel?: string;
  beforeImages: RepairImage[];
  afterImages: RepairImage[];
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  visible: boolean;
}

// Create a new repair case
export async function createRepairCase(data: RepairCaseInput): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'repairs'), {
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating repair case:', error);
    throw error;
  }
}

// Update a repair case
export async function updateRepairCase(id: string, data: Partial<RepairCaseInput>): Promise<void> {
  try {
    const docRef = doc(db, 'repairs', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error updating repair case:', error);
    throw error;
  }
}

// Delete a repair case
export async function deleteRepairCase(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'repairs', id));
  } catch (error) {
    console.error('Error deleting repair case:', error);
    throw error;
  }
}

// Fetch all repair cases
export async function fetchRepairCases(): Promise<RepairCase[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'repairs'));
    const repairs: RepairCase[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Handle backward compatibility: convert old schema to new schema
      let beforeImages: RepairImage[] = [];
      let afterImages: RepairImage[] = [];
      
      // Check if old schema (single image strings)
      if (typeof data.beforeImage === 'string' && data.beforeImage) {
        beforeImages = [{ url: data.beforeImage, order: 0 }];
      } else if (Array.isArray(data.beforeImages)) {
        beforeImages = data.beforeImages;
      }
      
      if (typeof data.afterImage === 'string' && data.afterImage) {
        afterImages = [{ url: data.afterImage, order: 0 }];
      } else if (Array.isArray(data.afterImages)) {
        afterImages = data.afterImages;
      }
      
      // Handle old deviceType mapping
      const deviceType = data.deviceType || data.device || 'Unknown Device';
      
      repairs.push({
        id: doc.id,
        title: data.title || 'Untitled Repair',
        description: data.description || '',
        category: data.category || 'other',
        deviceType: deviceType,
        deviceBrand: data.deviceBrand || data.brand,
        deviceModel: data.deviceModel || data.model,
        beforeImages: beforeImages,
        afterImages: afterImages,
        duration: data.duration || 'N/A',
        difficulty: data.difficulty || 'Medium',
        visible: data.visible !== false, // Default to true if not specified
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now(),
      });
    });
    
    // Sort by creation date (newest first)
    repairs.sort((a, b) => b.createdAt - a.createdAt);
    
    console.log(`✅ Loaded ${repairs.length} repair cases from Firebase`);
    return repairs;
  } catch (error) {
    console.error('Error fetching repair cases:', error);
    throw error;
  }
}

// Common categories
export const REPAIR_CATEGORIES = [
  'screen',
  'battery',
  'water',
  'board',
  'laptop',
  'charging',
  'data',
  'software',
  'appliance',
  'other',
];

// Difficulty levels
export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard', 'Expert'] as const;
