#!/usr/bin/env npx tsx

import { connectDB } from '../lib/mongodb/connection';
import { Product } from '../lib/models/Product';
import { Category } from '../lib/models/Category';

async function viewProducts() {
  try {
    await connectDB();
    console.log('🔍 Conectado ao MongoDB - Visualizando produtos...\n');

    // Menu de opções
    const args = process.argv.slice(2);
    const option = args[0] || 'summary';

    switch (option) {
      case 'all':
        await showAllProducts();
        break;
      case 'category':
        const category = args[1];
        if (!category) {
          console.log('❌ Especifique a categoria: npm run view-products category maquiagem');
          return;
        }
        await showProductsByCategory(category);
        break;
      case 'brand':
        const brand = args[1];
        if (!brand) {
          console.log('❌ Especifique a marca: npm run view-products brand "Mari Maria"');
          return;
        }
        await showProductsByBrand(brand);
        break;
      case 'search':
        const searchTerm = args[1];
        if (!searchTerm) {
          console.log('❌ Especifique o termo: npm run view-products search "base"');
          return;
        }
        await searchProducts(searchTerm);
        break;
      case 'featured':
        await showFeaturedProducts();
        break;
      default:
        await showSummary();
        break;
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

async function showSummary() {
  console.log('📊 RESUMO GERAL\n');

  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();

  console.log(`Total de produtos: ${totalProducts}`);
  console.log(`Total de categorias: ${totalCategories}\n`);

  // Produtos por categoria
  const byCategory = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  console.log('📂 PRODUTOS POR CATEGORIA:');
  byCategory.forEach(cat => {
    console.log(`   ${cat._id}: ${cat.count} produtos`);
  });

  // Top marcas
  const byBrand = await Product.aggregate([
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  console.log('\n🏷️ TOP 10 MARCAS:');
  byBrand.forEach(brand => {
    console.log(`   ${brand._id}: ${brand.count} produtos`);
  });

  console.log('\n💡 OPÇÕES DISPONÍVEIS:');
  console.log('   npx tsx scripts/view-products.ts all');
  console.log('   npx tsx scripts/view-products.ts category maquiagem');
  console.log('   npx tsx scripts/view-products.ts brand "Mari Maria"');
  console.log('   npx tsx scripts/view-products.ts search "base"');
  console.log('   npx tsx scripts/view-products.ts featured');
}

async function showAllProducts() {
  console.log('📦 TODOS OS PRODUTOS\n');

  const products = await Product.find()
    .select('sku name brand category subcategory stock.available featured')
    .sort({ createdAt: -1 })
    .limit(50);

  products.forEach((product, index) => {
    const featured = product.featured ? '⭐' : '  ';
    const stock = product.stock?.available || 0;
    console.log(`${(index + 1).toString().padStart(3, ' ')}. ${featured} ${product.sku} - ${product.name}`);
    console.log(`     Marca: ${product.brand} | Categoria: ${product.category}/${product.subcategory} | Estoque: ${stock}`);
    console.log('');
  });

  if (products.length === 50) {
    console.log('... (mostrando apenas os primeiros 50 produtos)');
  }
}

async function showProductsByCategory(category: string) {
  console.log(`📂 PRODUTOS DA CATEGORIA: ${category.toUpperCase()}\n`);

  const products = await Product.find({ category })
    .select('sku name brand subcategory stock.available featured')
    .sort({ name: 1 });

  if (products.length === 0) {
    console.log('❌ Nenhum produto encontrado nesta categoria');

    // Mostrar categorias disponíveis
    const categories = await Product.distinct('category');
    console.log('\n📂 Categorias disponíveis:');
    categories.forEach(cat => console.log(`   - ${cat}`));
    return;
  }

  products.forEach((product, index) => {
    const featured = product.featured ? '⭐' : '  ';
    const stock = product.stock?.available || 0;
    console.log(`${(index + 1).toString().padStart(3, ' ')}. ${featured} ${product.name}`);
    console.log(`     SKU: ${product.sku} | Marca: ${product.brand} | Estoque: ${stock}`);
    console.log('');
  });

  console.log(`\n📊 Total: ${products.length} produtos na categoria ${category}`);
}

async function showProductsByBrand(brand: string) {
  console.log(`🏷️ PRODUTOS DA MARCA: ${brand.toUpperCase()}\n`);

  const products = await Product.find({
    brand: { $regex: brand, $options: 'i' }
  })
    .select('sku name category subcategory stock.available featured')
    .sort({ name: 1 });

  if (products.length === 0) {
    console.log('❌ Nenhum produto encontrado desta marca');

    // Mostrar marcas disponíveis
    const brands = await Product.distinct('brand');
    console.log('\n🏷️ Marcas disponíveis:');
    brands.sort().forEach(brandName => console.log(`   - ${brandName}`));
    return;
  }

  products.forEach((product, index) => {
    const featured = product.featured ? '⭐' : '  ';
    const stock = product.stock?.available || 0;
    console.log(`${(index + 1).toString().padStart(3, ' ')}. ${featured} ${product.name}`);
    console.log(`     SKU: ${product.sku} | Categoria: ${product.category} | Estoque: ${stock}`);
    console.log('');
  });

  console.log(`\n📊 Total: ${products.length} produtos da marca ${brand}`);
}

async function searchProducts(searchTerm: string) {
  console.log(`🔍 BUSCA: "${searchTerm}"\n`);

  const products = await Product.find({
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { brand: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  })
    .select('sku name brand category stock.available featured')
    .sort({ name: 1 })
    .limit(30);

  if (products.length === 0) {
    console.log('❌ Nenhum produto encontrado com este termo');
    return;
  }

  products.forEach((product, index) => {
    const featured = product.featured ? '⭐' : '  ';
    const stock = product.stock?.available || 0;
    console.log(`${(index + 1).toString().padStart(3, ' ')}. ${featured} ${product.name}`);
    console.log(`     SKU: ${product.sku} | Marca: ${product.brand} | Categoria: ${product.category} | Estoque: ${stock}`);
    console.log('');
  });

  console.log(`\n📊 Total: ${products.length} produtos encontrados`);
}

async function showFeaturedProducts() {
  console.log('⭐ PRODUTOS EM DESTAQUE\n');

  const products = await Product.find({ featured: true })
    .select('sku name brand category subcategory stock.available')
    .sort({ name: 1 });

  if (products.length === 0) {
    console.log('❌ Nenhum produto em destaque encontrado');
    return;
  }

  products.forEach((product, index) => {
    const stock = product.stock?.available || 0;
    console.log(`${(index + 1).toString().padStart(3, ' ')}. ⭐ ${product.name}`);
    console.log(`     SKU: ${product.sku} | Marca: ${product.brand} | Categoria: ${product.category} | Estoque: ${stock}`);
    console.log('');
  });

  console.log(`\n📊 Total: ${products.length} produtos em destaque`);
}

if (require.main === module) {
  viewProducts();
}

export default viewProducts;