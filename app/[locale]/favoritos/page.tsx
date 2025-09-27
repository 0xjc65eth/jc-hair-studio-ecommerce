'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Heart, ShoppingBag, X, Filter } from 'lucide-react';
import { useCart } from '../../../lib/stores/cartStore';
import { toast } from 'react-toastify';

interface FavoriteProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  category: string;
  inStock: boolean;
}

const mockFavorites: FavoriteProduct[] = [
  {
    id: '1',
    name: 'Progressiva Cadiveu Professional',
    slug: 'progressiva-cadiveu-professional',
    price: 89.99,
    comparePrice: 109.99,
    image: '/images/products/cadiveu-progressiva.jpg',
    category: 'Progressivas',
    inStock: true
  },
  {
    id: '2',
    name: 'Mega Hair Loiro Natural 60cm',
    slug: 'mega-hair-loiro-natural-60cm',
    price: 199.99,
    image: '/images/products/mega-hair-loiro.jpg',
    category: 'Mega Hair',
    inStock: true
  },
  {
    id: '3',
    name: 'Kit Escova Progressiva Inoar',
    slug: 'kit-escova-progressiva-inoar',
    price: 129.99,
    comparePrice: 149.99,
    image: '/images/products/inoar-kit.jpg',
    category: 'Kits',
    inStock: false
  }
];

export default function FavoritosPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!session) {
        setFavorites(mockFavorites);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/wishlist?includeProducts=true');
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.items || []);
        } else {
          setFavorites(mockFavorites);
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        setFavorites(mockFavorites);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session]);

  const removeFavorite = async (productId: string) => {
    if (!session) {
      setFavorites(prev => prev.filter(item => item.id !== productId));
      return;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  const [filterCategory, setFilterCategory] = useState<string>('all');

  const addToCart = async (product: FavoriteProduct) => {
    try {
      addItem({
        productId: product.id,
        quantity: 1,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          comparePrice: product.comparePrice,
          images: product.image ? [{
            url: product.image,
            alt: product.name,
            isMain: true
          }] : [],
          status: product.inStock ? 'ACTIVE' as any : 'OUT_OF_STOCK' as any,
          quantity: product.inStock ? 999 : 0,
        },
      });

      toast.success(`${product.name} adicionado ao carrinho!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Erro ao adicionar produto ao carrinho');
    }
  };

  const filteredFavorites = filterCategory === 'all'
    ? favorites
    : favorites.filter(product => product.category === filterCategory);

  const categories = ['all', ...Array.from(new Set(favorites.map(p => p.category)))];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h1 className="text-3xl font-light text-gray-900 mb-4">Seus Favoritos</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Você ainda não tem produtos favoritos. Explore nosso catálogo e salve os produtos que mais gostar.
            </p>
            <Link
              href="/produtos"
              className="inline-block bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Explorar Produtos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Meus Favoritos</h1>
          <p className="text-gray-600">
            {favorites.length} {favorites.length === 1 ? 'produto salvo' : 'produtos salvos'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterCategory === category
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category === 'all' ? 'Todos' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
              {/* Product Image */}
              <div className="relative aspect-[3/4] bg-gray-100">
                <Link href={`/produto/${product.slug}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-product.jpg';
                    }}
                  />
                </Link>

                {/* Remove from favorites button */}
                <button
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors group"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                </button>

                {/* Stock status */}
                {!product.inStock && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs rounded">
                    Esgotado
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 font-medium">{product.category}</span>
                </div>

                <Link href={`/produto/${product.slug}`}>
                  <h3 className="font-medium text-gray-900 mb-2 hover:text-gray-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-medium text-gray-900">
                    €{product.price.toFixed(2)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-gray-400 line-through">
                      €{product.comparePrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                      product.inStock
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {product.inStock ? 'Adicionar' : 'Esgotado'}
                  </button>

                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty filtered results */}
        {filteredFavorites.length === 0 && filterCategory !== 'all' && (
          <div className="text-center py-16">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Não há produtos favoritos na categoria "{filterCategory}".
            </p>
            <button
              onClick={() => setFilterCategory('all')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todos os favoritos
            </button>
          </div>
        )}

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            href="/produtos"
            className="inline-block border border-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}