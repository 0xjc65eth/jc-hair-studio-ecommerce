'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getLegacyCompatibleProducts } from '@/lib/data/megaHairProducts';
import { useCart } from '@/lib/stores/cartStore';
import { ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react';

// Mapeamento de tipos
const tipoMap: Record<string, { type: 'liso' | 'ondulado' | 'cacheado' | 'crespo', title: string, description: string }> = {
  'liso': {
    type: 'liso',
    title: '🌟 Liso Premium Brasil',
    description: 'Mega Hair Liso Natural - Perfeito alinhamento e brilho intenso'
  },
  'ondulado': {
    type: 'ondulado',
    title: '🌊 Ondulado Natural',
    description: 'Mega Hair Ondulado - Movimento natural e textura perfeita'
  },
  'cacheado': {
    type: 'cacheado',
    title: '💫 Cacheado Brasileiro',
    description: 'Mega Hair Cacheado - Cachos definidos e volumosos'
  },
  'vip': {
    type: 'liso', // VIP vai mostrar produtos premium (com badge VIP ou maiores preços)
    title: '👑 Coleção VIP Exclusiva',
    description: 'Mega Hair Premium - Nossa coleção mais exclusiva e luxuosa'
  }
};

export default function MegaHairTipoPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const tipo = params.tipo as string;

  // Validar tipo
  if (!tipoMap[tipo]) {
    notFound();
  }

  const { type, title, description } = tipoMap[tipo];
  const allProducts = getLegacyCompatibleProducts();

  // Filtrar produtos por tipo
  const filteredProducts = useMemo(() => {
    if (tipo === 'vip') {
      // Para VIP, mostrar produtos com badge ou preço > 150
      return allProducts.filter(p => p.badge === 'VIP' || p.price > 150);
    }
    return allProducts.filter(p => p.type === type);
  }, [tipo, type, allProducts]);

  const [selectedColor, setSelectedColor] = useState<string>('todos');
  const [selectedLength, setSelectedLength] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('popularity');

  // Aplicar filtros adicionais
  const displayProducts = useMemo(() => {
    let products = [...filteredProducts];

    // Filtro por cor
    if (selectedColor !== 'todos') {
      products = products.filter(p => p.color === selectedColor);
    }

    // Filtro por comprimento
    if (selectedLength !== 'todos') {
      products = products.filter(p => p.length === parseInt(selectedLength));
    }

    // Ordenação
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      default: // popularity
        products.sort((a, b) => b.reviews - a.reviews);
    }

    return products;
  }, [filteredProducts, selectedColor, selectedLength, sortBy]);

  // Extrair cores e comprimentos disponíveis
  const availableColors = useMemo(() => {
    const colors = new Set(filteredProducts.map(p => p.color));
    return Array.from(colors);
  }, [filteredProducts]);

  const availableLengths = useMemo(() => {
    const lengths = new Set(filteredProducts.map(p => p.length));
    return Array.from(lengths).sort((a, b) => a - b);
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-900 via-rose-600 to-pink-600 text-white py-16 mt-16 lg:mt-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/mega-hair"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Mega Hair
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-playfair font-bold mb-4">
              {title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              {description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm">
                {displayProducts.length} produtos disponíveis
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b sticky top-16 lg:top-20 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />

              {/* Filtro de Cor */}
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="todos">Todas as Cores</option>
                {availableColors.map(color => (
                  <option key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>

              {/* Filtro de Comprimento */}
              <select
                value={selectedLength}
                onChange={(e) => setSelectedLength(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="todos">Todos os Comprimentos</option>
                {availableLengths.map(length => (
                  <option key={length} value={length.toString()}>
                    {length}cm
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="popularity">Mais Populares</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {displayProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Nenhum produto encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.badge && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm ml-1">{product.rating}</span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        ({product.reviews} avaliações)
                      </span>
                    </div>

                    <div className="mb-4">
                      <span className="text-2xl font-bold text-rose-600">
                        €{product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex gap-2 mb-4 text-xs">
                      <span className="bg-gray-100 px-3 py-1 rounded-full">
                        {product.length}cm
                      </span>
                      <span className="bg-gray-100 px-3 py-1 rounded-full capitalize">
                        {product.color}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        addItem({
                          productId: product.id.toString(),
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          quantity: 1
                        });
                      }}
                      className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium"
                    >
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
