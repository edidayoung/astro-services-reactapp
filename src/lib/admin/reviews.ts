// Admin Review Management Functions
import { 
  collection, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDocs,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Review } from '../mock-data';

// Approve review
export async function approveReview(firebaseId: string): Promise<void> {
  try {
    const docRef = doc(db, 'reviews', firebaseId);
    await updateDoc(docRef, {
      status: 'approved',
      updatedAt: Date.now()
    });
    
    console.log('✅ Review approved:', firebaseId);
  } catch (error) {
    console.error('❌ Error approving review:', error);
    throw error;
  }
}

// Reject review
export async function rejectReview(firebaseId: string): Promise<void> {
  try {
    const docRef = doc(db, 'reviews', firebaseId);
    await updateDoc(docRef, {
      status: 'rejected',
      updatedAt: Date.now()
    });
    
    console.log('✅ Review rejected:', firebaseId);
  } catch (error) {
    console.error('❌ Error rejecting review:', error);
    throw error;
  }
}

// Delete review
export async function deleteReview(firebaseId: string): Promise<void> {
  try {
    const docRef = doc(db, 'reviews', firebaseId);
    await deleteDoc(docRef);
    
    console.log('✅ Review deleted:', firebaseId);
  } catch (error) {
    console.error('❌ Error deleting review:', error);
    throw error;
  }
}

// Bulk approve reviews
export async function bulkApproveReviews(firebaseIds: string[]): Promise<void> {
  try {
    const updatePromises = firebaseIds.map(id => 
      updateDoc(doc(db, 'reviews', id), {
        status: 'approved',
        updatedAt: Date.now()
      })
    );
    
    await Promise.all(updatePromises);
    console.log(`✅ Bulk approved ${firebaseIds.length} reviews`);
  } catch (error) {
    console.error('❌ Error bulk approving:', error);
    throw error;
  }
}

// Bulk reject reviews
export async function bulkRejectReviews(firebaseIds: string[]): Promise<void> {
  try {
    const updatePromises = firebaseIds.map(id => 
      updateDoc(doc(db, 'reviews', id), {
        status: 'rejected',
        updatedAt: Date.now()
      })
    );
    
    await Promise.all(updatePromises);
    console.log(`✅ Bulk rejected ${firebaseIds.length} reviews`);
  } catch (error) {
    console.error('❌ Error bulk rejecting:', error);
    throw error;
  }
}

// Bulk delete reviews
export async function bulkDeleteReviews(firebaseIds: string[]): Promise<void> {
  try {
    const deletePromises = firebaseIds.map(id => 
      deleteDoc(doc(db, 'reviews', id))
    );
    
    await Promise.all(deletePromises);
    console.log(`✅ Bulk deleted ${firebaseIds.length} reviews`);
  } catch (error) {
    console.error('❌ Error bulk deleting:', error);
    throw error;
  }
}
