
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
};

// Function to create a Minecraft-like color gradient for each character
export const createMinecraftGradient = (text: string, startColor: string, endColor: string): string => {
  // Convert hex colors to RGB
  const startRGB = hexToRgb(startColor);
  const endRGB = hexToRgb(endColor);
  
  if (!startRGB || !endRGB) return text;
  
  // Create gradient by interpolating each character
  let result = '';
  const length = text.length;
  
  for (let i = 0; i < length; i++) {
    const ratio = i / (length - 1);
    const r = Math.round(startRGB.r + ratio * (endRGB.r - startRGB.r));
    const g = Math.round(startRGB.g + ratio * (endRGB.g - startRGB.g));
    const b = Math.round(startRGB.b + ratio * (endRGB.b - startRGB.b));
    
    const hex = rgbToHex(r, g, b);
    result += `&#${hex}${text[i]}`;
  }
  
  return result;
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex to RGB
  const bigint = parseInt(hex, 16);
  if (isNaN(bigint)) return null;
  
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};

// Helper function to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
};

// Export a function that returns the properties for gradient text
// This avoids using JSX directly in this .ts file
export const getGradientTextJSX = (
  text: string,
  gradient: string = 'from-violet-500 to-fuchsia-500',
  className: string = ''
): { className: string, text: string } => {
  const gradientClass = `bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`;
  return { className: gradientClass, text };
};

// Function to generate gradient from Birdflop API
export const getBirdflopGradient = async (text: string, startColor?: string, endColor?: string, midColor?: string): Promise<string> => {
  try {
    let url = `https://www.birdflop.com/api/v2/gradient?text=${encodeURIComponent(text)}`;
    
    // Add colors if provided
    if (startColor) url += `&startColor=${startColor.replace('#', '')}`;
    if (endColor) url += `&endColor=${endColor.replace('#', '')}`;
    if (midColor) url += `&midColor=${midColor.replace('#', '')}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch gradient');
    }
    const data = await response.json();
    return data.result || text;
  } catch (error) {
    console.error('Error fetching gradient:', error);
    return text;
  }
};

// Generate a filename based on category, task number, and block type
export const generateTaskFilename = (
  category: string, 
  taskNumber: number,
  blockType: string
): string => {
  // Clean the category and get first letter
  const categoryPrefix = category.replace(/["']/g, '').trim()[0].toUpperCase();
  return `${categoryPrefix}${taskNumber}_${blockType.replace(/["']/g, '').trim()}`;
};
