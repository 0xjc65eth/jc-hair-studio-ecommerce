'use client';

import { useState } from 'react';

/**
 * SEO Tab Component
 *
 * Ferramentas de SEO e marketing integradas no painel admin:
 * - Submissão IndexNow (Bing, Yandex)
 * - Geração de feeds (XML, CSV)
 * - Google Business Profile tools
 * - Google Ads descriptions
 * - Verificação de URLs
 */
export function SeoTab() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  /**
   * Submit URLs to IndexNow
   */
  const handleIndexNowSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/seo/indexnow', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          type: 'success',
          message: 'URLs submetidas com sucesso!',
          data: data,
        });
      } else {
        setError(data.error || 'Erro ao submeter URLs');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com a API');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate product feed
   */
  const handleGenerateFeed = async (format: 'xml' | 'csv') => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/api/seo/generate-feed?format=${format}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          type: 'success',
          message: `Feed ${format.toUpperCase()} gerado com sucesso!`,
          data: data,
        });
      } else {
        setError(data.error || 'Erro ao gerar feed');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com a API');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Download Google Business photos
   */
  const handleDownloadPhotos = () => {
    window.open('/api/seo/download-photos', '_blank');
  };

  /**
   * Copy Google Ads descriptions
   */
  const handleCopyDescriptions = async () => {
    try {
      const response = await fetch('/api/seo/ads-descriptions');
      const data = await response.json();

      if (data.descriptions) {
        const text = data.descriptions.join('\n\n');
        await navigator.clipboard.writeText(text);
        setResult({
          type: 'success',
          message: '30 descrições copiadas para a área de transferência!',
        });
      }
    } catch (err: any) {
      setError('Erro ao copiar descrições');
    }
  };

  /**
   * Render overview section
   */
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* IndexNow Status */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-blue-900">IndexNow</h3>
          <span className="text-2xl">🚀</span>
        </div>
        <p className="text-blue-700 text-sm mb-4">
          Notifique Bing, Yandex e outros motores de busca sobre atualizações
        </p>
        <button
          onClick={handleIndexNowSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Submeter URLs'}
        </button>
      </div>

      {/* Google Merchant Feed */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-green-900">Product Feed</h3>
          <span className="text-2xl">📦</span>
        </div>
        <p className="text-green-700 text-sm mb-4">
          Gere feeds para Google Merchant Center (107 produtos)
        </p>
        <div className="space-y-2">
          <button
            onClick={() => handleGenerateFeed('xml')}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Gerar XML
          </button>
          <button
            onClick={() => handleGenerateFeed('csv')}
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            Gerar CSV
          </button>
        </div>
      </div>

      {/* Google Business Profile */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-purple-900">Google Business</h3>
          <span className="text-2xl">📸</span>
        </div>
        <p className="text-purple-700 text-sm mb-4">
          Ferramentas para Google Business Profile
        </p>
        <div className="space-y-2">
          <button
            onClick={handleDownloadPhotos}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Download Fotos (16)
          </button>
          <button
            onClick={() => setActiveSection('descriptions')}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Ver Descrições
          </button>
        </div>
      </div>

      {/* Google Ads */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-orange-900">Google Ads</h3>
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-orange-700 text-sm mb-4">
          30 descrições otimizadas (≤60 caracteres)
        </p>
        <button
          onClick={handleCopyDescriptions}
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
        >
          Copiar Descrições
        </button>
      </div>

      {/* Sitemap Status */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-indigo-900">Sitemap</h3>
          <span className="text-2xl">🗺️</span>
        </div>
        <p className="text-indigo-700 text-sm mb-4">
          Sitemap ativo com 29 URLs
        </p>
        <a
          href="https://jchairstudios62.xyz/sitemap.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Ver Sitemap
        </a>
      </div>

      {/* Setup Guides */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Guias</h3>
          <span className="text-2xl">📚</span>
        </div>
        <p className="text-gray-700 text-sm mb-4">
          Acesso aos guias de configuração
        </p>
        <button
          onClick={() => setActiveSection('guides')}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Ver Guias
        </button>
      </div>
    </div>
  );

  /**
   * Render guides section
   */
  const renderGuides = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <button
        onClick={() => setActiveSection('overview')}
        className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
      >
        ← Voltar
      </button>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">Guias de Configuração SEO</h3>

      <div className="space-y-6">
        {/* Google Search Console */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="text-lg font-bold text-gray-900 mb-2">
            1. Google Search Console (2 min)
          </h4>
          <p className="text-gray-600 mb-2">
            🔗 <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://search.google.com/search-console
            </a>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Adicionar propriedade: https://jchairstudios62.xyz</li>
            <li>Verificar propriedade (HTML tag ou arquivo)</li>
            <li>Enviar sitemap: https://jchairstudios62.xyz/sitemap.xml</li>
          </ol>
        </div>

        {/* Bing Webmaster */}
        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="text-lg font-bold text-gray-900 mb-2">
            2. Bing Webmaster Tools (1 min)
          </h4>
          <p className="text-gray-600 mb-2">
            🔗 <a href="https://www.bing.com/webmasters" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://www.bing.com/webmasters
            </a>
          </p>
          <p className="text-gray-700">
            <strong>Atalho:</strong> Clique em "Importar do Google Search Console" - importa tudo automaticamente!
          </p>
        </div>

        {/* Google Business Profile */}
        <div className="border-l-4 border-purple-500 pl-4">
          <h4 className="text-lg font-bold text-gray-900 mb-2">
            3. Google Business Profile (3 min)
          </h4>
          <p className="text-gray-600 mb-2">
            🔗 <a href="https://www.google.com/business/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://www.google.com/business/
            </a>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Criar perfil de negócio</li>
            <li>Fazer upload de 16 fotos (use o botão "Download Fotos" acima)</li>
            <li>Adicionar descrição (use as versões pré-escritas)</li>
            <li>Verificar negócio</li>
          </ol>
        </div>

        {/* Google Merchant Center */}
        <div className="border-l-4 border-orange-500 pl-4">
          <h4 className="text-lg font-bold text-gray-900 mb-2">
            4. Google Merchant Center (3 min)
          </h4>
          <p className="text-gray-600 mb-2">
            🔗 <a href="https://merchants.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              https://merchants.google.com/
            </a>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            <li>Gerar CSV acima e importar no Google Sheets</li>
            <li>Criar feed apontando para a planilha</li>
            <li>107 produtos aparecerão no Google Shopping em 24-48h</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-bold text-blue-900 mb-2">📊 Timeline Esperado:</h4>
        <ul className="space-y-1 text-blue-800">
          <li>• Semana 1: Primeiras páginas indexadas</li>
          <li>• Semana 2: Produtos no Shopping + 50-100 páginas</li>
          <li>• Semana 3-4: 100-500 visitas/mês + primeiras vendas</li>
        </ul>
      </div>
    </div>
  );

  /**
   * Render descriptions section
   */
  const renderDescriptions = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <button
        onClick={() => setActiveSection('overview')}
        className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
      >
        ← Voltar
      </button>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Descrições Google Business Profile</h3>
        <button
          onClick={async () => {
            const descriptions = [
              'Produtos capilares brasileiros premium. Mega hair natural, progressivas Vogue, maquiagem brasileira. Entrega Europa. 40 anos de experiencia. Tel 351928375226. Site jchairstudios62.xyz',
              'Produtos capilares brasileiros. Mega hair natural, progressivas, maquiagem. Entrega Europa. 40 anos experiencia. Tel 351928375226. jchairstudios62.xyz',
              'Loja online de produtos capilares brasileiros premium. Mega hair 100 por cento humano, progressivas Vogue, BTX capilar e maquiagem brasileira das marcas Natura, Eudora e Ruby Rose. Mais de 40 anos de experiencia. Entrega em Portugal, Belgica, Espanha, Franca, Italia, Alemanha e Holanda. Produtos autenticos direto do Brasil. Telefone 351928375226. Segunda a Sexta 09h as 18h. Site jchairstudios62.xyz'
            ];

            await navigator.clipboard.writeText(descriptions.join('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n'));
            setResult({
              type: 'success',
              message: '3 descrições copiadas!',
            });
          }}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Copiar Todas
        </button>
      </div>

      <div className="space-y-6">
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <h4 className="font-bold text-green-900 mb-2">VERSÃO 2 - ULTRA CURTA (186 caracteres) ✅ RECOMENDADO</h4>
          <p className="text-gray-800 bg-white p-3 rounded border border-green-300">
            Produtos capilares brasileiros premium. Mega hair natural, progressivas Vogue, maquiagem brasileira. Entrega Europa. 40 anos de experiencia. Tel 351928375226. Site jchairstudios62.xyz
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold text-gray-900 mb-2">VERSÃO 3 - BÁSICA (148 caracteres)</h4>
          <p className="text-gray-800 bg-white p-3 rounded border border-gray-300">
            Produtos capilares brasileiros. Mega hair natural, progressivas, maquiagem. Entrega Europa. 40 anos experiencia. Tel 351928375226. jchairstudios62.xyz
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-bold text-gray-900 mb-2">VERSÃO 1 - SEM SÍMBOLOS (437 caracteres)</h4>
          <p className="text-gray-800 bg-white p-3 rounded border border-gray-300 text-sm">
            Loja online de produtos capilares brasileiros premium. Mega hair 100 por cento humano, progressivas Vogue, BTX capilar e maquiagem brasileira das marcas Natura, Eudora e Ruby Rose. Mais de 40 anos de experiencia. Entrega em Portugal, Belgica, Espanha, Franca, Italia, Alemanha e Holanda. Produtos autenticos direto do Brasil. Telefone 351928375226. Segunda a Sexta 09h as 18h. Site jchairstudios62.xyz
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🚀 SEO & Marketing</h2>
        <p className="text-blue-100">
          Ferramentas de otimização e marketing digital integradas
        </p>
      </div>

      {/* Results/Errors */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h4 className="font-bold text-green-900">{result.message}</h4>
              {result.data && (
                <pre className="mt-2 text-sm text-green-800 bg-white p-3 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <h4 className="font-bold text-red-900">Erro</h4>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'guides' && renderGuides()}
      {activeSection === 'descriptions' && renderDescriptions()}
    </div>
  );
}
