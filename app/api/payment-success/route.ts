import { NextRequest, NextResponse } from 'next/server';
import { sendSaleNotification } from '@/app/api/admin/notifications/route';
import { sendContactEmail } from '@/lib/utils/sendgrid';

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId, customerInfo, items, amount } = await request.json();

    console.log('🎉 Payment confirmed:', paymentIntentId);

    // Prepare order data for notification
    const orderData = {
      orderId: paymentIntentId,
      paymentIntentId,
      customerName: customerInfo?.name || 'Cliente',
      customerEmail: customerInfo?.email || 'email não informado',
      total: amount || 0,
      currency: 'EUR',
      itemsCount: items?.length || 1,
      status: 'paid',
      paymentMethod: 'Cartão de Crédito',
      createdAt: new Date().toISOString(),
      items: items || []
    };

    // Send notification email to admin
    try {
      await sendSaleNotification(orderData);
      console.log('✅ Sale notification sent to admin');
    } catch (error) {
      console.error('❌ Failed to send sale notification:', error);
    }

    // Send confirmation email to customer
    try {
      if (customerInfo?.email && customerInfo.email !== 'email não informado') {
        const customerEmailData = {
          name: customerInfo.name || 'Cliente',
          email: customerInfo.email,
          phone: '',
          subject: `✅ Pedido Confirmado #${paymentIntentId.slice(-8)} - JC Hair Studio's 62`,
          message: `
🎉 Olá ${customerInfo.name || 'Cliente'}!

Seu pedido foi confirmado com sucesso!

📋 DETALHES DO SEU PEDIDO:
• Número: ${paymentIntentId.slice(-8)}
• Valor: €${amount.toFixed(2)}
• Data: ${new Date().toLocaleString('pt-BR')}
• Status: ✅ PAGO

📦 PRÓXIMOS PASSOS:
1. Processamento do pagamento (concluído)
2. Separação dos produtos (1-2 dias úteis)
3. Envio com código de rastreamento
4. Entrega no endereço cadastrado

📱 ACOMPANHE SEU PEDIDO:
WhatsApp Portugal: +351 928375226
WhatsApp Bélgica: +32 497484720

Obrigado pela preferência!
JC Hair Studio's 62 - Tradição Familiar há mais de 40 anos
          `,
          formType: 'order_confirmation' as const
        };

        await sendContactEmail(customerEmailData);
        console.log('✅ Customer confirmation email sent to:', customerInfo.email);
      }
    } catch (error) {
      console.error('❌ Failed to send customer confirmation email:', error);
    }

    // Update order status in admin dashboard
    try {
      await fetch(`${request.nextUrl.origin}/api/admin/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orderData, status: 'paid' })
      });
    } catch (error) {
      console.warn('⚠️ Could not update order in dashboard:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment processed and notifications sent'
    });

  } catch (error) {
    console.error('❌ Error processing payment success:', error);

    return NextResponse.json({
      success: false,
      error: 'Error processing payment confirmation'
    }, { status: 500 });
  }
}