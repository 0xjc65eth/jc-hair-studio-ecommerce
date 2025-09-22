'use client';

import { useProductData } from '../../lib/hooks/useProductData';

export default function TestCatalogPage() {
  const { getEnhancedCosmeticCategories } = useProductData();

  const cosmeticCategories = getEnhancedCosmeticCategories();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Catalog</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Categories: {cosmeticCategories.length}</h2>
        {cosmeticCategories.map((category, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <h3 className="font-medium">
              {category.icon} {category.name} ({category.products.length} products)
            </h3>

            {category.products.slice(0, 3).map((product, productIndex) => (
              <div key={productIndex} className="ml-4 mt-2 text-sm">
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Price:</strong> {typeof product.price === 'object' ? JSON.stringify(product.price) : `€${product.price || 0}`}</p>
                <p><strong>Images:</strong> {product.images?.length || 0}</p>
                <p><strong>Color:</strong> {product.color_name || 'N/A'}</p>
              </div>
            ))}

            {category.products.length > 3 && (
              <p className="ml-4 mt-2 text-sm text-gray-500">
                ... and {category.products.length - 3} more products
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}