/**
 * MongoDB Seed Script
 * JC Hair Studio's 62's 62 E-commerce
 * 
 * Seeds the MongoDB database with real product and category data
 */

import { connectDB } from '../lib/mongodb/connection';
import { MongoProductService } from '../lib/services/mongoProductService';
import { MongoCategoryService } from '../lib/services/mongoCategoryService';

const categories = [
  {
    name: 'Mega Hair Liso',
    slug: 'mega-hair-liso',
    description: 'Extensões de cabelo liso 100% natural, diversos comprimentos e cores',
    seo: {
      title: 'Mega Hair Liso Premium - JC Hair Studio's 62',
      description: 'Extensões de cabelo liso natural de alta qualidade. Diversos comprimentos e cores.',
      keywords: ['mega hair liso', 'extensões lisas', 'cabelo natural']
    },
    isFeatured: true,
    displayOrder: 1
  },
  {
    name: 'Mega Hair Ondulado',
    slug: 'mega-hair-ondulado',
    description: 'Extensões de cabelo ondulado natural, padrões 2A, 2B e 2C',
    seo: {
      title: 'Mega Hair Ondulado - JC Hair Studio's 62',
      description: 'Extensões de cabelo ondulado natural, padrões variados para looks naturais.',
      keywords: ['mega hair ondulado', 'cabelo ondulado', 'extensões naturais']
    },
    isFeatured: true,
    displayOrder: 2
  },
  {
    name: 'Mega Hair Cacheado',
    slug: 'mega-hair-cacheado',
    description: 'Extensões de cabelo cacheado natural, padrões 3A, 3B e 4A',
    seo: {
      title: 'Mega Hair Cacheado - JC Hair Studio's 62',
      description: 'Extensões de cabelo cacheado natural para cachos perfeitos e autênticos.',
      keywords: ['mega hair cacheado', 'cabelo cacheado', 'cachos naturais']
    },
    isFeatured: true,
    displayOrder: 3
  },
  {
    name: 'Coleções Especiais',
    slug: 'colecoes-especiais',
    description: 'Coleções exclusivas e edições limitadas premium',
    seo: {
      title: 'Coleções Especiais Premium - JC Hair Studio's 62',
      description: 'Coleções exclusivas de extensões premium para ocasiões especiais.',
      keywords: ['coleções especiais', 'premium', 'exclusivo']
    },
    isFeatured: false,
    displayOrder: 4
  }
];
const products = [
  {
    name: 'Mega Hair Liso Loiro Platinado 613 - 50cm',
    description: 'Extensão de cabelo 100% humano Remy europeu, loiro platinado 613 com 50cm de comprimento. Cutículas alinhadas, brilho natural e resistência máxima. Ideal para transformações dramáticas e colorimetria avançada.',
    shortDescription: 'Mega hair loiro platinado 100% humano, 50cm, qualidade premium',
    sku: 'MH-613-50',
    price: 85.00,
    retailPrice: 120.00,
    professionalPrice: 75.00,
    images: [
      {
        url: 'https://i.ibb.co/6c9qWqnq/613-1800x.webp',
        alt: 'Mega Hair Loiro Platinado 613 - 50cm',
        isMain: true,
        displayOrder: 0
      }
    ],
    stock: 25,
    minStock: 5,
    weight: 100,
    characteristics: {
      hairType: 'STRAIGHT',
      hairTexture: 'FINE',
      hairColor: 'Loiro Platinado #613',
      hairOrigin: 'Brasil',
      length: 50
    },
    seo: {
      title: 'Mega Hair Loiro Platinado 613 - 50cm | JC Hair Studio's 62',
      description: 'Extensão de cabelo loiro platinado premium, 100% humano Remy europeu. Transforme seu visual com qualidade profissional.',
      keywords: ['mega hair loiro', 'cabelo platinado', 'extensões loiras'],
      slug: 'mega-hair-liso-loiro-platinado-613-50cm'
    },
    isActive: true,
    isVisible: true,
    isFeatured: true,
    categorySlug: 'mega-hair-liso'
  },
  {
    name: 'Mega Hair Liso Castanho Natural 1 - 55cm',
    description: 'Mega hair castanho natural premium brasileiro com 55cm de comprimento. Alta densidade 110g, movimento orgânico e compatibilidade perfeita com cabelos nativos. Ideal para volume e comprimento simultâneo.',
    shortDescription: 'Mega hair castanho natural 100% humano, 55cm, alta densidade',
    sku: 'MH-1-55',
    price: 90.00,
    retailPrice: 130.00,
    professionalPrice: 80.00,
    images: [
      {
        url: 'https://i.ibb.co/n8NDS1BB/1-8e322489-17fb-4397-842e-4e24610ea213-1800x.webp',
        alt: 'Mega Hair Castanho Natural 1 - 55cm',
        isMain: true,
        displayOrder: 0
      }
    ],
    stock: 30,
    minStock: 5,
    weight: 110,
    characteristics: {
      hairType: 'STRAIGHT',
      hairTexture: 'MEDIUM',
      hairColor: 'Castanho Natural #1',
      hairOrigin: 'Brasil',
      length: 55
    },
    seo: {
      title: 'Mega Hair Castanho Natural - 55cm | JC Hair Studio's 62',
      description: 'Extensão de cabelo castanho natural premium, 100% humano brasileiro. Volume e comprimento perfeitos.',
      keywords: ['mega hair castanho', 'cabelo natural', 'extensões brasileiras'],
      slug: 'mega-hair-liso-castanho-natural-1-55cm'
    },
    isActive: true,
    isVisible: true,
    isFeatured: true,
    categorySlug: 'mega-hair-liso'
  },
  {
    name: 'Mega Hair Rapunzel Collection 24 - 90cm',
    description: 'Coleção Rapunzel exclusiva com comprimento extremo de 90cm. Nossa peça mais exclusiva para transformações dramáticas e looks de impacto. Qualidade Master Class incomparável.',
    shortDescription: 'Mega hair Rapunzel Collection, 90cm, comprimento extremo exclusivo',
    sku: 'MH-RAPUNZEL-90',
    price: 190.00,
    retailPrice: 250.00,
    professionalPrice: 170.00,
    images: [
      {
        url: 'https://i.ibb.co/zVr48cdN/Cabelo-24-1800x.webp',
        alt: 'Mega Hair Rapunzel Collection 24 - 90cm',
        isMain: true,
        displayOrder: 0
      }
    ],
    stock: 5,
    minStock: 1,
    weight: 180,
    characteristics: {
      hairType: 'STRAIGHT',
      hairTexture: 'MEDIUM',
      hairColor: 'Castanho Rapunzel #24',
      hairOrigin: 'Brasil',
      length: 90
    },
    seo: {
      title: 'Mega Hair Rapunzel Collection - 90cm | JC Hair Studio's 62',
      description: 'Extensão de cabelo Rapunzel exclusiva, 90cm de comprimento extremo para looks dramáticos.',
      keywords: ['rapunzel collection', 'cabelo longo', 'extensões premium'],
      slug: 'mega-hair-rapunzel-collection-24-90cm'
    },
    isActive: true,
    isVisible: true,
    isFeatured: true,
    categorySlug: 'colecoes-especiais'
  },
  {
    name: 'Mega Hair Ondulado Natural 6 - 45cm',
    description: 'Mega hair ondulado textura 2B, cor castanho médio natural. Movimento fluido e natural, ideal para quem busca volume com textura definida.',
    shortDescription: 'Mega hair ondulado castanho médio, 45cm, textura 2B natural',
    sku: 'MH-OND-6-45',
    price: 95.00,
    retailPrice: 135.00,
    professionalPrice: 85.00,
    images: [
      {
        url: 'https://i.ibb.co/LzDqR5H/ondulado-6-45cm.webp',
        alt: 'Mega Hair Ondulado Natural 6 - 45cm',
        isMain: true,
        displayOrder: 0
      }
    ],
    stock: 20,
    minStock: 3,
    weight: 105,
    characteristics: {
      hairType: 'WAVY',
      hairTexture: 'MEDIUM',
      hairColor: 'Castanho Médio #6',
      hairOrigin: 'Brasil',
      length: 45
    },
    seo: {
      title: 'Mega Hair Ondulado Castanho - 45cm | JC Hair Studio's 62',
      description: 'Extensão ondulada natural, textura 2B perfeita para volume com movimento.',
      keywords: ['mega hair ondulado', 'cabelo ondulado', 'textura natural'],
      slug: 'mega-hair-ondulado-natural-6-45cm'
    },
    isActive: true,
    isVisible: true,
    isFeatured: true,
    categorySlug: 'mega-hair-ondulado'
  },
  {
    name: 'Mega Hair Cacheado 3C - 40cm',
    description: 'Mega hair cacheado padrão 3C, movimento spiral definido. Textura resiliente e volumosa, perfeita para cabelos naturalmente cacheados.',
    shortDescription: 'Mega hair cacheado 3C, 40cm, textura spiral natural',
    sku: 'MH-3C-40',
    price: 105.00,
    retailPrice: 145.00,
    professionalPrice: 95.00,
    images: [
      {
        url: 'https://i.ibb.co/8cNq2Lp/cacheado-3c-40cm.webp',
        alt: 'Mega Hair Cacheado 3C - 40cm',
        isMain: true,
        displayOrder: 0
      }
    ],
    stock: 15,
    minStock: 3,
    weight: 95,
    characteristics: {
      hairType: 'CURLY',
      hairTexture: 'COARSE',
      hairColor: 'Castanho Escuro #2',
      hairOrigin: 'Brasil',
      length: 40
    },
    seo: {
      title: 'Mega Hair Cacheado 3C - 40cm | JC Hair Studio's 62',
      description: 'Extensão cacheada padrão 3C, movimento spiral definido e natural.',
      keywords: ['mega hair cacheado', 'cabelo cacheado', 'textura 3C'],
      slug: 'mega-hair-cacheado-3c-40cm'
    },
    isActive: true,
    isVisible: true,
    isFeatured: true,
    categorySlug: 'mega-hair-cacheado'
  },
  {
    name: 'Mega Hair Liso Preto Intenso 1B - 60cm',
    description: 'Mega hair preto intenso natural com 60cm, densidade premium 120g. Cor vibrante e uniforme, brilho espetacular.',
    shortDescription: 'Mega hair preto intenso, 60cm, densidade premium',
    sku: 'MH-1B-60',
    price: 98.00,
    retailPrice: 140.00,
    professionalPrice: 88.00,
    images: [
      {
        url: 'https://i.ibb.co/jGQ8R4M/preto-1b-60cm.webp',
        alt: 'Mega Hair Liso Preto Intenso 1B - 60cm',
        isMain: true,
        displayOrder: 0
      }
    ],
    stock: 35,
    minStock: 5,
    weight: 120,
    characteristics: {
      hairType: 'STRAIGHT',
      hairTexture: 'MEDIUM',
      hairColor: 'Preto Natural #1B',
      hairOrigin: 'Brasil',
      length: 60
    },
    seo: {
      title: 'Mega Hair Preto Intenso - 60cm | JC Hair Studio's 62',
      description: 'Extensão de cabelo preto natural premium, 60cm de comprimento e densidade superior.',
      keywords: ['mega hair preto', 'cabelo preto natural', 'extensões longas'],
      slug: 'mega-hair-liso-preto-intenso-1b-60cm'
    },
    isActive: true,
    isVisible: true,
    isFeatured: false,
    categorySlug: 'mega-hair-liso'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting MongoDB seed...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Load or create categories
    console.log('📂 Loading/Creating categories...');
    const createdCategories = new Map();
    
    for (const categoryData of categories) {
      try {
        // First try to get existing category
        let category;
        try {
          const categories = await MongoCategoryService.getCategories({});
          category = categories.categories.find(cat => cat.slug === categoryData.slug);
        } catch (error) {
          // Category doesn't exist
        }
        
        if (!category) {
          // Create new category
          category = await MongoCategoryService.createCategory({
            ...categoryData,
            isActive: true,
            isVisible: true,
            showInMenu: true,
            showInFooter: false,
            productCount: 0,
            viewCount: 0
          });
          console.log(`✓ Created category: ${category.name}`);
        } else {
          console.log(`✓ Using existing category: ${category.name}`);
        }
        
        createdCategories.set(categoryData.slug, category);
      } catch (error) {
        console.error(`❌ Error with category ${categoryData.name}:`, error);
      }
    }

    // Create products
    console.log('🛍️ Creating products...');
    
    for (const productData of products) {
      try {
        const category = createdCategories.get(productData.categorySlug);
        if (!category) {
          console.warn(`⚠️ Category not found for product: ${productData.name}`);
          continue;
        }

        const { categorySlug, ...productDataForDb } = productData;
        const product = await MongoProductService.createProduct({
          ...productDataForDb,
          categoryIds: [category._id.toString()],
          brandId: 'jc-hair-studio',
          tags: [],
          videos: [],
          variants: [],
          hasVariants: false,
          dimensions: {
            length: productData.characteristics.length || 0,
            width: 5,
            height: 1
          },
          characteristics: {
            hairType: productData.characteristics.hairType,
            hairTexture: productData.characteristics.hairTexture,
            hairColor: productData.characteristics.hairColor,
            hairOrigin: productData.characteristics.hairOrigin,
            length: productData.characteristics.length.toString()
          },
          ingredients: [],
          usage: 'Aplicar conforme instruções profissionais',
          warnings: ['Uso exclusivo profissional', 'Não aplicar sobre cabelos danificados'],
          reviews: [],
          averageRating: 0,
          reviewCount: 0,
          isNew: true,
          isOnSale: false,
          publishedAt: new Date(),
          viewCount: 0,
          purchaseCount: 0,
          wishlistCount: 0,
          trackStock: true
        });

        // Update category product count
        await MongoCategoryService.updateProductCount(category._id.toString());
        
        console.log(`✓ Created product: ${product.name}`);
      } catch (error) {
        console.error(`❌ Error creating product ${productData.name}:`, error);
      }
    }

    console.log('🎉 Seed completed successfully!');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('✨ Database seeded successfully!');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Seed error:', error);
    process.exit(1);
  });
}

export { seedDatabase };