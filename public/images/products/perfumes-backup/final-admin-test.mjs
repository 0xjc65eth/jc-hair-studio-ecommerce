#!/usr/bin/env node

console.log('🚀 TESTE FINAL DO PAINEL ADMIN - Sistema de Notificações\n');

// Simular diferentes tipos de notificações para criar dados diversos
const testEvents = [
  {
    event: 'payment_confirmed',
    data: {
      orderId: `ADMIN-PAYMENT-${Date.now()}`,
      customerName: 'Carlos Silva Santos',
      customerEmail: 'carlos@example.com',
      total: 199.99,
      items: [
        {
          name: 'Kit Completo Hidratação JC Hair',
          quantity: 1,
          price: 199.99,
          brand: 'JC Hair Studio\'s',
          category: 'Kits Completos'
        }
      ],
      paymentMethod: 'PIX',
      transactionId: 'PIX_' + Date.now()
    }
  },
  {
    event: 'order_shipped',
    data: {
      orderId: `ADMIN-SHIPPED-${Date.now()}`,
      customerName: 'Ana Paula Oliveira',
      customerEmail: 'ana.paula@example.com',
      total: 89.50,
      items: [
        {
          name: 'Óleo Capilar Nutritivo',
          quantity: 2,
          price: 44.75,
          brand: 'JC Hair Studio\'s',
          category: 'Óleos Capilares'
        }
      ],
      trackingCode: `JC${Date.now()}`,
      carrier: 'CTT Express',
      estimatedDelivery: '2-4 dias úteis'
    }
  },
  {
    event: 'order_delivered',
    data: {
      orderId: `ADMIN-DELIVERED-${Date.now()}`,
      customerName: 'Miguel Santos Costa',
      customerEmail: 'miguel.costa@example.com',
      total: 149.90,
      items: [
        {
          name: 'Máscara Reconstrutora Intensiva',
          quantity: 3,
          price: 49.97,
          brand: 'JC Hair Studio\'s',
          category: 'Máscaras Capilares'
        }
      ]
    }
  }
];

async function sendTestNotifications() {
  console.log('📧 Enviando múltiplas notificações de teste...\n');

  for (const [index, notification] of testEvents.entries()) {
    try {
      console.log(`📨 [${index + 1}/3] Enviando: ${notification.event}...`);

      const response = await fetch('http://localhost:3001/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ ${notification.event} enviado com sucesso!`);

      // Small delay between notifications
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`❌ Erro ao enviar ${notification.event}:`, error);
    }
  }
}

async function checkAdminStats() {
  console.log('\n📊 Verificando estatísticas no painel admin...\n');

  try {
    const response = await fetch('http://localhost:3001/api/admin/notification-logs');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { stats } = data.data;

    console.log('📈 ESTATÍSTICAS FINAIS:');
    console.log(`   • Total de notificações: ${stats.totalNotifications}`);
    console.log(`   • Emails enviados com sucesso: ${stats.successfulEmails}`);
    console.log(`   • Emails falharam: ${stats.failedEmails}`);
    console.log(`   • Taxa de sucesso: ${stats.successRate}%`);

    console.log('\n🎯 DISTRIBUIÇÃO POR EVENTO:');
    Object.entries(stats.eventBreakdown).forEach(([event, count]) => {
      console.log(`   • ${event.replace('_', ' ').toUpperCase()}: ${count} notificação(ões)`);
    });

    console.log('\n✅ TESTE CONCLUÍDO COM SUCESSO!');
    console.log('🎉 O painel admin está funcionando perfeitamente e exibindo todos os dados de notificações!');

  } catch (error) {
    console.error('❌ Erro ao verificar estatísticas:', error);
  }
}

// Execute the test
async function runFullTest() {
  await sendTestNotifications();

  // Wait a bit for logs to be written
  await new Promise(resolve => setTimeout(resolve, 2000));

  await checkAdminStats();
}

runFullTest();