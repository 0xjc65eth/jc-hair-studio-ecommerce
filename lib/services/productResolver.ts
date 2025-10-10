// Product Resolution Service - John Carmack style: one source of truth
// This service handles ALL product resolution across the entire site
// WITH BIDIRECTIONAL ID MAPPING SYSTEM

import { getStaticProductById, getAllStaticProducts } from '../data/staticProducts';
import { categories } from '../data/categories';
import { getLegacyCompatibleProducts } from '../data/megaHairProducts';
import { getAllMakeupProducts, getMakeupProductById } from '../data/makeupProducts';
import { allTintasCapilares, getTintaById } from '../data/tintasCapilares';
import { allEsmaltesImpala, getEsmalteById } from '../data/esmaltesImpala';
import { allPerfumesWepink, getPerfumeById } from '../data/perfumesWepink';
import { allPerfumesOBoticario, getPerfumeOBoticarioById } from '../data/perfumesOBoticario';
import { allPerfumesData } from '../data/perfumesProducts';
import { progressivasProducts } from '../data/progressivasProducts';

interface UnifiedProduct {
  id: string;
  name: string;
  nome: string;
  brand: string;
  marca: string;
  description: string;
  descricao: string;
  images: string[];
  imagens: string[];
  badge?: string;
  preco_eur?: number;
  category?: string;
  pricing?: any;
  slug?: string;
}

// BIDIRECTIONAL ID MAPPING - Complete mapping between different ID systems
const ID_MAPPING: Record<string, string[]> = {
  // Static Products -> Categories mapping
  'cocochoco-original-premium': ['prog-001'],
  'cocochoco-gold-premium': ['prog-002'],
  'tzaha-diamante-total-liss': ['prog-003'],

  // Categories -> Static Products mapping (reverse)
  'prog-001': ['cocochoco-original-premium'],
  'prog-002': ['cocochoco-gold-premium'],
  'prog-003': ['tzaha-diamante-total-liss'],

  // Mega Hair numeric IDs -> prefixed IDs
  '1': ['mh-1', 'mega-hair-1'],
  '2': ['mh-2', 'mega-hair-2'],
  '3': ['mh-3', 'mega-hair-3'],
  '4': ['mh-4', 'mega-hair-4'],
  '5': ['mh-5', 'mega-hair-5'],
  '6': ['mh-6', 'mega-hair-6'],
  '7': ['mh-7', 'mega-hair-7'],
  '8': ['mh-8', 'mega-hair-8'],
  '9': ['mh-9', 'mega-hair-9'],
  '10': ['mh-10', 'mega-hair-10'],
  '11': ['mh-11', 'mega-hair-11'],
  '12': ['mh-12', 'mega-hair-12'],
  '13': ['mh-13', 'mega-hair-13'],
  '14': ['mh-14', 'mega-hair-14'],
  '15': ['mh-15', 'mega-hair-15'],
  '16': ['mh-16', 'mega-hair-16'],
  '17': ['mh-17', 'mega-hair-17'],
  '18': ['mh-18', 'mega-hair-18'],
  '19': ['mh-19', 'mega-hair-19'],
  '20': ['mh-20', 'mega-hair-20'],

  // Reverse mapping for mega hair
  'mh-1': ['1'], 'mega-hair-1': ['1'],
  'mh-2': ['2'], 'mega-hair-2': ['2'],
  'mh-3': ['3'], 'mega-hair-3': ['3'],
  'mh-4': ['4'], 'mega-hair-4': ['4'],
  'mh-5': ['5'], 'mega-hair-5': ['5'],
  'mh-6': ['6'], 'mega-hair-6': ['6'],
  'mh-7': ['7'], 'mega-hair-7': ['7'],
  'mh-8': ['8'], 'mega-hair-8': ['8'],
  'mh-9': ['9'], 'mega-hair-9': ['9'],
  'mh-10': ['10'], 'mega-hair-10': ['10'],
  'mh-11': ['11'], 'mega-hair-11': ['11'],
  'mh-12': ['12'], 'mega-hair-12': ['12'],
  'mh-13': ['13'], 'mega-hair-13': ['13'],
  'mh-14': ['14'], 'mega-hair-14': ['14'],
  'mh-15': ['15'], 'mega-hair-15': ['15'],
  'mh-16': ['16'], 'mega-hair-16': ['16'],
  'mh-17': ['17'], 'mega-hair-17': ['17'],
  'mh-18': ['18'], 'mega-hair-18': ['18'],
  'mh-19': ['19'], 'mega-hair-19': ['19'],
  'mh-20': ['20'], 'mega-hair-20': ['20'],

  // Common alternative IDs that might be used
  'mega-hair-liso-1': ['1', 'mh-1'],
  'mega-hair-liso-2': ['2', 'mh-2'],
  'mega-hair-ondulado-3': ['3', 'mh-3'],
  'mega-hair-cacheado-4': ['4', 'mh-4'],
  'mega-hair-preto-5': ['5', 'mh-5']
};

export class ProductResolver {
  private static instance: ProductResolver;
  private productCache: Map<string, UnifiedProduct> = new Map();
  private idMappingCache: Map<string, string[]> = new Map();

  static getInstance(): ProductResolver {
    if (!ProductResolver.instance) {
      ProductResolver.instance = new ProductResolver();
    }
    return ProductResolver.instance;
  }

  // Get all possible IDs for a given ID (bidirectional mapping)
  private getAllMappedIds(productId: string): string[] {
    // Check cache first
    if (this.idMappingCache.has(productId)) {
      return this.idMappingCache.get(productId)!;
    }

    const allIds = new Set<string>([productId]); // Always include original ID

    // Add direct mappings
    if (ID_MAPPING[productId]) {
      ID_MAPPING[productId].forEach(id => allIds.add(id));
    }

    // Add reverse mappings (find IDs that map to this one)
    Object.keys(ID_MAPPING).forEach(key => {
      if (ID_MAPPING[key].includes(productId)) {
        allIds.add(key);
        // Also add any other IDs mapped to this key
        ID_MAPPING[key].forEach(id => allIds.add(id));
      }
    });

    const result = Array.from(allIds);
    this.idMappingCache.set(productId, result);
    return result;
  }

  // Normalize product data from any source to unified format
  normalizeProduct(product: any, source: string = 'unknown'): UnifiedProduct {
    return {
      id: product.id || product.productId || 'unknown',
      name: product.name || product.nome || 'Produto sem nome',
      nome: product.nome || product.name || 'Produto sem nome',
      brand: product.brand || product.marca || 'Marca não informada',
      marca: product.marca || product.brand || 'Marca não informada',
      description: product.description || product.descricao || 'Descrição não disponível',
      descricao: product.descricao || product.description || 'Descrição não disponível',
      images: product.images || product.imagens || (product.image ? [product.image] : (product.imagem ? [product.imagem] : [])),
      imagens: product.imagens || product.images || (product.image ? [product.image] : (product.imagem ? [product.imagem] : [])),
      badge: product.badge,
      preco_eur: product.preco_eur || product.pricing?.discountPrice || product.price || 0,
      category: product.category || 'Produtos Capilares',
      pricing: product.pricing,
      slug: product.slug || this.createSlug(product.name || product.nome)
    };
  }

  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // NEW: Detect product type based on ID and content
  private detectProductType(productId: string, product: UnifiedProduct): string {
    // Numeric IDs should be mega-hair
    if (/^\d+$/.test(productId)) return 'mega-hair';

    // ID-based detection
    if (productId.includes('mari-maria') || productId.includes('bruna-tavares')) return 'maquiagem';
    if (productId.includes('impala-esmalte')) return 'esmalte';
    if (productId.includes('biocolor-') || productId.includes('wella-') || productId.includes('alfaparf-')) return 'tinta';
    if (productId.includes('wepink-')) return 'perfume';
    if (productId.includes('boticario-')) return 'perfume-boticario';
    if (productId.includes('cocochoco') || productId.includes('progressiva') ||
        productId.includes('relaxamento') || productId.includes('botox')) return 'progressiva';

    // Content-based detection
    const name = (product.name || product.nome || '').toLowerCase();
    const description = (product.description || product.descricao || '').toLowerCase();
    const brand = (product.brand || product.marca || '').toLowerCase();

    if (name.includes('mega hair') || name.includes('mega-hair')) return 'mega-hair';
    if (name.includes('base ') || brand.includes('mari maria') || brand.includes('bruna tavares')) return 'maquiagem';
    if (name.includes('esmalte') || brand.includes('impala')) return 'esmalte';
    if (name.includes('coloração') || name.includes('tinta') || brand.includes('biocolor') || brand.includes('wella') || brand.includes('alfaparf')) return 'tinta';
    if (name.includes('perfume') || name.includes('colônia') || brand.includes('wepink')) return 'perfume';
    if (name.includes('progressiva') || name.includes('relaxamento') || name.includes('botox') || name.includes('cocochoco')) return 'progressiva';

    return 'unknown';
  }

  // NEW: Detect image type based on path
  private detectImageType(imagePath: string): string {
    if (!imagePath || typeof imagePath !== 'string') return 'unknown';

    const path = imagePath.toLowerCase();

    if (path.includes('mega-hair') || path.includes('g-hair') || path.includes('/mega-hair/')) return 'mega-hair';
    if (path.includes('mari-maria') || path.includes('bruna-tavares') || path.includes('/maquiagem/')) return 'maquiagem';
    if (path.includes('esmalte') || path.includes('impala')) return 'esmalte';
    if (path.includes('tinta_') || path.includes('produtos_diversos')) return 'tinta';
    if (path.includes('perfume') || path.includes('wepink')) return 'perfume';
    if (path.includes('progressiva') || path.includes('relaxamento') || path.includes('botox') || path.includes('tratamento')) return 'progressiva';

    return 'unknown';
  }

  // Enhanced resolution method with strict ID namespace validation
  resolveProduct(productId: string, dynamicProducts?: any[]): UnifiedProduct | null {
    // Enhanced debug logging to track resolution path (only in development)
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      console.log(`🔍 ProductResolver: Resolving product ID "${productId}"`);
    }

    // Check cache first - but add debug info
    if (this.productCache.has(productId)) {
      const cachedProduct = this.productCache.get(productId)!;
      if (isDev) {
        console.log(`📋 ProductResolver: Found in cache - ${cachedProduct.name}`);
      }
      return cachedProduct;
    }

    let product: any = null;
    let source = 'unknown';

    // Get all possible IDs for this product (bidirectional mapping)
    const allPossibleIds = this.getAllMappedIds(productId);
    if (isDev) {
      console.log(`🔗 ProductResolver: Mapped IDs for "${productId}": [${allPossibleIds.join(', ')}]`);
    }

    // ENHANCED METHOD 1: Strict namespace resolution for numeric IDs
    // Only numeric IDs should resolve to mega hair products
    if (/^\d+$/.test(productId)) {
      if (isDev) {
        console.log(`🎯 ProductResolver: Numeric ID detected, searching mega hair products...`);
      }
      const megaHairProducts = getLegacyCompatibleProducts();
      for (const mappedId of allPossibleIds) {
        // Only allow numeric ID resolution for mega hair
        if (/^\d+$/.test(mappedId)) {
          product = megaHairProducts.find(p =>
            p.id === mappedId ||
            p.id === parseInt(mappedId, 10) ||
            String(p.id) === mappedId
          );
          if (product) {
            source = 'megahair-numeric';
            if (isDev) {
              console.log(`✅ ProductResolver: Found mega hair product - ${product.name || product.nome}`);
            }
            break;
          }
        }
      }
    }

    // ENHANCED METHOD 2: Non-numeric IDs search in static products with validation
    if (!product && !/^\d+$/.test(productId)) {
      if (isDev) {
        console.log(`🎯 ProductResolver: Non-numeric ID detected, searching static products...`);
      }
      for (const mappedId of allPossibleIds) {
        // Skip numeric mapped IDs to avoid conflicts
        if (!/^\d+$/.test(mappedId)) {
          product = getStaticProductById(mappedId);
          if (product) {
            source = 'static-non-numeric';
            if (isDev) {
              console.log(`✅ ProductResolver: Found static product - ${product.nome}`);
            }
            break;
          }
        }
      }
    }

    // ENHANCED METHOD 3: Makeup products with prefix validation
    if (!product && (productId.includes('mari-maria') || productId.includes('bruna-tavares') || productId.includes('pam-by-pamella') || productId.includes('bt-'))) {
      console.log(`🎯 ProductResolver: Makeup product pattern detected, searching makeup products...`);
      for (const mappedId of allPossibleIds) {
        product = getMakeupProductById(mappedId);
        if (product) {
          source = 'makeup-validated';
          console.log(`✅ ProductResolver: Found makeup product - ${product.name || product.nome}`);
          break;
        }
      }
    }

    // ENHANCED METHOD 4: Categories with namespace validation
    if (!product && (productId.includes('prog-') || productId.includes('cat-'))) {
      console.log(`🎯 ProductResolver: Category product pattern detected, searching categories...`);
      const allCategoryProducts = categories.flatMap(category => category.products);
      for (const mappedId of allPossibleIds) {
        if (mappedId.includes('prog-') || mappedId.includes('cat-')) {
          product = allCategoryProducts.find(p => p.id === mappedId);
          if (product) {
            source = 'categories-validated';
            console.log(`✅ ProductResolver: Found category product - ${product.name}`);
            break;
          }
        }
      }
    }

    // METHOD 5: Tintas capilares with validation (apenas marcas disponíveis)
    const tintaBrands = ['biocolor-', 'wella-', 'alfaparf-', 'loreal-', 'garnier-', 'amend-'];
    if (!product && tintaBrands.some(brand => productId.includes(brand))) {
      if (isDev) {
        console.log(`🎯 ProductResolver: Tinta pattern detected, searching tintas capilares...`);
      }
      product = allTintasCapilares.find(p => p.id === productId);
      if (product) {
        source = 'tintas-validated';
        if (isDev) {
          console.log(`✅ ProductResolver: Found tinta product - ${product.nome}`);
        }
      }
    }

    // METHOD 6: Esmaltes IMPALA with validation
    if (!product && productId.includes('impala-esmalte')) {
      if (isDev) {
        console.log(`🎯 ProductResolver: IMPALA esmalte pattern detected, searching esmaltes...`);
      }
      product = allEsmaltesImpala.find(p => p.id === productId);
      if (product) {
        source = 'esmaltes-validated';
        if (isDev) {
          console.log(`✅ ProductResolver: Found esmalte product - ${product.nome}`);
        }
      }
    }

    // METHOD 7: WEPINK perfumes with validation
    if (!product && productId.includes('wepink-')) {
      if (isDev) {
        console.log(`🎯 ProductResolver: WEPINK pattern detected, searching perfumes...`);
      }
      product = allPerfumesWepink.find(p => p.id === productId);
      if (product) {
        source = 'perfumes-wepink-validated';
        if (isDev) {
          console.log(`✅ ProductResolver: Found WEPINK perfume product - ${product.nome}`);
        }
      }
    }

    // METHOD 8: O Boticário perfumes with validation
    if (!product && productId.includes('boticario-')) {
      if (isDev) {
        console.log(`🎯 ProductResolver: O Boticário pattern detected, searching perfumes...`);
      }
      product = allPerfumesOBoticario.find(p => p.id === productId);
      if (product) {
        source = 'perfumes-boticario-validated';
        if (isDev) {
          console.log(`✅ ProductResolver: Found O Boticário perfume product - ${product.nome}`);
        }
      }
    }

    // METHOD 9: Progressivas products with validation
    if (!product && (productId.includes('cadiveu') || productId.includes('brasil-cacau') ||
                     productId.includes('progressiva') || productId.includes('btx') ||
                     productId.includes('forever-liss') || productId.includes('cocochoco'))) {
      if (isDev) {
        console.log(`🎯 ProductResolver: Progressiva pattern detected, searching progressivas...`);
      }
      product = progressivasProducts.find(p => p.id === productId);
      if (product) {
        source = 'progressivas-validated';
        if (isDev) {
          console.log(`✅ ProductResolver: Found progressiva product - ${product.nome}`);
        }
      }
    }

    // METHOD 10: Legacy WEPINK perfumes (fallback)
    if (!product && productId.includes('wepink-')) {
      if (isDev) {
        console.log(`🎯 ProductResolver: WEPINK legacy pattern detected, searching legacy perfumes...`);
      }
      product = allPerfumesData.find(p => p.id === productId);
      if (product) {
        source = 'perfumes-legacy-validated';
        if (isDev) {
          console.log(`✅ ProductResolver: Found legacy perfume product - ${product.name}`);
        }
      }
    }

    // Method 7: Try mega hair products (legacy compatible - fallback)
    if (!product) {
      const megaHairProducts = getLegacyCompatibleProducts();
      for (const mappedId of allPossibleIds) {
        // Check both string and numeric IDs for mega hair
        product = megaHairProducts.find(p =>
          p.id === mappedId ||
          p.id === parseInt(mappedId, 10) ||
          String(p.id) === mappedId
        );
        if (product) {
          source = 'megahair-mapped';
          break;
        }
      }
    }

    // Method 6: Try exact match in dynamic products with all mapped IDs
    if (!product && dynamicProducts) {
      for (const mappedId of allPossibleIds) {
        product = dynamicProducts.find(p => p.id === mappedId);
        if (product) {
          source = 'dynamic-mapped';
          break;
        }
      }
    }

    // Method 7: Fuzzy search in static products (fallback)
    if (!product) {
      const allStaticProducts = getAllStaticProducts();
      product = allStaticProducts.find(p =>
        p.id.toLowerCase() === productId.toLowerCase() ||
        this.createSlug(p.nome) === productId.toLowerCase() ||
        p.nome.toLowerCase().includes(productId.toLowerCase())
      );
      if (product) {
        source = 'static-fuzzy';
      }
    }

    // Method 8: Fuzzy search in categories (fallback)
    if (!product) {
      const allCategoryProducts = categories.flatMap(category => category.products);
      product = allCategoryProducts.find(p =>
        p.id.toLowerCase() === productId.toLowerCase() ||
        this.createSlug(p.name) === productId.toLowerCase() ||
        p.name.toLowerCase().includes(productId.toLowerCase())
      );
      if (product) {
        source = 'categories-fuzzy';
      }
    }

    // Method 9: Fuzzy search in dynamic products (fallback)
    if (!product && dynamicProducts) {
      product = dynamicProducts.find(p =>
        p.id?.toLowerCase() === productId.toLowerCase() ||
        this.createSlug(p.name || p.nome || '') === productId.toLowerCase() ||
        p.name?.toLowerCase().includes(productId.toLowerCase()) ||
        p.nome?.toLowerCase().includes(productId.toLowerCase())
      );
      if (product) {
        source = 'dynamic-fuzzy';
      }
    }

    // Method 10: Return null if product not found
    if (!product) {
      return null;
    }

    // ENHANCED: Normalize and validate before caching
    const normalizedProduct = this.normalizeProduct(product, source);

    // CRITICAL: Validate image-product type consistency before caching
    const productType = this.detectProductType(productId, normalizedProduct);
    const imageType = this.detectImageType(normalizedProduct.images[0]);

    if (productType !== imageType && imageType !== 'unknown') {
      console.warn(`⚠️ ProductResolver: Image-Product type mismatch detected!`);
      console.warn(`   Product ID: ${productId}`);
      console.warn(`   Expected Type: ${productType}`);
      console.warn(`   Image Type: ${imageType}`);
      console.warn(`   Product: ${normalizedProduct.name}`);
      console.warn(`   First Image: ${normalizedProduct.images[0]}`);
      console.warn(`   Source: ${source}`);
    }

    // Enhanced cache logging
    console.log(`💾 ProductResolver: Caching product "${productId}" (${source})`);
    console.log(`   Product: ${normalizedProduct.name}`);
    console.log(`   Images: ${normalizedProduct.images.length} found`);
    console.log(`   Caching under IDs: [${allPossibleIds.join(', ')}]`);

    // Cache the product under all possible IDs (with validation)
    allPossibleIds.forEach(id => {
      this.productCache.set(id, normalizedProduct);
    });

    return normalizedProduct;
  }

  // Get all static products
  getAllStaticProducts(): UnifiedProduct[] {
    const staticProducts = getAllStaticProducts();
    return staticProducts.map(product => this.normalizeProduct(product, 'static'));
  }

  // Get all available products from all sources
  getAllAvailableProducts(): UnifiedProduct[] {
    const allProducts: UnifiedProduct[] = [];

    // Static products
    allProducts.push(...this.getAllStaticProducts());

    // Makeup products
    const makeupProducts = getAllMakeupProducts();
    makeupProducts.forEach(product => {
      // Avoid duplicates (check if already exists)
      const exists = allProducts.some(p => p.id === product.id);
      if (!exists) {
        allProducts.push(this.normalizeProduct(product, 'makeup'));
      }
    });

    // Category products
    const categoryProducts = categories.flatMap(category => category.products);
    categoryProducts.forEach(product => {
      // Avoid duplicates (check if already exists)
      const exists = allProducts.some(p => p.id === product.id);
      if (!exists) {
        allProducts.push(this.normalizeProduct(product, 'categories'));
      }
    });

    // Mega hair products
    const megaHairProducts = getLegacyCompatibleProducts();
    megaHairProducts.forEach(product => {
      // Avoid duplicates and normalize mega hair product structure
      const exists = allProducts.some(p =>
        p.id === String(product.id) ||
        p.id === `mh-${product.id}` ||
        p.id === `mega-hair-${product.id}`
      );
      if (!exists) {
        allProducts.push(this.normalizeProduct(product, 'megahair'));
      }
    });

    // Tintas capilares products
    allTintasCapilares.forEach(tinta => {
      const exists = allProducts.some(p => p.id === tinta.id);
      if (!exists) {
        allProducts.push(this.normalizeProduct(tinta, 'tintas'));
      }
    });

    // Esmaltes IMPALA products
    allEsmaltesImpala.forEach(esmalte => {
      const exists = allProducts.some(p => p.id === esmalte.id);
      if (!exists) {
        allProducts.push(this.normalizeProduct(esmalte, 'esmaltes'));
      }
    });

    // WEPINK perfumes products (new)
    allPerfumesWepink.forEach(perfume => {
      const exists = allProducts.some(p => p.id === perfume.id);
      if (!exists) {
        allProducts.push(this.normalizeProduct(perfume, 'perfumes-wepink'));
      }
    });

    // O Boticário perfumes products
    allPerfumesOBoticario.forEach(perfume => {
      const exists = allProducts.some(p => p.id === perfume.id);
      if (!exists) {
        allProducts.push(this.normalizeProduct(perfume, 'perfumes-boticario'));
      }
    });

    // WEPINK perfumes products (legacy - for backward compatibility)
    allPerfumesData.forEach(perfume => {
      const exists = allProducts.some(p => p.id === perfume.id);
      if (!exists) {
        allProducts.push(this.normalizeProduct(perfume, 'perfumes-legacy'));
      }
    });

    // Progressivas products
    progressivasProducts.forEach(progressiva => {
      const exists = allProducts.some(p => p.id === progressiva.id);
      if (!exists) {
        allProducts.push(this.normalizeProduct(progressiva, 'progressivas'));
      }
    });

    return allProducts;
  }

  // Enhanced cache clearing with logging
  clearCache(): void {
    const cacheSize = this.productCache.size;
    const mappingSize = this.idMappingCache.size;

    this.productCache.clear();
    this.idMappingCache.clear();

    if (process.env.NODE_ENV === 'development') {
      console.log(`🧹 ProductResolver: Cache cleared - ${cacheSize} products, ${mappingSize} mappings removed`);
    }
  }

  // NEW: Clear cache for specific product ID and related mappings
  clearProductCache(productId: string): void {
    const allMappedIds = this.getAllMappedIds(productId);
    let clearedCount = 0;

    allMappedIds.forEach(id => {
      if (this.productCache.has(id)) {
        this.productCache.delete(id);
        clearedCount++;
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`🧹 ProductResolver: Cleared cache for "${productId}" and ${clearedCount} related IDs`);
    }
  }

  // NEW: Validate and fix product-image consistency
  validateProductImageConsistency(productId: string): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const product = this.resolveProduct(productId);
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (!product) {
      issues.push('Product not found');
      return { isValid: false, issues, recommendations };
    }

    const productType = this.detectProductType(productId, product);
    const firstImage = product.images[0];
    const imageType = this.detectImageType(firstImage);

    if (productType !== imageType && imageType !== 'unknown') {
      issues.push(`Image type "${imageType}" doesn't match product type "${productType}"`);
      recommendations.push(`Clear cache for product ID "${productId}"`);
      recommendations.push('Verify product data source');
      recommendations.push('Check ID mapping consistency');
    }

    if (product.images.length === 0) {
      issues.push('No images found for product');
      recommendations.push('Verify product image paths');
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  }

  // Get mapping information for a product ID (useful for debugging)
  getMappingInfo(productId: string): {
    originalId: string;
    mappedIds: string[];
    found: boolean;
    sources: string[];
  } {
    const mappedIds = this.getAllMappedIds(productId);
    const sources: string[] = [];

    // Check which sources contain this product
    mappedIds.forEach(id => {
      if (getStaticProductById(id)) sources.push('static');

      if (getMakeupProductById(id)) sources.push('makeup');

      const categoryProducts = categories.flatMap(category => category.products);
      if (categoryProducts.find(p => p.id === id)) sources.push('categories');

      const megaHairProducts = getLegacyCompatibleProducts();
      if (megaHairProducts.find(p => p.id === id || String(p.id) === id)) sources.push('megahair');
    });

    // Convert Set to Array for older TypeScript compatibility
    const uniqueMappedIds = Array.from(new Set(mappedIds));
    const uniqueSources = Array.from(new Set(sources));

    return {
      originalId: productId,
      mappedIds: uniqueMappedIds,
      found: sources.length > 0,
      sources: uniqueSources
    };
  }
}

// Singleton instance
export const productResolver = ProductResolver.getInstance();

// Simple functions for direct use - no hooks dependency
export function resolveProductById(id: string): UnifiedProduct | null {
  return productResolver.resolveProduct(id);
}

export function getAllAvailableProducts(): UnifiedProduct[] {
  return productResolver.getAllAvailableProducts();
}

// Enhanced utility functions with debugging capabilities
export function getProductMappingInfo(id: string) {
  return productResolver.getMappingInfo(id);
}

export function clearProductCache(): void {
  productResolver.clearCache();
}

// NEW: Clear cache for specific product
export function clearProductCacheById(productId: string): void {
  productResolver.clearProductCache(productId);
}

// NEW: Validate product-image consistency
export function validateProductImages(productId: string) {
  return productResolver.validateProductImageConsistency(productId);
}

// NEW: Enhanced debug function for problematic products
export function debugProductIssues(productIds: string[]): Array<{
  id: string;
  found: boolean;
  mappingInfo: any;
  validation: any;
  product?: UnifiedProduct | null;
}> {
  return productIds.map(id => {
    const product = productResolver.resolveProduct(id);
    const mappingInfo = productResolver.getMappingInfo(id);
    const validation = productResolver.validateProductImageConsistency(id);

    console.log(`🔍 Debug Report for "${id}":`);
    console.log(`   Found: ${!!product}`);
    console.log(`   Sources: ${mappingInfo.sources.join(', ') || 'none'}`);
    console.log(`   Valid: ${validation.isValid}`);
    if (!validation.isValid) {
      console.log(`   Issues: ${validation.issues.join('; ')}`);
      console.log(`   Recommendations: ${validation.recommendations.join('; ')}`);
    }

    return {
      id,
      found: !!product,
      mappingInfo,
      validation,
      product: product || undefined
    };
  });
}

// Test function to validate specific product resolutions
export function testProductResolution(productIds: string[]): Array<{
  id: string;
  found: boolean;
  mappingInfo: any;
  product?: UnifiedProduct | null;
}> {
  return productIds.map(id => {
    const product = productResolver.resolveProduct(id);
    const mappingInfo = productResolver.getMappingInfo(id);

    return {
      id,
      found: !!product,
      mappingInfo,
      product: product || undefined
    };
  });
}