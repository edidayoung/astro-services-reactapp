import { memo } from 'react';
import { motion } from 'framer-motion';

interface BrandLogoProps {
  brand: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  active?: boolean;
}

// Brand color schemes for fallback text logos
const brandColors: Record<string, { bg: string; text: string; accent: string }> = {
  // Android phone brands
  'tecno': { bg: 'from-blue-600 to-blue-700', text: 'text-white', accent: '#1e40af' },
  'samsung-s-series': { bg: 'from-blue-500 to-indigo-600', text: 'text-white', accent: '#1e3a8a' },
  'samsung-a-series': { bg: 'from-blue-400 to-blue-500', text: 'text-white', accent: '#3b82f6' },
  'redmi': { bg: 'from-orange-500 to-red-600', text: 'text-white', accent: '#dc2626' },
  'vivo': { bg: 'from-blue-600 to-purple-600', text: 'text-white', accent: '#4c1d95' },
  'oppo': { bg: 'from-green-500 to-emerald-600', text: 'text-white', accent: '#059669' },
  'infinix': { bg: 'from-purple-600 to-pink-600', text: 'text-white', accent: '#9333ea' },
  'itel': { bg: 'from-red-500 to-orange-600', text: 'text-white', accent: '#dc2626' },
  'realme': { bg: 'from-yellow-400 to-yellow-600', text: 'text-gray-900', accent: '#ca8a04' },
  'poco': { bg: 'from-yellow-500 to-orange-600', text: 'text-white', accent: '#ea580c' },
  // Laptop brands
  'apple': { bg: 'from-gray-700 to-gray-900', text: 'text-white', accent: '#000000' },
  'hp': { bg: 'from-blue-600 to-blue-700', text: 'text-white', accent: '#0066cc' },
  'dell': { bg: 'from-blue-500 to-cyan-600', text: 'text-white', accent: '#007db8' },
  'asus': { bg: 'from-gray-800 to-gray-900', text: 'text-white', accent: '#000000' },
  'acer': { bg: 'from-green-600 to-green-700', text: 'text-white', accent: '#83b81a' },
  'lenovo': { bg: 'from-red-600 to-red-700', text: 'text-white', accent: '#e2231a' },
  'msi': { bg: 'from-red-600 to-black', text: 'text-white', accent: '#ff0000' },
  'alienware': { bg: 'from-cyan-500 to-blue-600', text: 'text-white', accent: '#06b6d4' },
};

// Brand display names
const brandNames: Record<string, string> = {
  // Android phone brands
  'samsung-s-series': 'Samsung S',
  'samsung-a-series': 'Samsung A',
  'tecno': 'Tecno',
  'redmi': 'Redmi',
  'vivo': 'Vivo',
  'oppo': 'Oppo',
  'infinix': 'Infinix',
  'itel': 'Itel',
  'realme': 'Realme',
  'poco': 'Poco',
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
  'fairly-used': 'UK Used',
};

export const BrandLogo = memo(({ brand, size = 'md', className = '', active = false }: BrandLogoProps) => {
  const colors = brandColors[brand] || { bg: 'from-gray-600 to-gray-700', text: 'text-white', accent: '#4b5563' };
  const displayName = brandNames[brand] || brand;
  
  const sizeClasses = {
    sm: 'h-5 text-[10px] px-2',
    md: 'h-7 text-xs px-3',
    lg: 'h-9 text-sm px-4',
  };

  // TODO: When logos are added, check for logo file first
  // For now, render beautiful text-based brand pills
  
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center justify-center rounded-full font-black
        ${active 
          ? 'bg-white/20 text-white border border-white/30' 
          : `bg-gradient-to-r ${colors.bg} ${colors.text}`
        }
        shadow-md transition-all duration-200
        ${sizeClasses[size]} ${className}
      `}
      style={!active ? {
        boxShadow: `0 2px 8px ${colors.accent}40`,
      } : {}}
    >
      {displayName}
    </motion.div>
  );
});

BrandLogo.displayName = 'BrandLogo';
