import { createFileRoute } from '@tanstack/react-router';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Lock,
  Bell,
  Palette,
  Database,
  Mail,
  Shield,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/admin/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <SettingsContent />
      </AdminLayout>
    </AuthGuard>
  );
}

function SettingsContent() {
  const features = [
    {
      icon: Lock,
      title: 'Security Settings',
      description: 'Manage passwords, two-factor authentication, and session preferences',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure email and push notifications for orders, reviews, and alerts',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Palette,
      title: 'Theme & Appearance',
      description: 'Customize the look and feel of your admin dashboard',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Export data, manage backups, and configure database settings',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Mail,
      title: 'Email Configuration',
      description: 'Set up email templates, SMTP settings, and automated messages',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: Shield,
      title: 'Access Control',
      description: 'Manage user roles, permissions, and admin access levels',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-slate-500/20 to-gray-500/20 mb-4">
          <SettingsIcon className="h-8 w-8 text-slate-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Settings & Configuration</h1>
        <p className="text-xl text-muted-foreground mb-6">
          This feature is currently in development
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <Clock className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-yellow-500 font-medium">Coming Soon</span>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Features to Expect</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="border-border/50 hover:border-border transition-colors h-full">
                <CardHeader>
                  <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-3 w-fit`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto mt-12"
      >
        <Card className="border-border/50 bg-gradient-to-br from-slate-500/5 to-gray-500/5">
          <CardContent className="p-8 text-center">
            <SettingsIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-2xl font-bold mb-2">Complete Control</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Customize every aspect of your admin portal. Configure security, notifications, 
              appearance, and data management to match your workflow perfectly.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
