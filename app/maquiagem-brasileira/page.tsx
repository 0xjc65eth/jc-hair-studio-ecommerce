import React from 'react';
import { Metadata } from 'next';
import CategoryPage from '@/components/category/CategoryPage';
import { beautyCategories } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: 'Maquiagem Brasileira - JC Hair Studio\'s 62',
  description: 'As melhores marcas brasileiras de maquiagem. Bases, batons, sombras e muito mais com qualidade e preços acessíveis.',
  keywords: [
    'maquiagem brasileira',
    'cosméticos brasileiros',
    'base nacional',
    'batom brasileiro',
    'sombras brasileiras',
    'Eudora',
    'Natura',
    'Avon',
    'Ruby Rose',
    'make brasileiro'
  ],
  openGraph: {
    title: 'Maquiagem Brasileira - JC Hair Studio\'s 62',
    description: 'As melhores marcas brasileiras de maquiagem com qualidade e preços acessíveis',
    images: ['/images/categories/maquiagem.jpg'],
  },
};

export default function MaquiagemBrasileiraPage() {
  const category = beautyCategories.find(cat => cat.id === 'maquiagem-brasileira');

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