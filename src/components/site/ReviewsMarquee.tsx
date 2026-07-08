import { motion } from "framer-motion";
import { Star, MessageSquarePlus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useApprovedReviews, useSubmitReview } from "@/lib/hooks/useReviews";
import { toast } from "sonner";
import { uploadImageToCloudinary, validateImageFile } from "@/lib/admin/cloudinary";

export function ReviewsMarquee() {
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
    imageUrl: ""
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch approved reviews from Firebase
  const { data: approvedReviews = [], isLoading } = useApprovedReviews();
  const submitReviewMutation = useSubmitReview();
  
  // Duplicate reviews for seamless loop
  const reviewsRow = [...approvedReviews, ...approvedReviews];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setUploading(true);
    
    try {
      const result = await uploadImageToCloudinary(file);
      
      setFormData(prev => ({ ...prev, imageUrl: result.url }));
      setImagePreview(result.url);
      toast.success("Profile picture uploaded!");
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
      console.error("Image upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that image is uploaded
    if (!formData.imageUrl) {
      toast.error("Please upload a profile picture");
      return;
    }
    
    try {
      await submitReviewMutation.mutateAsync(formData);
      
      toast.success("Thank you! Your review has been submitted and is pending approval.");
      
      setFormData({ name: "", rating: 5, comment: "", imageUrl: "" });
      setImagePreview(null);
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
      console.error("Review submission error:", error);
    }
  };

  return (
    <section className="py-20 overflow-hidden bg-gradient-to-b from-background via-purple-950/5 to-background">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold font-display mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Real feedback from satisfied customers across Nigeria
          </p>
          
          {/* Submit Review Button */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Share Your Experience</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                {/* Profile Picture Upload - REQUIRED */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Profile Picture *
                  </label>
                  
                  {!imagePreview ? (
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="review-image"
                        className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-border hover:border-purple-500 cursor-pointer transition-colors bg-surface/30"
                      >
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </label>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">
                          Upload your profile picture to verify your review
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPEG, PNG, WebP up to 2MB
                        </p>
                      </div>
                      <input
                        id="review-image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                        required
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          disabled={uploading}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-500">✓ Picture uploaded</p>
                      </div>
                    </div>
                  )}
                  
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500" />
                      <span>Uploading...</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    placeholder="e.g., John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            rating <= formData.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium">
                    Your Review *
                  </label>
                  <textarea
                    id="comment"
                    placeholder="Tell us about your experience with Astro Services..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    required
                    rows={4}
                    maxLength={500}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.comment.length}/500
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1"
                    disabled={submitReviewMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-primary"
                    disabled={submitReviewMutation.isPending}
                  >
                    {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      {/* Loading State - Enhanced skeleton for review cards */}
      {isLoading && (
        <div className="relative -rotate-3">
          <div className="flex gap-6 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="flex-shrink-0 w-[350px] rounded-2xl border border-border/50 bg-surface/80 backdrop-blur p-6"
              >
                {/* Stars skeleton */}
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-4 rounded-full" />
                  ))}
                </div>
                
                {/* Comment skeleton */}
                <div className="mb-4 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
                
                {/* User info skeleton */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Single Diagonal Marquee with Pause on Hover */}
      {!isLoading && approvedReviews.length > 0 && (
        <div className="relative -rotate-3 marquee-container">
          <div className="flex gap-6 animate-marquee-left">
            {reviewsRow.map((review, i) => (
              <ReviewCard key={`review-${i}`} review={review} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && approvedReviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
        </div>
      )}
    </section>
  );
}

function ReviewCard({ review }: { review: { id: string; name: string; rating: number; comment: string; approved: boolean; createdAt: number; imageUrl?: string } }) {
  return (
    <div className="flex-shrink-0 w-[350px] rounded-2xl border border-border/50 bg-surface/80 backdrop-blur p-6 hover:border-yellow-500/30 transition-all duration-300 hover:scale-105">
      <div className="mb-4 flex items-center gap-1">
        {[...Array(review.rating)].map((_, j) => (
          <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="mb-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
        "{review.comment}"
      </p>
      <div className="flex items-center gap-3">
        {review.imageUrl ? (
          <img
            src={review.imageUrl}
            alt={review.name}
            className="h-10 w-10 rounded-full object-cover border-2 border-purple-500/50"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-white font-semibold">
            {review.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="flex items-center gap-1">
            <p className="font-semibold text-sm">{review.name}</p>
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
              <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Verified Customer</p>
        </div>
      </div>
    </div>
  );
}
