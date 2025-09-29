import React from 'react';
import { Metadata } from 'next';
import CategoryPage from '@/components/category/CategoryPage';
import { beautyCategories } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: 'Tratamentos Capilares Profissionais - JC Hair Studio',
  description: 'Máscaras, ampolas, óleos e tratamentos intensivos para todos os tipos de cabelo. Produtos Wepink e das melhores marcas.',
  keywords: [
    'tratamentos capilares',
    'máscaras capilares',
    'ampolas',
    'óleos capilares',
    'hair mist',
    'leave-in',
    'tônico capilar',
    'wepink'
  ],
  openGraph: {
    title: 'Tratamentos Capilares Profissionais - JC Hair Studio',
    description: 'Máscaras, ampolas, óleos e tratamentos intensivos para todos os tipos de cabelo',
    images: ['/images/categories/tratamentos.jpg'],
  },
};

export default function TratamentosCapilaresPage() {
  const category = beautyCategories.find(cat => cat.id === 'tratamentos-capilares');

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