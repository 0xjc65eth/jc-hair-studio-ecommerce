'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Award, CheckCircle, Star } from 'lucide-react';
import ProductCard from '../../../components/products/SimpleProductCard';
import { staticProducts } from '../../../lib/data/staticProducts';
import { BreadcrumbSchema, FAQSchema } from '../../../components/seo/UnifiedSchema';

export default function ProdutosCabeloCacheadoPage() {
  const cacheadoProducts = staticProducts.filter(p =>
    p.descricao.toLowerCase().includes('cachos') ||
    p.descricao.toLowerCase().includes('cacheado') ||
    p.descricao.toLowerCase().includes('curl') ||
    p.nome.toLowerCase().includes('cachos') ||
    p.nome.toLowerCase().includes('todecacho')
  ).slice(0, 12);

  const breadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Produtos', url: '/produtos' },
    { name: 'Cabelo Cacheado', url: '/produtos-cabelo-cacheado' }
  ];

  const faqs = [
    {
      question: 'Quais os melhores produtos para cabelo cacheado?',
      answer: 'Para cabelos cacheados são essenciais: shampoo low poo ou co-wash (sem sulfato), condicionador nutritivo, leave-in hidratante, creme de pentear com fixação, gel finalizador e óleo capilar. Marcas recomendadas: Salon Line #TodeCacho, Novex Meus Cachos, Bio Extratus Cachos Perfeitos. Para cachos definidos use técnica fitagem ou dedoliss com creme + gel.'
    },
    {
      question: 'Como cuidar de cabelo cacheado tipo 3A, 3B e 3C?',
      answer: '3A (cachos soltos): hidratação leve semanal, produtos sem peso, finalize com difusor. 3B (cachos médios): hidratação moderada 2x semana, cremes com fixação média, técnica fitagem. 3C (cachos fechados): hidratação profunda 3x semana, cremes densos, gel forte, finalização com touca de cetim. Todos: nunca escove seco, use pente garfo ou dedos para desembaraçar.'
    },
    {
      question: 'O que é cronograma capilar para cabelos cacheados?',
      answer: 'Cronograma capilar é sequência de tratamentos: Semana 1: hidratação (repõe água), Semana 2: nutrição (repõe lipídios com óleos), Semana 3: reconstrução (repõe proteínas), Semana 4: hidratação. Para cachos químicos ou muito secos: 2 hidratações + 1 nutrição + 1 reconstrução mensalmente. Ajuste conforme necessidade: cabelo ressecado precisa mais hidratação/nutrição, cabelo elástico precisa mais reconstrução.'
    },
    {
      question: 'Posso fazer progressiva ou botox em cabelo cacheado?',
      answer: 'Sim, mas com cautela. Botox capilar mantém cachos enquanto hidrata e reduz frizz levemente - ideal para cachos 3A/3B. Progressiva brasileira alisa mais, transformando 3B/3C em ondulado 2A/2B - bom para quem quer reduzir volume significativamente. Para manter cachos saudáveis, prefira botox, cauterização ou reconstrução. Evite alisamentos fortes se quiser preservar textura natural.'
    },
    {
      question: 'Como definir cachos sem produtos caros?',
      answer: 'Método caseiro eficaz: 1) Lave com shampoo sem sulfato, 2) Condicione generosamente e desembarace com pente de dentes largos, 3) Com cabelo úmido aplique creme caseiro (leave-in + gel de linhaça ou babosa), 4) Finalize com técnica fitagem ou dedoliss, 5) Amasse suavemente de baixo para cima, 6) Deixe secar naturalmente ou com difusor. Ingredientes baratos: gel linhaça, babosa, óleo de coco, vinagre de maçã (selagem).'
    }
  ];

  return (
    <>
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-white">
        <section className="relative bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-500 text-white py-24 mt-16 lg:mt-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold mb-6">
                🌀 Produtos Premium para Cabelo Cacheado
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Produtos para Cabelo Cacheado<br />
                <span className="text-yellow-200">Cachos Definidos, Hidratados e Sem Frizz</span>
              </h1>
              <p className="text-xl lg:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Linha completa para <strong>definição, hidratação e cuidado</strong> de cachos 2A a 4C. Produtos profissionais brasileiros testados e aprovados.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Definição</div>
                  <div className="text-sm text-amber-100">Máxima</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Heart className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Hidratação</div>
                  <div className="text-sm text-amber-100">Profunda</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Anti-Frizz</div>
                  <div className="text-sm text-amber-100">Duradouro</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Natural</div>
                  <div className="text-sm text-amber-100">Sem Química</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#produtos" className="bg-white text-amber-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-50 transition-all shadow-lg">Ver Produtos Premium</a>
                <a href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre produtos para cabelo cacheado" target="_blank" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-amber-600 transition-all">Falar com Especialista</a>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-yellow-200">
                <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}</div>
                <span className="font-semibold">4.9/5.0</span>
                <span className="text-amber-100">| 6.432+ clientes satisfeitos</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
              Tipos de Cachos e Cuidados Específicos
            </h2>
            <p className="text-xl text-gray-600 mb-16 text-center max-w-3xl mx-auto">
              Cada tipo de cacho precisa de cuidados específicos. Descubra o seu!
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                {
                  type: '2A - 2C',
                  title: 'Ondulado',
                  description: 'Ondas leves a definidas. Produtos leves, low poo, leave-in sem peso, finalizador spray. Evite cremes pesados que deixam oleoso.'
                },
                {
                  type: '3A - 3B',
                  title: 'Cacheado',
                  description: 'Cachos médios a definidos. Hidratação moderada, creme fixação média, gel leve. Técnica fitagem ou dedoliss para definição.'
                },
                {
                  type: '3C - 4A',
                  title: 'Cacheado Fechado',
                  description: 'Cachos pequenos e fechados. Hidratação intensa, cremes densos, gel forte, óleos. Co-wash, umectação mensal com óleo de coco.'
                },
                {
                  type: '4B - 4C',
                  title: 'Crespo/Afro',
                  description: 'Cachos muito fechados ou zig-zag. Super hidratação 3x semana, manteigas vegetais, óleos puros, finalização com creme + gel + óleo.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                  <div className="text-4xl mb-4 text-center">🌀</div>
                  <div className="text-amber-600 font-bold text-lg mb-2 text-center">{item.type}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="produtos" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
              Produtos Premium para Cabelo Cacheado
            </h2>
            <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Linha completa: shampoos, condicionadores, máscaras, leave-ins, cremes e finalizadores.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {cacheadoProducts.map((product) => (
                <ProductCard key={product.id} id={product.id} nome={product.nome} marca={product.marca} descricao={product.descricao} imagens={product.imagens} badge={product.badge} pricing={product.pricing} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/produtos?categoria=tratamentos-capilares" className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">Ver Catálogo Completo</Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-16 text-center">
              Perguntas Frequentes sobre Cabelo Cacheado
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <summary className="p-6 cursor-pointer font-bold text-lg text-gray-900 hover:text-amber-600 transition-colors flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="text-amber-500 text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-200 pt-4">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Cuide dos Seus Cachos com Produtos Premium!</h2>
            <p className="text-xl lg:text-2xl text-amber-100 mb-10 max-w-3xl mx-auto">
              Produtos profissionais para cabelo cacheado com <strong>entrega rápida em toda Europa</strong>. Frete grátis acima de €150.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="#produtos" className="bg-white text-amber-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-amber-50 transition-all shadow-2xl">Comprar Agora</a>
              <a href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre produtos para cabelo cacheado" target="_blank" className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-amber-600 transition-all">Falar no WhatsApp</a>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Explore Mais Tratamentos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <Link href="/hidratacao-capilar-profunda" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">💧</div>
                <div className="font-semibold text-gray-900">Hidratação Profunda</div>
              </Link>
              <Link href="/botox-capilar" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">✨</div>
                <div className="font-semibold text-gray-900">Botox Capilar</div>
              </Link>
              <Link href="/reconstrucao-capilar" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">🔧</div>
                <div className="font-semibold text-gray-900">Reconstrução Capilar</div>
              </Link>
              <Link href="/mega-hair-brasileiro" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">💇‍♀️</div>
                <div className="font-semibold text-gray-900">Mega Hair Brasileiro</div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
