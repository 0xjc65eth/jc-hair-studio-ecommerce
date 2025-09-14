import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Header, Footer } from '../components/layout';
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
    default: 'JC Hair Studio\'s 62 - Extensões de Cabelo Premium',
    template: '%s | JC Hair Studio\'s 62',
  },
  description: 'E-commerce especializado em extensões de cabelo de alta qualidade. Mega hair, progressiva vogue e produtos capilares premium com entrega em toda a Europa.',
  keywords: [
    'extensões de cabelo',
    'mega hair',
    'progressiva vogue',
    'cabelo natural',
    'hair extensions',
    'JC Hair Studio',
    'e-commerce cabelo',
    'europa',
    'portugal',
    'bélgica'
  ],
  authors: [{ name: 'JC Hair Studio' }],
  creator: 'JC Hair Studio',
  publisher: 'JC Hair Studio',
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
    alternateLocale: ['en_US', 'es_ES', 'fr_FR'],
    url: 'https://jchairstudios62.xyz',
    siteName: 'JC Hair Studio\'s 62',
    title: 'JC Hair Studio\'s 62 - Extensões de Cabelo Premium',
    description: 'E-commerce especializado em extensões de cabelo de alta qualidade com entrega em toda a Europa.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JC Hair Studio\'s 62 - Extensões de Cabelo Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JC Hair Studio\'s 62 - Extensões de Cabelo Premium',
    description: 'E-commerce especializado em extensões de cabelo de alta qualidade com entrega em toda a Europa.',
    images: ['/twitter-image.jpg'],
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
        <meta name="application-name" content="JC Hair Studio's 62" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="JC Hair Studio's 62" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1a1a1a" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Schema.org markup for Google+ */}
        <meta itemProp="name" content="JC Hair Studio's 62" />
        <meta itemProp="description" content="E-commerce especializado em extensões de cabelo de alta qualidade" />
        <meta itemProp="image" content="/og-image.jpg" />
        
        {/* Analytics placeholder */}
        {process.env.NODE_ENV === 'production' && (
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
                  });
                `,
              }}
            />
          </>
        )}
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

        {/* Global Loading Indicator */}
        <div id="global-loading" className="hidden fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="loading-spinner w-8 h-8 border-2 border-black"></div>
        </div>

        {/* Toast Notifications Container */}
        <div id="toast-container" className="fixed bottom-4 right-4 space-y-2 z-50"></div>

        {/* Cookie Consent Banner (GDPR) */}
        <div 
          id="cookie-banner" 
          className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50 transform transition-transform duration-300"
          style={{ transform: 'translateY(100%)' }}
        >
          <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              Este site utiliza cookies para melhorar sua experiência. 
              Ao continuar navegando, você concorda com nossa política de privacidade.
            </p>
            <div className="flex gap-2">
              <button 
                id="accept-cookies" 
                className="btn-primary text-sm px-4 py-2"
              >
                Aceitar
              </button>
              <button 
                id="manage-cookies" 
                className="btn-secondary text-sm px-4 py-2"
              >
                Gerenciar
              </button>
            </div>
          </div>
        </div>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'OnlineStore',
              name: "JC Hair Studio's 62",
              description: 'E-commerce especializado em extensões de cabelo de alta qualidade',
              url: 'https://jchairstudios62.xyz',
              logo: 'https://jchairstudios62.xyz/logo.png',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+351-XXX-XXX-XXX',
                contactType: 'Customer Service',
                availableLanguage: ['Portuguese', 'English', 'Spanish', 'French'],
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'PT',
              },
              sameAs: [
                'https://instagram.com/jchairstudios62',
                'https://facebook.com/jchairstudios62',
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Extensões de Cabelo',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Product',
                      name: 'Extensões de Cabelo Natural',
                      category: 'Hair Extensions',
                    },
                  },
                ],
              },
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