'use client';

import { useState } from 'react';

export default function AdminSeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao executar seeding');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleTestProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=5');
      const data = await response.json();
      console.log('Produtos encontrados:', data);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar produtos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🇧🇷 Administração - Hair Studio Brasil
          </h1>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-3">Seeding do Banco de Dados</h2>
              <p className="text-gray-600 mb-4">
                Popule o banco MongoDB com produtos reais brasileiros (Cadiveu, Risqué, QDB, Taiff, etc.)
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium"
                >
                  {isSeeding ? '🌱 Executando...' : '🌱 Popular Banco'}
                </button>

                <button
                  onClick={handleTestProducts}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  🧪 Testar Produtos
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-red-800 font-medium">❌ Erro</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-medium mb-3">
                  ✅ {result.success ? 'Sucesso' : 'Resultado'}
                </h3>
                
                {result.data && (
                  <div className="space-y-3">
                    <div className="text-sm text-green-700">
                      <strong>📊 Estatísticas:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Categorias: {result.data.categoriesCount}</li>
                        <li>Produtos: {result.data.productsCount}</li>
                      </ul>
                    </div>

                    {result.data.categories && (
                      <div className="text-sm">
                        <strong className="text-green-800">📂 Categorias criadas:</strong>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {result.data.categories.map((cat: any, index: number) => (
                            <div key={index} className="bg-green-100 rounded px-2 py-1">
                              <span className="font-medium">{cat.name}</span>
                              {cat.featured && <span className="text-green-600 ml-1">⭐</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.data.products && (
                      <div className="text-sm">
                        <strong className="text-green-800">🛍️ Produtos criados:</strong>
                        <div className="mt-2 space-y-1">
                          {result.data.products.map((prod: any, index: number) => (
                            <div key={index} className="bg-white border rounded px-3 py-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-medium">{prod.name}</span>
                                  <div className="text-gray-600 text-xs">
                                    {prod.brand} • {prod.sku}
                                  </div>
                                </div>
                                <div className="flex gap-1 text-xs">
                                  <span className="bg-blue-100 text-blue-800 px-1 rounded">{prod.category}</span>
                                  {prod.featured && <span>⭐</span>}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {result.products && (
                  <div className="text-sm">
                    <strong className="text-green-800">🔍 Produtos encontrados:</strong>
                    <div className="mt-2">
                      <pre className="bg-gray-100 rounded p-2 text-xs overflow-auto max-h-40">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-semibold mb-2">🗃️ Informações do Sistema</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Database:</strong> MongoDB Atlas
                </div>
                <div>
                  <strong>Ambiente:</strong> Desenvolvimento
                </div>
                <div>
                  <strong>Produtos:</strong> Marcas brasileiras reais
                </div>
                <div>
                  <strong>Categorias:</strong> Hair studio especializado
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}