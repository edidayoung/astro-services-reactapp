import { memo } from 'react';

interface BrandLogoProps {
  brand: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Brand color schemes for fallback text logos
const brandColors: Record<string, { bg: string; text: string; accent: string }> = {
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
  'hp': { bg: 'from-blue-600 to-blue-700', text: 'text-white', accent: '#0066cc' },
  'dell': { bg: 'from-blue-500 to-cyan-600', text: 'text-white', accent: '#007db8' },
  'lenovo': { bg: 'from-red-600 to-red-700', text: 'text-white', accent: '#e2231a' },
  'apple': { bg: 'from-gray-700 to-gray-900', text: 'text-white', accent: '#000000' },
  'acer': { bg: 'from-green-600 to-green-700', text: 'text-white', accent: '#83b81a' },
  'asus': { bg: 'from-gray-800 to-gray-900', text: 'text-white', accent: '#000000' },
  'msi': { bg: 'from-red-600 to-black', text: 'text-white', accent: '#ff0000' },
};

// Brand display names
const brandNames: Record<string, string> = {
  'samsung-s-series': 'Samsung S',
  'samsung-a-series': 'Samsung A',
  'fairly-used': 'UK Used',
  'tecno': 'Tecno',
  'redmi': 'Redmi',
  'vivo': 'Vivo',
  'oppo': 'Oppo',
  'infinix': 'Infinix',
  'itel': 'Itel',
  'realme': 'Realme',
  'poco': 'Poco',
  'hp': 'HP',
  'dell': 'Dell',
  'lenovo': 'Lenovo',
  'apple': 'Apple',
  'acer': 'Acer',
  'asus': 'ASUS',
  'msi': 'MSI',
};

export const BrandLogo = memo(({ brand, size = 'md', className = '' }: BrandLogoProps) => {
  const colors = brandColors[brand] || { bg: 'from-gray-600 to-gray-700', text: 'text-white', accent: '#4b5563' };
  const displayName = brandNames[brand] || brand;
  
  const sizeClasses = {
    sm: 'h-5 text-xs px-2',
    md: 'h-7 text-sm px-3',
    lg: 'h-9 text-base px-4',
  };

  // TODO: When logos are added, check for logo file first
  // For now, render beautiful text-based brand pills
  
  return (
    <div 
      className={`
        inline-flex items-center justify-center rounded-full font-bold
        bg-gradient-to-r ${colors.bg} ${colors.text}
        shadow-md hover:shadow-lg transition-all duration-200
        ${sizeClasses[size]} ${className}
      `}
      style={{
        boxShadow: `0 2px 8px ${colors.accent}40`,
      }}
    >
      {displayName}
    </div>
  );
});

BrandLogo.displayName = 'BrandLogo';
