import { useMemo } from 'react';
import productData from '@/lib/data/products-with-european-pricing.json';
import advancedCatalog from '@/lib/data/products-advanced-catalog.json';

// Import additional catalogs
let megaConsolidatedCatalog: any = {};
let brunaTavaresCatalog: any = {};
let bioExtratusCatalog: any = {};
let botoxCatalog: any = {};
let hydrationCatalog: any = {};

try {
  megaConsolidatedCatalog = require('@/lib/data/products-mega-consolidated.json');
} catch (e) {
  console.warn('Mega consolidated catalog not found');
}

try {
  brunaTavaresCatalog = require('@/lib/data/bruna-tavares-bt-skin-catalog.json');
} catch (e) {
  console.warn('Bruna Tavares catalog not found');
}

try {
  bioExtratusCatalog = require('@/lib/data/catalog_bio_extratus_produtos__advanced.json');
} catch (e) {
  console.warn('Bio Extratus catalog not found');
}

try {
  botoxCatalog = require('@/lib/data/botox-products-catalog.json');
} catch (e) {
  console.warn('Botox catalog not found');
}

try {
  hydrationCatalog = require('@/lib/data/hydration-products-catalog.json');
} catch (e) {
  console.warn('Hydration catalog not found');
}

// Hair treatment catalogs will be loaded dynamically to avoid import issues

interface ProductData {
  metadata?: {
    version: string;
    lastUpdated: string;
    totalCategories: number;
    totalProducts: number;
    totalImages: number;
  };
  categories?: Record<string, CategoryData>;
}

interface CategoryData {
  name: string;
  icon: string;
  products: Product[];
  id?: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  description?: string;
  price?: number;
  price_brl?: number;
  price_eur?: number;
  priceBRL?: number;
  originalPrice?: number;
  images: string[];
  colors?: string[];
  features?: string[];
  stock?: number;
  rating?: number;
  reviews?: number;
  category?: string;
  featured?: boolean;
  isNew?: boolean;
  hasDiscount?: boolean;
  inStock?: boolean;
  imageCarousel?: Array<{
    id: number;
    url: string;
    alt: string;
    size?: number;
    lastModified?: string;
  }>;
  specifications?: any;
  tags?: string[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export const useProductData = () => {
  const data = useMemo(() => {
    return productData as ProductData;
  }, []);


  const megaConsolidatedData = useMemo(() => {
    return megaConsolidatedCatalog as any;
  }, []);

  const brunaTavaresData = useMemo(() => {
    return brunaTavaresCatalog as any;
  }, []);

  const advancedCatalogData = useMemo(() => {
    return advancedCatalog as any;
  }, []);

  // Function to merge both catalogs without duplication
  const getMergedCatalog = useMemo(() => {
    const mergedCategories: Record<string, CategoryData> = {};
    const seenIds = new Set<string>();

    // Add existing catalog categories - handle both object and array structures
    if (data.categories) {
      if (Array.isArray(data.categories)) {
        // Handle array structure from products-reorganized.json
        data.categories.forEach((category: any) => {
          const key = category.id || category.name?.toLowerCase().replace(/[^a-z0-9]/g, '-');
          if (key && category.products) {
            mergedCategories[key] = {
              name: category.name,
              icon: category.icon || '🎨',
              id: category.id,
              products: (category.products || []).filter((product: any) => {
                if (!seenIds.has(product.id)) {
                  seenIds.add(product.id);
                  return true;
                }
                return false;
              })
            };
          }
        });
      } else {
        // Handle object structure
        Object.entries(data.categories).forEach(([key, category]: [string, any]) => {
          mergedCategories[key] = {
            ...category,
            products: category.products.filter((product: any) => {
              if (!seenIds.has(product.id)) {
                seenIds.add(product.id);
                return true;
              }
              return false;
            })
          };
        });
      }
    }


    return {
      metadata: {
        version: '5.0.0',
        lastUpdated: new Date().toISOString(),
        totalCategories: Object.keys(mergedCategories).length,
        totalProducts: Object.values(mergedCategories).reduce((sum, cat) => sum + cat.products.length, 0),
        source: 'merged-catalogs'
      },
      categories: mergedCategories
    };
  }, [data]);

  const getCategoryByKey = (categoryKey: string) => {
    const mergedCatalog = getMergedCatalog;
    if (!mergedCatalog?.categories) return null;
    return mergedCatalog.categories[categoryKey] || null;
  };

  const getAllProducts = () => {
    const mergedCatalog = getMergedCatalog;
    if (!mergedCatalog?.categories) return [];

    const allProducts: Product[] = [];
    Object.values(mergedCatalog.categories).forEach(category => {
      if (category.products) {
        allProducts.push(...category.products);
      }
    });

    return allProducts;
  };

  const getProductsByCategory = (categoryKey: string) => {
    const category = getCategoryByKey(categoryKey);
    return category?.products || [];
  };

  const getProductById = (productId: string) => {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === productId);
  };

  const getCategoryStats = () => {
    return getMergedCatalog?.metadata;
  };

  const getAllCategories = () => {
    return getMergedCatalog?.categories || {};
  };

  const getCategoriesList = () => {
    const mergedCatalog = getMergedCatalog;
    if (!mergedCatalog?.categories) return [];

    return Object.entries(mergedCatalog.categories).map(([key, category]) => ({
      key,
      name: category.name,
      icon: category.icon,
      productCount: category.products.length,
    }));
  };

  // Function to get hair cosmetic categories (tintas, tratamentos, etc.)
  const getCosmeticCategories = () => {
    const categories = [];

    // Get products from products-reorganized.json
    if (data.categories && Array.isArray(data.categories)) {
      data.categories.forEach((category: any) => {
        if (category.products && category.products.length > 0 && category.id !== 'mari-maria-bases-complete') {
          categories.push({
            key: category.id,
            name: category.name,
            icon: category.icon || '🎨',
            products: category.products,
            id: category.id
          });
        }
      });
    }

    // Process advanced catalog data safely
    // Add products from advanced catalog that have actual products
    if (advancedCatalogData?.categories) {
      Object.entries(advancedCatalogData.categories).forEach(([key, categoryData]: [string, any]) => {
        // Skip categories that are already in products-reorganized
        const existingCategory = categories.find((cat: any) => cat.key === key);
        if (!existingCategory && categoryData.products && categoryData.products.length > 0) {
          categories.push({
            key,
            name: categoryData.metadata?.brand ?
              `${categoryData.metadata.brand} - ${categoryData.metadata.type || 'Produtos'}` :
              key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            icon: '🎨',
            products: categoryData.products.map((product: any) => ({
              id: product.id,
              name: product.name,
              brand: product.brand,
              category: product.category,
              description: product.description,
              price: product.price,
              priceBRL: product.priceBRL,
              originalPrice: product.originalPrice,
              images: product.images || [],
              imageCarousel: product.imageCarousel,
              features: product.features || [],
              stock: product.stock,
              rating: product.rating || 4.5,
              reviews: product.reviews || 0,
              inStock: product.inStock !== false,
              featured: product.featured || false,
              isNew: product.isNew || false,
              hasDiscount: product.hasDiscount || false,
              tags: product.tags || [],
              specifications: product.specifications
            })),
            id: key
          });
        }
      });
    }

    // DO NOT add hair treatment categories here - they should come from getHairTreatmentCategories()
    // This ensures we don't get makeup products mixed in

    return categories;
  };

  // Function to get hair treatment categories - loads all non-tinta catalogs
  const getHairTreatmentCategories = () => {
    const categories = [];

    console.log('🔄 Loading hair treatment categories...');

    try {
      // Bio Extratus catalog
      if (bioExtratusCatalog?.products?.length > 0) {
        const bioExtratusProducts = bioExtratusCatalog.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          description: product.description,
          price: product.price,
          priceBRL: product.priceBRL,
          originalPrice: product.originalPrice,
          images: product.images || [],
          imageCarousel: product.imageCarousel,
          features: product.features || [],
          stock: product.stock,
          rating: product.rating || 4.5,
          reviews: product.reviews || 0,
          inStock: product.inStock !== false,
          featured: product.featured || false,
          isNew: product.isNew || false,
          hasDiscount: product.hasDiscount || false,
          tags: product.tags || [],
          specifications: product.specifications
        }));

        categories.push({
          key: 'bio_extratus_produtos_',
          name: 'Produtos Capilares',
          icon: '🌿',
          products: bioExtratusProducts,
          id: 'bio_extratus_produtos_'
        });

        console.log('✅ Bio Extratus catalog loaded:', bioExtratusProducts.length, 'products');
      }
    } catch (error) {
      console.warn('⚠️ Bio Extratus catalog not available:', error);
    }

    try {
      // Botox catalog
      if (botoxCatalog?.botox?.products?.length > 0) {
        const botoxProducts = botoxCatalog.botox.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: 'Produtos Botox Capilar',
          description: product.description,
          price: product.price_eur,
          priceBRL: product.price_brl,
          originalPrice: product.originalPrice,
          images: product.images || [],
          imageCarousel: product.imageCarousel,
          features: product.features || [],
          stock: product.stock,
          rating: product.rating || 4.5,
          reviews: product.reviews || 0,
          inStock: product.inStock !== false,
          featured: product.featured || false,
          isNew: product.isNew || false,
          hasDiscount: product.hasDiscount || false,
          tags: product.tags || [],
          specifications: product.specifications
        }));

        categories.push({
          key: 'botox',
          name: 'Produtos Botox Capilar',
          icon: '💫',
          products: botoxProducts,
          id: 'botox'
        });

        console.log('✅ Botox catalog loaded:', botoxProducts.length, 'products');
      }
    } catch (error) {
      console.warn('⚠️ Botox catalog not available:', error);
    }

    try {
      // Hydration catalog
      if (hydrationCatalog?.hidratacao?.products?.length > 0) {
        const hydrationProducts = hydrationCatalog.hidratacao.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: 'Produtos de Hidratação',
          description: product.description,
          price: product.price_eur,
          priceBRL: product.price_brl,
          originalPrice: product.originalPrice,
          images: product.images || [],
          imageCarousel: product.imageCarousel,
          features: product.features || [],
          stock: product.stock,
          rating: product.rating || 4.5,
          reviews: product.reviews || 0,
          inStock: product.inStock !== false,
          featured: product.featured || false,
          isNew: product.isNew || false,
          hasDiscount: product.hasDiscount || false,
          tags: product.tags || [],
          specifications: product.specifications
        }));

        categories.push({
          key: 'hidratacao',
          name: 'Produtos de Hidratação',
          icon: '💧',
          products: hydrationProducts,
          id: 'hidratacao'
        });

        console.log('✅ Hydration catalog loaded:', hydrationProducts.length, 'products');
      }
    } catch (error) {
      console.warn('⚠️ Hydration catalog not available:', error);
    }

    console.log('📊 Total treatment categories loaded:', categories.length);
    return categories;
  };


  // Enhanced cosmetic categories function (hair products only)
  const getEnhancedCosmeticCategories = () => {
    const cosmeticCategories = getCosmeticCategories();
    const hairTreatmentCategories = getHairTreatmentCategories();

    // Combine hair cosmetic and treatment categories, avoiding duplicates
    const allCategories = [...cosmeticCategories];

    hairTreatmentCategories.forEach(treatmentCat => {
      const existsInCosmetic = cosmeticCategories.find(cosmetic =>
        cosmetic.key === treatmentCat.key || cosmetic.id === treatmentCat.key
      );

      if (!existsInCosmetic) {
        allCategories.push(treatmentCat);
      }
    });

    return allCategories;
  };

  // Function to get makeup categories (Mari Maria bases and other makeup products)
  const getMakeupCategories = () => {
    const categories = [];

    // Mari Maria category from mega consolidated catalog
    if (megaConsolidatedData && megaConsolidatedData.categories) {
      const mariMariaCategory = megaConsolidatedData.categories.find((category: any) =>
        category.id === 'mari-maria-bases-complete' ||
        category.name?.toLowerCase().includes('mari maria')
      );

      if (mariMariaCategory) {
        const mariMariaProducts = mariMariaCategory.products?.map((product: any) => ({
          id: product.id,
          name: product.name,
          brand: product.brand || 'Mari Maria',
          description: product.description,
          price: product.variants?.[0]?.price_eur || 27.00,
          priceBRL: product.variants?.[0]?.price_brl || 69.90,
          originalPrice: product.variants?.[0]?.original_price_brl,
          category: 'Base',
          images: product.images?.map((img: any) => img.url) || [product.image],
          imageCarousel: product.images,
          features: product.features || ['Cobertura Alta', 'Matte', 'Longa Duração'],
          stock: product.variants?.[0]?.stock || 15,
          rating: product.rating || 4.8,
          reviews: product.reviews || 150,
          inStock: product.variants?.[0]?.in_stock !== false,
          featured: product.featured || true,
          isNew: product.isNew || false,
          hasDiscount: product.hasDiscount || false,
          colors: product.variants?.map((variant: any) => variant.tone) || [],
          specifications: product.specifications,
          tags: product.tags
        })) || [];

        categories.push({
          key: 'mari-maria-bases',
          name: mariMariaCategory.name || 'Mari Maria - Bases',
          icon: '💄',
          products: mariMariaProducts,
        });
      }
    }

    // Bruna Tavares BT Skin category
    if (brunaTavaresData && brunaTavaresData.shades) {
      const brunaTavaresProducts = brunaTavaresData.shades.map((shade: any) => ({
        id: shade.id,
        name: shade.name,
        brand: brunaTavaresData.brand,
        description: shade.description,
        price: brunaTavaresData.price_info.eur,
        priceBRL: brunaTavaresData.price_info.brl,
        originalPrice: null,
        category: 'Base',
        images: [shade.image],
        imageCarousel: [{ id: 1, url: shade.image, alt: shade.name }],
        features: brunaTavaresData.key_features.slice(0, 5),
        stock: 25,
        rating: 4.9,
        reviews: 320,
        inStock: true,
        featured: true,
        isNew: true,
        hasDiscount: false,
        colors: [shade.hex_color],
        specifications: {
          volume: brunaTavaresData.volume,
          coverage: 'Alta',
          finish: 'Natural Aveludado',
          duration: '12 horas',
          skinType: 'Todos os tipos',
          undertone: shade.undertone,
          family: shade.family,
          level: shade.level
        },
        tags: ['BT Skin', shade.family, shade.undertone.split('/')[0], 'Profissional'],
        // Custom properties for Bruna Tavares
        toneCode: shade.code,
        toneFamily: shade.family,
        toneLevel: shade.level,
        hexColor: shade.hex_color,
        bestMatch: shade.best_match
      }));

      categories.push({
        key: 'bruna-tavares-bt-skin',
        name: `${brunaTavaresData.brand} ${brunaTavaresData.line}`,
        icon: '🎨',
        products: brunaTavaresProducts,
      });
    }

    return categories;
  };

  return {
    data,
    getCategoryByKey,
    getAllProducts,
    getProductsByCategory,
    getProductById,
    getCategoryStats,
    getAllCategories,
    getCategoriesList,
    getCosmeticCategories,
    getHairTreatmentCategories,
    getEnhancedCosmeticCategories,
    getMakeupCategories,
  };
};

export default useProductData;