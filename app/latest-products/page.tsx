/**
 * LATEST PRODUCTS PAGE - ROTATING CONTENT HONEYPOT
 * Shows rotating product selection based on time
 * Purpose: Keep crawlers coming back with constantly changing product displays
 */

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { allEuropeanProducts } from '@/lib/data/europeanPricingProducts';

export const metadata: Metadata = {
  title: 'Últimos Produtos - JC Hair Studio | Novidades Brasileiras em Portugal',
  description: `Descubra os produtos mais recentes do Brasil. Catálogo atualizado: ${new Date().toISOString()}. Progressivas, mega hair, maquiagem e mais.`,
  alternates: {
    canonical: 'https://jchairstudios62.xyz/latest-products'
  },
  openGraph: {
    title: 'Últimos Produtos Brasileiros - JC Hair Studio',
    description: 'Confira os produtos mais recentes e populares do nosso catálogo',
    url: 'https://jchairstudios62.xyz/latest-products'
  }
};

export const revalidate = 3600; // Revalidate every hour

// Rotate products based on current hour of the day
function getRotatedProducts() {
  const currentHour = new Date().getHours();
  const rotationIndex = currentHour % 10; // Rotate every hour

  // Shuffle products based on time
  const shuffled = [...allEuropeanProducts].sort((a, b) => {
    const hashA = (a.id.charCodeAt(0) + rotationIndex) % 100;
    const hashB = (b.id.charCodeAt(0) + rotationIndex) % 100;
    return hashB - hashA;
  });

  return shuffled.slice(0, 24); // Show 24 products
}

// Get featured products by category
function getFeaturedByCategory() {
  const categories = [
    'Progressivas',
    'Mega Hair',
    'Tratamentos Capilares',
    'Maquiagem',
    'Perfumes',
    'Esmaltes'
  ];

  return categories.map(cat => ({
    name: cat,
    products: allEuropeanProducts
      .filter(p => p.category === cat)
      .slice(0, 4)
  })).filter(cat => cat.products.length > 0);
}

export default function LatestProductsPage() {
  const rotatedProducts = getRotatedProducts();
  const categorizedProducts = getFeaturedByCategory();
  const updateTime = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Últimos Produtos Brasileiros
            </h1>
            <p className="text-xl text-pink-100 mb-4">
              Catálogo atualizado a cada hora com novos destaques
            </p>
            <time
              dateTime={updateTime.toISOString()}
              className="text-sm text-pink-200"
            >
              Última atualização: {updateTime.toLocaleString('pt-PT')}
            </time>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{allEuropeanProducts.length}</div>
              <div className="text-sm text-pink-100">Produtos Total</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{rotatedProducts.length}</div>
              <div className="text-sm text-pink-100">Em Destaque Agora</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-pink-100">Brasileiros</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{categorizedProducts.length}+</div>
              <div className="text-sm text-pink-100">Categorias</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Link href="/news" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">📰</div>
            <div className="font-semibold text-gray-900">Notícias</div>
          </Link>
          <Link href="/updates" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-semibold text-gray-900">Atualizações</div>
          </Link>
          <Link href="/produtos" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-semibold text-gray-900">Todos Produtos</div>
          </Link>
          <Link href="/sitemap-html" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">🗺️</div>
            <div className="font-semibold text-gray-900">Mapa do Site</div>
          </Link>
        </div>

        {/* Rotating Products Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Destaques de Hoje
            <span className="ml-3 text-base font-normal text-gray-500">
              (Rotação a cada hora)
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rotatedProducts.map((product) => (
              <article
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow"
                itemScope
                itemType="https://schema.org/Product"
              >
                <Link href={`/produto/${product.id}`}>
                  <div className="relative h-64 bg-gray-100 rounded-t-lg overflow-hidden">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sem imagem
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3
                      className="font-semibold text-gray-900 mb-2 line-clamp-2"
                      itemProp="name"
                    >
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-2" itemProp="brand">
                      {product.brand}
                    </p>

                    <div className="flex items-baseline space-x-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                      <span className="text-2xl font-bold text-pink-600" itemProp="price">
                        €{product.pricing.discountPrice.toFixed(2)}
                      </span>
                      {product.pricing.basePrice > product.pricing.discountPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          €{product.pricing.basePrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {product.inStock && (
                      <span className="text-xs text-green-600 font-semibold mt-2 block">
                        ✓ Em Stock
                      </span>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Products by Category */}
        {categorizedProducts.map((category) => (
          <div key={category.name} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {category.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.products.map((product) => (
                <article
                  key={product.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition"
                >
                  <Link href={`/produto/${product.id}`}>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {product.brand}
                      </p>
                      <div className="text-xl font-bold text-pink-600">
                        €{product.pricing.discountPrice.toFixed(2)}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link
                href={`/produtos`}
                className="inline-block bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
              >
                Ver mais {category.name} →
              </Link>
            </div>
          </div>
        ))}

        {/* SEO Content */}
        <div className="mt-16 bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Produtos Brasileiros Sempre Atualizados
          </h2>

          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              Nosso catálogo de produtos brasileiros é atualizado constantemente para trazer as
              melhores novidades do Brasil para Portugal. Esta página mostra uma seleção rotativa
              de produtos que muda a cada hora, garantindo que você sempre veja algo novo.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">
              Categorias Disponíveis
            </h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Progressivas Brasileiras - Vogue, Cadiveu, Forever Liss</li>
              <li>Mega Hair Natural - Extensões de qualidade premium</li>
              <li>Tratamentos Capilares - Hidratação, nutrição e reconstrução</li>
              <li>Maquiagem Brasileira - Wepink, Eudora, Natura</li>
              <li>Perfumes Brasileiros - O Boticário, Wepink</li>
              <li>Esmaltes IMPALA - Cores vibrantes brasileiras</li>
              <li>Shampoos e Condicionadores Profissionais</li>
              <li>Ferramentas e Equipamentos de Beleza</li>
            </ul>

            <p>
              Visite esta página regularmente ou navegue pelo nosso catálogo completo para
              descobrir todos os produtos brasileiros disponíveis em Portugal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
