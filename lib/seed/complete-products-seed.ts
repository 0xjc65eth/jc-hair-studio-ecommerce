import { PrismaClient } from '@prisma/client';
import productsData from '@/lib/data/products-complete.json';

const prisma = new PrismaClient();

// Create categories from JSON data
async function seedCategories() {
  console.log('🏷️  Creating categories...');
  
  const createdCategories = [];
  
  for (const categoryData of productsData.categories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {
        name: categoryData.name,
        description: categoryData.description
      },
      create: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description
      }
    });
    
    createdCategories.push(category);
    console.log(`✓ Category created: ${category.name}`);
  }
  
  return createdCategories;
}

// Create products from JSON data
async function seedProducts(categories: any[]) {
  console.log('📦 Creating products...');
  
  let productCount = 0;
  
  for (const categoryData of productsData.categories) {
    // Find the corresponding category in the database
    const category = categories.find(c => c.slug === categoryData.slug);
    
    if (!category) {
      console.warn(`⚠️  Category not found: ${categoryData.slug}`);
      continue;
    }
    
    for (const productData of categoryData.products) {
      try {
        // Prepare product data for Prisma
        const productInput = {
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          shortDesc: productData.shortDesc,
          sku: productData.sku,
          price: productData.price,
          comparePrice: productData.comparePrice || null,
          cost: productData.price * 0.6, // Assuming 40% margin
          weight: productData.weight / 1000, // Convert to kg
          length: null,
          hairType: getHairType(productData.category),
          hairTexture: getHairTexture(productData.tags),
          hairColor: null,
          hairOrigin: 'BRAZIL',
          quantity: productData.stockQuantity,
          lowStockAlert: Math.ceil(productData.stockQuantity * 0.2),
          status: productData.inStock ? 'ACTIVE' : 'OUT_OF_STOCK',
          metaTitle: `${productData.name} | JC Hair Studio's 62`,
          metaDescription: productData.shortDesc,
          keywords: productData.tags.join(', '),
          isFeatured: productData.labels.includes('DESTAQUE') || productData.labels.includes('BEST SELLER'),
          brand: productData.brand
        };

        // Create or update the product
        const product = await prisma.product.upsert({
          where: { slug: productData.slug },
          update: {
            ...productInput,
            images: {
              deleteMany: {},
              create: productData.images.map((img, index) => ({
                url: img.url,
                alt: img.alt,
                title: productData.name,
                isMain: img.isMain,
                displayOrder: index
              }))
            },
            categories: {
              deleteMany: {},
              create: [{ categoryId: category.id }]
            }
          },
          create: {
            ...productInput,
            images: {
              create: productData.images.map((img, index) => ({
                url: img.url,
                alt: img.alt,
                title: productData.name,
                isMain: img.isMain,
                displayOrder: index
              }))
            },
            categories: {
              create: [{ categoryId: category.id }]
            }
          }
        });

        // Create variants if they exist
        if (productData.variants && productData.variants.length > 0) {
          await prisma.productVariant.deleteMany({
            where: { productId: product.id }
          });

          for (const variantData of productData.variants) {
            await prisma.productVariant.create({
              data: {
                productId: product.id,
                name: variantData.size || variantData.shade || 'Default',
                sku: `${productData.sku}-${variantData.size || variantData.shade || 'VAR'}`,
                size: variantData.size || null,
                color: variantData.shade || null,
                price: variantData.price || productData.price,
                comparePrice: productData.comparePrice || null,
                quantity: variantData.stock,
                isDefault: !variantData.size && !variantData.shade
              }
            });
          }
        }

        // Create sample reviews for popular products
        if (productData.reviewsCount > 0) {
          await createSampleReviews(product.id, productData.rating, productData.reviewsCount);
        }

        productCount++;
        console.log(`✓ Product created: ${product.name} (${product.brand})`);
        
      } catch (error) {
        console.error(`❌ Error creating product ${productData.name}:`, error);
      }
    }
  }
  
  return productCount;
}

// Helper function to map category to hair type
function getHairType(category: string) {
  if (category.includes('Ferramentas') || category.includes('Maquiagem')) {
    return null;
  }
  
  // Default to STRAIGHT for hair products
  return 'STRAIGHT';
}

// Helper function to determine hair texture from tags
function getHairTexture(tags: string[]) {
  if (tags.some(tag => tag.includes('fino') || tag.includes('fine'))) {
    return 'FINE';
  }
  if (tags.some(tag => tag.includes('grosso') || tag.includes('thick'))) {
    return 'COARSE';
  }
  return 'MEDIUM';
}

// Create sample reviews for products
async function createSampleReviews(productId: string, rating: number, reviewCount: number) {
  const sampleReviews = [
    {
      rating: 5,
      title: "Produto excelente!",
      comment: "Superou minhas expectativas. Qualidade profissional e resultado duradouro.",
      userName: "Maria Silva",
      verified: true
    },
    {
      rating: 4,
      title: "Muito bom",
      comment: "Produto de qualidade, entrega rápida e embalagem perfeita.",
      userName: "Ana Costa",
      verified: true
    },
    {
      rating: 5,
      title: "Recomendo!",
      comment: "Já é o segundo que compro. Qualidade excepcional pelo preço.",
      userName: "Juliana Santos",
      verified: false
    },
    {
      rating: 4,
      title: "Satisfeita",
      comment: "Produto conforme descrito. Boa relação custo-benefício.",
      userName: "Carla Oliveira",
      verified: true
    }
  ];

  // Create a subset of reviews based on the review count
  const reviewsToCreate = Math.min(sampleReviews.length, Math.ceil(reviewCount / 20));
  
  for (let i = 0; i < reviewsToCreate; i++) {
    const review = sampleReviews[i];
    
    try {
      await prisma.review.create({
        data: {
          productId,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          reviewerName: review.userName,
          reviewerEmail: `${review.userName.toLowerCase().replace(' ', '.')}@email.com`,
          isVerifiedPurchase: review.verified,
          status: 'APPROVED'
        }
      });
    } catch (error) {
      // Ignore duplicate review errors
      if (!error.message.includes('Unique constraint')) {
        console.warn(`⚠️  Could not create review for product ${productId}:`, error.message);
      }
    }
  }
}

// Create sample tags
async function seedTags() {
  console.log('🏷️  Creating tags...');
  
  const commonTags = [
    'profissional', 'premium', 'natural', 'orgânico', 'sem formol',
    'hidratante', 'nutritivo', 'reconstrutivo', 'anti-frizz', 'brilho',
    'longa duração', 'cabelos cacheados', 'cabelos lisos', 'todos os tipos',
    'salon quality', 'vegano', 'cruelty free', 'tecnologia avançada'
  ];

  for (const tagName of commonTags) {
    try {
      await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: {
          name: tagName,
          slug: tagName.toLowerCase().replace(/\s+/g, '-')
        }
      });
    } catch (error) {
      console.warn(`⚠️  Could not create tag ${tagName}:`, error.message);
    }
  }
  
  console.log(`✓ Created ${commonTags.length} tags`);
}

// Main seeding function
export async function seedCompleteProducts() {
  try {
    console.log('🌱 Starting complete product seeding...');
    console.log(`📊 Total products to create: ${productsData.categories.reduce((sum, cat) => sum + cat.products.length, 0)}`);
    
    // Create categories
    const categories = await seedCategories();
    
    // Create tags
    await seedTags();
    
    // Create products
    const productCount = await seedProducts(categories);
    
    console.log('🎉 Complete product seeding finished!');
    console.log(`📈 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Total images: ${productsData.categories.reduce((sum, cat) => sum + cat.products.reduce((pSum, p) => pSum + p.images.length, 0), 0)}`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Clear existing data
export async function clearCompleteProducts() {
  console.log('🧹 Clearing existing product data...');
  
  try {
    // Delete in correct order due to foreign key constraints
    await prisma.productVariant.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.tag.deleteMany();
    
    console.log('✓ All product data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}

// CLI execution
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'clear') {
    clearCompleteProducts()
      .then(() => console.log('✅ Data cleared successfully'))
      .catch(console.error)
      .finally(() => prisma.$disconnect());
  } else {
    seedCompleteProducts()
      .then(() => console.log('✅ Seeding completed successfully'))
      .catch(console.error)
      .finally(() => prisma.$disconnect());
  }
}