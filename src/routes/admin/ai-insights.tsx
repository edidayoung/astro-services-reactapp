import { createFileRoute } from '@tanstack/react-router';
import { AuthGuard } from '@/components/admin/AuthGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { 
  Sparkles,
  Brain,
  Lightbulb,
  Target,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/admin/ai-insights')({
  component: AIInsightsPage,
});

function AIInsightsPage() {
  return (
    <AuthGuard>
      <AdminLayout>
        <AIInsightsContent />
      </AdminLayout>
    </AuthGuard>
  );
}

function AIInsightsContent() {
  const features = [
    {
      icon: Brain,
      title: 'Smart Predictions',
      description: 'AI-powered forecasts for inventory needs, sales trends, and customer demand',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Lightbulb,
      title: 'Product Recommendations',
      description: 'Get AI suggestions for product bundles, pricing strategies, and promotions',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Target,
      title: 'Customer Targeting',
      description: 'Identify high-value customers and personalized marketing opportunities',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      title: 'Trend Detection',
      description: 'Automatically spot emerging trends and seasonal patterns in your data',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: MessageSquare,
      title: 'Review Analysis',
      description: 'AI-powered sentiment analysis and insights from customer reviews',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: AlertTriangle,
      title: 'Risk Alerts',
      description: 'Proactive notifications about potential issues and opportunities',
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
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4">
          <Sparkles className="h-8 w-8 text-purple-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">AI-Powered Insights</h1>
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
        <Card className="border-border/50 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
          <CardContent className="p-8 text-center">
            <Brain className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-2xl font-bold mb-2">Intelligent Business Assistant</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Leverage artificial intelligence to gain deeper insights into your business. 
              Get actionable recommendations, automated analysis, and predictive intelligence 
              to stay ahead of the competition.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
