'use client';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import { categories } from '../../../lib/data/categories';
import CategoryPage from '../../../components/category/CategoryPage';

export default function CategorySlugPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Encontrar a categoria pelo slug/id
  const category = categories.find(cat => cat.id === slug);

  if (!category) {
    notFound();
  }

  return <CategoryPage category={category} />;
}