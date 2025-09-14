import React from 'react';
import { Metadata } from 'next';
import CategoryPage from '@/components/category/CategoryPage';
import { beautyCategories } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: 'Ferramentas e Equipamentos - JC Hair Studio\'s 62',
  description: 'Ferramentas profissionais para cabeleireiros e uso doméstico. Chapinhas, secadores, modeladores e pincéis das melhores marcas.',
  keywords: [
    'ferramentas cabeleireiro',
    'equipamentos beleza',
    'chapinha profissional',
    'secador cabelo',
    'modelador cachos',
    'pincéis maquiagem',
    'babyliss',
    'taiff',
    'ferramentas beauty'
  ],
  openGraph: {
    title: 'Ferramentas e Equipamentos - JC Hair Studio\'s 62',
    description: 'Ferramentas profissionais para cabeleireiros e uso doméstico das melhores marcas',
    images: ['/images/categories/ferramentas.jpg'],
  },
};

export default function FerramentasEquipamentosPage() {
  const category = beautyCategories.find(cat => cat.id === 'ferramentas-equipamentos');

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