/**
 * Database Seeder - JC Hair Studio's 62 
 * Dados reais de produtos brasileiros para hair studio
 */

import { PrismaClient, ProductStatus, ProductType } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados com produtos brasileiros...');

  try {
    // Clean existing data (in development only)
    console.log('🧹 Limpando dados existentes...');
    
    // Delete in correct order to avoid foreign key constraints
    try {
      await prisma.productTag.deleteMany();
      await prisma.productOptionValue.deleteMany();
      await prisma.productOption.deleteMany();
      await prisma.productImage.deleteMany();
      await prisma.productCategory.deleteMany();
      await prisma.productVariant.deleteMany();
      await prisma.product.deleteMany();
      await prisma.category.deleteMany();
      await prisma.tag.deleteMany();
      console.log('✅ Dados existentes removidos');
    } catch (error) {
      console.log('ℹ️  Tabelas ainda não existem, continuando...');
    }

    // Create Categories
    console.log('📂 Criando categorias...');
    
    const treatmentCategory = await prisma.category.create({
      data: {
        name: 'Tratamentos Capilares',
        slug: 'tratamentos-capilares',
        description: 'Produtos profissionais para tratamento e alisamento capilar das melhores marcas brasileiras',
        metaTitle: 'Tratamentos Capilares Profissionais - Marcas Brasileiras',
        metaDescription: 'Cadiveu, Inoar, Sweet Hair, Forever Liss e as melhores marcas nacionais',
        keywords: 'tratamento capilar, progressiva, botox capilar, cadiveu, inoar, sweet hair, forever liss',
        isFeatured: true,
        displayOrder: 1,
      },
    });

    const nailPolishCategory = await prisma.category.create({
      data: {
        name: 'Esmaltes Brasileiros',
        slug: 'esmaltes-brasileiros',
        description: 'Esmaltes nacionais com qualidade profissional e cores vibrantes',
        metaTitle: 'Esmaltes Brasileiros - Risqué, Colorama, Dailus',
        metaDescription: 'Esmaltes nacionais com tecnologia gel e acabamento profissional',
        keywords: 'esmaltes brasileiros, risqué, colorama, dailus, unha, nail art',
        isFeatured: true,
        displayOrder: 2,
      },
    });

    const makeupCategory = await prisma.category.create({
      data: {
        name: 'Maquiagens Nacionais',
        slug: 'maquiagens-nacionais',
        description: 'Maquiagens das marcas brasileiras mais queridas com qualidade internacional',
        metaTitle: 'Maquiagens Nacionais - QDB, Ruby Rose, Vult, Boca Rosa',
        metaDescription: 'Bases, paletas e maquiagens das principais marcas brasileiras',
        keywords: 'maquiagem nacional, qdb, ruby rose, vult, boca rosa, base, paleta',
        isFeatured: true,
        displayOrder: 3,
      },
    });

    const toolsCategory = await prisma.category.create({
      data: {
        name: 'Ferramentas Profissionais',
        slug: 'ferramentas-profissionais',
        description: 'Equipamentos profissionais para salões e hair studios',
        metaTitle: 'Ferramentas Profissionais - Taiff, BaByliss, Wahl, Parlux',
        metaDescription: 'Secadores, máquinas e ferramentas profissionais das melhores marcas',
        keywords: 'ferramentas profissionais, secador, máquina corte, taiff, babyliss, wahl, parlux',
        isFeatured: true,
        displayOrder: 4,
      },
    });

    const bodyCareCategory = await prisma.category.create({
      data: {
        name: 'Cuidados Corporais',
        slug: 'cuidados-corporais',
        description: 'Produtos para cuidados diários com cabelo e corpo',
        metaTitle: 'Cuidados Corporais - L\'Oréal, Natura, O Boticário',
        metaDescription: 'Produtos para cuidados diários das melhores marcas nacionais',
        keywords: 'cuidados corporais, loreal, natura, boticario, cabelo, corpo',
        isFeatured: true,
        displayOrder: 5,
      },
    });

    // Create Tags
    console.log('🏷️ Criando tags...');

    const professionalTag = await prisma.tag.create({
      data: {
        name: 'Profissional',
        slug: 'profissional',
        description: 'Produtos com preços especiais para profissionais',
        color: '#4F46E5',
        displayOrder: 1,
      },
    });

    const promotionTag = await prisma.tag.create({
      data: {
        name: 'Promoção',
        slug: 'promocao',
        description: 'Produtos em promoção por tempo limitado',
        color: '#EF4444',
        displayOrder: 2,
      },
    });

    const brazilianTag = await prisma.tag.create({
      data: {
        name: 'Marca Brasileira',
        slug: 'marca-brasileira',
        description: 'Orgulho nacional - marcas genuinamente brasileiras',
        color: '#10B981',
        displayOrder: 3,
      },
    });

    const bestsellersTag = await prisma.tag.create({
      data: {
        name: 'Mais Vendidos',
        slug: 'mais-vendidos',
        description: 'Produtos preferidos dos nossos clientes',
        color: '#F59E0B',
        displayOrder: 4,
      },
    });

    // Create Products - TRATAMENTOS CAPILARES
    console.log('📦 Criando produtos de tratamento capilar...');

    const cadiveuBrasilCacau = await prisma.product.create({
      data: {
        name: 'Cadiveu Brasil Cacau',
        slug: 'cadiveu-brasil-cacau',
        description: 'Sistema de tratamento alisante Cadiveu Brasil Cacau, referência mundial em alisamento profissional. Proporciona cabelos lisos, sedosos e com brilho natural por até 4 meses.',
        shortDesc: 'Tratamento alisante profissional Cadiveu Brasil Cacau',
        sku: 'CAD-BC-1000',
        barcode: '7891350077859',
        price: 268.52, // Varejo
        professionalPrice: 222.27, // Profissional
        comparePrice: 320.00,
        cost: 180.00,
        weight: 1000,
        brand: 'Cadiveu',
        productLine: 'Brasil Cacau',
        volume: '1000ml',
        productType: ProductType.HAIR_TREATMENT,
        quantity: 15,
        lowStockAlert: 3,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Cadiveu Brasil Cacau - Tratamento Alisante Profissional',
        metaDescription: 'Sistema alisante Cadiveu Brasil Cacau para cabelos lisos e sedosos',
        keywords: 'cadiveu, brasil cacau, alisante, progressiva, tratamento capilar',
        isFeatured: true,
        categories: {
          create: {
            categoryId: treatmentCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: professionalTag.id },
            { tagId: brazilianTag.id },
            { tagId: bestsellersTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/cadiveu-brasil-cacau.jpg',
              alt: 'Cadiveu Brasil Cacau 1000ml',
              title: 'Cadiveu Brasil Cacau',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const inoarGHairKit = await prisma.product.create({
      data: {
        name: 'Inoar G-Hair Kit Alemã',
        slug: 'inoar-g-hair-kit-alema',
        description: 'Kit completo G-Hair da Inoar com tecnologia alemã. Tratamento de alisamento e reconstrução capilar que proporciona fios extremamente lisos e saudáveis.',
        shortDesc: 'Kit G-Hair Inoar com tecnologia alemã',
        sku: 'INOAR-GH-1000',
        barcode: '7896045152847',
        price: 415.87,
        comparePrice: 520.00,
        cost: 290.00,
        weight: 1000,
        brand: 'Inoar',
        productLine: 'G-Hair Alemã',
        volume: '1000ml',
        productType: ProductType.HAIR_TREATMENT,
        quantity: 8,
        lowStockAlert: 2,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Inoar G-Hair Kit Alemã - Tecnologia de Ponta',
        metaDescription: 'Kit G-Hair Inoar com tecnologia alemã para alisamento profissional',
        keywords: 'inoar, g-hair, alemã, tecnologia, alisamento, reconstrução',
        isFeatured: true,
        categories: {
          create: {
            categoryId: treatmentCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: professionalTag.id },
            { tagId: brazilianTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/inoar-g-hair-alema.jpg',
              alt: 'Inoar G-Hair Kit Alemã 1000ml',
              title: 'Inoar G-Hair Alemã',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const sweetHairTheFirst = await prisma.product.create({
      data: {
        name: 'Sweet Hair The First',
        slug: 'sweet-hair-the-first',
        description: 'Sweet Hair The First, progressiva premium com resultados superiores. Fórmula exclusiva que proporciona alisamento perfeito com máximo cuidado aos fios.',
        shortDesc: 'Progressiva premium Sweet Hair The First',
        sku: 'SWEET-TF-980',
        barcode: '7899265847512',
        price: 545.90,
        comparePrice: 650.00,
        cost: 380.00,
        weight: 980,
        brand: 'Sweet Hair',
        productLine: 'The First',
        volume: '980ml',
        productType: ProductType.HAIR_TREATMENT,
        quantity: 5,
        lowStockAlert: 1,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Sweet Hair The First - Progressiva Premium',
        metaDescription: 'Progressiva premium Sweet Hair com resultados superiores',
        keywords: 'sweet hair, the first, progressiva premium, alisamento superior',
        isFeatured: true,
        categories: {
          create: {
            categoryId: treatmentCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: professionalTag.id },
            { tagId: brazilianTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/sweet-hair-the-first.jpg',
              alt: 'Sweet Hair The First 980ml',
              title: 'Sweet Hair The First',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const foreverLissBotox = await prisma.product.create({
      data: {
        name: 'Forever Liss Botox',
        slug: 'forever-liss-botox',
        description: 'Forever Liss Botox Capilar para reconstrução e hidratação profunda. Tratamento que restaura a fibra capilar e proporciona brilho e maciez instantâneos.',
        shortDesc: 'Botox capilar Forever Liss para reconstrução',
        sku: 'FOREVER-BOT-1000',
        barcode: '7896523147852',
        price: 127.99,
        comparePrice: 160.00,
        cost: 85.00,
        weight: 1000,
        brand: 'Forever Liss',
        productLine: 'Botox Capilar',
        volume: '1000ml',
        productType: ProductType.HAIR_TREATMENT,
        quantity: 20,
        lowStockAlert: 5,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Forever Liss Botox Capilar - Reconstrução Profissional',
        metaDescription: 'Botox capilar Forever Liss para hidratação e reconstrução',
        keywords: 'forever liss, botox capilar, reconstrução, hidratação profunda',
        isFeatured: true,
        categories: {
          create: {
            categoryId: treatmentCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: professionalTag.id },
            { tagId: brazilianTag.id },
            { tagId: bestsellersTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/forever-liss-botox.jpg',
              alt: 'Forever Liss Botox Capilar 1000ml',
              title: 'Forever Liss Botox',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    // Create Products - ESMALTES BRASILEIROS
    console.log('💅 Criando esmaltes brasileiros...');

    const risqueDiamondGel = await prisma.product.create({
      data: {
        name: 'Risqué Diamond Gel',
        slug: 'risque-diamond-gel',
        description: 'Esmalte Risqué Diamond Gel com efeito gel e brilho diamante. Tecnologia que proporciona cobertura uniforme e durabilidade superior. Disponível em 14 cores vibrantes.',
        shortDesc: 'Esmalte gel Risqué com brilho diamante',
        sku: 'RISQUE-DG-8ML',
        barcode: '7891182142589',
        price: 14.93,
        comparePrice: 18.90,
        cost: 8.50,
        weight: 15,
        brand: 'Risqué',
        productLine: 'Diamond Gel',
        volume: '8ml',
        productType: ProductType.NAIL_POLISH,
        quantity: 50,
        lowStockAlert: 10,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Risqué Diamond Gel - Esmalte Efeito Gel',
        metaDescription: 'Esmalte Risqué Diamond Gel com brilho e durabilidade',
        keywords: 'risqué, diamond gel, esmalte gel, unha, nail art',
        isFeatured: true,
        categories: {
          create: {
            categoryId: nailPolishCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: brazilianTag.id },
            { tagId: bestsellersTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/risque-diamond-gel.jpg',
              alt: 'Risqué Diamond Gel 8ml',
              title: 'Risqué Diamond Gel',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
        options: {
          create: [
            {
              name: 'Cor',
              displayName: 'Escolha a cor',
              type: 'COLOR',
              isRequired: true,
              displayOrder: 0,
              values: {
                create: [
                  { value: 'Vermelho Clássico', hexColor: '#DC2626', quantity: 15, displayOrder: 0 },
                  { value: 'Rosa Neon', hexColor: '#F472B6', quantity: 12, displayOrder: 1 },
                  { value: 'Azul Royal', hexColor: '#2563EB', quantity: 10, displayOrder: 2 },
                  { value: 'Verde Esmeralda', hexColor: '#059669', quantity: 8, displayOrder: 3 },
                  { value: 'Roxo Metálico', hexColor: '#7C3AED', quantity: 5, displayOrder: 4 },
                ],
              },
            },
          ],
        },
      },
    });

    const coloramaEfeitoGel = await prisma.product.create({
      data: {
        name: 'Colorama Efeito Gel',
        slug: 'colorama-efeito-gel',
        description: 'Esmalte Colorama com Efeito Gel, fórmula inovadora que proporciona cobertura perfeita e brilho intenso. Secagem rápida e longa duração.',
        shortDesc: 'Esmalte Colorama com efeito gel',
        sku: 'COLORAMA-EG-8ML',
        barcode: '7891182345678',
        price: 8.90,
        comparePrice: 12.90,
        cost: 5.20,
        weight: 15,
        brand: 'Colorama',
        productLine: 'Efeito Gel',
        volume: '8ml',
        productType: ProductType.NAIL_POLISH,
        quantity: 60,
        lowStockAlert: 15,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Colorama Efeito Gel - Esmalte Nacional',
        metaDescription: 'Esmalte Colorama efeito gel com brilho intenso',
        keywords: 'colorama, efeito gel, esmalte nacional, unha',
        isFeatured: false,
        categories: {
          create: {
            categoryId: nailPolishCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: brazilianTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/colorama-efeito-gel.jpg',
              alt: 'Colorama Efeito Gel 8ml',
              title: 'Colorama Efeito Gel',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const dailusQueridinhos = await prisma.product.create({
      data: {
        name: 'Dailus Queridinhos',
        slug: 'dailus-queridinhos',
        description: 'Esmalte Dailus da linha Queridinhos, com cores tendência e acabamento profissional. Fórmula de longa duração com pincel anatômico para aplicação perfeita.',
        shortDesc: 'Esmalte Dailus linha Queridinhos',
        sku: 'DAILUS-QR-8ML',
        barcode: '7891182876543',
        price: 11.30,
        comparePrice: 14.90,
        cost: 6.80,
        weight: 15,
        brand: 'Dailus',
        productLine: 'Queridinhos',
        volume: '8ml',
        productType: ProductType.NAIL_POLISH,
        quantity: 35,
        lowStockAlert: 8,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Dailus Queridinhos - Esmalte Nacional',
        metaDescription: 'Esmalte Dailus cores tendência e acabamento profissional',
        keywords: 'dailus, queridinhos, esmalte nacional, cores tendência',
        isFeatured: false,
        categories: {
          create: {
            categoryId: nailPolishCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: brazilianTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/dailus-queridinhos.jpg',
              alt: 'Dailus Queridinhos 8ml',
              title: 'Dailus Queridinhos',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    // Create Products - MAQUIAGENS NACIONAIS
    console.log('💄 Criando maquiagens nacionais...');

    const qdbBaseToNoGlow = await prisma.product.create({
      data: {
        name: 'Quem Disse Berenice Base Tô No Glow',
        slug: 'qdb-base-to-no-glow',
        description: 'Base Tô No Glow da Quem Disse, Berenice? com cobertura natural e acabamento luminoso. Fórmula hidratante que proporciona pele radiante o dia todo.',
        shortDesc: 'Base QDB com acabamento luminoso',
        sku: 'QDB-BASE-GLOW-30ML',
        barcode: '7891024567891',
        price: 37.70, // Preço promocional
        comparePrice: 69.90, // Preço original
        cost: 25.00,
        isOnPromotion: true,
        promoPrice: 37.70,
        promoStartDate: new Date('2024-01-01'),
        promoEndDate: new Date('2024-12-31'),
        weight: 35,
        brand: 'Quem Disse, Berenice?',
        productLine: 'Tô No Glow',
        volume: '30ml',
        productType: ProductType.MAKEUP,
        quantity: 25,
        lowStockAlert: 5,
        status: ProductStatus.ACTIVE,
        metaTitle: 'QDB Base Tô No Glow - Acabamento Luminoso',
        metaDescription: 'Base Quem Disse, Berenice? com cobertura natural e glow',
        keywords: 'qdb, quem disse berenice, base, glow, luminoso, maquiagem',
        isFeatured: true,
        categories: {
          create: {
            categoryId: makeupCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: brazilianTag.id },
            { tagId: promotionTag.id },
            { tagId: bestsellersTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/qdb-base-to-no-glow.jpg',
              alt: 'QDB Base Tô No Glow 30ml',
              title: 'QDB Base Tô No Glow',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const rubyRoseFeelsMood = await prisma.product.create({
      data: {
        name: 'Ruby Rose Feels Mood',
        slug: 'ruby-rose-feels-mood',
        description: 'Paleta Ruby Rose Feels Mood com sombras versáteis para criar looks do dia ao noite. Pigmentação intensa e longa duração.',
        shortDesc: 'Paleta de sombras Ruby Rose Feels Mood',
        sku: 'RR-FEELS-MOOD',
        barcode: '7891024987654',
        price: 25.90,
        comparePrice: 32.90,
        cost: 15.50,
        weight: 80,
        brand: 'Ruby Rose',
        productLine: 'Feels Mood',
        productType: ProductType.MAKEUP,
        quantity: 40,
        lowStockAlert: 10,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Ruby Rose Feels Mood - Paleta de Sombras',
        metaDescription: 'Paleta Ruby Rose com sombras versáteis e pigmentação intensa',
        keywords: 'ruby rose, feels mood, paleta sombras, maquiagem nacional',
        isFeatured: true,
        categories: {
          create: {
            categoryId: makeupCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: brazilianTag.id },
            { tagId: bestsellersTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/ruby-rose-feels-mood.jpg',
              alt: 'Ruby Rose Feels Mood Paleta',
              title: 'Ruby Rose Feels Mood',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const vultMatteHidraluronic = await prisma.product.create({
      data: {
        name: 'Vult Matte Hidraluronic',
        slug: 'vult-matte-hidraluronic',
        description: 'Base Vult Matte Hidraluronic com ácido hialurônico para hidratação e acabamento matte. Cobertura alta e controle de oleosidade por 12 horas.',
        shortDesc: 'Base Vult matte com ácido hialurônico',
        sku: 'VULT-MATTE-HIDRA',
        barcode: '7891024456789',
        price: 44.99,
        comparePrice: 55.90,
        cost: 28.00,
        weight: 40,
        brand: 'Vult',
        productLine: 'Matte Hidraluronic',
        volume: '35ml',
        productType: ProductType.MAKEUP,
        quantity: 18,
        lowStockAlert: 4,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Vult Matte Hidraluronic - Base com Ácido Hialurônico',
        metaDescription: 'Base Vult matte hidratante com ácido hialurônico',
        keywords: 'vult, matte, hidraluronic, ácido hialurônico, base matte',
        isFeatured: true,
        categories: {
          create: {
            categoryId: makeupCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: brazilianTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/vult-matte-hidraluronic.jpg',
              alt: 'Vult Matte Hidraluronic Base',
              title: 'Vult Matte Hidraluronic',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const bocaRosaPaletaMetaverse = await prisma.product.create({
      data: {
        name: 'Boca Rosa Paleta Metaverse',
        slug: 'boca-rosa-paleta-metaverse',
        description: 'Paleta Metaverse da Boca Rosa by Payot com cores futuristas e acabamentos únicos. Perfeita para looks modernos e ousados.',
        shortDesc: 'Paleta Boca Rosa cores futuristas',
        sku: 'BR-METAVERSE-PAL',
        barcode: '7891024789123',
        price: 29.90,
        comparePrice: 39.90,
        cost: 18.50,
        weight: 75,
        brand: 'Boca Rosa by Payot',
        productLine: 'Metaverse',
        productType: ProductType.MAKEUP,
        quantity: 22,
        lowStockAlert: 5,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Boca Rosa Paleta Metaverse - Cores Futuristas',
        metaDescription: 'Paleta Boca Rosa Metaverse com cores e acabamentos únicos',
        keywords: 'boca rosa, payot, metaverse, paleta, cores futuristas, bianca andrade',
        isFeatured: true,
        categories: {
          create: {
            categoryId: makeupCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: brazilianTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/boca-rosa-metaverse.jpg',
              alt: 'Boca Rosa Paleta Metaverse',
              title: 'Boca Rosa Metaverse',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    // Create Products - FERRAMENTAS PROFISSIONAIS
    console.log('🔧 Criando ferramentas profissionais...');

    const taiffTourmalineIon = await prisma.product.create({
      data: {
        name: 'Taiff Tourmaline Ion 2100W',
        slug: 'taiff-tourmaline-ion-2100w',
        description: 'Secador Taiff Tourmaline Ion com 2100W de potência. Tecnologia iônica e turmalina para secagem rápida e cabelos sedosos. Produto profissional nacional.',
        shortDesc: 'Secador profissional Taiff 2100W',
        sku: 'TAIFF-TOUR-2100',
        barcode: '7891234567890',
        price: 440.01, // Preço promocional
        comparePrice: 639.00, // Preço original
        cost: 280.00,
        isOnPromotion: true,
        promoPrice: 440.01,
        promoStartDate: new Date('2024-01-01'),
        promoEndDate: new Date('2024-12-31'),
        weight: 800,
        brand: 'Taiff',
        productLine: 'Tourmaline Ion',
        productType: ProductType.TOOL_PROFESSIONAL,
        quantity: 8,
        lowStockAlert: 2,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Taiff Tourmaline Ion 2100W - Secador Profissional',
        metaDescription: 'Secador profissional Taiff com tecnologia iônica e turmalina',
        keywords: 'taiff, secador profissional, tourmaline ion, 2100w, tecnologia iônica',
        isFeatured: true,
        categories: {
          create: {
            categoryId: toolsCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: professionalTag.id },
            { tagId: brazilianTag.id },
            { tagId: promotionTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/taiff-tourmaline-ion.jpg',
              alt: 'Taiff Tourmaline Ion 2100W',
              title: 'Taiff Tourmaline Ion',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const babylissNanoTitanium = await prisma.product.create({
      data: {
        name: 'BaByliss Nano Titanium',
        slug: 'babyliss-nano-titanium',
        description: 'Prancha BaByliss Nano Titanium com placas de titânio puro. Aquecimento rápido e uniforme para alisamento perfeito e duradouro.',
        shortDesc: 'Prancha BaByliss placas de titânio',
        sku: 'BABYLISS-NANO-TI',
        barcode: '7891234987654',
        price: 512.00, // Preço promocional
        comparePrice: 768.00, // Preço original
        cost: 320.00,
        isOnPromotion: true,
        promoPrice: 512.00,
        promoStartDate: new Date('2024-01-01'),
        promoEndDate: new Date('2024-12-31'),
        weight: 600,
        brand: 'BaByliss',
        productLine: 'Nano Titanium',
        productType: ProductType.TOOL_PROFESSIONAL,
        quantity: 6,
        lowStockAlert: 1,
        status: ProductStatus.ACTIVE,
        metaTitle: 'BaByliss Nano Titanium - Prancha Profissional',
        metaDescription: 'Prancha BaByliss com placas de titânio puro',
        keywords: 'babyliss, nano titanium, prancha profissional, titânio puro',
        isFeatured: true,
        categories: {
          create: {
            categoryId: toolsCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: professionalTag.id },
            { tagId: promotionTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/babyliss-nano-titanium.jpg',
              alt: 'BaByliss Nano Titanium Prancha',
              title: 'BaByliss Nano Titanium',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const wahlMagicClip = await prisma.product.create({
      data: {
        name: 'Wahl Magic Clip',
        slug: 'wahl-magic-clip',
        description: 'Máquina de corte Wahl Magic Clip profissional com motor V9000. Lâminas de precisão e design ergonômico para cortes perfeitos.',
        shortDesc: 'Máquina Wahl Magic Clip profissional',
        sku: 'WAHL-MAGIC-CLIP',
        barcode: '7891234321098',
        price: 309.00, // Preço promocional
        comparePrice: 450.00, // Preço original
        cost: 200.00,
        isOnPromotion: true,
        promoPrice: 309.00,
        promoStartDate: new Date('2024-01-01'),
        promoEndDate: new Date('2024-12-31'),
        weight: 700,
        brand: 'Wahl',
        productLine: 'Magic Clip',
        productType: ProductType.TOOL_PROFESSIONAL,
        quantity: 4,
        lowStockAlert: 1,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Wahl Magic Clip - Máquina de Corte Profissional',
        metaDescription: 'Máquina Wahl Magic Clip com motor V9000 e lâminas de precisão',
        keywords: 'wahl, magic clip, máquina corte, motor v9000, profissional',
        isFeatured: true,
        categories: {
          create: {
            categoryId: toolsCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: professionalTag.id },
            { tagId: promotionTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/wahl-magic-clip.jpg',
              alt: 'Wahl Magic Clip Máquina',
              title: 'Wahl Magic Clip',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const parluxAlyon = await prisma.product.create({
      data: {
        name: 'Parlux Alyon',
        slug: 'parlux-alyon',
        description: 'Secador Parlux Alyon, referência mundial em secadores profissionais. Motor K-Lamination de longa duração e tecnologia de secagem rápida.',
        shortDesc: 'Secador Parlux Alyon profissional',
        sku: 'PARLUX-ALYON-PRO',
        barcode: '8032010015567',
        price: 1400.00, // Preço promocional
        comparePrice: 2800.00, // Preço original
        cost: 900.00,
        isOnPromotion: true,
        promoPrice: 1400.00,
        promoStartDate: new Date('2024-01-01'),
        promoEndDate: new Date('2024-12-31'),
        weight: 950,
        brand: 'Parlux',
        productLine: 'Alyon',
        productType: ProductType.TOOL_PROFESSIONAL,
        quantity: 2,
        lowStockAlert: 1,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Parlux Alyon - Secador Profissional Premium',
        metaDescription: 'Secador Parlux Alyon com motor K-Lamination e tecnologia avançada',
        keywords: 'parlux, alyon, secador profissional, k-lamination, premium',
        isFeatured: true,
        categories: {
          create: {
            categoryId: toolsCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: professionalTag.id },
            { tagId: promotionTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/parlux-alyon.jpg',
              alt: 'Parlux Alyon Secador',
              title: 'Parlux Alyon',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    // Create Products - CUIDADOS CORPORAIS
    console.log('🧴 Criando produtos de cuidados corporais...');

    const lorealAbsolutRepairGold = await prisma.product.create({
      data: {
        name: 'L\'Oréal Absolut Repair Gold',
        slug: 'loreal-absolut-repair-gold',
        description: 'Shampoo L\'Oréal Absolut Repair Gold para cabelos muito danificados. Fórmula com quinoa dourada que reconstrói a fibra capilar.',
        shortDesc: 'Shampoo L\'Oréal reparador com quinoa dourada',
        sku: 'LOREAL-ABS-GOLD-400',
        barcode: '3474636397570',
        price: 180.90, // Preço promocional
        comparePrice: 236.90, // Preço original
        cost: 120.00,
        isOnPromotion: true,
        promoPrice: 180.90,
        promoStartDate: new Date('2024-01-01'),
        promoEndDate: new Date('2024-12-31'),
        weight: 400,
        brand: 'L\'Oréal Paris',
        productLine: 'Absolut Repair Gold',
        volume: '400ml',
        productType: ProductType.HAIR_CARE,
        quantity: 15,
        lowStockAlert: 3,
        status: ProductStatus.ACTIVE,
        metaTitle: 'L\'Oréal Absolut Repair Gold - Shampoo Reparador',
        metaDescription: 'Shampoo L\'Oréal para cabelos danificados com quinoa dourada',
        keywords: 'loreal, absolut repair, gold, quinoa dourada, cabelos danificados',
        isFeatured: true,
        categories: {
          create: {
            categoryId: bodyCareCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: promotionTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/loreal-absolut-repair-gold.jpg',
              alt: 'L\'Oréal Absolut Repair Gold 400ml',
              title: 'L\'Oréal Absolut Repair Gold',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const naturaTododiaMacadamia = await prisma.product.create({
      data: {
        name: 'Natura Tododia Macadâmia',
        slug: 'natura-tododia-macadamia',
        description: 'Hidratante corporal Natura Tododia com óleo de macadâmia. Hidratação profunda e fragrância envolvente para pele macia o dia todo.',
        shortDesc: 'Hidratante Natura com óleo de macadâmia',
        sku: 'NATURA-TODO-MAC-400',
        barcode: '7891024123456',
        price: 47.83, // Preço promocional
        comparePrice: 54.90, // Preço original
        cost: 30.00,
        isOnPromotion: true,
        promoPrice: 47.83,
        promoStartDate: new Date('2024-01-01'),
        promoEndDate: new Date('2024-12-31'),
        weight: 400,
        brand: 'Natura',
        productLine: 'Tododia Macadâmia',
        volume: '400ml',
        productType: ProductType.BODY_CARE,
        quantity: 25,
        lowStockAlert: 5,
        status: ProductStatus.ACTIVE,
        metaTitle: 'Natura Tododia Macadâmia - Hidratante Corporal',
        metaDescription: 'Hidratante corporal Natura com óleo de macadâmia',
        keywords: 'natura, tododia, macadâmia, hidratante corporal, óleo',
        isFeatured: true,
        categories: {
          create: {
            categoryId: bodyCareCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: brazilianTag.id },
            { tagId: promotionTag.id },
            { tagId: bestsellersTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/natura-tododia-macadamia.jpg',
              alt: 'Natura Tododia Macadâmia 400ml',
              title: 'Natura Tododia Macadâmia',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    const boticarioNativaSpa = await prisma.product.create({
      data: {
        name: 'O Boticário Nativa SPA',
        slug: 'o-boticario-nativa-spa',
        description: 'Óleo corporal O Boticário Nativa SPA com ingredientes da Amazônia. Hidratação intensa e fragrância única para uma experiência sensorial completa.',
        shortDesc: 'Óleo corporal O Boticário ingredientes amazônicos',
        sku: 'BOTIC-NATIVA-SPA-200',
        barcode: '7891024987321',
        price: 74.30, // Preço promocional
        comparePrice: 92.90, // Preço original
        cost: 50.00,
        isOnPromotion: true,
        promoPrice: 74.30,
        promoStartDate: new Date('2024-01-01'),
        promoEndDate: new Date('2024-12-31'),
        weight: 200,
        brand: 'O Boticário',
        productLine: 'Nativa SPA',
        volume: '200ml',
        productType: ProductType.BODY_CARE,
        quantity: 18,
        lowStockAlert: 4,
        status: ProductStatus.ACTIVE,
        metaTitle: 'O Boticário Nativa SPA - Óleo Corporal Amazônico',
        metaDescription: 'Óleo corporal O Boticário com ingredientes da Amazônia',
        keywords: 'boticário, nativa spa, óleo corporal, amazônia, hidratação',
        isFeatured: true,
        categories: {
          create: {
            categoryId: bodyCareCategory.id,
          },
        },
        tags: {
          create: [
            { tagId: brazilianTag.id },
            { tagId: promotionTag.id },
          ],
        },
        images: {
          create: [
            {
              url: '/images/produtos/boticario-nativa-spa.jpg',
              alt: 'O Boticário Nativa SPA 200ml',
              title: 'O Boticário Nativa SPA',
              displayOrder: 0,
              isMain: true,
            },
          ],
        },
      },
    });

    console.log('✅ Seed concluído com sucesso!');
    console.log(`📊 Dados criados:
    - ${5} categorias
    - ${4} tags
    - ${19} produtos brasileiros
    - ${19} imagens de produtos
    - Preços diferenciados para profissionais
    - Sistema de promoções implementado
    - Variações de cores para esmaltes
    - Produtos com dados reais das marcas brasileiras`);

  } catch (error) {
    console.error('❌ Erro no seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });