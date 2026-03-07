import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://jchairstudios62.xyz';

interface Product {
  id: string;
  name: string;
  slug?: string;
  brand?: string;
  description?: string;
  shortDesc?: string;
  sku?: string;
  mpn?: string;
  gtin?: string;
  price?: number;
  pricing?: {
    ourPrice?: number;
    discountPrice?: number;
  };
  images?: string[];
  inStock?: boolean;
  stock?: number;
  stockQuantity?: number;
  category?: string;
  color?: string;
  size?: string;
}

function escapeXml(text: string | undefined): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function mapToGoogleCategory(category: string): string {
  const mapping: Record<string, string> = {
    'progressivas-btx': 'Health & Beauty > Personal Care > Hair Care > Hair Treatments',
    'mega-hair': 'Health & Beauty > Personal Care > Hair Care > Hair Extensions',
    'progressivas-alisamentos': 'Health & Beauty > Personal Care > Hair Care > Hair Treatments',
    'shampoos-condicionadores': 'Health & Beauty > Personal Care > Hair Care > Shampoo & Conditioner',
    'tratamentos-capilares': 'Health & Beauty > Personal Care > Hair Care > Hair Treatments',
    'coloracao-tintas': 'Health & Beauty > Personal Care > Hair Care > Hair Color',
    'maquiagem': 'Health & Beauty > Personal Care > Cosmetics > Makeup',
    'cosmeticos': 'Health & Beauty > Personal Care > Cosmetics',
    'esmaltes': 'Health & Beauty > Personal Care > Cosmetics > Nail Care',
    'cuidados-corpo': 'Health & Beauty > Personal Care > Body Care',
    'ferramentas-profissionais': 'Health & Beauty > Personal Care > Hair Care > Hair Styling Tools',
  };
  return mapping[category] || 'Health & Beauty > Personal Care';
}

function generateProductXml(product: Product): string {
  const productUrl = `${SITE_URL}/produto/${product.slug || product.id}`;
  const imageUrl = product.images?.[0]
    ? (product.images[0].startsWith('http') ? product.images[0] : `${SITE_URL}${product.images[0]}`)
    : `${SITE_URL}/images/placeholder.jpg`;

  const price = product.pricing?.ourPrice || product.price;
  if (!price) return '';

  const salePrice = product.pricing?.discountPrice;
  const availability = (product.inStock !== false && (product.stock !== 0 || product.stockQuantity !== 0))
    ? 'in_stock' : 'out_of_stock';

  let description = product.description || product.shortDesc || product.name;
  if (description.length > 5000) {
    description = description.substring(0, 4997) + '...';
  }

  const additionalImages = product.images?.slice(1, 11).map(img => {
    const imgUrl = img.startsWith('http') ? img : `${SITE_URL}${img}`;
    return `      <g:additional_image_link>${escapeXml(imgUrl)}</g:additional_image_link>`;
  }).join('\n') || '';

  return `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
${additionalImages}
      <g:availability>${availability}</g:availability>
      <g:price>${price.toFixed(2)} EUR</g:price>
${salePrice ? `      <g:sale_price>${salePrice.toFixed(2)} EUR</g:sale_price>` : ''}
      <g:brand>${escapeXml(product.brand || 'JC Hair Studio')}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${escapeXml(mapToGoogleCategory(product.category || ''))}</g:google_product_category>
      <g:product_type>${escapeXml(product.category || '')}</g:product_type>
${product.sku ? `      <g:mpn>${escapeXml(product.sku)}</g:mpn>` : ''}
${product.gtin ? `      <g:gtin>${escapeXml(product.gtin)}</g:gtin>` : ''}
      <g:item_group_id>${escapeXml(product.category || 'general')}</g:item_group_id>
${product.color ? `      <g:color>${escapeXml(product.color)}</g:color>` : ''}
${product.size ? `      <g:size>${escapeXml(product.size)}</g:size>` : ''}
      <g:shipping>
        <g:country>PT</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>ES</g:country>
        <g:service>Standard</g:service>
        <g:price>9.99 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>FR</g:country>
        <g:service>Standard</g:service>
        <g:price>12.99 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>DE</g:country>
        <g:service>Standard</g:service>
        <g:price>14.99 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>BE</g:country>
        <g:service>Standard</g:service>
        <g:price>14.99 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>IT</g:country>
        <g:service>Standard</g:service>
        <g:price>14.99 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>NL</g:country>
        <g:service>Standard</g:service>
        <g:price>14.99 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>GB</g:country>
        <g:service>Standard</g:service>
        <g:price>19.99 GBP</g:price>
      </g:shipping>
    </item>`;
}

function loadProducts(): Product[] {
  const productsPath = path.join(process.cwd(), 'lib/data/products-with-european-pricing.json');
  const data = fs.readFileSync(productsPath, 'utf-8');
  const catalog = JSON.parse(data);

  if (catalog.categories && Array.isArray(catalog.categories)) {
    const allProducts: Product[] = [];
    for (const category of catalog.categories) {
      if (category.products && Array.isArray(category.products)) {
        for (const product of category.products) {
          allProducts.push({ ...product, category: category.slug || category.id });
        }
      }
    }
    return allProducts;
  }

  return Array.isArray(catalog) ? catalog : [];
}

export async function GET() {
  try {
    const products = loadProducts();
    const validProducts = products.filter(p => p.id && p.name && (p.price || p.pricing?.ourPrice));

    const items = validProducts.map(generateProductXml).filter(Boolean).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>JC Hair Studio's 62 - Produtos Capilares Brasileiros Premium</title>
    <link>${SITE_URL}</link>
    <description>Premium Brazilian hair extensions, straightening treatments, and authentic Brazilian cosmetics. 100% human hair, professional salon quality.</description>
    <language>pt-PT</language>
    <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    console.error('Error generating Google Shopping feed:', error);
    return NextResponse.json(
      { error: 'Failed to generate product feed' },
      { status: 500 }
    );
  }
}
