import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateShippedEmail } from '@/lib/utils/email';

export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      trackingCode,
      carrier,
      customerEmail,
      customerName,
      shippingAddress,
      items
    } = await request.json();

    if (!orderId || !trackingCode || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId, trackingCode, customerEmail' },
        { status: 400 }
      );
    }

    // Create shipping data
    const shippingData = {
      orderId,
      trackingCode,
      carrier: carrier || 'CTT Express',
      customerEmail,
      customerName: customerName || 'Cliente',
      shippingAddress: shippingAddress || '',
      estimatedDelivery: calculateEstimatedDelivery(carrier),
      trackingUrl: generateTrackingUrl(trackingCode, carrier),
      shippedAt: new Date().toISOString(),
      items: items || []
    };

    // Send shipping email to customer
    const emailData = generateShippedEmail(shippingData);
    await sendEmail(emailData);

    // Send notification to admin
    await sendAdminShippingNotification(shippingData);

    console.log('📦 Shipping notification sent for order:', orderId);

    return NextResponse.json({
      success: true,
      message: 'Shipping notification sent successfully',
      trackingCode,
      trackingUrl: shippingData.trackingUrl
    });

  } catch (error) {
    console.error('Error sending shipping notification:', error);
    return NextResponse.json(
      { error: 'Failed to send shipping notification' },
      { status: 500 }
    );
  }
}

function calculateEstimatedDelivery(carrier?: string): string {
  const businessDays = carrier === 'CTT Express' ? 2 : 3;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + businessDays);

  return `${businessDays}-${businessDays + 1} dias úteis (até ${deliveryDate.toLocaleDateString('pt-PT')})`;
}

function generateTrackingUrl(trackingCode: string, carrier?: string): string {
  switch (carrier) {
    case 'CTT Express':
      return `https://www.ctt.pt/feapl_2/app/open/cttexpresso/objectSearch/objectSearch.jspx?objects=${trackingCode}`;
    case 'DPD':
      return `https://www.dpd.com/pt_en/mydpd/my-parcels/track?parcelNumber=${trackingCode}`;
    case 'UPS':
      return `https://www.ups.com/track?tracknum=${trackingCode}`;
    case 'DHL':
      return `https://www.dhl.com/pt-pt/home/tracking.html?tracking-id=${trackingCode}`;
    default:
      return `https://www.ctt.pt/feapl_2/app/open/cttexpresso/objectSearch/objectSearch.jspx?objects=${trackingCode}`;
  }
}

async function sendAdminShippingNotification(shippingData: any) {
  await sendEmail({
    to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.com',
    subject: `📦 Pedido Enviado - #${shippingData.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196f3;">📦 Pedido Enviado com Sucesso!</h2>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📋 Detalhes do Envio</h3>
          <p><strong>Pedido:</strong> #${shippingData.orderId}</p>
          <p><strong>Código de Rastreamento:</strong> ${shippingData.trackingCode}</p>
          <p><strong>Transportadora:</strong> ${shippingData.carrier}</p>
          <p><strong>Prazo Estimado:</strong> ${shippingData.estimatedDelivery}</p>
          <p><strong>Data de Envio:</strong> ${new Date(shippingData.shippedAt).toLocaleString('pt-PT')}</p>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>👤 Cliente</h3>
          <p><strong>Nome:</strong> ${shippingData.customerName}</p>
          <p><strong>Email:</strong> ${shippingData.customerEmail}</p>
          ${shippingData.shippingAddress ? `<p><strong>Endereço:</strong><br>${shippingData.shippingAddress.replace(/\n/g, '<br>')}</p>` : ''}
        </div>

        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>🔗 Rastreamento</h3>
          <p><strong>URL de Rastreamento:</strong></p>
          <a href="${shippingData.trackingUrl}"
             style="background: #ff9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Rastrear Pedido
          </a>
        </div>

        <hr style="margin: 30px 0;">
        <p style="text-align: center; color: #666;">
          <strong>JC Hair Studio's 62</strong><br>
          Sistema de E-commerce Automatizado
        </p>
      </div>
    `,
    sandbox: !process.env.SENDGRID_API_KEY
  });
}