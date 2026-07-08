import { useState, ReactNode } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useAuth } from '@/lib/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  MessageSquare, 
  Wrench, 
  Clock, 
  LogOut,
  Home,
  Settings,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useReviews } from '@/lib/hooks/useReviews';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout, sessionTimeRemaining } = useAuth();
  const { data: reviews } = useReviews();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pendingReviews = reviews?.filter(r => !r.approved).length || 0;

  // Format time remaining as HH:MM:SS
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const navItems = [
    { path: '/admin', icon: Home, label: 'Overview' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews', badge: pendingReviews },
    { path: '/admin/repairs', icon: Wrench, label: 'Repairs' },
    { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/admin/ai-insights', icon: Sparkles, label: 'AI Insights' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col fixed h-screen border-r border-border/50 bg-surface/30 transition-all duration-300 z-40",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex h-16 items-center gap-3 border-b border-border/50 px-4 flex-shrink-0 cursor-pointer hover:bg-surface/50 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0">
            <Package className="h-6 w-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-sm font-bold whitespace-nowrap">Admin Portal</h1>
              <p className="text-xs text-muted-foreground whitespace-nowrap">Astro Services</p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link key={item.path} to={item.path} className="block">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full gap-3 transition-colors relative",
                    sidebarCollapsed ? "justify-center px-2" : "justify-start",
                    active 
                      ? "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300" 
                      : "hover:bg-surface"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <Badge variant="destructive" className="ml-auto">{item.badge}</Badge>
                      )}
                    </>
                  )}
                  {sidebarCollapsed && item.badge && item.badge > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Session Info - Fixed at bottom */}
        <div className="border-t border-border/50 p-2 flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 px-2">
              <Clock className="h-3 w-3" />
              Session: {formatTime(sessionTimeRemaining)}
            </div>
          )}
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className={cn(
              "w-full gap-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-colors",
              sidebarCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        {/* Top Bar - Mobile */}
        <header className="flex lg:hidden h-16 items-center justify-between border-b border-border/50 bg-surface/30 px-4">
          <h1 className="text-lg font-bold">Admin Portal</h1>
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </header>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
