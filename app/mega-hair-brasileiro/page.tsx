import { Metadata } from 'next';
import Link from 'next/link';
import { ProductImage } from '@/components/seo/OptimizedImage';
import { getLegacyCompatibleProducts } from '@/lib/data/megaHairProducts';

export const metadata: Metadata = {
  title: 'Mega Hair Brasileiro 100% Humano Premium | Extensões Capilares Autênticas',
  description: 'Mega hair brasileiro 100% humano com qualidade premium. Liso, cacheado, ondulado. Tradição familiar +40 anos. Entrega Europa. Cabelo natural brasileiro autêntico com garantia.',
  keywords: [
    'mega hair brasileiro',
    'cabelo humano brasileiro',
    'extensão capilar brasil',
    'mega hair natural',
    'cabelo brasileiro premium',
    'extensão cabelo 100% humano',
    'mega hair liso cacheado ondulado',
    'cabelo brasileiro europa',
    'mega hair portugal',
    'extensão capilar bélgica',
    'cabelo brasileiro autêntico',
    'mega hair qualidade premium',
    'tradição brasileira cabelo',
    'jc hair studio 62'
  ],
  openGraph: {
    title: 'Mega Hair Brasileiro 100% Humano Premium | JC Hair Studio\'s 62',
    description: 'Mega hair brasileiro 100% humano liso, cacheado, ondulado. Qualidade premium, tradição +40 anos. Entrega em toda Europa.',
    images: [{
      url: '/og-mega-hair-brasileiro.jpg',
      width: 1200,
      height: 630,
      alt: 'Mega Hair Brasileiro 100% Humano Premium'
    }],
    type: 'website'
  }
};

export default function MegaHairBrasileiroPage() {
  const megaHairProducts = getLegacyCompatibleProducts().slice(0, 12);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Mega Hair Brasileiro 100% Humano Premium',
            description: 'Extensões de cabelo brasileiro 100% humano com qualidade premium. Liso, cacheado, ondulado.',
            url: 'https://jchairstudios62.xyz/mega-hair-brasileiro',
            mainEntity: {
              '@type': 'Product',
              name: 'Mega Hair Brasileiro 100% Humano',
              category: 'Hair Extensions',
              brand: {
                '@type': 'Brand',
                name: "JC Hair Studio's 62"
              },
              manufacturer: {
                '@type': 'Organization',
                name: "JC Hair Studio's 62",
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'BR'
                }
              },
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'EUR',
                lowPrice: '85.00',
                highPrice: '285.00',
                offerCount: megaHairProducts.length.toString(),
                availability: 'https://schema.org/InStock'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '450',
                bestRating: '5'
              },
              countryOfOrigin: 'BR',
              additionalProperty: [
                {
                  '@type': 'PropertyValue',
                  name: 'Material',
                  value: '100% Cabelo Humano Brasileiro'
                },
                {
                  '@type': 'PropertyValue',
                  name: 'Tradição',
                  value: 'Mais de 40 anos'
                }
              ]
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Início',
                  item: 'https://jchairstudios62.xyz'
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Mega Hair Brasileiro',
                  item: 'https://jchairstudios62.xyz/mega-hair-brasileiro'
                }
              ]
            }
          })
        }}
      />

      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'O mega hair é realmente 100% cabelo humano brasileiro?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim! Nosso mega hair é 100% cabelo humano brasileiro com cutículas alinhadas, sem processos químicos agressivos. Garantimos autenticidade e qualidade premium com duração de 8 a 12 meses.'
                }
              },
              {
                '@type': 'Question',
                name: 'Qual a diferença do cabelo brasileiro para outras origens?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'O cabelo brasileiro é reconhecido mundialmente pela versatilidade, textura natural sedosa e capacidade de aceitar diferentes processos químicos mantendo a qualidade. É ideal para todos os tipos de cabelo.'
                }
              },
              {
                '@type': 'Question',
                name: 'Vocês entregam mega hair brasileiro em toda Europa?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim! Entregamos em Portugal (5-7 dias), Espanha, França, Itália, Bélgica, Alemanha e outros países europeus (7-14 dias). Frete grátis acima de €150.'
                }
              },
              {
                '@type': 'Question',
                name: 'Como garantir a qualidade do mega hair brasileiro?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Temos +40 anos de tradição familiar no setor capilar. Todos os produtos são importados diretamente do Brasil, testados e aprovados. Oferecemos garantia de qualidade e política de devolução.'
                }
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-amber-50 to-yellow-100 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    🇧🇷 100% Brasileiro Autêntico
                  </span>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                    Mega Hair <span className="text-amber-600">Brasileiro</span><br />
                    100% Humano Premium
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Extensões de cabelo brasileiro 100% humano com <strong>tradição familiar de +40 anos</strong>.
                    Liso, cacheado, ondulado. Qualidade premium com <strong>entrega em toda Europa</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-amber-600">100%</div>
                    <div className="text-sm text-gray-600">Cabelo Humano</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">40+</div>
                    <div className="text-sm text-gray-600">Anos Tradição</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">8-12</div>
                    <div className="text-sm text-gray-600">Meses Duração</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">🇪🇺</div>
                    <div className="text-sm text-gray-600">Entrega Europa</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/mega-hair"
                    className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition-colors text-center"
                  >
                    Ver Catálogo Completo
                  </Link>
                  <a
                    href="https://wa.me/351928375226"
                    target="_blank"
                    className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-500 hover:text-white transition-colors text-center"
                  >
                    📱 Falar no WhatsApp
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <ProductImage
                    src="/images/mega-hair/cacheado/55cm/borgonha-cacheado-3c.jpg"
                    productName="Mega Hair Cacheado Brasileiro"
                    category="Extensão Capilar"
                    brand="JC Hair Studio's 62"
                    className="rounded-lg shadow-lg aspect-[3/4]"
                    fill
                  />
                  <ProductImage
                    src="/images/mega-hair/liso/50cm/preto-natural-liso-1a.jpg"
                    productName="Mega Hair Liso Brasileiro"
                    category="Extensão Capilar"
                    brand="JC Hair Studio's 62"
                    className="rounded-lg shadow-lg aspect-[3/4] mt-8"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Por que escolher nosso Mega Hair Brasileiro?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🇧🇷',
                  title: '100% Brasileiro Autêntico',
                  description: 'Cabelo humano importado diretamente do Brasil, sem misturas ou processos químicos agressivos.'
                },
                {
                  icon: '👨‍👩‍👧‍👦',
                  title: 'Tradição Familiar 40+ Anos',
                  description: 'Experiência passada de geração em geração desde 2000, começando com o Crystal Beauty Center.'
                },
                {
                  icon: '✨',
                  title: 'Qualidade Premium Garantida',
                  description: 'Cutículas alinhadas, brilho natural, resistência superior. Duração de 8 a 12 meses.'
                },
                {
                  icon: '🎨',
                  title: 'Versatilidade Total',
                  description: 'Liso, cacheado, ondulado. Aceita tintura, chapinha, babyliss. Resultado sempre natural.'
                },
                {
                  icon: '🚚',
                  title: 'Entrega Rápida Europa',
                  description: 'Portugal: 5-7 dias. Outros países: 7-14 dias. Frete grátis acima de €150.'
                },
                {
                  icon: '🛡️',
                  title: 'Garantia & Suporte',
                  description: 'Garantia de qualidade, política de devolução 30 dias e suporte técnico especializado.'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Showcase */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Nossa Coleção de Mega Hair Brasileiro
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {megaHairProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <ProductImage
                      src={product.image || '/images/placeholder-product-brasileiro.jpg'}
                      productName={product.name}
                      category="Mega Hair"
                      brand="Brasileiro"
                      price={product.price}
                      className="absolute inset-0"
                      fill
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-600">€{product.price?.toFixed(2)}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">{product.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/mega-hair"
                className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Ver Todos os Produtos →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Perguntas Frequentes sobre Mega Hair Brasileiro
            </h2>

            <div className="space-y-6">
              {[
                {
                  question: 'O mega hair é realmente 100% cabelo humano brasileiro?',
                  answer: 'Sim! Nosso mega hair é 100% cabelo humano brasileiro com cutículas alinhadas, sem processos químicos agressivos. Garantimos autenticidade e qualidade premium com duração de 8 a 12 meses.'
                },
                {
                  question: 'Qual a diferença do cabelo brasileiro para outras origens?',
                  answer: 'O cabelo brasileiro é reconhecido mundialmente pela versatilidade, textura natural sedosa e capacidade de aceitar diferentes processos químicos mantendo a qualidade. É ideal para todos os tipos de cabelo.'
                },
                {
                  question: 'Como aplicar o mega hair brasileiro?',
                  answer: 'Recomendamos aplicação profissional para melhores resultados. O mega hair brasileiro é compatível com técnicas de costura, anel italiano, nano link e outras. Fornecemos instruções detalhadas.'
                },
                {
                  question: 'Posso tingir o mega hair brasileiro?',
                  answer: 'Sim! O cabelo brasileiro aceita coloração, descoloração e outros processos químicos. Recomendamos sempre fazer teste de mecha primeiro e usar produtos de qualidade.'
                }
              ].map((faq, index) => (
                <details key={index} className="bg-white rounded-lg shadow-sm">
                  <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:text-amber-600">
                    {faq.question}
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-600 to-yellow-500">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Pronto para transformar seu visual?
            </h2>
            <p className="text-xl text-amber-100 mb-8">
              Mais de 40 anos de tradição brasileira em produtos capilares.
              Qualidade premium com entrega garantida em toda Europa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/mega-hair"
                className="bg-white text-amber-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Explorar Catálogo
              </Link>
              <a
                href="https://wa.me/351928375226"
                target="_blank"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-amber-600 transition-colors"
              >
                📱 Falar Agora
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}