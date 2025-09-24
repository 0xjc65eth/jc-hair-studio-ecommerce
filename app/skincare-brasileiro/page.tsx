import { Metadata } from 'next';
import Link from 'next/link';
import { ProductImage } from '@/components/seo/OptimizedImage';
import { skincareBrasileiro, wellnessBrasileiro } from '@/lib/data/premiumCategories';

export const metadata: Metadata = {
  title: 'Skincare Brasileiro Premium | Sallve, Episol, Granado Europa | Cuidados Naturais',
  description: 'Skincare brasileiro premium com ingredientes da flora brasileira. Sallve Vitamina C, Episol protetor solar, Granado tradicional. Cuidados naturais, entrega Europa, resultados comprovados.',
  keywords: [
    // Marcas específicas
    'sallve vitamina c portugal',
    'episol protetor solar europa',
    'granado skincare bélgica',
    'adcos produtos portugal',
    'natura chronos europa',

    // Skincare geral
    'skincare brasileiro premium',
    'cuidados pele brasil europa',
    'cosméticos naturais brasileiros',
    'produtos flora brasileira',
    'skincare brasileiro original',

    // Ingredientes únicos
    'vitamina c brasileira',
    'açaí skincare europa',
    'castanha brasil skincare',
    'buriti óleo skincare',
    'ingredientes amazônia pele',

    // Localização
    'skincare brasil portugal entrega',
    'cuidados pele brasileiros bélgica',
    'cosméticos brasil espanha',
    'produtos brasileiros frança skincare',
    'skincare natural brasil itália',

    // Benefícios e resultados
    'anti-idade brasileiro',
    'clareamento pele brasileiro',
    'hidratação natural brasil',
    'proteção solar brasileira',
    'rotina skincare brasileira'
  ],
  openGraph: {
    title: 'Skincare Brasileiro Premium | Sallve, Episol, Granado Europa',
    description: 'Cuidados com a pele únicos do Brasil: Sallve, Episol, Granado. Ingredientes da flora brasileira, resultados comprovados, entrega Europa.',
    images: [{
      url: '/og-skincare-brasileiro.jpg',
      width: 1200,
      height: 630,
      alt: 'Skincare Brasileiro Premium Europa - Sallve Episol Granado'
    }],
    type: 'website'
  }
};

export default function SkincareBrasileiroPage() {
  const featuredSkincare = [...skincareBrasileiro, ...wellnessBrasileiro].slice(0, 8);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Skincare Brasileiro Premium | Sallve, Episol, Granado',
            description: 'Produtos de skincare brasileiros com ingredientes únicos da flora brasileira para cuidados naturais e eficazes.',
            url: 'https://jchairstudios62.xyz/skincare-brasileiro',
            specialty: [
              'Brazilian Skincare',
              'Natural Beauty Products',
              'Amazonian Ingredients',
              'Vitamin C Serums',
              'Sun Protection'
            ],
            mainEntity: {
              '@type': 'ProductGroup',
              name: 'Skincare Brasileiro Premium',
              description: 'Cuidados com a pele desenvolvidos no Brasil com ingredientes exclusivos da biodiversidade brasileira',
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'EUR',
                lowPrice: '29.90',
                highPrice: '89.90',
                offerCount: featuredSkincare.length.toString(),
                availability: 'https://schema.org/InStock'
              },
              additionalProperty: [
                {
                  '@type': 'PropertyValue',
                  name: 'Ingredientes',
                  value: 'Flora Brasileira Exclusiva'
                },
                {
                  '@type': 'PropertyValue',
                  name: 'Tecnologia',
                  value: 'Pesquisa Brasileira Avançada'
                },
                {
                  '@type': 'PropertyValue',
                  name: 'Sustentabilidade',
                  value: 'Ingredientes Sustentáveis Amazônia'
                }
              ]
            }
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <span className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-pink-200">
                    🌺 Ingredientes da Flora Brasileira
                  </span>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Skincare <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">Brasileiro</span><br />
                    Premium Natural
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Cuidados únicos desenvolvidos no Brasil com <strong>ingredientes exclusivos da Amazônia</strong>.
                    Sallve, Episol, Granado e mais marcas com <strong>resultados comprovados cientificamente</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-pink-100">
                    <div className="text-2xl font-bold text-pink-600">Sallve</div>
                    <div className="text-sm text-gray-600">Vitamina C</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-purple-100">
                    <div className="text-2xl font-bold text-purple-600">Episol</div>
                    <div className="text-sm text-gray-600">Proteção Solar</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">Granado</div>
                    <div className="text-sm text-gray-600">Desde 1870</div>
                  </div>
                  <div className="text-center p-4 bg-white/80 backdrop-blur rounded-xl shadow-sm border border-green-100">
                    <div className="text-2xl font-bold text-green-600">🌿</div>
                    <div className="text-sm text-gray-600">100% Natural</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="#skincare-produtos"
                    className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-300 text-center shadow-lg"
                  >
                    Descobrir Produtos
                  </Link>
                  <a
                    href="https://wa.me/351928375226?text=Olá! Gostaria de uma rotina skincare personalizada com produtos brasileiros"
                    target="_blank"
                    className="border-2 border-pink-500 text-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-pink-500 hover:text-white transition-all duration-300 text-center"
                  >
                    ✨ Rotina Personalizada
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <ProductImage
                      src="/images/skincare/sallve-vitamin-c.jpg"
                      productName="Sallve Sérum Vitamina C"
                      category="Tratamento Anti-idade"
                      brand="Sallve"
                      className="rounded-xl shadow-xl aspect-[3/4] transform hover:scale-105 transition-transform duration-300"
                      fill
                    />
                    <ProductImage
                      src="/images/skincare/granado-glicerina.jpg"
                      productName="Granado Glicerina Tradicional"
                      category="Hidratação Corporal"
                      brand="Granado"
                      className="rounded-xl shadow-xl aspect-[3/4] transform hover:scale-105 transition-transform duration-300"
                      fill
                    />
                  </div>
                  <div className="space-y-4 pt-8">
                    <ProductImage
                      src="/images/skincare/episol-color.jpg"
                      productName="Episol Color Protetor Solar"
                      category="Proteção Solar FPS 60"
                      brand="Episol"
                      className="rounded-xl shadow-xl aspect-[3/4] transform hover:scale-105 transition-transform duration-300"
                      fill
                    />
                    <ProductImage
                      src="/images/wellness/granado-banho-kit.jpg"
                      productName="Kit Banho Granado"
                      category="Cuidados Corporais"
                      brand="Granado"
                      className="rounded-xl shadow-xl aspect-[3/4] transform hover:scale-105 transition-transform duration-300"
                      fill
                    />
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  🧬 Fórmulas Exclusivas
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-400 to-blue-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  🌱 Sustentável
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brazilian Ingredients Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ingredientes Exclusivos da <span className="text-green-600">Biodiversidade Brasileira</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                O Brasil possui a maior biodiversidade do planeta. Nossos produtos aproveitam
                essa riqueza única para criar fórmulas impossíveis de encontrar em outros lugares.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  ingredient: 'Açaí',
                  scientific: 'Euterpe oleracea',
                  origin: 'Amazônia',
                  benefits: ['Antioxidante potente', 'Anti-inflamatório', 'Vitaminas A, C, E'],
                  icon: '🫐',
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  ingredient: 'Buriti',
                  scientific: 'Mauritia flexuosa',
                  origin: 'Cerrado',
                  benefits: ['Betacaroteno natural', 'Proteção UV', 'Regeneração celular'],
                  icon: '🥥',
                  color: 'from-orange-500 to-orange-600'
                },
                {
                  ingredient: 'Castanha do Brasil',
                  scientific: 'Bertholletia excelsa',
                  origin: 'Amazônia',
                  benefits: ['Selênio natural', 'Elasticidade da pele', 'Hidratação profunda'],
                  icon: '🌰',
                  color: 'from-amber-500 to-amber-600'
                },
                {
                  ingredient: 'Cupuaçu',
                  scientific: 'Theobroma grandiflorum',
                  origin: 'Amazônia',
                  benefits: ['Hidratação superior', 'Ácidos graxos', 'Barreira natural'],
                  icon: '🍫',
                  color: 'from-brown-500 to-brown-600'
                }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl text-white text-2xl mb-4`}>
                    {item.icon}
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2">{item.ingredient}</h3>
                  <p className="text-sm text-gray-500 italic mb-2">{item.scientific}</p>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full inline-block mb-4">
                    {item.origin}
                  </div>

                  <ul className="space-y-1">
                    {item.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 text-xs mt-1">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Showcase */}
        <section id="skincare-produtos" className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Cuidados Brasileiros Premium
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Produtos desenvolvidos com pesquisa científica brasileira e ingredientes únicos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredSkincare.map((product, index) => (
                <div key={product.id || index} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-square">
                    <ProductImage
                      src={product.image}
                      productName={product.name}
                      category={product.category}
                      brand={product.brand}
                      price={product.price}
                      className="absolute inset-0 group-hover:scale-110 transition-transform duration-500"
                      fill
                    />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {product.category}
                      </span>
                    </div>

                    {/* Brand badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {product.brand}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* Benefits */}
                    {product.benefits && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {product.benefits.slice(0, 2).map((benefit, idx) => (
                            <span key={idx} className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rating & Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-semibold">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-pink-600">€{product.price}</div>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300">
                      Ver Produto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skincare Routine Section */}
        <section className="py-20 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Rotina Skincare Brasileira Completa
              </h2>
              <p className="text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed">
                Desenvolvida por dermatologistas brasileiros para todos os tipos de pele
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  period: 'Manhã',
                  title: 'Limpeza Suave',
                  product: 'Gel de Limpeza Sallve',
                  description: 'Remove impurezas sem ressecamento',
                  icon: '🧼'
                },
                {
                  step: '2',
                  period: 'Manhã',
                  title: 'Vitamina C',
                  product: 'Sérum Vitamina C Sallve',
                  description: 'Antioxidante e clareamento',
                  icon: '💧'
                },
                {
                  step: '3',
                  period: 'Manhã',
                  title: 'Proteção Solar',
                  product: 'Episol Color FPS 60',
                  description: 'Proteção com cor universal',
                  icon: '☀️'
                },
                {
                  step: '4',
                  period: 'Noite',
                  title: 'Hidratação',
                  product: 'Granado Glicerina',
                  description: 'Restauração e nutrição noturna',
                  icon: '🌙'
                }
              ].map((routine, index) => (
                <div key={index} className="bg-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                      {routine.step}
                    </div>
                    <div className="text-sm text-pink-200">{routine.period}</div>
                  </div>

                  <div className="text-3xl mb-3">{routine.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{routine.title}</h3>
                  <div className="text-pink-200 font-semibold text-sm mb-2">{routine.product}</div>
                  <p className="text-pink-100 text-sm leading-relaxed">{routine.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="https://wa.me/351928375226?text=Olá! Gostaria de uma rotina skincare personalizada"
                target="_blank"
                className="inline-block bg-white text-pink-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-pink-50 transition-colors shadow-xl"
              >
                💬 Criar Minha Rotina Personalizada
              </a>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Por que Skincare Brasileiro?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🧬',
                  title: 'Pesquisa Científica Brasileira',
                  description: 'Fórmulas desenvolvidas em laboratórios brasileiros com tecnologia de ponta e testes rigorosos de eficácia.',
                  highlight: '20+ anos de pesquisa'
                },
                {
                  icon: '🌿',
                  title: 'Ingredientes Únicos do Mundo',
                  description: 'Utilizamos plantas e extratos que só existem na biodiversidade brasileira, impossíveis de replicar.',
                  highlight: 'Biodiversidade exclusiva'
                },
                {
                  icon: '🌍',
                  title: 'Sustentabilidade Amazônica',
                  description: 'Cada produto apoia comunidades locais e programas de conservação da floresta amazônica.',
                  highlight: 'Beleza que preserva'
                }
              ].map((benefit, index) => (
                <div key={index} className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-5xl mb-6">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{benefit.description}</p>
                  <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {benefit.highlight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Dúvidas sobre Skincare Brasileiro
            </h2>

            <div className="space-y-6">
              {[
                {
                  question: 'Produtos brasileiros funcionam em peles europeias?',
                  answer: 'Sim! Os produtos brasileiros são desenvolvidos para funcionar em todos os tipos de pele. Muitas marcas como Sallve e Episol fazem testes em diferentes tipos de pele e climas. A diversidade do Brasil permite criar fórmulas universais.'
                },
                {
                  question: 'Os ingredientes brasileiros são seguros?',
                  answer: 'Absolutamente! Todos os ingredientes passam por rigorosos testes de segurança e eficácia. Marcas como Natura e Granado seguem padrões internacionais de qualidade e têm aprovação da ANVISA e órgãos europeus.'
                },
                {
                  question: 'Qual a vantagem dos ingredientes da Amazônia?',
                  answer: 'Os ingredientes amazônicos são únicos no mundo e oferecem propriedades que não existem em plantas de outras regiões. Açaí, buriti, castanha do Brasil têm concentrações únicas de antioxidantes, vitaminas e minerais.'
                },
                {
                  question: 'Como criar uma rotina skincare brasileira?',
                  answer: 'Oferecemos consultoria personalizada via WhatsApp! Analisamos seu tipo de pele e criamos uma rotina específica com produtos brasileiros. Cada pele é única e merece cuidados personalizados.'
                }
              ].map((faq, index) => (
                <details key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:text-pink-600">
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
        <section className="py-20 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Transforme sua pele com a natureza brasileira
            </h2>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Ingredientes únicos da Amazônia, pesquisa científica avançada e resultados comprovados.
              Descubra o segredo da beleza brasileira.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/skincare"
                className="bg-white text-pink-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-pink-50 transition-colors shadow-xl"
              >
                🌺 Explorar Todos os Produtos
              </Link>
              <a
                href="https://wa.me/351928375226?text=Olá! Gostaria de uma rotina skincare personalizada com produtos brasileiros"
                target="_blank"
                className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-pink-600 transition-all duration-300"
              >
                ✨ Consultoria Gratuita
              </a>
            </div>

            <div className="mt-8 text-pink-200">
              <p className="text-sm">
                🎁 Diagnóstico de pele gratuito | 🚚 Frete grátis acima de €150 | 🔒 30 dias para trocas
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}