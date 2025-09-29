#!/usr/bin/env npx tsx

import { connectDB } from '../lib/mongodb/connection';
import { Product } from '../lib/models/Product';
import { Category } from '../lib/models/Category';

async function verifySeeding() {
  try {
    await connectDB();
    console.log('🔍 Verificando dados no MongoDB...');

    // Count products and categories
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();

    console.log(`📊 Total de produtos: ${productCount}`);
    console.log(`📊 Total de categorias: ${categoryCount}`);

    // Get sample products
    const sampleProducts = await Product.find().limit(5).select('sku name brand category subcategory');
    console.log('\n📦 Exemplos de produtos:');
    sampleProducts.forEach(product => {
      console.log(`   - ${product.sku}: ${product.name} (${product.brand}) - ${product.category}/${product.subcategory}`);
    });

    // Get products by category
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📈 Produtos por categoria:');
    productsByCategory.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} produtos`);
    });

    // Get products by brand
    const productsByBrand = await Product.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    console.log('\n🏷️ Top 10 marcas:');
    productsByBrand.forEach(brand => {
      console.log(`   ${brand._id}: ${brand.count} produtos`);
    });

    // Get categories
    const categories = await Category.find().select('name slug featured');
    console.log('\n📂 Categorias:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug}) ${cat.featured ? '⭐' : ''}`);
    });

    console.log('\n✅ Verificação concluída!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erro na verificação:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  verifySeeding();
}

export default verifySeeding;