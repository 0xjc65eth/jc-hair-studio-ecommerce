import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

const granadoProducts = [
  {
    name: 'Sabonete Glicerina',
    category: 'Cuidados Corporais',
    price: '€8.99',
    originalPrice: '€12.50',
    description: 'Sabonete tradicional de glicerina com fragrâncias clássicas',
    benefits: ['Fórmula tradicional 1870', 'Hidratação natural', 'Fragrâncias autênticas']
  },
  {
    name: 'Água de Colônia Bebê',
    category: 'Perfumaria Infantil',
    price: '€24.99',
    originalPrice: '€32.00',
    description: 'Colônia suave especialmente desenvolvida para bebês',
    benefits: ['Hipoalergênica', 'Fragrância delicada', 'Tradição 150+ anos']
  },
  {
    name: 'Barbearia Masculina',
    category: 'Linha Masculina',
    price: '€39.99',
    originalPrice: '€55.00',
    description: 'Kit completo para barbearia clássica brasileira',
    benefits: ['Produtos profissionais', 'Tradição barbeiro', 'Qualidade premium']
  }
];

const brandHistory = {
  founded: '1870',
  founder: 'José António Coxito Granado',
  heritage: '154 anos',
  location: 'Rio de Janeiro, Brasil',
  distinction: 'Farmácia mais antiga do Brasil',
  royal: 'Fornecedor da Casa Imperial'
};

export const metadata: Metadata = {
  title: 'Granado Portugal | Farmácia Brasileira Histórica Desde 1870',
  description: 'Granado Portugal - A farmácia mais antiga do Brasil (1870). Sabonetes tradicionais, águas de colônia, produtos naturais com 154 anos de tradição. Entrega Portugal.',
  keywords: 'Granado Portugal, farmácia Granado, sabonetes Granado, água de colônia bebê, produtos naturais brasileiros, farmácia histórica, tradição 1870, cosméticos vintage',
  openGraph: {
    title: 'Granado Portugal - Farmácia Brasileira Histórica Desde 1870',
    description: 'A mais antiga farmácia do Brasil chegou a Portugal. Sabonetes tradicionais, águas de colônia e produtos naturais com 154 anos de história.',
    type: 'website',
    url: 'https://jc-hair-studio.vercel.app/granado-portugal',
    images: [
      {
        url: '/images/brands/granado-heritage.jpg',
        width: 1200,
        height: 630,
        alt: 'Granado - Farmácia Brasileira Histórica Desde 1870'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Granado Portugal - 154 Anos de Tradição Farmacêutica',
    description: 'Sabonetes, águas de colônia e produtos naturais da farmácia mais antiga do Brasil.',
    images: ['/images/brands/granado-heritage.jpg']
  },
  alternates: {
    canonical: 'https://jc-hair-studio.vercel.app/granado-portugal'
  }
};

const brandJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  name: 'Granado',
  description: 'A farmácia mais antiga do Brasil, fundada em 1870 no Rio de Janeiro. Especializada em sabonetes artesanais, águas de colônia e produtos naturais com tradição histórica.',
  foundingDate: '1870-01-01',
  founder: {
    '@type': 'Person',
    name: 'José António Coxito Granado'
  },
  url: 'https://jc-hair-studio.vercel.app/granado-portugal',
  logo: '/images/brands/granado-logo.png',
  sameAs: [
    'https://www.granado.com.br',
    'https://www.instagram.com/granadofarmacia',
    'https://www.facebook.com/granadofarmacia'
  ],
  award: 'Fornecedor da Casa Imperial Brasileira',
  specialty: 'Farmácia e cosmética artesanal'
};

const historicalPlaceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HistoricalPlace',
  name: 'Granado Pharmácias',
  description: 'Primeira farmácia do Brasil, estabelecida em 1870 no Rio de Janeiro, mantendo tradições farmacêuticas históricas.',
  foundingDate: '1870',
  location: {
    '@type': 'Place',
    name: 'Rio de Janeiro, Brasil'
  }
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'JC Hair Studio\'s 62 - Granado Portugal',
  description: 'Distribuidor oficial Granado em Portugal. Sabonetes tradicionais, águas de colônia e produtos históricos brasileiros com 154 anos de tradição.',
  url: 'https://jc-hair-studio.vercel.app/granado-portugal',
  logo: '/images/jc-logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+351-XXX-XXX-XXX',
    contactType: 'customer service',
    availableLanguage: ['Portuguese', 'English'],
    areaServed: 'Portugal'
  }
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual é a história da Granado?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Granado é a farmácia mais antiga do Brasil, fundada em 1870 por José António Coxito Granado no Rio de Janeiro. Foi fornecedora oficial da Casa Imperial Brasileira e mantém tradições farmacêuticas há 154 anos.'
      }
    },
    {
      '@type': 'Question',
      name: 'Os sabonetes Granado são artesanais?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, os sabonetes Granado são produzidos seguindo a fórmula tradicional de 1870, com processo artesanal e ingredientes naturais, mantendo a qualidade histórica da marca.'
      }
    },
    {
      '@type': 'Question',
      name: 'Granado tem produtos para bebês?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, a linha Granado Bebê inclui água de colônia hipoalergênica, sabonetes suaves e produtos especialmente desenvolvidos para peles sensíveis há mais de 150 anos.'
      }
    }
  ]
};

export default function GranadoPortugalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(historicalPlaceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="mb-6">
                <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                  👑 Fornecedor da Casa Imperial Brasileira
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                Granado Portugal
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto">
                A Farmácia Mais Antiga do Brasil
                <span className="block text-lg mt-2 text-amber-600 font-semibold">
                  154 Anos de Tradição Farmacêutica Brasileira (1870-2024)
                </span>
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
                  🧼 Sabonetes Tradicionais
                </span>
                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
                  👶 Água de Colônia Bebê
                </span>
                <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full">
                  💈 Barbearia Clássica
                </span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  🌿 100% Naturais
                </span>
              </div>
            </div>

            {/* Historical Timeline */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-xl">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                154 Anos de História Farmacêutica Brasileira
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-600 mb-2">1870</div>
                  <div className="text-gray-700 font-medium">Fundação</div>
                  <div className="text-sm text-gray-500 mt-1">Rio de Janeiro</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">👑</div>
                  <div className="text-gray-700 font-medium">Casa Imperial</div>
                  <div className="text-sm text-gray-500 mt-1">Fornecedor Oficial</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">1000+</div>
                  <div className="text-gray-700 font-medium">Produtos</div>
                  <div className="text-sm text-gray-500 mt-1">Artesanais</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">2024</div>
                  <div className="text-gray-700 font-medium">Portugal</div>
                  <div className="text-sm text-gray-500 mt-1">JC Hair Studio's</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Showcase */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Produtos Históricos Granado em Portugal
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {granadoProducts.map((product, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <div className="text-6xl">
                      {product.category.includes('Corporais') ? '🧼' :
                       product.category.includes('Infantil') ? '👶' : '💈'}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                    <div className="space-y-2 mb-4">
                      {product.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          {benefit}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-amber-600">{product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                      </div>
                      <Link
                        href="/produtos"
                        className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full hover:from-amber-700 hover:to-orange-700 transition-all font-medium"
                      >
                        Ver Produto
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Heritage Story */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-800">
                  A Primeira Farmácia do Brasil
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>1870:</strong> José António Coxito Granado funda a primeira farmácia
                    do Brasil no centro do Rio de Janeiro, revolucionando a farmacologia nacional.
                  </p>
                  <p>
                    <strong>Casa Imperial:</strong> Torna-se fornecedor oficial da família real brasileira,
                    desenvolvendo produtos exclusivos para a corte imperial.
                  </p>
                  <p>
                    <strong>Tradição Artesanal:</strong> Mantém até hoje as fórmulas originais de 1870,
                    produzindo sabonetes e cosméticos com métodos tradicionais.
                  </p>
                  <p>
                    <strong>Expansão Europeia:</strong> Após 154 anos no Brasil, chega finalmente
                    a Portugal através da parceria com JC Hair Studio's 62.
                  </p>
                </div>
                <div className="mt-8 p-6 bg-amber-50 rounded-2xl">
                  <h3 className="font-bold text-amber-800 mb-2">🏛️ Patrimônio Histórico</h3>
                  <p className="text-amber-700 text-sm">
                    A loja original no Rio de Janeiro é considerada patrimônio histórico brasileiro,
                    preservando a arquitetura e equipamentos farmacêuticos do século XIX.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl p-8 text-center">
                  <div className="text-6xl mb-4">🏛️</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Marcos Históricos
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="font-bold text-amber-600">1870</div>
                      <div className="text-sm text-gray-600">Primeira farmácia brasileira</div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="font-bold text-orange-600">1888</div>
                      <div className="text-sm text-gray-600">Fornecedor Casa Imperial</div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="font-bold text-red-600">1920</div>
                      <div className="text-sm text-gray-600">Expansão nacional</div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="font-bold text-green-600">2024</div>
                      <div className="text-sm text-gray-600">Chegada a Portugal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Categorias Tradicionais Granado
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">🧼</div>
                <h3 className="font-bold text-gray-800 mb-2">Sabonetes</h3>
                <p className="text-sm text-gray-600">Fórmulas tradicionais desde 1870</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">👶</div>
                <h3 className="font-bold text-gray-800 mb-2">Linha Bebê</h3>
                <p className="text-sm text-gray-600">Produtos hipoalergênicos delicados</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">💈</div>
                <h3 className="font-bold text-gray-800 mb-2">Barbearia</h3>
                <p className="text-sm text-gray-600">Tradição masculina brasileira</p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">🌸</div>
                <h3 className="font-bold text-gray-800 mb-2">Perfumaria</h3>
                <p className="text-sm text-gray-600">Águas de colônia clássicas</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Perguntas Frequentes - Granado Portugal
            </h2>
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-amber-600 mb-3">
                  Qual é a história da Granado?
                </h3>
                <p className="text-gray-600">
                  Granado é a farmácia mais antiga do Brasil, fundada em 1870 por José António Coxito Granado
                  no Rio de Janeiro. Foi fornecedora oficial da Casa Imperial Brasileira e mantém tradições
                  farmacêuticas há 154 anos.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-amber-600 mb-3">
                  Os sabonetes Granado são artesanais?
                </h3>
                <p className="text-gray-600">
                  Sim, os sabonetes Granado são produzidos seguindo a fórmula tradicional de 1870,
                  com processo artesanal e ingredientes naturais, mantendo a qualidade histórica da marca.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-amber-600 mb-3">
                  Granado tem produtos para bebês?
                </h3>
                <p className="text-gray-600">
                  Sim, a linha Granado Bebê inclui água de colônia hipoalergênica, sabonetes suaves e
                  produtos especialmente desenvolvidos para peles sensíveis há mais de 150 anos.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-amber-600 mb-3">
                  Por que Granado era fornecedor da Casa Imperial?
                </h3>
                <p className="text-gray-600">
                  A qualidade excepcional e inovação farmacêutica da Granado impressionou a corte brasileira,
                  tornando-se fornecedor oficial da família imperial, um selo de prestígio que mantém até hoje.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-amber-600 to-orange-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              154 Anos de Tradição Farmacêutica Brasileira
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Sabonetes artesanais, águas de colônia e produtos históricos.
              A primeira farmácia do Brasil agora em Portugal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/produtos"
                className="bg-white text-amber-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all inline-flex items-center justify-center"
              >
                Explorar Produtos Históricos
                <span className="ml-2">🏛️</span>
              </Link>
              <Link
                href="/contato"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-amber-600 transition-all inline-flex items-center justify-center"
              >
                Conhecer História Granado
                <span className="ml-2">📚</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}