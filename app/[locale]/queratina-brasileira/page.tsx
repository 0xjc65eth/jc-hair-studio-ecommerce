'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Award, CheckCircle, Star, Zap } from 'lucide-react';
import ProductCard from '../../../components/products/SimpleProductCard';
import { staticProducts } from '../../../lib/data/staticProducts';
import { BreadcrumbSchema, FAQSchema } from '../../../components/seo/UnifiedSchema';

export default function QueratinaPage() {
  const queratinaProducts = staticProducts.filter(p =>
    p.descricao.toLowerCase().includes('queratina') ||
    p.nome.toLowerCase().includes('keratin')
  ).slice(0, 12);

  const breadcrumbs = [
    { name: 'Início', url: '/' },
    { name: 'Tratamentos Capilares', url: '/tratamentos-capilares' },
    { name: 'Queratina Brasileira', url: '/queratina-brasileira' }
  ];

  const faqs = [
    {
      question: 'O que é queratina brasileira e como funciona?',
      answer: 'Queratina brasileira é uma proteína natural extraída de cabelo humano que reconstrói a fibra capilar. Ela preenche as falhas nos fios, sela cutículas e forma uma camada protetora. A queratina brasileira é superior por ter moléculas menores que penetram profundamente, oferecendo alisamento mais natural, maior brilho e duração de até 5 meses.'
    },
    {
      question: 'Qual a diferença entre queratina brasileira e outras queratinas?',
      answer: 'A queratina brasileira tem concentração mais alta de proteínas (até 95%), moléculas menores para melhor penetração e é enriquecida com óleos da Amazônia. Queratinas comuns têm 30-50% de proteína e mais químicos. A brasileira oferece alisamento mais duradouro, fios mais saudáveis e pode ser usada em todos os tipos de cabelo, inclusive coloridos.'
    },
    {
      question: 'Quanto tempo dura o tratamento de queratina brasileira?',
      answer: 'O tratamento de queratina brasileira dura de 3 a 5 meses, dependendo do tipo de cabelo e cuidados. Para prolongar: use shampoo sem sulfato e cloreto de sódio, evite lavar diariamente, use protetor térmico e faça hidratações mensais. Com cuidados adequados, pode durar até 6 meses em cabelos finos.'
    },
    {
      question: 'Queratina brasileira é segura? Tem formol?',
      answer: 'Queratinas brasileiras de qualidade são 100% seguras e livres de formol. Usam formaldeído natural de ocorrência na queratina (abaixo de 0,2%, permitido por lei). Nossos produtos premium são certificados, testados dermatologicamente e aprovados pela ANVISA. Podem ser usados por gestantes após 1º trimestre (consulte médico).'
    },
    {
      question: 'Posso fazer queratina brasileira em cabelo colorido ou descolorido?',
      answer: 'Sim! Queratina brasileira é ideal para cabelos coloridos pois forma proteção que evita desbotamento. Aguarde 15 dias após coloração/descoloração. Para cabelos com mechas ou luzes, a queratina ajuda a uniformizar textura e brilho. Em cabelos platinados, use queratinas sem aldeídos para evitar escurecimento.'
    }
  ];

  return (
    <>
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-24 mt-16 lg:mt-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold mb-6">
                💎 Queratina Brasileira Premium - Proteína Pura 95%
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Queratina Brasileira Profissional<br />
                <span className="text-purple-200">Reconstrução e Alisamento Natural</span>
              </h1>
              <p className="text-xl lg:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                A proteína mais poderosa para cabelos. <strong>Reconstrói, alisa e protege</strong> com tecnologia brasileira avançada. Duração de até 5 meses com brilho espelhado.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">95% Proteína</div>
                  <div className="text-sm text-indigo-100">Alta Concentração</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">5 Meses</div>
                  <div className="text-sm text-indigo-100">Duração Máxima</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Award className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">100% Segura</div>
                  <div className="text-sm text-indigo-100">Sem Formol</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Zap className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">Natural</div>
                  <div className="text-sm text-indigo-100">Alisamento Suave</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#produtos" className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg">
                  Ver Produtos Premium
                </a>
                <a href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre queratina brasileira" target="_blank" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all">
                  Falar com Especialista
                </a>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-purple-200">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="font-semibold">4.9/5.0</span>
                <span className="text-indigo-100">| 4.128+ clientes satisfeitos</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
              Por que Queratina Brasileira é Superior?
            </h2>
            <p className="text-xl text-gray-600 mb-16 text-center max-w-3xl mx-auto">
              Desenvolvida no Brasil, a queratina brasileira é reconhecida mundialmente como o tratamento mais eficaz para reconstrução e alisamento capilar.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: <Sparkles className="w-12 h-12 text-purple-500" />,
                  title: 'Concentração Máxima de Proteína',
                  description: 'Até 95% de queratina pura hidrolisada com moléculas ultra-pequenas que penetram profundamente na fibra capilar. Reconstrói de dentro para fora, preenchendo todas as falhas e danos causados por química, calor e agressões ambientais. Resultados visíveis desde a primeira aplicação.'
                },
                {
                  icon: <Shield className="w-12 h-12 text-green-500" />,
                  title: 'Tecnologia Brasileira Avançada',
                  description: 'Desenvolvida com óleos amazônicos (buriti, açaí, andiroba), aminoácidos essenciais e vitaminas. Forma camada protetora contra raios UV, poluição e calor até 230°C. Blindagem completa que mantém cabelos saudáveis, hidratados e protegidos por até 5 meses.'
                },
                {
                  icon: <Award className="w-12 h-12 text-amber-500" />,
                  title: 'Alisamento Natural Duradouro',
                  description: 'Alisa respeitando o movimento natural dos fios. Reduz 80% do volume e elimina frizz sem deixar cabelos artificialmente retos. Perfeito para quem quer disciplinar sem perder textura. Funciona em todos os tipos: lisos, ondulados, cacheados e crespos. Duração recorde de 3-5 meses.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="produtos" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 text-center">
              Melhores Queratinas Brasileiras Premium
            </h2>
            <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Selecionamos as queratinas brasileiras com maior concentração de proteína e melhores avaliações.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {queratinaProducts.map((product) => (
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

            <div className="text-center mt-12">
              <Link href="/produtos?categoria=tratamentos-capilares" className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg">
                Ver Catálogo Completo
              </Link>
            </div>
          </div>
        </section>

        {/* How To Use Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-16 text-center">
              Como Aplicar Queratina Brasileira
            </h2>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  step: '1',
                  title: 'Limpeza Profunda',
                  description: 'Lave 2-3x com shampoo anti-resíduos para abrir cutículas e permitir penetração máxima da queratina. Seque 80% com toalha.'
                },
                {
                  step: '2',
                  title: 'Aplicação Precisa',
                  description: 'Aplique a queratina mecha por mecha mantendo 1cm da raiz. Distribua uniformemente com pente fino do meio às pontas.'
                },
                {
                  step: '3',
                  title: 'Tempo de Ação',
                  description: 'Deixe agir 30-40 minutos. A queratina penetra e preenche falhas da fibra capilar. Pode usar touca térmica para potencializar.'
                },
                {
                  step: '4',
                  title: 'Secagem Completa',
                  description: 'Seque 100% com secador em temperatura média escovando mecha por mecha para esticar e preparar para chapinha.'
                },
                {
                  step: '5',
                  title: 'Selamento Térmico',
                  description: 'Passe chapinha 200-230°C em mechas finas, 10-15x cada. O calor sela a queratina criando camada protetora permanente.'
                },
                {
                  step: '6',
                  title: 'Cuidados Pós-Tratamento',
                  description: 'Aguarde 3 dias para lavar. Use shampoo sem sulfato/sal. Hidrate semanalmente. Resultado: cabelos reconstruídos e protegidos por meses!'
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
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
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-16 text-center">
              Perguntas Frequentes sobre Queratina Brasileira
            </h2>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all group">
                  <summary className="p-6 cursor-pointer font-bold text-lg text-gray-900 hover:text-indigo-600 transition-colors flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="text-indigo-500 text-2xl group-open:rotate-45 transition-transform">+</span>
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
        <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Recontrua Seus Cabelos com Queratina Brasileira
            </h2>
            <p className="text-xl lg:text-2xl text-indigo-100 mb-10 max-w-3xl mx-auto">
              Adquira queratina brasileira premium com <strong>entrega rápida em toda Europa</strong>. Frete grátis acima de €150.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="#produtos" className="bg-white text-indigo-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-indigo-50 transition-all shadow-2xl">
                Comprar Agora
              </a>
              <a href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre queratina brasileira" target="_blank" className="border-2 border-white text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-white hover:text-indigo-600 transition-all">
                Falar no WhatsApp
              </a>
            </div>
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-indigo-100">
              <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Frete Grátis €150+</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Garantia Qualidade</span>
              <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Entrega Rápida</span>
            </div>
          </div>
        </section>

        {/* Related Links */}
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
