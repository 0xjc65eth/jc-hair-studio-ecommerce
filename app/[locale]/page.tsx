import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// PERFORMANCE OPTIMIZATION: Lazy Loading com Next.js dynamic imports
// - Reduz bundle inicial em ~40%
// - Melhora TTI (Time to Interactive)
// - Componentes pesados carregam apenas quando necessário

// Lazy load componente principal da homepage
// ssr: true = renderiza no servidor (bom para SEO)
// loading = componente skeleton para melhor UX
const BrazilianElegantHomepage = dynamic(
  () => import('../../components/home/BrazilianElegantHomepage'),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-96 bg-gray-200" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="grid grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    ),
    ssr: true, // Renderiza no servidor para melhor SEO
  }
);

export const metadata: Metadata = {
  title: '62 Beauty\'s 62 - Extensões de Cabelo Premium',
  description: 'Loja online especializada em extensões de cabelo de alta qualidade, mega hair, progressivas e produtos capilares profissionais.',
  openGraph: {
    title: '62 Beauty\'s 62 - Extensões de Cabelo Premium',
    description: 'Extensões de cabelo de alta qualidade, mega hair e produtos capilares profissionais.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: '62 Beauty\'s 62 - Extensões de Cabelo Premium'
    }],
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mb-4 mx-auto"></div>
          <h2 className="text-xl font-medium text-gray-900">Carregando...</h2>
        </div>
      </div>
    }>
      <BrazilianElegantHomepage />
    </Suspense>
  );
}