import React from 'react';
import { Metadata } from 'next';
import CategoryPage from '@/components/category/CategoryPage';
import { beautyCategories } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: 'Shampoos e Condicionadores Profissionais - 62 Beauty\'s 62',
  description: 'Produtos de limpeza e condicionamento profissionais para todos os tipos de cabelo. Shampoos e condicionadores das melhores marcas.',
  keywords: [
    'shampoos profissionais',
    'condicionadores',
    'limpeza capilar',
    'condicionamento',
    'shampoo anti-queda',
    'shampoo matizador',
    'condicionador hidratante',
    'produtos capilares'
  ],
  openGraph: {
    title: 'Shampoos e Condicionadores Profissionais - 62 Beauty\'s 62',
    description: 'Produtos de limpeza e condicionamento profissionais para todos os tipos de cabelo',
    images: ['/images/categories/shampoos.jpg'],
  },
};

export default function ShampoosCondicionadoresPage() {
  const category = beautyCategories.find(cat => cat.id === 'shampoos-condicionadores');

  if (!category) {
    return (
      <div className="container-custom section-padding text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Categoria não encontrada
        </h1>
        <p className="text-gray-600">
          A categoria solicitada não está disponível no momento.
        </p>
      </div>
    );
  }

  return <CategoryPage category={category} />;
}