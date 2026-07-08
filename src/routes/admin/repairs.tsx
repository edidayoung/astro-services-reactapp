import { createFileRoute } from '@tanstack/react-router';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { 
  Wrench,
  Plus,
  Clock as ClockIcon,
  CheckCircle,
  AlertCircle,
  Phone,
  DollarSign,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const features = [
    {
      icon: Plus,
      title: 'Create Repair Tickets',
      description: 'Log new repair requests with device details, customer info, and issue descriptions',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: ClockIcon,
      title: 'Status Tracking',
      description: 'Track repair progress from pending to completed with real-time status updates',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: CheckCircle,
      title: 'Complete Repairs',
      description: 'Mark repairs as completed and notify customers when devices are ready',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: DollarSign,
      title: 'Pricing & Quotes',
      description: 'Generate repair quotes and track payments for completed services',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Phone,
      title: 'Customer Contact',
      description: 'Store customer contact details and communication history for each repair',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: AlertCircle,
      title: 'Priority Management',
      description: 'Set priority levels and estimated completion times for urgent repairs',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
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
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4">
          <Wrench className="h-8 w-8 text-orange-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Repair Management</h1>
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
        <Card className="border-border/50 bg-gradient-to-br from-orange-500/5 to-red-500/5">
          <CardContent className="p-8 text-center">
            <Wrench className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-2xl font-bold mb-2">Streamlined Repair Workflow</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Manage your entire repair service operation from ticket creation to completion. 
              Track device status, communicate with customers, generate quotes, and keep 
              everything organized in one powerful dashboard.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
