'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Truck, Shield, RotateCcw, Award } from 'lucide-react';
import ImageCarousel from '@/components/products/ImageCarousel';
import { resolveProductById, getAllAvailableProducts } from '@/lib/services/productResolver';
import { ProductSchema } from '@/components/seo/SchemaMarkup';
import { CategoryBackButton } from '@/components/navigation/BackButton';
import WishlistButton from '@/components/catalogo/WishlistButton';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  // Debug logging - John Carmack style: if there's a problem, show it clearly
  console.log('🔍 ProductDetailPage Debug:', {
    params: params,
    id: params.id,
    url: typeof window !== 'undefined' ? window.location.href : 'SSR'
  });
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Use the unified product resolver - one source of truth
  const product = resolveProductById(params.id as string);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
          <Link 
            href="/produtos"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Voltar aos produtos
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Implementar lógica do carrinho
    console.log('Adicionado ao carrinho:', product.id, 'Quantidade:', quantity);
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
        alert('Link copiado para a área de transferência!');
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

  const locale = params.locale as string | undefined;

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <CategoryBackButton
            productCategory={product.category}
            locale={locale}
            variant="ghost"
          />
        </div>
      </div>

      {/* Breadcrumb with SEO markup */}
      <nav className="bg-gray-50 border-b" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <ol
            className="flex items-center space-x-2 text-sm"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link
                href="/"
                className="text-gray-500 hover:text-amber-600 transition-colors font-medium"
                itemProp="item"
                title="Voltar à página inicial"
              >
                <span itemProp="name">Início</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <span className="text-gray-400">/</span>

            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link
                href="/produtos"
                className="text-gray-500 hover:text-amber-600 transition-colors font-medium"
                itemProp="item"
                title="Ver todos os produtos brasileiros"
              >
                <span itemProp="name">Produtos</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>
            <span className="text-gray-400">/</span>

            {product.category && (
              <>
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <Link
                    href={`/categoria/${product.category?.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-500 hover:text-amber-600 transition-colors font-medium"
                    itemProp="item"
                    title={`Ver produtos de ${product.category}`}
                  >
                    <span itemProp="name">{product.category}</span>
                  </Link>
                  <meta itemProp="position" content="3" />
                </li>
                <span className="text-gray-400">/</span>
              </>
            )}

            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span
                className="text-gray-900 font-semibold"
                itemProp="name"
                aria-current="page"
              >
                {product.name}
              </span>
              <meta itemProp="position" content="4" />
            </li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Galeria de imagens */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
              <ImageCarousel
                images={product.images || ['/placeholder-product.jpg']}
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

        {/* Produtos relacionados com SEO otimizado */}
        {relatedProducts.length > 0 && (
          <section className="mt-16" aria-labelledby="related-products-heading">
            <div className="flex items-center justify-between mb-8">
              <h2 id="related-products-heading" className="text-2xl lg:text-3xl font-bold text-gray-900">
                Você Também Pode Gostar
              </h2>
              <Link
                href={`/categoria/${product.category?.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-1"
                title={`Ver mais produtos de ${product.category}`}
              >
                Ver mais
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <article
                  key={relatedProduct.id}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <Link
                    href={`/produto/${relatedProduct.id}`}
                    className="block"
                    title={`Ver ${relatedProduct.name || relatedProduct.nome}`}
                    aria-label={`Comprar ${relatedProduct.name || relatedProduct.nome}`}
                  >
                    <div className="aspect-square bg-gray-50 overflow-hidden relative">
                      <ImageCarousel
                        images={relatedProduct.images || relatedProduct.imagens || ['/placeholder-product.jpg']}
                        productName={relatedProduct.name || relatedProduct.nome}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4">
                      {relatedProduct.brand && (
                        <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">
                          {relatedProduct.brand}
                        </span>
                      )}

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {relatedProduct.name || relatedProduct.nome}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-amber-600">
                          €{(relatedProduct.preco_eur || relatedProduct.pricing?.discountPrice || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Additional contextual links */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Explore mais produtos da categoria <Link href={`/categoria/${product.category?.toLowerCase().replace(/\s+/g, '-')}`} className="text-amber-600 hover:text-amber-700 font-medium">{product.category}</Link>
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/mega-hair"
                  className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  title="Ver mega hair brasileiro"
                >
                  Mega Hair Brasileiro
                </Link>
                <Link
                  href="/categoria/progressivas-alisamentos"
                  className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  title="Ver progressivas e alisamentos"
                >
                  Progressivas Premium
                </Link>
                <Link
                  href="/maquiagens"
                  className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                  title="Ver maquiagem brasileira"
                >
                  Maquiagem Brasileira
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Schema Markup for Rich Snippets */}
      <ProductSchema
        product={product}
        reviews={[
          {
            rating: 5,
            author: 'Maria Silva',
            comment: 'Produto excelente! Qualidade brasileira incomparável.',
            date: '2024-01-15'
          },
          {
            rating: 4,
            author: 'Ana Costa',
            comment: 'Muito satisfeita com a compra. Entrega rápida.',
            date: '2024-01-10'
          }
        ]}
      />
    </div>
  );
}