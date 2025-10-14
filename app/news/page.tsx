/**
 * NEWS PAGE - CRAWLER HONEYPOT
 * Auto-generated content with frequent updates
 * Purpose: Attract search engine crawlers with fresh content
 */

import { Metadata } from 'next';
import Link from 'next/link';

// Generate current timestamp
const getCurrentTimestamp = () => new Date().toISOString();

// Generate news items based on current time
function generateNewsItems() {
  const now = new Date();
  const items = [];

  // Last 30 days of news
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const newsTemplates = [
      {
        title: `Novos Produtos Brasileiros Chegaram - ${date.toLocaleDateString('pt-PT')}`,
        excerpt: 'Recebemos um lote exclusivo de produtos capilares brasileiros. Progressivas, tratamentos e cosméticos agora disponíveis.',
        category: 'Lançamentos'
      },
      {
        title: `Promoção Especial em Mega Hair - ${date.toLocaleDateString('pt-PT')}`,
        excerpt: 'Até 30% de desconto em mega hair natural brasileiro. Extensões de qualidade premium com entrega rápida.',
        category: 'Promoções'
      },
      {
        title: `Dicas de Tratamento Capilar - ${date.toLocaleDateString('pt-PT')}`,
        excerpt: 'Como manter seu cabelo saudável com produtos brasileiros. Guia completo de cuidados capilares.',
        category: 'Dicas'
      },
      {
        title: `Estoque Atualizado - ${date.toLocaleDateString('pt-PT')}`,
        excerpt: 'Reposição completa de progressivas Vogue, tratamentos HairLife e maquiagem Wepink disponível agora.',
        category: 'Estoque'
      }
    ];

    const template = newsTemplates[i % newsTemplates.length];
    items.push({
      id: `news-${date.getTime()}`,
      date: date.toISOString(),
      displayDate: date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      ...template
    });
  }

  return items;
}

export const metadata: Metadata = {
  title: 'Notícias e Novidades - JC Hair Studio | Produtos Brasileiros em Portugal',
  description: `Últimas notícias sobre produtos brasileiros, lançamentos e promoções. Atualizado em ${new Date().toLocaleDateString('pt-PT')}`,
  alternates: {
    canonical: 'https://jchairstudios62.xyz/news'
  },
  openGraph: {
    title: 'Notícias - JC Hair Studio',
    description: 'Fique por dentro das novidades e lançamentos de produtos brasileiros',
    url: 'https://jchairstudios62.xyz/news',
    type: 'website'
  }
};

export const revalidate = 3600; // Revalidate every hour

export default function NewsPage() {
  const newsItems = generateNewsItems();
  const lastUpdate = new Date().toLocaleString('pt-PT');

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Notícias e Novidades
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Fique por dentro das últimas atualizações sobre produtos brasileiros em Portugal
          </p>
          <p className="text-sm text-gray-500">
            Última atualização: <time dateTime={getCurrentTimestamp()}>{lastUpdate}</time>
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Link href="/produtos" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-semibold text-gray-900">Todos os Produtos</div>
          </Link>
          <Link href="/latest-products" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">✨</div>
            <div className="font-semibold text-gray-900">Lançamentos</div>
          </Link>
          <Link href="/updates" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-semibold text-gray-900">Atualizações</div>
          </Link>
          <Link href="/sitemap-html" className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center">
            <div className="text-2xl mb-2">🗺️</div>
            <div className="font-semibold text-gray-900">Mapa do Site</div>
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
              itemScope
              itemType="https://schema.org/NewsArticle"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-pink-600 bg-pink-100 rounded-full">
                  {item.category}
                </span>
                <time
                  dateTime={item.date}
                  className="text-sm text-gray-500"
                  itemProp="datePublished"
                >
                  {item.displayDate}
                </time>
              </div>

              <h2
                className="text-xl font-bold text-gray-900 mb-3"
                itemProp="headline"
              >
                {item.title}
              </h2>

              <p
                className="text-gray-600 mb-4"
                itemProp="description"
              >
                {item.excerpt}
              </p>

              <Link
                href="/produtos"
                className="text-pink-600 font-semibold hover:text-pink-700 transition"
              >
                Ver Produtos →
              </Link>
            </article>
          ))}
        </div>

        {/* Categories Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Categorias Populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/mega-hair" className="text-gray-700 hover:text-pink-600 transition">
              Mega Hair Natural
            </Link>
            <Link href="/progressivas-btx" className="text-gray-700 hover:text-pink-600 transition">
              Progressivas Brasileiras
            </Link>
            <Link href="/tratamentos-capilares" className="text-gray-700 hover:text-pink-600 transition">
              Tratamentos Capilares
            </Link>
            <Link href="/maquiagens" className="text-gray-700 hover:text-pink-600 transition">
              Maquiagem Brasileira
            </Link>
            <Link href="/perfumes" className="text-gray-700 hover:text-pink-600 transition">
              Perfumes Brasileiros
            </Link>
            <Link href="/esmaltes" className="text-gray-700 hover:text-pink-600 transition">
              Esmaltes IMPALA
            </Link>
            <Link href="/shampoos-condicionadores" className="text-gray-700 hover:text-pink-600 transition">
              Shampoos e Condicionadores
            </Link>
            <Link href="/ferramentas-equipamentos" className="text-gray-700 hover:text-pink-600 transition">
              Ferramentas Profissionais
            </Link>
          </div>
        </div>

        {/* SEO Content Block */}
        <div className="mt-12 prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Produtos Brasileiros em Portugal
          </h2>
          <p className="text-gray-700 leading-relaxed">
            A JC Hair Studio é a sua fonte número um para produtos capilares brasileiros em Portugal.
            Oferecemos uma ampla seleção de progressivas, tratamentos capilares, mega hair natural,
            maquiagem brasileira, perfumes e muito mais. Todos os nossos produtos são importados
            diretamente do Brasil, garantindo autenticidade e qualidade premium.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            Acompanhe esta página regularmente para ficar por dentro dos lançamentos, promoções
            especiais e novidades sobre produtos brasileiros. Atualizamos nosso catálogo frequentemente
            com as últimas tendências do mercado brasileiro de beleza.
          </p>
        </div>
      </div>
    </div>
  );
}
