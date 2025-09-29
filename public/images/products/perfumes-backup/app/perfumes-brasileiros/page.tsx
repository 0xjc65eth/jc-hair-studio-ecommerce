import { Metadata } from 'next';
import Link from 'next/link';
import { ProductImage } from '@/components/seo/OptimizedImage';
import { perfumesBrasileiros } from '@/lib/data/premiumCategories';

export const metadata: Metadata = {
  title: 'Perfumes Brasileiros Originais | Natura, Boticário Europa | Fragrâncias Premium',
  description: 'Perfumes brasileiros originais Natura, Boticário, Granado. Fragrâncias exclusivas da Amazônia com entrega Europa. Essências únicas do Brasil, tradição centenária, entrega garantida.',
  keywords: [
    // Perfumes específicos
    'perfumes brasileiros originais',
    'natura perfume portugal',
    'boticário malbec europa',
    'granado perfume bélgica',
    'perfume amazônia original',

    // Fragrâncias regionais
    'fragrâncias brasileiras premium',
    'essências brasil europa',
    'perfumes natura ekos',
    'boticário lily europa',
    'perfumes brasileiros únicos',

    // Localização específica
    'perfumes brasil portugal entrega',
    'fragrâncias brasileiras bélgica',
    'natura boticário espanha',
    'perfumes brasileiros frança',
    'essências brasil itália',

    // Marca e qualidade
    'jc hair studio 62 perfumes',
    'perfumes brasileiros autênticos',
    'fragrâncias originais brasil',
    'perfumaria brasileira europa',
    'tradição brasileira perfumes'
  ],
  openGraph: {
    title: 'Perfumes Brasileiros Originais | Natura, Boticário Europa',
    description: 'Fragrâncias exclusivas do Brasil: Natura Ekos, Boticário Malbec, essências da Amazônia. Tradição centenária, entrega Europa.',
    images: [{
      url: '/og-perfumes-brasileiros.jpg',
      width: 1200,
      height: 630,
      alt: 'Perfumes Brasileiros Originais Premium Europa'
    }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jchairstudios62',
    title: 'Perfumes Brasileiros Originais | Natura, Boticário Europa',
    description: 'Fragrâncias exclusivas: Natura Ekos, Boticário Malbec, essências Amazônia. Entrega Europa.',
    images: ['/twitter-perfumes-brasileiros.jpg']
  }
};

export default function PerfumesBrasileirosPage() {
  const featuredPerfumes = perfumesBrasileiros.slice(0, 6);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Perfumes Brasileiros Originais | Natura, Boticário Europa',
            description: 'Perfumes e fragrâncias brasileiras premium com essências exclusivas da Amazônia e tradição centenária.',
            url: 'https://jchairstudios62.xyz/perfumes-brasileiros',
            mainEntity: {
              '@type': 'ProductGroup',
              name: 'Perfumes Brasileiros Premium',
              description: 'Coleção exclusiva de perfumes brasileiros: Natura, Boticário, Granado',
              brand: [
                {
                  '@type': 'Brand',
                  name: 'Natura',
                  logo: 'https://jchairstudios62.xyz/brands/natura-logo.png'
                },
                {
                  '@type': 'Brand',
                  name: 'O Boticário',
                  logo: 'https://jchairstudios62.xyz/brands/boticario-logo.png'
                }
              ],
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'EUR',
                lowPrice: '65.90',
                highPrice: '149.90',
                offerCount: featuredPerfumes.length.toString(),
                availability: 'https://schema.org/InStock'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '680',
                bestRating: '5'
              },
              additionalProperty: [
                {
                  '@type': 'PropertyValue',
                  name: 'Origem',
                  value: 'Brasil - Essências Exclusivas'
                },
                {
                  '@type': 'PropertyValue',
                  name: 'Tradição',
                  value: 'Marcas centenárias brasileiras'
                },
                {
                  '@type': 'PropertyValue',
                  name: 'Sustentabilidade',
                  value: 'Ingredientes da biodiversidade brasileira'
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
                  name: 'Perfumes Brasileiros',
                  item: 'https://jchairstudios62.xyz/perfumes-brasileiros'
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
                name: 'Os perfumes Natura e Boticário são originais do Brasil?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim! Somos distribuidores autorizados das principais marcas brasileiras. Todos os perfumes são importados diretamente do Brasil com certificado de autenticidade e garantia de qualidade.'
                }
              },
              {
                '@type': 'Question',
                name: 'Qual a diferença dos perfumes brasileiros para outros?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Os perfumes brasileiros são únicos por utilizarem essências exclusivas da biodiversidade brasileira, como castanha da Amazônia, açaí, cupuaçu e outras plantas nativas. Cada fragrância conta uma história do Brasil.'
                }
              },
              {
                '@type': 'Question',
                name: 'Vocês entregam perfumes brasileiros em toda Europa?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim! Entregamos perfumes brasileiros originais em Portugal (5-7 dias), Espanha, França, Itália, Bélgica, Alemanha (7-14 dias). Embalagem especial para transporte seguro.'
                }
              },
              {
                '@type': 'Question',
                name: 'Os perfumes têm a mesma qualidade do Brasil?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Absolutamente! Mantemos a cadeia de frio e condições ideais de armazenamento. Os perfumes chegam com a mesma qualidade, fixação e intensidade que você encontra no Brasil.'
                }
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-yellow-600/10"></div>
          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <span className="inline-block bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-green-200">
                    🇧🇷 Essências Exclusivas da Amazônia
                  </span>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Perfumes <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-yellow-600">Brasileiros</span><br />
                    Originais Premium
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Fragrâncias exclusivas das marcas centenárias <strong>Natura, Boticário e Granado</strong>.
                    Essências únicas da biodiversidade brasileira com <strong>entrega garantida em toda Europa</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-green-100">
                    <div className="text-2xl font-bold text-green-600">Natura</div>
                    <div className="text-sm text-gray-600">Essências Amazônia</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-yellow-100">
                    <div className="text-2xl font-bold text-yellow-600">Boticário</div>
                    <div className="text-sm text-gray-600">Tradição 1977</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">Granado</div>
                    <div className="text-sm text-gray-600">Desde 1870</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-purple-100">
                    <div className="text-2xl font-bold text-purple-600">🌿</div>
                    <div className="text-sm text-gray-600">Sustentáveis</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="#perfumes-catalogo"
                    className="bg-gradient-to-r from-green-600 to-yellow-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-yellow-700 transition-all duration-300 text-center shadow-lg"
                  >
                    Explorar Fragrâncias
                  </Link>
                  <a
                    href="https://wa.me/351928375226?text=Olá! Gostaria de saber mais sobre perfumes brasileiros originais"
                    target="_blank"
                    className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-500 hover:text-white transition-all duration-300 text-center"
                  >
                    🌸 Consultoria Personalizada
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <ProductImage
                      src="/images/perfumes/natura-ekos-castanha.jpg"
                      productName="Natura Ekos Castanha"
                      category="Perfumaria Feminina"
                      brand="Natura"
                      className="rounded-xl shadow-xl aspect-[3/4]"
                      fill
                    />
                    <ProductImage
                      src="/images/perfumes/granado-bebe.jpg"
                      productName="Granado Bebê Tradicional"
                      category="Perfumaria Clássica"
                      brand="Granado"
                      className="rounded-xl shadow-xl aspect-[3/4]"
                      fill
                    />
                  </div>
                  <div className="space-y-4 pt-8">
                    <ProductImage
                      src="/images/perfumes/boticario-malbec.jpg"
                      productName="Boticário Malbec"
                      category="Perfumaria Masculina"
                      brand="O Boticário"
                      className="rounded-xl shadow-xl aspect-[3/4]"
                      fill
                    />
                    <ProductImage
                      src="/images/perfumes/natura-tododia.jpg"
                      productName="Natura Tododia Framboesa"
                      category="Perfumaria Corporal"
                      brand="Natura"
                      className="rounded-xl shadow-xl aspect-[3/4]"
                      fill
                    />
                  </div>
                </div>

                {/* Badge flutuante */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                  ✨ Exclusivos na Europa
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-20 bg-gradient-to-r from-green-900 to-yellow-900 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Marcas Centenárias Brasileiras
              </h2>
              <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                Tradição, qualidade e essências únicas que representam o melhor da perfumaria brasileira
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  brand: 'Natura',
                  founded: '1974',
                  specialty: 'Biodiversidade Brasileira',
                  highlight: 'Ekos - Essências da Amazônia',
                  description: 'Pioneira em sustentabilidade, a Natura utiliza ingredientes nativos da Amazônia em suas fragrâncias exclusivas.',
                  color: 'from-green-500 to-green-600'
                },
                {
                  brand: 'O Boticário',
                  founded: '1977',
                  specialty: 'Perfumaria Clássica',
                  highlight: 'Malbec - #1 Masculino Brasil',
                  description: 'Marca líder em perfumaria brasileira, conhecida mundialmente pela qualidade e inovação em fragrâncias.',
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  brand: 'Granado',
                  founded: '1870',
                  specialty: 'Tradição Centenária',
                  highlight: 'Farmácia Real - Império',
                  description: 'A marca mais antiga do Brasil, com receitas tradicionais que atravessaram gerações e conquistaram o mundo.',
                  color: 'from-purple-500 to-purple-600'
                }
              ].map((brand, index) => (
                <div key={index} className="bg-white/10 backdrop-blur rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                  <div className={`inline-block bg-gradient-to-r ${brand.color} text-white px-4 py-2 rounded-full text-sm font-bold mb-4`}>
                    Desde {brand.founded}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{brand.brand}</h3>
                  <div className="text-green-300 font-semibold mb-2">{brand.specialty}</div>
                  <div className="text-yellow-300 text-sm mb-4">{brand.highlight}</div>
                  <p className="text-gray-300 leading-relaxed">{brand.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Catalog */}
        <section id="perfumes-catalogo" className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Catálogo Exclusivo Europa
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Perfumes cuidadosamente selecionados e importados diretamente do Brasil
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPerfumes.map((perfume) => (
                <div key={perfume.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-[4/5]">
                    <ProductImage
                      src={perfume.image}
                      productName={perfume.name}
                      category={perfume.category}
                      brand={perfume.brand}
                      price={perfume.price}
                      className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                      fill
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 space-y-2">
                      {perfume.isExclusive && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Exclusivo
                        </span>
                      )}
                      {perfume.isBestSeller && (
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Mais Vendido
                        </span>
                      )}
                    </div>

                    {/* Discount */}
                    {perfume.originalPrice && (
                      <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{Math.round(((perfume.originalPrice - perfume.price) / perfume.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Brand */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                        {perfume.brand}
                      </span>
                      <span className="text-xs text-gray-500">{perfume.category}</span>
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {perfume.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                      {perfume.description}
                    </p>

                    {/* Notes */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1">Notas:</div>
                      <div className="flex flex-wrap gap-1">
                        {perfume.notes.slice(0, 3).map((note, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Rating & Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm font-semibold">{perfume.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">({perfume.reviews})</span>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">€{perfume.price}</div>
                        {perfume.originalPrice && (
                          <div className="text-sm text-gray-400 line-through">€{perfume.originalPrice}</div>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-yellow-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-yellow-700 transition-all duration-300">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/perfumes"
                className="inline-block bg-gradient-to-r from-green-600 to-yellow-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-yellow-700 transition-all duration-300 shadow-lg"
              >
                Ver Catálogo Completo →
              </Link>
            </div>
          </div>
        </section>

        {/* Brazilian Essence Section */}
        <section className="py-20 bg-gradient-to-r from-green-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Essências Únicas da <span className="text-green-600">Amazônia</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Os perfumes brasileiros são únicos no mundo por utilizarem ingredientes exclusivos
                  da biodiversidade brasileira, criando fragrâncias impossíveis de replicar.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      ingredient: 'Castanha do Brasil',
                      origin: 'Amazônia',
                      note: 'Doce e Amadeirada',
                      color: 'bg-amber-100 text-amber-800'
                    },
                    {
                      ingredient: 'Açaí',
                      origin: 'Pará',
                      note: 'Frutado Exótico',
                      color: 'bg-purple-100 text-purple-800'
                    },
                    {
                      ingredient: 'Cupuaçu',
                      origin: 'Amazônia',
                      note: 'Cremoso Tropical',
                      color: 'bg-orange-100 text-orange-800'
                    },
                    {
                      ingredient: 'Pitanga',
                      origin: 'Mata Atlântica',
                      note: 'Cítrico Brasileiro',
                      color: 'bg-red-100 text-red-800'
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${item.color}`}>
                        {item.origin}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.ingredient}</h4>
                      <p className="text-sm text-gray-600">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-green-400 to-yellow-400 rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12"></div>

                  <div className="relative">
                    <h3 className="text-2xl font-bold mb-4">🌿 Sustentabilidade</h3>
                    <p className="text-lg leading-relaxed">
                      Cada perfume brasileiro apoia comunidades locais e programas de
                      conservação da Amazônia. Beleza que cuida do planeta.
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">150+</div>
                        <div className="text-sm opacity-90">Comunidades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">2M+</div>
                        <div className="text-sm opacity-90">Hectares</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">50+</div>
                        <div className="text-sm opacity-90">Espécies</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Tudo sobre Perfumes Brasileiros
            </h2>

            <div className="space-y-6">
              {[
                {
                  question: 'Os perfumes Natura e Boticário são originais do Brasil?',
                  answer: 'Sim! Somos distribuidores autorizados das principais marcas brasileiras. Todos os perfumes são importados diretamente do Brasil com certificado de autenticidade e garantia de qualidade. Você recebe o mesmo produto vendido nas lojas brasileiras.'
                },
                {
                  question: 'Qual a diferença dos perfumes brasileiros para outros países?',
                  answer: 'Os perfumes brasileiros são únicos por utilizarem essências exclusivas da biodiversidade brasileira, como castanha da Amazônia, açaí, cupuaçu e outras plantas nativas. Cada fragrância conta uma história do Brasil e tem ingredientes impossíveis de encontrar em outros lugares.'
                },
                {
                  question: 'Como é feita a entrega de perfumes na Europa?',
                  answer: 'Utilizamos embalagem especial com proteção térmica para manter a qualidade. Entregamos em Portugal (5-7 dias), Espanha, França, Itália, Bélgica, Alemanha (7-14 dias). Todos os perfumes chegam lacrados e com nota fiscal.'
                },
                {
                  question: 'Os perfumes chegam com a mesma fixação do Brasil?',
                  answer: 'Absolutamente! Mantemos cadeia de frio e condições ideais de armazenamento. Os perfumes chegam com a mesma qualidade, fixação e intensidade que você encontra no Brasil. Garantimos 100% da qualidade original.'
                },
                {
                  question: 'Posso trocar se não gostar da fragrância?',
                  answer: 'Sim! Oferecemos 30 dias para troca ou devolução de perfumes lacrados. Entendemos que fragrância é algo muito pessoal e queremos que você fique 100% satisfeito com sua escolha.'
                }
              ].map((faq, index) => (
                <details key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:text-green-600 transition-colors">
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

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-green-600 via-yellow-600 to-green-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-6">
                Desperte seus sentidos com o Brasil
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Mais de 150 anos de tradição brasileira em perfumaria.
                Essências únicas da Amazônia, entrega garantida em toda Europa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/perfumes"
                className="bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                🌸 Explorar Todas as Fragrâncias
              </Link>
              <a
                href="https://wa.me/351928375226?text=Olá! Gostaria de uma consultoria personalizada para escolher o perfume brasileiro ideal"
                target="_blank"
                className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
              >
                💬 Consultoria Personalizada
              </a>
            </div>

            <div className="mt-8 text-green-200">
              <p className="text-sm">
                ✨ Frete grátis acima de €150 | 🎁 Amostras grátis em todos os pedidos | 🔒 Entrega segura garantida
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}