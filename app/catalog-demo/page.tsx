'use client';

import { useEffect } from 'react';

export default function CatalogDemoPage() {
  useEffect(() => {
    window.location.href = '/produtos';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecionando...</h1>
        <p>Você será redirecionado para a página de produtos.</p>
      </div>
    </div>
  );
}