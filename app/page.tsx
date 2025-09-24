import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Suspense } from 'react';
import FeaturedProducts from '../components/products/FeaturedProducts';
import VideoHeroCarousel from '../components/home/VideoHeroCarousel';

export const metadata: Metadata = {
  title: 'JC Hair Studio\'s 62 - Produtos Capilares Brasileiros Premium | Mega Hair, Progressivas',
  description: 'Loja online de produtos capilares brasileiros premium com +40 anos de tradição familiar. Mega hair 100% humano, progressivas Vogue originais, BTX capilar, maquiagem brasileira. Entrega em toda Europa com garantia de qualidade.',
  keywords: [
    // Mega Hair
    'mega hair brasileiro', 'cabelo humano brasileiro', 'extensão capilar brasil', 'mega hair natural', 'cabelo brasileiro premium',
    // Progressivas
    'progressiva vogue original', 'progressiva brasileira', 'btx capilar profissional', 'botox capilar', 'alisamento brasileiro',
    // Maquiagem
    'maquiagem brasileira europa', 'natura portugal', 'eudora bélgica', 'ruby rose europa', 'cosméticos brasil',
    // Localização
    'produtos brasileiros portugal', 'cosméticos brasil europa', 'loja brasileira portugal', 'produtos brasil bélgica',
    // Marca
    'jc hair studio 62', 'tradição familiar 40 anos', 'produtos autênticos brasil', 'qualidade premium brasil'
  ],
  openGraph: {
    title: 'JC Hair Studio\'s 62 - Produtos Capilares Brasileiros Premium',
    description: 'Mega hair brasileiro 100% humano, progressivas Vogue originais, maquiagem brasileira. +40 anos tradição familiar. Entrega Europa.',
    images: [{
      url: '/og-home-brasil.jpg',
      width: 1200,
      height: 630,
      alt: 'Produtos Capilares Brasileiros Premium - JC Hair Studio\'s 62'
    }],
    type: 'website',
    locale: 'pt_PT'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jchairstudios62',
    title: 'JC Hair Studio\'s 62 - Produtos Capilares Brasileiros Premium',
    description: 'Mega hair brasileiro, progressivas Vogue, maquiagem brasileira. Tradição familiar +40 anos.',
    images: ['/twitter-home-brasil.jpg']
  }
};

// Removed API fetch and price-related components

export default function HomePage() {
  return (
    <>
      {/* Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: "JC Hair Studio's 62",
            alternateName: ["JC Hair Studios 62", "62 Beauty"],
            description: 'Loja online de produtos capilares brasileiros premium com mais de 40 anos de tradição familiar.',
            url: 'https://jchairstudios62.xyz',
            logo: 'https://jchairstudios62.xyz/logo-brasil.png',
            image: 'https://jchairstudios62.xyz/og-home-brasil.jpg',
            foundingDate: '2000',
            founders: {
              '@type': 'Person',
              name: 'Julio César',
              nationality: 'Brazilian',
              knowsAbout: ['Brazilian Hair Products', 'Hair Extensions', 'Brazilian Cosmetics']
            },
            contactPoint: [
              {
                '@type': 'ContactPoint',
                telephone: '+351928375226',
                contactType: 'Customer Service',
                areaServed: ['PT', 'ES', 'FR', 'IT', 'BE', 'DE'],
                availableLanguage: ['Portuguese', 'Spanish', 'English']
              }
            ],
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'R. Gil Vicente, N°5',
              addressLocality: 'Seixal',
              addressRegion: 'Setúbal',
              postalCode: '2840-474',
              addressCountry: 'PT'
            },
            sameAs: [
              'https://instagram.com/jchairstudios62',
              'https://facebook.com/jchairstudios62',
              'https://tiktok.com/@jchairstudios62'
            ],
            hasOfferCatalog: [
              {
                '@type': 'OfferCatalog',
                name: 'Mega Hair Brasileiro',
                description: 'Extensões de cabelo 100% humano brasileiro',
                url: 'https://jchairstudios62.xyz/mega-hair'
              },
              {
                '@type': 'OfferCatalog',
                name: 'Progressivas Brasileiras',
                description: 'Progressivas Vogue e tratamentos brasileiros premium',
                url: 'https://jchairstudios62.xyz/progressiva-vogue'
              },
              {
                '@type': 'OfferCatalog',
                name: 'Maquiagem Brasileira',
                description: 'Cosméticos das melhores marcas brasileiras',
                url: 'https://jchairstudios62.xyz/maquiagem'
              }
            ],
            knowsAbout: [
              'Brazilian Hair Extensions',
              'Professional Hair Treatments',
              'Brazilian Cosmetics',
              'Curly Hair Care',
              'Hair Straightening'
            ],
            areaServed: {
              '@type': 'Place',
              name: 'Europe',
              geo: {
                '@type': 'GeoShape',
                polygon: '48.0,2.0 55.0,12.0 40.0,-8.0 48.0,2.0'
              }
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '280',
              bestRating: '5',
              worstRating: '1'
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
                name: 'Os produtos são realmente brasileiros originais?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim! Todos nossos produtos são importados diretamente do Brasil com certificado de autenticidade. Temos mais de 40 anos de experiência e garantimos a procedência de todos os produtos.'
                }
              },
              {
                '@type': 'Question',
                name: 'O mega hair é 100% cabelo humano brasileiro?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim! Nosso mega hair é 100% cabelo humano brasileiro com cutículas alinhadas, sem processos químicos agressivos. Qualidade premium garantida com duração de 8 a 12 meses.'
                }
              },
              {
                '@type': 'Question',
                name: 'Vocês entregam em toda Europa?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim! Entregamos em Portugal, Espanha, França, Itália, Bélgica, Alemanha e outros países europeus. Prazo: 5-10 dias úteis. Frete grátis acima de €150.'
                }
              },
              {
                '@type': 'Question',
                name: 'As progressivas Vogue são originais do Brasil?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sim! Somos distribuidores autorizados das progressivas Vogue originais. Importamos diretamente do fabricante brasileiro com garantia de autenticidade.'
                }
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
      {/* Video Hero Carousel */}
      <VideoHeroCarousel
        videos={[
          {
            src: '/videos/hero-video-1.mp4',
            title: 'Beleza Premium Brasileira',
            subtitle: 'Os melhores produtos capilares e cosméticos do Brasil para toda a Europa',
            cta: 'Explorar Produtos',
            ctaLink: '/produtos'
          },
          {
            src: '/videos/hero-video-2.mp4',
            title: 'Transforme seu Visual',
            subtitle: 'Cosméticos profissionais e produtos de mega hair de alta qualidade',
            cta: 'Ver Catálogo',
            ctaLink: '/catalogo-brasileiro'
          }
        ]}
      />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-6">
                Mais de 30 anos de experiência
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Especializados em extensões de cabelo premium, oferecemos produtos 
                cuidadosamente selecionados para profissionais e clientes exigentes 
                em toda a Europa.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Nossa paixão pela beleza autêntica nos guia na escolha de cada produto, 
                garantindo qualidade e resultados excepcionais.
              </p>
              <Link 
                href="/sobre" 
                className="text-gray-900 underline hover:no-underline font-medium"
              >
                Conheça nossa história
              </Link>
            </div>
            <div className="aspect-[4/3] bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full transform -translate-x-24 translate-y-24"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-black mb-4">
                Semana da Beleza Brasileira
              </h2>
              <p className="text-xl text-black mb-6 opacity-90">
                Produtos premium brasileiros + Frete grátis
              </p>
              <div className="inline-block bg-black text-amber-400 px-6 py-3 rounded-lg font-bold text-xl tracking-wider mb-4">
                PREMIUM
              </div>
              <p className="text-sm text-black opacity-75">
                Qualidade garantida
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 relative inline-block">
              ESPECIALIDADES BRASILEIRAS
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore nossas categorias de produtos premium
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/produtos" className="group relative h-80 bg-black rounded-2xl overflow-hidden">
              <Image
                src="/images/products/progressivas_diversas/progressivas_diversas_1.JPG"
                alt="Progressivas Premium COCOCHOCO"
                fill
                className="object-cover opacity-70 group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                  Progressivas Premium
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  COCOCHOCO, Brasil Cacau, Forever Liss
                </p>
                <div className="mt-3 text-xs text-amber-400">
                  ⭐ Best Seller
                </div>
              </div>
            </Link>

            <Link href="/mega-hair" className="group relative h-80 bg-black rounded-2xl overflow-hidden">
              <Image
                src="/images/mega-hair/mega-hair-001.jpg"
                alt="Mega Hair Premium Brasileiro"
                fill
                className="object-cover opacity-70 group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                  Mega Hair Premium
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  100% Humano Remy, 20 tipos diferentes
                </p>
                <div className="mt-3 text-xs text-amber-400">
                  ⭐ Exclusivo
                </div>
              </div>
            </Link>

            <Link href="/produtos" className="group relative h-80 bg-black rounded-2xl overflow-hidden">
              <Image
                src="/images/products/mari-maria-bases/mari-maria-base-amndoa.png"
                alt="Maquiagem Brasileira Mari Maria & Bruna Tavares"
                fill
                className="object-cover opacity-70 group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                  Maquiagem Brasileira
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Mari Maria, Bruna Tavares, 10+ tons
                </p>
                <div className="mt-3 text-xs text-amber-400">
                  ⭐ Bestseller
                </div>
              </div>
            </Link>

            <Link href="/produtos" className="group relative h-80 bg-black rounded-2xl overflow-hidden">
              <Image
                src="/images/products/produtos_de_hidratacao/produtos_de_hidratacao_1.WEBP"
                alt="Tratamentos & Hidratação Novex"
                fill
                className="object-cover opacity-70 group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                  Hidratação & BTX
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Novex, Forever Liss, Bio Extratus
                </p>
                <div className="mt-3 text-xs text-amber-400">
                  ⭐ Premium
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 relative inline-block">
              MARCAS BRASILEIRAS AUTÊNTICAS
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Parcerias diretas com os melhores laboratórios do Brasil
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {['COCOCHOCO', 'Mari Maria', 'Bruna Tavares', 'Forever Liss', 'Novex', 'Bio Extratus'].map((brand) => (
              <div key={brand} className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-amber-100 transition-colors">
                  <span className="text-gray-600 font-semibold text-xs text-center px-2">{brand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6 relative inline-block">
              AMADO EM TODA EUROPA
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              O que nossos clientes dizem sobre nós
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Rodrigues",
                location: "Lisboa, Portugal",
                text: "Finalmente encontrei produtos brasileiros autênticos aqui na Europa! A progressiva Cadiveu é exatamente igual à que uso no Brasil. Qualidade excepcional!"
              },
              {
                name: "Carmen Silva", 
                location: "Madrid, España",
                text: "Sou cabeleireira e os produtos da 62 Beauty são os mesmos que usava no meu salão em São Paulo. Entrega rápida e preços justos. Recomendo!"
              },
              {
                name: "Ana França",
                location: "Paris, France", 
                text: "A maquiagem Mari Maria chegou perfeita! Cores vibrantes e duração incrível. Agora posso ter o look brasileiro que tanto amo aqui em Paris."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-amber-400 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6 relative inline-block">
            PRECISA DE AJUDA?
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Nossa equipe está sempre pronta para ajudá-la a encontrar 
            o produto perfeito para suas necessidades.
          </p>
          <a 
            href="https://wa.me/32470032758"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-full hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 font-semibold text-lg tracking-wide transform hover:-translate-y-1"
          >
            📱 Falar no WhatsApp
          </a>
        </div>
      </section>
      </div>
    </>
  );
}