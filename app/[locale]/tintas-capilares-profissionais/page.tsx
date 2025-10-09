'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Palette, Shield, Sparkles, CheckCircle, Star, Award } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import ProductCard from '../../../components/products/SimpleProductCard';
import { staticProducts } from '../../../lib/data/staticProducts';
import { BreadcrumbSchema, FAQSchema } from '../../../components/seo/UnifiedSchema';

export default function TintasCapilaresPage() {
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'loreal' | 'biocolor' | 'beauty'>('all');

  const tintasProducts = staticProducts.filter(p =>
    p.id.includes('loreal') ||
    p.id.includes('biocolor') ||
    p.id.includes('beautycolor') ||
    p.id.includes('amend') ||
    p.id.includes('nutrisse') ||
    p.id.includes('altamoda')
  ).slice(0, 24);

  const filteredProducts = tintasProducts.filter(p => {
    if (selectedBrand === 'all') return true;
    if (selectedBrand === 'loreal') return p.id.includes('loreal');
    if (selectedBrand === 'biocolor') return p.id.includes('biocolor');
    if (selectedBrand === 'beauty') return p.id.includes('beauty');
    return true;
  });

  const breadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Cosméticos', url: '/cosmeticos' },
    { name: 'Tintas Capilares Profissionais', url: '/tintas-capilares-profissionais' }
  ];

  const faqs = [
    {
      question: 'Qual a melhor tinta capilar profissional?',
      answer: 'Depende do objetivo: L\'Oréal Excellence e Alfaparf Alta Moda são premium com cobertura 100% brancos e maior durabilidade (até 8 semanas). BioColor e Beauty Color oferecem excelente custo-benefício com hidratação e tons vibrantes. Amend e Garnier Nutrisse nutrem enquanto colorem. Para salões profissionais: Alfaparf e L\'Oréal. Para uso doméstico: BioColor e Garnier.'
    },
    {
      question: 'Como escolher o tom de tinta capilar ideal?',
      answer: 'Regra geral: tons quentes (dourados, acobreados) para pele quente/amarelada; tons frios (acinzentados, violeta) para pele fria/rosada. Para clarear: no máximo 2 tons acima da base natural sem descoloração. Para cobrir brancos: mesma altura de tom ou mais escuro. Considere: cor atual, porcentagem de brancos, resultado desejado. Faça teste de mecha antes de aplicar em toda cabeça.'
    },
    {
      question: 'Tinta capilar profissional danifica o cabelo?',
      answer: 'Tintas de qualidade com tecnologia moderna (L\'Oréal, Alfaparf) causam danos mínimos quando aplicadas corretamente. Contêm óleos nutritivos, queratina e ativos protetores. Para minimizar danos: use oxidante correto (20vol para colorir, 30vol para clarear 1-2 tons), não deixe mais tempo que indicado, faça hidratação profunda pós-coloração, use shampoo para cabelos coloridos. Evite colorações frequentes sobre mesmo comprimento.'
    },
    {
      question: 'Quanto tempo dura a coloração capilar profissional?',
      answer: 'Coloração permanente: 4-8 semanas com cuidados adequados. Semi-permanente: 2-4 semanas (6-12 lavagens). Tonalizante: 1-2 semanas (3-5 lavagens). Para prolongar cor: shampoo sem sulfato, condicionador para cabelos coloridos, evite água muito quente, proteja do sol, hidrate semanalmente, evite cloro. Tons vermelhos e cobre desbotam mais rápido (retoque 4 semanas), castanhos e pretos duram mais (retoque 6-8 semanas).'
    },
    {
      question: 'Posso aplicar tinta capilar em cabelo com química?',
      answer: 'Sim, com cautela. Aguarde 15 dias após progressiva/alisamento/botox. Para cabelos descoloridos: use tons mais escuros ou neutros (evite loiros frios que podem ficar esverdeados). Cabelos com muita química precisam reconstrução antes de colorir (teste porosidade: fio muito poroso absorve cor demais, pouco poroso não absorve). Sempre faça teste de mecha para verificar resultado e integridade do fio.'
    }
  ];

  return (
    <>
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-white">
        <section className="relative bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 text-white py-24 mt-16 lg:mt-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold mb-6">
                🎨 Tintas Capilares Profissionais - Cobertura 100% Brancos
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Tintas Capilares Profissionais<br />
                <span className="text-fuchsia-200">Coloração Perfeita e Duradoura</span>
              </h1>
              <p className="text-xl lg:text-2xl text-violet-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                As melhores marcas de coloração capilar: <strong>L'Oréal, Alfaparf, BioColor, Amend</strong>. Cobertura total, cores vibrantes e proteção para seus cabelos.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Palette className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">100+ Tons</div>
                  <div className="text-sm text-violet-100">Todas as Cores</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Cobertura</div>
                  <div className="text-sm text-violet-100">100% Brancos</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Durabilidade</div>
                  <div className="text-sm text-violet-100">8 Semanas</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Premium</div>
                  <div className="text-sm text-violet-100">Marcas Top</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#produtos" className="bg-white text-violet-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-violet-50 transition-all shadow-lg">Ver Produtos Premium</a>
                <a href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre tintas capilares" target="_blank" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-violet-600 transition-all">Falar com Especialista</a>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-fuchsia-200">
                <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}</div>
                <span className="font-semibold">4.8/5.0</span>
                <span className="text-violet-100">| 7.234+ clientes satisfeitos</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
              Principais Marcas de Tintas Capilares
            </h2>
            <p className="text-xl text-gray-600 mb-16 text-center max-w-3xl mx-auto">
              Trabalhamos apenas com marcas reconhecidas mundialmente por qualidade e resultados profissionais.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  brand: 'L\'Oréal Paris & Alfaparf',
                  icon: <Award className="w-12 h-12 text-violet-500" />,
                  description: 'Premium: cobertura 100% brancos, tecnologia triplo cuidado, maior durabilidade (8 semanas). Cores profissionais vibrantes e uniformes. Ideal para salões e exigentes.'
                },
                {
                  brand: 'BioColor & Beauty Color',
                  icon: <Sparkles className="w-12 h-12 text-pink-500" />,
                  description: 'Custo-benefício: ótima cobertura, hidratação com óleos, pronta em 20 minutos. Cores naturais e vibrantes. Excelente para uso doméstico com resultado profissional.'
                },
                {
                  brand: 'Amend & Garnier Nutrisse',
                  icon: <Shield className="w-12 h-12 text-purple-500" />,
                  description: 'Nutritivas: colorem + nutrem com keratina e óleos vegetais. Proteção antifade, brilho intenso. Perfeitas para cabelos frágeis ou com química que precisam colorir com cuidado.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.brand}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="produtos" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
              Catálogo de Tintas Capilares Premium
            </h2>
            <p className="text-xl text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Mais de 100 tons disponíveis: pretos, castanhos, louros, ruivos e especiais.
            </p>

            <div className="flex justify-center gap-4 mb-12">
              <Button onClick={() => setSelectedBrand('all')} className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedBrand === 'all' ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Todas as Marcas
              </Button>
              <Button onClick={() => setSelectedBrand('loreal')} className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedBrand === 'loreal' ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                L'Oréal Premium
              </Button>
              <Button onClick={() => setSelectedBrand('biocolor')} className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedBrand === 'biocolor' ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                BioColor
              </Button>
              <Button onClick={() => setSelectedBrand('beauty')} className={`px-6 py-3 rounded-full font-semibold transition-all ${selectedBrand === 'beauty' ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                Beauty Color
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} id={product.id} nome={product.nome} marca={product.marca} descricao={product.descricao} imagens={product.imagens} badge={product.badge} pricing={product.pricing} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/cosmeticos" className="inline-block bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-lg">Ver Todas as Tintas Capilares</Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-16 text-center">
              Perguntas Frequentes sobre Tintas Capilares
            </h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <summary className="p-6 cursor-pointer font-bold text-lg text-gray-900 hover:text-violet-600 transition-colors flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="text-violet-500 text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-200 pt-4">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Coloração Profissional em Casa!</h2>
            <p className="text-xl lg:text-2xl text-violet-100 mb-10 max-w-3xl mx-auto">
              Tintas capilares premium com <strong>entrega rápida em toda Europa</strong>. Frete grátis acima de €150.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="#produtos" className="bg-white text-violet-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-violet-50 transition-all shadow-2xl">Comprar Agora</a>
              <a href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre tintas capilares" target="_blank" className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-violet-600 transition-all">Falar no WhatsApp</a>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Explore Mais Produtos</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <Link href="/progressiva-brasileira" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">🌟</div>
                <div className="font-semibold text-gray-900">Progressiva Brasileira</div>
              </Link>
              <Link href="/botox-capilar" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">✨</div>
                <div className="font-semibold text-gray-900">Botox Capilar</div>
              </Link>
              <Link href="/mega-hair-brasileiro" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">💇‍♀️</div>
                <div className="font-semibold text-gray-900">Mega Hair Brasileiro</div>
              </Link>
              <Link href="/maquiagens" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">💄</div>
                <div className="font-semibold text-gray-900">Maquiagens</div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
