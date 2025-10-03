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
          '/maquiagem',
          '/cosmeticos',
          '/produtos',
          '/produto/',
          '/categoria/',
          '/progressiva-vogue-portugal',
          '/tintas-wella-portugal',
          '/esmaltes-impala-portugal',
          '/mari-maria-makeup-portugal',
          '/contato',
          '/legal/',
          '/images/',
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
          '/_next/',
          '/private/',
          '/temp/'
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/mega-hair',
          '/maquiagem',
          '/cosmeticos',
          '/produtos',
          '/produto/',
          '/categoria/',
          '/progressiva-vogue-portugal',
          '/tintas-wella-portugal',
          '/esmaltes-impala-portugal',
          '/mari-maria-makeup-portugal',
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
