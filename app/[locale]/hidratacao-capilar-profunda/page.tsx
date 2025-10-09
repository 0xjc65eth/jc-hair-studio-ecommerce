'use client';

import React from 'react';
import Link from 'next/link';
import { Droplet, Heart, Sparkles, CheckCircle, Star } from 'lucide-react';
import ProductCard from '../../../components/products/SimpleProductCard';
import { staticProducts } from '../../../lib/data/staticProducts';
import { BreadcrumbSchema, FAQSchema } from '../../../components/seo/UnifiedSchema';

export default function HidratacaoCapilarPage() {
  const hidratacaoProducts = staticProducts.filter(p =>
    p.descricao.toLowerCase().includes('hidrataç') ||
    p.descricao.toLowerCase().includes('máscara') ||
    p.descricao.toLowerCase().includes('nutri') ||
    p.nome.toLowerCase().includes('gelato') ||
    p.nome.toLowerCase().includes('leave')
  ).slice(0, 15);

  const breadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Tratamentos Capilares', url: '/tratamentos-capilares' },
    { name: 'Hidratação Capilar Profunda', url: '/hidratacao-capilar-profunda' }
  ];

  const faqs = [
    {
      question: 'O que é hidratação capilar profunda e para que serve?',
      answer: 'Hidratação capilar profunda é um tratamento intensivo que repõe água, nutrientes e lipídios nos fios ressecados. Utiliza máscaras ultra-hidratantes com ativos como ácido hialurônico, manteigas vegetais (karité, cacau), óleos naturais e vitaminas. Serve para recuperar maciez, brilho, elasticidade e saúde dos cabelos danificados por química, calor ou falta de cuidados. Recomendado semanalmente ou quinzenalmente.'
    },
    {
      question: 'Qual a diferença entre hidratação, nutrição e reconstrução capilar?',
      answer: 'Hidratação repõe água nos fios com ativos umectantes, ideal para cabelos ressecados e sem brilho. Nutrição repõe lipídios (óleos e manteigas) para cabelos opacos e porosos. Reconstrução repõe proteínas para cabelos quebradiços e elásticos. Para cabelos saudáveis, faça: 2 hidratações + 1 nutrição + 1 reconstrução mensalmente (cronograma capilar).'
    },
    {
      question: 'Como fazer hidratação capilar profunda em casa?',
      answer: 'Lave com shampoo, remova excesso de água, aplique máscara hidratante generosamente do comprimento às pontas (evite raiz oleosa), cubra com touca térmica, deixe 20-30 minutos (pode aplicar calor com secador), enxágue bem com água fria, finalize com leave-in. Para potencializar, adicione 1 ampola de tratamento à máscara.'
    },
    {
      question: 'Com que frequência devo fazer hidratação capilar profunda?',
      answer: 'Cabelos normais: 1x por semana. Cabelos secos/danificados: 2-3x por semana. Cabelos muito ressecados ou com química: dia sim, dia não por 30 dias, depois 2x semana. Ouça seu cabelo: se estiver ressecado, hidrate mais; se estiver pesado/oleoso, reduza frequência. Use hidratantes leves para maior frequência.'
    },
    {
      question: 'Quais os melhores produtos para hidratação capilar profunda?',
      answer: 'Máscaras com ácido hialurônico, aloe vera, pantenol e glicerina são excelentes. Para potencializar: Novex (gelato, blindagem), Salon Line (bomba de vitaminas), Bio Extratus (tutano, microqueratina). Combine com ampolas de tratamento, óleos vegetais puros ou reconstrução lamelar. Escolha conforme necessidade: leves para uso frequente, densas para cabelos muito secos.'
    }
  ];

  return (
    <>
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-white">
        <section className="relative bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 text-white py-24 mt-16 lg:mt-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold mb-6">
                💧 Hidratação Capilar Profunda - Nutrição Intensiva
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Hidratação Capilar Profunda<br />
                <span className="text-cyan-200">Cabelos Macios, Brilhantes e Revitalizados</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Tratamento intensivo que <strong>devolve vida, maciez e brilho</strong> aos cabelos ressecados. Resultados visíveis desde a primeira aplicação com produtos brasileiros premium.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Droplet className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">72H</div>
                  <div className="text-sm text-blue-100">Hidratação</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Heart className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Nutrição</div>
                  <div className="text-sm text-blue-100">Intensa</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Brilho</div>
                  <div className="text-sm text-blue-100">Espelhado</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Maciez</div>
                  <div className="text-sm text-blue-100">Extrema</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#produtos" className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-lg">
                  Ver Produtos Premium
                </a>
                <a href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre hidratação capilar" target="_blank" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all">
                  Falar com Especialista
                </a>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-cyan-200">
                <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}</div>
                <span className="font-semibold">4.9/5.0</span>
                <span className="text-blue-100">| 5.892+ clientes satisfeitos</span>
              </div>
            </div>
          </div>
        </section>

        <section id="produtos" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
              Produtos de Hidratação Profunda Premium
            </h2>
            <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Máscaras, ampolas e leave-ins com os melhores ativos hidratantes do mercado.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {hidratacaoProducts.map((product) => (
                <ProductCard key={product.id} id={product.id} nome={product.nome} marca={product.marca} descricao={product.descricao} imagens={product.imagens} badge={product.badge} pricing={product.pricing} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/produtos?categoria=tratamentos-capilares" className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg">
                Ver Catálogo Completo
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-16 text-center">
              Perguntas Frequentes sobre Hidratação Capilar
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <summary className="p-6 cursor-pointer font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="text-blue-500 text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-200 pt-4">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Hidrate Seus Cabelos Agora!</h2>
            <p className="text-xl lg:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Produtos premium de hidratação capilar com <strong>entrega rápida em toda Europa</strong>. Frete grátis acima de €150.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="#produtos" className="bg-white text-blue-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-blue-50 transition-all shadow-2xl">Comprar Agora</a>
              <a href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre hidratação capilar" target="_blank" className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-blue-600 transition-all">Falar no WhatsApp</a>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Explore Mais Tratamentos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <Link href="/progressiva-brasileira" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">🌟</div>
                <div className="font-semibold text-gray-900">Progressiva Brasileira</div>
              </Link>
              <Link href="/botox-capilar" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">✨</div>
                <div className="font-semibold text-gray-900">Botox Capilar</div>
              </Link>
              <Link href="/queratina-brasileira" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">💎</div>
                <div className="font-semibold text-gray-900">Queratina Brasileira</div>
              </Link>
              <Link href="/reconstrucao-capilar" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">🔧</div>
                <div className="font-semibold text-gray-900">Reconstrução Capilar</div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
