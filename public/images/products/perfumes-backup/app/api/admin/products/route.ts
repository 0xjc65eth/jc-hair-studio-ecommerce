import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { Product } from '@/lib/models/Product';
import { Category } from '@/lib/models/Category';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'summary';
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    switch (action) {
      case 'summary':
        return await getSummary();
      case 'all':
        return await getAllProducts(limit);
      case 'category':
        if (!category) {
          return NextResponse.json({ error: 'Category parameter required' }, { status: 400 });
        }
        return await getProductsByCategory(category);
      case 'brand':
        if (!brand) {
          return NextResponse.json({ error: 'Brand parameter required' }, { status: 400 });
        }
        return await getProductsByBrand(brand);
      case 'search':
        if (!search) {
          return NextResponse.json({ error: 'Search parameter required' }, { status: 400 });
        }
        return await searchProducts(search, limit);
      case 'featured':
        return await getFeaturedProducts();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Erro na API de produtos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao buscar produtos',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

async function getSummary() {
  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();

  const byCategory = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const byBrand = await Product.aggregate([
    { $group: { _id: '$brand', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const categories = await Category.find().select('name slug featured');

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalProducts,
        totalCategories
      },
      productsByCategory: byCategory,
      topBrands: byBrand,
      categories: categories
    }
  });
}

async function getAllProducts(limit: number) {
  const products = await Product.find()
    .select('sku name brand category subcategory stock.available featured createdAt')
    .sort({ createdAt: -1 })
    .limit(limit);

  return NextResponse.json({
    success: true,
    data: {
      products,
      count: products.length,
      limit
    }
  });
}

async function getProductsByCategory(category: string) {
  const products = await Product.find({ category })
    .select('sku name brand subcategory stock.available featured')
    .sort({ name: 1 });

  return NextResponse.json({
    success: true,
    data: {
      category,
      products,
      count: products.length
    }
  });
}

async function getProductsByBrand(brand: string) {
  const products = await Product.find({
    brand: { $regex: brand, $options: 'i' }
  })
    .select('sku name category subcategory stock.available featured')
    .sort({ name: 1 });

  return NextResponse.json({
    success: true,
    data: {
      brand,
      products,
      count: products.length
    }
  });
}

async function searchProducts(searchTerm: string, limit: number) {
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
    .limit(limit);

  return NextResponse.json({
    success: true,
    data: {
      searchTerm,
      products,
      count: products.length,
      limit
    }
  });
}

async function getFeaturedProducts() {
  const products = await Product.find({ featured: true })
    .select('sku name brand category subcategory stock.available')
    .sort({ name: 1 });

  return NextResponse.json({
    success: true,
    data: {
      products,
      count: products.length
    }
  });
}