import { Metadata } from 'next';
import { Suspense } from 'react';
import BrazilianElegantHomepage from '../components/home/BrazilianElegantHomepage';

export const metadata: Metadata = {
  title: 'JC Hair Studio\'s 62 - Mega Hair Premium 100% Humano',
  description: 'Mega hair premium 100% cabelo humano. Mais de 40 anos de tradição em extensões capilares. Entrega para toda Europa.',
  keywords: 'mega hair, extensões cabelo, cabelo humano, JC Hair Studio',
  openGraph: {
    title: 'JC Hair Studio\'s 62 - Mega Hair Premium',
    description: 'Mega hair premium 100% cabelo humano. Tradição de 40+ anos.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'JC Hair Studio\'s 62'
    }],
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    }>
      <BrazilianElegantHomepage />
    </Suspense>
  );
}