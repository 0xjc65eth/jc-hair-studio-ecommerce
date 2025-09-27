'use client';

import { resolveProductById, getAllAvailableProducts } from '../../lib/services/productResolver';
import { useState } from 'react';

export default function DebugProductsPage() {
  const [testId, setTestId] = useState('cocochoco-original-premium');
  const [result, setResult] = useState<any>(null);

  const testProduct = () => {
    const product = resolveProductById(testId);
    setResult(product);
  };

  const allProducts = getAllAvailableProducts();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Product Debug Page</h1>

        {/* Test Single Product */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Product Lookup</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={testId}
              onChange={(e) => setTestId(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="Enter product ID"
            />
            <button
              onClick={testProduct}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Test
            </button>
          </div>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold">Result:</h3>
              <pre className="mt-2 text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* All Products Summary */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">All Products Summary</h2>
          <p className="mb-4">Total products: {allProducts.length}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProducts.slice(0, 12).map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                <p className="text-xs text-gray-600 truncate">ID: {product.id}</p>
                <p className="text-xs text-gray-600 truncate">Brand: {product.brand}</p>
                <div className="mt-2">
                  <a
                    href={`/produto/${product.id}`}
                    className="text-blue-500 hover:text-blue-700 text-xs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Product →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {allProducts.length > 12 && (
            <p className="mt-4 text-sm text-gray-600">
              ... and {allProducts.length - 12} more products
            </p>
          )}
        </div>
      </div>
    </div>
  );
}