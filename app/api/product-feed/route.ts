import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const feedPath = path.join(process.cwd(), 'public', 'product-feed.xml');
    const feedContent = fs.readFileSync(feedPath, 'utf-8');

    return new NextResponse(feedContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Product feed not found' },
      { status: 404 }
    );
  }
}
