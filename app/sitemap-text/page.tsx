/**
 * TEXT-ONLY SITEMAP PAGE
 * Simple text-based sitemap for maximum crawler accessibility
 * Purpose: Provide ultra-clean link structure for crawlers
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { allEuropeanProducts } from '@/lib/data/europeanPricingProducts';

export const metadata: Metadata = {
  title: 'Sitemap de Texto - JC Hair Studio',
  description: 'Lista completa em texto de todas as URLs do site',
  alternates: {
    canonical: 'https://jchairstudios62.xyz/sitemap-text'
  },
  robots: {
    index: true,
    follow: true
  }
};

export const revalidate = 86400; // Daily revalidation

const baseUrl = 'https://jchairstudios62.xyz';

export default function TextSitemapPage() {
  const allUrls = [
    // Main pages
    '/',
    '/produtos',
    '/sobre',
    '/contato',
    '/news',
    '/updates',
    '/latest-products',
    '/sitemap-html',
    '/sitemap-text',
    '/categorias',

    // Categories
    '/mega-hair',
    '/progressivas-btx',
    '/tratamentos-capilares',
    '/shampoos-condicionadores',
    '/maquiagens',
    '/perfumes',
    '/esmaltes',
    '/ferramentas-equipamentos',

    // Customer
    '/conta',
    '/conta/pedidos',
    '/conta/enderecos',
    '/conta/pontos',
    '/conta/configuracoes',
    '/favoritos',
    '/carrinho',
    '/checkout',

    // Help
    '/faq',
    '/como-comprar',
    '/envio-entrega',
    '/trocas-devolucoes',
    '/formas-pagamento',

    // Legal
    '/legal/politica-privacidade',
    '/legal/termos-uso',
    '/legal/politica-cookies',
    '/legal/lgpd',

    // Products
    ...allEuropeanProducts.map(p => `/produto/${p.id}`)
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header with enhanced navigation */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sitemap de Texto
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Lista completa de {allUrls.length} URLs indexáveis
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-PT')}
          </p>

          <div className="flex justify-center space-x-4">
            <Link
              href="/sitemap-html"
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
            >
              Mapa HTML
            </Link>
            <Link
              href="/sitemap.xml"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Sitemap XML
            </Link>
          </div>
        </div>

        {/* Text-only URL list */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-8 font-mono text-sm">
          <div className="space-y-1">
            {allUrls.map((url, index) => (
              <div key={index} className="hover:bg-gray-100 px-2 py-1 rounded">
                <Link
                  href={url}
                  className="text-blue-600 hover:text-blue-800 hover:underline block"
                >
                  {baseUrl}{url}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">{allUrls.length}</div>
            <div className="text-sm text-gray-600">Total URLs</div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">{allEuropeanProducts.length}</div>
            <div className="text-sm text-gray-600">Produtos</div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">{allUrls.length - allEuropeanProducts.length}</div>
            <div className="text-sm text-gray-600">Páginas</div>
          </div>
        </div>

        {/* SEO Text Block */}
        <div className="mt-12 prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Navegação Completa do Site
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Este sitemap de texto fornece acesso direto a todas as páginas e produtos do
            JC Hair Studio. Use esta página para navegar rapidamente pelo nosso catálogo
            completo de produtos brasileiros em Portugal.
          </p>
        </div>
      </div>
    </div>
  );
}
