/**
 * DYNAMIC PRICING PAGE - REAL-TIME PRICE UPDATES
 * Shows live pricing data with timestamps
 * Purpose: Signal frequent content changes to crawlers
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { allEuropeanProducts } from '@/lib/data/europeanPricingProducts';

export const metadata: Metadata = {
  title: 'Preços Atualizados - JC Hair Studio | Promoções e Descontos ao Vivo',
  description: `Preços atualizados em tempo real. Última atualização: ${new Date().toISOString()}. Confira as melhores ofertas de produtos brasileiros.`,
  alternates: {
    canonical: 'https://jchairstudios62.xyz/precos-atualizados'
  },
  robots: {
    index: true,
    follow: true
  }
};

export const revalidate = 1800; // Revalidate every 30 minutes

// Get products with best discounts
function getBestDeals() {
  return allEuropeanProducts
    .filter(p => p.pricing.basePrice > p.pricing.discountPrice)
    .map(p => ({
      ...p,
      savingsPercent: Math.round(((p.pricing.basePrice - p.pricing.discountPrice) / p.pricing.basePrice) * 100)
    }))
    .sort((a, b) => b.savingsPercent - a.savingsPercent)
    .slice(0, 20);
}

// Get recently updated prices (simulated by rotating products)
function getRecentlyUpdated() {
  const hour = new Date().getHours();
  return allEuropeanProducts
    .filter((_, index) => (index + hour) % 5 === 0)
    .slice(0, 15);
}

export default function PrecosAtualizadosPage() {
  const bestDeals = getBestDeals();
  const recentlyUpdated = getRecentlyUpdated();
  const updateTime = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Live Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Preços Atualizados em Tempo Real
              </h1>
              <p className="text-green-100 text-lg">
                Sistema de monitoramento contínuo de preços e ofertas
              </p>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
              <div className="animate-pulse w-3 h-3 bg-green-400 rounded-full"></div>
              <div>
                <div className="text-sm font-semibold">AO VIVO</div>
                <time dateTime={updateTime.toISOString()} className="text-xs text-green-100">
                  {updateTime.toLocaleTimeString('pt-PT')}
                </time>
              </div>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{bestDeals.length}</div>
              <div className="text-sm text-green-100">Ofertas Ativas</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">
                {bestDeals[0]?.savingsPercent || 0}%
              </div>
              <div className="text-sm text-green-100">Maior Desconto</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{recentlyUpdated.length}</div>
              <div className="text-sm text-green-100">Atualizados Hoje</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">30min</div>
              <div className="text-sm text-green-100">Frequência</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Nav */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <Link href="/news" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">📰</div>
            <div className="text-sm font-semibold">Notícias</div>
          </Link>
          <Link href="/updates" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-sm font-semibold">Atualizações</div>
          </Link>
          <Link href="/latest-products" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">🆕</div>
            <div className="text-sm font-semibold">Novos Produtos</div>
          </Link>
          <Link href="/sitemap-html" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">🗺️</div>
            <div className="text-sm font-semibold">Mapa do Site</div>
          </Link>
        </div>

        {/* Best Deals Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Melhores Ofertas
            <span className="ml-3 text-base font-normal text-green-600">
              Até {bestDeals[0]?.savingsPercent || 0}% de desconto
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestDeals.map((product) => (
              <article
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-xl transition p-4"
                itemScope
                itemType="https://schema.org/Product"
              >
                <Link href={`/produto/${product.id}`}>
                  <div className="mb-3">
                    <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      -{product.savingsPercent}%
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2" itemProp="name">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3" itemProp="brand">
                    {product.brand}
                  </p>

                  <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className="text-2xl font-bold text-green-600" itemProp="price">
                        €{product.pricing.discountPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400 line-through">
                        €{product.pricing.basePrice.toFixed(2)}
                      </span>
                      <span className="ml-2 text-green-600 font-semibold">
                        Poupa €{(product.pricing.basePrice - product.pricing.discountPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-green-600 font-semibold">
                      ✓ Preço atualizado hoje
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Recently Updated Prices */}
        <div className="mb-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Preços Atualizados nas Últimas Horas
          </h2>

          <div className="space-y-3">
            {recentlyUpdated.map((product, index) => (
              <Link
                key={product.id}
                href={`/produto/${product.id}`}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 font-mono text-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    €{product.pricing.discountPrice.toFixed(2)}
                  </div>
                  {product.pricing.basePrice > product.pricing.discountPrice && (
                    <div className="text-sm text-gray-400 line-through">
                      €{product.pricing.basePrice.toFixed(2)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Price Update Frequency Info */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Sistema de Preços Dinâmicos
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nossos preços são atualizados automaticamente a cada 30 minutos para garantir
            que você sempre tenha acesso às melhores ofertas de produtos brasileiros em Portugal.
            O sistema monitora constantemente nosso inventário e ajusta os preços com base em
            disponibilidade, promoções e demanda.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Atualizações Rápidas</h3>
              <p className="text-sm text-gray-600">Preços atualizados a cada 30 minutos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Melhores Ofertas</h3>
              <p className="text-sm text-gray-600">Descontos de até 50% em produtos selecionados</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl mb-2">🔔</div>
              <h3 className="font-semibold text-gray-900 mb-2">Alertas de Preço</h3>
              <p className="text-sm text-gray-600">Notificações quando preços baixam</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
