import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { Product } from '@/lib/models/Product';
import { Category } from '@/lib/models/Category';
import { withAdminAuth } from '@/lib/admin/auth-middleware';

async function getHandler(request: NextRequest) {
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

// POST - Create new product
async function postHandler(request: NextRequest) {
  try {
    await connectDB();
    const productData = await request.json();

    // Validate required fields
    if (!productData.name || !productData.category) {
      return NextResponse.json(
        { success: false, error: 'Name and category are required' },
        { status: 400 }
      );
    }

    // Generate SKU if not provided
    if (!productData.sku) {
      productData.sku = `${productData.category.toUpperCase()}-${Date.now()}`;
    }

    // Set defaults
    const productWithDefaults = {
      featured: false,
      status: 'active',
      stock: { available: 0, reserved: 0 },
      pricing: { basePrice: 0, salePrice: null },
      ...productData
    };

    const product = new Product(productWithDefaults);
    const savedProduct = await product.save();

    console.log('✅ Product created:', savedProduct.sku);

    return NextResponse.json({
      success: true,
      product: savedProduct,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create product',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT - Update existing product
async function putHandler(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const updateData = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('✅ Product updated:', product.sku);

    return NextResponse.json({
      success: true,
      product,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE - Remove product
async function deleteHandler(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    console.log('✅ Product deleted:', product.sku);

    return NextResponse.json({
      success: true,
      product: { _id: product._id, sku: product.sku, name: product.name },
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Export protected endpoints with admin authentication
export const GET = withAdminAuth(getHandler);
export const POST = withAdminAuth(postHandler);
export const PUT = withAdminAuth(putHandler);
export const DELETE = withAdminAuth(deleteHandler);