import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  try {
    const feedPath = join(process.cwd(), 'public', 'product-feed.xml');
    const feedContent = await readFile(feedPath, 'utf-8');

    return new NextResponse(feedContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'all',
      },
    });
  } catch (error) {
    console.error('Feed read error:', error);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><error>Feed not available</error>',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
        },
      }
    );
  }
}
