'use client';

import React from 'react';
import ProductCatalogDisplay from '@/components/catalog/ProductCatalogDisplay';

export default function CatalogAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 JC Hair Studio - Analytics do Catálogo
          </h1>
          <p className="text-lg text-gray-600">
            Análise completa dos produtos organizados por categorias
          </p>
        </div>

        <ProductCatalogDisplay
          showSummary={true}
          showAnalysis={true}
        />
      </div>
    </div>
  );
}