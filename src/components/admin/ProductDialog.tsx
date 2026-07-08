import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { addProduct, updateProduct } from '@/lib/admin/products';
import { ImageUploader } from './ImageUploader';
import { subcategoryConfig, androidBrands, laptopBrands } from '@/lib/mock-data';
import type { Product } from '@/lib/mock-data';
import type { NewProductData } from '@/lib/admin/products';

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  mode: 'add' | 'edit';
}

const AVAILABLE_BADGES = ['hot', 'new', 'sale', 'limited'];

export function ProductDialog({ open, onClose, product, mode }: ProductDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<NewProductData>({
    name: '',
    description: '',
    price: 0,
    onSale: false,
    salePrice: undefined,
    category: 'smartphones',
    subcategory: 'ios',
    platform: undefined,
    brand: undefined,
    images: [],
    badges: [],
    inStock: true,
  });

  // Load product data when editing
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        onSale: product.onSale,
        salePrice: product.salePrice,
        category: product.category,
        subcategory: product.subcategory,
        platform: product.platform,
        brand: product.brand,
        images: product.images,
        badges: product.badges,
        inStock: product.inStock,
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        description: '',
        price: 0,
        onSale: false,
        salePrice: undefined,
        category: 'smartphones',
        subcategory: 'ios',
        platform: undefined,
        brand: undefined,
        images: [],
        badges: [],
        inStock: true,
      });
    }
  }, [mode, product, open]);

  // Add product mutation
  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully!');
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Failed to add product: ${error.message}`);
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: ({ firebaseId, data }: { firebaseId: string; data: Partial<NewProductData> }) =>
      updateProduct(firebaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully!');
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Failed to update product: ${error.message}`);
    },
  });

  const isLoading = addMutation.isPending || updateMutation.isPending;

  // Handle category change
  const handleCategoryChange = (category: string) => {
    const newCategory = category as NewProductData['category'];
    const subcategories = subcategoryConfig[newCategory] || [];
    const defaultSubcategory = subcategories[1] || subcategories[0] || 'all';

    setFormData((prev) => ({
      ...prev,
      category: newCategory,
      subcategory: defaultSubcategory,
      platform: newCategory === 'smartphones' ? (defaultSubcategory as 'ios' | 'android') : undefined,
      brand: undefined, // Reset brand when category changes
    }));
  };

  // Handle subcategory change
  const handleSubcategoryChange = (subcategory: string) => {
    setFormData((prev) => ({
      ...prev,
      subcategory,
      platform: prev.category === 'smartphones' ? (subcategory as 'ios' | 'android') : undefined,
      brand: undefined, // Reset brand when subcategory changes
    }));
  };

  // Check if brand field should be shown
  const shouldShowBrand = () => {
    if (formData.category === 'smartphones' && formData.subcategory === 'android') {
      return true;
    }
    if (formData.category === 'laptops') {
      return true;
    }
    return false;
  };

  // Get available brands based on category
  const getAvailableBrands = () => {
    if (formData.category === 'smartphones' && formData.subcategory === 'android') {
      return androidBrands.filter(b => b !== 'all');
    }
    if (formData.category === 'laptops') {
      return laptopBrands.filter(b => b !== 'all');
    }
    return [];
  };

  // Validate form
  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.name || formData.name.length < 3) {
      errors.push('Name must be at least 3 characters');
    }

    if (!formData.description || formData.description.length < 10) {
      errors.push('Description must be at least 10 characters');
    }

    if (!formData.price || formData.price <= 0) {
      errors.push('Price must be greater than 0');
    }

    if (formData.onSale && formData.salePrice) {
      if (formData.salePrice >= formData.price) {
        errors.push('Sale price must be less than regular price');
      }
    }

    if (formData.images.length === 0) {
      errors.push('At least 1 image is required');
    }

    if (formData.images.length > 5) {
      errors.push('Maximum 5 images allowed');
    }

    // Android phones must have brand
    if (formData.category === 'smartphones' && formData.subcategory === 'android' && !formData.brand) {
      errors.push('Android phones must have a brand');
    }

    return { valid: errors.length === 0, errors };
  };

  // Handle submit
  const handleSubmit = () => {
    const validation = validateForm();

    if (!validation.valid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    if (mode === 'add') {
      addMutation.mutate(formData);
    } else if (mode === 'edit' && product?.firebaseId) {
      updateMutation.mutate({
        firebaseId: product.firebaseId,
        data: formData,
      });
    }
  };

  // Handle badge toggle
  const toggleBadge = (badge: string) => {
    setFormData((prev) => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter(b => b !== badge)
        : [...prev.badges, badge],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Images */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Product Images *</Label>
            <ImageUploader
              images={formData.images}
              onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
              maxImages={5}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Upload up to 5 images. Drag to reorder. Click to set primary image.
            </p>
          </div>

          {/* Basic Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. iPhone 15 Pro Max"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smartphones">Smartphones</SelectItem>
                  <SelectItem value="laptops">Laptops</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subcategory & Brand */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subcategory" className="text-sm font-medium">Subcategory *</Label>
              <Select value={formData.subcategory} onValueChange={handleSubcategoryChange}>
                <SelectTrigger id="subcategory">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(subcategoryConfig[formData.category] || [])
                    .filter(sub => sub !== 'all')
                    .map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub === 'ios' ? 'iOS (UK Used)' :
                         sub === 'android' ? 'Android' :
                         sub === 'gaming' ? 'Gaming' :
                         sub === 'business' ? 'Business' :
                         sub === 'budget' ? 'Budget' :
                         sub === 'earbuds' ? 'Earbuds' :
                         sub === 'headphones' ? 'Headphones' :
                         sub === 'speakers' ? 'Speakers' :
                         sub === 'chargers' ? 'Chargers' :
                         sub === 'power-banks' ? 'Power Banks' :
                         sub === 'fans' ? 'Fans' :
                         sub === 'others' ? 'Others' :
                         sub}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {shouldShowBrand() && (
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium">
                  Brand * {formData.category === 'smartphones' && '(Required for Android)'}
                </Label>
                <Select 
                  value={formData.brand || ''} 
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
                >
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableBrands().map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand === 'samsung-s-series' ? 'Samsung S Series' :
                         brand === 'samsung-a-series' ? 'Samsung A Series' :
                         brand === 'fairly-used' ? 'Fairly Used' :
                         brand === 'others' ? 'Others' :
                         brand.charAt(0).toUpperCase() + brand.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed product description..."
              rows={4}
              className="whitespace-pre-wrap"
            />
          </div>

          {/* Pricing */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">Price (₦) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>

            <div className="flex items-end space-x-2 pb-1">
              <Switch
                id="onSale"
                checked={formData.onSale}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, onSale: checked }))}
              />
              <Label htmlFor="onSale" className="text-sm font-medium cursor-pointer">On Sale</Label>
            </div>

            {formData.onSale && (
              <div className="space-y-2">
                <Label htmlFor="salePrice" className="text-sm font-medium">Sale Price (₦)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  value={formData.salePrice || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salePrice: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Badges</Label>
            <div className="flex flex-wrap gap-4">
              {AVAILABLE_BADGES.map((badge) => (
                <div key={badge} className="flex items-center space-x-2">
                  <Checkbox
                    id={`badge-${badge}`}
                    checked={formData.badges.includes(badge)}
                    onCheckedChange={() => toggleBadge(badge)}
                  />
                  <Label htmlFor={`badge-${badge}`} className="capitalize cursor-pointer text-sm">
                    {badge}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, inStock: checked }))}
            />
            <Label htmlFor="inStock" className="text-sm font-medium cursor-pointer">In Stock</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'add' ? 'Add Product' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
