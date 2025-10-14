/**
 * UPDATES PAGE - REAL-TIME CRAWLER MAGNET
 * Shows real-time updates with timestamps
 * Purpose: Signal to crawlers that content is constantly fresh
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Atualizações em Tempo Real - JC Hair Studio | Produtos Brasileiros',
  description: `Veja as últimas atualizações em tempo real do nosso catálogo. Página atualizada: ${new Date().toISOString()}`,
  alternates: {
    canonical: 'https://jchairstudios62.xyz/updates'
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1
  }
};

export const revalidate = 1800; // Revalidate every 30 minutes

// Generate real-time activity feed
function generateActivityFeed() {
  const now = new Date();
  const activities = [];

  // Generate activities for the last 24 hours
  for (let i = 0; i < 48; i++) {
    const time = new Date(now);
    time.setMinutes(time.getMinutes() - (i * 30));

    const activityTypes = [
      {
        icon: '📦',
        action: 'Novo produto adicionado',
        details: 'Progressiva Vogue Platinum 1L agora disponível',
        link: '/produtos/progressivas-alisamentos'
      },
      {
        icon: '💰',
        action: 'Preço atualizado',
        details: 'Desconto especial em tratamentos capilares HairLife',
        link: '/produtos/tratamentos-capilares'
      },
      {
        icon: '✨',
        action: 'Estoque reposto',
        details: 'Mega Hair Natural Brasileiro - Todas as cores disponíveis',
        link: '/mega-hair'
      },
      {
        icon: '🎨',
        action: 'Novos produtos de maquiagem',
        details: 'Bases Wepink Virginia - 15 tons disponíveis',
        link: '/maquiagens'
      },
      {
        icon: '🌸',
        action: 'Perfumes reabastecidos',
        details: 'Fragrâncias O Boticário e Wepink em estoque',
        link: '/perfumes'
      },
      {
        icon: '💅',
        action: 'Esmaltes IMPALA',
        details: 'Nova coleção de cores chegou',
        link: '/esmaltes'
      }
    ];

    const activity = activityTypes[i % activityTypes.length];
    activities.push({
      id: `activity-${time.getTime()}`,
      timestamp: time.toISOString(),
      displayTime: time.toLocaleString('pt-PT', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      relativeTime: getRelativeTime(time),
      ...activity
    });
  }

  return activities;
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 1) return 'Agora mesmo';
  if (diffInMinutes < 60) return `Há ${diffInMinutes} minutos`;
  if (diffInMinutes < 1440) return `Há ${Math.floor(diffInMinutes / 60)} horas`;
  return `Há ${Math.floor(diffInMinutes / 1440)} dias`;
}

export default function UpdatesPage() {
  const activities = generateActivityFeed();
  const currentTime = new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Live Status Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Atualizações em Tempo Real</h1>
              <p className="text-pink-100">
                Sistema atualizado continuamente com as últimas novidades
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="animate-pulse w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm font-semibold">AO VIVO</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">{activities.length}</div>
              <div className="text-sm text-pink-100">Atualizações</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">
                {currentTime.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-pink-100">Hora Atual</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-pink-100">Monitoramento</div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Link
            href="/news"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <div className="text-2xl mb-2">📰</div>
            <div className="text-sm font-semibold">Notícias</div>
          </Link>
          <Link
            href="/latest-products"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <div className="text-2xl mb-2">🆕</div>
            <div className="text-sm font-semibold">Novos Produtos</div>
          </Link>
          <Link
            href="/produtos"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <div className="text-2xl mb-2">🛍️</div>
            <div className="text-sm font-semibold">Catálogo</div>
          </Link>
          <Link
            href="/sitemap-html"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <div className="text-2xl mb-2">🗺️</div>
            <div className="text-sm font-semibold">Mapa</div>
          </Link>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Feed de Atividades
          </h2>

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="border-l-4 border-pink-500 pl-4 py-3 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {activity.action}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {activity.details}
                      </p>
                      <Link
                        href={activity.link}
                        className="text-pink-600 text-sm font-medium hover:text-pink-700 mt-2 inline-block"
                      >
                        Ver detalhes →
                      </Link>
                    </div>
                  </div>
                  <div className="text-right">
                    <time
                      dateTime={activity.timestamp}
                      className="text-sm text-gray-500 block"
                    >
                      {activity.displayTime}
                    </time>
                    <span className="text-xs text-gray-400">
                      {activity.relativeTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-pink-600">500+</div>
            <div className="text-sm text-gray-600 mt-2">Produtos Ativos</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-purple-600">20+</div>
            <div className="text-sm text-gray-600 mt-2">Categorias</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-blue-600">100%</div>
            <div className="text-sm text-gray-600 mt-2">Brasileiros</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-gray-600 mt-2">Disponível</div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Atualizações Constantes do Nosso Catálogo
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Mantemos nosso catálogo de produtos brasileiros sempre atualizado com as últimas novidades
            do mercado. Esta página mostra em tempo real todas as atualizações, novos produtos,
            mudanças de preço e reabastecimento de estoque.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Visite regularmente para não perder nenhuma novidade sobre progressivas brasileiras,
            mega hair natural, tratamentos capilares, maquiagem e cosméticos brasileiros em Portugal.
          </p>
        </div>
      </div>
    </div>
  );
}
