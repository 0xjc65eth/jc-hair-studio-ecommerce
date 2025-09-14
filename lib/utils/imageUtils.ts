/**
 * Image utilities for handling placeholders and fallbacks
 */

export const PLACEHOLDER_IMAGES = {
  megaHair: '/images/placeholders/mega-hair-placeholder.jpg',
  product: '/images/placeholders/product-placeholder.jpg',
  user: '/images/placeholders/user-placeholder.jpg',
} as const;

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