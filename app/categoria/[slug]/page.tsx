'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Grid, List, Filter } from 'lucide-react';
import { products } from '../../../src/data/products';
import ProductCard from '../../../components/products/ProductCard';

export default function CategoryPage() {
  const params = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Converter slug para categoria
  const categorySlugMap: { [key: string]: string } = {
    'progressivas-alisamentos': 'Progressivas com Formol',
    'progressivas-sem-formol': 'Progressivas sem Formol',
    'progressivas-premium': 'Progressivas Premium',
    'btx-botox-capilar': 'BTX/Botox Capilar',
    'reconstrucao': 'Reconstrução',
    'hidratacao-profunda': 'Hidratação Profunda',
    'nutricao': 'Nutrição',
    'cauterizacao': 'Cauterização',
    'cronograma-capilar': 'Cronograma Capilar',
    'antiqueda': 'Antiqueda',
    'matizadores': 'Matizadores',
    'tratamentos-especiais': 'Tratamentos Especiais',
    'linha-profissional': 'Linha Profissional',
    'tratamentos-capilares': 'Tratamentos Capilares',
    'shampoos-condicionadores': 'Shampoos & Condicionadores',
    'ferramentas-profissionais': 'Ferramentas Profissionais',
    'bases': 'Bases'
  };

  const categoryName = categorySlugMap[params.slug as string] || 'Categoria não encontrada';
  
  // Filtrar produtos por categoria
  const categoryProducts = products.filter(product => {
    const matchesCategory = product.subcategoria === categoryName ||
                           (params.slug === 'tratamentos-capilares' && [
                             'Reconstrução', 'Hidratação Profunda', 'Nutrição', 
                             'Cauterização', 'Cronograma Capilar', 'Antiqueda',
                             'Matizadores', 'Tratamentos Especiais', 'BTX/Botox Capilar'
                           ].includes(product.subcategoria)) ||
                           (params.slug === 'progressivas-alisamentos' && [
                             'Progressivas com Formol', 'Progressivas sem Formol', 'Progressivas Premium'
                           ].includes(product.subcategoria));

    const matchesSearch = searchTerm === '' || 
                         product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.preco_eur - b.preco_eur;
      case 'price-high':
        return b.preco_eur - a.preco_eur;
      case 'name':
        return a.nome.localeCompare(b.nome);
      default:
        return 0;
    }
  });

  const getCategoryTitle = (slug: string) => {
    const titles: { [key: string]: string } = {
      'progressivas-alisamentos': 'Progressivas & Alisamentos',
      'tratamentos-capilares': 'Tratamentos Capilares',
      'shampoos-condicionadores': 'Shampoos & Condicionadores',
      'ferramentas-profissionais': 'Ferramentas Profissionais',
      'bases': 'Bases de Maquiagem'
    };
    return titles[slug] || categoryName;
  };

  const getCategoryDescription = (slug: string) => {
    const descriptions: { [key: string]: string } = {
      'progressivas-alisamentos': 'Descubra nossa linha completa de progressivas e produtos de alisamento profissional, importados diretamente do Brasil.',
      'tratamentos-capilares': 'Tratamentos especializados para hidratação, reconstrução e nutrição dos seus cabelos.',
      'shampoos-condicionadores': 'Shampoos e condicionadores profissionais para todos os tipos de cabelo.',
      'ferramentas-profissionais': 'Equipamentos e ferramentas profissionais para salões de beleza.',
      'bases': 'Bases de maquiagem brasileiras com alta cobertura e longa duração.'
    };
    return descriptions[slug] || 'Produtos de alta qualidade importados do Brasil.';
  };

  if (categoryProducts.length === 0 && searchTerm === '') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Categoria em construção</h1>
          <p className="text-gray-600 mb-4">Esta categoria estará disponível em breve.</p>
          <Link 
            href="/produtos"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Ver todos os produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Início</Link>
            <span className="text-gray-400">/</span>
            <Link href="/produtos" className="text-gray-500 hover:text-gray-700">Produtos</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{getCategoryTitle(params.slug as string)}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              {getCategoryTitle(params.slug as string).toUpperCase()}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getCategoryDescription(params.slug as string)}
            </p>
          </div>
          
          {/* Filtros */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar na categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="name">Ordenar por Nome</option>
                <option value="price-low">Preço: Menor para Maior</option>
                <option value="price-high">Preço: Maior para Menor</option>
              </select>
              
              <div className="flex border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600'} rounded-l-lg`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600'} rounded-r-lg`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Mostrando {sortedProducts.length} produto{sortedProducts.length !== 1 ? 's' : ''} 
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500 mb-4">Tente ajustar seu termo de pesquisa</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Limpar pesquisa
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
          }>
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                nome={product.nome}
                marca={product.marca}
                descricao={product.descricao}
                preco_brl={product.preco_brl}
                preco_eur={product.preco_eur}
                imagens={product.imagens}
                badge={product.badge}
                destaque={product.destaque}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}