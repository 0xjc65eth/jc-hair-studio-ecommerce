import { PrismaClient } from '@prisma/client';
import { batch4Products, batch4Stats } from './batch-4-products';
import { CreateProductData } from '../../types/product';

const prisma = new PrismaClient();

// Mapping das categorias do batch 4 para categorias do sistema
const categoryMapping = {
  ferramentas_profissionais: 'ferramentas-profissionais',
  tratamento_premium: 'tratamentos-capilares',
  coloracao_profissional: 'progressivas-alisamentos',
  finalizadores_premium: 'cuidados-beleza',
  cuidados_premium: 'shampoos-condicionadores',
  ferramentas_premium: 'ferramentas-profissionais',
  outros: 'acessorios'
};

// Função para converter produto do batch 4 para formato Prisma
const convertToProductData = (batchProduct: typeof batch4Products[0]): CreateProductData => {
  // Criar slug a partir do nome
  const slug = batchProduct.name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();

  // Determinar tipo de cabelo baseado na categoria
  let hairType: 'STRAIGHT' | 'WAVY' | 'CURLY' | 'KINKY' = 'STRAIGHT';
  if (batchProduct.category.includes('ondulado') || batchProduct.category.includes('wavy')) {
    hairType = 'WAVY';
  } else if (batchProduct.category.includes('cacheado') || batchProduct.category.includes('curly')) {
    hairType = 'CURLY';
  }

  // Calcular preço de comparação (20% acima do retail)
  const comparePrice = Math.round(batchProduct.price.retail * 1.2 * 100) / 100;

  return {
    name: batchProduct.name,
    slug,
    description: batchProduct.description,
    shortDesc: batchProduct.description.substring(0, 150) + '...',
    sku: batchProduct.sku,
    price: batchProduct.price.retail,
    comparePrice,
    cost: batchProduct.price.professional, // Usar preço profissional como custo
    weight: 0.5, // Peso padrão
    length: 0, // Não aplicável para produtos cosméticos
    hairType,
    hairTexture: 'MEDIUM',
    hairColor: 'Variado',
    hairOrigin: batchProduct.tags.includes('brasil') ? 'Brasil' :
               batchProduct.tags.includes('eua') ? 'EUA' :
               batchProduct.tags.includes('franca') ? 'França' :
               batchProduct.tags.includes('alemanha') ? 'Alemanha' : 'Internacional',
    quantity: batchProduct.stock.available,
    lowStockAlert: batchProduct.stock.minimum,
    status: batchProduct.isActive ? 'ACTIVE' : 'INACTIVE',
    metaTitle: batchProduct.seo.metaTitle,
    metaDescription: batchProduct.seo.metaDescription,
    keywords: batchProduct.seo.keywords.join(', '),
    isFeatured: batchProduct.featured,
    categories: [categoryMapping[batchProduct.category as keyof typeof categoryMapping] || 'outros'],
    images: batchProduct.images.map((img, index) => ({
      url: img.url,
      alt: img.alt,
      title: batchProduct.name,
      isMain: img.isPrimary || index === 0
    })),
    variants: batchProduct.sizes.map(size => ({
      name: size.size,
      sku: `${batchProduct.sku}-${size.size.replace(/\s+/g, '')}`,
      size: size.size,
      color: batchProduct.attributes?.color || 'Padrão',
      price: size.price,
      comparePrice: Math.round(size.price * 1.2 * 100) / 100,
      quantity: size.stock
    }))
  };
};

export async function seedBatch4Products() {
  console.log('🚀 Iniciando importação do Batch 4 - Produtos Premium...');
  console.log(`📦 Total de produtos: ${batch4Products.length}`);

  // Estatísticas iniciais
  console.log('📊 Estatísticas do Batch:');
  console.log(`   💰 Faixa de preços: €${batch4Stats.priceRange.min} - €${batch4Stats.priceRange.max}`);
  console.log(`   ⭐ Rating médio: ${batch4Stats.averageRating}`);
  console.log(`   🏷️ Brands: ${batch4Stats.brands.length} marcas internacionais`);
  console.log(`   💎 Nível profissional: ${batch4Stats.professionalGrade}`);

  // Verificar/criar categorias necessárias
  const requiredCategories = Object.values(categoryMapping);
  console.log('\n📋 Verificando categorias...');

  for (const categorySlug of requiredCategories) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });

    if (!existingCategory) {
      const categoryNames = {
        'ferramentas-profissionais': 'Ferramentas Profissionais',
        'tratamentos-capilares': 'Tratamentos Capilares',
        'progressivas-alisamentos': 'Progressivas e Alisamentos',
        'cuidados-beleza': 'Cuidados e Beleza',
        'shampoos-condicionadores': 'Shampoos e Condicionadores',
        'acessorios': 'Acessórios'
      };

      await prisma.category.create({
        data: {
          name: categoryNames[categorySlug as keyof typeof categoryNames] || categorySlug,
          slug: categorySlug,
          description: `Categoria para produtos ${categorySlug.replace('-', ' ')}`
        }
      });
      console.log(`   ✅ Categoria criada: ${categorySlug}`);
    }
  }

  // Processar produtos em lotes para melhor performance
  const BATCH_SIZE = 5;
  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;

  console.log('\n🔄 Processando produtos...');

  for (let i = 0; i < batch4Products.length; i += BATCH_SIZE) {
    const batch = batch4Products.slice(i, i + BATCH_SIZE);

    await Promise.allSettled(
      batch.map(async (batchProduct) => {
        try {
          const productData = convertToProductData(batchProduct);
          const { images, variants, categories, ...baseProduct } = productData;

          // Buscar categoria ID
          const category = await prisma.category.findUnique({
            where: { slug: categories[0] }
          });

          if (!category) {
            throw new Error(`Categoria não encontrada: ${categories[0]}`);
          }

          // Verificar se produto já existe
          const existingProduct = await prisma.product.findUnique({
            where: { slug: productData.slug }
          });

          if (existingProduct) {
            console.log(`   ⚠️  Produto já existe: ${productData.name}`);
            return;
          }

          // Criar produto
          const createdProduct = await prisma.product.create({
            data: {
              ...baseProduct,
              images: {
                create: images
              },
              categories: {
                create: [{ categoryId: category.id }]
              },
              variants: variants && variants.length > 0 ? {
                create: variants
              } : undefined
            }
          });

          successCount++;
          console.log(`   ✅ ${successCount.toString().padStart(2, '0')}. ${createdProduct.name}`);
          console.log(`       SKU: ${createdProduct.sku} | Preço: €${createdProduct.price} | Estoque: ${createdProduct.quantity}`);

        } catch (error) {
          errorCount++;
          console.error(`   ❌ Erro ao criar produto ${batchProduct.name}:`, error);
        }

        processedCount++;
      })
    );

    // Pequena pausa entre lotes
    if (i + BATCH_SIZE < batch4Products.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Relatório final
  console.log('\n📈 RELATÓRIO FINAL - BATCH 4');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Produtos importados: ${successCount}`);
  console.log(`❌ Erros encontrados: ${errorCount}`);
  console.log(`📊 Total processados: ${processedCount}`);
  console.log(`💰 Valor total do inventário: €${batch4Stats.totalInventoryValue.toLocaleString()}`);

  // Estatísticas por categoria
  console.log('\n📂 Produtos por categoria:');
  for (const [category, count] of Object.entries(batch4Stats.categories)) {
    console.log(`   ${category}: ${count} produtos`);
  }

  console.log('\n🎉 Batch 4 finalizado com sucesso!');
  console.log('💎 Todos os produtos são de nível profissional premium');
  console.log('🌍 Marcas internacionais com preços em EUR');
  console.log('⚡ Sistema pronto para vendas profissionais!');
}

export async function clearBatch4Products() {
  console.log('🧹 Limpando produtos do Batch 4...');

  const batch4SKUs = batch4Products.map(p => p.sku);

  // Remover imagens
  await prisma.productImage.deleteMany({
    where: {
      product: {
        sku: {
          in: batch4SKUs
        }
      }
    }
  });

  // Remover variantes
  await prisma.productVariant.deleteMany({
    where: {
      product: {
        sku: {
          in: batch4SKUs
        }
      }
    }
  });

  // Remover categorias dos produtos
  await prisma.productCategory.deleteMany({
    where: {
      product: {
        sku: {
          in: batch4SKUs
        }
      }
    }
  });

  // Remover produtos
  const deletedProducts = await prisma.product.deleteMany({
    where: {
      sku: {
        in: batch4SKUs
      }
    }
  });

  console.log(`✅ ${deletedProducts.count} produtos removidos do Batch 4`);
}

// Execução direta se chamado como script principal
if (require.main === module) {
  seedBatch4Products()
    .then(() => {
      console.log('\n🎊 IMPORTAÇÃO CONCLUÍDA COM SUCESSO!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 ERRO DURANTE A IMPORTAÇÃO:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}