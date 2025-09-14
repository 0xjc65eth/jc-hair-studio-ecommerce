import React from 'react';
import { Metadata } from 'next';
import CategoryPage from '@/components/category/CategoryPage';
import { beautyCategories } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: 'Progressivas e BTX Capilares - JC Hair Studio\'s 62',
  description: 'Progressivas e tratamentos de botox capilar para alisamento e nutrição profunda. Produtos de alta qualidade com resultados duradouros.',
  keywords: [
    'progressiva',
    'botox capilar',
    'btx',
    'alisamento',
    'queratina',
    'progressiva vogue',
    'tratamento capilar',
    'cabelo liso',
    'redução de volume'
  ],
  openGraph: {
    title: 'Progressivas e BTX Capilares - JC Hair Studio\'s 62',
    description: 'Progressivas e tratamentos de botox capilar para alisamento e nutrição profunda',
    images: ['/images/categories/progressivas-btx.jpg'],
  },
};

export default function ProgressivasBtxPage() {
  const category = beautyCategories.find(cat => cat.id === 'progressivas-btx');

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