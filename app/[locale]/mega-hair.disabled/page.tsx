'use client';

import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import ErrorBoundary from '../../../components/ui/ErrorBoundary';
import ProductCard from '../../../components/products/SimpleProductCard';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { megaHairProductsCorrected } from '../../../lib/data/megaHairProducts';
import UnifiedSchema, { BreadcrumbSchema, FAQSchema } from '../../../components/seo/UnifiedSchema';

export default function MegaHairPage() {
  const [filtroComprimento, setFiltroComprimento] = useState('todos');
  const [filtroTextura, setFiltroTextura] = useState('todos');
  const [termoBusca, setTermoBusca] = useState('');

  const todosProdutos = megaHairProductsCorrected;

  const produtosFiltrados = todosProdutos.filter(produto => {
    const matchComprimento = filtroComprimento === 'todos' || produto.length.toString() === filtroComprimento;
    const matchTextura = filtroTextura === 'todos' || produto.type === filtroTextura;
    const matchBusca = produto.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                       produto.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
                       produto.color.toLowerCase().includes(termoBusca.toLowerCase());
    return matchComprimento && matchTextura && matchBusca;
  });

  // Breadcrumbs for SEO
  const breadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Mega Hair Brasileiro', url: '/mega-hair' }
  ];

  // FAQs for rich snippets
  const faqs = [
    {
      question: 'O mega hair é 100% cabelo humano brasileiro?',
      answer: 'Sim! Todos os nossos mega hair são 100% cabelo humano brasileiro natural, com cutículas alinhadas. Oferecemos comprimentos de 40cm a 90cm em texturas liso, ondulado e cacheado.'
    },
    {
      question: 'Qual comprimento de mega hair devo escolher?',
      answer: 'O comprimento ideal depende do seu objetivo. 50cm é nosso best-seller para transformação natural. 60-70cm para visual dramático. 40cm para volume moderado. Todos os produtos são 100g.'
    },
    {
      question: 'Quanto tempo dura o mega hair brasileiro?',
      answer: 'Com cuidados adequados, nosso mega hair brasileiro pode durar de 6 meses a 2 anos. Recomendamos produtos sem sulfato e manutenção regular para máxima durabilidade.'
    },
    {
      question: 'Vocês entregam mega hair em toda a Europa?',
      answer: 'Sim! Entregamos em Portugal, Bélgica, Espanha, França, Itália, Alemanha, Holanda e outros países europeus. Frete grátis acima de €150.'
    },
    {
      question: 'Posso tingir ou alisar o mega hair?',
      answer: 'Sim! Por ser 100% cabelo humano brasileiro, você pode tingir, alisar, cachear e usar babyliss. Recomendamos sempre usar produtos profissionais e proteção térmica.'
    }
  ];

  return (
    <ErrorBoundary>
      {/* Schema.org Structured Data */}
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <FAQSchema faqs={faqs} />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-20 mt-16 lg:mt-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-playfair font-bold mb-6">
                Mega Hair Brasileiro Premium
              </h1>
              <p className="text-xl lg:text-2xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Extensões 100% cabelo humano brasileiro natural - De 40cm a 90cm
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
                    value={filtroComprimento}
                    onChange={(e) => setFiltroComprimento(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="todos">Todos os comprimentos</option>
                    <option value="40">40cm</option>
                    <option value="50">50cm</option>
                    <option value="60">60cm</option>
                    <option value="70">70cm</option>
                    <option value="80">80cm</option>
                    <option value="90">90cm</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <select
                    value={filtroTextura}
                    onChange={(e) => setFiltroTextura(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="todos">Todas as texturas</option>
                    <option value="liso">Liso</option>
                    <option value="ondulado">Ondulado</option>
                    <option value="cacheado">Cacheado</option>
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
                    length={produto.length}
                    type={produto.type}
                    color={produto.color}
                    rating={produto.rating}
                    reviews={produto.reviews}
                    inStock={produto.inStock}
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
                    setFiltroComprimento('todos');
                    setFiltroTextura('todos');
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
