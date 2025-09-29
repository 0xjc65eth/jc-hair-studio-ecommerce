import { useMemo } from 'react';
import europeanPricingCatalog from '@/lib/data/products-with-european-pricing.json';

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
  pricing: {
    basePrice: number;
    ourPrice: number;
    discountPrice: number;
    savings: number;
    margin: string;
    competitive: string;
  };
  images: string[];
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  stockQuantity?: number;
  weight?: number;
  labels?: string[];
  tags?: string[];
  category: string;
  subcategory?: string;
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  products: Product[];
}

export const useProductDataEuropean = () => {
  // Get all products from European pricing catalog
  const getAllProductsFromEuropeanCatalog = useMemo(() => {
    const allProducts: Product[] = [];
    const categories = europeanPricingCatalog.categories || [];

    categories.forEach((category: any) => {
      if (category.products) {
        category.products.forEach((product: any) => {
          allProducts.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            description: product.description,
            shortDesc: product.shortDesc,
            finalidade: product.finalidade,
            volume: product.volume,
            cor: product.cor,
            cores: product.cores,
            pricing: product.pricing,
            images: product.images || ['/placeholder-product.jpg'],
            rating: product.rating || 4.5,
            reviewsCount: product.reviewsCount || 0,
            inStock: product.inStock || true,
            stockQuantity: product.stockQuantity || 0,
            weight: product.weight || 0,
            labels: product.labels || [],
            tags: product.tags || [],
            category: category.name,
            subcategory: product.subcategory
          });
        });
      }
    });

    console.log('🎯 European catalog loaded:', allProducts.length, 'products total');
    return allProducts;
  }, []);

  // Get categories from European pricing catalog
  const getCategoriesFromEuropeanCatalog = useMemo(() => {
    const categories: CategoryData[] = [];
    const catalogCategories = europeanPricingCatalog.categories || [];

    catalogCategories.forEach((category: any) => {
      if (category.products && category.products.length > 0) {
        categories.push({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon,
          products: category.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            brand: product.brand,
            description: product.description,
            shortDesc: product.shortDesc,
            finalidade: product.finalidade,
            volume: product.volume,
            cor: product.cor,
            cores: product.cores,
            pricing: product.pricing,
            images: product.images || ['/placeholder-product.jpg'],
            rating: product.rating || 4.5,
            reviewsCount: product.reviewsCount || 0,
            inStock: product.inStock || true,
            stockQuantity: product.stockQuantity || 0,
            weight: product.weight || 0,
            labels: product.labels || [],
            tags: product.tags || [],
            category: category.name,
            subcategory: product.subcategory
          }))
        });
      }
    });

    console.log('📂 European categories loaded:', categories.length);
    categories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.products.length} products`);
    });

    return categories;
  }, []);

  // Get ONLY hair cosmetic and treatment categories (excludes makeup/maquiagem)
  const getEnhancedCosmeticCategories = () => {
    // Filter out makeup categories - only hair care products
    const hairCareCategories = getCategoriesFromEuropeanCatalog.filter(category =>
      category.id !== 'maquiagem-premium' // Exclude makeup from cosmetics tab
    );

    console.log('🎨 Hair care cosmetic categories loaded:', hairCareCategories.length);
    hairCareCategories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.products.length} products`);
    });

    return hairCareCategories;
  };

  // Get hair treatment categories (Progressivas, Tratamentos) - kept for compatibility
  const getHairTreatmentCategories = () => {
    const treatmentCategories = getCategoriesFromEuropeanCatalog.filter(category =>
      category.id === 'progressivas-btx' ||
      category.id === 'tratamentos-capilares'
    );

    console.log('💫 Hair treatment categories loaded:', treatmentCategories.length);

    return treatmentCategories;
  };

  // Get ONLY makeup categories for the maquiagens page
  const getMakeupCategories = () => {
    const makeupCategories = getCategoriesFromEuropeanCatalog.filter(category =>
      category.id === 'maquiagem-premium' ||
      category.name.toLowerCase().includes('maquiagem') ||
      category.name.toLowerCase().includes('makeup') ||
      category.name.toLowerCase().includes('base') ||
      category.name.toLowerCase().includes('batom')
    );

    console.log('💄 Makeup categories loaded:', makeupCategories.length);
    makeupCategories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.products.length} products`);
    });

    return makeupCategories;
  };

  // Get all categories
  const getAllCategories = () => {
    return getCategoriesFromEuropeanCatalog;
  };

  // Get all products
  const getAllProducts = () => {
    return getAllProductsFromEuropeanCatalog;
  };

  // Get products by category
  const getProductsByCategory = (categoryId: string) => {
    const category = getCategoriesFromEuropeanCatalog.find(cat => cat.id === categoryId);
    return category?.products || [];
  };

  // Get product by ID
  const getProductById = (productId: string) => {
    return getAllProductsFromEuropeanCatalog.find(product => product.id === productId);
  };

  // Get featured products
  const getFeaturedProducts = () => {
    return getAllProductsFromEuropeanCatalog.filter(product =>
      product.labels?.includes('DESTAQUE') ||
      product.labels?.includes('PREMIUM') ||
      product.labels?.includes('BESTSELLER')
    );
  };

  // Get categories stats
  const getCategoryStats = () => {
    const categories = getCategoriesFromEuropeanCatalog;
    const totalProducts = getAllProductsFromEuropeanCatalog.length;

    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      totalCategories: categories.length,
      totalProducts,
      source: 'european-pricing-catalog'
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