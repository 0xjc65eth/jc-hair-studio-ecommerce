'use client';

// Force cache refresh - BackButton implementation v1.0
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, Award } from 'lucide-react';
import { useCart } from '@/lib/stores/cartStore';
import { toast } from 'react-toastify';
import { resolveProductById, getAllAvailableProducts } from '../../../lib/services/productResolver';
import ImageCarousel from '../../../components/products/ImageCarousel';
import { ProductMaximizedSchema } from '@/components/seo/MaximizedSchema';
import { CategoryBackButton } from '@/components/navigation/BackButton';
import WishlistButton from '@/components/catalogo/WishlistButton';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Debug logging - John Carmack style: if there's a problem, show it clearly
  console.log('🔍 ProductDetailPage Debug:', {
    params: params,
    id: params.id,
    url: typeof window !== 'undefined' ? window.location.href : 'SSR'
  });
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Client-side hydration and product resolution
  useEffect(() => {
    setIsClient(true);

    if (params.id) {
      console.log(`🔍 ProductDetailPage: Resolving product ID "${params.id}"`);
      try {
        const resolvedProduct = resolveProductById(params.id as string);
        if (resolvedProduct) {
          console.log(`✅ ProductDetailPage: Successfully resolved product "${resolvedProduct.name || resolvedProduct.nome}"`);
          setProduct(resolvedProduct);
        } else {
          console.log(`❌ ProductDetailPage: Product "${params.id}" not found`);
        }
      } catch (error) {
        console.error('❌ ProductDetailPage: Error resolving product:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Back Button - Server-safe version */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <Link href="/produtos" className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-lg font-medium transition-all duration-200">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Link>
          </div>
        </div>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mb-4"></div>
            <h1 className="text-xl font-medium text-gray-900">Carregando produto...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        {/* Back Button - Server-safe version */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <Link href="/produtos" className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-lg font-medium transition-all duration-200">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </Link>
          </div>
        </div>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
            <Link
              href="/produtos"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Ver todos os produtos
            </Link>
          </div>
        </div>
      </div>
    );
  }


  const handleAddToCart = async () => {
    try {
      addItem({
        productId: product.id,
        quantity,
        product: {
          id: product.id,
          name: product.name || product.nome,
          slug: (product.name || product.nome).toLowerCase().replace(/\s+/g, '-'),
          price: product.preco_eur || product.pricing?.discountPrice || 0,
          comparePrice: product.pricing?.basePrice || undefined,
          images: product.images?.length ? product.images.map((img, index) => ({
            url: img,
            alt: product.name || product.nome,
            isMain: index === 0
          })) : [],
          status: 'ACTIVE' as any,
          quantity: 999,
        },
      });

      toast.success(`${product.name || product.nome} adicionado ao carrinho!`, {
        position: 'top-right',
        autoClose: 3000,
      });

      console.log('✅ Produto adicionado ao carrinho:', {
        id: product.id,
        name: product.name || product.nome,
        quantity,
        price: product.preco_eur || product.pricing?.discountPrice || 0
      });
    } catch (error) {
      console.error('❌ Erro ao adicionar produto ao carrinho:', error);
      toast.error('Erro ao adicionar produto ao carrinho');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.nome || product.name,
      text: `Confira ${product.nome || product.name} - €${(product.preco_eur || product.pricing?.discountPrice || 0).toFixed(2)}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        // Use native share on mobile
        await navigator.share(shareData);
        console.log('Produto compartilhado com sucesso!');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copiado para a área de transferência!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'BEST SELLER':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black';
      case 'PROMOÇÃO':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      case 'NOVO':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      case 'PREMIUM':
        return 'bg-gradient-to-r from-indigo-400 to-blue-600 text-white';
      case 'EXCLUSIVO':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const allProducts = getAllAvailableProducts();
  const relatedProducts = allProducts
    .filter(p =>
      p.id !== product.id &&
      (p.category === product.category || p.brand === product.brand || p.marca === product.marca)
    )
    .slice(0, 4);

  // Prevent hydration mismatches by only showing dynamic content when client is ready
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mb-4"></div>
          <h1 className="text-xl font-medium text-gray-900">Carregando produto...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <CategoryBackButton
            productCategory={product.category}
            variant="ghost"
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Início</Link>
            <span className="text-gray-400">/</span>
            <Link href="/produtos" className="text-gray-500 hover:text-gray-700">Produtos</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/categoria/${product.category?.toLowerCase().replace(/\s+/g, '-') || 'produto'}`} className="text-gray-500 hover:text-gray-700">
              {product.category || 'Produto'}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Galeria de imagens */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
              <ImageCarousel
                images={product.images && product.images.length > 0 ? product.images : []}
                productName={product.name}
                className="w-full h-full"
              />
            </div>
            
            {/* Miniaturas */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border-2 border-transparent hover:border-amber-500 transition-colors"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do produto */}
          <div className="space-y-6">
            {/* Cabeçalho */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">
                  {product.marca}
                </span>
                {product.badge && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getBadgeColor(product.badge)}`}>
                    {product.badge}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.nome}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(127 avaliações)</span>
                </div>
              </div>
            </div>

            {/* Preços */}
            <div className="border-t border-b border-gray-100 py-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-amber-600">
                  €{(product.preco_eur || product.pricing?.discountPrice || 0).toFixed(2)}
                </span>
                <span className="text-lg text-gray-500">
                </span>
              </div>
              <p className="text-sm text-gray-600">
                💰 Economize comprando direto do Brasil • Frete grátis acima de €150
              </p>
            </div>

            {/* Descrição */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.descricao}
              </p>
            </div>

            {/* Quantidade e Compra */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 py-2 text-center border-0 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">unidades</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-amber-600 text-white py-4 px-6 rounded-lg hover:bg-amber-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Adicionar ao Carrinho
                </button>

                <WishlistButton
                  productId={product.id}
                  size="lg"
                  className="!w-auto px-4"
                />

                <button
                  onClick={handleShare}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Compartilhar produto"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Garantias */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Garantias</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-gray-700">Entrega rápida</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Produto original</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">30 dias p/ troca</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-700">Qualidade premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Produtos Relacionados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/produto/${relatedProduct.id}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    <ImageCarousel
                      images={(relatedProduct.images && relatedProduct.images.length > 0) ? relatedProduct.images : (relatedProduct.imagens && relatedProduct.imagens.length > 0) ? relatedProduct.imagens : []}
                      productName={relatedProduct.name || relatedProduct.nome}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name || relatedProduct.nome}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-amber-600">
                        €{(relatedProduct.preco_eur || relatedProduct.pricing?.discountPrice || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Maximized Schema for Product - Rich Results */}
      <ProductMaximizedSchema
        product={{
          id: product.id.toString(),
          name: product.name || product.nome,
          description: product.descricao || product.description || '',
          images: product.images && product.images.length > 0 ? product.images : [],
          price: product.preco_eur || product.pricing?.discountPrice || 0,
          comparePrice: product.pricing?.basePrice,
          currency: 'EUR',
          brand: product.marca || product.brand || "JC Hair Studio's 62",
          category: product.category || 'Produtos Brasileiros',
          rating: 4.8,
          reviewCount: 127,
          reviews: [
            {
              rating: 5,
              author: 'Maria Silva',
              comment: 'Produto excelente! Qualidade brasileira incomparável.',
              date: '2024-01-15'
            },
            {
              rating: 5,
              author: 'Ana Costa',
              comment: 'Muito satisfeita com a compra. Entrega rápida.',
              date: '2024-01-10'
            },
            {
              rating: 4,
              author: 'Paula Santos',
              comment: 'Adorei! Produto autêntico e de qualidade.',
              date: '2024-01-05'
            }
          ],
          inStock: true,
          sku: `JCH-${product.id}`,
          color: product.color || product.cor,
          length: product.length || product.comprimento,
          material: product.material || 'Cabelo 100% Humano',
          countryOfOrigin: 'BR'
        }}
        breadcrumbs={[
          { name: 'Início', url: '/' },
          { name: 'Produtos', url: '/produtos' },
          { name: product.category || 'Produto', url: `/categoria/${product.category?.toLowerCase().replace(/\s+/g, '-') || 'produto'}` },
          { name: product.name || product.nome, url: `/produto/${product.id}` }
        ]}
      />
    </div>
  );
}