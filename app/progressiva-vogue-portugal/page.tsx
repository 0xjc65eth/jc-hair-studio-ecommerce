import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProductSnippets, BreadcrumbSnippets, type Product } from '../../components/seo/RichSnippets';

const vogueProducts: Product[] = [
  {
    name: 'Progressiva Vogue Platinum 1L',
    brand: 'Vogue',
    category: 'Progressivas',
    description: 'Progressiva Vogue Original Platinum - Redução 95% do volume, duração 4-6 meses',
    image: '/images/products/vogue/progressiva-vogue-platinum.jpg',
    price: 89.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'VOGUE-PLAT-1L'
  },
  {
    name: 'Progressiva Vogue Premium 500ml',
    brand: 'Vogue',
    category: 'Progressivas',
    description: 'Progressiva Vogue Premium com queratina brasileira e colágeno',
    image: '/images/products/vogue/progressiva-vogue-premium.jpg',
    price: 65.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'VOGUE-PREM-500ML'
  },
  {
    name: 'Kit Vogue Completo',
    brand: 'Vogue',
    category: 'Progressivas',
    description: 'Kit completo: Progressiva + Shampoo + Condicionador + Máscara Vogue',
    image: '/images/products/vogue/kit-vogue-completo.jpg',
    price: 129.99,
    currency: 'EUR',
    availability: 'InStock',
    sku: 'VOGUE-KIT-COMP'
  }
];

const vogueFeatures = [
  {
    title: 'Original Brasileiro',
    description: 'Importada diretamente do Brasil, com certificado de autenticidade',
    icon: '🇧🇷'
  },
  {
    title: 'Redução 95% Volume',
    description: 'Tecnologia brasileira comprovada para reduzir até 95% do frizz',
    icon: '📉'
  },
  {
    title: 'Duração 4-6 Meses',
    description: 'Resultado profissional duradouro com manutenção mínima',
    icon: '⏰'
  },
  {
    title: 'Sem Formol',
    description: 'Fórmula segura sem formol, aprovada para uso profissional',
    icon: '✅'
  }
];

const breadcrumbs = [
  { name: 'Início', url: 'https://jchairstudios62.xyz/' },
  { name: 'Progressivas', url: 'https://jchairstudios62.xyz/progressivas' },
  { name: 'Vogue Portugal', url: 'https://jchairstudios62.xyz/progressiva-vogue-portugal' }
];

export const metadata: Metadata = {
  title: 'Progressiva Vogue Original Portugal | Platinum e Premium Brasileira',
  description: 'Progressiva Vogue original brasileira em Portugal. Platinum 1L €89.99, Premium 500ml €65.99. Redução 95% volume, duração 4-6 meses. Importação direta Brasil.',
  keywords: 'progressiva vogue portugal, progressiva vogue original, vogue platinum portugal, progressiva brasileira, alisamento vogue, progressiva sem formol, vogue premium',
  openGraph: {
    title: 'Progressiva Vogue Original Portugal - Platinum e Premium',
    description: 'Progressiva Vogue brasileira original. Redução 95% volume, duração 4-6 meses. Importação direta do Brasil com garantia.',
    type: 'website',
    url: 'https://jchairstudios62.xyz/progressiva-vogue-portugal',
    images: [
      {
        url: '/images/products/vogue/vogue-collection-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Progressiva Vogue Original Portugal - Coleção Completa'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Progressiva Vogue Portugal - Original Brasileira',
    description: 'Platinum, Premium e Kit Completo. Importação direta Brasil.',
    images: ['/images/products/vogue/vogue-collection-hero.jpg']
  },
  alternates: {
    canonical: 'https://jchairstudios62.xyz/progressiva-vogue-portugal'
  }
};

const brandJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  name: 'Vogue Brasil',
  description: 'Marca brasileira líder em progressivas capilares, conhecida pela tecnologia Platinum e fórmulas sem formol.',
  url: 'https://jchairstudios62.xyz/progressiva-vogue-portugal',
  logo: '/images/brands/vogue-logo.png'
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'JC Hair Studio\'s 62 - Progressiva Vogue Portugal',
  description: 'Distribuidor oficial Progressiva Vogue em Portugal. Produtos originais importados diretamente do Brasil com garantia.',
  url: 'https://jchairstudios62.xyz/progressiva-vogue-portugal',
  logo: '/images/jc-logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+351-XXX-XXX-XXX',
    contactType: 'customer service',
    availableLanguage: ['Portuguese'],
    areaServed: 'Portugal'
  }
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'A Progressiva Vogue vendida é original?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, todas as progressivas Vogue vendidas pela JC Hair Studio\'s 62 são 100% originais, importadas diretamente do Brasil com certificado de autenticidade.'
      }
    },
    {
      '@type': 'Question',
      name: 'Quanto tempo dura o resultado da Progressiva Vogue?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Progressiva Vogue tem duração de 4 a 6 meses dependendo do tipo de cabelo e cuidados pós-aplicação.'
      }
    },
    {
      '@type': 'Question',
      name: 'A Progressiva Vogue tem formol?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não, a Progressiva Vogue possui fórmula livre de formol, sendo segura para uso profissional e doméstico.'
      }
    }
  ]
};

export default function ProgressivaVoguePortugalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbSnippets breadcrumbs={breadcrumbs} />
      {vogueProducts.map((product, index) => (
        <ProductSnippets key={index} product={product} />
      ))}

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="mb-6">
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  ✅ Original Brasileira - Em Stock
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
                Progressiva Vogue Portugal
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto">
                Original Brasileira • Redução 95% Volume • Duração 4-6 Meses
                <span className="block text-lg mt-2 text-purple-600 font-semibold">
                  Importação Direta Brasil • Entrega Rápida Portugal • Garantia Autenticidade
                </span>
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                  🥇 Platinum 1L
                </span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  💎 Premium 500ml
                </span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  📦 Kit Completo
                </span>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                  🚫 Sem Formol
                </span>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {vogueFeatures.map((feature, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Progressiva Vogue Original - Produtos Disponíveis
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {vogueProducts.map((product, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">
                        {product.name.includes('Platinum') ? '🥇' :
                         product.name.includes('Premium') ? '💎' : '📦'}
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        {product.availability === 'InStock' ? '✅ Em Stock' : '❌ Esgotado'}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        Original
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        Importação direta Brasil
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        Certificado autenticidade
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        Entrega rápida Portugal
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-3xl font-bold text-purple-600">€{product.price}</span>
                        <span className="text-sm text-gray-500 ml-2">+ Envio</span>
                      </div>
                      <Link
                        href="/produtos"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all font-medium"
                      >
                        Comprar Agora
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Vogue Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-800">
                  Por que Progressiva Vogue é a Escolha dos Profissionais?
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>Tecnologia Brasileira:</strong> Desenvolvida especificamente para cabelos brasileiros,
                    a Vogue oferece resultados superiores em todos os tipos de cabelo.
                  </p>
                  <p>
                    <strong>Fórmula Sem Formol:</strong> Segurança comprovada sem abrir mão da eficácia.
                    Reduz até 95% do volume sem danificar os fios.
                  </p>
                  <p>
                    <strong>Duração Excepcional:</strong> Com cuidados adequados, o resultado pode durar
                    até 6 meses, oferecendo excelente custo-benefício.
                  </p>
                  <p>
                    <strong>Garantia de Originalidade:</strong> Importamos diretamente do Brasil,
                    garantindo que você receba sempre o produto original Vogue.
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/produtos"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all font-semibold inline-flex items-center"
                  >
                    Ver Produtos Vogue
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-200 to-blue-200 rounded-3xl p-8 text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Resultados Comprovados
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="text-3xl font-bold text-purple-600">95%</div>
                      <div className="text-sm text-gray-600">Redução Volume</div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="text-3xl font-bold text-blue-600">6</div>
                      <div className="text-sm text-gray-600">Meses Duração</div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="text-3xl font-bold text-green-600">100%</div>
                      <div className="text-sm text-gray-600">Sem Formol</div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="text-3xl font-bold text-yellow-600">🇧🇷</div>
                      <div className="text-sm text-gray-600">Original Brasil</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Perguntas Frequentes - Progressiva Vogue
            </h2>
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">
                  A Progressiva Vogue vendida é original?
                </h3>
                <p className="text-gray-600">
                  Sim, todas as progressivas Vogue vendidas pela JC Hair Studio's 62 são 100% originais,
                  importadas diretamente do Brasil com certificado de autenticidade.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">
                  Quanto tempo dura o resultado da Progressiva Vogue?
                </h3>
                <p className="text-gray-600">
                  A Progressiva Vogue tem duração de 4 a 6 meses dependendo do tipo de cabelo
                  e cuidados pós-aplicação. Com manutenção adequada, pode durar até 6 meses.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">
                  A Progressiva Vogue tem formol?
                </h3>
                <p className="text-gray-600">
                  Não, a Progressiva Vogue possui fórmula livre de formol, sendo segura para uso
                  profissional e doméstico, sem comprometer a eficácia do alisamento.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">
                  Qual a diferença entre Platinum e Premium?
                </h3>
                <p className="text-gray-600">
                  A Platinum 1L é a versão mais concentrada, ideal para cabelos muito crespos ou
                  resistentes. A Premium 500ml é perfeita para cabelos ondulados a cacheados.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Progressiva Vogue Original em Portugal
            </h2>
            <p className="text-xl mb-8 opacity-90">
              A única progressiva brasileira com tecnologia comprovada.
              Importação direta, garantia de originalidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/produtos"
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all inline-flex items-center justify-center"
              >
                Comprar Progressiva Vogue
                <span className="ml-2">🛒</span>
              </Link>
              <Link
                href="/contato"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-purple-600 transition-all inline-flex items-center justify-center"
              >
                Dúvidas? Fale Conosco
                <span className="ml-2">💬</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}