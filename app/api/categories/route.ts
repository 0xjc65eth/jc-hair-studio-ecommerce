import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MongoCategoryService } from '@/lib/services/mongoCategoryService';
import { connectDB } from '@/lib/mongodb/connection';

// Validation schemas
const CategoryQuerySchema = z.object({
  featured: z.string().optional().transform(val => val === 'true'),
  withCount: z.string().optional().transform(val => val === 'true'),
  parent: z.string().optional(), // Parent category ID
  includeChildren: z.string().optional().transform(val => val === 'true'),
});

const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório'),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  image: z.string().url().optional(),
  banner: z.string().url().optional(),
  parentId: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

// Mock data removed - using MongoDB only

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    
    // Validate query parameters
    const validatedQuery = CategoryQuerySchema.parse(queryParams);
    
    const {
      featured,
      withCount,
      parent,
      includeChildren,
    } = validatedQuery;

    try {
      // Use MongoDB service to get categories
      const filters: any = {
        isActive: true
      };
      
      if (featured !== undefined) {
        filters.featured = featured;
      }
      
      if (parent !== undefined) {
        filters.parentId = parent;
      }

      let categories = await MongoCategoryService.getCategories(filters);

      // Add children if requested using tree structure
      if (includeChildren) {
        const categoryTree = await MongoCategoryService.getCategoryTree();
        categories = categoryTree;
      }

      return NextResponse.json({
        success: true,
        data: {
          categories,
          meta: {
            total: categories.length,
            withCount,
            includeChildren,
          }
        },
        message: 'Categorias carregadas com sucesso',
      });

    } catch (dbError) {
      console.error('Database error in categories API:', dbError);
      
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
    console.error('Categories GET error:', error);
    
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
    const validatedData = CreateCategorySchema.parse(body);
    
    try {
      await connectDB();

      // Transform the data to MongoDB schema format
      const categoryData = {
        name: validatedData.name,
        description: validatedData.description,
        slug: validatedData.slug,
        parentId: validatedData.parentId || null,
        image: validatedData.image ? {
          url: validatedData.image,
          alt: validatedData.name
        } : undefined,
        seo: {
          title: validatedData.metaTitle || validatedData.name,
          description: validatedData.metaDescription || validatedData.description || '',
          keywords: validatedData.keywords?.split(',') || []
        },
        displayOrder: validatedData.displayOrder,
        isActive: validatedData.isActive,
        isFeatured: validatedData.isFeatured,
        isVisible: validatedData.isActive,
        showInMenu: true,
        showInFooter: false
      };

      // Create the category using MongoDB service
      const newCategory = await MongoCategoryService.createCategory(categoryData);

      return NextResponse.json(
        {
          success: true,
          data: newCategory,
          message: 'Categoria criada com sucesso',
        },
        { status: 201 }
      );

    } catch (dbError) {
      console.error('Database error creating category:', dbError);
      
      return NextResponse.json(
        {
          success: false,
          message: 'Erro ao criar categoria no banco de dados',
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

    console.error('Categories POST error:', error);
    
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