import React from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Footer } from '../../components/layout';
import RevolutionaryHeader from '../../components/layout/RevolutionaryHeader';
import CookieBanner from '../../components/layout/CookieBanner';
import { ToastProvider } from '../../lib/providers/ToastProvider';
import { AuthProvider } from '../../lib/providers/auth-provider';
import { CartInitializer } from '../../lib/providers/CartProvider';
import { HomepageSchema } from '../../components/seo/SchemaMarkup';
import { OrganizationSchema, WebsiteSchema } from '../../components/seo/UnifiedSchema';
import FacebookPixel from '../../components/analytics/FacebookPixel';
import GoogleAnalytics from '../../components/analytics/GoogleAnalytics';
import LiveChat from '../../components/ui/LiveChat';
import CartAbandonmentRecovery from '../../components/cart/CartAbandonmentRecovery';
import PerformanceOptimizer from '../../components/performance/PerformanceOptimizer';
import '../../styles/globals.css';
import '../../styles/components.css';

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
  metadataBase: new URL('https://jchairstudios62.xyz'),
  title: {
    default: "JC Hair Studio's 62 - Produtos Capilares Brasileiros Premium",
    template: "%s | JC Hair Studio's 62"
  },
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
  authors: [
    { name: "JC Hair Studio's 62", url: "https://jchairstudios62.xyz" }
  ],
  creator: "JC Hair Studio's 62",
  publisher: "JC Hair Studio's 62",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: 'https://jchairstudios62.xyz',
    siteName: "JC Hair Studio's 62",
    title: "JC Hair Studio's 62 - Produtos Capilares Brasileiros Premium",
    description: 'Mega hair brasileiro 100% humano, progressivas Vogue originais, maquiagem brasileira. +40 anos tradição familiar. Entrega Europa.',
    images: [
      {
        url: '/og-home-brasil.jpg',
        width: 1200,
        height: 630,
        alt: "Produtos Capilares Brasileiros Premium - JC Hair Studio's 62",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jchairstudios62',
    creator: '@jchairstudios62',
    title: "JC Hair Studio's 62 - Produtos Capilares Brasileiros Premium",
    description: 'Mega hair brasileiro, progressivas Vogue, maquiagem brasileira. Tradição familiar +40 anos.',
    images: ['/twitter-home-brasil.jpg'],
  },
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
  verification: {
    google: 'verification-code',
  },
  alternates: {
    canonical: 'https://jchairstudios62.xyz',
    languages: {
      'pt-PT': 'https://jchairstudios62.xyz/pt-PT',
      'en': 'https://jchairstudios62.xyz/en',
      'es': 'https://jchairstudios62.xyz/es',
      'fr': 'https://jchairstudios62.xyz/fr',
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html
      lang={locale || 'pt-PT'}
      className={`${inter.variable} ${playfair.variable}`}
    >
      <head>
        <GoogleAnalytics />
        <FacebookPixel />
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <CartInitializer>
            <ToastProvider>
              <PerformanceOptimizer>
                <div className="flex flex-col min-h-screen">
                  <RevolutionaryHeader />
                  <main className="flex-1 pt-16 lg:pt-20">
                    {children}
                  </main>
                  <Footer />
                </div>
                <CookieBanner />
                <LiveChat />
                <CartAbandonmentRecovery />
              </PerformanceOptimizer>
            </ToastProvider>
          </CartInitializer>
        </AuthProvider>
      </body>
    </html>
  );
}