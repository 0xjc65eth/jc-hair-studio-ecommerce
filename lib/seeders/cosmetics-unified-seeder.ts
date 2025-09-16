import { PrismaClient } from '@prisma/client';
import { batch2Products } from './batch-2-products';
import { batch4Products } from './batch-4-products';

const prisma = new PrismaClient();

// Batch 3 products extracted from markdown
const batch3Products = [
  {
    sku: 'VULT-PS-SUNSET',
    name: 'Paleta Vult Soleil Sunset',
    brand: 'Vult',
    category: 'maquiagem',
    subcategory: 'paletas_sombras',
    description: 'Paleta profissional com 12 tons inspirados no pôr do sol. Combinação perfeita de tons quentes em acabamentos matte e cintilante. Fórmula altamente pigmentada e longa duração. Ideal para criar looks desde o natural até o mais intenso. Inclui espelho interno e aplicador duplo.',
    price: {
      retail: 24.99,
      professional: 20.83,
      promotional: 18.75,
      currency: 'EUR'
    },
    sizes: [
      { size: '3g', price: 24.99, stock: 12, barcode: '7894900098765' }
    ],
    images: [
      {
        url: '/images/products/vult-paleta-soleil-sunset.jpg',
        alt: 'Vult Paleta Soleil Sunset 12 tons',
        isPrimary: true
      }
    ],
    stock: { available: 12, reserved: 2, minimum: 4 },
    attributes: {
      benefits: ['12 tons profissionais', 'Acabamento matte e cintilante', 'Altamente pigmentada', 'Longa duração'],
      indications: ['Maquiagem profissional', 'Looks naturais e intensos', 'Todas as idades'],
      composition: ['Pigmentos minerais', 'Talco', 'Mica', 'Óxidos de ferro']
    },
    ratings: { average: 4.7, count: 89, reviews: [] },
    tags: ['paleta', 'vult', 'sombras', 'sunset', 'profissional', 'brasil'],
    seo: {
      slug: 'vult-paleta-soleil-sunset',
      metaTitle: 'Vult Paleta Soleil Sunset - 12 Tons Profissionais',
      metaDescription: 'Paleta Vult com 12 tons inspirados no pôr do sol. Matte e cintilante.',
      keywords: ['paleta vult', 'soleil sunset', 'sombras', 'maquiagem profissional']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'MAKEB-PAL-ONE',
    name: 'Paleta Make B One - O Boticário',
    brand: 'O Boticário Make B',
    category: 'maquiagem',
    subcategory: 'paletas_sombras',
    description: 'Paleta premium com 24 cores selecionadas em acabamentos matte, acetinado e glossy. Tecnologia avançada de pigmentação que garante cobertura intensa e duração de até 12 horas. Cores versáteis que permitem criações infinitas para qualquer ocasião. Embalagem sofisticada com espelho HD.',
    price: {
      retail: 89.99,
      professional: 74.99,
      promotional: 67.49,
      currency: 'EUR'
    },
    sizes: [
      { size: '24g', price: 89.99, stock: 6, barcode: '7891010345678' }
    ],
    images: [
      {
        url: '/images/products/make-b-paleta-one.jpg',
        alt: 'Make B One Paleta 24 Cores Premium',
        isPrimary: true
      }
    ],
    stock: { available: 6, reserved: 1, minimum: 2 },
    attributes: {
      benefits: ['24 cores premium', 'Duração até 12h', 'Múltiplos acabamentos', 'Espelho HD'],
      indications: ['Profissionais de maquiagem', 'Ocasiões especiais', 'Uso diário'],
      composition: ['Pigmentos premium', 'Tecnologia avançada', 'Fórmula sedosa']
    },
    ratings: { average: 4.9, count: 156, reviews: [] },
    tags: ['paleta', 'make-b', 'premium', 'o-boticario', '24-cores', 'brasil'],
    seo: {
      slug: 'make-b-paleta-one-24-cores',
      metaTitle: 'Make B One Paleta 24 Cores Premium - O Boticário',
      metaDescription: 'Paleta premium Make B com 24 cores em múltiplos acabamentos.',
      keywords: ['make b one', 'paleta 24 cores', 'o boticario', 'premium makeup']
    },
    featured: true,
    isActive: true
  },
  {
    sku: 'FLORENZA-ESS-NEU',
    name: 'Paleta Florenza Essentials Neutrals',
    brand: 'Florenza',
    category: 'maquiagem',
    subcategory: 'paletas_sombras',
    description: 'Paleta essencial com tons neutros universais. 18 sombras cuidadosamente selecionadas para todos os tipos de pele. Fórmula sedosa e de fácil esfumação. Inclui tons desde o nude claro até o marrom intenso. Perfeita para profissionais que buscam versatilidade.',
    price: {
      retail: 34.99,
      professional: 29.16,
      promotional: 26.24,
      currency: 'EUR'
    },
    sizes: [
      { size: '15g', price: 34.99, stock: 15, barcode: '7894900123456' }
    ],
    images: [
      {
        url: '/images/products/florenza-essentials-neutrals.jpg',
        alt: 'Florenza Paleta Essentials Neutrals 18 tons',
        isPrimary: true
      }
    ],
    stock: { available: 15, reserved: 2, minimum: 5 },
    attributes: {
      benefits: ['18 tons neutros', 'Fórmula sedosa', 'Fácil esfumação', 'Tons universais'],
      indications: ['Todos os tipos de pele', 'Maquiagem natural', 'Profissionais versáteis'],
      composition: ['Pigmentos naturais', 'Base sedosa', 'Tons harmoniosos']
    },
    ratings: { average: 4.6, count: 203, reviews: [] },
    tags: ['paleta', 'florenza', 'neutros', 'essentials', 'versatil', 'brasil'],
    seo: {
      slug: 'florenza-paleta-essentials-neutrals',
      metaTitle: 'Florenza Paleta Essentials Neutrals - 18 Tons Neutros',
      metaDescription: 'Paleta Florenza com 18 tons neutros universais para todos os tipos de pele.',
      keywords: ['florenza paleta', 'tons neutros', 'essentials', 'maquiagem natural']
    },
    featured: false,
    isActive: true
  },
  {
    sku: 'VULT-BASE-Q040',
    name: 'Base Vult Hidraluronic Q040',
    brand: 'Vult',
    category: 'maquiagem',
    subcategory: 'bases',
    description: 'Base líquida mate com ácido hialurônico e cobertura buildable. Fórmula hidratante que mantém a pele confortável por até 14 horas. Disponível em 10 tons que se adaptam perfeitamente à pele brasileira. Textura leve que não resseca e proporciona acabamento natural.',
    price: {
      retail: 16.99,
      professional: 14.16,
      promotional: 12.74,
      currency: 'EUR'
    },
    sizes: [
      { size: '26ml', price: 16.99, stock: 20, barcode: '7894900234567' }
    ],
    images: [
      {
        url: '/images/products/vult-base-hidraluronic.jpg',
        alt: 'Vult Base Hidraluronic Q040 26ml',
        isPrimary: true
      }
    ],
    stock: { available: 20, reserved: 3, minimum: 8 },
    attributes: {
      benefits: ['Ácido hialurônico', 'Duração 14h', 'Cobertura buildable', '10 tons disponíveis'],
      indications: ['Pele brasileira', 'Uso prolongado', 'Acabamento natural'],
      composition: ['Ácido hialurônico', 'Base hidratante', 'Pigmentos adaptativos']
    },
    ratings: { average: 4.5, count: 312, reviews: [] },
    tags: ['base', 'vult', 'hidraluronic', 'acido-hialuronico', 'natural', 'brasil'],
    seo: {
      slug: 'vult-base-hidraluronic-q040',
      metaTitle: 'Vult Base Hidraluronic Q040 - Ácido Hialurônico 26ml',
      metaDescription: 'Base Vult com ácido hialurônico, cobertura buildable e duração de 14h.',
      keywords: ['base vult', 'hidraluronic', 'acido hialuronico', 'base liquida']
    },
    featured: false,
    isActive: true
  },
  {
    sku: 'BOCAROSA-STICK-3IN1',
    name: 'Stick Boca Rosa Beauty Multifuncional',
    brand: 'Boca Rosa Beauty',
    category: 'maquiagem',
    subcategory: 'bases_multifuncionais',
    description: 'Stick revolucionário 3 em 1: base, contorno e corretor. Tecnologia cremosa que se adapta perfeitamente à pele. Fórmula resistente à água e ao suor. Disponível em 50 tonalidades exclusivas para atender todos os subtons de pele. Praticidade profissional em formato portátil.',
    price: {
      retail: 34.99,
      professional: 29.16,
      promotional: 26.24,
      currency: 'EUR'
    },
    sizes: [
      { size: '12g', price: 34.99, stock: 18, barcode: '7894900345678' }
    ],
    images: [
      {
        url: '/images/products/boca-rosa-stick-multifuncional.jpg',
        alt: 'Boca Rosa Beauty Stick Multifuncional 3 em 1',
        isPrimary: true
      }
    ],
    stock: { available: 18, reserved: 2, minimum: 6 },
    attributes: {
      benefits: ['3 em 1 multifuncional', '50 tonalidades', 'Resistente à água', 'Formato portátil'],
      indications: ['Todos os subtons', 'Praticidade profissional', 'Viagens e retoque'],
      composition: ['Fórmula cremosa', 'Tecnologia adaptativa', 'Resistência avançada']
    },
    ratings: { average: 4.8, count: 267, reviews: [] },
    tags: ['stick', 'boca-rosa', 'multifuncional', '3-em-1', 'pratico', 'brasil'],
    seo: {
      slug: 'boca-rosa-stick-multifuncional-3-em-1',
      metaTitle: 'Boca Rosa Beauty Stick Multifuncional 3 em 1 - 50 Tons',
      metaDescription: 'Stick Boca Rosa 3 em 1: base, contorno e corretor em 50 tonalidades.',
      keywords: ['boca rosa stick', 'multifuncional', '3 em 1', 'base stick']
    },
    featured: true,
    isActive: true
  }
];

// Comprehensive category mapping for all cosmetic products
const cosmeticsCategoryMapping = {
  // Hair care products (existing categories)
  'cuidados_diarios': 'cuidados-beleza',
  'tratamento_premium': 'tratamentos-capilares',
  'ferramentas_profissionais': 'ferramentas-profissionais',
  'coloracao_profissional': 'progressivas-alisamentos',
  'finalizadores_premium': 'cuidados-beleza',
  'cuidados_premium': 'shampoos-condicionadores',
  'ferramentas_premium': 'ferramentas-profissionais',

  // Cosmetics categories (new)
  'maquiagem': 'cosmeticos',
  'paletas_sombras': 'cosmeticos',
  'bases': 'cosmeticos',
  'bases_multifuncionais': 'cosmeticos',
  'blushes': 'cosmeticos',
  'esmaltes': 'cosmeticos',
  'kit_esmaltes': 'cosmeticos',
  'base_coat_top_coat': 'cosmeticos',
  'kit_nail_art': 'cosmeticos',
  'pinceis': 'ferramentas-beleza',
  'acessorios': 'acessorios',
  'outros': 'outros'
};

// Product type mapping for cosmetics
const productTypeMapping = {
  // Hair products
  'cuidados_diarios': 'HAIR_CARE',
  'tratamento_premium': 'HAIR_TREATMENT',
  'ferramentas_profissionais': 'TOOL_PROFESSIONAL',
  'coloracao_profissional': 'HAIR_TREATMENT',
  'finalizadores_premium': 'HAIR_CARE',
  'cuidados_premium': 'HAIR_CARE',
  'ferramentas_premium': 'TOOL_PROFESSIONAL',

  // Cosmetics
  'maquiagem': 'MAKEUP',
  'paletas_sombras': 'MAKEUP',
  'bases': 'MAKEUP',
  'bases_multifuncionais': 'MAKEUP',
  'blushes': 'MAKEUP',
  'esmaltes': 'NAIL_POLISH',
  'kit_esmaltes': 'NAIL_POLISH',
  'base_coat_top_coat': 'NAIL_POLISH',
  'kit_nail_art': 'NAIL_POLISH',
  'pinceis': 'TOOL_PROFESSIONAL',
  'acessorios': 'TOOL_PROFESSIONAL',
  'outros': 'BODY_CARE'
};

// Function to create slug from name
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .trim();
};

// Convert product data to Prisma format
const convertToProductData = (product: any, batchNumber: number) => {
  const slug = product.seo?.slug || createSlug(product.name);
  const category = product.category || product.subcategory || 'outros';
  const mappedCategory = cosmeticsCategoryMapping[category as keyof typeof cosmeticsCategoryMapping] || 'cosmeticos';
  const productType = productTypeMapping[category as keyof typeof productTypeMapping] || 'MAKEUP';

  // Handle pricing - prioritize EUR prices if available
  const priceData = product.priceEUR || product.price;
  const retailPrice = priceData.retail;
  const comparePrice = priceData.promotional ? null : Math.round(retailPrice * 1.15 * 100) / 100;

  return {
    name: product.name,
    slug,
    description: product.description,
    shortDesc: product.description.length > 150 ?
               product.description.substring(0, 147) + '...' :
               product.description,
    sku: product.sku,
    price: retailPrice,
    professionalPrice: priceData.professional,
    comparePrice,
    cost: priceData.professional * 0.8, // Cost as 80% of professional price
    weight: 0.3, // Default weight for cosmetics
    brand: product.brand,
    productType,
    quantity: product.stock.available,
    lowStockAlert: product.stock.minimum || 5,
    status: product.isActive ? 'ACTIVE' : 'DRAFT',
    metaTitle: product.seo?.metaTitle || `${product.name} - JC Hair Studio's 62`,
    metaDescription: product.seo?.metaDescription || product.description.substring(0, 160),
    keywords: Array.isArray(product.seo?.keywords) ?
              product.seo.keywords.join(', ') :
              product.tags?.join(', ') || '',
    isFeatured: product.featured || false,
    categories: [mappedCategory],
    images: product.images.map((img: any, index: number) => ({
      url: img.url,
      alt: img.alt || `${product.name} - Imagem ${index + 1}`,
      title: product.name,
      isMain: img.isPrimary || img.isMain || index === 0
    })),
    variants: product.sizes?.map((size: any) => ({
      name: `${product.name} - ${size.size}`,
      sku: `${product.sku}-${size.size.replace(/\s+/g, '').toUpperCase()}`,
      size: size.size,
      color: product.attributes?.color || 'Padrão',
      price: size.price,
      comparePrice: size.price < retailPrice ? retailPrice : null,
      quantity: size.stock
    })) || [],
    tags: product.tags || [],
    batchNumber
  };
};

// Main seeding function
export async function seedAllCosmeticsProducts() {
  console.log('🎨 Iniciando importação completa de produtos cosméticos...');

  const allProducts = [
    ...batch2Products.map(p => ({ ...p, batchNumber: 2 })),
    ...batch3Products.map(p => ({ ...p, batchNumber: 3 })),
    ...batch4Products.map(p => ({ ...p, batchNumber: 4 }))
  ];

  console.log(`📦 Total de produtos: ${allProducts.length}`);
  console.log(`   🇧🇷 Batch 2 (Brasileiros): ${batch2Products.length} produtos`);
  console.log(`   💄 Batch 3 (Maquiagem): ${batch3Products.length} produtos`);
  console.log(`   💎 Batch 4 (Premium): ${batch4Products.length} produtos`);

  // Ensure required categories exist
  const requiredCategories = [
    {
      name: 'Cosméticos',
      slug: 'cosmeticos',
      description: 'Produtos de maquiagem e beleza premium',
      metaTitle: 'Cosméticos - Maquiagem e Produtos de Beleza',
      metaDescription: 'Produtos cosméticos premium: maquiagem, bases, paletas, esmaltes e acessórios de beleza.',
      isActive: true,
      isFeatured: true
    },
    {
      name: 'Ferramentas de Beleza',
      slug: 'ferramentas-beleza',
      description: 'Pincéis, espátulas e ferramentas profissionais de beleza',
      metaTitle: 'Ferramentas de Beleza - Pincéis e Acessórios Profissionais',
      metaDescription: 'Ferramentas profissionais para maquiagem: pincéis, espátulas e acessórios de qualidade.',
      isActive: true,
      isFeatured: false
    }
  ];

  console.log('\n📋 Criando/verificando categorias necessárias...');
  for (const category of requiredCategories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug }
    });

    if (!existing) {
      await prisma.category.create({
        data: category
      });
      console.log(`✅ Categoria criada: ${category.name}`);
    } else {
      console.log(`📁 Categoria já existe: ${category.name}`);
    }
  }

  // Process products in batches
  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  console.log('\n🔄 Processando produtos...');

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];

    try {
      const productData = convertToProductData(product, product.batchNumber);

      // Check if product already exists
      const existing = await prisma.product.findUnique({
        where: { sku: productData.sku }
      });

      if (existing) {
        console.log(`⚠️  Produto já existe: ${productData.name} (${productData.sku})`);
        continue;
      }

      // Get category IDs
      const categories = await prisma.category.findMany({
        where: {
          slug: {
            in: productData.categories
          }
        }
      });

      const categoryIds = categories.map(cat => cat.id);

      // Create product
      const newProduct = await prisma.product.create({
        data: {
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          shortDesc: productData.shortDesc,
          sku: productData.sku,
          price: productData.price,
          professionalPrice: productData.professionalPrice,
          comparePrice: productData.comparePrice,
          cost: productData.cost,
          weight: productData.weight,
          brand: productData.brand,
          productType: productData.productType,
          quantity: productData.quantity,
          lowStockAlert: productData.lowStockAlert,
          status: productData.status,
          metaTitle: productData.metaTitle,
          metaDescription: productData.metaDescription,
          keywords: productData.keywords,
          isFeatured: productData.isFeatured,
          categoryIds,
          images: productData.images,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Create variants if they exist
      if (productData.variants && productData.variants.length > 0) {
        for (const variant of productData.variants) {
          await prisma.productVariant.create({
            data: {
              productId: newProduct.id,
              name: variant.name,
              sku: variant.sku,
              size: variant.size,
              color: variant.color,
              price: variant.price,
              comparePrice: variant.comparePrice,
              quantity: variant.quantity
            }
          });
        }
      }

      successCount++;
      console.log(`✅ ${i + 1}/${allProducts.length} - ${productData.name} (Batch ${product.batchNumber})`);

    } catch (error) {
      errorCount++;
      const errorMsg = `❌ Erro no produto ${product.name}: ${error}`;
      errors.push(errorMsg);
      console.log(errorMsg);
    }
  }

  // Final statistics
  console.log('\n🎉 Importação concluída!');
  console.log(`✅ Produtos importados com sucesso: ${successCount}`);
  console.log(`❌ Produtos com erro: ${errorCount}`);

  if (errors.length > 0) {
    console.log('\n❌ Detalhes dos erros:');
    errors.forEach(error => console.log(`   ${error}`));
  }

  console.log('\n📊 Resumo das categorias:');
  const categoryStats = await prisma.category.findMany({
    where: {
      slug: {
        in: Object.values(cosmeticsCategoryMapping)
      }
    },
    select: {
      name: true,
      slug: true,
      productIds: true
    }
  });

  categoryStats.forEach(cat => {
    console.log(`   📂 ${cat.name}: ${cat.productIds.length} produtos`);
  });

  return {
    total: allProducts.length,
    success: successCount,
    errors: errorCount,
    categories: categoryStats.length
  };
}

// Individual batch functions for flexibility
export async function seedBatch2Products() {
  console.log('🇧🇷 Importando Batch 2 - Produtos Brasileiros...');
  // Implementation for batch 2 only
}

export async function seedBatch3Products() {
  console.log('💄 Importando Batch 3 - Maquiagem e Unhas...');
  // Implementation for batch 3 only
}

export async function seedBatch4Products() {
  console.log('💎 Importando Batch 4 - Premium Internacional...');
  // Implementation for batch 4 only
}

// Main execution
if (require.main === module) {
  seedAllCosmeticsProducts()
    .then((result) => {
      console.log(`🎊 Processo finalizado: ${result.success}/${result.total} produtos importados`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}