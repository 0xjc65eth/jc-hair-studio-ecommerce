'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, Shield, Zap, CheckCircle, Star, Heart } from 'lucide-react';
import ProductCard from '../../../components/products/SimpleProductCard';
import { staticProducts } from '../../../lib/data/staticProducts';
import { BreadcrumbSchema, FAQSchema } from '../../../components/seo/UnifiedSchema';

export default function ReconstrucaoCapilarPage() {
  const reconstrucaoProducts = staticProducts.filter(p =>
    p.descricao.toLowerCase().includes('reconstru') ||
    p.descricao.toLowerCase().includes('cauteriza') ||
    p.descricao.toLowerCase().includes('reparaç') ||
    p.descricao.toLowerCase().includes('força')
  ).slice(0, 12);

  const breadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Tratamentos Capilares', url: '/tratamentos-capilares' },
    { name: 'Reconstrução Capilar', url: '/reconstrucao-capilar' }
  ];

  const faqs = [
    {
      question: 'O que é reconstrução capilar e quando fazer?',
      answer: 'Reconstrução capilar é um tratamento que repõe proteínas (queratina, colágeno, creatina) na fibra capilar para devolver resistência, força e elasticidade aos fios. Indicado para cabelos quebradiços, elásticos, porosos, com muita química (colorações, descolorações, alisamentos) ou calor excessivo. Faça 1x por mês ou quando cabelo estiver esticando muito ao pentear.'
    },
    {
      question: 'Qual a diferença entre reconstrução capilar e hidratação?',
      answer: 'Reconstrução repõe proteínas (massa) para fortalecer fios quebrados e elásticos. Hidratação repõe água para fios ressecados e sem brilho. Nutrição repõe lipídios para fios opacos. O ideal é alternar: cabelos danificados precisam de mais reconstrução (2x mês), cabelos normais 1x mês. Excesso de reconstrução pode deixar cabelo duro e quebradiço.'
    },
    {
      question: 'Como fazer reconstrução capilar em casa?',
      answer: 'Lave com shampoo, aplique produto de reconstrução (máscara proteica, cauterização) do comprimento às pontas, massageie, deixe 20-30min com touca térmica (calor potencializa), enxágue parcialmente (deixe 30% do produto), seque com secador e finalize com chapinha para selar proteínas. Use 1x por mês. Se cabelo ficar duro, faça hidratação profunda.'
    },
    {
      question: 'Quais os sinais de que preciso fazer reconstrução capilar?',
      answer: 'Cabelo quebradiço que parte facilmente, pontas duplas, fios elásticos que esticam demais ao pentear (sinal de falta de proteína), ausência de volume, cabelo fino e sem corpo, danos por química ou calor, porosidade alta (cabelo absorve água rapidamente mas não retém). Teste: estique fio molhado, se esticar muito sem voltar, precisa reconstrução.'
    },
    {
      question: 'Posso fazer reconstrução capilar toda semana?',
      answer: 'Não! Excesso de proteína causa rigidez, quebra e efeito "cabelo de boneca" (duro, sem movimento). Para cabelos muito danificados: 2x mês nas primeiras 6 semanas, depois 1x mês. Cabelos normais: 1x mês. Entre reconstruções, faça hidratação e nutrição. Ouça seu cabelo: se ficar duro após reconstrução, reduza frequência e hidrate mais.'
    }
  ];

  return (
    <>
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-white">
        <section className="relative bg-gradient-to-br from-red-600 via-rose-500 to-pink-500 text-white py-24 mt-16 lg:mt-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold mb-6">
                🔧 Reconstrução Capilar - Força e Resistência
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Reconstrução Capilar Profissional<br />
                <span className="text-rose-200">Devolva Força aos Cabelos Danificados</span>
              </h1>
              <p className="text-xl lg:text-2xl text-red-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Tratamento intensivo que <strong>reconstrói fibra capilar</strong> com proteínas de alta performance. Elimina quebra, pontas duplas e restaura resistência.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Wrench className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Reconstrução</div>
                  <div className="text-sm text-red-100">Proteica</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Fortalece</div>
                  <div className="text-sm text-red-100">Fibra Capilar</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Zap className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Instantâneo</div>
                  <div className="text-sm text-red-100">Resultado Rápido</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Heart className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Revitaliza</div>
                  <div className="text-sm text-red-100">Cabelos Mortos</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#produtos" className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition-all shadow-lg">Ver Produtos Premium</a>
                <a href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre reconstrução capilar" target="_blank" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all">Falar com Especialista</a>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-rose-200">
                <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}</div>
                <span className="font-semibold">4.8/5.0</span>
                <span className="text-red-100">| 3.156+ clientes satisfeitos</span>
              </div>
            </div>
          </div>
        </section>

        <section id="produtos" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
              Produtos de Reconstrução Capilar Premium
            </h2>
            <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Tratamentos proteicos profissionais para cabelos danificados e quebradiços.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {reconstrucaoProducts.map((product) => (
                <ProductCard key={product.id} id={product.id} nome={product.nome} marca={product.marca} descricao={product.descricao} imagens={product.imagens} badge={product.badge} pricing={product.pricing} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/produtos?categoria=tratamentos-capilares" className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-lg">Ver Catálogo Completo</Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-16 text-center">
              Perguntas Frequentes sobre Reconstrução Capilar
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <summary className="p-6 cursor-pointer font-bold text-lg text-gray-900 hover:text-red-600 transition-colors flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="text-red-500 text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-200 pt-4">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Reconstrua Seus Cabelos Agora!</h2>
            <p className="text-xl lg:text-2xl text-red-100 mb-10 max-w-3xl mx-auto">
              Produtos premium de reconstrução capilar com <strong>entrega rápida em toda Europa</strong>. Frete grátis acima de €150.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="#produtos" className="bg-white text-red-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-red-50 transition-all shadow-2xl">Comprar Agora</a>
              <a href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre reconstrução capilar" target="_blank" className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-red-600 transition-all">Falar no WhatsApp</a>
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
              <Link href="/hidratacao-capilar-profunda" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">💧</div>
                <div className="font-semibold text-gray-900">Hidratação Profunda</div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
