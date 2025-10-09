'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Clock, Star, CheckCircle, TrendingUp, Heart, Award } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import ProductCard from '../../../components/products/SimpleProductCard';
import { staticProducts } from '../../../lib/data/staticProducts';
import UnifiedSchema, { BreadcrumbSchema, FAQSchema } from '../../../components/seo/UnifiedSchema';

export default function ProgressivaBrasileiraPage() {
  const [selectedPrice, setSelectedPrice] = useState<'all' | 'budget' | 'premium'>('all');

  // Filter progressive products
  const progressivaProducts = staticProducts.filter(p =>
    p.descricao.toLowerCase().includes('progressiv') ||
    p.descricao.toLowerCase().includes('queratina') ||
    p.descricao.toLowerCase().includes('alisamento')
  ).slice(0, 12);

  const filteredProducts = progressivaProducts.filter(p => {
    if (selectedPrice === 'all') return true;
    const price = p.pricing?.ourPrice || 0;
    if (selectedPrice === 'budget') return price < 150;
    if (selectedPrice === 'premium') return price >= 150;
    return true;
  });

  // Breadcrumbs for SEO
  const breadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Tratamentos Capilares', url: '/tratamentos-capilares' },
    { name: 'Progressiva Brasileira', url: '/progressiva-brasileira' }
  ];

  // FAQs for rich snippets
  const faqs = [
    {
      question: 'O que é progressiva brasileira e como funciona?',
      answer: 'A progressiva brasileira é um tratamento capilar profissional que alisa os fios através da aplicação de queratina e selamento térmico. O processo reconstrói a fibra capilar, reduz o volume e elimina o frizz, proporcionando cabelos lisos, brilhantes e saudáveis por até 4 meses. Nossa fórmula brasileira premium oferece resultados superiores com ingredientes naturais.'
    },
    {
      question: 'Quanto tempo dura o efeito da progressiva brasileira?',
      answer: 'A progressiva brasileira tem duração média de 3 a 4 meses, dependendo dos cuidados pós-tratamento. Para manter os resultados por mais tempo, recomendamos uso de shampoos sem sulfato, condicionadores específicos e evitar água com cloro nas primeiras semanas. Nossos produtos premium brasileiros garantem maior durabilidade.'
    },
    {
      question: 'Qual a diferença entre progressiva brasileira e outras progressivas?',
      answer: 'A progressiva brasileira se destaca pela fórmula exclusiva com queratina de alta qualidade, óleos naturais da Amazônia e tecnologia avançada de selamento. Oferece alisamento mais natural, maior brilho, menos danos aos fios e resultados mais duradouros comparado a progressivas convencionais. É ideal para todos os tipos de cabelo, especialmente cabelos grossos e resistentes.'
    },
    {
      question: 'A progressiva brasileira danifica o cabelo?',
      answer: 'Não! Quando aplicada corretamente com produtos de qualidade, a progressiva brasileira não danifica os fios. Pelo contrário, ela reconstrói a fibra capilar com queratina, aminoácidos e óleos nutritivos. Nossas fórmulas são livres de formol e desenvolvidas para nutrir enquanto alisam. Sempre recomendamos aplicação profissional e produtos pós-tratamento adequados.'
    },
    {
      question: 'Posso fazer progressiva brasileira em cabelo colorido ou descolorido?',
      answer: 'Sim! A progressiva brasileira pode ser aplicada em cabelos coloridos, descoloridos ou com mechas. Recomendamos aguardar pelo menos 15 dias após coloração ou descoloração. Para cabelos muito danificados, sugerimos tratamento de reconstrução capilar antes da progressiva. Nossos produtos premium são formulados para proteger a cor e a saúde dos fios.'
    },
    {
      question: 'Qual o preço médio de progressiva brasileira em Portugal?',
      answer: 'Em Portugal, progressivas brasileiras profissionais variam de €124 a €304, dependendo da marca, tamanho e qualidade. Oferecemos as melhores marcas brasileiras com preços competitivos de €124 a €274, com entrega rápida em toda Europa. Produtos de 1L rendem até 8 aplicações em salões profissionais.'
    }
  ];

  return (
    <>
      {/* Schema.org Structured Data */}
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-white">
        {/* Hero Section - Above the Fold */}
        <section className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 text-white py-24 mt-16 lg:mt-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="mb-6">
                <span className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold mb-4">
                  🇧🇷 Autêntica Progressiva Brasileira Premium
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Progressiva Brasileira Profissional<br />
                <span className="text-yellow-200">Alisamento Perfeito por até 4 Meses</span>
              </h1>
              <p className="text-xl lg:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Descubra o segredo dos salões brasileiros mais renomados. Queratina premium, tecnologia avançada e resultados comprovados. <strong>Cabelos lisos, brilhantes e sem frizz</strong> com as melhores marcas do Brasil.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Clock className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">3-4 Meses</div>
                  <div className="text-sm text-orange-100">Duração Garantida</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">0% Formol</div>
                  <div className="text-sm text-orange-100">Seguro e Saudável</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Brilho Intenso</div>
                  <div className="text-sm text-orange-100">Efeito Profissional</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Top Marcas</div>
                  <div className="text-sm text-orange-100">Brasileiras Premium</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#produtos"
                  className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Ver Produtos Premium
                </a>
                <a
                  href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre progressiva brasileira"
                  target="_blank"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-600 transition-all"
                >
                  Falar com Especialista
                </a>
              </div>

              {/* Social Proof */}
              <div className="mt-8 flex items-center justify-center gap-2 text-yellow-200">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="font-semibold">4.9/5.0</span>
                <span className="text-orange-100">| 2.847+ clientes satisfeitos</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Por que escolher Progressiva Brasileira?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A progressiva brasileira é reconhecida mundialmente como o melhor tratamento de alisamento capilar. Desenvolvida no Brasil, combina tecnologia avançada com ingredientes naturais da Amazônia.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: <Sparkles className="w-12 h-12 text-orange-500" />,
                  title: 'Queratina Premium de Alta Qualidade',
                  description: 'Queratina brasileira hidrolisada com moléculas menores penetra profundamente nos fios. Reconstrói a fibra capilar, sela cutículas e proporciona alisamento duradouro com brilho espelhado.'
                },
                {
                  icon: <Shield className="w-12 h-12 text-green-500" />,
                  title: 'Fórmulas Seguras Livres de Formol',
                  description: 'Nossas progressivas brasileiras são 100% seguras, livres de formol e substâncias nocivas. Desenvolvidas com aminoácidos, óleos naturais e proteínas para alisamento sem agredir os fios.'
                },
                {
                  icon: <Clock className="w-12 h-12 text-blue-500" />,
                  title: 'Resultados de Longa Duração',
                  description: 'Efeito liso e brilhante por 3 a 4 meses. A tecnologia brasileira garante maior fixação da queratina, redução progressiva do volume e fios disciplinados por muito mais tempo.'
                },
                {
                  icon: <Heart className="w-12 h-12 text-pink-500" />,
                  title: 'Nutrição e Hidratação Profunda',
                  description: 'Enriquecida com óleos da Amazônia (argan, coco, buriti, açaí), manteigas vegetais e vitaminas. Alisa enquanto nutre, repara danos e devolve vida aos cabelos ressecados.'
                },
                {
                  icon: <TrendingUp className="w-12 h-12 text-purple-500" />,
                  title: 'Versátil para Todos os Tipos de Cabelo',
                  description: 'Funciona em cabelos lisos, ondulados, cacheados e crespos. Ideal para cabelos grossos, volumosos, rebeldes ou danificados. Pode ser aplicada em cabelos coloridos e descoloridos.'
                },
                {
                  icon: <Award className="w-12 h-12 text-amber-500" />,
                  title: 'Marcas Brasileiras Reconhecidas',
                  description: 'Trabalhamos apenas com marcas premium brasileiras: COCOCHOCO, Brasil Cacau, Forever Liss, Cadiveu, Ineya. Qualidade profissional testada e aprovada por milhares de salões.'
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="produtos" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Melhores Progressivas Brasileiras Premium
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Selecionamos as progressivas brasileiras mais vendidas e recomendadas por profissionais. Todas com entrega rápida para Portugal e Europa.
              </p>

              {/* Price Filter */}
              <div className="flex justify-center gap-4 mb-8">
                <Button
                  onClick={() => setSelectedPrice('all')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedPrice === 'all'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos os Produtos
                </Button>
                <Button
                  onClick={() => setSelectedPrice('budget')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedPrice === 'budget'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Até €150
                </Button>
                <Button
                  onClick={() => setSelectedPrice('premium')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedPrice === 'premium'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Premium €150+
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  nome={product.nome}
                  marca={product.marca}
                  descricao={product.descricao}
                  imagens={product.imagens}
                  badge={product.badge}
                  pricing={product.pricing}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 mb-6">Nenhum produto encontrado nesta faixa de preço.</p>
                <Button
                  onClick={() => setSelectedPrice('all')}
                  className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600"
                >
                  Ver Todos os Produtos
                </Button>
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                href="/produtos?categoria=tratamentos-capilares"
                className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
              >
                Ver Catálogo Completo de Tratamentos
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Como Aplicar Progressiva Brasileira
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Guia passo a passo para aplicação profissional de progressiva brasileira com resultados incríveis.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  step: '1',
                  title: 'Preparação e Limpeza Profunda',
                  description: 'Lave o cabelo 2-3 vezes com shampoo anti-resíduos ou clarificante para remover completamente oleosidade, resíduos de produtos e impurezas. Seque 80% dos fios com toalha.'
                },
                {
                  step: '2',
                  title: 'Aplicação da Queratina',
                  description: 'Divida o cabelo em 4 seções. Aplique a progressiva brasileira mecha por mecha, mantendo 1cm de distância da raiz. Use pente fino para distribuir uniformemente do comprimento às pontas.'
                },
                {
                  step: '3',
                  title: 'Tempo de Pausa e Penetração',
                  description: 'Deixe agir conforme instruções do fabricante (geralmente 20-40 minutos). Esse é o momento onde a queratina penetra profundamente nas cutículas e reconstrói a fibra capilar.'
                },
                {
                  step: '4',
                  title: 'Secagem Completa',
                  description: 'Seque 100% dos fios com secador em temperatura média, escovando mecha por mecha para esticar bem os fios. Essa etapa é crucial para um alisamento perfeito.'
                },
                {
                  step: '5',
                  title: 'Selamento com Chapinha',
                  description: 'Passe a chapinha em temperatura 180-230°C (conforme tipo de cabelo) em mechas finas, repetindo 10-15 vezes em cada mecha. O calor sela a queratina criando a transformação.'
                },
                {
                  step: '6',
                  title: 'Finalização Profissional',
                  description: 'Após 3 dias, lave com shampoo sem sulfato e condicionador específico para progressiva. Use máscara hidratante semanalmente e protetor térmico antes de chapinha e secador.'
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-6 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Dicas Importantes de Segurança</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Sempre faça teste de mecha antes da aplicação completa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Use luvas e trabalhe em ambiente bem ventilado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Não aplique em cabelos extremamente danificados (faça reconstrução antes)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Respeite o tempo de pausa entre coloração/descoloração (15 dias)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Perguntas Frequentes sobre Progressiva Brasileira
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tire todas as suas dúvidas sobre progressiva brasileira com nossas respostas detalhadas.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <summary className="p-6 cursor-pointer font-bold text-lg text-gray-900 hover:text-orange-600 transition-colors flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="text-orange-500 text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-200 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-600 via-red-500 to-pink-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Pronta para transformar seu cabelo?
            </h2>
            <p className="text-xl lg:text-2xl text-orange-100 mb-10 max-w-3xl mx-auto">
              Adquira sua progressiva brasileira premium agora com <strong>entrega rápida para toda Europa</strong>. Frete grátis acima de €150.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="#produtos"
                className="bg-white text-orange-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-orange-50 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Comprar Agora
              </a>
              <a
                href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre progressiva brasileira"
                target="_blank"
                className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-orange-600 transition-all"
              >
                Falar no WhatsApp
              </a>
            </div>
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-orange-100">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Entrega Rápida Europa
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Frete Grátis €150+
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Suporte Especializado
              </span>
            </div>
          </div>
        </section>

        {/* Related Links Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Explore Mais Tratamentos Capilares
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <Link href="/mega-hair-brasileiro" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">💇‍♀️</div>
                <div className="font-semibold text-gray-900">Mega Hair Brasileiro</div>
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
