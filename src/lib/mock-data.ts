// Mock data matching Firebase schema exactly
// This will be replaced with real Firebase data in Phase 2

export interface Product {
  id: string;
  firebaseId?: string;
  name: string;
  description: string;
  price: number;
  onSale: boolean;
  salePrice?: number;
  category: 'smartphones' | 'laptops' | 'audio' | 'accessories';
  subcategory: string;
  platform?: 'ios' | 'android';
  brand?: string;
  images: Array<{
    url: string;
    isPrimary: boolean;
    order: number;
  }>;
  image?: string; // Backward compatibility
  badges: string[];
  badge?: string; // Deprecated
  inStock: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: number;
}

export interface RepairCase {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  category: string;
  createdAt: number;
}

// Mock Products
export const mockProducts: Product[] = [
  // Smartphones - iOS
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    description: 'UK Used - 256GB, Titanium Blue, Excellent Condition',
    price: 1250000,
    onSale: true,
    salePrice: 1150000,
    category: 'smartphones',
    subcategory: 'ios',
    platform: 'ios',
    images: [
      { url: 'https://via.placeholder.com/400x400/1e40af/ffffff?text=iPhone+15+Pro', isPrimary: true, order: 0 }
    ],
    badges: ['hot', 'new'],
    inStock: true,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now()
  },
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    description: 'UK Used - 128GB, Deep Purple, Very Good Condition',
    price: 950000,
    onSale: false,
    category: 'smartphones',
    subcategory: 'ios',
    platform: 'ios',
    images: [
      { url: 'https://via.placeholder.com/400x400/7c3aed/ffffff?text=iPhone+14+Pro', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now()
  },
  {
    id: 'iphone-13',
    name: 'iPhone 13',
    description: 'UK Used - 128GB, Midnight Black, Good Condition',
    price: 650000,
    onSale: false,
    category: 'smartphones',
    subcategory: 'ios',
    platform: 'ios',
    images: [
      { url: 'https://via.placeholder.com/400x400/6366f1/ffffff?text=iPhone+13', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now()
  },

  // Smartphones - Android (Samsung S Series)
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Brand New - 512GB, Titanium Gray, 200MP Camera',
    price: 1450000,
    onSale: true,
    salePrice: 1350000,
    category: 'smartphones',
    subcategory: 'android',
    platform: 'android',
    brand: 'samsung-s-series',
    images: [
      { url: 'https://via.placeholder.com/400x400/0ea5e9/ffffff?text=S24+Ultra', isPrimary: true, order: 0 }
    ],
    badges: ['hot', 'new'],
    inStock: true,
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now()
  },
  {
    id: 'samsung-s23-plus',
    name: 'Samsung Galaxy S23+',
    description: 'Brand New - 256GB, Phantom Black, Snapdragon 8 Gen 2',
    price: 850000,
    onSale: false,
    category: 'smartphones',
    subcategory: 'android',
    platform: 'android',
    brand: 'samsung-s-series',
    images: [
      { url: 'https://via.placeholder.com/400x400/06b6d4/ffffff?text=S23+Plus', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 345600000,
    updatedAt: Date.now()
  },

  // Smartphones - Android (Samsung A Series)
  {
    id: 'samsung-a54',
    name: 'Samsung Galaxy A54',
    description: 'Brand New - 256GB, Awesome Violet, 50MP Camera',
    price: 320000,
    onSale: false,
    category: 'smartphones',
    subcategory: 'android',
    platform: 'android',
    brand: 'samsung-a-series',
    images: [
      { url: 'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=A54', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 432000000,
    updatedAt: Date.now()
  },

  // Smartphones - Android (Tecno)
  {
    id: 'tecno-phantom-x2',
    name: 'Tecno Phantom X2 Pro',
    description: 'Brand New - 256GB, Stardust Grey, Retractable Portrait Lens',
    price: 380000,
    onSale: true,
    salePrice: 350000,
    category: 'smartphones',
    subcategory: 'android',
    platform: 'android',
    brand: 'tecno',
    images: [
      { url: 'https://via.placeholder.com/400x400/ec4899/ffffff?text=Phantom+X2', isPrimary: true, order: 0 }
    ],
    badges: ['new'],
    inStock: true,
    createdAt: Date.now() - 518400000,
    updatedAt: Date.now()
  },

  // Smartphones - Android (Redmi)
  {
    id: 'redmi-note-13-pro',
    name: 'Redmi Note 13 Pro+',
    description: 'Brand New - 256GB, Midnight Black, 200MP Camera',
    price: 280000,
    onSale: false,
    category: 'smartphones',
    subcategory: 'android',
    platform: 'android',
    brand: 'redmi',
    images: [
      { url: 'https://via.placeholder.com/400x400/f97316/ffffff?text=Note+13+Pro', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 604800000,
    updatedAt: Date.now()
  },

  // Laptops - Gaming
  {
    id: 'asus-rog-strix',
    name: 'ASUS ROG Strix G16',
    description: 'Intel i9-13980HX, RTX 4070, 32GB RAM, 1TB SSD',
    price: 1850000,
    onSale: true,
    salePrice: 1750000,
    category: 'laptops',
    subcategory: 'gaming',
    brand: 'asus',
    images: [
      { url: 'https://via.placeholder.com/400x400/dc2626/ffffff?text=ROG+Strix', isPrimary: true, order: 0 }
    ],
    badges: ['hot'],
    inStock: true,
    createdAt: Date.now() - 129600000,
    updatedAt: Date.now()
  },
  {
    id: 'msi-katana-15',
    name: 'MSI Katana 15',
    description: 'Intel i7-13620H, RTX 4060, 16GB RAM, 512GB SSD',
    price: 1200000,
    onSale: false,
    category: 'laptops',
    subcategory: 'gaming',
    brand: 'msi',
    images: [
      { url: 'https://via.placeholder.com/400x400/b91c1c/ffffff?text=MSI+Katana', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 216000000,
    updatedAt: Date.now()
  },

  // Laptops - Business
  {
    id: 'hp-elitebook-850',
    name: 'HP EliteBook 850 G9',
    description: 'Intel i7-1265U, 16GB RAM, 512GB SSD, Windows 11 Pro',
    price: 950000,
    onSale: false,
    category: 'laptops',
    subcategory: 'business',
    brand: 'hp',
    images: [
      { url: 'https://via.placeholder.com/400x400/0369a1/ffffff?text=EliteBook', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 302400000,
    updatedAt: Date.now()
  },
  {
    id: 'dell-latitude-5430',
    name: 'Dell Latitude 5430',
    description: 'Intel i5-1245U, 16GB RAM, 256GB SSD, 14" FHD',
    price: 750000,
    onSale: true,
    salePrice: 680000,
    category: 'laptops',
    subcategory: 'business',
    brand: 'dell',
    images: [
      { url: 'https://via.placeholder.com/400x400/0284c7/ffffff?text=Latitude', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 388800000,
    updatedAt: Date.now()
  },

  // Laptops - Budget
  {
    id: 'hp-15s-fq5000',
    name: 'HP 15s-fq5000',
    description: 'Intel i3-1215U, 8GB RAM, 256GB SSD, 15.6" HD',
    price: 380000,
    onSale: false,
    category: 'laptops',
    subcategory: 'budget',
    brand: 'hp',
    images: [
      { url: 'https://via.placeholder.com/400x400/0891b2/ffffff?text=HP+15s', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 475200000,
    updatedAt: Date.now()
  },

  // Audio - Earbuds
  {
    id: 'airpods-pro-2',
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'Active Noise Cancellation, Adaptive Audio, USB-C',
    price: 185000,
    onSale: true,
    salePrice: 165000,
    category: 'audio',
    subcategory: 'earbuds',
    images: [
      { url: 'https://via.placeholder.com/400x400/6366f1/ffffff?text=AirPods+Pro', isPrimary: true, order: 0 }
    ],
    badges: ['hot'],
    inStock: true,
    createdAt: Date.now() - 561600000,
    updatedAt: Date.now()
  },
  {
    id: 'samsung-buds2-pro',
    name: 'Samsung Galaxy Buds2 Pro',
    description: 'Intelligent ANC, 360 Audio, IPX7 Water Resistant',
    price: 95000,
    onSale: false,
    category: 'audio',
    subcategory: 'earbuds',
    images: [
      { url: 'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Buds2+Pro', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 648000000,
    updatedAt: Date.now()
  },

  // Audio - Headphones
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5',
    description: 'Industry Leading Noise Cancellation, 30hr Battery',
    price: 285000,
    onSale: false,
    category: 'audio',
    subcategory: 'headphones',
    images: [
      { url: 'https://via.placeholder.com/400x400/1e293b/ffffff?text=Sony+XM5', isPrimary: true, order: 0 }
    ],
    badges: ['hot'],
    inStock: true,
    createdAt: Date.now() - 734400000,
    updatedAt: Date.now()
  },

  // Audio - Speakers
  {
    id: 'jbl-charge-5',
    name: 'JBL Charge 5',
    description: 'Portable Bluetooth Speaker, IP67 Waterproof, 20hr Battery',
    price: 95000,
    onSale: true,
    salePrice: 85000,
    category: 'audio',
    subcategory: 'speakers',
    images: [
      { url: 'https://via.placeholder.com/400x400/ef4444/ffffff?text=JBL+Charge+5', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 820800000,
    updatedAt: Date.now()
  },

  // Accessories - Chargers
  {
    id: 'anker-747-charger',
    name: 'Anker 747 GaNPrime 150W',
    description: '4-Port Fast Charger, USB-C PD 3.0, Foldable Plug',
    price: 65000,
    onSale: false,
    category: 'accessories',
    subcategory: 'chargers',
    images: [
      { url: 'https://via.placeholder.com/400x400/10b981/ffffff?text=Anker+747', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 907200000,
    updatedAt: Date.now()
  },

  // Accessories - Power Banks
  {
    id: 'anker-powercore-20k',
    name: 'Anker PowerCore 20000mAh',
    description: 'High Capacity Power Bank, 18W Fast Charging, Dual USB',
    price: 35000,
    onSale: false,
    category: 'accessories',
    subcategory: 'power-banks',
    images: [
      { url: 'https://via.placeholder.com/400x400/14b8a6/ffffff?text=PowerCore', isPrimary: true, order: 0 }
    ],
    badges: [],
    inStock: true,
    createdAt: Date.now() - 993600000,
    updatedAt: Date.now()
  },
];

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: 'review-1',
    name: 'Chidi Okonkwo',
    rating: 5,
    comment: 'Excellent service! Got my iPhone 15 Pro delivered the next day. The phone is in perfect condition as described. Highly recommend Astro Services!',
    approved: true,
    createdAt: Date.now() - 86400000
  },
  {
    id: 'review-2',
    name: 'Amina Bello',
    rating: 5,
    comment: 'Best prices in Lagos! I compared with other stores and Astro Services had the best deal. Customer service was amazing too.',
    approved: true,
    createdAt: Date.now() - 172800000
  },
  {
    id: 'review-3',
    name: 'Tunde Adeyemi',
    rating: 5,
    comment: 'Very professional. They helped me choose the perfect laptop for my business needs. The HP EliteBook is working perfectly!',
    approved: true,
    createdAt: Date.now() - 259200000
  },
  {
    id: 'review-4',
    name: 'Ngozi Eze',
    rating: 5,
    comment: 'Fast delivery and genuine products. I was worried about buying online but they exceeded my expectations. Will definitely buy again!',
    approved: true,
    createdAt: Date.now() - 345600000
  },
  {
    id: 'review-5',
    name: 'Ibrahim Musa',
    rating: 5,
    comment: 'Great experience! The Samsung S24 Ultra I bought is authentic and came with full warranty. Thank you Astro Services!',
    approved: true,
    createdAt: Date.now() - 432000000
  },
  {
    id: 'review-6',
    name: 'Blessing Okafor',
    rating: 5,
    comment: 'Affordable prices and quality products. I bought a power bank and it\'s been working great for 3 months now.',
    approved: true,
    createdAt: Date.now() - 518400000
  }
];

// Mock Repair Cases
export const mockRepairCases: RepairCase[] = [
  {
    id: 'repair-1',
    title: 'iPhone 13 Screen Replacement',
    description: 'Cracked screen replaced with original OLED display. Touch and Face ID working perfectly.',
    beforeImage: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Cracked+Screen',
    afterImage: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Fixed+Screen',
    category: 'Screen Repair',
    createdAt: Date.now() - 604800000
  },
  {
    id: 'repair-2',
    title: 'MacBook Pro Water Damage',
    description: 'Complete motherboard cleaning and component replacement. Laptop fully functional.',
    beforeImage: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Water+Damage',
    afterImage: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Fully+Repaired',
    category: 'Water Damage',
    createdAt: Date.now() - 691200000
  },
  {
    id: 'repair-3',
    title: 'Samsung S22 Battery Replacement',
    description: 'Old battery replaced with high-capacity original battery. Now lasts full day.',
    beforeImage: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Dead+Battery',
    afterImage: 'https://via.placeholder.com/400x300/10b981/ffffff?text=New+Battery',
    category: 'Battery Replacement',
    createdAt: Date.now() - 777600000
  }
];

// Subcategory Configuration (matching subcategory-config.js)
export const subcategoryConfig = {
  smartphones: ['all', 'ios', 'android'],
  laptops: ['all', 'gaming', 'business', 'budget'],
  audio: ['all', 'earbuds', 'headphones', 'speakers'],
  accessories: ['all', 'chargers', 'power-banks', 'fans', 'others']
};

// Android Brands (matching subcategory-config.js)
export const androidBrands = [
  'all',
  'tecno',
  'redmi',
  'samsung-s-series',
  'samsung-a-series',
  'vivo',
  'oppo',
  'itel',
  'realme',
  'poco',
  'infinix',
  'fairly-used'
];

// Laptop Brands
export const laptopBrands = [
  'all',
  'apple',
  'hp',
  'dell',
  'asus',
  'acer',
  'lenovo',
  'msi',
  'alienware',
  'others'
];

// Display name helper
export function getDisplayName(value: string): string {
  const displayNames: Record<string, string> = {
    'all': 'All',
    'ios': 'iOS (UK Used)',
    'android': 'Android',
    'gaming': 'Gaming',
    'business': 'Business',
    'budget': 'Budget (₦0 - ₦400k)',
    'earbuds': 'Earbuds',
    'headphones': 'Headphones',
    'speakers': 'Speakers',
    'chargers': 'Chargers',
    'power-banks': 'Power Banks',
    'fans': 'Fans',
    'others': 'Others',
    // Android brands
    'tecno': 'Tecno',
    'redmi': 'Redmi',
    'samsung-s-series': 'Samsung S Series',
    'samsung-a-series': 'Samsung A Series',
    'vivo': 'Vivo',
    'oppo': 'Oppo',
    'itel': 'Itel',
    'realme': 'Realme',
    'poco': 'Poco',
    'infinix': 'Infinix',
    // Laptop brands
    'apple': 'Apple',
    'hp': 'HP',
    'dell': 'Dell',
    'asus': 'ASUS',
    'acer': 'Acer',
    'lenovo': 'Lenovo',
    'msi': 'MSI',
    'alienware': 'Alienware',
    // Common
    'fairly-used': 'Fairly Used',
    'others': 'Others'
  };
  return displayNames[value] || value;
}

// Icon helper for subcategories (returns lucide-react icon component)
import { Tag, Apple, Bot, Gamepad, Briefcase, DollarSign, Headphones as HeadphonesIcon, Speaker, Plug, Battery, Fan, Package } from 'lucide-react';

export function getIconForSubcategory(subcategory: string) {
  const icons: Record<string, any> = {
    'all': Tag,
    'ios': Apple,
    'android': Bot,
    'gaming': Gamepad,
    'business': Briefcase,
    'budget': DollarSign,
    'earbuds': HeadphonesIcon,
    'headphones': HeadphonesIcon,
    'speakers': Speaker,
    'chargers': Plug,
    'power-banks': Battery,
    'fans': Fan,
    'others': Package
  };
  return icons[subcategory] || Tag;
}
