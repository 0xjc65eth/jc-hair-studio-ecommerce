'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Heart, Clock, Shield, Star, CheckCircle, Droplet, Award } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import ProductCard from '../../../components/products/SimpleProductCard';
import { staticProducts } from '../../../lib/data/staticProducts';
import UnifiedSchema, { BreadcrumbSchema, FAQSchema } from '../../../components/seo/UnifiedSchema';

export default function BotoxCapilarPage() {
  const [selectedType, setSelectedType] = useState<'all' | 'intensive' | 'instant'>('all');

  // Filter botox products
  const botoxProducts = staticProducts.filter(p =>
    p.descricao.toLowerCase().includes('botox') ||
    p.descricao.toLowerCase().includes('btox') ||
    p.descricao.toLowerCase().includes('btx') ||
    p.marca.toLowerCase().includes('botox')
  ).slice(0, 15);

  const filteredProducts = botoxProducts.filter(p => {
    if (selectedType === 'all') return true;
    if (selectedType === 'intensive') return p.descricao.toLowerCase().includes('intensiv') || p.descricao.toLowerCase().includes('força');
    if (selectedType === 'instant') return p.descricao.toLowerCase().includes('instantân') || p.descricao.toLowerCase().includes('rápid');
    return true;
  });

  // Breadcrumbs for SEO
  const breadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Tratamentos Capilares', url: '/tratamentos-capilares' },
    { name: 'Botox Capilar', url: '/botox-capilar' }
  ];

  // FAQs for rich snippets
  const faqs = [
    {
      question: 'O que é botox capilar e para que serve?',
      answer: 'Botox capilar é um tratamento de reconstrução profunda que recupera fios danificados, ressecados e sem vida. Diferente do botox facial, o capilar utiliza ativos como colágeno, queratina, aminoácidos e vitaminas para preencher as falhas da fibra capilar, selando cutículas e devolvendo força, brilho e maciez. É ideal para cabelos danificados por química, calor ou processos agressivos.'
    },
    {
      question: 'Qual a diferença entre botox capilar e progressiva?',
      answer: 'Botox capilar foca em hidratação, reconstrução e nutrição profunda dos fios, com leve redução de volume. Progressiva brasileira foca em alisamento com selamento térmico intenso. O botox é mais suave, não alisa tanto mas trata profundamente. Já a progressiva alisa mais mas pode ressecar. Para cabelos muito danificados, recomendamos botox antes de progressiva.'
    },
    {
      question: 'Quanto tempo dura o efeito do botox capilar?',
      answer: 'O efeito do botox capilar dura em média 2 a 3 meses, dependendo dos cuidados pós-tratamento. Para prolongar os resultados, use shampoos sem sulfato, hidratantes específicos e evite lavagens diárias. O botox pode ser reaplicado mensalmente para manutenção ou a cada 2-3 meses para tratamento intensivo.'
    },
    {
      question: 'Botox capilar tem formol? É seguro?',
      answer: 'Não! Os botox capilares modernos e de qualidade são 100% livres de formol e substâncias nocivas. Nossas marcas premium utilizam fórmulas orgânicas com colágeno hidrolisado, aminoácidos, óleos vegetais e vitaminas. São totalmente seguros, aprovados e recomendados para todos os tipos de cabelo, inclusive gestantes (consulte seu médico).'
    },
    {
      question: 'Posso fazer botox capilar em cabelo colorido ou descolorido?',
      answer: 'Sim! Botox capilar é altamente recomendado para cabelos coloridos, descoloridos ou com mechas, pois recupera os danos causados por processos químicos. Aguarde 7 dias após coloração/descoloração para aplicar o botox. O tratamento ajuda a prolongar a duração da cor e devolver a saúde dos fios.'
    },
    {
      question: 'Como aplicar botox capilar em casa?',
      answer: 'Lave o cabelo com shampoo anti-resíduos, seque 80%, aplique o botox mecha por mecha do comprimento às pontas (evitando raiz), deixe agir 20-30 minutos com touca térmica, enxágue parcialmente (30%), seque com secador e finalize com chapinha em temperatura média (180°C) passando 3-5 vezes em cada mecha. Use luvas e siga as instruções do fabricante.'
    }
  ];

  return (
    <>
      {/* Schema.org Structured Data */}
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-white">
        {/* Hero Section - Above the Fold */}
        <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 text-white py-24 mt-16 lg:mt-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="mb-6">
                <span className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold mb-4">
                  ✨ Reconstrução Profunda e Instantânea
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Botox Capilar Premium<br />
                <span className="text-pink-200">Revitalize Cabelos Danificados em Minutos</span>
              </h1>
              <p className="text-xl lg:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                O tratamento revolucionário que <strong>reconstrói, hidrata e revitaliza</strong> fios ressecados e sem vida. Resultados visíveis na primeira aplicação com as melhores marcas brasileiras.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Zap className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">20 Minutos</div>
                  <div className="text-sm text-purple-100">Ação Rápida</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Heart className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Nutrição</div>
                  <div className="text-sm text-purple-100">Profunda Intensiva</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Brilho Extremo</div>
                  <div className="text-sm text-purple-100">Efeito Imediato</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">0% Formol</div>
                  <div className="text-sm text-purple-100">100% Seguro</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="#produtos"
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Ver Produtos Premium
                </a>
                <a
                  href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre botox capilar"
                  target="_blank"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition-all"
                >
                  Falar com Especialista
                </a>
              </div>

              {/* Social Proof */}
              <div className="mt-8 flex items-center justify-center gap-2 text-pink-200">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="font-semibold">4.8/5.0</span>
                <span className="text-purple-100">| 3.421+ clientes satisfeitos</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Benefícios do Botox Capilar
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Descubra por que o botox capilar é o tratamento favorito de milhares de mulheres para recuperar cabelos danificados.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: <Sparkles className="w-12 h-12 text-purple-500" />,
                  title: 'Reconstrução Profunda Instantânea',
                  description: 'Moléculas de colágeno e queratina hidrolisada penetram na fibra capilar, preenchendo falhas e danos. Reconstrói de dentro para fora, devolvendo força, elasticidade e resistência aos fios.'
                },
                {
                  icon: <Droplet className="w-12 h-12 text-blue-500" />,
                  title: 'Hidratação Intensa e Duradoura',
                  description: 'Ativos ultra-hidratantes como ácido hialurônico, pantenol e manteigas vegetais retêm água nos fios por até 3 meses. Elimina ressecamento, pontas duplas e quebra.'
                },
                {
                  icon: <Zap className="w-12 h-12 text-yellow-500" />,
                  title: 'Resultados Imediatos Visíveis',
                  description: 'Transformação visível na primeira aplicação! Cabelos 3x mais brilhantes, macios como seda e com movimento natural. Efeito "cabelo de propaganda" em apenas 20-30 minutos.'
                },
                {
                  icon: <Shield className="w-12 h-12 text-green-500" />,
                  title: 'Proteção Contra Danos Futuros',
                  description: 'Cria uma camada protetora contra raios UV, poluição, cloro e água salgada. Blindagem térmica para uso de chapinha, babyliss e secador sem causar novos danos.'
                },
                {
                  icon: <Heart className="w-12 h-12 text-pink-500" />,
                  title: 'Redução de Volume e Frizz',
                  description: 'Sela as cutículas abertas eliminando frizz, volume excessivo e rebeldia. Cabelos disciplinados, controlados e fáceis de pentear sem perder movimento natural.'
                },
                {
                  icon: <Award className="w-12 h-12 text-amber-500" />,
                  title: 'Fórmulas Seguras e Nutritivas',
                  description: 'Livre de formol, parabenos e substâncias nocivas. Enriquecido com vitaminas E, B5, aminoácidos e óleos essenciais. Pode ser usado em gestantes (consulte médico).'
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
                Melhores Botox Capilares do Mercado
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Selecionamos os botox capilares mais eficazes e recomendados por cabeleireiros profissionais. Resultados garantidos.
              </p>

              {/* Type Filter */}
              <div className="flex justify-center gap-4 mb-8">
                <Button
                  onClick={() => setSelectedType('all')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedType === 'all'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos os Produtos
                </Button>
                <Button
                  onClick={() => setSelectedType('intensive')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedType === 'intensive'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tratamento Intensivo
                </Button>
                <Button
                  onClick={() => setSelectedType('instant')}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedType === 'instant'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ação Instantânea
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
                <p className="text-xl text-gray-600 mb-6">Nenhum produto encontrado nesta categoria.</p>
                <Button
                  onClick={() => setSelectedType('all')}
                  className="bg-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-600"
                >
                  Ver Todos os Produtos
                </Button>
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                href="/produtos?categoria=tratamentos-capilares"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
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
                Como Aplicar Botox Capilar Passo a Passo
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Aprenda a aplicar botox capilar profissionalmente em casa com nosso guia completo.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  step: '1',
                  title: 'Limpeza Profunda do Cabelo',
                  description: 'Lave os cabelos 2 vezes com shampoo anti-resíduos ou clarificante para remover completamente oleosidade, silicones e resíduos de produtos. Isso permite máxima penetração do botox. Seque com toalha até 70-80%.'
                },
                {
                  step: '2',
                  title: 'Aplicação Mecha por Mecha',
                  description: 'Divida o cabelo em 4 seções. Aplique o botox capilar generosamente mecha por mecha com pincel, do meio do comprimento até as pontas. Mantenha 2cm de distância da raiz. Use luvas para proteger as mãos.'
                },
                {
                  step: '3',
                  title: 'Massagem e Distribuição Uniforme',
                  description: 'Massageie cada mecha suavemente para garantir distribuição uniforme. Passe pente de dentes largos para espalhar bem o produto. Todos os fios devem estar bem cobertos pelo botox.'
                },
                {
                  step: '4',
                  title: 'Tempo de Ação com Calor',
                  description: 'Prenda os cabelos e cubra com touca térmica ou filme plástico. Deixe agir 20-30 minutos (conforme fabricante). Você pode aplicar calor com touca térmica elétrica ou secador para potencializar os resultados.'
                },
                {
                  step: '5',
                  title: 'Enxágue Parcial Estratégico',
                  description: 'Enxágue apenas 30% do produto (não retire completamente). Isso permite que os ativos continuem agindo. Seque 100% com secador em temperatura média, escovando suavemente mecha por mecha.'
                },
                {
                  step: '6',
                  title: 'Selamento com Chapinha',
                  description: 'Finalize passando chapinha em temperatura média (180°C) em mechas finas, 3-5 vezes em cada mecha. O calor sela o botox e ativa os ativos. Resultado: cabelos reconstruídos, brilhantes e sedosos!'
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-6 bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
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

            <div className="mt-12 bg-purple-50 border-2 border-purple-200 rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <Sparkles className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Dicas Pro para Resultados Perfeitos</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Para cabelos muito danificados, faça 2-3 sessões consecutivas semanalmente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Use touca térmica ou secador para potencializar a penetração dos ativos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Após o tratamento, use shampoo e condicionador sem sal e sulfato</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Faça manutenção mensal para manter cabelos sempre saudáveis e brilhantes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Botox Capilar vs Outros Tratamentos
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Entenda as diferenças e escolha o melhor tratamento para seu tipo de cabelo.
              </p>
            </div>

            <div className="max-w-5xl mx-auto overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Característica</th>
                    <th className="px-6 py-4 text-center font-bold">Botox Capilar</th>
                    <th className="px-6 py-4 text-center font-bold">Progressiva</th>
                    <th className="px-6 py-4 text-center font-bold">Hidratação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    { feature: 'Objetivo Principal', botox: 'Reconstrução', progressiva: 'Alisamento', hidratacao: 'Hidratação' },
                    { feature: 'Redução de Volume', botox: 'Moderada', progressiva: 'Alta', hidratacao: 'Baixa' },
                    { feature: 'Brilho', botox: 'Extremo', progressiva: 'Alto', hidratacao: 'Moderado' },
                    { feature: 'Duração', botox: '2-3 meses', progressiva: '3-4 meses', hidratacao: '15-30 dias' },
                    { feature: 'Tempo de Aplicação', botox: '20-30 min', progressiva: '2-3 horas', hidratacao: '15-20 min' },
                    { feature: 'Uso de Chapinha', botox: 'Sim (opcional)', progressiva: 'Sim (obrigatório)', hidratacao: 'Não' },
                    { feature: 'Para Cabelos Danificados', botox: 'Excelente', progressiva: 'Não recomendado', hidratacao: 'Bom' },
                    { feature: 'Formol', botox: '0% (produtos quality)', progressiva: '0% (produtos quality)', hidratacao: '0%' }
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-semibold text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-purple-600 font-semibold">{row.botox}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{row.progressiva}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{row.hidratacao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                Perguntas Frequentes sobre Botox Capilar
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Esclareça todas as suas dúvidas sobre botox capilar com respostas de especialistas.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <summary className="p-6 cursor-pointer font-bold text-lg text-gray-900 hover:text-purple-600 transition-colors flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="text-purple-500 text-2xl group-open:rotate-45 transition-transform">+</span>
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
        <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Transforme Seus Cabelos Hoje!
            </h2>
            <p className="text-xl lg:text-2xl text-purple-100 mb-10 max-w-3xl mx-auto">
              Adquira seu botox capilar premium agora com <strong>entrega rápida para toda Europa</strong>. Resultados garantidos ou seu dinheiro de volta.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="#produtos"
                className="bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-purple-50 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                Comprar Agora
              </a>
              <a
                href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre botox capilar"
                target="_blank"
                className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-purple-600 transition-all"
              >
                Falar no WhatsApp
              </a>
            </div>
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-purple-100">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Frete Grátis €150+
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Garantia de Qualidade
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Entrega 5-7 Dias
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
              <Link href="/progressiva-brasileira" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">🌟</div>
                <div className="font-semibold text-gray-900">Progressiva Brasileira</div>
              </Link>
              <Link href="/queratina-brasileira" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">💎</div>
                <div className="font-semibold text-gray-900">Queratina Brasileira</div>
              </Link>
              <Link href="/hidratacao-capilar-profunda" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-3xl mb-3">💧</div>
                <div className="font-semibold text-gray-900">Hidratação Profunda</div>
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
