'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { categories } from '../../../lib/data/categories';
import CategoryPage from '../../../components/category/CategoryPage';

export default function CategorySlugPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Encontrar a categoria pelo slug
  const category = categories.find(cat => cat.slug === slug || cat.id === slug);

  if (!category) {
    console.error(`Categoria não encontrada para slug: ${slug}`);
    console.log('Categorias disponíveis:', categories.map(c => ({ id: c.id, slug: c.slug })));
    notFound();
  }

  return <CategoryPage category={category} />;
}