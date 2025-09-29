import { connectDB } from '../mongodb/connection';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

// Import all catalog data
import megaConsolidatedCatalog from '../data/products-mega-consolidated.json';
import advancedCatalog from '../data/products-advanced-catalog.json';
import brunaTavaresCatalog from '../data/bruna-tavares-bt-skin-catalog.json';
import bioExtratusCatalog from '../data/catalog_bio_extratus_produtos__advanced.json';
import botoxCatalog from '../data/botox-products-catalog.json';
import hydrationCatalog from '../data/hydration-products-catalog.json';
import productsReorganized from '../data/products-reorganized.json';

// Track used SKUs and slugs to avoid duplicates
const usedSkus = new Set<string>();
const usedSlugs = new Set<string>();

// Helper function to generate SKU
function generateSku(productName: string, brand: string, productId?: string): string {
  const brandCode = brand.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '').padEnd(3, 'X');
  const nameCode = productName
    .substring(0, 8)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 6)
    .padEnd(6, 'X');

  // Use product ID if available for uniqueness, otherwise use timestamp + random
  let uniqueCode = productId
    ? productId.replace(/[^A-Z0-9]/gi, '').substring(0, 3).toUpperCase().padEnd(3, '0')
    : Date.now().toString().slice(-3);

  let sku = `${brandCode}-${nameCode}-${uniqueCode}`;

  // If SKU already exists, append incremental number
  let counter = 1;
  while (usedSkus.has(sku)) {
    const counterStr = counter.toString().padStart(3, '0');
    sku = `${brandCode}-${nameCode}-${counterStr}`;
    counter++;
  }

  usedSkus.add(sku);
  return sku;
}

// Helper function to generate slug
function generateSlug(name: string): string {
  let baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  let slug = baseSlug;
  let counter = 1;

  // If slug already exists, append incremental number
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  usedSlugs.add(slug);
  return slug;
}

// Helper function to categorize products
function categorizeProduct(productName: string, brand: string, originalCategory?: string): { category: string; subcategory: string } {
  const name = productName.toLowerCase();
  const brandLower = brand.toLowerCase();

  // Makeup products
  if (name.includes('base') || name.includes('foundation') || brandLower.includes('mari maria') || brandLower.includes('bruna tavares')) {
    return { category: 'maquiagem', subcategory: 'base' };
  }

  // Hair treatments
  if (name.includes('progressiva') || name.includes('alisante') || name.includes('smoothing')) {
    return { category: 'tratamento_capilar', subcategory: 'progressiva' };
  }

  if (name.includes('botox') || name.includes('btx')) {
    return { category: 'tratamento_capilar', subcategory: 'botox' };
  }

  if (name.includes('hidrat') || name.includes('máscara') || name.includes('mask')) {
    return { category: 'tratamento_capilar', subcategory: 'hidratação' };
  }

  if (name.includes('shampoo')) {
    return { category: 'cuidados_diarios', subcategory: 'shampoo' };
  }

  if (name.includes('condicionador') || name.includes('conditioner')) {
    return { category: 'cuidados_diarios', subcategory: 'condicionador' };
  }

  if (name.includes('tinta') || name.includes('coloração') || name.includes('cor')) {
    return { category: 'tratamento_capilar', subcategory: 'coloração' };
  }

  // Default fallback
  return { category: 'tratamento_capilar', subcategory: 'outros' };
}

// Process Mari Maria products from mega consolidated catalog
function processMariMariaProducts(): any[] {
  const products: any[] = [];

  if (megaConsolidatedCatalog?.categories) {
    const mariMariaCategory = megaConsolidatedCatalog.categories.find((cat: any) =>
      cat.id === 'mari-maria-bases-complete' || cat.name?.toLowerCase().includes('mari maria')
    );

    if (mariMariaCategory?.products) {
      mariMariaCategory.products.forEach((product: any) => {
        const { category, subcategory } = categorizeProduct(product.name, product.brand || 'Mari Maria');

        products.push({
          sku: generateSku(product.name, product.brand || 'Mari Maria', product.id),
          name: product.name,
          brand: product.brand || 'Mari Maria',
          category,
          subcategory,
          description: product.description || `${product.name} da marca ${product.brand || 'Mari Maria'}`,
          sizes: [{
            size: '30ml',
            stock: product.variants?.[0]?.stock || 15,
            barcode: `MM${Date.now().toString().slice(-8)}`
          }],
          images: product.images?.map((img: any) => ({
            url: typeof img === 'string' ? img : img.url,
            alt: product.name,
            isPrimary: true
          })) || [{ url: '/placeholder-product.jpg', alt: product.name, isPrimary: true }],
          stock: {
            available: product.variants?.[0]?.stock || 15,
            reserved: 0,
            minimum: 5
          },
          attributes: {
            color: product.color_info?.tone,
            benefits: product.features || ['Cobertura alta', 'Longa duração'],
            indications: ['Todos os tipos de pele']
          },
          ratings: {
            average: product.rating || 4.5,
            count: product.reviews || 100,
            reviews: []
          },
          tags: product.tags || ['base', 'maquiagem', 'mari maria'],
          seo: {
            slug: generateSlug(product.name),
            metaTitle: `${product.name} - ${product.brand || 'Mari Maria'}`,
            metaDescription: product.description?.substring(0, 160) || `${product.name} da ${product.brand || 'Mari Maria'}`,
            keywords: [product.name.toLowerCase(), (product.brand || 'mari maria').toLowerCase(), 'base', 'maquiagem']
          },
          featured: true,
          isActive: true
        });
      });
    }
  }

  return products;
}

// Process Bruna Tavares products
function processBrunaTavaresProducts(): any[] {
  const products: any[] = [];

  if (brunaTavaresCatalog?.shades) {
    brunaTavaresCatalog.shades.forEach((shade: any) => {
      const { category, subcategory } = categorizeProduct(shade.name, brunaTavaresCatalog.brand);

      products.push({
        sku: generateSku(shade.name, brunaTavaresCatalog.brand, shade.id),
        name: shade.name,
        brand: brunaTavaresCatalog.brand,
        category,
        subcategory,
        description: shade.description || `${shade.name} da linha ${brunaTavaresCatalog.line}`,
        sizes: [{
          size: brunaTavaresCatalog.volume || '30ml',
          stock: 25,
          barcode: `BT${Date.now().toString().slice(-8)}`
        }],
        images: [{
          url: shade.image || '/placeholder-product.jpg',
          alt: shade.name,
          isPrimary: true
        }],
        stock: {
          available: 25,
          reserved: 0,
          minimum: 5
        },
        attributes: {
          color: shade.hex_color,
          benefits: brunaTavaresCatalog.key_features?.slice(0, 5) || ['Cobertura alta', 'Longa duração'],
          indications: ['Todos os tipos de pele']
        },
        ratings: {
          average: 4.9,
          count: 320,
          reviews: []
        },
        tags: ['base', 'bruna tavares', 'bt skin', shade.family?.toLowerCase()],
        seo: {
          slug: generateSlug(shade.name),
          metaTitle: `${shade.name} - ${brunaTavaresCatalog.brand}`,
          metaDescription: shade.description?.substring(0, 160) || `${shade.name} da ${brunaTavaresCatalog.brand}`,
          keywords: [shade.name.toLowerCase(), 'bruna tavares', 'bt skin', 'base']
        },
        featured: true,
        isActive: true
      });
    });
  }

  return products;
}

// Process Advanced Catalog products (Hair treatments and colors)
function processAdvancedCatalogProducts(): any[] {
  const products: any[] = [];

  if (advancedCatalog?.categories) {
    Object.entries(advancedCatalog.categories).forEach(([categoryKey, categoryData]: [string, any]) => {
      if (categoryData.products && categoryData.products.length > 0) {
        categoryData.products.forEach((product: any) => {
          const { category, subcategory } = categorizeProduct(product.name, product.brand);

          products.push({
            sku: generateSku(product.name, product.brand, product.id),
            name: product.name,
            brand: product.brand,
            category,
            subcategory,
            description: product.description || `${product.name} da marca ${product.brand}`,
            sizes: [{
              size: '500ml',
              stock: product.stock || 15,
              barcode: `ADV${Date.now().toString().slice(-8)}`
            }],
            images: product.images?.map((img: any) => ({
              url: typeof img === 'string' ? img : img.url || '/placeholder-product.jpg',
              alt: product.name,
              isPrimary: true
            })) || [{ url: '/placeholder-product.jpg', alt: product.name, isPrimary: true }],
            stock: {
              available: product.stock || 15,
              reserved: 0,
              minimum: 5
            },
            attributes: {
              benefits: product.features || ['Qualidade profissional', 'Longa duração'],
              indications: ['Cabelos diversos']
            },
            ratings: {
              average: product.rating || 4.5,
              count: product.reviews || 50,
              reviews: []
            },
            tags: product.tags || [categoryKey.replace('_', ' '), product.brand?.toLowerCase()],
            seo: {
              slug: generateSlug(product.name),
              metaTitle: `${product.name} - ${product.brand}`,
              metaDescription: product.description?.substring(0, 160) || `${product.name} da ${product.brand}`,
              keywords: [product.name.toLowerCase(), product.brand?.toLowerCase(), categoryKey.replace('_', ' ')]
            },
            featured: false,
            isActive: true
          });
        });
      }
    });
  }

  return products;
}

// Process Bio Extratus products
function processBioExtratusProducts(): any[] {
  const products: any[] = [];

  if (bioExtratusCatalog?.products) {
    bioExtratusCatalog.products.forEach((product: any) => {
      const { category, subcategory } = categorizeProduct(product.name, product.brand);

      products.push({
        sku: generateSku(product.name, product.brand, product.id),
        name: product.name,
        brand: product.brand,
        category,
        subcategory,
        description: product.description || `${product.name} da Bio Extratus`,
        sizes: [{
          size: '500ml',
          stock: product.stock || 15,
          barcode: `BIO${Date.now().toString().slice(-8)}`
        }],
        images: product.images?.map((img: any) => ({
          url: typeof img === 'string' ? img : img.url || '/placeholder-product.jpg',
          alt: product.name,
          isPrimary: true
        })) || [{ url: '/placeholder-product.jpg', alt: product.name, isPrimary: true }],
        stock: {
          available: product.stock || 15,
          reserved: 0,
          minimum: 5
        },
        attributes: {
          benefits: product.features || ['Natural', 'Hidratação', 'Nutrição'],
          indications: ['Todos os tipos de cabelo']
        },
        ratings: {
          average: product.rating || 4.5,
          count: product.reviews || 50,
          reviews: []
        },
        tags: product.tags || ['bio extratus', 'natural', 'capilar'],
        seo: {
          slug: generateSlug(product.name),
          metaTitle: `${product.name} - ${product.brand}`,
          metaDescription: product.description?.substring(0, 160) || `${product.name} da ${product.brand}`,
          keywords: [product.name.toLowerCase(), 'bio extratus', 'natural']
        },
        featured: false,
        isActive: true
      });
    });
  }

  return products;
}

// Process Botox products
function processBotoxProducts(): any[] {
  const products: any[] = [];

  if (botoxCatalog?.botox?.products) {
    botoxCatalog.botox.products.forEach((product: any) => {
      const { category, subcategory } = categorizeProduct(product.name, product.brand);

      products.push({
        sku: generateSku(product.name, product.brand, product.id),
        name: product.name,
        brand: product.brand,
        category,
        subcategory,
        description: product.description || `${product.name} - Botox capilar`,
        sizes: [{
          size: '1kg',
          stock: product.stock || 15,
          barcode: `BTX${Date.now().toString().slice(-8)}`
        }],
        images: product.images?.map((img: any) => ({
          url: typeof img === 'string' ? img : img.url || '/placeholder-product.jpg',
          alt: product.name,
          isPrimary: true
        })) || [{ url: '/placeholder-product.jpg', alt: product.name, isPrimary: true }],
        stock: {
          available: product.stock || 15,
          reserved: 0,
          minimum: 5
        },
        attributes: {
          benefits: product.features || ['Sem formol', 'Hidratação', 'Alinhamento'],
          indications: ['Cabelos danificados', 'Cabelos com frizz']
        },
        ratings: {
          average: product.rating || 4.5,
          count: product.reviews || 100,
          reviews: []
        },
        tags: product.features?.map((f: string) => f.toLowerCase()) || ['botox', 'capilar', 'tratamento'],
        seo: {
          slug: generateSlug(product.name),
          metaTitle: `${product.name} - ${product.brand}`,
          metaDescription: product.description?.substring(0, 160) || `${product.name} - Botox capilar`,
          keywords: [product.name.toLowerCase(), 'botox capilar', product.brand?.toLowerCase()]
        },
        featured: false,
        isActive: true
      });
    });
  }

  return products;
}

// Process Hydration products
function processHydrationProducts(): any[] {
  const products: any[] = [];

  if (hydrationCatalog?.hidratacao?.products) {
    hydrationCatalog.hidratacao.products.forEach((product: any) => {
      const { category, subcategory } = categorizeProduct(product.name, product.brand);

      products.push({
        sku: generateSku(product.name, product.brand, product.id),
        name: product.name,
        brand: product.brand,
        category,
        subcategory,
        description: product.description || `${product.name} - Produto de hidratação`,
        sizes: [{
          size: '500ml',
          stock: product.stock || 15,
          barcode: `HYD${Date.now().toString().slice(-8)}`
        }],
        images: product.images?.map((img: any) => ({
          url: typeof img === 'string' ? img : img.url || '/placeholder-product.jpg',
          alt: product.name,
          isPrimary: true
        })) || [{ url: '/placeholder-product.jpg', alt: product.name, isPrimary: true }],
        stock: {
          available: product.stock || 15,
          reserved: 0,
          minimum: 5
        },
        attributes: {
          benefits: product.features || ['Hidratação profunda', 'Nutrição', 'Brilho'],
          indications: ['Cabelos ressecados', 'Cabelos danificados']
        },
        ratings: {
          average: product.rating || 4.5,
          count: product.reviews || 100,
          reviews: []
        },
        tags: product.features?.map((f: string) => f.toLowerCase()) || ['hidratação', 'nutrição', 'capilar'],
        seo: {
          slug: generateSlug(product.name),
          metaTitle: `${product.name} - ${product.brand}`,
          metaDescription: product.description?.substring(0, 160) || `${product.name} - Hidratação capilar`,
          keywords: [product.name.toLowerCase(), 'hidratação', product.brand?.toLowerCase()]
        },
        featured: false,
        isActive: true
      });
    });
  }

  return products;
}

// Enhanced categories with more comprehensive coverage
export const comprehensiveCategories = [
  {
    name: 'Maquiagem',
    slug: 'maquiagem',
    description: 'Bases, corretivos e maquiagens para todos os tons de pele brasileira',
    order: 1,
    featured: true,
    image: '/images/categories/maquiagem.jpg',
    icon: '💄',
    seo: {
      metaTitle: 'Maquiagem Brasileira - Mari Maria, Bruna Tavares, QDB',
      metaDescription: 'Maquiagens desenvolvidas para a diversidade da pele brasileira. Bases, corretivos e produtos das melhores marcas nacionais.',
      keywords: ['maquiagem brasileira', 'base mari maria', 'bruna tavares', 'bt skin', 'pele brasileira']
    }
  },
  {
    name: 'Tratamentos Capilares',
    slug: 'tratamento_capilar',
    description: 'Progressivas, botox, hidratação e coloração profissional',
    order: 2,
    featured: true,
    image: '/images/categories/tratamentos-capilares.jpg',
    icon: '💇‍♀️',
    seo: {
      metaTitle: 'Tratamentos Capilares Profissionais - Progressivas e Botox',
      metaDescription: 'Progressivas, botox capilar, hidratação e coloração das melhores marcas. Tratamentos profissionais para salões.',
      keywords: ['progressiva profissional', 'botox capilar', 'hidratação capilar', 'coloração', 'tratamento profissional']
    }
  },
  {
    name: 'Cuidados Diários',
    slug: 'cuidados_diarios',
    description: 'Shampoos, condicionadores e produtos para manutenção diária',
    order: 3,
    featured: true,
    image: '/images/categories/cuidados-diarios.jpg',
    icon: '🧴',
    seo: {
      metaTitle: 'Cuidados Capilares Diários - Shampoos e Condicionadores',
      metaDescription: 'Produtos para cuidados diários dos cabelos. Shampoos, condicionadores e máscaras das melhores marcas.',
      keywords: ['shampoo profissional', 'condicionador', 'máscara capilar', 'cuidados diários', 'manutenção capilar']
    }
  },
  {
    name: 'Ferramentas Profissionais',
    slug: 'ferramentas',
    description: 'Equipamentos e ferramentas para salões profissionais',
    order: 4,
    featured: false,
    image: '/images/categories/ferramentas.jpg',
    icon: '🔧',
    seo: {
      metaTitle: 'Ferramentas Profissionais - Equipamentos para Salões',
      metaDescription: 'Secadores, chapinhas e equipamentos profissionais para salões e hair studios.',
      keywords: ['ferramentas profissionais', 'equipamentos salão', 'secador profissional', 'chapinha profissional']
    }
  },
  {
    name: 'Produtos Corporais',
    slug: 'corporais',
    description: 'Hidratantes e produtos para cuidados corporais',
    order: 5,
    featured: false,
    image: '/images/categories/corporais.jpg',
    icon: '🧴',
    seo: {
      metaTitle: 'Produtos Corporais - Hidratantes e Cuidados',
      metaDescription: 'Hidratantes corporais e produtos para cuidados com a pele do corpo.',
      keywords: ['hidratante corporal', 'cuidados corporais', 'produtos corporais']
    }
  }
];

export async function seedComprehensiveDatabase() {
  try {
    await connectDB();
    console.log('🌱 Iniciando seeding completo do banco de dados...');

    // Clear used SKUs and slugs sets for fresh start
    usedSkus.clear();
    usedSlugs.clear();

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️ Dados existentes removidos');

    // Insert categories
    const categories = await Category.insertMany(comprehensiveCategories);
    console.log(`✅ ${categories.length} categorias inseridas`);

    // Process all product catalogs
    console.log('📦 Processando catálogos de produtos...');

    const allProducts = [
      ...processMariMariaProducts(),
      ...processBrunaTavaresProducts(),
      ...processAdvancedCatalogProducts(),
      ...processBioExtratusProducts(),
      ...processBotoxProducts(),
      ...processHydrationProducts()
    ];

    console.log(`📊 Total de produtos processados: ${allProducts.length}`);

    // Insert products in batches to avoid memory issues
    const batchSize = 50;
    let insertedCount = 0;

    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);
      const insertedBatch = await Product.insertMany(batch);
      insertedCount += insertedBatch.length;
      console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: ${insertedBatch.length} produtos inseridos`);
    }

    console.log('🎉 Seeding completo concluído com sucesso!');
    console.log(`📊 Total final: ${categories.length} categorias, ${insertedCount} produtos`);

    // Display summary by category
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('📈 Produtos por categoria:');
    productsByCategory.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} produtos`);
    });

    return {
      categories: categories.length,
      products: insertedCount,
      productsByCategory
    };

  } catch (error) {
    console.error('❌ Erro durante o seeding completo:', error);
    throw error;
  }
}