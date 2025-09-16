/**
 * Image utilities for handling placeholders and fallbacks
 */

export const PLACEHOLDER_IMAGES = {
  megaHair: '/images/placeholders/mega-hair-placeholder.jpg',
  product: '/images/placeholders/product-placeholder.jpg',
  user: '/images/placeholders/user-placeholder.jpg',
  cosmetic: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center',
} as const;

// Array of working cosmetic placeholder images
export const COSMETIC_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center', // makeup
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop&crop=center', // cosmetics
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop&crop=center', // beauty products
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center', // lipstick
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop&crop=center', // nail polish
  'https://images.unsplash.com/photo-1487309078313-fad80c3ec1e5?w=400&h=400&fit=crop&crop=center', // perfume
  'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop&crop=center', // foundation
  'https://images.unsplash.com/photo-1605462863863-10d9e47e15ee?w=400&h=400&fit=crop&crop=center', // makeup palette
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop&crop=center', // makeup brushes
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop&crop=center', // skincare
] as const;

export const generatePlaceholderUrl = (
  width: number,
  height: number,
  text: string,
  bgColor: string = 'F5F5DC',
  textColor: string = '666666'
): string => {
  // Use local placeholder instead of external service
  return PLACEHOLDER_IMAGES.product;
};

export const getMegaHairPlaceholder = (productName: string, length: number): string => {
  return PLACEHOLDER_IMAGES.megaHair;
};

export const getImageWithFallback = (src: string, fallback?: string): string => {
  if (!src || src.includes('via.placeholder.com')) {
    return fallback || PLACEHOLDER_IMAGES.product;
  }
  return src;
};

export const createSVGPlaceholder = (
  width: number,
  height: number,
  text: string,
  bgColor: string = '#F5F5DC',
  textColor: string = '#666666'
): string => {
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="system-ui, sans-serif" font-size="14" font-weight="500">
        ${text}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

/**
 * Get a cosmetic placeholder image
 * @param index - Index to get a specific placeholder (optional)
 * @returns URL of a cosmetic placeholder image
 */
export const getCosmeticPlaceholder = (index?: number): string => {
  if (index !== undefined) {
    return COSMETIC_PLACEHOLDERS[index % COSMETIC_PLACEHOLDERS.length];
  }
  return COSMETIC_PLACEHOLDERS[Math.floor(Math.random() * COSMETIC_PLACEHOLDERS.length)];
};

/**
 * Get a working image URL or fallback to cosmetic placeholder
 * @param originalUrl - Original image URL
 * @param fallbackIndex - Index for consistent placeholder selection
 * @returns Working image URL
 */
export const getWorkingImageUrl = (originalUrl: string, fallbackIndex?: number): string => {
  // Check if it's a Google Drive URL (which we know are not accessible)
  if (originalUrl && originalUrl.includes('drive.google.com')) {
    return getCosmeticPlaceholder(fallbackIndex);
  }

  // Check if it's already a working placeholder
  if (originalUrl && originalUrl.includes('images.unsplash.com')) {
    return originalUrl;
  }

  // Return placeholder for any other potentially broken URL
  return originalUrl || getCosmeticPlaceholder(fallbackIndex);
};

/**
 * Handle image error and return appropriate fallback
 * @param fallbackIndex - Index for consistent placeholder selection
 */
export const handleImageError = (fallbackIndex?: number): string => {
  return getCosmeticPlaceholder(fallbackIndex);
};