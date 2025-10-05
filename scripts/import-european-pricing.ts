import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Try .env.local first, then .env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB_NAME || 'jc-hair-studio-ecommerce';

interface ProductData {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDesc?: string;
  volume?: string;
  pricing: {
    basePrice?: number;
    ourPrice?: number;
    discountPrice: number;
    retailPrice?: number;
    savings?: number;
    margin?: string;
  };
  images?: Array<{ url: string; alt: string }>;
  inStock?: boolean;
  stockQuantity?: number;
  weight?: number;
  tags?: string[];
  rating?: number;
  reviewsCount?: number;
}

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  products: ProductData[];
}

interface JSONData {
  metadata: any;
  categories: CategoryData[];
}

async function importEuropeanPricing() {
  let client: MongoClient | null = null;

  try {
    console.log('📂 Lendo arquivo de produtos com preços europeus...');
    const filePath = path.join(process.cwd(), 'lib/data/products-with-european-pricing-NEW.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData: JSONData = JSON.parse(fileContent);

    // Flatten all products from all categories
    const products: ProductData[] = jsonData.categories.flatMap(cat => cat.products);

    console.log(`✅ ${products.length} produtos carregados do arquivo`);

    console.log('🔗 Conectando ao MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    console.log(`✅ Conectado ao banco de dados: ${DB_NAME}`);

    // Buscar categorias existentes
    const categories = await db.collection('categories').find({}).toArray();
    const categoryMap = new Map();
    categories.forEach(cat => {
      categoryMap.set(cat.slug, cat._id);
      categoryMap.set(cat.name, cat._id);
      if (cat.name === 'Mega Hair') {
        categoryMap.set('Mega Hair Liso', cat._id);
        categoryMap.set('Mega Hair Ondulado', cat._id);
        categoryMap.set('Mega Hair Cacheado', cat._id);
        categoryMap.set('mega-hair-liso', cat._id);
        categoryMap.set('mega-hair-ondulado', cat._id);
        categoryMap.set('mega-hair-cacheado', cat._id);
      }
    });

    console.log(`📂 ${categoryMap.size} mapeamentos de categorias criados`);

    let updated = 0;
    let created = 0;
    let skipped = 0;

    console.log('\n🔄 Processando produtos...\n');

    for (const product of products) {
      const productName = product.name;
      const productPrice = product.pricing.discountPrice;

      if (!productPrice || productPrice === 0) {
        console.log(`⏭️  Pulando ${productName} - sem preço definido`);
        skipped++;
        continue;
      }

      // Buscar ID da categoria
      const categoryName = product.category;
      let categoryId = categoryName ? categoryMap.get(categoryName) : null;

      // Tentar variações do nome da categoria
      if (!categoryId && categoryName) {
        const categorySlug = categoryName.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[áàãâ]/g, 'a')
          .replace(/[éèê]/g, 'e')
          .replace(/[íì]/g, 'i')
          .replace(/[óòõô]/g, 'o')
          .replace(/[úù]/g, 'u')
          .replace(/ç/g, 'c');
        categoryId = categoryMap.get(categorySlug);
      }

      // Preparar dados do produto para MongoDB
      const productData: any = {
        name: productName,
        description: product.description || product.shortDesc || '',
        shortDescription: (product.shortDesc || product.description || '').substring(0, 200),
        sku: product.id,
        brand: product.brand || 'JC Hair Studio',
        price: productPrice,
        retailPrice: product.pricing.ourPrice || product.pricing.basePrice || productPrice * 1.3,
        professionalPrice: productPrice * 0.85,
        salePrice: productPrice,
        isOnSale: product.pricing.savings ? true : false,
        images: (product.images || []).map((img, index) => ({
          url: img.url,
          alt: img.alt || productName,
          isMain: index === 0,
          displayOrder: index
        })),
        stock: product.stockQuantity || 10,
        minStock: 3,
        weight: product.weight || 100,
        trackStock: true,
        characteristics: {},
        seo: {
          title: `${productName} | JC Hair Studio`,
          description: (product.shortDesc || product.description || '').substring(0, 160),
          keywords: product.tags || [productName.toLowerCase()],
          slug: product.slug
        },
        isActive: true,
        isVisible: product.inStock !== false,
        isFeatured: false,
        categoryIds: categoryId ? [categoryId] : [],
        tags: product.tags || [],
        videos: [],
        variants: [],
        hasVariants: false,
        dimensions: { length: 10, width: 10, height: 10 },
        averageRating: product.rating || 0,
        reviewCount: product.reviewsCount || 0,
        viewCount: 0,
        purchaseCount: 0,
        wishlistCount: 0,
        reviews: [],
        updatedAt: new Date()
      };

      // Tentar atualizar produto existente pelo SKU
      const existingProduct = await db.collection('products').findOne({ sku: product.id });

      if (existingProduct) {
        // Atualizar produto existente
        await db.collection('products').updateOne(
          { _id: existingProduct._id },
          {
            $set: {
              ...productData,
              createdAt: existingProduct.createdAt // Manter data de criação original
            }
          }
        );
        console.log(`✅ Atualizado: ${productName} - €${productPrice.toFixed(2)}`);
        updated++;
      } else {
        // Criar novo produto
        productData.createdAt = new Date();
        await db.collection('products').insertOne(productData);
        console.log(`➕ Criado: ${productName} - €${productPrice.toFixed(2)}`);
        created++;
      }
    }

    console.log('\n📊 RESUMO DA IMPORTAÇÃO:');
    console.log('=====================================');
    console.log(`✅ Produtos atualizados: ${updated}`);
    console.log(`➕ Produtos criados: ${created}`);
    console.log(`⏭️  Produtos pulados: ${skipped}`);
    console.log(`📦 Total processado: ${updated + created + skipped}/${products.length}`);

    console.log('\n🎉 Importação concluída com sucesso!');
    console.log('💰 Todos os preços foram atualizados para os valores do mercado europeu');

  } catch (error) {
    console.error('❌ Erro ao importar produtos:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 Conexão fechada');
    }
  }
}

// Executar importação
importEuropeanPricing();
