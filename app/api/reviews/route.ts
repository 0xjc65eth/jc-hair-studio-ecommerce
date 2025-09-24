import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { MongoReviewService } from '@/lib/services/mongoReviewService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const rating = searchParams.get('rating');
    const verified = searchParams.get('verified');
    const published = searchParams.get('published');

    const filters: any = {};

    if (productId) filters.productId = productId;
    if (userId) filters.userId = userId;
    if (rating) filters.rating = parseInt(rating);
    if (verified !== null) filters.isVerified = verified === 'true';
    if (published !== null) filters.isPublished = published === 'true';

    const result = await MongoReviewService.getReviews({
      page,
      limit,
      ...filters
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erro ao buscar reviews:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, rating, title, content } = body;

    if (!productId || !rating || !content) {
      return NextResponse.json(
        { error: 'productId, rating e content são obrigatórios' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating deve estar entre 1 e 5' },
        { status: 400 }
      );
    }

    // Verificar se usuário já avaliou este produto
    const existingReview = await MongoReviewService.getUserReviewForProduct(
      session.user.id,
      productId
    );

    if (existingReview) {
      return NextResponse.json(
        { error: 'Você já avaliou este produto' },
        { status: 409 }
      );
    }

    const reviewData = {
      productId,
      userId: session.user.id,
      rating,
      title: title?.trim() || '',
      content: content.trim(),
      isVerified: false, // Será verificado por admin
      isPublished: true,
      helpfulCount: 0
    };

    const review = await MongoReviewService.createReview(reviewData);

    // Atualizar rating médio do produto
    await MongoReviewService.updateProductRating(productId);

    return NextResponse.json({
      success: true,
      message: 'Avaliação criada com sucesso',
      review: {
        id: review._id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        createdAt: review.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar review:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, rating, title, content, isPublished, isVerified } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID da avaliação é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar review existente
    const existingReview = await MongoReviewService.getReviewById(id);

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      );
    }

    // Verificar permissão (apenas autor ou admin)
    const isOwner = existingReview.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Sem permissão para editar esta avaliação' },
        { status: 403 }
      );
    }

    const updateData: any = {};

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Rating deve estar entre 1 e 5' },
          { status: 400 }
        );
      }
      updateData.rating = rating;
    }

    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();

    // Apenas admin pode alterar status
    if (isAdmin) {
      if (isPublished !== undefined) updateData.isPublished = isPublished;
      if (isVerified !== undefined) updateData.isVerified = isVerified;
    }

    const review = await MongoReviewService.updateReview(id, updateData);

    // Se rating foi alterado, atualizar média do produto
    if (rating !== undefined) {
      await MongoReviewService.updateProductRating(existingReview.productId);
    }

    return NextResponse.json({
      success: true,
      message: 'Avaliação atualizada com sucesso',
      review
    });

  } catch (error) {
    console.error('Erro ao atualizar review:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID da avaliação é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar review existente
    const existingReview = await MongoReviewService.getReviewById(id);

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      );
    }

    // Verificar permissão (apenas autor ou admin)
    const isOwner = existingReview.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Sem permissão para excluir esta avaliação' },
        { status: 403 }
      );
    }

    const success = await MongoReviewService.deleteReview(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Erro ao excluir avaliação' },
        { status: 500 }
      );
    }

    // Atualizar rating médio do produto
    await MongoReviewService.updateProductRating(existingReview.productId);

    return NextResponse.json({
      success: true,
      message: 'Avaliação excluída com sucesso'
    });

  } catch (error) {
    console.error('Erro ao excluir review:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}