import { MetadataRoute } from 'next';
import { generateUnifiedCatalog } from '@/lib/data/megaHairProducts';
import { beautyCategories } from '@/lib/data/categories';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';

export default function sitemap(): MetadataRoute.Sitemap {
  // URLs estáticas principais
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Páginas principais de produtos
    {
      url: `${baseUrl}/mega-hair`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/progressiva-vogue`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/maquiagem`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cosmeticos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/produtos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Páginas de categoria específica
    {
      url: `${baseUrl}/progressivas-btx`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tratamentos-capilares`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shampoos-condicionadores`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/ferramentas-equipamentos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Páginas institucionais importantes para SEO
    {
      url: `${baseUrl}/nossa-historia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/como-comprar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/envio-entrega`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/formas-pagamento`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/trocas-devolucoes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // Páginas legais
    {
      url: `${baseUrl}/legal/politica-privacidade`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/termos-uso`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/politica-cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // URLs dos produtos mega hair
  const megaHairProducts = generateUnifiedCatalog();
  const productUrls: MetadataRoute.Sitemap = megaHairProducts.map((product) => ({
    url: `${baseUrl}/produto/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // URLs das categorias
  const categoryUrls: MetadataRoute.Sitemap = beautyCategories.map((category) => ({
    url: `${baseUrl}/categoria/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // URLs específicas de produtos por categoria
  const categoryProductUrls: MetadataRoute.Sitemap = beautyCategories.flatMap((category) =>
    category.products.slice(0, 20).map((product) => ({
      url: `${baseUrl}/produto/${product.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  // URLs de landing pages específicas para SEO
  const seoLandingPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/mega-hair-brasileiro`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/progressiva-brasileira`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cabelo-humano-brasileiro`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/extensao-cabelo-natural`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/produtos-brasileiros-europa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/maquiagem-brasileira-europa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Combinar todas as URLs
  const allUrls = [
    ...staticUrls,
    ...productUrls,
    ...categoryUrls,
    ...categoryProductUrls,
    ...seoLandingPages,
  ];

  // Remover duplicatas baseado na URL
  const uniqueUrls = allUrls.filter((url, index, self) =>
    index === self.findIndex(u => u.url === url.url)
  );

  return uniqueUrls;
}