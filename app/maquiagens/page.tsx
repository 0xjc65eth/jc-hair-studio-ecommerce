'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import ErrorBoundary from '../../components/ui/ErrorBoundary';
import ProductCard from '../../components/products/ProductCard';
import { ShoppingBag, Search, Filter } from 'lucide-react';

// Mari Maria Products
const mariMariaProducts = [
  {
    id: 'mari-maria-base-amndoa',
    nome: 'Base Mari Maria - Tom Amêndoa',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Amêndoa. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-amndoa.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 32.00, ourPrice: 35.20, discountPrice: 28.16, savings: 7.04, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-baunilha',
    nome: 'Base Mari Maria - Tom Baunilha',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Baunilha. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-baunilha.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 32.50, ourPrice: 35.75, discountPrice: 28.60, savings: 7.15, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-bege-claro',
    nome: 'Base Mari Maria - Tom Bege Claro',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Bege Claro. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-bege-claro.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 33.50, ourPrice: 36.85, discountPrice: 29.48, savings: 7.37, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-bege-escuro',
    nome: 'Base Mari Maria - Tom Bege Escuro',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Bege Escuro. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-bege-escuro.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 34.00, ourPrice: 37.40, discountPrice: 29.92, savings: 7.48, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-bege-medio',
    nome: 'Base Mari Maria - Tom Bege Médio',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Bege Médio. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-bege-mdio.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 34.50, ourPrice: 37.95, discountPrice: 30.36, savings: 7.59, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-cacau',
    nome: 'Base Mari Maria - Tom Cacau',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Cacau. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-cacau.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 35.00, ourPrice: 38.50, discountPrice: 30.80, savings: 7.70, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-canela',
    nome: 'Base Mari Maria - Tom Canela',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Canela. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-canela.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 35.50, ourPrice: 39.05, discountPrice: 31.24, savings: 7.81, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-caramelo',
    nome: 'Base Mari Maria - Tom Caramelo',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Caramelo. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-caramelo.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 36.00, ourPrice: 39.60, discountPrice: 31.68, savings: 7.92, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-chocolate',
    nome: 'Base Mari Maria - Tom Chocolate',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Chocolate. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-chocolate.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 36.50, ourPrice: 40.15, discountPrice: 32.12, savings: 8.03, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'mari-maria-base-nude',
    nome: 'Base Mari Maria - Tom Nude',
    marca: 'Mari Maria',
    descricao: 'Base líquida profissional Mari Maria no tom Nude. Acabamento natural e cobertura modulável para todos os tipos de pele.',
    imagens: ['/images/products/mari-maria-bases/mari-maria-base-nude.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 37.00, ourPrice: 40.70, discountPrice: 32.56, savings: 8.14, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  }
];

// Bruna Tavares Products
const brunaTavaresProducts = [
  {
    id: 'bruna-tavares-bt-skin-d10',
    nome: 'Base BT Skin D10 - Tom Claro',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin com fórmula avançada, cobertura natural e alta pigmentação. Desenvolvida com ácido hialurônico para hidratação prolongada.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin D10 Base Bruna Tavares.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 25.00, ourPrice: 27.50, discountPrice: 22.00, savings: 5.50, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-d20',
    nome: 'Base BT Skin D20 - Tom Médio',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin especialmente desenvolvida para peles com subtom quente. Fórmula com ácido hialurônico e proteção contra luz azul.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin D20 Base Bruna Tavares.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 26.00, ourPrice: 28.60, discountPrice: 22.88, savings: 5.72, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-d30',
    nome: 'Base BT Skin D30 - Tom Escuro',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida com cobertura natural, alta pigmentação e acabamento aveludado. Ideal para peles escuras com subtom quente.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin D30 Base Bruna Tavares.png'],
    badge: 'DESTAQUE',
    pricing: { basePrice: 27.50, ourPrice: 30.25, discountPrice: 24.20, savings: 6.05, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-f10',
    nome: 'Base BT Skin F10 - Tom Claro Frio',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin especialmente desenvolvida para peles claras com subtom frio. Fórmula com ácido hialurônico.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin F10 Base Bruna Tavares.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 25.50, ourPrice: 28.05, discountPrice: 22.44, savings: 5.61, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-l10',
    nome: 'Base BT Skin L10 - Tom Light',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin para peles muito claras. Cobertura natural com acabamento sedoso e longa duração.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin L10 Base Bruna Tavares.png'],
    badge: 'BESTSELLER',
    pricing: { basePrice: 24.50, ourPrice: 26.95, discountPrice: 21.56, savings: 5.39, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  },
  {
    id: 'bruna-tavares-bt-skin-m10',
    nome: 'Base BT Skin M10 - Tom Medium',
    marca: 'Bruna Tavares',
    descricao: 'Base líquida BT Skin para peles médias. Fórmula avançada com proteção e hidratação prolongada.',
    imagens: ['/images/products/bruna-tavares-bt-skin/BT Skin M10 Base Bruna Tavares.png'],
    badge: 'PREMIUM',
    pricing: { basePrice: 26.50, ourPrice: 29.15, discountPrice: 23.32, savings: 5.83, margin: '10%', competitive: 'Baseado em bases premium do mercado europeu' }
  }
];

export default function MaquiagensPage() {
  const [filtroMarca, setFiltroMarca] = useState('todas');
  const [termoBusca, setTermoBusca] = useState('');

  const todosProdutos = [...mariMariaProducts, ...brunaTavaresProducts];

  const produtosFiltrados = todosProdutos.filter(produto => {
    const matchMarca = filtroMarca === 'todas' || produto.marca.toLowerCase().includes(filtroMarca.toLowerCase());
    const matchBusca = produto.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                       produto.descricao.toLowerCase().includes(termoBusca.toLowerCase());
    return matchMarca && matchBusca;
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-20 mt-16 lg:mt-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-playfair font-bold mb-6">
                Maquiagens Premium
              </h1>
              <p className="text-xl lg:text-2xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Descubra nossa exclusiva coleção de bases Mari Maria e Bruna Tavares
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  {todosProdutos.length} produtos disponíveis
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <select
                    value={filtroMarca}
                    onChange={(e) => setFiltroMarca(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="todas">Todas as marcas</option>
                    <option value="mari maria">Mari Maria</option>
                    <option value="bruna tavares">Bruna Tavares</option>
                  </select>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Mostrando {produtosFiltrados.length} de {todosProdutos.length} produtos
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {produtosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {produtosFiltrados.map((produto) => (
                  <ProductCard
                    key={produto.id}
                    id={produto.id}
                    nome={produto.nome}
                    marca={produto.marca}
                    descricao={produto.descricao}
                    imagens={produto.imagens}
                    badge={produto.badge}
                    pricing={produto.pricing}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar os filtros ou termo de busca
                </p>
                <Button
                  onClick={() => {
                    setFiltroMarca('todas');
                    setTermoBusca('');
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold mb-4">
              Fique por dentro das novidades
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Cadastre-se para receber ofertas exclusivas e lançamentos em primeira mão
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full font-medium">
                Inscrever-se
              </Button>
            </div>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
}