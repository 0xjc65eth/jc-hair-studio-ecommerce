import React from 'react';
import type { Metadata } from 'next';

/**
 * Locale Layout - Wrapper for locale-prefixed routes (e.g., /fr-BE, /en-GB, /es-ES)
 *
 * IMPORTANT: This layout must NOT render <html>, <head>, or <body> tags because
 * those are already rendered by the root layout (app/layout.tsx).
 * In Next.js App Router, only the root layout should contain <html> and <body>.
 * Nested layouts that duplicate these tags cause "SyntaxError: Invalid or unexpected token"
 * hydration crashes on the client side.
 */

export const metadata: Metadata = {
  metadataBase: new URL('https://jchairstudios62.xyz'),
  title: {
    default: "JC Hair Studio's 62 - Produtos Capilares Brasileiros Premium",
    template: "%s | JC Hair Studio's 62"
  },
  description: 'Loja online de produtos capilares brasileiros premium com +40 anos de tradição familiar. Mega hair 100% humano, progressivas Vogue originais, BTX capilar, maquiagem brasileira. Entrega em toda Europa com garantia de qualidade.',
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
  alternates: {
    canonical: 'https://jchairstudios62.xyz',
    languages: {
      'pt-PT': 'https://jchairstudios62.xyz/pt-PT',
      'en-GB': 'https://jchairstudios62.xyz/en-GB',
      'es-ES': 'https://jchairstudios62.xyz/es-ES',
      'fr-FR': 'https://jchairstudios62.xyz/fr-FR',
      'de-DE': 'https://jchairstudios62.xyz/de-DE',
      'it-IT': 'https://jchairstudios62.xyz/it-IT',
      'nl-NL': 'https://jchairstudios62.xyz/nl-NL',
      'pl-PL': 'https://jchairstudios62.xyz/pl-PL',
      'x-default': 'https://jchairstudios62.xyz/',
    },
  },
};

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // This layout simply passes children through to the root layout.
  // All UI chrome (Header, Footer, providers) is already in app/layout.tsx.
  return <>{children}</>;
}