import { createFileRoute } from '@tanstack/react-router';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductDialog } from '@/components/admin/ProductDialog';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Package,
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff
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
import { useProducts } from '@/lib/hooks/useProducts';
import { deleteProduct, toggleProductStock } from '@/lib/admin/products';
import { subcategoryConfig, androidBrands, laptopBrands } from '@/lib/mock-data';
import type { Product } from '@/lib/mock-data';

export const Route = createFileRoute('/admin/products')({
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <ProductsContent />
      </AdminLayout>
    </AuthGuard>
  );
}

function ProductsContent() {
  const { data: products, isLoading } = useProducts();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products?.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false;
    }

    // Subcategory filter
    if (subcategoryFilter !== 'all' && product.subcategory !== subcategoryFilter) {
      return false;
    }

    // Brand filter
    if (brandFilter !== 'all' && product.brand !== brandFilter) {
      return false;
    }

    // Stock filter
    if (stockFilter === 'in-stock' && !product.inStock) {
      return false;
    }
    if (stockFilter === 'out-of-stock' && product.inStock) {
      return false;
    }

    return true;
  }) || [];

  const stats = {
    total: products?.length || 0,
    inStock: products?.filter(p => p.inStock).length || 0,
    outOfStock: products?.filter(p => !p.inStock).length || 0,
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });

  // Toggle stock mutation
  const toggleStockMutation = useMutation({
    mutationFn: ({ firebaseId, inStock }: { firebaseId: string; inStock: boolean }) =>
      toggleProductStock(firebaseId, inStock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Stock status updated');
    },
    onError: (error: any) => {
      toast.error(`Failed to update stock: ${error.message}`);
    },
  });

  // Handle add product
  const handleAddProduct = () => {
    setDialogMode('add');
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setDialogMode('edit');
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  // Handle delete product
  const handleDeleteProduct = (product: Product) => {
    if (!product.firebaseId) {
      toast.error('Cannot delete product without Firebase ID');
      return;
    }

    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!productToDelete?.firebaseId) return;
    
    deleteMutation.mutate(productToDelete.firebaseId);
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  // Handle toggle stock
  const handleToggleStock = (product: Product) => {
    if (!product.firebaseId) {
      toast.error('Cannot update product without Firebase ID');
      return;
    }

    toggleStockMutation.mutate({
      firebaseId: product.firebaseId,
      inStock: !product.inStock,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Product Dialog */}
      <ProductDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        product={selectedProduct}
        mode={dialogMode}
      />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Button className="gap-2 bg-purple-500 hover:bg-purple-600" onClick={handleAddProduct}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="p-4 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-purple-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Stock</p>
              <p className="text-2xl font-bold text-green-500">{stats.inStock}</p>
            </div>
            <Eye className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-orange-500">{stats.outOfStock}</p>
            </div>
            <EyeOff className="h-8 w-8 text-orange-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border-border/50 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="smartphones">Smartphones</SelectItem>
              <SelectItem value="laptops">Laptops</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>

          {/* Stock Filter */}
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Products List */}
      {isLoading ? (
        <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}>
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="aspect-square w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || categoryFilter !== 'all' || stockFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first product'}
          </p>
          <Button className="gap-2 bg-purple-500 hover:bg-purple-600" onClick={handleAddProduct}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <ProductGridCard 
              key={product.firebaseId || product.id} 
              product={product} 
              index={index}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onToggleStock={handleToggleStock}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProducts.map((product, index) => (
            <ProductTableRow 
              key={product.firebaseId || product.id} 
              product={product} 
              index={index}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onToggleStock={handleToggleStock}
            />
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "<span className="font-semibold text-foreground">{productToDelete?.name}</span>"? 
              This action cannot be undone and will permanently remove this product from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Grid Card Component
function ProductGridCard({ 
  product, 
  index,
  onEdit,
  onDelete,
  onToggleStock
}: { 
  product: Product; 
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStock: (product: Product) => void;
}) {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="overflow-hidden border-border/50 hover:border-border transition-all group">
        {/* Image */}
        <div className="relative aspect-square bg-surface/30 overflow-hidden">
          <img
            src={primaryImage?.url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            </div>
          )}
          {/* Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStock(product)}>
                  {product.inStock ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500" onClick={() => onDelete(product)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Badges */}
          {product.badges.length > 0 && (
            <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
              {product.badges.map(badge => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div>
              {product.onSale && product.salePrice ? (
                <div>
                  <p className="text-sm line-through text-muted-foreground">
                    ₦{product.price.toLocaleString()}
                  </p>
                  <p className="text-lg font-bold text-green-500">
                    ₦{product.salePrice.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-lg font-bold">
                  ₦{product.price.toLocaleString()}
                </p>
              )}
            </div>
            <Badge variant={product.inStock ? 'default' : 'secondary'}>
              {product.inStock ? 'In Stock' : 'Out'}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Table Row Component
function ProductTableRow({ 
  product, 
  index,
  onEdit,
  onDelete,
  onToggleStock
}: { 
  product: Product; 
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStock: (product: Product) => void;
}) {
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
    >
      <Card className="p-4 border-border/50 hover:border-border transition-all">
        <div className="flex items-center gap-4 w-full">
          {/* Image */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface/30 flex-shrink-0">
            <img
              src={primaryImage?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="secondary" className="text-xs">Out</Badge>
              </div>
            )}
          </div>

          {/* Info - Name & Category */}
          <div className="flex-1 min-w-0 max-w-md">
            <h3 className="font-semibold truncate mb-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground truncate">
              {product.category} • {product.subcategory}
              {product.brand && ` • ${product.brand}`}
            </p>
          </div>

          {/* Badges */}
          <div className="hidden md:flex gap-1 flex-wrap max-w-[200px]">
            {product.badges.map(badge => (
              <Badge key={badge} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>

          {/* Price */}
          <div className="text-right w-32 flex-shrink-0">
            {product.onSale && product.salePrice ? (
              <div>
                <p className="text-xs line-through text-muted-foreground">
                  ₦{product.price.toLocaleString()}
                </p>
                <p className="text-sm font-bold text-green-500">
                  ₦{product.salePrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-sm font-bold">
                ₦{product.price.toLocaleString()}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="w-24 flex-shrink-0 text-center">
            <Badge variant={product.inStock ? 'default' : 'secondary'} className="text-xs">
              {product.inStock ? 'In Stock' : 'Out'}
            </Badge>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStock(product)}>
                {product.inStock ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={() => onDelete(product)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
}
