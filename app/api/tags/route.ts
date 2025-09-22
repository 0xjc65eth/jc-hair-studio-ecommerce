import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { MongoTagService } from '@/lib/services/mongoTagService';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('active');

    const filters: any = {};

    if (search) {
      filters.search = search;
    }

    if (isActive !== null) {
      filters.isActive = isActive === 'true';
    }

    const result = await MongoTagService.getTags({
      page,
      limit,
      ...filters
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, description, color } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome da tag é obrigatório' },
        { status: 400 }
      );
    }

    // Gerar slug automaticamente
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const tagData = {
      name: name.trim(),
      slug,
      description: description?.trim() || '',
      color: color || '#3B82F6',
      isActive: true,
      displayOrder: 0
    };

    try {
      const tag = await MongoTagService.createTag(tagData);

      return NextResponse.json({
        success: true,
        message: 'Tag criada com sucesso',
        tag: {
          id: tag._id,
          name: tag.name,
          slug: tag.slug,
          description: tag.description,
          color: tag.color,
          isActive: tag.isActive
        }
      }, { status: 201 });

    } catch (error: any) {
      if (error.code === 11000) {
        if (error.message.includes('name')) {
          return NextResponse.json(
            { error: 'Já existe uma tag com este nome' },
            { status: 409 }
          );
        }
        if (error.message.includes('slug')) {
          return NextResponse.json(
            { error: 'Já existe uma tag com este slug' },
            { status: 409 }
          );
        }
      }
      throw error;
    }

  } catch (error) {
    console.error('Erro ao criar tag:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, name, description, color, isActive, displayOrder } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID da tag é obrigatório' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Nome da tag é obrigatório' },
        { status: 400 }
      );
    }

    const updateData: any = {
      name: name.trim(),
      description: description?.trim() || '',
      color: color || '#3B82F6',
      isActive: isActive !== undefined ? isActive : true
    };

    if (displayOrder !== undefined) {
      updateData.displayOrder = displayOrder;
    }

    const tag = await MongoTagService.updateTag(id, updateData);

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tag atualizada com sucesso',
      tag: {
        id: tag._id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description,
        color: tag.color,
        isActive: tag.isActive,
        displayOrder: tag.displayOrder
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar tag:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID da tag é obrigatório' },
        { status: 400 }
      );
    }

    const success = await MongoTagService.deleteTag(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Tag não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tag excluída com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir tag:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}