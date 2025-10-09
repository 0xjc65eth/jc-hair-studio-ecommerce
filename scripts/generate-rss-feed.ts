/**
 * Script to generate RSS feed for product updates
 * Notifies search engines of latest products and updates
 */

import fs from 'fs';
import path from 'path';
import { getAllStaticProducts } from '../lib/data/staticProducts';

const SITE_URL = 'https://jchairstudios62.xyz';
const FEED_URL = `${SITE_URL}/feed.xml`;
const MAX_ITEMS = 50;

interface RSSItem {
  id: string;
  nome: string;
  marca: string;
  descricao: string;
  imagens: string[];
  badge?: string;
  pricing?: {
    basePrice: number;
    ourPrice: number;
    discountPrice: number;
  };
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getCategoryFromProduct(product: RSSItem): string {
  const id = product.id.toLowerCase();
  const nome = product.nome.toLowerCase();

  if (id.startsWith('mega-') || id.match(/^\d+$/) || nome.includes('mega hair')) {
    return 'Mega Hair';
  }
  if (nome.includes('progressiv') || nome.includes('keratin') || nome.includes('alisamento')) {
    return 'Progressivas e Tratamentos';
  }
  if (nome.includes('relaxamento') || nome.includes('guanidina')) {
    return 'Relaxamentos';
  }
  if (nome.includes('botox') || nome.includes('btx') || nome.includes('máscara')) {
    return 'Tratamentos Capilares';
  }
  if (nome.includes('base') || nome.includes('maquiagem')) {
    return 'Maquiagem';
  }
  if (id.includes('loreal') || id.includes('biocolor') || id.includes('beautycolor') ||
      id.includes('amend') || id.includes('nutrisse') || id.includes('altamoda')) {
    return 'Colorações Capilares';
  }
  if (id.includes('impala') || nome.includes('esmalte')) {
    return 'Esmaltes';
  }
  if (nome.includes('shampoo') || nome.includes('condicionador')) {
    return 'Shampoos e Condicionadores';
  }

  return 'Produtos Capilares';
}

function generateRSSFeed(): string {
  const allProducts = getAllStaticProducts();

  // Sort products by ID (most recent first) and limit to 50
  const recentProducts = allProducts
    .slice(0, MAX_ITEMS)
    .map(product => ({
      ...product,
      category: getCategoryFromProduct(product),
      pubDate: new Date('2025-10-09').toUTCString(), // Current date for all products
    }));

  const rssItems = recentProducts.map(product => {
    const productUrl = `${SITE_URL}/produto/${encodeURIComponent(product.id)}`;
    const imageUrl = product.imagens[0] ? `${SITE_URL}${product.imagens[0]}` : '';
    const price = product.pricing?.discountPrice || product.pricing?.ourPrice || product.pricing?.basePrice || 0;

    return `    <item>
      <title>${escapeXml(product.nome)}</title>
      <link>${productUrl}</link>
      <guid isPermaLink="true">${productUrl}</guid>
      <description><![CDATA[${escapeXml(product.descricao)}]]></description>
      <pubDate>${product.pubDate}</pubDate>
      <category>${escapeXml(product.category)}</category>
      ${product.marca ? `<dc:creator>${escapeXml(product.marca)}</dc:creator>` : ''}
      ${product.badge ? `<atom:category term="${escapeXml(product.badge)}" label="${escapeXml(product.badge)}"/>` : ''}
      ${imageUrl ? `<media:content url="${imageUrl}" medium="image" type="image/jpeg">
        <media:title type="plain">${escapeXml(product.nome)}</media:title>
        <media:description type="plain">${escapeXml(product.descricao)}</media:description>
      </media:content>
      <enclosure url="${imageUrl}" type="image/jpeg" length="0"/>` : ''}
      ${price > 0 ? `<g:price>${price.toFixed(2)} EUR</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>` : ''}
    </item>`;
  }).join('\n');

  const buildDate = new Date().toUTCString();
  const lastBuildDate = new Date('2025-10-09').toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>JC Hair Studio's 62 - Produtos Capilares Brasileiros Premium</title>
    <link>${SITE_URL}</link>
    <description>Feed RSS de produtos capilares brasileiros premium: mega hair 100% humano, progressivas Vogue, BTX capilar, maquiagem brasileira e tratamentos profissionais. Tradição familiar de mais de 40 anos.</description>
    <language>pt-PT</language>
    <copyright>Copyright ${new Date().getFullYear()} JC Hair Studio's 62. Todos os direitos reservados.</copyright>
    <managingEditor>contato@jchairstudios62.xyz (JC Hair Studio's 62)</managingEditor>
    <webMaster>suporte@jchairstudios62.xyz (JC Hair Studio's 62 Tech Team)</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>1440</ttl>
    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/logo-white.svg</url>
      <title>JC Hair Studio's 62</title>
      <link>${SITE_URL}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <category>Beauty &amp; Personal Care</category>
    <category>Hair Care Products</category>
    <category>Brazilian Hair Extensions</category>
    <category>Professional Hair Treatments</category>
${rssItems}
  </channel>
</rss>`;
}

function main() {
  try {
    console.log('Generating RSS feed...');

    const rssContent = generateRSSFeed();
    const outputPath = path.join(process.cwd(), 'public', 'feed.xml');

    fs.writeFileSync(outputPath, rssContent, 'utf-8');

    console.log(`✓ RSS feed generated successfully at: ${outputPath}`);
    console.log(`✓ Feed contains ${getAllStaticProducts().slice(0, MAX_ITEMS).length} most recent products`);
    console.log(`✓ Feed URL: ${FEED_URL}`);
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    process.exit(1);
  }
}

main();
