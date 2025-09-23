import { NextRequest, NextResponse } from 'next/server';
import { sendShippingNotificationEmail } from '@/app/api/admin/notifications/route';

// Helper function to get tracking URL based on carrier
function getTrackingUrl(carrier: string, trackingCode: string): string {
  const carrierUrls: { [key: string]: string } = {
    'correios': `https://www2.correios.com.br/sistemas/rastreamento/ctrl/ctrlRastreamento.cfm?codigo=${trackingCode}`,
    'jadlog': `https://www.jadlog.com.br/trackingpage?tracking=${trackingCode}`,
    'loggi': `https://www.loggi.com/rastreamento/${trackingCode}`,
    'mercado-envios': `https://envios.mercadolivre.com.br/tracking/${trackingCode}`,
  };

  const lowerCarrier = carrier.toLowerCase();
  return carrierUrls[lowerCarrier] || `https://www.google.com/search?q=rastreamento+${trackingCode}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      customerName,
      customerEmail,
      trackingCode,
      carrier,
      estimatedDelivery,
      shippingAddress,
      items
    } = body;

    // Validação dos campos obrigatórios
    if (!orderId || !customerName || !customerEmail || !trackingCode || !carrier) {
      return NextResponse.json(
        {
          error: 'Campos obrigatórios: orderId, customerName, customerEmail, trackingCode, carrier',
          required: ['orderId', 'customerName', 'customerEmail', 'trackingCode', 'carrier']
        },
        { status: 400 }
      );
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validação e formatação dos itens
    let formattedItems = [];
    if (items && Array.isArray(items)) {
      formattedItems = items.map(item => ({
        name: item.name || 'Produto',
        quantity: item.quantity || 1
      }));
    } else {
      // Se não há itens especificados, usar placeholder
      formattedItems = [{ name: 'Produtos do pedido', quantity: 1 }];
    }

    // Prepare shipping notification data
    const shippingData = {
      orderId,
      customerName,
      customerEmail,
      trackingCode,
      shippingCarrier: carrier,
      estimatedDelivery: estimatedDelivery || '5-10 dias úteis',
      shippingAddress: typeof shippingAddress === 'string' ? { street: shippingAddress } : shippingAddress,
      trackingUrl: getTrackingUrl(carrier, trackingCode),
      products: formattedItems
    };

    // Send shipping notification using new system
    await sendShippingNotificationEmail(shippingData);

    // Log for audit
    console.log(`📦 Shipping notification sent - Order: ${orderId}, Customer: ${customerEmail}, Tracking: ${trackingCode}`);

    return NextResponse.json({
      success: true,
      message: 'Notificação de despacho enviada com sucesso',
      data: {
        orderId,
        customerEmail,
        trackingCode,
        carrier,
        sentAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Erro na API de notificação de despacho:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET para listar transportadoras suportadas (opcional)
export async function GET() {
  return NextResponse.json({
    carriers: [
      { code: 'correios', name: 'Correios', trackingUrl: 'https://www2.correios.com.br/sistemas/rastreamento/' },
      { code: 'jadlog', name: 'Jadlog', trackingUrl: 'https://www.jadlog.com.br/trackingpage' },
      { code: 'loggi', name: 'Loggi', trackingUrl: 'https://www.loggi.com/rastreamento/' },
      { code: 'mercado-envios', name: 'Mercado Envios', trackingUrl: 'https://envios.mercadolivre.com.br/tracking/' },
      { code: 'outros', name: 'Outros', trackingUrl: null }
    ],
    example: {
      orderId: "12345",
      customerName: "João Silva",
      customerEmail: "joao@email.com",
      trackingCode: "BR123456789",
      carrier: "Correios",
      estimatedDelivery: "2024-01-15",
      shippingAddress: "Rua das Flores, 123 - São Paulo/SP",
      items: [
        { name: "Shampoo Loreal", quantity: 2 },
        { name: "Condicionador Wella", quantity: 1 }
      ]
    }
  });
}