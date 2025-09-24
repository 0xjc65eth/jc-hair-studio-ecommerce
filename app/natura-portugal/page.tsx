import { Metadata } from 'next';
import Link from 'next/link';
import { ProductImage } from '@/components/seo/OptimizedImage';

export const metadata: Metadata = {
  title: 'Natura Portugal | Produtos Originais Brasileiros | Perfumes, Skincare, Maquiagem',
  description: 'Natura Portugal oficial - Perfumes Ekos, skincare Chronos, maquiagem Una. Produtos originais brasileiros com entrega rápida em Portugal. Distribuidor autorizado +40 anos.',
  keywords: [
    // Natura específico Portugal
    'natura portugal oficial',
    'natura produtos originais portugal',
    'natura perfume ekos portugal',
    'natura chronos portugal',
    'natura una maquiagem portugal',

    // Perfumes Natura
    'perfume natura ekos portugal',
    'natura essencial portugal',
    'perfume natura mamãe bebê portugal',
    'natura kaiak portugal',
    'perfume natura homem portugal',

    // Skincare Natura
    'natura chronos portugal',
    'natura plant portugal',
    'natura tododia portugal',
    'creme natura portugal',
    'hidratante natura portugal',

    // Maquiagem Natura
    'natura una maquiagem portugal',
    'batom natura portugal',
    'base natura portugal',
    'sombra natura portugal',

    // Busca comercial
    'comprar natura portugal',
    'natura loja online portugal',
    'natura preço portugal',
    'natura entrega portugal',
    'natura distribuidor portugal'
  ],
  openGraph: {
    title: 'Natura Portugal Oficial | Produtos Brasileiros Originais',
    description: 'Produtos Natura originais em Portugal: perfumes Ekos, skincare Chronos, maquiagem Una. Distribuidor oficial com +40 anos.',
    images: [{
      url: '/og-natura-portugal.jpg',
      width: 1200,
      height: 630,
      alt: 'Natura Portugal - Produtos Brasileiros Originais'
    }],
    type: 'website'
  }
};

// Produtos Natura em destaque
const naturaProducts = [
  {
    id: 'nat-ekos-castanha',
    name: 'Perfume Natura Ekos Castanha 100ml',
    category: 'Perfumaria',
    price: 89.90,
    originalPrice: 120.00,
    image: '/images/natura/ekos-castanha-100ml.jpg',
    description: 'Perfume com essência de castanha da Amazônia, fragrância única e sustentável',
    benefits: ['Essência amazônica', 'Sustentável', '100ml'],
    rating: 4.9,
    reviews: 234,
    inStock: true,
    isExclusive: true
  },
  {
    id: 'nat-chronos-45',
    name: 'Natura Chronos Creme Anti-idade 45+ 40g',
    category: 'Skincare',
    price: 79.90,
    image: '/images/natura/chronos-45-creme.jpg',
    description: 'Creme anti-idade com tecnologia brasileira para peles maduras',
    benefits: ['Anti-idade', 'Firmeza', 'Hidratação'],
    rating: 4.8,
    reviews: 189,
    inStock: true
  },
  {
    id: 'nat-una-base',
    name: 'Base Líquida Natura Una 30ml',
    category: 'Maquiagem',
    price: 59.90,
    originalPrice: 75.00,
    image: '/images/natura/una-base-liquida.jpg',
    description: 'Base com cobertura natural e longa duração, 12 tons disponíveis',
    benefits: ['12 tons', 'Longa duração', 'Natural'],
    rating: 4.7,
    reviews: 345,
    inStock: true,
    isBestSeller: true
  },
  {
    id: 'nat-tododia-macadamia',
    name: 'Hidratante Natura Tododia Macadâmia 400ml',
    category: 'Corpo',
    price: 39.90,
    image: '/images/natura/tododia-macadamia.jpg',
    description: 'Hidratante corporal com óleo de macadâmia brasileiro',
    benefits: ['400ml', 'Hidratação 24h', 'Óleo macadâmia'],
    rating: 4.6,
    reviews: 267,
    inStock: true
  }
];

export default function NaturaPortugalPage() {
  return (
    <>
      {/* Structured Data para Marca */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Natura Portugal | Produtos Originais Brasileiros',
            description: 'Distribuidor oficial Natura em Portugal com mais de 40 anos de experiência. Produtos originais brasileiros.',
            url: 'https://jchairstudios62.xyz/natura-portugal',
            mainEntity: {
              '@type': 'Brand',
              name: 'Natura',
              foundingDate: '1974',
              founder: {
                '@type': 'Person',
                name: 'Antônio Luiz da Cunha Seabra'
              },
              description: 'Marca brasileira líder em cosméticos sustentáveis e biodiversidade amazônica',
              logo: 'https://jchairstudios62.xyz/brands/natura-logo.png',
              url: 'https://jchairstudios62.xyz/natura-portugal',
              sameAs: [
                'https://www.natura.com.br',
                'https://instagram.com/natura',
                'https://facebook.com/natura'
              ],
              makesOffer: naturaProducts.map(product => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Product',
                  name: product.name,
                  category: product.category,
                  brand: 'Natura'
                },
                price: product.price,
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock'
              })),
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '1035',
                bestRating: '5'
              },
              additionalProperty: [
                {
                  '@type': 'PropertyValue',
                  name: 'Especialidade',
                  value: 'Cosméticos Sustentáveis Amazônicos'
                },
                {
                  '@type': 'PropertyValue',
                  name: 'Origem',
                  value: 'Brasil - São Paulo'
                },
                {
                  '@type': 'PropertyValue',
                  name: 'Sustentabilidade',
                  value: 'B Corp Certified'
                }
              ]
            }
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-40 h-40 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-36 h-36 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-8">
                  <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-green-200">
                    🌿 Distribuidor Oficial Portugal
                  </span>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Natura</span><br />
                    Portugal Oficial
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Produtos <strong>Natura originais brasileiros</strong> com mais de 50 anos de tradição.
                    Perfumes Ekos, Chronos anti-idade, maquiagem Una e mais com <strong>entrega rápida em Portugal</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-white/90 backdrop-blur rounded-xl shadow-sm border border-green-100">
                    <div className="text-2xl font-bold text-green-600">1974</div>
                    <div className="text-sm text-gray-600">Fundação Brasil</div>
                  </div>
                  <div className="text-center p-4 bg-white/90 backdrop-blur rounded-xl shadow-sm border border-emerald-100">
                    <div className="text-2xl font-bold text-emerald-600">B-Corp</div>
                    <div className="text-sm text-gray-600">Certificada</div>
                  </div>
                  <div className="text-center p-4 bg-white/90 backdrop-blur rounded-xl shadow-sm border border-teal-100">
                    <div className="text-2xl font-bold text-teal-600">2M+</div>
                    <div className="text-sm text-gray-600">Hectares Amazônia</div>
                  </div>
                  <div className="text-center p-4 bg-white/90 backdrop-blur rounded-xl shadow-sm border border-green-100">
                    <div className="text-2xl font-bold text-green-600">🇵🇹</div>
                    <div className="text-sm text-gray-600">Entrega 5-7 dias</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="#produtos-natura"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-center shadow-lg"
                  >
                    Ver Produtos Natura
                  </Link>
                  <a
                    href="https://wa.me/351928375226?text=Olá! Gostaria de conhecer os produtos Natura originais disponíveis em Portugal"
                    target="_blank"
                    className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-500 hover:text-white transition-all duration-300 text-center"
                  >
                    🌿 Consultoria Natura
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <ProductImage
                      src="/images/natura/ekos-castanha-100ml.jpg"
                      productName="Natura Ekos Castanha"
                      category="Perfumaria"
                      brand="Natura"
                      className="rounded-xl shadow-xl aspect-[3/4] transform hover:scale-105 transition-transform duration-500"
                      fill
                    />
                    <ProductImage
                      src="/images/natura/una-base-liquida.jpg"
                      productName="Base Natura Una"
                      category="Maquiagem"
                      brand="Natura"
                      className="rounded-xl shadow-xl aspect-[3/4] transform hover:scale-105 transition-transform duration-500"
                      fill
                    />
                  </div>
                  <div className="space-y-4 pt-8">
                    <ProductImage
                      src="/images/natura/chronos-45-creme.jpg"
                      productName="Natura Chronos 45+"
                      category="Anti-idade"
                      brand="Natura"
                      className="rounded-xl shadow-xl aspect-[3/4] transform hover:scale-105 transition-transform duration-500"
                      fill
                    />
                    <ProductImage
                      src="/images/natura/tododia-macadamia.jpg"
                      productName="Tododia Macadâmia"
                      category="Corpo"
                      brand="Natura"
                      className="rounded-xl shadow-xl aspect-[3/4] transform hover:scale-105 transition-transform duration-500"
                      fill
                    />
                  </div>
                </div>

                {/* Badge oficial */}
                <div className="absolute -top-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl animate-bounce">
                  ✅ Distribuidor Oficial
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Natura Story */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  50 Anos Cuidando da <span className="text-green-600">Biodiversidade Brasileira</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Desde 1974, a Natura é pioneira em sustentabilidade e inovação,
                  utilizando a riqueza da biodiversidade brasileira para criar produtos únicos no mundo.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    {
                      year: '1974',
                      milestone: 'Fundação da Natura no Brasil',
                      description: 'Nasce a primeira marca brasileira de cosméticos sustentáveis'
                    },
                    {
                      year: '2000',
                      milestone: 'Linha Ekos Amazônica',
                      description: 'Lançamento da primeira linha com ingredientes da Amazônia'
                    },
                    {
                      year: '2014',
                      milestone: 'Certificação B Corp',
                      description: 'Primeira empresa brasileira de cosméticos B Corp no mundo'
                    },
                    {
                      year: '2024',
                      milestone: 'Chegada Oficial Portugal',
                      description: 'Produtos originais Natura chegam oficialmente a Portugal'
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold min-w-fit">
                        {item.year}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.milestone}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <h3 className="font-bold text-lg text-green-800 mb-3">🌱 Compromisso Sustentável</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">2M+</div>
                      <div className="text-xs text-green-700">Hectares Protegidos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">40+</div>
                      <div className="text-xs text-green-700">Comunidades Apoiadas</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">100%</div>
                      <div className="text-xs text-green-700">Carbono Neutro</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto">
                      🌿
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">Ingredientes Exclusivos</h3>
                    <p className="text-green-700">Da Amazônia para Portugal</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { ingredient: 'Castanha do Brasil', benefit: 'Hidratação profunda' },
                      { ingredient: 'Açaí', benefit: 'Antioxidante poderoso' },
                      { ingredient: 'Buriti', benefit: 'Proteção natural' },
                      { ingredient: 'Andiroba', benefit: 'Propriedades anti-inflamatórias' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-white/70 rounded-lg p-3">
                        <span className="font-medium text-green-800">{item.ingredient}</span>
                        <span className="text-green-600 text-sm">{item.benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="produtos-natura" className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Produtos Natura Originais em Portugal
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Catálogo exclusivo com os melhores produtos Natura importados diretamente do Brasil
              </p>
            </div>

            {/* Categories Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {['Todos', 'Perfumaria', 'Skincare', 'Maquiagem', 'Corpo'].map((category) => (
                <button
                  key={category}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    category === 'Todos'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-green-100 hover:text-green-800 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {naturaProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="relative aspect-square">
                    <ProductImage
                      src={product.image}
                      productName={product.name}
                      category={product.category}
                      brand="Natura"
                      price={product.price}
                      className="absolute inset-0 group-hover:scale-110 transition-transform duration-500"
                      fill
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 space-y-2">
                      {product.isExclusive && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Exclusivo
                        </span>
                      )}
                      {product.isBestSeller && (
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Mais Vendido
                        </span>
                      )}
                    </div>

                    {/* Discount */}
                    {product.originalPrice && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}

                    {/* Category */}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.benefits.slice(0, 3).map((benefit, idx) => (
                        <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {benefit}
                        </span>
                      ))}
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-semibold">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">({product.reviews} avaliações)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-green-600">€{product.price}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-400 line-through">€{product.originalPrice}</div>
                        )}
                      </div>
                      <div className={`text-sm font-semibold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                        {product.inStock ? '✅ Em Stock' : '❌ Esgotado'}
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
                      Ver Produto Natura
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/natura"
                className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
              >
                Ver Catálogo Completo Natura →
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Por que comprar Natura conosco?
              </h2>
              <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                Mais de 40 anos de experiência como distribuidores oficiais de produtos brasileiros
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🎖️',
                  title: 'Distribuidor Oficial',
                  description: 'Somos distribuidores autorizados da Natura com certificação oficial e garantia de autenticidade de todos os produtos.',
                  highlight: '+40 anos experiência'
                },
                {
                  icon: '🚚',
                  title: 'Entrega Rápida Portugal',
                  description: 'Entrega em 5-7 dias úteis em todo Portugal. Embalagem especial para preservar a qualidade dos produtos.',
                  highlight: '5-7 dias úteis'
                },
                {
                  icon: '🛡️',
                  title: 'Garantia & Suporte',
                  description: 'Garantia total de qualidade, suporte técnico especializado e política de trocas. Atendimento em português.',
                  highlight: '30 dias trocas'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 text-center">
                  <div className="text-5xl mb-6">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-green-100 leading-relaxed mb-4">{item.description}</p>
                  <div className="inline-block bg-white/20 text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                    {item.highlight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Dúvidas sobre Natura Portugal
            </h2>

            <div className="space-y-6">
              {[
                {
                  question: 'Os produtos Natura vendidos em Portugal são originais?',
                  answer: 'Sim! Somos distribuidores oficiais e autorizados da Natura. Todos os produtos são importados diretamente do Brasil com certificado de autenticidade e código de rastreamento. Você recebe exatamente os mesmos produtos vendidos no Brasil.'
                },
                {
                  question: 'Quanto tempo demora a entrega da Natura em Portugal?',
                  answer: 'A entrega em Portugal continental é feita em 5-7 dias úteis. Utilizamos embalagem especial para preservar a qualidade dos produtos durante o transporte. Ilhas e regiões remotas podem ter prazos ligeiramente maiores.'
                },
                {
                  question: 'Posso trocar produtos Natura se não gostar?',
                  answer: 'Sim! Oferecemos 30 dias para trocas de produtos lacrados que não atenderam suas expectativas. Entendemos que perfumes e cosméticos são muito pessoais. Nossa equipe te ajuda a encontrar o produto ideal.'
                },
                {
                  question: 'Vocês têm todos os produtos da linha Natura?',
                  answer: 'Trabalhamos com os produtos mais procurados das principais linhas Natura: Ekos, Chronos, Una, Tododia, Plant e outros. Se você procura um produto específico, entre em contato - podemos fazer pedidos especiais.'
                },
                {
                  question: 'Os preços incluem taxas e impostos?',
                  answer: 'Sim! Todos os preços já incluem impostos portugueses e taxas de importação. Não há surpresas na entrega. O que você vê no site é exatamente o que você paga.'
                }
              ].map((faq, index) => (
                <details key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <summary className="p-6 cursor-pointer font-semibold text-gray-900 hover:text-green-600">
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
        <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Descubra a beleza sustentável da Natura
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              50 anos de tradição brasileira, ingredientes únicos da Amazônia e compromisso com a sustentabilidade.
              A verdadeira beleza brasileira chegou a Portugal.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/natura"
                className="bg-white text-green-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-xl"
              >
                🌿 Explorar Natura Portugal
              </Link>
              <a
                href="https://wa.me/351928375226?text=Olá! Gostaria de conhecer os produtos Natura originais disponíveis em Portugal"
                target="_blank"
                className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
              >
                💬 Consultoria Natura
              </a>
            </div>

            <div className="mt-8 text-green-200">
              <p className="text-sm">
                ✅ Produtos originais | 🚚 Entrega 5-7 dias | 🔒 Garantia oficial | 🌱 Sustentável
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}