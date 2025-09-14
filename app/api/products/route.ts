import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MongoProductService } from '@/lib/services/mongoProductService';
import { connectDB } from '@/lib/mongodb/connection';

// Validation schemas
const ProductQuerySchema = z.object({
  featured: z.string().optional().transform(val => val === 'true'),
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['name', 'price', 'created', 'rating', 'popularity']).default('created'),
  order: z.enum(['asc', 'desc']).default('desc'),
  minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? Math.min(parseInt(val), 100) : 12),
  productType: z.enum(['HAIR_EXTENSION', 'HAIR_TREATMENT', 'NAIL_POLISH', 'MAKEUP', 'TOOL_PROFESSIONAL', 'BODY_CARE', 'HAIR_CARE']).optional(),
  hairType: z.enum(['STRAIGHT', 'WAVY', 'CURLY', 'COILY', 'MIXED']).optional(),
  hairTexture: z.enum(['FINE', 'MEDIUM', 'COARSE', 'EXTRA_COARSE']).optional(),
  inStock: z.string().optional().transform(val => val === 'true'),
});

const CreateProductSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  sku: z.string().min(1, 'SKU é obrigatório'),
  barcode: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser positivo'),
  professionalPrice: z.number().min(0).optional(),
  comparePrice: z.number().min(0).optional(),
  cost: z.number().min(0).optional(),
  isOnPromotion: z.boolean().default(false),
  promoPrice: z.number().min(0).optional(),
  promoStartDate: z.string().optional(),
  promoEndDate: z.string().optional(),
  weight: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
  hairType: z.enum(['STRAIGHT', 'WAVY', 'CURLY', 'COILY', 'MIXED']).optional(),
  hairTexture: z.enum(['FINE', 'MEDIUM', 'COARSE', 'EXTRA_COARSE']).optional(),
  hairColor: z.string().optional(),
  hairOrigin: z.string().optional(),
  brand: z.string().optional(),
  productLine: z.string().optional(),
  volume: z.string().optional(),
  productType: z.enum(['HAIR_EXTENSION', 'HAIR_TREATMENT', 'NAIL_POLISH', 'MAKEUP', 'TOOL_PROFESSIONAL', 'BODY_CARE', 'HAIR_CARE']).default('HAIR_EXTENSION'),
  trackQuantity: z.boolean().default(true),
  quantity: z.number().int().min(0).default(0),
  lowStockAlert: z.number().int().min(0).default(5),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED', 'OUT_OF_STOCK']).default('DRAFT'),
  isDigital: z.boolean().default(false),
  requiresShipping: z.boolean().default(true),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  categoryIds: z.array(z.string()).default([]),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    title: z.string().optional(),
    displayOrder: z.number().int().default(0),
    isMain: z.boolean().default(false),
  })).default([]),
  options: z.array(z.object({
    name: z.string(),
    displayName: z.string(),
    type: z.enum(['SELECT', 'RADIO', 'COLOR', 'SIZE']).default('SELECT'),
    isRequired: z.boolean().default(true),
    displayOrder: z.number().int().default(0),
    values: z.array(z.object({
      value: z.string(),
      label: z.string().optional(),
      hexColor: z.string().optional(),
      priceAdjustment: z.number().default(0),
      quantity: z.number().int().default(0),
      isActive: z.boolean().default(true),
      displayOrder: z.number().int().default(0),
    })).default([]),
  })).default([]),
});

// Mock data removed - using MongoDB only

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validatedQuery = ProductQuerySchema.parse(queryParams);
    
    const {
      featured,
      category,
      search,
      sort,
      order,
      minPrice,
      maxPrice,
      page,
      limit,
      productType,
      hairType,
      hairTexture,
      inStock,
    } = validatedQuery;

    try {
      // Use MongoDB service
      const sortBy = sort === 'created' ? (order === 'asc' ? 'oldest' : 'newest') 
                   : sort === 'price' ? (order === 'asc' ? 'price-low' : 'price-high')
                   : sort === 'name' ? 'name'
                   : 'newest';

      const result = await MongoProductService.getProducts({
        featured,
        category: category ? [category] : undefined,
        search,
        minPrice,
        maxPrice,
        hairType: hairType ? [hairType] : undefined,
        hairTexture: hairTexture ? [hairTexture] : undefined,
        inStock,
        page,
        limit,
        sortBy
      });

      return NextResponse.json({
        success: true,
        data: {
          products: result.products,
          pagination: {
            current: result.page,
            total: result.totalPages,
            count: result.total,
            hasNext: result.hasNext,
            hasPrev: result.hasPrev,
            limit,
          },
          filters: {
            featured,
            category,
            search,
            sort,
            order,
            minPrice,
            maxPrice,
            productType,
            hairType,
            hairTexture,
            inStock,
          }
        },
        message: 'Produtos carregados com sucesso',
      });

    } catch (dbError) {
      console.error('Database error in products API:', dbError);
      
      return NextResponse.json(
        {
          success: false,
          message: 'Erro ao conectar com o banco de dados',
          error: process.env.NODE_ENV === 'development' ? dbError : undefined,
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Products GET error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateProductSchema.parse(body);
    
    try {
      await connectDB();
      
      // Transform the data to MongoDB schema format
      const productData = {
        name: validatedData.name,
        description: validatedData.description || '',
        shortDescription: validatedData.shortDesc,
        sku: validatedData.sku,
        barcode: validatedData.barcode,
        price: validatedData.price,
        retailPrice: validatedData.comparePrice || validatedData.price,
        professionalPrice: validatedData.professionalPrice || validatedData.price,
        costPrice: validatedData.cost,
        categoryIds: validatedData.categoryIds,
        brandId: 'default-brand', // You may need to handle brand creation
        images: validatedData.images.map(img => ({
          ...img,
          alt: img.alt || validatedData.name || 'Product image'
        })),
        stock: validatedData.quantity,
        minStock: validatedData.lowStockAlert,
        trackStock: validatedData.trackQuantity,
        weight: validatedData.weight,
        characteristics: {
          hairType: validatedData.hairType,
          hairTexture: validatedData.hairTexture,
          hairColor: validatedData.hairColor,
          hairOrigin: validatedData.hairOrigin,
          length: validatedData.length
        },
        seo: {
          title: validatedData.metaTitle || validatedData.name,
          description: validatedData.metaDescription || validatedData.shortDesc || validatedData.description?.substring(0, 160) || '',
          keywords: validatedData.keywords?.split(',') || [],
          slug: validatedData.slug
        },
        isActive: validatedData.status === 'ACTIVE',
        isVisible: validatedData.status === 'ACTIVE',
        isFeatured: validatedData.isFeatured,
        isOnSale: validatedData.isOnPromotion,
        saleStartDate: validatedData.promoStartDate ? new Date(validatedData.promoStartDate) : undefined,
        saleEndDate: validatedData.promoEndDate ? new Date(validatedData.promoEndDate) : undefined,
        publishedAt: validatedData.status === 'ACTIVE' ? new Date() : undefined,
        options: validatedData.options
      };

      // Create the product using MongoDB service
      const newProduct = await MongoProductService.createProduct(productData);

      return NextResponse.json(
        {
          success: true,
          data: newProduct,
          message: 'Produto criado com sucesso',
        },
        { status: 201 }
      );

    } catch (dbError) {
      console.error('Database error creating product:', dbError);
      
      return NextResponse.json(
        {
          success: false,
          message: 'Erro ao criar produto no banco de dados',
          error: process.env.NODE_ENV === 'development' ? dbError : undefined,
        },
        { status: 500 }
      );
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dados inválidos',
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error('Products POST error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// CORS and OPTIONS handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}