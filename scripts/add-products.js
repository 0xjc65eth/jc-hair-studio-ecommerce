const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/?retryWrites=true&w=majority&appName=JCHairCluster';
const dbName = 'jc-hair-studio-ecommerce';

const newProducts = [
  {
    name: 'Mega Hair Liso Castanho Natural 1 - 55cm',
    description: 'Mega hair castanho natural premium brasileiro com 55cm de comprimento. Alta densidade 110g, movimento orgânico e compatibilidade perfeita com cabelos nativos.',
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
      length: '55'
    },
    seo: {
      title: 'Mega Hair Castanho Natural - 55cm | JC Hair Studio',
      description: 'Extensão de cabelo castanho natural premium, 100% humano brasileiro.',
      keywords: ['mega hair castanho', 'cabelo natural', 'extensões brasileiras'],
      slug: 'mega-hair-liso-castanho-natural-1-55cm'
    },
    isActive: true,
    isVisible: true,
    isFeatured: true,
    categorySlug: 'mega-hair-liso',
    brandId: 'jc-hair-studio',
    tags: [],
    videos: [],
    variants: [],
    hasVariants: false,
    dimensions: { length: 55, width: 5, height: 1 },
    averageRating: 0,
    reviewCount: 0,
    viewCount: 0,
    purchaseCount: 0,
    wishlistCount: 0,
    reviews: []
  },
  {
    name: 'Mega Hair Ondulado Natural 6 - 45cm',
    description: 'Mega hair ondulado textura 2B, cor castanho médio natural. Movimento fluido e natural.',
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
      length: '45'
    },
    seo: {
      title: 'Mega Hair Ondulado Castanho - 45cm | JC Hair Studio',
      description: 'Extensão ondulada natural, textura 2B perfeita para volume com movimento.',
      keywords: ['mega hair ondulado', 'cabelo ondulado', 'textura natural'],
      slug: 'mega-hair-ondulado-natural-6-45cm'
    },
    isActive: true,
    isVisible: true,
    isFeatured: true,
    categorySlug: 'mega-hair-ondulado',
    brandId: 'jc-hair-studio',
    tags: [],
    videos: [],
    variants: [],
    hasVariants: false,
    dimensions: { length: 45, width: 5, height: 1 },
    averageRating: 0,
    reviewCount: 0,
    viewCount: 0,
    purchaseCount: 0,
    wishlistCount: 0,
    reviews: []
  }
];

async function addProducts() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB');
    
    const db = client.db(dbName);
    
    // Buscar categorias existentes
    const categories = await db.collection('categories').find({}).toArray();
    console.log('📂 Categorias encontradas:', categories.length);
    
    // Criar mapa de categorias por slug
    const categoryMap = new Map();
    categories.forEach(cat => categoryMap.set(cat.slug, cat._id));
    
    // Adicionar produtos
    for (const product of newProducts) {
      const categoryId = categoryMap.get(product.categorySlug);
      if (!categoryId) {
        console.log(`⚠️ Categoria não encontrada: ${product.categorySlug}`);
        continue;
      }
      
      const { categorySlug, ...productData } = product;
      productData.categoryIds = [categoryId];
      productData.createdAt = new Date();
      productData.updatedAt = new Date();
      
      try {
        const result = await db.collection('products').insertOne(productData);
        console.log(`✅ Produto criado: ${product.name}`);
      } catch (error) {
        console.log(`❌ Erro ao criar produto ${product.name}:`, error.message);
      }
    }
    
    console.log('🎉 Processo concluído!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await client.close();
  }
}

addProducts();