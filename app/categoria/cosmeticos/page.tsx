import { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import CosmeticsCatalog from '../../../components/cosmeticos/CosmeticsCatalog';

interface CosmeticsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    price_min?: string;
    price_max?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Categoria Cosméticos - Maquiagem e Produtos de Beleza Premium',
  description: 'Explore nossa categoria completa de cosméticos: maquiagem, esmaltes, pincéis e acessórios de beleza das melhores marcas brasileiras.',
  keywords: ['cosméticos categoria', 'maquiagem', 'esmaltes', 'beleza', 'categoria produtos'],
  openGraph: {
    title: 'Categoria Cosméticos - JC Hair Studio\'s 62',
    description: 'Explore nossa categoria completa de cosméticos premium',
    images: ['/og-categoria-cosmeticos.jpg'],
  },
};

export default async function CosmeticsCategoryPage({ searchParams }: CosmeticsPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Início
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/categoria" className="text-gray-500 hover:text-gray-700">
              Categorias
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Cosméticos</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Categoria: Cosméticos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra nossa coleção completa de produtos cosméticos premium das melhores marcas brasileiras
          </p>
        </div>
      </section>

      {/* Products Catalog */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
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