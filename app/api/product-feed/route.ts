import { NextResponse } from 'next/server';
import productsData from '@/lib/data/products-with-european-pricing.json';

const SITE_URL = 'https://jchairstudios62.xyz';

function escapeXml(text: string | number | undefined): string {
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
    'mega-hair': '469 > Health & Beauty > Personal Care > Hair Care > Hair Extensions',
    'progressivas-alisamentos': '469 > Health & Beauty > Personal Care > Hair Care > Hair Treatments',
    'progressivas-btx': '469 > Health & Beauty > Personal Care > Hair Care > Hair Treatments',
    'shampoos-condicionadores': '469 > Health & Beauty > Personal Care > Hair Care > Shampoo & Conditioner',
    'tratamentos-capilares': '469 > Health & Beauty > Personal Care > Hair Care > Hair Treatments',
    'coloracao-tintas': '469 > Health & Beauty > Personal Care > Hair Care > Hair Color',
    'maquiagem': '469 > Health & Beauty > Personal Care > Cosmetics > Makeup',
    'cosmeticos': '469 > Health & Beauty > Personal Care > Cosmetics',
  };
  return mapping[category] || '469 > Health & Beauty > Personal Care';
}

export async function GET() {
  try {
    // Extract products from categories
    const allProducts: any[] = [];
    if (productsData.categories && Array.isArray(productsData.categories)) {
      productsData.categories.forEach((category: any) => {
        if (category.products && Array.isArray(category.products)) {
          category.products.forEach((product: any) => {
            allProducts.push({
              ...product,
              category: category.slug || category.id
            });
          });
        }
      });
    }

    const currentDate = new Date().toISOString();

    const items = allProducts
      .filter(p => p.id && p.name && (p.price || p.pricing?.ourPrice))
      .map(product => {
        const productUrl = `${SITE_URL}/produto/${product.slug || product.id}`;
        const imageUrl = product.images && product.images[0]
          ? (product.images[0].startsWith('http') ? product.images[0] : `${SITE_URL}${product.images[0]}`)
          : `${SITE_URL}/images/placeholder.jpg`;

        const price = product.pricing?.ourPrice || product.price;
        const salePrice = product.pricing?.discountPrice;
        const availability = (product.inStock || product.stock > 0 || product.stockQuantity > 0) ? 'in stock' : 'out of stock';
        const description = product.description || product.shortDesc || product.name;

        return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${price} EUR</g:price>
      ${salePrice ? `<g:sale_price>${salePrice} EUR</g:sale_price>` : ''}
      <g:brand>${escapeXml(product.brand || 'JC Hair Studio')}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${escapeXml(mapToGoogleCategory(product.category))}</g:google_product_category>
      <g:product_type>${escapeXml(product.category)}</g:product_type>
      ${product.mpn || product.sku ? `<g:mpn>${escapeXml(product.mpn || product.sku)}</g:mpn>` : ''}
      <g:item_group_id>${escapeXml(product.category)}</g:item_group_id>
      <g:shipping>
        <g:country>PT</g:country>
        <g:service>Standard</g:service>
        <g:price>4.90 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>PT</g:country>
        <g:service>Free Shipping</g:service>
        <g:price>0.00 EUR</g:price>
        <g:min_order_value>50.00 EUR</g:min_order_value>
      </g:shipping>
    </item>`;
      }).join('\n');

    const feedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>JC Hair Studio's 62 - Premium Hair Extensions & Brazilian Cosmetics</title>
    <link>${SITE_URL}</link>
    <description>Premium Brazilian hair extensions, straightening treatments, and authentic Brazilian cosmetics. 100% human hair, professional salon quality.</description>
    <language>pt-PT</language>
    <lastBuildDate>${currentDate}</lastBuildDate>${items}
  </channel>
</rss>`;

    return new NextResponse(feedXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Product feed error:', error);
    return NextResponse.json(
      { error: 'Failed to generate product feed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
