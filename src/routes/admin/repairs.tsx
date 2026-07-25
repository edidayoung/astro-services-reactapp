import { createFileRoute } from '@tanstack/react-router';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RepairDialog } from '@/components/admin/RepairDialog';
import { 
  fetchRepairCases,
  createRepairCase,
  updateRepairCase,
  deleteRepairCase,
  type RepairCase,
  type RepairCaseInput
} from '@/lib/admin/repairs';
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

export const Route = createFileRoute('/admin/repairs')({
  component: RepairsPage,
});

function RepairsPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <RepairsContent />
      </AdminLayout>
    </AuthGuard>
  );
}

function RepairsContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<RepairCase | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [repairToDelete, setRepairToDelete] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch repairs
  const { data: repairs = [], isLoading } = useQuery({
    queryKey: ['admin-repairs'],
    queryFn: fetchRepairCases,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createRepairCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-repairs'] });
      toast.success('Repair case created successfully');
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast.error('Failed to create repair case');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RepairCaseInput> }) =>
      updateRepairCase(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-repairs'] });
      toast.success('Repair case updated successfully');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error('Failed to update repair case');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteRepairCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-repairs'] });
      toast.success('Repair case deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete repair case');
    },
  });

  // Handlers
  const handleCreateNew = () => {
    setSelectedRepair(null);
    setDialogOpen(true);
  };

  const handleEdit = (repair: RepairCase) => {
    setSelectedRepair(repair);
    setDialogOpen(true);
  };

  const handleSave = async (data: RepairCaseInput) => {
    if (selectedRepair) {
      await updateMutation.mutateAsync({ id: selectedRepair.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleToggleVisibility = async (repair: RepairCase) => {
    await updateMutation.mutateAsync({
      id: repair.id,
      data: { visible: !repair.visible },
    });
  };

  const handleDeleteClick = (id: string) => {
    setRepairToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (repairToDelete) {
      await deleteMutation.mutateAsync(repairToDelete);
      setDeleteDialogOpen(false);
      setRepairToDelete(null);
    }
  };

  // Filter repairs
  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch =
      repair.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.deviceBrand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || repair.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(repairs.map((r) => r.category)))];

  // Stats
  const stats = {
    total: repairs.length,
    visible: repairs.filter((r) => r.visible).length,
    hidden: repairs.filter((r) => !r.visible).length,
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Repair Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your repair case showcases
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          New Repair Case
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-border/50">
          <div className="p-6">
            <p className="text-sm text-muted-foreground">Total Repairs</p>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>
        </Card>
        <Card className="border-border/50">
          <div className="p-6">
            <p className="text-sm text-muted-foreground">Visible on Site</p>
            <p className="text-3xl font-bold mt-2 text-green-500">{stats.visible}</p>
          </div>
        </Card>
        <Card className="border-border/50">
          <div className="p-6">
            <p className="text-sm text-muted-foreground">Hidden</p>
            <p className="text-3xl font-bold mt-2 text-muted-foreground">{stats.hidden}</p>
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repairs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Repairs Grid */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading repairs...</p>
        </div>
      )}

      {!isLoading && filteredRepairs.length === 0 && (
        <Card className="border-border/50 p-12 text-center">
          <Wrench className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery || selectedCategory !== 'all'
              ? 'No repairs found'
              : 'No repair cases yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first repair case to showcase your work'}
          </p>
          {!searchQuery && selectedCategory === 'all' && (
            <Button onClick={handleCreateNew} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Create First Repair
            </Button>
          )}
        </Card>
      )}

      {!isLoading && filteredRepairs.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredRepairs.map((repair, index) => (
              <motion.div
                key={repair.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-border/50 overflow-hidden group hover:border-green-500/50 transition-colors">
                  {/* Image Preview */}
                  <div className="relative aspect-video bg-surface/30">
                    <div className="absolute inset-0 flex">
                      <div className="relative w-1/2 overflow-hidden">
                        <img
                          src={repair.beforeImages[0]?.url}
                          alt="Before"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-red-500/90 backdrop-blur text-white text-xs font-bold rounded">
                          BEFORE
                        </div>
                      </div>
                      <div className="relative w-1/2 overflow-hidden">
                        <img
                          src={repair.afterImages[0]?.url}
                          alt="After"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-green-500/90 backdrop-blur text-white text-xs font-bold rounded">
                          AFTER
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-y-0 left-1/2 w-1 bg-white/50 transform -translate-x-1/2" />
                    
                    {/* Visibility Badge */}
                    <div className="absolute top-2 right-2">
                      {repair.visible ? (
                        <Badge className="bg-green-500/90 backdrop-blur">
                          <Eye className="h-3 w-3 mr-1" />
                          Visible
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-500/90 backdrop-blur">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-2">
                      <Badge variant="outline" className="mb-2">{repair.category}</Badge>
                      <h3 className="font-semibold text-lg line-clamp-1" title={repair.title}>
                        {repair.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {repair.deviceType}
                        {repair.deviceBrand && ` • ${repair.deviceBrand}`}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
                      {repair.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {repair.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {repair.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEdit(repair)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleVisibility(repair)}
                      >
                        {repair.visible ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(repair.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Dialogs */}
      <RepairDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        repair={selectedRepair}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Repair Case?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this repair case.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
