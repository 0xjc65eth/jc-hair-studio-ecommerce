import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, TrendingUp, Package } from 'lucide-react';
import { beautyCategories } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: 'Categorias de Beleza - JC Hair Studio\'s 62',
  description: 'Explore todas as categorias de produtos de beleza: progressivas, tratamentos capilares, maquiagem brasileira e muito mais.',
  keywords: [
    'categorias beleza',
    'produtos beleza',
    'progressivas',
    'tratamentos capilares',
    'maquiagem',
    'ferramentas beleza',
    'e-commerce beleza'
  ],
  openGraph: {
    title: 'Categorias de Beleza - JC Hair Studio\'s 62',
    description: 'Explore todas as categorias de produtos de beleza disponíveis',
    images: ['/images/categories-overview.jpg'],
  },
};

function CategoryCard({ category }: { category: typeof beautyCategories[0] }) {
  const totalProducts = category.products.length;
  const inStockProducts = category.products.filter(p => p.availability === 'in_stock').length;
  const newProducts = category.products.filter(p => p.isNew).length;
  const popularProducts = category.products.filter(p => p.isPopular).length;

  return (
    <Link 
      href={`/${category.slug}`}
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Category Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
        
        {/* Stats overlay */}
        <div className="absolute top-4 left-4 space-y-2">
          <span className="bg-white bg-opacity-90 text-gray-900 text-xs px-2 py-1 rounded-full font-medium">
            {totalProducts} produtos
          </span>
          {newProducts > 0 && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {newProducts} novos
            </span>
          )}
        </div>

        {/* Arrow overlay */}
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-full p-2 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <ArrowRight className="w-4 h-4 text-gray-900" />
        </div>
      </div>

      {/* Category Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
          {category.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {category.description}
        </p>

        {/* Quick stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Package className="w-4 h-4 mr-1" />
              {inStockProducts} em estoque
            </span>
            {popularProducts > 0 && (
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                {popularProducts} populares
              </span>
            )}
          </div>
        </div>

        {/* Price range */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            A partir de{' '}
            <span className="font-semibold text-gray-900">
              €{Math.min(...category.products.map(p => p.price)).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CategoriasPage() {
  const totalProducts = beautyCategories.reduce((acc, cat) => acc + cat.products.length, 0);
  const totalBrands = new Set(beautyCategories.flatMap(cat => cat.products.map(p => p.brand))).size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container-custom py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
              Categorias de Beleza
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Descubra nossa seleção completa de produtos de beleza organizados 
              por categorias para facilitar sua busca pelo produto perfeito.
            </p>
            
            {/* Quick stats */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-black">{beautyCategories.length}</div>
                <div className="text-sm text-gray-600">Categorias</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">{totalProducts}</div>
                <div className="text-sm text-gray-600">Produtos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">{totalBrands}</div>
                <div className="text-sm text-gray-600">Marcas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beautyCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white border-t">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 text-center mb-12">
              Por que escolher nossas categorias?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Organização Inteligente
                </h3>
                <p className="text-gray-600 text-sm">
                  Produtos cuidadosamente organizados por categoria para facilitar sua busca
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Filtros Avançados
                </h3>
                <p className="text-gray-600 text-sm">
                  Sistema completo de filtros por marca, preço, avaliação e muito mais
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sempre Atualizado
                </h3>
                <p className="text-gray-600 text-sm">
                  Novos produtos e tendências constantemente adicionados às categorias
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="container-custom py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-6">
              Pronto para encontrar seus produtos ideais?
            </h2>
            <p className="text-gray-300 mb-8">
              Explore nossas categorias e descubra produtos de alta qualidade 
              com entrega rápida em toda a Europa.
            </p>
            <Link 
              href="/progressivas-btx"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Começar Agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}