import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';
import CosmeticsCatalog from '@/components/cosmeticos/CosmeticsCatalog';

export const metadata: Metadata = {
  title: 'Cosméticos - Maquiagem e Produtos de Beleza Premium',
  description: 'Produtos cosméticos premium: maquiagem profissional, paletas de sombras, bases, esmaltes e acessórios de beleza. Marcas brasileiras e internacionais.',
  keywords: ['cosméticos', 'maquiagem', 'base', 'paleta sombras', 'esmaltes', 'beleza', 'boca rosa', 'vult', 'make b'],
  openGraph: {
    title: 'Cosméticos Premium - JC Hair Studio\'s 62',
    description: 'Descubra nossa linha completa de produtos cosméticos premium para realçar sua beleza natural',
    images: ['/og-cosmeticos.jpg'],
  },
};

export default function CosmeticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-rose-200/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-purple-200/30 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Cosméticos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600">
                Premium
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-4xl mx-auto">
              Descubra nossa coleção completa de produtos cosméticos premium.
              Maquiagem profissional, esmaltes exclusivos e acessórios de beleza das melhores marcas brasileiras.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 border border-rose-200/50 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Produtos Disponíveis</div>
                <div className="text-3xl font-bold text-gray-900">120+</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 border border-pink-200/50 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Marcas Brasileiras</div>
                <div className="text-3xl font-bold text-gray-900">15+</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 border border-purple-200/50 shadow-sm">
                <div className="text-sm text-gray-600 mb-2">Satisfação</div>
                <div className="text-3xl font-bold text-gray-900">98%</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="#categorias"
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ver Categorias
              </Link>
              <Link
                href="#produtos"
                className="bg-white text-gray-900 px-10 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
              >
                Ver Produtos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="produtos" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nossos Produtos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore nossa seleção cuidadosamente curada de produtos cosméticos premium
            </p>
          </div>

          <Suspense fallback={
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
          }>
            <CosmeticsCatalog />
          </Suspense>
        </div>
      </section>
    </div>
  );
}