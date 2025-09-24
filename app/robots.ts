import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/mega-hair',
          '/progressiva-vogue',
          '/maquiagem',
          '/cosmeticos',
          '/produtos',
          '/produto/',
          '/categoria/',
          '/progressivas-btx',
          '/tratamentos-capilares',
          '/shampoos-condicionadores',
          '/ferramentas-equipamentos',
          '/nossa-historia',
          '/sobre',
          '/contato',
          '/como-comprar',
          '/faq',
          '/envio-entrega',
          '/formas-pagamento',
          '/trocas-devolucoes',
          '/legal/',
          '/images/',
          '/api/sitemap'
        ],
        disallow: [
          '/admin/',
          '/api/admin/',
          '/api/auth/',
          '/api/webhook/',
          '/conta/',
          '/checkout/',
          '/carrinho/',
          '/favoritos/',
          '/auth/',
          '/test-*',
          '/catalog-*',
          '/*?*utm_',
          '/*?*fbclid',
          '/*?*gclid',
          '/api/inventory/',
          '/api/orders/',
          '/api/notifications/',
          '/api/admin/',
          '/_next/',
          '/private/',
          '/temp/'
        ],
        crawlDelay: 1,
      },
      // Configurações específicas para Google
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/mega-hair',
          '/progressiva-vogue',
          '/maquiagem',
          '/cosmeticos',
          '/produtos',
          '/produto/',
          '/categoria/',
          '/images/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/conta/',
          '/checkout/',
          '/carrinho/',
          '/auth/',
          '/test-*'
        ],
        crawlDelay: 0.5,
      },
      // Configurações específicas para Bing
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/mega-hair',
          '/progressiva-vogue',
          '/maquiagem',
          '/cosmeticos',
          '/produtos',
          '/produto/',
          '/categoria/',
          '/images/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/conta/',
          '/checkout/',
          '/carrinho/',
          '/auth/',
          '/test-*'
        ],
        crawlDelay: 1,
      },
      // Configurações para outros bots importantes
      {
        userAgent: 'facebookexternalhit',
        allow: [
          '/',
          '/mega-hair',
          '/produto/',
          '/images/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/conta/',
          '/checkout/'
        ]
      },
      {
        userAgent: 'Twitterbot',
        allow: [
          '/',
          '/mega-hair',
          '/produto/',
          '/images/',
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/conta/',
          '/checkout/'
        ]
      },
      // Bloquear bots maliciosos comuns
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'DataForSeoBot',
          'PetalBot',
          'YandexBot'
        ],
        disallow: ['/']
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
    host: baseUrl.replace('https://', '').replace('http://', ''),
  };
}