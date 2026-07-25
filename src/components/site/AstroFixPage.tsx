import { motion } from "framer-motion";
import { 
  Wrench, MessageCircle, Clock, Shield, Award, DollarSign,
  Smartphone, Battery, Droplet, Cpu, Laptop, Zap, HardDrive,
  CheckCircle, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface RepairCase {
  id: string;
  title: string;
  description: string;
  category: string;
  deviceType: string;
  deviceBrand?: string;
  deviceModel?: string;
  beforeImages: Array<{
    url: string;
    order: number;
  }>;
  afterImages: Array<{
    url: string;
    order: number;
  }>;
  duration: string;
  difficulty: string;
  visible: boolean;
  createdAt: number;
  updatedAt: number;
}

// Fetch repairs from Firebase
async function fetchRepairs(): Promise<RepairCase[]> {
  try {
    console.log('Fetching repairs from Firebase...');
    const repairsCollection = collection(db, 'repairs');
    const snapshot = await getDocs(repairsCollection);
    
    const repairs: RepairCase[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // Handle backward compatibility: convert old schema to new schema
      let beforeImages: Array<{ url: string; order: number }> = [];
      let afterImages: Array<{ url: string; order: number }> = [];
      
      // Check if old schema (single image strings)
      if (typeof data.beforeImage === 'string' && data.beforeImage) {
        beforeImages = [{ url: data.beforeImage, order: 0 }];
      } else if (Array.isArray(data.beforeImages)) {
        beforeImages = data.beforeImages;
      }
      
      if (typeof data.afterImage === 'string' && data.afterImage) {
        afterImages = [{ url: data.afterImage, order: 0 }];
      } else if (Array.isArray(data.afterImages)) {
        afterImages = data.afterImages;
      }
      
      // Skip if no images
      if (beforeImages.length === 0 || afterImages.length === 0) {
        console.warn(`Skipping repair ${doc.id} - missing images`);
        return;
      }
      
      // Handle old deviceType mapping
      const deviceType = data.deviceType || data.device || 'Unknown Device';
      
      repairs.push({ 
        id: doc.id, 
        title: data.title || 'Untitled Repair',
        description: data.description || '',
        category: data.category || 'other',
        deviceType: deviceType,
        deviceBrand: data.deviceBrand || data.brand,
        deviceModel: data.deviceModel || data.model,
        beforeImages: beforeImages,
        afterImages: afterImages,
        duration: data.duration || 'N/A',
        difficulty: data.difficulty || 'Medium',
        visible: data.visible !== false,
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now(),
      } as RepairCase);
    });
    
    // Only return visible repairs, sorted by date
    const visibleRepairs = repairs
      .filter(r => r.visible)
      .sort((a, b) => b.createdAt - a.createdAt);
    
    console.log(`✅ Loaded ${visibleRepairs.length} visible repairs from Firebase`);
    return visibleRepairs;
  } catch (error) {
    console.error('❌ Error loading repairs:', error);
    return [];
  }
}

export function AstroFixPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRepair, setSelectedRepair] = useState<RepairCase | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Fetch repairs
  const { data: repairs = [], isLoading } = useQuery({
    queryKey: ['repairs'],
    queryFn: fetchRepairs,
    staleTime: 5 * 60 * 1000,
  });

  const services = [
    {
      title: "Screen Repair",
      description: "Cracked displays, LCD replacements, touch issues",
      icon: Smartphone,
      price: "From ₦15,000",
      category: "screen",
      features: ["Original quality parts", "Same-day service", "90-day warranty"]
    },
    {
      title: "Battery Replacement",
      description: "Poor battery life, swollen batteries, charging issues",
      icon: Battery,
      price: "From ₦12,000",
      category: "battery",
      features: ["High-capacity cells", "1-hour service", "6-month warranty"]
    },
    {
      title: "Water Damage",
      description: "Liquid spills, corrosion, component damage",
      icon: Droplet,
      price: "From ₦25,000",
      category: "water",
      features: ["Ultrasonic cleaning", "Board-level repair", "Data recovery"]
    },
    {
      title: "Logic Board Repair",
      description: "Boot issues, component failures, chip replacement",
      icon: Cpu,
      price: "From ₦30,000",
      category: "board",
      features: ["Micro-soldering", "Advanced diagnostics", "Expert technicians"]
    },
    {
      title: "Laptop Repairs",
      description: "Keyboard, hinges, ports, overheating issues",
      icon: Laptop,
      price: "From ₦10,000",
      category: "laptop",
      features: ["All brands", "Hardware upgrades", "Software fixes"]
    },
    {
      title: "Charging Port",
      description: "Fix charging issues and port replacements",
      icon: Zap,
      price: "From ₦8,000",
      category: "charging",
      features: ["Quick repair", "Original parts", "Tested warranty"]
    },
    {
      title: "Data Recovery",
      description: "Recover lost data from damaged devices",
      icon: HardDrive,
      price: "From ₦20,000",
      category: "data",
      features: ["Secure process", "High success rate", "Confidential"]
    },
    {
      title: "Software Issues",
      description: "OS installation, virus removal, optimization",
      icon: Cpu,
      price: "From ₦5,000",
      category: "software",
      features: ["System cleanup", "Driver updates", "Performance boost"]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Repairs', icon: Wrench },
    { id: 'screen', label: 'Screen', icon: Smartphone },
    { id: 'battery', label: 'Battery', icon: Battery },
    { id: 'water', label: 'Water Damage', icon: Droplet },
    { id: 'board', label: 'Logic Board', icon: Cpu },
    { id: 'laptop', label: 'Laptop', icon: Laptop },
  ];

  const filteredRepairs = selectedCategory === 'all' 
    ? repairs 
    : repairs.filter(r => r.category === selectedCategory);

  const whatsappNumber = "2349133993369";
  const contactWhatsApp = (message: string) => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  // Auto-carousel logic
  const totalSlides = Math.ceil(services.length / 4); // Show 4 cards at a time
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 7000); // 7 seconds per slide
    
    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* 1. Our Work Speaks Section - FIRST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold font-display mb-4 text-center">
          Our Work Speaks for Itself
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Real repairs, real results - documented every step of the way
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mb-8">
          <Button
            size="lg"
            onClick={() => contactWhatsApp('I want to fix my device with AstroFix')}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Wrench className="mr-2 h-5 w-5" />
            Fix With Us
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-300
                  ${selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                    : 'bg-surface/60 text-foreground/70 hover:bg-surface/80 border border-border/50'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </motion.button>
            );
          })}
        </div>

        {/* Repairs Grid */}
        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/50 bg-surface/30 p-4">
                <Skeleton className="aspect-video w-full mb-4 rounded-xl" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredRepairs.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRepairs.map((repair, i) => (
              <motion.div
                key={repair.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedRepair(repair)}
                className="group cursor-pointer rounded-2xl border border-border/50 bg-surface/30 backdrop-blur overflow-hidden hover:border-green-500/50 hover:shadow-xl transition-all duration-300"
              >
                {/* Before/After Images */}
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 flex">
                    <div className="relative w-1/2 overflow-hidden">
                      <img 
                        src={repair.beforeImages[0]?.url} 
                        alt="Before repair"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-red-500/90 backdrop-blur text-white text-xs font-bold rounded">
                        BEFORE
                      </div>
                    </div>
                    <div className="relative w-1/2 overflow-hidden">
                      <img 
                        src={repair.afterImages[0]?.url} 
                        alt="After repair"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-green-500/90 backdrop-blur text-white text-xs font-bold rounded">
                        AFTER
                      </div>
                    </div>
                  </div>
                  {/* Divider line */}
                  <div className="absolute inset-y-0 left-1/2 w-1 bg-white/50 transform -translate-x-1/2" />
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <Badge className="mb-3 bg-green-500/10 text-green-400 border-0">
                    {repair.category}
                  </Badge>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-green-400 transition-colors">
                    {repair.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {repair.deviceType}
                    {repair.deviceBrand && ` • ${repair.deviceBrand}`}
                    {repair.deviceModel && ` • ${repair.deviceModel}`}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {repair.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {repair.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {repair.difficulty}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredRepairs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No repairs found in this category yet.</p>
          </div>
        )}
      </motion.div>

      {/* 2. Why Choose Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold font-display mb-8 text-center">
          Why Choose AstroFix?
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Clock, title: "Fast Turnaround", desc: "Most repairs done same day", color: "text-blue-400" },
            { icon: CheckCircle, title: "Original Parts", desc: "Genuine replacement parts", color: "text-green-400" },
            { icon: Shield, title: "Warranty", desc: "90-day warranty on repairs", color: "text-purple-400" },
            { icon: DollarSign, title: "Fair Pricing", desc: "Transparent, competitive rates", color: "text-orange-400" }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border border-border/50 bg-surface/30 backdrop-blur hover:border-green-500/30 hover:shadow-lg transition-all"
              >
                <Icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 3. Services Section - Auto-Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold font-display mb-4 text-center">
          What We Fix
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Comprehensive repair solutions for all your devices
        </p>
        
        {/* Carousel Container */}
        <div className="relative">
          {/* Carousel Track */}
          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-4"
              animate={{ x: `${-currentSlide * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {services.map((service, i) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={i}
                    className="group flex-shrink-0 w-[calc(25%-12px)] min-w-[240px] rounded-2xl border border-border/50 bg-surface/30 backdrop-blur p-5 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/20 to-teal-500/20 group-hover:from-green-500/30 group-hover:to-teal-500/30 transition-all">
                        <Icon className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                        <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 text-xs">
                          {service.price}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                    <ul className="space-y-1.5">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalSlides)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide 
                    ? 'w-8 bg-gradient-to-r from-green-500 to-teal-500' 
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Repair Details Modal */}
      {selectedRepair && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedRepair(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-surface border border-border rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setSelectedRepair(null)}
              className="sticky top-4 right-4 float-right z-10 p-2 rounded-full bg-surface/80 backdrop-blur hover:bg-red-500 text-foreground hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <Badge className="mb-3 bg-green-500/10 text-green-400 border-0">
                  {selectedRepair.category} Repair
                </Badge>
                <h2 className="text-3xl font-bold font-display mb-2">{selectedRepair.title}</h2>
                <p className="text-lg text-muted-foreground">
                  {selectedRepair.deviceType}
                  {selectedRepair.deviceBrand && ` • ${selectedRepair.deviceBrand}`}
                  {selectedRepair.deviceModel && ` • ${selectedRepair.deviceModel}`}
                </p>
                <p className="text-muted-foreground mt-2">{selectedRepair.description}</p>
              </div>

              {/* Before Images Gallery */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔴</span>
                  Before Repair
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedRepair.beforeImages
                    .sort((a, b) => a.order - b.order)
                    .map((img, idx) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden group aspect-video">
                        <img 
                          src={img.url} 
                          alt={`Before ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-red-500/90 backdrop-blur text-white text-xs font-bold rounded">
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* After Images Gallery */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🟢</span>
                  After Repair
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedRepair.afterImages
                    .sort((a, b) => a.order - b.order)
                    .map((img, idx) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden group aspect-video">
                        <img 
                          src={img.url} 
                          alt={`After ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-green-500/90 backdrop-blur text-white text-xs font-bold rounded">
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Repair Details */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Duration</div>
                  <div className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-400" />
                    {selectedRepair.duration}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface/50 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Difficulty</div>
                  <div className="font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-400" />
                    {selectedRepair.difficulty}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-4">
                <Button
                  onClick={() => contactWhatsApp(`I need a similar repair: ${selectedRepair.title}`)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Request This Repair
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRepair(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
