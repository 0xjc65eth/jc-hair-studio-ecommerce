import { NextRequest, NextResponse } from 'next/server';
// FIXED: Import connectDB from correct MongoDB connection file
import { connectDB } from '@/lib/mongodb/connection';
import { Product } from '@/lib/models/Product';
import { Category } from '@/lib/models/Category';
import { seedComprehensiveDatabase } from '@/lib/seeders/comprehensive-products';

// Dados dos produtos brasileiros
const brazilianProducts = [
  {
    sku: 'CAD-BC-1000',
    name: 'Brasil Cacau Smoothing Protein Treatment',
    brand: 'Cadiveu Professional',
    category: 'tratamento_capilar',
    subcategory: 'progressiva',
    description: 'Tratamento alisante com cana-de-açúcar Cysteine, cacau e D-panthenol. Sem formol, parabenos e ingredientes animais. Durabilidade de 3+ meses. Ideal para todos os tipos de cabelo, proporcionando alisamento máximo com hidratação profunda.',
    price: {
      retail: 42.69,
      professional: 35.34,
      promotional: 31.80,
      currency: 'EUR'
    },
    sizes: [
      { size: '1000ml', price: 42.69, stock: 15, barcode: '7898963522341' },
      { size: '500ml', price: 23.83, stock: 25, barcode: '7898963522358' }
    ],
    images: [{ url: '/images/products/cadiveu-brasil-cacau.jpg', alt: 'Cadiveu Brasil Cacau 1000ml', isPrimary: true }],
    stock: { available: 40, reserved: 5, minimum: 10 },
    attributes: {
      benefits: ['Alisamento máximo', 'Hidratação profunda', 'Reestruturação capilar', 'Durabilidade 3+ meses'],
      indications: ['Todos os tipos de cabelo', 'Compatível com coloração'],
      composition: ['Cysteine', 'Cacau', 'D-panthenol']
    },
    ratings: { average: 4.8, count: 324, reviews: [] },
    tags: ['progressiva', 'alisamento', 'cadiveu', 'profissional', 'sem formol', 'brasil'],
    seo: {
      slug: 'cadiveu-brasil-cacau-progressiva-1000ml',
      metaTitle: 'Cadiveu Brasil Cacau - Progressiva Sem Formol 1000ml',
      metaDescription: 'Progressiva Cadiveu Brasil Cacau com cacau e D-panthenol. Alisamento duradouro sem formol. Ideal para hair studio profissional.',
      keywords: ['progressiva cadiveu', 'brasil cacau', 'alisamento sem formol', 'progressiva profissional']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'INOAR-GH-1000',
    name: 'Kit Escova Progressiva Alemã G-Hair',
    brand: 'Inoar/G.Hair',
    category: 'tratamento_capilar',
    subcategory: 'progressiva',
    description: 'Fórmula alemã com queratina e óleo de cacau, 0,2% formol. Kit completo com 3 produtos para ação instantânea. Permite lavagem no mesmo dia da aplicação, ideal para cabelos rebeldes.',
    price: {
      retail: 66.12,
      professional: 55.65,
      promotional: 47.70,
      currency: 'EUR'
    },
    sizes: [{ size: 'Kit 3x1000ml', price: 66.12, stock: 10, barcode: '7908124000134' }],
    images: [{ url: '/images/products/inoar-g-hair-kit.jpg', alt: 'Kit G-Hair Alemã 3x1000ml', isPrimary: true }],
    stock: { available: 10, reserved: 2, minimum: 5 },
    attributes: {
      benefits: ['Ação instantânea', 'Permite lavagem no mesmo dia', '15-20 aplicações'],
      indications: ['Cabelos rebeldes', 'Cabelos com muito volume'],
      composition: ['Queratina', 'Óleo de cacau', 'Argila branca']
    },
    ratings: { average: 4.6, count: 189, reviews: [] },
    tags: ['progressiva', 'alemã', 'inoar', 'g-hair', 'kit profissional', 'queratina'],
    seo: {
      slug: 'inoar-g-hair-escova-progressiva-alema-kit',
      metaTitle: 'Inoar G-Hair - Kit Escova Progressiva Alemã 3x1000ml',
      metaDescription: 'Kit G-Hair com fórmula alemã e queratina. Progressiva de ação instantânea para hair studio.',
      keywords: ['progressiva alemã', 'g-hair', 'inoar progressiva', 'kit profissional']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'SWEET-TF-980',
    name: 'The First Liso Intenso Shampoo Alisante',
    brand: 'Sweet Hair Professional',
    category: 'tratamento_capilar',
    subcategory: 'progressiva',
    description: 'Primeiro shampoo alisante do mundo com blend de 5 ácidos. Livre de formol, alisa em uma única lavagem com durabilidade de até 3 meses. Inovação brasileira revolucionária.',
    price: {
      retail: 86.80,
      professional: 75.51,
      promotional: 71.53,
      currency: 'EUR'
    },
    sizes: [{ size: '980ml', price: 75.51, stock: 8, barcode: '7898959463214' }],
    images: [{ url: '/images/products/sweet-hair-the-first.jpg', alt: 'Sweet Hair The First 980ml', isPrimary: true }],
    stock: { available: 8, reserved: 1, minimum: 3 },
    attributes: {
      benefits: ['Livre de formol', 'Alisa em uma lavagem', 'Durabilidade 3 meses', 'Até 20 aplicações'],
      indications: ['Todos os tipos de cabelo'],
      composition: ['Ácido Salicílico', 'Ácido Alfa Lipóico', 'Ácido Glicólico', 'Ácido Lático', 'Ácido Hialurônico']
    },
    ratings: { average: 4.9, count: 567, reviews: [] },
    tags: ['progressiva', 'shampoo alisante', 'sweet hair', 'sem formol', 'inovação', 'brasil'],
    seo: {
      slug: 'sweet-hair-the-first-shampoo-alisante-980ml',
      metaTitle: 'Sweet Hair The First - Shampoo Alisante sem Formol 980ml',
      metaDescription: 'The First Sweet Hair - Primeiro shampoo alisante do mundo. Sem formol, alisa em uma lavagem.',
      keywords: ['shampoo alisante', 'the first', 'sweet hair', 'sem formol', 'alisamento inovador']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'FOREVER-BOT-1000',
    name: 'Botox Capilar Zero Formol',
    brand: 'Forever Liss Professional',
    category: 'tratamento_capilar',
    subcategory: 'botox',
    description: '100% livre de formol, com óleo de argan, coco e manteiga de karité. Redução de 90% do volume, alinhamento capilar e hidratação profunda. Durabilidade de 20-50 dias.',
    price: {
      retail: 20.35,
      professional: 15.11,
      promotional: 14.29,
      currency: 'EUR'
    },
    sizes: [
      { size: '1kg', price: 20.35, stock: 20, barcode: '7908030408458' },
      { size: '250g', price: 6.18, stock: 30, barcode: '7908030408465' }
    ],
    images: [{ url: '/images/products/forever-liss-botox-zero.jpg', alt: 'Forever Liss Botox Zero Formol 1kg', isPrimary: true }],
    stock: { available: 50, reserved: 5, minimum: 10 },
    attributes: {
      benefits: ['Alinhamento capilar', 'Redução 90% do volume', 'Hidratação profunda', 'Durabilidade 20-50 dias'],
      indications: ['Cabelos danificados', 'Cabelos com frizz'],
      composition: ['Óleo de argan', 'Óleo de coco', 'Manteiga de karité']
    },
    ratings: { average: 4.5, count: 234, reviews: [] },
    tags: ['botox', 'tratamento', 'forever liss', 'sem formol', 'hidratação', 'brasil'],
    seo: {
      slug: 'forever-liss-botox-capilar-zero-formol-1kg',
      metaTitle: 'Forever Liss Botox Capilar Zero Formol 1kg - Hidratação Profunda',
      metaDescription: 'Botox capilar Forever Liss sem formol. Reduz 90% do volume com hidratação profunda.',
      keywords: ['botox capilar', 'forever liss', 'sem formol', 'hidratação', 'alinhamento']
    },
    featured: false,
    isActive: true
  },
];

const brazilianCategories = [
  {
    name: 'Tratamentos Capilares',
    slug: 'tratamento_capilar',
    description: 'Progressivas, botox capilar e tratamentos profissionais brasileiros',
    order: 1,
    featured: true,
    image: '/images/categories/tratamentos-capilares.jpg',
    icon: '💇‍♀️',
    seo: {
      metaTitle: 'Tratamentos Capilares Profissionais - Hair Studio Brasil',
      metaDescription: 'Progressivas, botox e tratamentos capilares das melhores marcas brasileiras. Cadiveu, Sweet Hair, Forever Liss.',
      keywords: ['progressiva brasil', 'botox capilar', 'tratamento profissional', 'cadiveu', 'sweet hair']
    },
    isActive: true
  },
  {
    name: 'Maquiagem',
    slug: 'maquiagem',
    description: 'Maquiagens brasileiras para todos os tons de pele',
    order: 3,
    featured: true,
    image: '/images/categories/maquiagem.jpg',
    icon: '💄',
    seo: {
      metaTitle: 'Maquiagem Brasileira - QDB, Ruby Rose, Vult',
      metaDescription: 'Maquiagens desenvolvidas para a pele brasileira. Bases, batons e paletas das melhores marcas nacionais.',
      keywords: ['maquiagem brasileira', 'base qdb', 'ruby rose', 'vult', 'pele brasileira']
    },
    isActive: true
  },
  {
    name: 'Ferramentas Profissionais',
    slug: 'ferramentas',
    description: 'Equipamentos profissionais para salões e hair studios',
    order: 4,
    featured: true,
    image: '/images/categories/ferramentas.jpg',
    icon: '🔧',
    seo: {
      metaTitle: 'Ferramentas Profissionais - Taiff, BaByliss, Wahl',
      metaDescription: 'Secadores, chapinhas e equipamentos profissionais. Taiff, BaByliss PRO para hair studios.',
      keywords: ['secador taiff', 'chapinha babyliss', 'ferramentas profissionais', 'equipamentos salão']
    },
    isActive: true
  },
  {
    name: 'Cuidados Diários',
    slug: 'cuidados_diarios',
    description: 'Shampoos, condicionadores e máscaras para uso diário',
    order: 5,
    featured: false,
    image: '/images/categories/cuidados-diarios.jpg',
    icon: '🧴',
    seo: {
      metaTitle: 'Cuidados Diários Capilares - Shampoos e Condicionadores',
      metaDescription: 'Produtos para cuidados diários dos cabelos. LOréal, Kérastase, marcas profissionais.',
      keywords: ['shampoo profissional', 'condicionador', 'máscara capilar', 'cuidados diários']
    },
    isActive: true
  }
];

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'basic';

    console.log(`🌱 Iniciando seeding ${mode} do banco de dados...`);

    if (mode === 'comprehensive') {
      // Use comprehensive seeding with all catalogs
      const result = await seedComprehensiveDatabase();

      return NextResponse.json({
        success: true,
        message: 'Comprehensive database seeded successfully! 🎉',
        data: {
          categoriesCount: result.categories,
          productsCount: result.products,
          productsByCategory: result.productsByCategory
        }
      });
    } else {
      // Basic seeding with limited products
      await connectDB();

      // Limpar dados existentes
      await Product.deleteMany({});
      await Category.deleteMany({});
      console.log('🗑️ Dados existentes removidos');

      // Inserir categorias
      const categories = await Category.insertMany(brazilianCategories);
      console.log(`✅ ${categories.length} categorias inseridas`);

      // Inserir produtos
      const products = await Product.insertMany(brazilianProducts);
      console.log(`✅ ${products.length} produtos inseridos`);

      return NextResponse.json({
        success: true,
        message: 'Basic database seeded successfully! 🎉',
        data: {
          categoriesCount: categories.length,
          productsCount: products.length,
          categories: categories.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            featured: cat.featured
          })),
          products: products.map(prod => ({
            sku: prod.sku,
            name: prod.name,
            brand: prod.brand,
            category: prod.category,
            featured: prod.featured
          }))
        }
      });
    }

  } catch (error) {
    console.error('❌ Erro durante o seeding:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao popular banco de dados',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST para executar o seeding do banco de dados',
    endpoint: '/api/seed',
    method: 'POST'
  });
}