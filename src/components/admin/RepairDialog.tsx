import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RepairImageUploader } from './RepairImageUploader';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { RepairCase, RepairCaseInput } from '@/lib/admin/repairs';
import { REPAIR_CATEGORIES, DIFFICULTY_LEVELS } from '@/lib/admin/repairs';

interface RepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repair: RepairCase | null;
  onSave: (data: RepairCaseInput) => Promise<void>;
}

export function RepairDialog({ open, onOpenChange, repair, onSave }: RepairDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RepairCaseInput>({
    title: '',
    description: '',
    category: 'screen',
    deviceType: '',
    deviceBrand: '',
    deviceModel: '',
    beforeImages: [],
    afterImages: [],
    duration: '',
    difficulty: 'Medium',
    visible: true,
  });

  // Reset form when dialog opens/closes or repair changes
  useEffect(() => {
    if (open && repair) {
      // Editing existing repair
      setFormData({
        title: repair.title,
        description: repair.description,
        category: repair.category,
        deviceType: repair.deviceType,
        deviceBrand: repair.deviceBrand || '',
        deviceModel: repair.deviceModel || '',
        beforeImages: repair.beforeImages,
        afterImages: repair.afterImages,
        duration: repair.duration,
        difficulty: repair.difficulty,
        visible: repair.visible,
      });
    } else if (open) {
      // Creating new repair
      setFormData({
        title: '',
        description: '',
        category: 'screen',
        deviceType: '',
        deviceBrand: '',
        deviceModel: '',
        beforeImages: [],
        afterImages: [],
        duration: '',
        difficulty: 'Medium',
        visible: true,
      });
    }
  }, [open, repair]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (!formData.deviceType.trim()) {
      toast.error('Please enter a device type');
      return;
    }
    if (formData.beforeImages.length === 0) {
      toast.error('Please upload at least 1 before image');
      return;
    }
    if (formData.afterImages.length === 0) {
      toast.error('Please upload at least 1 after image');
      return;
    }
    if (!formData.duration.trim()) {
      toast.error('Please enter repair duration');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      toast.success(repair ? 'Repair updated successfully' : 'Repair created successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving repair:', error);
      toast.error('Failed to save repair');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {repair ? 'Edit Repair Case' : 'Create New Repair Case'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Samsung Fridge Compressor Replacement"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of what was fixed"
              rows={3}
              required
            />
          </div>

          {/* Device Info - Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="deviceType">
                Device Type <span className="text-red-500">*</span>
              </Label>
              <Input
                id="deviceType"
                value={formData.deviceType}
                onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                placeholder="e.g., Refrigerator, Laptop, TV"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deviceBrand">Device Brand</Label>
              <Input
                id="deviceBrand"
                value={formData.deviceBrand}
                onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                placeholder="e.g., Samsung, LG, Sony"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deviceModel">Device Model</Label>
              <Input
                id="deviceModel"
                value={formData.deviceModel}
                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                placeholder="e.g., Model number"
              />
            </div>
          </div>

          {/* Category & Metadata - Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REPAIR_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">
                Duration <span className="text-red-500">*</span>
              </Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 2 hours, Same day"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Before Images */}
          <div>
            <RepairImageUploader
              images={formData.beforeImages}
              onChange={(images) => setFormData({ ...formData, beforeImages: images })}
              label="Before Images"
              minImages={1}
              maxImages={5}
            />
          </div>

          {/* After Images */}
          <div>
            <RepairImageUploader
              images={formData.afterImages}
              onChange={(images) => setFormData({ ...formData, afterImages: images })}
              label="After Images"
              minImages={1}
              maxImages={5}
            />
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-surface/30">
            <div>
              <Label htmlFor="visible" className="text-base font-semibold">
                Show on Site
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Make this repair case visible to customers on the AstroFix page
              </p>
            </div>
            <Switch
              id="visible"
              checked={formData.visible}
              onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {repair ? 'Update Repair' : 'Create Repair'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
