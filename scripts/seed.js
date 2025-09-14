const mongoose = require('mongoose');

// Configuração do MongoDB
const MONGODB_URI = 'mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/hairStudioBrasil?retryWrites=true&w=majority';

// Schemas
const ProductSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  description: { type: String, required: true },
  price: {
    retail: { type: Number, required: true },
    professional: { type: Number, required: true },
    promotional: Number,
    currency: { type: String, default: 'BRL' }
  },
  sizes: [{
    size: String,
    price: Number,
    stock: Number,
    barcode: String
  }],
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  stock: {
    available: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    minimum: { type: Number, default: 5 }
  },
  attributes: {
    benefits: [String],
    indications: [String],
    composition: [String],
    color: String,
    texture: String,
    finish: String,
    voltage: String,
    power: String
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    reviews: []
  },
  tags: [String],
  seo: {
    slug: { type: String, required: true, unique: true },
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  image: String,
  icon: String,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Produtos brasileiros reais
const products = [
  {
    sku: 'CAD-BC-1000',
    name: 'Brasil Cacau Smoothing Protein Treatment',
    brand: 'Cadiveu Professional',
    category: 'tratamento_capilar',
    subcategory: 'progressiva',
    description: 'Tratamento alisante com cana-de-açúcar Cysteine, cacau e D-panthenol. Sem formol, parabenos e ingredientes animais. Durabilidade de 3+ meses.',
    price: { retail: 268.52, professional: 222.27, promotional: 199.99 },
    sizes: [
      { size: '1000ml', price: 268.52, stock: 15, barcode: '7898963522341' },
      { size: '500ml', price: 149.90, stock: 25, barcode: '7898963522358' }
    ],
    images: [{ url: '/images/products/cadiveu-brasil-cacau.jpg', alt: 'Cadiveu Brasil Cacau', isPrimary: true }],
    stock: { available: 40, reserved: 5, minimum: 10 },
    attributes: {
      benefits: ['Alisamento máximo', 'Hidratação profunda', 'Reestruturação capilar', 'Durabilidade 3+ meses'],
      indications: ['Todos os tipos de cabelo', 'Compatível com coloração'],
      composition: ['Cysteine', 'Cacau', 'D-panthenol']
    },
    ratings: { average: 4.8, count: 324 },
    tags: ['progressiva', 'alisamento', 'cadiveu', 'profissional', 'sem formol', 'brasil'],
    seo: {
      slug: 'cadiveu-brasil-cacau-progressiva-1000ml',
      metaTitle: 'Cadiveu Brasil Cacau - Progressiva Sem Formol 1000ml',
      metaDescription: 'Progressiva Cadiveu Brasil Cacau com cacau e D-panthenol. Alisamento duradouro sem formol.',
      keywords: ['progressiva cadiveu', 'brasil cacau', 'alisamento sem formol']
    },
    featured: true
  },
  {
    sku: 'RISQ-DG-HIB',
    name: 'Esmalte Diamond Gel - Hibisco Rosa',
    brand: 'Risqué',
    category: 'esmaltes',
    subcategory: 'cremoso',
    description: 'Esmalte efeito gel com pincel de 800 cerdas para aplicação perfeita. Durabilidade superior e brilho intenso.',
    price: { retail: 14.93, professional: 12.50, promotional: 13.96 },
    sizes: [{ size: '9.5ml', price: 14.93, stock: 50, barcode: '7891350038224' }],
    images: [{ url: '/images/products/risque-hibisco-rosa.jpg', alt: 'Risqué Hibisco Rosa', isPrimary: true }],
    stock: { available: 50, reserved: 5, minimum: 15 },
    attributes: {
      color: 'Hibisco Rosa',
      texture: 'Cremoso',
      finish: 'Brilhante',
      benefits: ['Efeito gel', 'Longa duração', 'Secagem rápida']
    },
    ratings: { average: 4.7, count: 89 },
    tags: ['esmalte', 'risqué', 'diamond gel', 'rosa', 'cremoso', 'brasil'],
    seo: {
      slug: 'risque-esmalte-diamond-gel-hibisco-rosa',
      metaTitle: 'Risqué Diamond Gel Hibisco Rosa - Esmalte Efeito Gel',
      metaDescription: 'Esmalte Risqué Diamond Gel na cor Hibisco Rosa. Efeito gel com brilho intenso.',
      keywords: ['esmalte risqué', 'diamond gel', 'hibisco rosa']
    },
    featured: true
  },
  {
    sku: 'QDB-BASE-240F',
    name: 'Base Tô No Glow 240F',
    brand: 'Quem Disse Berenice?',
    category: 'maquiagem',
    subcategory: 'base',
    description: 'Base líquida com efeito radiante natural, cobertura média e hidratação sem oleosidade. Desenvolvida para a pele brasileira.',
    price: { retail: 69.90, professional: 55.00, promotional: 37.70 },
    sizes: [{ size: '30ml', price: 37.70, stock: 25, barcode: '7908229401324' }],
    images: [{ url: '/images/products/qdb-base-glow-240f.jpg', alt: 'Base Tô No Glow 240F', isPrimary: true }],
    stock: { available: 25, reserved: 3, minimum: 8 },
    attributes: {
      color: '240F',
      texture: 'Líquida',
      finish: 'Glow',
      benefits: ['Efeito radiante', 'Cobertura média', 'Hidratação']
    },
    ratings: { average: 4.5, count: 156 },
    tags: ['base', 'qdb', 'glow', 'maquiagem', 'pele radiante', 'brasil'],
    seo: {
      slug: 'qdb-base-to-no-glow-240f-pele-brasileira',
      metaTitle: 'QDB Base Tô No Glow 240F - Base Radiante Pele Brasileira',
      metaDescription: 'Base Quem Disse Berenice Tô No Glow tom 240F. Efeito radiante natural.',
      keywords: ['base qdb', 'tô no glow', '240f', 'base radiante']
    },
    featured: true
  },
  {
    sku: 'TAIFF-TOUR-2100',
    name: 'Secador Tourmaline Ion 2100W',
    brand: 'Taiff',
    category: 'ferramentas',
    subcategory: 'secador',
    description: 'Secador profissional com tecnologia íons negativos, tourmaline e cerâmica. Motor AC de longa durabilidade.',
    price: { retail: 639.00, professional: 520.00, promotional: 440.01 },
    sizes: [{ size: 'Único', price: 440.01, stock: 12, barcode: '7898483610234' }],
    images: [{ url: '/images/products/taiff-tourmaline-ion.jpg', alt: 'Taiff Tourmaline Ion 2100W', isPrimary: true }],
    stock: { available: 12, reserved: 2, minimum: 3 },
    attributes: {
      voltage: '127V',
      power: '2100W',
      benefits: ['Íons negativos', 'Tourmaline', 'Cerâmica', 'Cabo 3m']
    },
    ratings: { average: 4.8, count: 567 },
    tags: ['secador', 'taiff', 'profissional', '2100w', 'tourmaline', 'brasil'],
    seo: {
      slug: 'taiff-secador-tourmaline-ion-2100w-profissional',
      metaTitle: 'Taiff Tourmaline Ion 2100W - Secador Profissional',
      metaDescription: 'Secador Taiff Tourmaline Ion 2100W com íons negativos. Profissional para hair studio.',
      keywords: ['secador taiff', 'tourmaline ion', '2100w', 'secador profissional']
    },
    featured: true
  },
  {
    sku: 'LOREAL-ABS-500',
    name: 'Absolut Repair Gold Quinoa Shampoo',
    brand: "L'Oréal Professionnel",
    category: 'cuidados_diarios',
    subcategory: 'shampoo',
    description: 'Shampoo reparador com Gold Quinoa e proteínas. Repara e reestrutura a fibra capilar.',
    price: { retail: 236.90, professional: 190.00, promotional: 180.90 },
    sizes: [
      { size: '500ml', price: 180.90, stock: 20, barcode: '3474636975853' },
      { size: '250ml', price: 105.90, stock: 30, barcode: '3474636975846' }
    ],
    images: [{ url: '/images/products/loreal-absolut-repair-gold.jpg', alt: 'Absolut Repair Gold 500ml', isPrimary: true }],
    stock: { available: 50, reserved: 5, minimum: 15 },
    attributes: {
      benefits: ['77% mais reparado', '7x mais brilho', 'Reestrutura fibra'],
      indications: ['Cabelos danificados', 'Cabelos ressecados'],
      composition: ['Gold Quinoa', 'Proteínas']
    },
    ratings: { average: 4.8, count: 456 },
    tags: ['shampoo', 'loreal', 'reparador', 'profissional', 'quinoa'],
    seo: {
      slug: 'loreal-absolut-repair-gold-quinoa-shampoo-500ml',
      metaTitle: "L'Oréal Absolut Repair Gold Quinoa - Shampoo Reparador 500ml",
      metaDescription: 'Shampoo reparador LOréal com Gold Quinoa. Repara fibra capilar.',
      keywords: ['shampoo reparador', 'loreal profissional', 'gold quinoa']
    },
    featured: false
  }
];

const categories = [
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
      metaDescription: 'Progressivas, botox e tratamentos capilares das melhores marcas brasileiras.',
      keywords: ['progressiva brasil', 'botox capilar', 'tratamento profissional']
    }
  },
  {
    name: 'Esmaltes',
    slug: 'esmaltes',
    description: 'Esmaltes das marcas brasileiras mais amadas',
    order: 2,
    featured: true,
    image: '/images/categories/esmaltes.jpg',
    icon: '💅',
    seo: {
      metaTitle: 'Esmaltes Brasileiros - Risqué, Colorama, Dailus',
      metaDescription: 'Esmaltes das melhores marcas brasileiras.',
      keywords: ['esmalte risqué', 'esmalte colorama', 'esmalte brasileiro']
    }
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
      metaDescription: 'Maquiagens desenvolvidas para a pele brasileira.',
      keywords: ['maquiagem brasileira', 'base qdb', 'pele brasileira']
    }
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
      metaDescription: 'Secadores, chapinhas e equipamentos profissionais.',
      keywords: ['secador taiff', 'ferramentas profissionais']
    }
  },
  {
    name: 'Cuidados Diários',
    slug: 'cuidados_diarios',
    description: 'Shampoos, condicionadores e máscaras para uso diário',
    order: 5,
    featured: false,
    image: '/images/categories/cuidados-diarios.jpg',
    icon: '🧴'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    const Product = mongoose.model('Product', ProductSchema);
    const Category = mongoose.model('Category', CategorySchema);
    
    console.log('🗑️ Limpando dados existentes...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    
    console.log('📦 Inserindo categorias...');
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ ${insertedCategories.length} categorias inseridas`);
    
    console.log('🛍️ Inserindo produtos brasileiros...');
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ ${insertedProducts.length} produtos inseridos`);
    
    console.log('🎉 Seeding concluído com sucesso!');
    console.log(`📊 Total: ${insertedCategories.length} categorias, ${insertedProducts.length} produtos brasileiros`);
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro durante o seeding:', error);
    process.exit(1);
  }
}

seedDatabase();