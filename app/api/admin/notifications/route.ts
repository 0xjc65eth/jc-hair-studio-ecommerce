import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/utils/sendgrid';

// Store notification settings (in production, use database)
let notificationSettings = {
  adminEmail: process.env.ADMIN_EMAIL || 'admin@jchairstudios62.xyz',
  emailNotifications: true,
  telegramNotifications: false,
  discordWebhook: '',
};

// Function to send sale notification email
export async function sendSaleNotification(orderData: any) {
  if (!notificationSettings.emailNotifications) return;

  try {
    const emailData = {
      name: 'JC Hair Studio Admin',
      email: notificationSettings.adminEmail,
      phone: '',
      subject: `🎉 Nova Venda - Pedido ${orderData.orderId}`,
      message: `
Nova venda realizada em jchairstudios62.xyz!

📋 DETALHES DO PEDIDO:
• ID: ${orderData.orderId}
• Cliente: ${orderData.customerName}
• Email: ${orderData.customerEmail}
• Valor: €${orderData.total.toFixed(2)}
• Status: ${orderData.status}
• Data: ${new Date(orderData.createdAt).toLocaleString('pt-BR')}

💳 PAGAMENTO:
• Método: ${orderData.paymentMethod}
• Moeda: ${orderData.currency}

📦 PRÓXIMOS PASSOS:
1. Prepare os produtos para envio
2. Atualize o status no dashboard admin
3. Envie o código de rastreamento ao cliente

🌐 Acesse o dashboard: https://jchairstudios62.xyz/admin

---
Este é um email automático do sistema JC Hair Studio.
      `,
      formType: 'order_inquiry' as const
    };

    const success = await sendContactEmail(emailData);

    if (success) {
      console.log('✅ Sale notification email sent successfully');
    } else {
      console.error('❌ Failed to send sale notification email');
    }
  } catch (error) {
    console.error('❌ Error sending sale notification:', error);
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    settings: notificationSettings
  });
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'updateSettings':
        notificationSettings = { ...notificationSettings, ...data };

        return NextResponse.json({
          success: true,
          message: 'Configurações atualizadas',
          settings: notificationSettings
        });

      case 'testNotification':
        // Send test notification
        const testOrder = {
          orderId: 'TEST_' + Date.now(),
          customerName: 'Cliente de Teste',
          customerEmail: 'teste@exemplo.com',
          total: 25.99,
          status: 'paid',
          currency: 'EUR',
          paymentMethod: 'Cartão de Teste',
          createdAt: new Date().toISOString()
        };

        await sendSaleNotification(testOrder);

        return NextResponse.json({
          success: true,
          message: 'Email de teste enviado!'
        });

      case 'sendSaleNotification':
        await sendSaleNotification(data);

        return NextResponse.json({
          success: true,
          message: 'Notificação de venda enviada'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Ação não reconhecida'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in notifications API:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}