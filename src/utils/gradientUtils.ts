
// Function to generate gradient text in CSS
export const getGradientText = (text: string, gradient: string = 'from-violet-500 to-fuchsia-500'): string => {
  return `bg-gradient-to-r ${gradient} bg-clip-text text-transparent`;
};

// Common gradients for UI elements
export const gradients = {
  purple: 'from-violet-500 to-fuchsia-500',
  blue: 'from-blue-500 to-indigo-500',
  green: 'from-green-500 to-emerald-500',
  orange: 'from-amber-500 to-orange-500',
  pink: 'from-pink-500 to-rose-500',
  cyan: 'from-cyan-500 to-teal-500',
  wood: 'from-amber-700 via-amber-800 to-amber-900',
  sky: 'from-sky-400 via-blue-500 to-indigo-500',
  sunset: 'from-orange-500 via-red-500 to-pink-500',
  forest: 'from-green-700 via-emerald-600 to-teal-600',
  rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
  pastel: 'from-pink-300 via-purple-300 to-indigo-400',
  fire: 'from-yellow-400 via-red-500 to-pink-500',
  ocean: 'from-cyan-400 via-blue-500 to-indigo-600',
  earth: 'from-yellow-600 via-green-600 to-blue-600',
  neon: 'from-green-300 via-blue-500 to-purple-600',
  candy: 'from-pink-300 via-purple-300 via-blue-400 to-blue-300',
  midnight: 'from-blue-900 via-purple-900 to-indigo-800',
  autumn: 'from-yellow-600 via-red-600 to-red-700',
  spring: 'from-green-300 via-yellow-300 to-pink-300',
};

// Types for subtitle gradient generation
export interface SubtitleGradientOptions {
  text: string;
  colors: string[];
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  fontSize?: string;
  letterSpacing?: string;
  uppercase?: boolean;
  characterSpacing?: number;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
}

export interface GradientCharacter {
  char: string;
  color: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
}

// Function to create RGB values for gradient
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  // Extract RGB components
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  // Interpolate
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Generate a gradient across characters
export const generateSubtitleGradient = (options: SubtitleGradientOptions): GradientCharacter[] => {
  const { text, colors, bold, italic, underline, strikethrough } = options;
  const chars: GradientCharacter[] = [];
  
  if (!text || colors.length < 2) {
    // Default to a simple gradient if not enough colors
    const defaultColors = ['#9b87f5', '#7E69AB'];
    return text.split('').map((char, i) => ({
      char,
      color: interpolateColor(defaultColors[0], defaultColors[1], i / (text.length - 1)),
      bold,
      italic,
      underline,
      strikethrough
    }));
  }
  
  // For each character, calculate its position in the gradient
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    // Calculate which color segment this character falls into
    const segmentLength = text.length / (colors.length - 1);
    const segment = Math.min(Math.floor(i / segmentLength), colors.length - 2);
    const segmentPosition = (i - segment * segmentLength) / segmentLength;
    
    // Interpolate between the two colors for this segment
    const color = interpolateColor(colors[segment], colors[segment + 1], segmentPosition);
    
    chars.push({
      char,
      color,
      bold,
      italic,
      underline,
      strikethrough
    });
  }
  
  return chars;
};

// Function to convert gradient characters to CSS style for each span
export const generateGradientHTML = (gradientChars: GradientCharacter[]): React.ReactNode => {
  return gradientChars.map((charData, index) => {
    const { char, color, bold, italic, underline, strikethrough } = charData;
    
    // Skip rendering spaces with complex styles
    if (char === ' ') {
      return <span key={index}>&nbsp;</span>;
    }
    
    return (
      <span
        key={index}
        style={{
          color,
          fontWeight: bold ? 'bold' : 'normal',
          fontStyle: italic ? 'italic' : 'normal',
          textDecoration: [
            underline ? 'underline' : '',
            strikethrough ? 'line-through' : ''
          ].filter(Boolean).join(' '),
          display: 'inline-block',
          transition: 'all 0.3s ease',
        }}
      >
        {char}
      </span>
    );
  });
};

// Function to create a Minecraft-like color gradient for each character
export const createMinecraftGradient = (text: string, startColor: string, endColor: string): string => {
  // This is a simplified version, actual implementation would require processing hexcodes
  return `bg-gradient-to-r from-[${startColor}] to-[${endColor}] bg-clip-text text-transparent`;
};

// Export a function that returns the JSX for gradient text
// This avoids using JSX directly in this .ts file
export const getGradientTextJSX = (
  text: string,
  gradient: string = 'from-violet-500 to-fuchsia-500',
  className: string = ''
): { className: string, text: string } => {
  const gradientClass = `bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`;
  return { className: gradientClass, text };
};

// Gradient presets for the subtitle system
export const gradientPresets = [
  { name: 'Rainbow', colors: ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'] },
  { name: 'Ocean', colors: ['#00FFFF', '#0080FF', '#0000FF', '#000080'] },
  { name: 'Sunset', colors: ['#FF8000', '#FF4000', '#FF0080', '#8000FF'] },
  { name: 'Forest', colors: ['#FFFF00', '#80FF00', '#00FF80', '#008040'] },
  { name: 'Fire', colors: ['#FFFF00', '#FF8000', '#FF0000', '#800000'] },
  { name: 'Pastel', colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'] },
  { name: 'Neon', colors: ['#FF00FF', '#00FFFF', '#00FF00'] },
  { name: 'Earth', colors: ['#8B4513', '#556B2F', '#2E8B57', '#1E90FF'] },
  { name: 'Candy', colors: ['#FF77FF', '#77FFFF', '#FFFF77'] },
  { name: 'Minecraft', colors: ['#FF5555', '#FFFF55', '#55FF55', '#55FFFF', '#5555FF', '#FF55FF'] },
];

// Helper function to convert a tailwind gradient to an array of color codes
export const tailwindGradientToColors = (gradient: string): string[] => {
  // This is a simplified implementation
  // In a real app, you would need to map Tailwind color classes to their actual hex values
  const parts = gradient.split(' ');
  const colors: string[] = [];
  
  // Extract color parts (from-*, via-*, to-*)
  parts.forEach(part => {
    if (part.startsWith('from-')) {
      colors.push(tailwindColorToHex(part.replace('from-', '')));
    } else if (part.startsWith('via-')) {
      colors.push(tailwindColorToHex(part.replace('via-', '')));
    } else if (part.startsWith('to-')) {
      colors.push(tailwindColorToHex(part.replace('to-', '')));
    }
  });
  
  return colors;
};

// Convert a Tailwind color to hex (simplified)
const tailwindColorToHex = (color: string): string => {
  // This is a very simplified mapping, in a real implementation you would need a complete
  // mapping of Tailwind colors to hex values
  const colorMap: Record<string, string> = {
    'red-500': '#EF4444',
    'yellow-500': '#EAB308',
    'green-500': '#22C55E',
    'blue-500': '#3B82F6',
    'indigo-500': '#6366F1',
    'purple-500': '#A855F7',
    'pink-500': '#EC4899',
    'violet-500': '#8B5CF6',
    'fuchsia-500': '#D946EF',
    'orange-500': '#F97316',
    'amber-500': '#F59E0B',
    'amber-700': '#B45309',
    'amber-800': '#92400E',
    'amber-900': '#78350F',
    'emerald-500': '#10B981',
    'emerald-600': '#059669',
    'rose-500': '#F43F5E',
    'cyan-400': '#22D3EE',
    'cyan-500': '#06B6D4',
    'teal-500': '#14B8A6',
    'teal-600': '#0D9488',
    'sky-400': '#38BDF8',
    'blue-500': '#3B82F6',
    'indigo-500': '#6366F1',
    'indigo-600': '#4F46E5',
    'indigo-800': '#3730A3',
    'red-600': '#DC2626',
    'red-700': '#B91C1C',
    'green-300': '#86EFAC',
    'green-600': '#16A34A',
    'green-700': '#15803D',
    'blue-600': '#2563EB',
    'blue-900': '#1E3A8A',
    'purple-300': '#D8B4FE',
    'purple-600': '#9333EA',
    'purple-900': '#581C87',
    'pink-300': '#F9A8D4',
    'pink-400': '#F472B6',
    'blue-300': '#93C5FD',
    'blue-400': '#60A5FA',
    'yellow-300': '#FDE047',
    'yellow-600': '#CA8A04',
  };
  
  return colorMap[color] || '#000000';
};
