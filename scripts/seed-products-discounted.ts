import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB_NAME || 'jc-hair-studio-ecommerce';

// Produtos com preços atualizados -10%
const productsWithDiscount = [
  // Tratamentos Capilares
  {
    sku: 'CAD-BC-1000',
    name: 'Cadiveu Brasil Cacau Smoothing Protein Treatment',
    slug: 'cadiveu-brasil-cacau-progressiva-1000ml',
    brand: 'Cadiveu Professional',
    category: 'tratamento-capilar',
    subcategory: 'progressiva',
    description: 'Tratamento alisante com cana-de-açúcar Cysteine, cacau e D-panthenol. Sem formol, parabenos e ingredientes animais. Durabilidade de 3+ meses.',
    price: 241.67, // -10% de 268.52
    originalPrice: 268.52,
    discount: 10,
    sizes: ['1000ml'],
    stock: 15,
    images: ['/images/products/cadiveu-brasil-cacau.jpg'],
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sku: 'CAD-BC-500',
    name: 'Cadiveu Brasil Cacau 500ml',
    slug: 'cadiveu-brasil-cacau-500ml',
    brand: 'Cadiveu Professional',
    category: 'tratamento-capilar',
    subcategory: 'progressiva',
    description: 'Versão 500ml do tratamento alisante Cadiveu Brasil Cacau.',
    price: 134.91, // -10% de 149.90
    originalPrice: 149.90,
    discount: 10,
    sizes: ['500ml'],
    stock: 25,
    images: ['/images/products/cadiveu-brasil-cacau-500ml.jpg'],
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sku: 'INOAR-GH-1000',
    name: 'Kit Escova Progressiva Alemã G-Hair',
    slug: 'inoar-g-hair-escova-progressiva-alema-kit',
    brand: 'Inoar/G.Hair',
    category: 'tratamento-capilar',
    subcategory: 'progressiva',
    description: 'Fórmula alemã com queratina e óleo de cacau, 0,2% formol. Kit completo com 3 produtos para ação instantânea.',
    price: 374.28, // -10% de 415.87
    originalPrice: 415.87,
    discount: 10,
    sizes: ['Kit 3x1000ml'],
    stock: 10,
    images: ['/images/products/inoar-g-hair-kit.jpg'],
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sku: 'SWEET-TF-980',
    name: 'The First Liso Intenso Shampoo Alisante',
    slug: 'sweet-hair-the-first-shampoo-alisante-980ml',
    brand: 'Sweet Hair Professional',
    category: 'tratamento-capilar',
    subcategory: 'progressiva',
    description: 'Primeiro shampoo alisante do mundo com blend de 5 ácidos. Livre de formol, alisa em uma única lavagem.',
    price: 491.31, // -10% de 545.90
    originalPrice: 545.90,
    discount: 10,
    sizes: ['980ml'],
    stock: 8,
    images: ['/images/products/sweet-hair-the-first.jpg'],
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sku: 'FOREVER-BOT-1000',
    name: 'Forever Liss Botox Capilar Zero Formol',
    slug: 'forever-liss-botox-capilar-zero-formol-1kg',
    brand: 'Forever Liss Professional',
    category: 'tratamento-capilar',
    subcategory: 'botox',
    description: '100% livre de formol, com óleo de argan, coco e manteiga de karité. Redução de 90% do volume.',
    price: 115.19, // -10% de 127.99
    originalPrice: 127.99,
    discount: 10,
    sizes: ['1kg'],
    stock: 20,
    images: ['/images/products/forever-liss-botox-zero.jpg'],
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sku: 'FOREVER-BOT-250',
    name: 'Forever Liss Botox Capilar 250g',
    slug: 'forever-liss-botox-capilar-250g',
    brand: 'Forever Liss Professional',
    category: 'tratamento-capilar',
    subcategory: 'botox',
    description: 'Versão 250g do Botox Capilar Forever Liss.',
    price: 35.01, // -10% de 38.90
    originalPrice: 38.90,
    discount: 10,
    sizes: ['250g'],
    stock: 30,
    images: ['/images/products/forever-liss-botox-250g.jpg'],
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Maquiagem
  {
    sku: 'QDB-BASE-240F',
    name: 'Base Tô No Glow 240F',
    slug: 'qdb-base-to-no-glow-240f',
    brand: 'Quem Disse Berenice?',
    category: 'maquiagem',
    subcategory: 'base',
    description: 'Base líquida com efeito radiante natural, cobertura média e hidratação sem oleosidade.',
    price: 62.91, // -10% de 69.90
    originalPrice: 69.90,
    discount: 10,
    sizes: ['30ml'],
    stock: 25,
    images: ['/images/products/qdb-base-glow-240f.jpg'],
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sku: 'RUBY-FEELS-MD',
    name: 'Base Fluída Feels Mood',
    slug: 'ruby-rose-base-fluida-feels-mood',
    brand: 'Ruby Rose',
    category: 'maquiagem',
    subcategory: 'base',
    description: 'Base fluída com tons adaptados para pele brasileira, textura leve e cobertura natural.',
    price: 23.31, // -10% de 25.90
    originalPrice: 25.90,
    discount: 10,
    sizes: ['30ml'],
    stock: 30,
    images: ['/images/products/ruby-rose-feels-mood.jpg'],
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Ferramentas
  {
    sku: 'TAIFF-TOUR-2100',
    name: 'Secador Tourmaline Ion 2100W',
    slug: 'taiff-secador-tourmaline-ion-2100w',
    brand: 'Taiff',
    category: 'ferramentas',
    subcategory: 'secador',
    description: 'Secador profissional com tecnologia íons negativos, tourmaline e cerâmica. Motor AC de longa durabilidade.',
    price: 575.10, // -10% de 639.00
    originalPrice: 639.00,
    discount: 10,
    sizes: ['Único'],
    stock: 12,
    images: ['/images/products/taiff-tourmaline-ion.jpg'],
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sku: 'BABY-NANO-2091',
    name: 'Prancha Nano Titanium',
    slug: 'babyliss-prancha-nano-titanium',
    brand: 'BaByliss PRO',
    category: 'ferramentas',
    subcategory: 'chapinha',
    description: 'Prancha profissional com placas de titânio 32mm, temperatura até 230°C, display LED digital.',
    price: 691.20, // -10% de 768.00
    originalPrice: 768.00,
    discount: 10,
    sizes: ['Único'],
    stock: 8,
    images: ['/images/products/babyliss-nano-titanium.jpg'],
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Cuidados Diários
  {
    sku: 'LOREAL-ABS-500',
    name: 'Absolut Repair Gold Quinoa Shampoo 500ml',
    slug: 'loreal-absolut-repair-gold-quinoa-500ml',
    brand: "L'Oréal Professionnel",
    category: 'cuidados-diarios',
    subcategory: 'shampoo',
    description: 'Shampoo reparador com Gold Quinoa e proteínas. Repara e reestrutura a fibra capilar.',
    price: 213.21, // -10% de 236.90
    originalPrice: 236.90,
    discount: 10,
    sizes: ['500ml'],
    stock: 20,
    images: ['/images/products/loreal-absolut-repair-gold.jpg'],
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sku: 'LOREAL-ABS-250',
    name: 'Absolut Repair Gold Quinoa Shampoo 250ml',
    slug: 'loreal-absolut-repair-gold-quinoa-250ml',
    brand: "L'Oréal Professionnel",
    category: 'cuidados-diarios',
    subcategory: 'shampoo',
    description: 'Versão 250ml do shampoo reparador Absolut Repair.',
    price: 95.31, // -10% de 105.90
    originalPrice: 105.90,
    discount: 10,
    sizes: ['250ml'],
    stock: 30,
    images: ['/images/products/loreal-absolut-repair-250ml.jpg'],
    featured: false,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Categorias
const categories = [
  {
    name: 'Tratamentos Capilares',
    slug: 'tratamento-capilar',
    description: 'Progressivas, botox capilar e tratamentos profissionais',
    featured: true,
    order: 1,
    active: true
  },
  {
    name: 'Maquiagem',
    slug: 'maquiagem',
    description: 'Bases, produtos para pele e maquiagem profissional',
    featured: true,
    order: 2,
    active: true
  },
  {
    name: 'Ferramentas Profissionais',
    slug: 'ferramentas',
    description: 'Secadores, pranchas e equipamentos profissionais',
    featured: true,
    order: 3,
    active: true
  },
  {
    name: 'Cuidados Diários',
    slug: 'cuidados-diarios',
    description: 'Shampoos, condicionadores e produtos para uso diário',
    featured: false,
    order: 4,
    active: true
  }
];

async function seedDatabase() {
  let client: MongoClient | null = null;

  try {
    console.log('🔗 Conectando ao MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    console.log(`✅ Conectado ao banco de dados: ${DB_NAME}`);

    // Limpar coleções existentes
    console.log('🧹 Limpando dados antigos...');
    await db.collection('products').deleteMany({});
    await db.collection('categories').deleteMany({});

    // Inserir categorias
    console.log('📦 Inserindo categorias...');
    await db.collection('categories').insertMany(categories);
    console.log(`✅ ${categories.length} categorias inseridas`);

    // Inserir produtos com preços atualizados
    console.log('🛍️ Inserindo produtos com desconto de 10%...');
    await db.collection('products').insertMany(productsWithDiscount);
    console.log(`✅ ${productsWithDiscount.length} produtos inseridos com sucesso!`);

    // Mostrar resumo dos preços
    console.log('\n📊 RESUMO DOS NOVOS PREÇOS (-10%):');
    console.log('=====================================');
    productsWithDiscount.forEach(product => {
      console.log(`✅ ${product.name}`);
      console.log(`   Antes: R$ ${product.originalPrice.toFixed(2)}`);
      console.log(`   AGORA: R$ ${product.price.toFixed(2)} (-10%)`);
      console.log('');
    });

    console.log('🎉 Seed concluído com sucesso!');
    console.log('📱 Acesse http://localhost:3001 para ver os novos preços');

  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔒 Conexão fechada');
    }
  }
}

// Executar seed
seedDatabase();