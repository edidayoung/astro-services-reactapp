import { createFileRoute } from '@tanstack/react-router';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useProducts } from '@/lib/hooks/useProducts';
import { useReviews } from '@/lib/hooks/useReviews';
import { motion } from 'framer-motion';
import { 
  Package, 
  MessageSquare, 
  Wrench, 
  Clock, 
  LogOut,
  Home,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  PackageX,
  Plus,
  ArrowRight,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { logout, sessionTimeRemaining } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: reviews, isLoading: reviewsLoading } = useReviews();

  // Calculate stats
  const totalProducts = products?.length || 0;
  const inStockProducts = products?.filter(p => p.inStock).length || 0;
  const outOfStockProducts = products?.filter(p => !p.inStock).length || 0;
  const pendingReviews = reviews?.filter(r => !r.approved).length || 0;
  const totalReviews = reviews?.length || 0;

  // Format time remaining as HH:MM:SS
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Get recent products (last 5)
  const recentProducts = products?.slice(0, 5) || [];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-surface/30">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold">Admin Portal</h1>
            <p className="text-xs text-muted-foreground">Astro Services</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300">
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-surface">
            <Package className="h-4 w-4" />
            Products
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-surface">
            <MessageSquare className="h-4 w-4" />
            Reviews
            {pendingReviews > 0 && (
              <Badge variant="destructive" className="ml-auto">{pendingReviews}</Badge>
            )}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-surface">
            <Wrench className="h-4 w-4" />
            Repairs
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-surface">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </nav>

        {/* Session Info */}
        <div className="border-t border-border/50 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Clock className="h-3 w-3" />
            Session: {formatTime(sessionTimeRemaining)}
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="w-full gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar - Mobile */}
        <header className="flex lg:hidden h-16 items-center justify-between border-b border-border/50 bg-surface/30 px-4">
          <h1 className="text-lg font-bold">Dashboard</h1>
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
            <p className="text-muted-foreground">Here's what's happening with your store today.</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8"
          >
            {/* Total Products */}
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{totalProducts}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {inStockProducts} in stock
                </p>
              </CardContent>
            </Card>

            {/* In Stock */}
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Stock
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold text-green-500">{inStockProducts}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Available to sell
                </p>
              </CardContent>
            </Card>

            {/* Out of Stock */}
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Out of Stock
                </CardTitle>
                <PackageX className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold text-orange-500">{outOfStockProducts}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Need restocking
                </p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Reviews
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {reviewsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{totalReviews}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {pendingReviews > 0 ? (
                    <span className="text-yellow-500">{pendingReviews} pending</span>
                  ) : (
                    'All approved'
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Activity - 2/3 width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {productsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : recentProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No products yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-surface/50 transition-colors"
                        >
                          <img
                            src={product.images[0]?.url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover bg-surface"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.category} • {formatTimeAgo(product.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₦{product.price.toLocaleString()}</p>
                            <Badge variant={product.inStock ? "default" : "secondary"} className="text-xs">
                              {product.inStock ? "In Stock" : "Out"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions - 1/3 width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Quick Actions Card */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start gap-2 bg-purple-500 hover:bg-purple-600">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquare className="h-4 w-4" />
                    View Reviews
                    {pendingReviews > 0 && (
                      <Badge variant="destructive" className="ml-auto">{pendingReviews}</Badge>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Wrench className="h-4 w-4" />
                    Add Repair
                  </Button>
                </CardContent>
              </Card>

              {/* Alerts Card */}
              {outOfStockProducts > 0 && (
                <Card className="border-orange-500/50 bg-orange-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-500">
                      <AlertCircle className="h-5 w-5" />
                      Attention Needed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <PackageX className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Out of Stock</p>
                        <p className="text-xs text-muted-foreground">
                          {outOfStockProducts} product{outOfStockProducts !== 1 ? 's' : ''} need restocking
                        </p>
                        <Button variant="link" className="h-auto p-0 text-xs text-orange-500 hover:text-orange-400">
                          View products <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
