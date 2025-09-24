import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BreadcrumbSnippets } from '../../components/seo/RichSnippets';

const spanishProducts = [
  {
    name: 'Mega Hair Brasileño Premium',
    category: 'Extensiones Capilares',
    price: '299,99€',
    originalPrice: '399,99€',
    description: 'Extensiones de cabello humano 100% brasileño, calidad premium',
    benefits: ['100% Cabello humano', 'Duración 12-18 meses', 'Aplicación profesional']
  },
  {
    name: 'Perfume Lily O Boticário',
    category: 'Perfumería Femenina',
    price: '45,99€',
    originalPrice: '65,00€',
    description: 'Fragancia floral sofisticada con notas de lirio y jazmín',
    benefits: ['Larga duración', 'Fragancia icónica', 'Origen brasileño']
  },
  {
    name: 'Jabones Granado Tradición',
    category: 'Cuidado Corporal',
    price: '8,99€',
    originalPrice: '12,50€',
    description: 'Jabones artesanales con 154 años de tradición farmacéutica',
    benefits: ['Fórmula histórica 1870', '100% Natural', 'Fragancias clásicas']
  }
];

const spanishMarketBenefits = [
  {
    title: 'Envío Rápido a España',
    description: 'Entrega en 3-5 días laborables a toda España peninsular',
    icon: '🚀'
  },
  {
    title: 'Atención en Español',
    description: 'Soporte completo en español con especialistas en productos brasileños',
    icon: '🇪🇸'
  },
  {
    title: 'Productos Exclusivos',
    description: 'Acceso único a productos brasileños premium no disponibles en España',
    icon: '⭐'
  },
  {
    title: 'Garantía de Autenticidad',
    description: 'Todos los productos importados directamente de Brasil con certificación',
    icon: '✅'
  }
];

const breadcrumbs = [
  { name: 'Inicio', url: 'https://jc-hair-studio.vercel.app/' },
  { name: 'Mercados Europeos', url: 'https://jc-hair-studio.vercel.app/europa' },
  { name: 'España', url: 'https://jc-hair-studio.vercel.app/espana-productos-brasileiros' }
];

export const metadata: Metadata = {
  title: 'Productos Brasileños en España | Mega Hair, Perfumes O Boticário, Granado',
  description: 'Descubre productos brasileños premium en España: mega hair, perfumes O Boticário, jabones Granado. Envío rápido a toda España. Atención en español.',
  keywords: 'productos brasileños España, mega hair España, perfumes O Boticário España, Granado España, cosméticos brasileños, extensiones cabello Brasil',
  openGraph: {
    title: 'Productos Brasileños Premium en España | JC Hair Studio\'s 62',
    description: 'Mega hair brasileño, perfumes O Boticário, productos Granado con envío rápido a España. Belleza brasileña auténtica.',
    type: 'website',
    url: 'https://jc-hair-studio.vercel.app/espana-produtos-brasileiros',
    images: [
      {
        url: '/images/markets/spain-brazilian-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Productos Brasileños Premium en España'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Productos Brasileños Premium en España',
    description: 'Mega hair, perfumes O Boticário, Granado con envío a España.',
    images: ['/images/markets/spain-brazilian-products.jpg']
  },
  alternates: {
    canonical: 'https://jc-hair-studio.vercel.app/espana-produtos-brasileiros',
    languages: {
      'es': 'https://jc-hair-studio.vercel.app/espana-produtos-brasileiros',
      'pt': 'https://jc-hair-studio.vercel.app/produtos',
      'en': 'https://jc-hair-studio.vercel.app/en/brazilian-products'
    }
  }
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'JC Hair Studio\'s 62 España',
  description: 'Distribuidor oficial de productos brasileños premium en España. Mega hair, perfumes O Boticário, productos Granado con envío rápido.',
  url: 'https://jc-hair-studio.vercel.app/espana-produtos-brasileiros',
  logo: '/images/jc-logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+34-XXX-XXX-XXX',
    contactType: 'customer service',
    availableLanguage: ['Spanish', 'Portuguese'],
    areaServed: 'ES'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'ES'
  },
  serviceArea: {
    '@type': 'Country',
    name: 'España'
  }
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Envían productos brasileños a España?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, realizamos envíos rápidos de productos brasileños premium a toda España en 3-5 días laborables con seguimiento completo.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Los productos brasileños son originales?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Todos nuestros productos son 100% originales, importados directamente de Brasil con certificación de autenticidad y garantía oficial.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Hay atención al cliente en español?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, ofrecemos atención completa en español con especialistas en productos brasileños para asesorarle en su compra.'
      }
    }
  ]
};

export default function SpainBrazilianProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbSnippets breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex justify-center items-center gap-4 mb-6">
                <span className="text-4xl">🇧🇷</span>
                <span className="text-2xl text-gray-400">→</span>
                <span className="text-4xl">🇪🇸</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                Productos Brasileños en España
              </h1>
              <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-4xl mx-auto">
                Belleza Brasileña Auténtica con Envío Rápido a Toda España
                <span className="block text-lg mt-2 text-orange-600 font-semibold">
                  Mega Hair • Perfumes O Boticário • Granado • Atención en Español
                </span>
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                  🚀 Envío 3-5 días
                </span>
                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
                  🇪🇸 Atención Español
                </span>
                <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full">
                  ✅ Productos Originales
                </span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  🌟 Exclusivos en España
                </span>
              </div>
            </div>

            {/* Market Benefits */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {spanishMarketBenefits.map((benefit, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products for Spain */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Productos Brasileños Más Demandados en España
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {spanishProducts.map((product, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="h-64 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                    <div className="text-6xl">
                      {product.category.includes('Extensiones') ? '💇‍♀️' :
                       product.category.includes('Perfumería') ? '🌸' : '🧼'}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
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
                        <span className="text-2xl font-bold text-orange-600">{product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">{product.originalPrice}</span>
                      </div>
                      <Link
                        href="/productos"
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-2 rounded-full hover:from-yellow-700 hover:to-orange-700 transition-all font-medium"
                      >
                        Ver Producto
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Spanish Market Analysis */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-800">
                  ¿Por Qué Productos Brasileños en España?
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>Tradición de Belleza:</strong> Brasil es reconocido mundialmente por su
                    expertise en productos de belleza y cuidado capilar, especialmente en extensiones
                    y tratamientos naturales.
                  </p>
                  <p>
                    <strong>Ingredientes Únicos:</strong> La biodiversidad amazónica ofrece
                    ingredientes únicos no disponibles en Europa, como açaí, cupuaçu y
                    queratina brasileña.
                  </p>
                  <p>
                    <strong>Calidad Premium:</strong> Marcas como O Boticário y Granado tienen
                    décadas de historia perfeccionando sus fórmulas con estándares internacionales.
                  </p>
                  <p>
                    <strong>Exclusividad:</strong> Muchos productos brasileños no están disponibles
                    en el mercado español, ofreciendo opciones únicas para el consumidor exigente.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-3xl p-8 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Mercado Español
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="text-3xl font-bold text-yellow-600">85%</div>
                      <div className="text-sm text-gray-600">Satisfacción Cliente</div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="text-3xl font-bold text-orange-600">3-5</div>
                      <div className="text-sm text-gray-600">Días Envío</div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="text-3xl font-bold text-red-600">100%</div>
                      <div className="text-sm text-gray-600">Productos Originales</div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <div className="text-3xl font-bold text-green-600">50+</div>
                      <div className="text-sm text-gray-600">Productos Exclusivos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cities Coverage */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Envíos a Principales Ciudades Españolas
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                'Madrid', 'Barcelona', 'Valencia', 'Sevilla',
                'Zaragoza', 'Málaga', 'Murcia', 'Palma',
                'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba'
              ].map((city, index) => (
                <div key={index} className="bg-white rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all">
                  <div className="text-2xl mb-2">🏢</div>
                  <div className="font-medium text-gray-800">{city}</div>
                  <div className="text-sm text-orange-600">3-5 días</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Y muchas más ciudades. Consulta disponibilidad para tu localidad.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Preguntas Frecuentes - España
            </h2>
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-orange-600 mb-3">
                  ¿Envían productos brasileños a España?
                </h3>
                <p className="text-gray-600">
                  Sí, realizamos envíos rápidos de productos brasileños premium a toda España
                  en 3-5 días laborables con seguimiento completo y garantía de entrega.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-orange-600 mb-3">
                  ¿Los productos brasileños son originales?
                </h3>
                <p className="text-gray-600">
                  Todos nuestros productos son 100% originales, importados directamente de Brasil
                  con certificación de autenticidad y garantía oficial de cada marca.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-orange-600 mb-3">
                  ¿Hay atención al cliente en español?
                </h3>
                <p className="text-gray-600">
                  Sí, ofrecemos atención completa en español con especialistas en productos brasileños
                  para asesorarle en su compra y resolver cualquier consulta.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-orange-600 mb-3">
                  ¿Qué métodos de pago aceptan?
                </h3>
                <p className="text-gray-600">
                  Aceptamos tarjetas de crédito/débito, PayPal, transferencia bancaria y otros
                  métodos de pago populares en España para su comodidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-yellow-600 to-orange-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Descubre la Belleza Brasileña en España
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Productos exclusivos con la calidad brasileña que tanto buscabas.
              Envío rápido y atención personalizada en español.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/productos"
                className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all inline-flex items-center justify-center"
              >
                Ver Catálogo Completo
                <span className="ml-2">🛍️</span>
              </Link>
              <Link
                href="/contato"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-orange-600 transition-all inline-flex items-center justify-center"
              >
                Consulta en Español
                <span className="ml-2">🇪🇸</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}