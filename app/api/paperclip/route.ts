import { NextResponse } from 'next/server';

const PAPERCLIP_API = process.env.PAPERCLIP_API_URL || 'http://localhost:3100';

/**
 * GET /api/paperclip
 * Returns Paperclip connection status and company overview
 */
export async function GET() {
  try {
    const healthResponse = await fetch(`${PAPERCLIP_API}/api/health`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!healthResponse.ok) {
      return NextResponse.json(
        { status: 'disconnected', message: 'Paperclip server is not responding' },
        { status: 503 }
      );
    }

    const companiesResponse = await fetch(`${PAPERCLIP_API}/api/companies`);
    const companies = companiesResponse.ok ? await companiesResponse.json() : [];

    return NextResponse.json({
      status: 'connected',
      paperclip_url: PAPERCLIP_API,
      companies: Array.isArray(companies) ? companies.length : 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'disconnected',
        message: 'Cannot connect to Paperclip. Ensure the server is running.',
        setup_command: 'npm run paperclip:setup',
      },
      { status: 503 }
    );
  }
}

/**
 * POST /api/paperclip
 * Webhook endpoint for Paperclip agent actions
 * Receives agent task results and applies them to the store
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agent_id, action, data } = body;

    if (!agent_id || !action) {
      return NextResponse.json(
        { error: 'Missing agent_id or action' },
        { status: 400 }
      );
    }

    // Route agent actions to the appropriate handler
    switch (action) {
      case 'update_product':
        return handleProductUpdate(data);
      case 'create_promotion':
        return handlePromotionCreate(data);
      case 'send_campaign_email':
        return handleCampaignEmail(data);
      case 'update_inventory':
        return handleInventoryUpdate(data);
      case 'generate_report':
        return handleReportGeneration(data);
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function handleProductUpdate(data: Record<string, unknown>) {
  // Agent can update product descriptions, SEO metadata, pricing
  return NextResponse.json({
    success: true,
    action: 'update_product',
    message: 'Product update queued for review',
    data,
  });
}

async function handlePromotionCreate(data: Record<string, unknown>) {
  // Agent can create promotional codes and campaigns
  return NextResponse.json({
    success: true,
    action: 'create_promotion',
    message: 'Promotion created and pending activation',
    data,
  });
}

async function handleCampaignEmail(data: Record<string, unknown>) {
  // Agent can trigger email campaigns via SendGrid
  return NextResponse.json({
    success: true,
    action: 'send_campaign_email',
    message: 'Email campaign queued for sending',
    data,
  });
}

async function handleInventoryUpdate(data: Record<string, unknown>) {
  // Agent can update stock levels and reorder points
  return NextResponse.json({
    success: true,
    action: 'update_inventory',
    message: 'Inventory update applied',
    data,
  });
}

async function handleReportGeneration(data: Record<string, unknown>) {
  // Agent can generate analytics reports
  return NextResponse.json({
    success: true,
    action: 'generate_report',
    message: 'Report generation started',
    data,
  });
}
