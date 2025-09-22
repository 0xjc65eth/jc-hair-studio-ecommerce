import { useMemo } from 'react';
import productData from '@/lib/data/products-reorganized.json';
import advancedCatalog from '@/lib/data/products-advanced-catalog.json';

// Import additional catalogs with safe loading
let megaConsolidatedCatalog: any = { categories: [] };
try {
  megaConsolidatedCatalog = require('@/lib/data/products-mega-consolidated.json');
} catch (e) {
  console.warn('Mega consolidated catalog not found');
}

interface Product {
  id: string;
  name: string;
  brand: string;
  description?: string;
  shortDesc?: string;
  finalidade?: string;
  volume?: string;
  cor?: string;
  cores?: string[];
  colors?: string[];
  price?: number;
  priceBRL?: number;
  price_brl?: number;
  price_eur?: number;
  originalPrice?: number;
  pricing?: {
    basePrice: number;
    ourPrice: number;
    discountPrice: number;
    savings: number;
    margin: string;
    competitive: string;
  };
  images: string[];
  image?: string;
  rating?: number;
  reviews?: number;
  reviewsCount?: number;
  inStock?: boolean;
  stockQuantity?: number;
  stock?: number;
  weight?: number;
  labels?: string[];
  tags?: string[];
  category: string;
  subcategory?: string;
  features?: string[];
  featured?: boolean;
  isNew?: boolean;
  hasDiscount?: boolean;
  imageCarousel?: any[];
  specifications?: any;
}

interface CategoryData {
  id: string;
  key?: string;
  name: string;
  slug?: string;
  description?: string;
  icon: string;
  products: Product[];
}

export const useProductDataSimplified = () => {
  // Get all products from all catalogs
  const getAllProductsFromCatalogs = useMemo(() => {
    const allProducts: Product[] = [];
    const seenIds = new Set<string>();

    // Process products-reorganized.json (Mari Maria bases)
    if (productData.categories && Array.isArray(productData.categories)) {
      productData.categories.forEach((category: any) => {
        if (category.products && Array.isArray(category.products)) {
          category.products.forEach((product: any) => {
            if (!seenIds.has(product.id)) {
              seenIds.add(product.id);
              allProducts.push({
                ...product,
                category: category.name,
                images: product.images?.map((img: any) =>
                  typeof img === 'string' ? img : img.url
                ) || [product.image || '/placeholder-product.jpg'],
                price: product.price || product.price_eur,
                priceBRL: product.priceBRL || product.price_brl,
              });
            }
          });
        }
      });
    }

    // Process advanced catalog (hair treatments)
    if (advancedCatalog.categories) {
      Object.entries(advancedCatalog.categories).forEach(([key, categoryData]: [string, any]) => {
        if (categoryData.products && Array.isArray(categoryData.products)) {
          categoryData.products.forEach((product: any) => {
            if (!seenIds.has(product.id)) {
              seenIds.add(product.id);
              allProducts.push({
                ...product,
                category: categoryData.metadata?.type || key,
                images: product.images || [product.image || '/placeholder-product.jpg'],
                price: product.price || product.price_eur,
                priceBRL: product.priceBRL || product.price_brl,
              });
            }
          });
        }
      });
    }

    // Process mega consolidated catalog
    if (megaConsolidatedCatalog.categories && Array.isArray(megaConsolidatedCatalog.categories)) {
      megaConsolidatedCatalog.categories.forEach((category: any) => {
        if (category.products && Array.isArray(category.products)) {
          category.products.forEach((product: any) => {
            if (!seenIds.has(product.id)) {
              seenIds.add(product.id);
              allProducts.push({
                ...product,
                category: category.name,
                images: product.images?.map((img: any) =>
                  typeof img === 'string' ? img : img.url
                ) || [product.image || '/placeholder-product.jpg'],
                price: product.price || product.price_eur,
                priceBRL: product.priceBRL || product.price_brl,
              });
            }
          });
        }
      });
    }

    return allProducts;
  }, []);

  // Get categories from all catalogs
  const getCategoriesFromCatalogs = useMemo(() => {
    const categories: CategoryData[] = [];
    const seenCategoryIds = new Set<string>();

    // Process products-reorganized.json categories
    if (productData.categories && Array.isArray(productData.categories)) {
      productData.categories.forEach((category: any) => {
        if (category.products && category.products.length > 0) {
          const categoryId = category.id || category.name.toLowerCase().replace(/\s+/g, '-');
          if (!seenCategoryIds.has(categoryId)) {
            seenCategoryIds.add(categoryId);
            categories.push({
              id: categoryId,
              name: category.name,
              description: category.description,
              icon: category.icon || '🎨',
              products: category.products.map((product: any) => ({
                ...product,
                category: category.name,
                images: product.images?.map((img: any) =>
                  typeof img === 'string' ? img : img.url
                ) || [product.image || '/placeholder-product.jpg'],
                price: product.price || product.price_eur,
                priceBRL: product.priceBRL || product.price_brl,
              }))
            });
          }
        }
      });
    }

    // Process advanced catalog categories
    if (advancedCatalog.categories) {
      Object.entries(advancedCatalog.categories).forEach(([key, categoryData]: [string, any]) => {
        if (categoryData.products && categoryData.products.length > 0) {
          if (!seenCategoryIds.has(key)) {
            seenCategoryIds.add(key);

            let categoryName = key;
            if (categoryData.metadata?.brand && categoryData.metadata?.type) {
              categoryName = `${categoryData.metadata.brand} - ${categoryData.metadata.type}`;
            } else if (key === 'progressivas') {
              categoryName = 'Progressivas';
            } else if (key === 'selagem') {
              categoryName = 'Selagem Capilar';
            } else if (key === 'botox') {
              categoryName = 'Botox Capilar';
            } else if (key === 'relaxamentos') {
              categoryName = 'Relaxamentos';
            } else if (key === 'hidratacao') {
              categoryName = 'Hidratação';
            }

            categories.push({
              id: key,
              key: key,
              name: categoryName,
              icon: '💆‍♀️',
              products: categoryData.products.map((product: any) => ({
                ...product,
                category: categoryName,
                images: product.images || [product.image || '/placeholder-product.jpg'],
                price: product.price || product.price_eur,
                priceBRL: product.priceBRL || product.price_brl,
              }))
            });
          }
        }
      });
    }

    // Process mega consolidated catalog categories
    if (megaConsolidatedCatalog.categories && Array.isArray(megaConsolidatedCatalog.categories)) {
      megaConsolidatedCatalog.categories.forEach((category: any) => {
        if (category.products && category.products.length > 0) {
          const categoryId = category.id || category.name.toLowerCase().replace(/\s+/g, '-');
          if (!seenCategoryIds.has(categoryId)) {
            seenCategoryIds.add(categoryId);
            categories.push({
              id: categoryId,
              name: category.name,
              description: category.description,
              icon: category.icon || '💄',
              products: category.products.map((product: any) => ({
                ...product,
                category: category.name,
                images: product.images?.map((img: any) =>
                  typeof img === 'string' ? img : img.url
                ) || [product.image || '/placeholder-product.jpg'],
                price: product.price || product.price_eur,
                priceBRL: product.priceBRL || product.price_brl,
              }))
            });
          }
        }
      });
    }

    return categories;
  }, []);

  // Get ALL cosmetic and treatment categories
  const getEnhancedCosmeticCategories = () => {
    const allCategories = getCategoriesFromCatalogs;
    console.log('🔧 Total categories from catalogs:', allCategories.length);
    allCategories.forEach(cat => {
      console.log(`  📋 Category: ${cat.name} (${cat.id}) - ${cat.products.length} products`);
    });

    // Return all categories except Mari Maria bases (those go to makeup)
    const cosmeticCategories = getCategoriesFromCatalogs.filter(category =>
      !category.id.includes('mari-maria')
    );

    console.log('🎨 Enhanced cosmetic categories loaded:', cosmeticCategories.length);
    cosmeticCategories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.products.length} products`);
    });

    return cosmeticCategories;
  };

  // Get hair treatment categories specifically
  const getHairTreatmentCategories = () => {
    const treatmentKeys = ['progressivas', 'selagem', 'botox', 'relaxamentos', 'hidratacao'];
    const treatmentCategories = getCategoriesFromCatalogs.filter(category =>
      treatmentKeys.includes(category.id) || treatmentKeys.includes(category.key || '')
    );

    console.log('💫 Hair treatment categories loaded:', treatmentCategories.length);
    treatmentCategories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.products.length} products`);
    });

    return treatmentCategories;
  };

  // Get makeup categories (Mari Maria bases)
  const getMakeupCategories = () => {
    const makeupCategories = getCategoriesFromCatalogs.filter(category =>
      category.id.includes('mari-maria')
    );

    console.log('💄 Makeup categories loaded:', makeupCategories.length);
    makeupCategories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.products.length} products`);
    });

    return makeupCategories;
  };

  // Get all categories
  const getAllCategories = () => {
    return getCategoriesFromCatalogs;
  };

  // Get all products
  const getAllProducts = () => {
    return getAllProductsFromCatalogs;
  };

  // Get products by category
  const getProductsByCategory = (categoryId: string) => {
    const category = getCategoriesFromCatalogs.find(cat =>
      cat.id === categoryId || cat.key === categoryId
    );
    return category?.products || [];
  };

  // Get product by ID
  const getProductById = (productId: string) => {
    return getAllProductsFromCatalogs.find(product => product.id === productId);
  };

  // Get featured products
  const getFeaturedProducts = () => {
    return getAllProductsFromCatalogs.filter(product =>
      product.featured ||
      product.labels?.includes('DESTAQUE') ||
      product.labels?.includes('PREMIUM') ||
      product.labels?.includes('BESTSELLER')
    );
  };

  // Get categories stats
  const getCategoryStats = () => {
    const categories = getCategoriesFromCatalogs;
    const totalProducts = getAllProductsFromCatalogs.length;

    return {
      version: '2.0.0',
      lastUpdated: new Date().toISOString(),
      totalCategories: categories.length,
      totalProducts,
      source: 'unified-catalogs'
    };
  };

  return {
    getAllCategories,
    getAllProducts,
    getProductsByCategory,
    getProductById,
    getFeaturedProducts,
    getCategoryStats,
    getEnhancedCosmeticCategories,
    getHairTreatmentCategories,
    getMakeupCategories
  };
};