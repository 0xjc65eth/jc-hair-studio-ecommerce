import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb/connection';
import { MongoWishlistService } from '@/lib/services/mongoWishlistService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const includeProducts = searchParams.get('includeProducts') === 'true';

    const result = await MongoWishlistService.getUserWishlist(session.user.id, {
      page,
      limit,
      includeProducts
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erro ao buscar wishlist:', error);
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'productId é obrigatório' },
        { status: 400 }
      );
    }

    try {
      const wishlistItem = await MongoWishlistService.addToWishlist(
        session.user.id,
        productId
      );

      return NextResponse.json({
        success: true,
        message: 'Produto adicionado aos favoritos',
        item: {
          id: wishlistItem._id,
          productId: wishlistItem.productId,
          createdAt: wishlistItem.createdAt
        }
      }, { status: 201 });

    } catch (error: any) {
      if (error.code === 11000) {
        return NextResponse.json(
          { error: 'Produto já está nos favoritos' },
          { status: 409 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('Erro ao adicionar aos favoritos:', error);
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
    const productId = searchParams.get('productId');
    const itemId = searchParams.get('itemId');

    if (!productId && !itemId) {
      return NextResponse.json(
        { error: 'productId ou itemId é obrigatório' },
        { status: 400 }
      );
    }

    let success = false;

    if (productId) {
      success = await MongoWishlistService.removeFromWishlist(
        session.user.id,
        productId
      );
    } else if (itemId) {
      success = await MongoWishlistService.removeWishlistItem(itemId, session.user.id);
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Item não encontrado nos favoritos' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Produto removido dos favoritos'
    });

  } catch (error) {
    console.error('Erro ao remover dos favoritos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para verificar se produto está nos favoritos
export async function HEAD(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse(null, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return new NextResponse(null, { status: 400 });
    }

    const isInWishlist = await MongoWishlistService.isInWishlist(
      session.user.id,
      productId
    );

    return new NextResponse(null, {
      status: isInWishlist ? 200 : 404,
      headers: {
        'X-In-Wishlist': isInWishlist.toString()
      }
    });

  } catch (error) {
    console.error('Erro ao verificar wishlist:', error);
    return new NextResponse(null, { status: 500 });
  }
}