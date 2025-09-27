import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, generateOrderConfirmationEmail } from '@/lib/utils/email';

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, customerInfo, amount, currency, items } = await request.json();

    console.log('🔔 Processing immediate payment notification:', paymentIntentId);

    // Create order data
    const orderData = {
      orderId: paymentIntentId,
      paymentIntentId,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      total: amount,
      currency: currency?.toUpperCase() || 'EUR',
      itemsCount: items?.length || 1,
      status: 'paid',
      paymentMethod: 'Cartão de Crédito',
      createdAt: new Date().toISOString(),
      shippingType: determineShippingType(amount),
      estimatedDelivery: calculateDeliveryTime(amount)
    };

    // Send notifications in parallel with timeout
    const notifications = [
      Promise.race([
        sendCustomerConfirmation(orderData),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Customer email timeout')), 8000))
      ]),
      Promise.race([
        sendAdminNotification(orderData),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Admin email timeout')), 8000))
      ]),
      Promise.race([
        saveOrderToAdmin(orderData),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Save order timeout')), 5000))
      ])
    ];

    const results = await Promise.allSettled(notifications);

    const summary = {
      customerEmail: results[0].status === 'fulfilled' ? 'sent' : 'failed',
      adminEmail: results[1].status === 'fulfilled' ? 'sent' : 'failed',
      orderSaved: results[2].status === 'fulfilled' ? 'saved' : 'failed'
    };

    console.log('✅ Notifications processed for payment:', paymentIntentId, summary);

    return NextResponse.json({
      success: true,
      notifications: summary,
      paymentIntentId
    });
  } catch (error) {
    console.error('❌ Error processing payment success notification:', error);
    return NextResponse.json(
      { error: 'Failed to process notification' },
      { status: 500 }
    );
  }
}

async function sendCustomerConfirmation(orderData: any) {
  try {
    const emailData = generateOrderConfirmationEmail({
      orderId: orderData.orderId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      total: orderData.total,
      items: [],
      paymentMethod: orderData.paymentMethod,
      shippingType: orderData.shippingType,
      estimatedDelivery: orderData.estimatedDelivery
    });

    await sendEmail(emailData);
    console.log('✅ Customer confirmation email sent to:', orderData.customerEmail);
  } catch (error) {
    console.error('❌ Failed to send customer confirmation:', error);
  }
}

async function sendAdminNotification(orderData: any) {
  try {
    await sendEmail({
      to: process.env.SUPPORT_EMAIL || 'suporte@jchairstudios62.xyz',
      subject: `🎉 Nova Venda - Pedido #${orderData.orderId.substring(0, 8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4caf50;">🎉 Nova Venda Realizada!</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📋 Detalhes do Pedido</h3>
            <p><strong>Pedido ID:</strong> #${orderData.orderId.substring(0, 8)}</p>
            <p><strong>Valor Total:</strong> €${orderData.total.toFixed(2)} ${orderData.currency}</p>
            <p><strong>Quantidade de Itens:</strong> ${orderData.itemsCount}</p>
            <p><strong>Data:</strong> ${new Date(orderData.createdAt).toLocaleString('pt-PT')}</p>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>👤 Dados do Cliente</h3>
            <p><strong>Nome:</strong> ${orderData.customerName}</p>
            <p><strong>Email:</strong> ${orderData.customerEmail}</p>
          </div>

          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📦 Informações de Envio</h3>
            <p><strong>Tipo de Frete:</strong> ${orderData.shippingType}</p>
            <p><strong>Prazo Estimado:</strong> ${orderData.estimatedDelivery}</p>
          </div>

          <div style="background: #f1f8e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>💳 Pagamento</h3>
            <p><strong>Método:</strong> ${orderData.paymentMethod}</p>
            <p><strong>Status:</strong> ✅ Aprovado</p>
            <p><strong>Stripe ID:</strong> ${orderData.paymentIntentId}</p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: #ffebee; border-radius: 8px;">
            <h3>📋 Próximos Passos</h3>
            <ol style="line-height: 1.6;">
              <li>✅ <strong>Pagamento confirmado</strong></li>
              <li>📦 <strong>Preparar produtos para envio</strong></li>
              <li>🏃‍♂️ <strong>Processar envio (${orderData.shippingType})</strong></li>
              <li>📱 <strong>Enviar código de rastreamento ao cliente</strong></li>
            </ol>
          </div>

          <hr style="margin: 30px 0;">
          <p style="text-align: center; color: #666;">
            <strong>JC Hair Studio's 62</strong><br>
            Sistema de E-commerce Automatizado
          </p>
        </div>
      `,
      sandbox: false
    });
    console.log('✅ Admin notification email sent');
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error);
  }
}

async function saveOrderToAdmin(orderData: any) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL ||
                   process.env.NEXT_PUBLIC_SITE_URL ||
                   'https://jchairstudios62.xyz';

    // Use simplified orders API for production
    const response = await fetch(`${baseUrl}/api/admin/orders-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      console.log('✅ Order saved to admin dashboard');
    } else {
      console.error('❌ Failed to save to admin dashboard:', response.status);
    }
  } catch (error) {
    console.error('❌ Error saving to admin dashboard:', error);
  }
}

function determineShippingType(amount: number): string {
  if (amount >= 50) {
    return '🚚 Frete Grátis (Standard)';
  } else if (amount >= 30) {
    return '📦 Frete Standard (€4.99)';
  } else {
    return '📦 Frete Standard (€7.99)';
  }
}

function calculateDeliveryTime(amount: number): string {
  if (amount >= 100) {
    return '1-2 dias úteis (Express)';
  } else if (amount >= 50) {
    return '2-3 dias úteis (Standard)';
  } else {
    return '3-5 dias úteis (Standard)';
  }
}