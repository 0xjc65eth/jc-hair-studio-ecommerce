// European Pricing Products - Load from JSON
import europeanPricingData from './products-with-european-pricing.json';

export interface EuropeanProduct {
  id: string;
  name: string;
  slug?: string;
  brand: string;
  shortDesc?: string;
  description: string;
  sku?: string;
  category: string;
  subcategory?: string;
  finalidade?: string;
  volume?: string;
  pricing: {
    basePrice: number;
    ourPrice: number;
    discountPrice: number;
    savings: number;
    margin?: string;
    competitive?: string;
  };
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  stockQuantity?: number;
  weight?: number;
  labels?: string[];
  image?: string;
  images?: string[];
}

// Flatten all products from all categories
export const allEuropeanProducts: EuropeanProduct[] = [];

if (europeanPricingData && europeanPricingData.categories) {
  europeanPricingData.categories.forEach((category: any) => {
    if (category.products && Array.isArray(category.products)) {
      category.products.forEach((product: any) => {
        allEuropeanProducts.push({
          ...product,
          // Ensure images field exists
          images: product.images || (product.image ? [product.image] : []),
        });
      });
    }
  });
}

export function getEuropeanProductById(id: string): EuropeanProduct | undefined {
  return allEuropeanProducts.find(p => p.id === id);
}

export function getEuropeanProductsByCategory(category: string): EuropeanProduct[] {
  return allEuropeanProducts.filter(p => p.category === category);
}
