import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

const boticarioProducts = [
  {
    name: 'Perfume Lily',
    category: 'Perfumes Femininos',
    price: '€45.99',
    originalPrice: '€65.00',
    description: 'Fragrância floral sofisticada com notas de lírio e jasmim',
    benefits: ['Longa duração', 'Fragrância marcante', 'Ideal para uso diário']
  },
  {
    name: 'Malbec',
    category: 'Perfumes Masculinos',
    price: '€52.99',
    originalPrice: '€75.00',
    description: 'Amadeirado sofisticado inspirado no vinho argentino',
    benefits: ['Fixação superior', 'Aroma sedutor', 'Elegância masculina']
  },
  {
    name: 'Cuide-se Bem',
    category: 'Linha Corporal',
    price: '€28.99',
    originalPrice: '€39.90',
    description: 'Kit hidratante corporal com fragrâncias exclusivas',
    benefits: ['Hidratação profunda', '24h de perfume', 'Pele sedosa']
  }
];

const brandHistory = {
  founded: '1977',
  founder: 'Miguel Krigsner',
  headquarters: 'Curitiba, Brasil',
  stores: '3800+',
  countries: '9 países',
  sustainability: '70% ingredientes naturais em cosméticos'
};

export const metadata: Metadata = {
  title: 'O Boticário Portugal | Perfumes e Cosméticos Brasileiros Premium',
  description: 'Descubra O Boticário em Portugal - perfumes icônicos como Lily, Malbec, Cuide-se Bem. Cosméticos brasileiros premium com 45+ anos de tradição. Entrega rápida Portugal.',
  keywords: 'O Boticário Portugal, perfumes O Boticário, Lily perfume, Malbec perfume, cosméticos brasileiros, perfumaria O Boticário, Cuide-se Bem, beleza brasileira',
  openGraph: {
    title: 'O Boticário Portugal - Perfumes e Cosméticos Brasileiros Premium',
    description: 'Perfumes icônicos O Boticário: Lily, Malbec, Cuide-se Bem. Cosméticos brasileiros premium em Portugal com entrega rápida.',
    type: 'website',
    url: 'https://jc-hair-studio.vercel.app/boticario-portugal',
    images: [
      {
        url: '/images/brands/boticario-collection.jpg',
        width: 1200,
        height: 630,
        alt: 'Coleção O Boticário - Perfumes e Cosméticos Brasileiros'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O Boticário Portugal - Perfumes Brasileiros Premium',
    description: 'Lily, Malbec, Cuide-se Bem e mais. Cosméticos O Boticário em Portugal.',
    images: ['/images/brands/boticario-collection.jpg']
  },
  alternates: {
    canonical: 'https://jc-hair-studio.vercel.app/boticario-portugal'
  }
};

const brandJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  name: 'O Boticário',
  description: 'Marca brasileira líder em perfumaria e cosméticos, conhecida por fragrâncias icônicas como Lily e Malbec, com 45+ anos de história.',
  foundingDate: '1977-03-15',
  founder: {
    '@type': 'Person',
    name: 'Miguel Krigsner'
  },
  url: 'https://jc-hair-studio.vercel.app/boticario-portugal',
  logo: '/images/brands/boticario-logo.png',
  sameAs: [
    'https://www.boticario.com.br',
    'https://www.instagram.com/boticario',
    'https://www.facebook.com/boticario'
  ],
  makesOffer: {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Product',
      name: 'Produtos O Boticário',
      category: 'Perfumes e Cosméticos',
      brand: 'O Boticário'
    }
  }
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'JC Hair Studio\'s 62 - O Boticário Portugal',
  description: 'Distribuidor autorizado O Boticário em Portugal. Perfumes Lily, Malbec, linha Cuide-se Bem e cosméticos brasileiros premium.',
  url: 'https://jc-hair-studio.vercel.app/boticario-portugal',
  logo: '/images/jc-logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+351-XXX-XXX-XXX',
    contactType: 'customer service',
    availableLanguage: ['Portuguese', 'English'],
    areaServed: 'Portugal'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'PT'
  }
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O Boticário tem loja física em Portugal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O Boticário não possui lojas físicas próprias em Portugal, mas você pode encontrar produtos originais O Boticário através da JC Hair Studio\'s 62 com entrega em todo Portugal.'
      }
    },
    {
      '@type': 'Question',
      name: 'Quais são os perfumes O Boticário mais vendidos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Os perfumes O Boticário mais populares incluem Lily (fragrância floral feminina), Malbec (amadeirado masculino), Floratta e a linha Cuide-se Bem com diversas opções.'
      }
    },
    {
      '@type': 'Question',
      name: 'Os produtos O Boticário em Portugal são originais?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, todos os produtos O Boticário vendidos pela JC Hair Studio\'s 62 são 100% originais, importados diretamente do Brasil com garantia de autenticidade.'
      }
    }
  ]
};

export default function BoticarioPortugalPage() {
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

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 bg-clip-text text-transparent mb-6">
                O Boticário Portugal
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto">
                Perfumes Icônicos e Cosméticos Brasileiros Premium
                <span className="block text-lg mt-2 text-purple-600 font-semibold">
                  45+ Anos de Tradição Brasileira | Entrega Rápida Portugal
                </span>
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                  🌸 Lily Original
                </span>
                <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
                  🍷 Malbec Masculino
                </span>
                <span className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full">
                  💅 Cuide-se Bem
                </span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  🌿 70% Naturais
                </span>
              </div>
            </div>

            {/* Brand Heritage */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-xl">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                A Marca Brasileira de Beleza Mais Amada
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{brandHistory.founded}</div>
                  <div className="text-gray-600">Fundada em {brandHistory.founded}</div>
                  <div className="text-sm text-gray-500 mt-1">Por Miguel Krigsner</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-pink-600 mb-2">{brandHistory.stores}</div>
                  <div className="text-gray-600">Lojas no mundo</div>
                  <div className="text-sm text-gray-500 mt-1">Em {brandHistory.countries}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">70%</div>
                  <div className="text-gray-600">Ingredientes naturais</div>
                  <div className="text-sm text-gray-500 mt-1">Em cosméticos</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Showcase */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Produtos O Boticário Mais Procurados em Portugal
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {boticarioProducts.map((product, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <div className="text-6xl">
                      {product.category.includes('Feminino') ? '🌸' :
                       product.category.includes('Masculino') ? '🍷' : '💅'}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
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
                        <span className="text-2xl font-bold text-purple-600">{product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                      </div>
                      <Link
                        href="/produtos"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
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

        {/* Brand Story */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-800">
                  História O Boticário: De Farmácia a Império da Beleza
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>1977:</strong> Miguel Krigsner transforma uma pequena farmácia em Curitiba
                    na maior rede de franquias de cosméticos do Brasil.
                  </p>
                  <p>
                    <strong>Inovação:</strong> Primeira marca brasileira a criar perfumes com identidade
                    própria, como o icônico Lily (1986) e Malbec (2005).
                  </p>
                  <p>
                    <strong>Sustentabilidade:</strong> Pioneira no uso de ingredientes naturais brasileiros,
                    com 70% dos cosméticos contendo ativos da biodiversidade nacional.
                  </p>
                  <p>
                    <strong>Portugal:</strong> Agora disponível através da JC Hair Studio's 62,
                    trazendo a autêntica beleza brasileira para o mercado português.
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/produtos"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all font-semibold inline-flex items-center"
                  >
                    Explorar Catálogo O Boticário
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl p-8 text-center">
                  <div className="text-6xl mb-4">🏪</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Maior Rede de Beleza do Brasil
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-purple-600">3.800+</div>
                      <div className="text-sm text-gray-600">Lojas</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-pink-600">9</div>
                      <div className="text-sm text-gray-600">Países</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-amber-600">600+</div>
                      <div className="text-sm text-gray-600">Produtos</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">45+</div>
                      <div className="text-sm text-gray-600">Anos</div>
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
              Perguntas Frequentes - O Boticário Portugal
            </h2>
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">
                  O Boticário tem loja física em Portugal?
                </h3>
                <p className="text-gray-600">
                  O Boticário não possui lojas físicas próprias em Portugal, mas você pode encontrar
                  produtos originais O Boticário através da JC Hair Studio's 62 com entrega em todo Portugal.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">
                  Quais são os perfumes O Boticário mais vendidos?
                </h3>
                <p className="text-gray-600">
                  Os perfumes O Boticário mais populares incluem Lily (fragrância floral feminina),
                  Malbec (amadeirado masculino), Floratta e a linha Cuide-se Bem com diversas opções.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">
                  Os produtos O Boticário em Portugal são originais?
                </h3>
                <p className="text-gray-600">
                  Sim, todos os produtos O Boticário vendidos pela JC Hair Studio's 62 são 100% originais,
                  importados diretamente do Brasil com garantia de autenticidade.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-purple-600 mb-3">
                  Qual a diferença entre Lily e outros perfumes femininos?
                </h3>
                <p className="text-gray-600">
                  Lily é uma fragrância floral sofisticada com notas de lírio e jasmim, criada especificamente
                  para a mulher brasileira. Sua fixação e projeção são superiores a muitos perfumes importados.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Descubra a Beleza Brasileira Autêntica
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Perfumes Lily, Malbec, Cuide-se Bem e muito mais.
              A tradição O Boticário agora em Portugal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/produtos"
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all inline-flex items-center justify-center"
              >
                Ver Todos Produtos O Boticário
                <span className="ml-2">🛍️</span>
              </Link>
              <Link
                href="/contato"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-purple-600 transition-all inline-flex items-center justify-center"
              >
                Falar com Especialista
                <span className="ml-2">💬</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}