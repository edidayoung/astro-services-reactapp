import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Review } from '../mock-data';

// Fetch all reviews from Firebase
async function fetchReviews(): Promise<Review[]> {
  try {
    console.log('Fetching reviews from Firebase...');
    const reviewsCollection = collection(db, 'reviews');
    const reviewsSnapshot = await getDocs(reviewsCollection);
    
    const reviews: Review[] = [];
    
    reviewsSnapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        name: data.name,
        rating: data.rating,
        comment: data.text || data.comment, // Handle both field names
        approved: data.status === 'approved', // Convert status to approved boolean
        createdAt: data.createdAt || Date.now(),
        imageUrl: data.imageUrl // Optional profile picture
      });
    });
    
    // Sort by creation date - newest first
    reviews.sort((a, b) => b.createdAt - a.createdAt);
    
    console.log(`✅ Loaded ${reviews.length} reviews from Firebase`);
    return reviews;
    
  } catch (error) {
    console.error('❌ Error loading reviews from Firebase:', error);
    throw error;
  }
}

// Submit a new review
async function submitReview(reviewData: {
  name: string;
  rating: number;
  comment: string;
  imageUrl?: string;
}): Promise<void> {
  try {
    console.log('Submitting review to Firebase...');
    const reviewsCollection = collection(db, 'reviews');
    
    const dataToSubmit: any = {
      name: reviewData.name,
      rating: reviewData.rating,
      text: reviewData.comment,
      status: 'pending', // All new reviews start as pending
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Only add imageUrl if it exists
    if (reviewData.imageUrl) {
      dataToSubmit.imageUrl = reviewData.imageUrl;
    }
    
    await addDoc(reviewsCollection, dataToSubmit);
    
    console.log('✅ Review submitted successfully');
  } catch (error) {
    console.error('❌ Error submitting review:', error);
    throw error;
  }
}

// Hook to fetch all reviews
export function useReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to fetch only approved reviews
export function useApprovedReviews() {
  const { data: allReviews, ...rest } = useReviews();
  
  const approvedReviews = allReviews?.filter(r => r.approved) || [];
  
  return {
    data: approvedReviews,
    ...rest
  };
}

// Hook to submit a review
export function useSubmitReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      // Invalidate reviews query to refetch
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    }
  });
}
