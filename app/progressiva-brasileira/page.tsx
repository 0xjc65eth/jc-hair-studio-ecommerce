import { Metadata } from 'next';
import Link from 'next/link';
import { ProductImage } from '@/components/seo/OptimizedImage';
import { progressivasBtxProducts } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: 'Progressiva Brasileira Original | Vogue, BTX Capilar Premium Europa',
  description: 'Progressiva brasileira original Vogue, BTX capilar profissional. Produtos autênticos importados do Brasil. Tradição +40 anos. Entrega Europa. Alisamento premium garantido.',
  keywords: [
    'progressiva vogue original',
    'progressiva brasileira premium',
    'btx capilar profissional',
    'botox capilar brasileiro',
    'alisamento brasileiro',
    'progressiva profissional',
    'queratina brasileira',
    'tratamento capilar brasil',
    'progressiva europa',
    'vogue portugal',
    'btx capilar bélgica',
    'alisamento premium',
    'tradição brasileira',
    'jc hair studio 62'
  ],
  openGraph: {
    title: 'Progressiva Brasileira Original Vogue | JC Hair Studio\'s 62',
    description: 'Progressivas Vogue originais, BTX capilar brasileiro. Produtos autênticos, tradição +40 anos. Entrega Europa.',
    images: [{
      url: '/og-progressiva-brasileira.jpg',
      width: 1200,
      height: 630,
      alt: 'Progressiva Brasileira Original Vogue Premium'
    }],
    type: 'website'
  }
};

export default function ProgressivaBrasileiraPage() {
  const featuredProducts = progressivasBtxProducts.slice(0, 8);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Progressiva Brasileira Original | Vogue BTX Capilar',
            description: 'Progressivas brasileiras originais Vogue e BTX capilar profissional importados diretamente do Brasil.',
            url: 'https://jchairstudios62.xyz/progressiva-brasileira',
            mainEntity: {
              '@type': 'Product',
              name: 'Progressiva Brasileira Vogue Original',
              category: 'Hair Treatment',
              brand: {
                '@type': 'Brand',
                name: 'Vogue'
              },
              manufacturer: {
                '@type': 'Organization',
                name: 'Vogue Brasil',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'BR'
                }
              },
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'EUR',
                lowPrice: '45.00',
                highPrice: '190.00',
                offerCount: featuredProducts.length.toString(),
                availability: 'https://schema.org/InStock'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.7',
                reviewCount: '320',
                bestRating: '5'
              },
              countryOfOrigin: 'BR'
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
                name: 'As progressivas Vogue são originais do Brasil?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim! Somos distribuidores autorizados das progressivas Vogue originais. Importamos diretamente do fabricante brasileiro com garantia de autenticidade e qualidade.'
                }
              },
              {
                '@type': 'Question',
                name: 'Qual a diferença entre BTX e progressiva?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'O BTX capilar é um tratamento de hidratação e nutrição profunda, enquanto a progressiva foca no alisamento. Ambos são tratamentos brasileiros de alta qualidade que podem ser combinados.'
                }
              },
              {
                '@type': 'Question',
                name: 'A progressiva brasileira funciona em todos os tipos de cabelo?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim! As progressivas brasileiras são desenvolvidas para funcionar em todos os tipos de cabelo: liso, ondulado, cacheado e crespo. Cada tipo tem sua formulação específica.'
                }
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-50 to-pink-100 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <span className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    🇧🇷 Original do Brasil
                  </span>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                    Progressiva <span className="text-purple-600">Brasileira</span><br />
                    Vogue Original
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Progressivas Vogue originais e BTX capilar profissional <strong>importados diretamente do Brasil</strong>.
                    Tradição familiar de +40 anos com <strong>garantia de autenticidade</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">Vogue</div>
                    <div className="text-sm text-gray-600">Original Brasil</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-pink-600">95%</div>
                    <div className="text-sm text-gray-600">Redução Volume</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">4</div>
                    <div className="text-sm text-gray-600">Meses Duração</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">0%</div>
                    <div className="text-sm text-gray-600">Formol</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/progressivas-btx"
                    className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors text-center"
                  >
                    Ver Produtos Vogue
                  </Link>
                  <a
                    href="https://wa.me/351928375226"
                    target="_blank"
                    className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-500 hover:text-white transition-colors text-center"
                  >
                    📱 Consultar Expert
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <ProductImage
                    src="/images/products/progressivas_diversas/progressivas_diversas_1.JPG"
                    productName="Progressiva Vogue Platinum"
                    category="Progressiva"
                    brand="Vogue"
                    className="rounded-lg shadow-lg aspect-[3/4]"
                    fill
                  />
                  <ProductImage
                    src="/images/products/produtos_de_hidratacao/produtos_de_hidratacao_1.WEBP"
                    productName="BTX Capilar Profissional"
                    category="Tratamento"
                    brand="Brasileiro"
                    className="rounded-lg shadow-lg aspect-[3/4] mt-8"
                    fill
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Por que escolher Progressivas Brasileiras?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: '🏆',
                  title: 'Marca Vogue Original',
                  description: 'Distribuidores autorizados das progressivas Vogue, marca líder no Brasil há décadas.'
                },
                {
                  icon: '🧪',
                  title: 'Tecnologia Avançada',
                  description: 'Fórmulas desenvolvidas no Brasil para todos os tipos de cabelo, sem formol e agressivos.'
                },
                {
                  icon: '✨',
                  title: 'Resultados Profissionais',
                  description: 'Redução até 95% do volume, cabelo liso por até 4 meses, com brilho e maciez naturais.'
                },
                {
                  icon: '🔬',
                  title: 'BTX Capilar Premium',
                  description: 'Botox capilar para hidratação profunda, reconstrução e rejuvenescimento dos fios.'
                }
              ].map((benefit, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Progressivas e BTX Brasileiros Premium
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <ProductImage
                      src={product.image}
                      productName={product.name}
                      category="Progressiva"
                      brand={product.brand}
                      price={product.price}
                      className="absolute inset-0"
                      fill
                    />
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Novo
                      </span>
                    )}
                    {product.discount && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {product.brand}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-purple-600">€{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">€{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/progressivas-btx"
                className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Ver Todos os Produtos →
              </Link>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Progressiva vs BTX: Qual escolher?
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Características</th>
                    <th className="px-6 py-4 text-center font-semibold text-purple-600">Progressiva</th>
                    <th className="px-6 py-4 text-center font-semibold text-pink-600">BTX Capilar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Objetivo Principal</td>
                    <td className="px-6 py-4 text-center">Alisamento e redução de volume</td>
                    <td className="px-6 py-4 text-center">Hidratação e nutrição profunda</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Duração</td>
                    <td className="px-6 py-4 text-center">3-4 meses</td>
                    <td className="px-6 py-4 text-center">2-3 meses</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Melhor para</td>
                    <td className="px-6 py-4 text-center">Cabelos cacheados e com frizz</td>
                    <td className="px-6 py-4 text-center">Cabelos ressecados e danificados</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-gray-900">Pode combinar?</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">✓ Sim</td>
                    <td className="px-6 py-4 text-center text-green-600 font-semibold">✓ Sim</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Dúvidas sobre Progressivas Brasileiras
            </h2>

            <div className="space-y-6">
              {[
                {
                  question: 'As progressivas Vogue são originais do Brasil?',
                  answer: 'Sim! Somos distribuidores autorizados das progressivas Vogue originais. Importamos diretamente do fabricante brasileiro com certificado de autenticidade e garantia de qualidade.'
                },
                {
                  question: 'Qual a diferença entre BTX e progressiva?',
                  answer: 'O BTX capilar é um tratamento de hidratação e nutrição profunda que reconstrói os fios, enquanto a progressiva foca no alisamento e redução de volume. Podem ser usados em conjunto para resultados ainda melhores.'
                },
                {
                  question: 'A progressiva brasileira funciona em todos os tipos de cabelo?',
                  answer: 'Sim! As progressivas brasileiras são desenvolvidas para funcionar em todos os tipos de cabelo: liso, ondulado, cacheado e crespo. Temos fórmulas específicas para cada necessidade.'
                },
                {
                  question: 'É seguro usar progressiva sem formol?',
                  answer: 'Absolutamente! Nossas progressivas brasileiras são livres de formol e outros químicos agressivos. Usam tecnologia avançada com ingredientes naturais como queratina e aminoácidos.'
                },
                {
                  question: 'Como aplicar a progressiva Vogue corretamente?',
                  answer: 'Fornecemos instruções detalhadas e suporte técnico. Recomendamos aplicação profissional para melhores resultados. Oferecemos também consultas via WhatsApp com nossos especialistas.'
                }
              ].map((faq, index) => (
                <details key={index} className="bg-white rounded-lg shadow-sm">
                  <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:text-purple-600">
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
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-500">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Transforme seus cabelos com a tradição brasileira
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Progressivas Vogue originais e BTX capilar premium.
              Mais de 40 anos de experiência, entrega garantida em toda Europa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/progressivas-btx"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Ver Catálogo Vogue
              </Link>
              <a
                href="https://wa.me/351928375226"
                target="_blank"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors"
              >
                📱 Consultar Expert
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}