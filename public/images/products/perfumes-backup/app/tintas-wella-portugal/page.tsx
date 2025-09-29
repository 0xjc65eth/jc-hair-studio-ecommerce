import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProductSnippets, BreadcrumbSnippets, type Product } from '../../components/seo/RichSnippets';

const wellaProducts: Product[] = [
  {
    name: 'Wella Koleston Perfect 60ml',
    brand: 'Wella',
    category: 'Tintas Capilares',
    description: 'Coloração profissional Wella Koleston com cobertura 100% brancos e duração 6-8 semanas',
    image: '/images/products/tinta_wella/wella-koleston-perfect.jpg',
    price: 12.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'WELLA-KOL-60ML'
  },
  {
    name: 'Wella Color Touch 60ml',
    brand: 'Wella',
    category: 'Tintas Capilares',
    description: 'Coloração semi-permanente Wella Color Touch para tons naturais e vibrantes',
    image: '/images/products/tinta_wella/wella-color-touch.jpg',
    price: 9.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'WELLA-CT-60ML'
  },
  {
    name: 'Kit Wella Illumina Color',
    brand: 'Wella',
    category: 'Tintas Capilares',
    description: 'Kit Wella Illumina Color: Coloração + Ox + Shampoo + Condicionador',
    image: '/images/products/tinta_wella/wella-illumina-kit.jpg',
    price: 29.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'WELLA-ILL-KIT'
  }
];

const wellaCollections = [
  {
    name: 'Koleston Perfect',
    description: 'Cobertura 100% dos brancos',
    features: ['Duração 6-8 semanas', 'Cores intensas', 'Cobertura total'],
    icon: '🎨'
  },
  {
    name: 'Color Touch',
    description: 'Semi-permanente suave',
    features: ['Tom sobre tom', 'Sem amônia', 'Brilho natural'],
    icon: '✨'
  },
  {
    name: 'Illumina Color',
    description: 'Tecnologia Microlight',
    features: ['Loiros puros', 'Menos danos', 'Brilho excepcional'],
    icon: '💎'
  },
  {
    name: 'Color Fresh',
    description: 'Coloração temporária',
    features: ['Lavável', 'Cores fashion', 'Cabelos danificados'],
    icon: '🌈'
  }
];

const breadcrumbs = [
  { name: 'Início', url: 'https://jchairstudios62.xyz/' },
  { name: 'Tintas', url: 'https://jchairstudios62.xyz/tintas' },
  { name: 'Wella Portugal', url: 'https://jchairstudios62.xyz/tintas-wella-portugal' }
];

export const metadata: Metadata = {
  title: 'Tintas Wella Portugal | Koleston, Color Touch, Illumina - 45+ Produtos',
  description: 'Tintas Wella originais em Portugal: Koleston Perfect, Color Touch, Illumina Color. 45+ produtos em stock. Cobertura 100% brancos, duração 6-8 semanas. Entrega rápida.',
  keywords: 'tintas wella portugal, wella koleston portugal, wella color touch, coloração wella, tintas capilares wella, wella illumina color, wella original portugal',
  openGraph: {
    title: 'Tintas Wella Portugal - Koleston, Color Touch, Illumina (45+ Produtos)',
    description: 'Coloração Wella original: Koleston Perfect, Color Touch, Illumina. Cobertura 100% brancos, duração profissional.',
    type: 'website',
    url: 'https://jchairstudios62.xyz/tintas-wella-portugal',
    images: [
      {
        url: '/images/products/tinta_wella/wella-collection-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Tintas Wella Portugal - Coleção Completa 45+ Produtos'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tintas Wella Portugal - 45+ Produtos Originais',
    description: 'Koleston, Color Touch, Illumina. Cobertura profissional.',
    images: ['/images/products/tinta_wella/wella-collection-hero.jpg']
  },
  alternates: {
    canonical: 'https://jchairstudios62.xyz/tintas-wella-portugal'
  }
};

const brandJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  name: 'Wella Professionals',
  description: 'Marca alemã líder mundial em coloração capilar profissional, conhecida pelas linhas Koleston Perfect e Color Touch.',
  url: 'https://jchairstudios62.xyz/tintas-wella-portugal',
  logo: '/images/brands/wella-logo.png'
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quantos produtos Wella vocês têm em stock?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Temos mais de 45 produtos Wella diferentes em stock, incluindo Koleston Perfect, Color Touch, Illumina Color e acessórios.'
      }
    },
    {
      '@type': 'Question',
      name: 'As tintas Wella são originais?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, todas as tintas Wella vendidas são 100% originais, importadas diretamente do fornecedor oficial com garantia de autenticidade.'
      }
    },
    {
      '@type': 'Question',
      name: 'Quanto tempo dura a coloração Wella?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A duração varia por linha: Koleston Perfect dura 6-8 semanas, Color Touch 4-6 semanas, Illumina Color 6-8 semanas.'
      }
    }
  ]
};

export default function TintasWellaPortugalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbSnippets breadcrumbs={breadcrumbs} />
      {wellaProducts.map((product, index) => (
        <ProductSnippets key={index} product={product} />
      ))}

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="mb-6">
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  ✅ 45+ Produtos Wella em Stock
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-6">
                Tintas Wella Portugal
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto">
                Koleston • Color Touch • Illumina Color • Color Fresh
                <span className="block text-lg mt-2 text-red-600 font-semibold">
                  45+ Produtos Originais • Cobertura 100% Brancos • Entrega Rápida Portugal
                </span>
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full">
                  🎨 Koleston Perfect
                </span>
                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
                  ✨ Color Touch
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                  💎 Illumina Color
                </span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  🌈 Color Fresh
                </span>
              </div>
            </div>

            {/* Product Count Highlight */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-xl">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Maior Stock Wella em Portugal
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">45+</div>
                  <div className="text-gray-600">Produtos Diferentes</div>
                  <div className="text-sm text-gray-500 mt-1">Todas as linhas</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
                  <div className="text-gray-600">Cobertura Brancos</div>
                  <div className="text-sm text-gray-500 mt-1">Koleston Perfect</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">6-8</div>
                  <div className="text-gray-600">Semanas Duração</div>
                  <div className="text-sm text-gray-500 mt-1">Resultado profissional</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">24h</div>
                  <div className="text-gray-600">Envio Rápido</div>
                  <div className="text-sm text-gray-500 mt-1">Portugal Continental</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wella Collections */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Linhas Wella Disponíveis (45+ Produtos)
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {wellaCollections.map((collection, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-48 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                    <div className="text-6xl">{collection.icon}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{collection.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm">{collection.description}</p>
                    <div className="space-y-2">
                      {collection.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/produtos"
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 px-4 rounded-full hover:from-red-700 hover:to-orange-700 transition-all font-medium text-center block"
                      >
                        Ver Produtos
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Produtos Wella Mais Vendidos
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {wellaProducts.map((product, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 bg-gradient-to-br from-red-100 to-yellow-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎨</div>
                      <div className="text-sm font-medium text-green-600">✅ Em Stock</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Original
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        Produto original Wella
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        Entrega 24-48h Portugal
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        Garantia de qualidade
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-3xl font-bold text-red-600">€{product.price}</span>
                        <span className="text-sm text-gray-500 ml-2">+ IVA</span>
                      </div>
                      <Link
                        href="/produtos"
                        className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full hover:from-red-700 hover:to-orange-700 transition-all font-medium"
                      >
                        Comprar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Our Wella */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-800">
                  Por que Comprar Wella Conosco?
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>Maior Stock:</strong> Temos o maior stock de produtos Wella em Portugal,
                    com mais de 45 referências diferentes sempre disponíveis.
                  </p>
                  <p>
                    <strong>Produtos Originais:</strong> Todos os produtos Wella são importados
                    diretamente do fornecedor oficial, garantindo 100% de autenticidade.
                  </p>
                  <p>
                    <strong>Preços Competitivos:</strong> Oferecemos os melhores preços do mercado
                    português para produtos Wella profissionais.
                  </p>
                  <p>
                    <strong>Entrega Rápida:</strong> Enviamos em 24-48h para todo Portugal Continental,
                    com opções de entrega expressa disponíveis.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-red-200 to-orange-200 rounded-3xl p-8 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Stock Wella Disponível
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/80 rounded-xl p-4 flex justify-between">
                      <span className="font-medium">Koleston Perfect</span>
                      <span className="text-red-600 font-bold">15+ cores</span>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 flex justify-between">
                      <span className="font-medium">Color Touch</span>
                      <span className="text-orange-600 font-bold">12+ tons</span>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 flex justify-between">
                      <span className="font-medium">Illumina Color</span>
                      <span className="text-yellow-600 font-bold">8+ loiros</span>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4 flex justify-between">
                      <span className="font-medium">Color Fresh</span>
                      <span className="text-green-600 font-bold">10+ fashion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Perguntas Frequentes - Wella
            </h2>
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-red-600 mb-3">
                  Quantos produtos Wella vocês têm em stock?
                </h3>
                <p className="text-gray-600">
                  Temos mais de 45 produtos Wella diferentes em stock, incluindo todas as principais
                  linhas: Koleston Perfect, Color Touch, Illumina Color e Color Fresh.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-red-600 mb-3">
                  As tintas Wella são originais?
                </h3>
                <p className="text-gray-600">
                  Sim, todas as tintas Wella vendidas são 100% originais, importadas diretamente
                  do fornecedor oficial com garantia de autenticidade e qualidade.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-red-600 mb-3">
                  Quanto tempo dura a coloração Wella?
                </h3>
                <p className="text-gray-600">
                  A duração varia por linha: Koleston Perfect dura 6-8 semanas, Color Touch 4-6 semanas,
                  Illumina Color 6-8 semanas, dependendo do cuidado pós-coloração.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-red-600 mb-3">
                  Fazem entrega rápida em Portugal?
                </h3>
                <p className="text-gray-600">
                  Sim, enviamos em 24-48h para todo Portugal Continental. Oferecemos também
                  opções de entrega expressa para encomendas urgentes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-orange-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              45+ Produtos Wella Esperando por Si
            </h2>
            <p className="text-xl mb-8 opacity-90">
              O maior stock de produtos Wella em Portugal.
              Koleston, Color Touch, Illumina - todos originais, todos disponíveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/produtos"
                className="bg-white text-red-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all inline-flex items-center justify-center"
              >
                Ver Todos os Produtos Wella
                <span className="ml-2">🛒</span>
              </Link>
              <Link
                href="/contato"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-red-600 transition-all inline-flex items-center justify-center"
              >
                Dúvidas sobre Cores?
                <span className="ml-2">🎨</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}