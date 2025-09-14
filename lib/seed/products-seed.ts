import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleProducts = [
  {
    name: "Mega Hair Liso Loiro Platinado 613 - 50cm",
    slug: "mega-hair-liso-loiro-platinado-613-50cm",
    sku: "MH-613-50",
    description: "Extensão de cabelo 100% humano Remy europeu, loiro platinado 613 com 50cm de comprimento. Cutículas alinhadas, brilho natural e resistência máxima. Ideal para transformações dramáticas e colorimetria avançada.",
    shortDesc: "Mega hair loiro platinado 100% humano, 50cm, qualidade premium",
    price: 85.00,
    comparePrice: 120.00,
    sku: "MH-613-50",
    weight: 0.1,
    dimensions: "50cm x 2cm x 0.1cm",
    hairType: "STRAIGHT",
    hairTexture: "FINE",
    hairColor: "Loiro Platinado #613",
    length: 50,
    quantity: 25,
    status: "ACTIVE",
    isFeatured: true,
    metaTitle: "Mega Hair Loiro Platinado 613 - 50cm | JC Hair Studio",
    metaDescription: "Extensão de cabelo loiro platinado premium, 100% humano Remy europeu. Transforme seu visual com qualidade profissional.",
    images: [
      {
        url: "https://i.ibb.co/6c9qWqnq/613-1800x.webp",
        alt: "Mega Hair Loiro Platinado 613 - 50cm",
        title: "Mega Hair Loiro Platinado Premium",
        isMain: true,
        displayOrder: 0
      }
    ]
  },
  {
    name: "Mega Hair Liso Castanho Natural 1 - 55cm",
    slug: "mega-hair-liso-castanho-natural-1-55cm",
    sku: "MH-1-55",
    description: "Mega hair castanho natural premium brasileiro com 55cm de comprimento. Alta densidade 110g, movimento orgânico e compatibilidade perfeita com cabelos nativos. Ideal para volume e comprimento simultâneo.",
    shortDesc: "Mega hair castanho natural 100% humano, 55cm, alta densidade",
    price: 90.00,
    comparePrice: 130.00,
    weight: 0.11,
    dimensions: "55cm x 2cm x 0.1cm",
    hairType: "STRAIGHT",
    hairTexture: "MEDIUM",
    hairColor: "Castanho Natural #1",
    length: 55,
    quantity: 30,
    status: "ACTIVE",
    isFeatured: true,
    metaTitle: "Mega Hair Castanho Natural - 55cm | JC Hair Studio",
    metaDescription: "Extensão de cabelo castanho natural premium, 100% humano brasileiro. Volume e comprimento perfeitos.",
    images: [
      {
        url: "https://i.ibb.co/n8NDS1BB/1-8e322489-17fb-4397-842e-4e24610ea213-1800x.webp",
        alt: "Mega Hair Castanho Natural 1 - 55cm",
        title: "Mega Hair Castanho Natural Premium",
        isMain: true,
        displayOrder: 0
      }
    ]
  },
  {
    name: "Mega Hair Ondulado Natural 35cm - Bob Style",
    slug: "mega-hair-ondulado-natural-35cm-bob",
    sku: "MH-OND-35",
    description: "Ondas naturais Bob Style premium com padrão 2A suave e controlado. Perfeito para cortes modernos, movimento natural que valoriza o rosto com manutenção simples e resultado sempre elegante.",
    shortDesc: "Mega hair ondulado Bob Style, 35cm, padrão 2A suave",
    price: 60.00,
    comparePrice: 85.00,
    weight: 0.07,
    dimensions: "35cm x 2cm x 0.1cm",
    hairType: "WAVY",
    hairTexture: "MEDIUM",
    hairColor: "Castanho Ondulado #6",
    length: 35,
    quantity: 20,
    status: "ACTIVE",
    isFeatured: false,
    metaTitle: "Mega Hair Ondulado Bob Style - 35cm | JC Hair Studio",
    metaDescription: "Extensão de cabelo ondulado natural, padrão 2A, perfeito para cortes Bob modernos.",
    images: [
      {
        url: "https://i.ibb.co/hPZVQ0x/35-Cms-1800x.webp",
        alt: "Mega Hair Ondulado Natural 35cm - Bob Style",
        title: "Mega Hair Ondulado Bob Style",
        isMain: true,
        displayOrder: 0
      }
    ]
  },
  {
    name: "Mega Hair Cacheado Natural 5 - 40cm",
    slug: "mega-hair-cacheado-natural-5-40cm",
    sku: "MH-CACH-40",
    description: "Cachos autênticos 3B profissionais com definição perfeita sem ressecamento. Movimento tridimensional natural ideal para cabelos cacheados nativos com resultado harmonioso garantido.",
    shortDesc: "Mega hair cacheado 3B, 40cm, cachos autênticos",
    price: 70.00,
    comparePrice: 95.00,
    weight: 0.08,
    dimensions: "40cm x 2cm x 0.1cm",
    hairType: "CURLY",
    hairTexture: "COARSE",
    hairColor: "Castanho Cacheado #5",
    length: 40,
    quantity: 15,
    status: "ACTIVE",
    isFeatured: false,
    metaTitle: "Mega Hair Cacheado Natural - 40cm | JC Hair Studio",
    metaDescription: "Extensão de cabelo cacheado 3B natural, definição perfeita para cabelos cacheados.",
    images: [
      {
        url: "https://i.ibb.co/Q7VXH4qK/Cabelo-5-1800x.webp",
        alt: "Mega Hair Cacheado Natural 5 - 40cm",
        title: "Mega Hair Cacheado Natural 3B",
        isMain: true,
        displayOrder: 0
      }
    ]
  },
  {
    name: "Mega Hair Liso Preto Premium 3 - 55cm",
    slug: "mega-hair-liso-preto-premium-3-55cm",
    sku: "MH-3-55",
    description: "Preto premium sedoso com densidade máxima e brilho espelhado diamond. Cor sólida e duradoura, base perfeita para técnicas de iluminação e mechas contrastantes com autenticidade total garantida.",
    shortDesc: "Mega hair preto premium sedoso, 55cm, densidade máxima",
    price: 90.00,
    comparePrice: 125.00,
    weight: 0.11,
    dimensions: "55cm x 2cm x 0.1cm",
    hairType: "STRAIGHT",
    hairTexture: "FINE",
    hairColor: "Preto Premium #3",
    length: 55,
    quantity: 25,
    status: "ACTIVE",
    isFeatured: true,
    metaTitle: "Mega Hair Preto Premium - 55cm | JC Hair Studio",
    metaDescription: "Extensão de cabelo preto premium sedoso, brilho diamante, densidade máxima.",
    images: [
      {
        url: "https://i.ibb.co/RG65nmty/Cabelo-3-0182f1c5-3a8d-4dbb-8703-d1057f162b16-1800x.webp",
        alt: "Mega Hair Liso Preto Premium 3 - 55cm",
        title: "Mega Hair Preto Premium Sedoso",
        isMain: true,
        displayOrder: 0
      }
    ]
  },
  {
    name: "Mega Hair Liso Ruivo Natural 16 - 45cm",
    slug: "mega-hair-liso-ruivo-natural-16-45cm",
    sku: "MH-16-45",
    description: "Ruivo natural vibrante exclusivo com tom quente intenso e pigmentação rica e duradoura. Raridade no mercado ideal para personalidades marcantes e looks únicos que se destacam.",
    shortDesc: "Mega hair ruivo natural vibrante, 45cm, tom quente exclusivo",
    price: 80.00,
    comparePrice: 110.00,
    weight: 0.09,
    dimensions: "45cm x 2cm x 0.1cm",
    hairType: "STRAIGHT",
    hairTexture: "MEDIUM",
    hairColor: "Ruivo Natural #16",
    length: 45,
    quantity: 10,
    status: "ACTIVE",
    isFeatured: false,
    metaTitle: "Mega Hair Ruivo Natural - 45cm | JC Hair Studio",
    metaDescription: "Extensão de cabelo ruivo natural vibrante, tom exclusivo para looks únicos.",
    images: [
      {
        url: "https://i.ibb.co/VpDVrJNV/Cabelo-16-8c14b06a-6a45-4eb4-bb2b-b4e3a2f94fa8-1800x.webp",
        alt: "Mega Hair Liso Ruivo Natural 16 - 45cm",
        title: "Mega Hair Ruivo Natural Vibrante",
        isMain: true,
        displayOrder: 0
      }
    ]
  },
  {
    name: "Mega Hair Liso Gold Premium 30 - 75cm",
    slug: "mega-hair-liso-gold-premium-30-75cm",
    sku: "MH-GOLD-75",
    description: "Coleção GOLD exclusiva Master Class com comprimento extra premium 75cm. Densidade superior e tecnologia anti-quebra. Produto estrela para transformações dramáticas e eventos especiais.",
    shortDesc: "Mega hair Gold Premium, 75cm, coleção exclusiva Master Class",
    price: 145.00,
    comparePrice: 200.00,
    weight: 0.15,
    dimensions: "75cm x 2cm x 0.1cm",
    hairType: "STRAIGHT",
    hairTexture: "FINE",
    hairColor: "Dourado Premium #30",
    length: 75,
    quantity: 8,
    status: "ACTIVE",
    isFeatured: true,
    metaTitle: "Mega Hair Gold Premium - 75cm | JC Hair Studio",
    metaDescription: "Extensão de cabelo coleção Gold exclusiva, 75cm premium para transformações dramáticas.",
    images: [
      {
        url: "https://i.ibb.co/VY0RjYCn/Cabelo-30-4cb5aee5-24f8-4286-8165-532f5bae9cab-1800x.webp",
        alt: "Mega Hair Liso Gold Premium 30 - 75cm",
        title: "Mega Hair Coleção Gold Premium",
        isMain: true,
        displayOrder: 0
      }
    ]
  },
  {
    name: "Mega Hair Rapunzel Collection 24 - 90cm",
    slug: "mega-hair-rapunzel-collection-24-90cm",
    sku: "MH-RAPUNZEL-90",
    description: "Coleção Rapunzel exclusiva com comprimento extremo de 90cm. Nossa peça mais exclusiva para transformações dramáticas e looks de impacto. Qualidade Master Class incomparável.",
    shortDesc: "Mega hair Rapunzel Collection, 90cm, comprimento extremo exclusivo",
    price: 190.00,
    comparePrice: 250.00,
    weight: 0.18,
    dimensions: "90cm x 2cm x 0.1cm",
    hairType: "STRAIGHT",
    hairTexture: "MEDIUM",
    hairColor: "Castanho Rapunzel #24",
    length: 90,
    quantity: 5,
    status: "ACTIVE",
    isFeatured: true,
    metaTitle: "Mega Hair Rapunzel Collection - 90cm | JC Hair Studio",
    metaDescription: "Extensão de cabelo Rapunzel exclusiva, 90cm de comprimento extremo para looks dramáticos.",
    images: [
      {
        url: "https://i.ibb.co/zVr48cdN/Cabelo-24-1800x.webp",
        alt: "Mega Hair Rapunzel Collection 24 - 90cm",
        title: "Mega Hair Rapunzel Collection Exclusiva",
        isMain: true,
        displayOrder: 0
      }
    ]
  }
]

const sampleCategories = [
  {
    name: "Mega Hair Liso",
    slug: "mega-hair-liso",
    description: "Extensões de cabelo liso 100% natural, diversos comprimentos e cores"
  },
  {
    name: "Mega Hair Ondulado", 
    slug: "mega-hair-ondulado",
    description: "Extensões de cabelo ondulado natural, padrões 2A, 2B e 2C"
  },
  {
    name: "Mega Hair Cacheado",
    slug: "mega-hair-cacheado", 
    description: "Extensões de cabelo cacheado natural, padrões 3A, 3B e 4A"
  },
  {
    name: "Coleções Especiais",
    slug: "colecoes-especiais",
    description: "Coleções exclusivas e edições limitadas premium"
  }
]

export async function seedProducts() {
  console.log('🌱 Seeding products and categories...')
  
  // Create categories first
  const createdCategories = []
  for (const category of sampleCategories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    })
    createdCategories.push(createdCategory)
    console.log(`✓ Category created: ${createdCategory.name}`)
  }
  
  // Create products
  for (const productData of sampleProducts) {
    const { images, ...product } = productData
    
    // Determine category based on hair type
    let categoryId = createdCategories[0].id // default to liso
    if (product.hairType === 'WAVY') {
      categoryId = createdCategories[1].id
    } else if (product.hairType === 'CURLY') {
      categoryId = createdCategories[2].id
    } else if (product.name.includes('Gold') || product.name.includes('Rapunzel')) {
      categoryId = createdCategories[3].id
    }
    
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...product,
        images: {
          deleteMany: {},
          create: images
        },
        categories: {
          deleteMany: {},
          create: [{ categoryId }]
        }
      },
      create: {
        ...product,
        images: {
          create: images
        },
        categories: {
          create: [{ categoryId }]
        }
      }
    })
    
    console.log(`✓ Product created: ${createdProduct.name}`)
  }
  
  console.log('🎉 Products seed completed!')
}

export async function clearProducts() {
  console.log('🧹 Clearing products and categories...')
  
  await prisma.productImage.deleteMany()
  await prisma.productCategory.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  
  console.log('✓ Products and categories cleared!')
}

if (require.main === module) {
  seedProducts()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}