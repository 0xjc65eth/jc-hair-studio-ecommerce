/**
 * Vercel Deploy Webhook - Search Engine Ping
 *
 * WHY: Automatically ping search engines when site is deployed
 * HOW: Triggered by Vercel deploy hook, executes ping system
 *
 * Usage:
 *   POST /api/webhooks/ping-engines
 *   Header: x-vercel-signature (for verification)
 *
 * Setup in Vercel:
 *   1. Go to Project Settings → Git → Deploy Hooks
 *   2. Create new hook pointing to: https://jchairstudios62.xyz/api/webhooks/ping-engines
 *   3. Add webhook secret to environment: WEBHOOK_SECRET
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Rate limiting state (in-memory, resets on serverless cold start)
const rateLimitState: Record<string, number> = {};
const RATE_LIMIT_WINDOW = 30 * 60 * 1000; // 30 minutes

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

/**
 * Check rate limiting
 */
function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const lastPing = rateLimitState[key];

  if (!lastPing) return true;

  return now - lastPing >= RATE_LIMIT_WINDOW;
}

/**
 * Record ping
 */
function recordPing(key: string) {
  rateLimitState[key] = Date.now();
}

/**
 * Execute ping to search engines
 */
async function pingSearchEngines() {
  const SITE_URL = process.env.SITE_URL || 'https://jchairstudios62.xyz';
  const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

  const results: Array<{
    engine: string;
    success: boolean;
    statusCode?: number;
    error?: string;
  }> = [];

  // Ping Google
  try {
    const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const googleResponse = await fetch(googleUrl, { method: 'GET' });

    results.push({
      engine: 'google',
      success: googleResponse.ok,
      statusCode: googleResponse.status
    });
  } catch (error) {
    results.push({
      engine: 'google',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Ping Bing
  try {
    const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const bingResponse = await fetch(bingUrl, { method: 'GET' });

    results.push({
      engine: 'bing',
      success: bingResponse.ok,
      statusCode: bingResponse.status
    });
  } catch (error) {
    results.push({
      engine: 'bing',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Ping Yandex
  try {
    const yandexUrl = `https://yandex.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const yandexResponse = await fetch(yandexUrl, { method: 'GET' });

    results.push({
      engine: 'yandex',
      success: yandexResponse.ok,
      statusCode: yandexResponse.status
    });
  } catch (error) {
    results.push({
      engine: 'yandex',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Submit to IndexNow
  try {
    const INDEXNOW_KEY = 'd4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8';
    const host = SITE_URL.replace('https://', '').replace('http://', '');

    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: [SITE_URL]
    };

    const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    results.push({
      engine: 'indexnow',
      success: indexNowResponse.ok || indexNowResponse.status === 202,
      statusCode: indexNowResponse.status
    });
  } catch (error) {
    results.push({
      engine: 'indexnow',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return results;
}

/**
 * POST handler - triggered by Vercel deploy hook
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.text();

    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get('x-vercel-signature') || '';

      if (!signature || !verifyWebhookSignature(body, signature, webhookSecret)) {
        console.error('[WEBHOOK] Invalid signature');
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    }

    // Check rate limiting
    const rateLimitKey = 'deploy-ping';
    if (!checkRateLimit(rateLimitKey)) {
      console.log('[WEBHOOK] Rate limit active, skipping ping');
      return NextResponse.json(
        {
          success: true,
          skipped: true,
          message: 'Rate limit active, ping skipped'
        },
        { status: 200 }
      );
    }

    // Execute pings
    console.log('[WEBHOOK] Executing search engine pings...');
    const results = await pingSearchEngines();

    // Record ping
    recordPing(rateLimitKey);

    // Log results
    const successCount = results.filter(r => r.success).length;
    console.log(`[WEBHOOK] Ping complete: ${successCount}/${results.length} successful`);

    results.forEach(result => {
      if (result.success) {
        console.log(`[WEBHOOK] ✅ ${result.engine}: SUCCESS (${result.statusCode})`);
      } else {
        console.log(`[WEBHOOK] ❌ ${result.engine}: FAILED - ${result.error || result.statusCode}`);
      }
    });

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: results.length - successCount
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[WEBHOOK] Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - manual trigger for testing
 */
export async function GET(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get('authorization');
  const expectedToken = process.env.WEBHOOK_SECRET || 'test-token';

  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Check rate limiting
    const rateLimitKey = 'manual-ping';
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Rate limit active, please wait before pinging again'
        },
        { status: 429 }
      );
    }

    // Execute pings
    console.log('[MANUAL] Executing search engine pings...');
    const results = await pingSearchEngines();

    // Record ping
    recordPing(rateLimitKey);

    const successCount = results.filter(r => r.success).length;
    console.log(`[MANUAL] Ping complete: ${successCount}/${results.length} successful`);

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: results.length - successCount
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[MANUAL] Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
