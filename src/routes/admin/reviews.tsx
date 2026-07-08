import { createFileRoute } from '@tanstack/react-router';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { 
  MessageSquare,
  CheckCircle,
  XCircle,
  Reply,
  Star,
  Filter,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const features = [
    {
      icon: CheckCircle,
      title: 'Approve Reviews',
      description: 'Review and approve customer feedback before it goes live on your site',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: XCircle,
      title: 'Reject & Moderate',
      description: 'Flag inappropriate content and maintain quality standards for reviews',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: Reply,
      title: 'Respond to Reviews',
      description: 'Engage with customers by responding to their reviews and feedback',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Star,
      title: 'Rating Analytics',
      description: 'View average ratings, trending products, and customer satisfaction metrics',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Filter,
      title: 'Filter & Sort',
      description: 'Filter reviews by product, rating, date, or approval status',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: MessageSquare,
      title: 'Bulk Actions',
      description: 'Approve or reject multiple reviews at once with bulk selection tools',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
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
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 mb-4">
          <MessageSquare className="h-8 w-8 text-blue-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Review Management</h1>
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
        <Card className="border-border/50 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-2xl font-bold mb-2">Customer Feedback Hub</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Manage all customer reviews in one place. Approve genuine feedback, moderate content, 
              respond to customers, and gain insights into product satisfaction. Build trust through 
              transparent and engaged review management.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
