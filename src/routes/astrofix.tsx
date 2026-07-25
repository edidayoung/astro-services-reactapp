import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { AstroFixPage } from "@/components/site/AstroFixPage";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/astrofix")({
  component: AstroFixRoute,
});

function AstroFixRoute() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        {/* Centered Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center justify-center gap-2 text-sm"
        >
          <Link to="/" className="text-muted-foreground hover:text-purple-400 transition-colors">
            Home
          </Link>
          <span className="text-muted-foreground">›</span>
          <span className="text-green-400 font-medium">AstroFix</span>
        </motion.div>

        <AstroFixPage />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
