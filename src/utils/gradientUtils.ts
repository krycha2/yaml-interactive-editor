
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
  // This is a simplified version, actual implementation would require processing hexcodes
  return `bg-gradient-to-r from-[${startColor}] to-[${endColor}] bg-clip-text text-transparent`;
};

// Component for gradient text (to be used in React)
export const GradientText = ({
  text,
  gradient = 'from-violet-500 to-fuchsia-500',
  className = '',
}: {
  text: string;
  gradient?: string;
  className?: string;
}) => {
  const gradientClass = `bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`;
  return <span className={gradientClass}>{text}</span>;
};
