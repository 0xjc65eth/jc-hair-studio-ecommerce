import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Header, Footer } from '../components/layout';
import CookieBanner from '../components/layout/CookieBanner';
import { ToastProvider } from '../lib/providers/ToastProvider';
import { AuthProvider } from '../lib/providers/auth-provider';
import { CartInitializer } from '@/lib/providers/CartProvider';
import '../styles/globals.css';
import '../styles/components.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'JC Hair Studio\'s 62 - Produtos Capilares Brasileiros Premium | Mega Hair, Progressivas',
    template: '%s | JC Hair Studio\'s 62 - Produtos Brasileiros',
  },
  description: 'Loja online de produtos capilares brasileiros premium com +40 anos de tradição familiar. Mega hair 100% humano, progressivas Vogue, BTX capilar, tratamentos e maquiagem brasileira. Entrega Europa.',
  keywords: [
    // Mega Hair - Termos principais
    'mega hair brasileiro',
    'extensão cabelo humano',
    'mega hair natural',
    'cabelo brasileiro premium',
    'extensão capilar 100% humano',
    'mega hair liso cacheado ondulado',

    // Progressivas e Tratamentos
    'progressiva vogue original',
    'progressiva brasileira premium',
    'btx capilar profissional',
    'tratamento capilar brasileiro',
    'botox capilar',
    'alisamento capilar',

    // Maquiagem Brasileira
    'maquiagem brasileira original',
    'cosméticos brasil',
    'natura eudora avon',
    'ruby rose quem disse berenice',
    'produtos beleza brasil',

    // Localização e Entrega
    'produtos brasileiros portugal',
    'cosméticos brasil europa',
    'mega hair entrega europa',
    'loja brasileira portugal',
    'produtos brasil bélgica',

    // Marca e Qualidade
    'jc hair studio 62',
    'tradição familiar 40 anos',
    'cabeleireiro brasileiro portugal',
    'produtos autênticos brasil',
    'qualidade premium brasil'
  ],
  authors: [{ name: '62 Beauty' }],
  creator: '62 Beauty',
  publisher: '62 Beauty',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    alternateLocale: ['pt_BR', 'en_US', 'es_ES', 'fr_FR', 'nl_BE'],
    url: 'https://jchairstudios62.xyz',
    siteName: 'JC Hair Studio\'s 62 - Produtos Brasileiros',
    title: 'JC Hair Studio\'s 62 - Produtos Capilares Brasileiros Premium',
    description: 'Loja online de produtos capilares brasileiros premium. Mega hair 100% humano, progressivas Vogue, maquiagem brasileira. +40 anos tradição familiar. Entrega Europa.',
    images: [
      {
        url: '/og-image-brasil.jpg',
        width: 1200,
        height: 630,
        alt: 'JC Hair Studio\'s 62 - Produtos Capilares Brasileiros Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jchairstudios62',
    creator: '@jchairstudios62',
    title: 'JC Hair Studio\'s 62 - Produtos Capilares Brasileiros Premium',
    description: 'Mega hair brasileiro 100% humano, progressivas Vogue originais, maquiagem brasileira premium. Tradição familiar +40 anos. Entrega Europa.',
    images: ['/twitter-image-brasil.jpg'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#1a1a1a',
      },
    ],
  },
  verification: {
    google: 'verification_token_google',
  },
  category: 'e-commerce',
  alternates: {
    canonical: 'https://jchairstudios62.xyz',
    languages: {
      'pt-PT': '/pt',
      'en-US': '/en', 
      'es-ES': '/es',
      'fr-FR': '/fr',
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params?: Promise<{
    locale?: string;
  }>;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="pt" 
      className={`${inter.variable} ${playfair.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/images/hero-bg.jpg" as="image" />
        
        {/* PWA Configuration */}
        <meta name="application-name" content="62 Beauty's 62" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="62 Beauty's 62" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1a1a1a" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Schema.org markup for Google+ */}
        <meta itemProp="name" content="62 Beauty's 62" />
        <meta itemProp="description" content="E-commerce especializado em extensões de cabelo de alta qualidade" />
        <meta itemProp="image" content="/og-image.jpg" />
        
        {/* Google Analytics 4 */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                    custom_map: {
                      'custom_parameter_1': 'product_category',
                      'custom_parameter_2': 'product_brand',
                      'custom_parameter_3': 'user_country'
                    },
                    // Enhanced E-commerce tracking
                    send_page_view: true,
                    // Custom dimensions for Brazilian products
                    custom_parameter_1: 'produtos_brasileiros',
                    custom_parameter_2: 'jc_hair_studio_62',
                    custom_parameter_3: 'europa'
                  });

                  // Enhanced E-commerce - Product views
                  gtag('event', 'page_view', {
                    currency: 'EUR',
                    value: 0,
                    content_group1: 'Produtos Brasileiros',
                    content_group2: 'E-commerce',
                    content_group3: 'Europa'
                  });

                  // Track Brazilian product interactions
                  window.trackBrazilianProduct = function(action, productData) {
                    gtag('event', action, {
                      event_category: 'Brazilian Products',
                      event_label: productData.name,
                      value: productData.price,
                      currency: 'EUR',
                      custom_parameter_1: productData.category,
                      custom_parameter_2: productData.brand || 'JC Hair Studio 62',
                      items: [{
                        item_id: productData.id,
                        item_name: productData.name,
                        category: productData.category,
                        quantity: 1,
                        price: productData.price,
                        item_brand: productData.brand || 'Brasileiro',
                        item_variant: productData.type
                      }]
                    });
                  };

                  // Track scroll depth for SEO insights
                  let scrollTracked = false;
                  window.addEventListener('scroll', function() {
                    if (!scrollTracked && window.scrollY > document.body.scrollHeight * 0.75) {
                      scrollTracked = true;
                      gtag('event', 'scroll', {
                        event_category: 'Engagement',
                        event_label: '75% Scroll',
                        value: 75
                      });
                    }
                  });
                `,
              }}
            />
          </>
        )}

        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'your-verification-code'} />

        {/* Bing Webmaster Tools */}
        <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_VERIFICATION || 'your-bing-verification'} />

        {/* Yandex Verification (para alcance europeu) */}
        <meta name="yandex-verification" content={process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || 'your-yandex-verification'} />

        {/* Pinterest domain verification */}
        <meta name="p:domain_verify" content={process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION || 'your-pinterest-verification'} />

        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content={process.env.NEXT_PUBLIC_FACEBOOK_VERIFICATION || 'your-facebook-verification'} />
      </head>
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                     bg-black text-white px-4 py-2 rounded z-50"
        >
          Pular para o conteúdo principal
        </a>

        {/* Main App Structure */}
        <AuthProvider>
          <CartInitializer>
            <div className="min-h-screen flex flex-col">
              {/* Header */}
              <Header />

              {/* Main Content */}
              <main id="main-content" className="flex-1 pt-16 lg:pt-20">
                {children}
              </main>

              {/* Footer */}
              <Footer />
            </div>
          </CartInitializer>
        </AuthProvider>

        {/* Global Loading Indicator */}
        <div id="global-loading" className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 hidden items-center justify-center">
          <div className="loading-spinner w-8 h-8 border-2 border-black animate-spin"></div>
        </div>

        {/* Toast Notifications */}
        <ToastProvider />

        {/* Cookie Consent Banner (GDPR) */}
        <CookieBanner />

        {/* Toast Notifications Container */}
        <div id="toast-container" className="fixed bottom-4 right-4 space-y-2 z-50"></div>


        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'OnlineStore',
              name: "JC Hair Studio's 62",
              alternateName: "JC Hair Studios 62",
              description: 'Loja online de produtos capilares brasileiros premium com mais de 40 anos de tradição familiar. Especializada em mega hair, progressivas, BTX capilar e maquiagem brasileira.',
              url: 'https://jchairstudios62.xyz',
              logo: 'https://jchairstudios62.xyz/logo-brasil.png',
              image: 'https://jchairstudios62.xyz/og-image-brasil.jpg',
              founder: {
                '@type': 'Person',
                name: 'Julio César',
                nationality: 'Brazilian',
                knowsAbout: ['Hair Care', 'Brazilian Beauty Products', 'Professional Hair Extensions'],
                alumniOf: 'International Hair Academy'
              },
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+351928375226',
                  contactType: 'Customer Service',
                  areaServed: ['PT', 'BE', 'ES', 'FR', 'IT', 'DE', 'NL'],
                  availableLanguage: ['Portuguese', 'English', 'Spanish', 'French'],
                  hoursAvailable: {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    opens: '09:00',
                    closes: '18:00',
                    timeZone: 'Europe/Lisbon'
                  }
                },
                {
                  '@type': 'ContactPoint',
                  telephone: '+32472384027',
                  contactType: 'Customer Service',
                  areaServed: 'BE',
                  availableLanguage: ['Portuguese', 'French', 'Dutch']
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
                'https://tiktok.com/@jchairstudios62',
                'https://youtube.com/@jchairstudios62'
              ],
              serviceArea: {
                '@type': 'GeoCircle',
                geoMidpoint: {
                  '@type': 'GeoCoordinates',
                  latitude: 38.6500,
                  longitude: -9.1000
                },
                geoRadius: '2000000'
              },
              hasOfferCatalog: [
                {
                  '@type': 'OfferCatalog',
                  name: 'Mega Hair Brasileiro',
                  description: 'Extensões de cabelo 100% humano brasileiro',
                  itemListElement: [
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Product',
                        name: 'Mega Hair Brasileiro 100% Humano',
                        category: 'Hair Extensions',
                        brand: 'JC Hair Studio\'s 62',
                        countryOfOrigin: 'BR',
                        material: 'Human Hair'
                      },
                      priceCurrency: 'EUR',
                      priceRange: '€85-€285',
                      availability: 'https://schema.org/InStock'
                    }
                  ]
                },
                {
                  '@type': 'OfferCatalog',
                  name: 'Progressivas Brasileiras',
                  description: 'Progressivas e tratamentos capilares brasileiros premium',
                  itemListElement: [
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Product',
                        name: 'Progressiva Vogue Original',
                        category: 'Hair Treatment',
                        brand: 'Vogue',
                        countryOfOrigin: 'BR'
                      },
                      priceCurrency: 'EUR',
                      priceRange: '€45-€190',
                      availability: 'https://schema.org/InStock'
                    }
                  ]
                },
                {
                  '@type': 'OfferCatalog',
                  name: 'Maquiagem Brasileira',
                  description: 'Cosméticos e maquiagem das melhores marcas brasileiras',
                  itemListElement: [
                    {
                      '@type': 'Offer',
                      itemOffered: {
                        '@type': 'Product',
                        name: 'Maquiagem Brasileira Premium',
                        category: 'Cosmetics',
                        countryOfOrigin: 'BR'
                      },
                      priceCurrency: 'EUR',
                      priceRange: '€25-€190',
                      availability: 'https://schema.org/InStock'
                    }
                  ]
                }
              ],
              specialty: [
                'Brazilian Hair Extensions',
                'Professional Hair Treatments',
                'Brazilian Cosmetics',
                'Curly Hair Products',
                'Hair Straightening'
              ],
              paymentAccepted: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'],
              currenciesAccepted: 'EUR',
              openingHours: 'Mo-Fr 09:00-18:00',
              priceRange: '€€',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '250',
                bestRating: '5',
                worstRating: '1'
              }
            }),
          }}
        />

        {/* Client-side initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress MetaMask console warnings
              if (typeof window !== 'undefined') {
                const originalWarn = console.warn;
                console.warn = function(...args) {
                  const message = args.join(' ');
                  if (message.includes('MetaMask') || 
                      message.includes('ethereum') ||
                      message.includes('web3') ||
                      message.includes('wallet')) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
              }

              // Initialize cookie banner
              setTimeout(function() {
                if (!localStorage.getItem('cookieConsent')) {
                  const banner = document.getElementById('cookie-banner');
                  if (banner) {
                    banner.style.transform = 'translateY(0)';
                  }
                }
              }, 2000);

              // Handle cookie acceptance
              document.getElementById('accept-cookies')?.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'accepted');
                const banner = document.getElementById('cookie-banner');
                if (banner) {
                  banner.style.transform = 'translateY(100%)';
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}