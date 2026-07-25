import { createFileRoute } from '@tanstack/react-router';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  MessageSquare,
  CheckCircle,
  XCircle,
  Star,
  Filter,
  Trash2,
  Clock,
  User,
  MoreVertical,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReviews } from '@/lib/hooks/useReviews';
import { 
  approveReview, 
  rejectReview, 
  deleteReview,
  bulkApproveReviews,
  bulkRejectReviews,
  bulkDeleteReviews
} from '@/lib/admin/reviews';
import type { Review } from '@/lib/mock-data';

export const Route = createFileRoute('/admin/reviews')({
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <ReviewsContent />
      </AdminLayout>
    </AuthGuard>
  );
}

function ReviewsContent() {
  const { data: reviews, isLoading } = useReviews();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  // Filter reviews
  const filteredReviews = reviews?.filter(review => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!review.name.toLowerCase().includes(query) && 
          !review.comment.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Status filter
    if (statusFilter === 'approved' && !review.approved) return false;
    if (statusFilter === 'pending' && review.approved) return false;

    // Rating filter
    if (ratingFilter !== 'all' && review.rating !== Number(ratingFilter)) {
      return false;
    }

    return true;
  }) || [];

  const stats = {
    total: reviews?.length || 0,
    approved: reviews?.filter(r => r.approved).length || 0,
    pending: reviews?.filter(r => !r.approved).length || 0,
    avgRating: reviews?.length 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
  };

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: approveReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review approved successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to approve review: ${error.message}`);
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: rejectReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review rejected');
    },
    onError: (error: any) => {
      toast.error(`Failed to reject review: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast.success('Review deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete review: ${error.message}`);
    },
  });

  // Bulk approve mutation
  const bulkApproveMutation = useMutation({
    mutationFn: bulkApproveReviews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setSelectedReviews(new Set());
      toast.success('Reviews approved successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to approve reviews: ${error.message}`);
    },
  });

  // Bulk reject mutation
  const bulkRejectMutation = useMutation({
    mutationFn: bulkRejectReviews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setSelectedReviews(new Set());
      toast.success('Reviews rejected successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to reject reviews: ${error.message}`);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: bulkDeleteReviews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setSelectedReviews(new Set());
      toast.success('Reviews deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete reviews: ${error.message}`);
    },
  });

  // Handle actions
  const handleApprove = (review: Review) => {
    if (!review.id) return;
    approveMutation.mutate(review.id);
  };

  const handleReject = (review: Review) => {
    if (!review.id) return;
    rejectMutation.mutate(review.id);
  };

  const handleDelete = (review: Review) => {
    if (!review.id) return;
    setReviewToDelete(review);
    setDeleteDialogOpen(true);
  };

  // Confirm delete single review
  const confirmDelete = () => {
    if (!reviewToDelete?.id) return;
    deleteMutation.mutate(reviewToDelete.id);
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  };

  // Handle selection
  const toggleSelection = (reviewId: string) => {
    const newSelection = new Set(selectedReviews);
    if (newSelection.has(reviewId)) {
      newSelection.delete(reviewId);
    } else {
      newSelection.add(reviewId);
    }
    setSelectedReviews(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedReviews.size === filteredReviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(filteredReviews.map(r => r.id)));
    }
  };

  // Bulk actions
  const handleBulkApprove = () => {
    if (selectedReviews.size === 0) return;
    bulkApproveMutation.mutate(Array.from(selectedReviews));
  };

  const handleBulkReject = () => {
    if (selectedReviews.size === 0) return;
    bulkRejectMutation.mutate(Array.from(selectedReviews));
  };

  const handleBulkDelete = () => {
    if (selectedReviews.size === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  // Confirm bulk delete
  const confirmBulkDelete = () => {
    bulkDeleteMutation.mutate(Array.from(selectedReviews));
    setBulkDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reviews</h1>
          <p className="text-muted-foreground">
            Manage customer feedback
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-4 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.avgRating}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500 opacity-50 fill-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border-border/50 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search by name or comment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Rating Filter */}
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
              <SelectItem value="4">⭐⭐⭐⭐</SelectItem>
              <SelectItem value="3">⭐⭐⭐</SelectItem>
              <SelectItem value="2">⭐⭐</SelectItem>
              <SelectItem value="1">⭐</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedReviews.size > 0 && (
        <Card className="p-4 border-border/50 mb-6 bg-purple-500/5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {selectedReviews.size} review(s) selected
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkApprove}
                disabled={bulkApproveMutation.isPending}
                className="hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/50 transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkReject}
                disabled={bulkRejectMutation.isPending}
                className="hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/50 transition-colors"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== 'all' || ratingFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'No reviews have been submitted yet'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          <div className="flex items-center gap-3 px-2">
            <button
              type="button"
              onClick={toggleSelectAll}
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                ${selectedReviews.size === filteredReviews.length && filteredReviews.length > 0
                  ? 'bg-purple-500 border-purple-500' 
                  : 'border-border hover:border-purple-500'
                }
              `}
            >
              {selectedReviews.size === filteredReviews.length && filteredReviews.length > 0 && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <span className="text-sm text-muted-foreground font-medium">Select All</span>
          </div>

          {/* Reviews */}
          {filteredReviews.map((review, index) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              index={index}
              selected={selectedReviews.has(review.id)}
              onToggleSelect={() => toggleSelection(review.id)}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      
      {/* Delete Single Review Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the review by "<span className="font-semibold text-foreground">{reviewToDelete?.name}</span>"? 
              This action cannot be undone and will permanently remove this review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedReviews.size} Reviews?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedReviews.size} selected review{selectedReviews.size !== 1 ? 's' : ''}? 
              This action cannot be undone and will permanently remove these reviews.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete {selectedReviews.size} Review{selectedReviews.size !== 1 ? 's' : ''}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Review Card Component
function ReviewCard({ 
  review, 
  index,
  selected,
  onToggleSelect,
  onApprove,
  onReject,
  onDelete
}: { 
  review: Review; 
  index: number;
  selected: boolean;
  onToggleSelect: () => void;
  onApprove: (review: Review) => void;
  onReject: (review: Review) => void;
  onDelete: (review: Review) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="p-6 border-border/50 hover:border-border transition-all">
        <div className="flex items-start gap-4">
          {/* Checkbox - Modern Square Style */}
          <div className="flex items-center pt-1">
            <button
              type="button"
              onClick={onToggleSelect}
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                ${selected
                  ? 'bg-purple-500 border-purple-500' 
                  : 'border-border hover:border-purple-500'
                }
              `}
            >
              {selected && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {review.imageUrl ? (
              <img
                src={review.imageUrl}
                alt={review.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-purple-500/50"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-white font-semibold text-lg">
                {review.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{review.name}</h3>
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                    <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <Badge variant={review.approved ? 'default' : 'secondary'} className="ml-1">
                    {review.approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!review.approved && (
                    <DropdownMenuItem 
                      onClick={() => onApprove(review)}
                      className="hover:bg-green-500/10 hover:text-green-500 focus:bg-green-500/10 focus:text-green-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                  )}
                  {review.approved && (
                    <DropdownMenuItem 
                      onClick={() => onReject(review)}
                      className="hover:bg-orange-500/10 hover:text-orange-500 focus:bg-orange-500/10 focus:text-orange-500"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Unapprove
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-500 hover:bg-red-500/10 focus:bg-red-500/10" 
                    onClick={() => onDelete(review)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Comment */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              "{review.comment}"
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
