#!/usr/bin/env node

console.log('🧪 TESTE ADMIN PANEL - Populando logs persistentes...\n');

// Test notification to populate persistent logs
const testNotificationData = {
  event: 'order_confirmed',
  data: {
    orderId: `ADMIN-TEST-${Date.now()}`,
    customerName: 'Juliana Dayane (Teste Admin)',
    customerEmail: 'juliana.dayane110@gmail.com',
    total: 89.99,
    items: [
      {
        name: 'Shampoo Hidratante JC Hair Studio\'s',
        quantity: 1,
        price: 34.99,
        brand: 'JC Hair Studio\'s',
        category: 'Cuidados Capilares',
        imageUrl: '/images/products/shampoo-hidratante.jpg'
      },
      {
        name: 'Condicionador Reparador Premium',
        quantity: 1,
        price: 29.99,
        brand: 'JC Hair Studio\'s',
        category: 'Cuidados Capilares',
        imageUrl: '/images/products/condicionador-premium.jpg'
      },
      {
        name: 'Máscara Capilar Nutritiva',
        quantity: 1,
        price: 25.01,
        brand: 'JC Hair Studio\'s',
        category: 'Tratamentos',
        imageUrl: '/images/products/mascara-nutritiva.jpg'
      }
    ],
    paymentMethod: 'Cartão de Crédito',
    shippingAddress: {
      name: 'Juliana Dayane',
      street: 'Rua das Flores, 123',
      city: 'Lisboa',
      zipCode: '1000-001',
      country: 'Portugal',
      phone: '+351 912345678'
    },
    orderDate: new Date().toLocaleDateString('pt-PT'),
    estimatedDelivery: '3-5 dias úteis'
  }
};

async function testNotificationSystem() {
  try {
    console.log('📧 Enviando notificação de teste para popular logs...');

    const response = await fetch('http://localhost:3000/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testNotificationData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Notificação enviada:', result);

    // Wait a moment for logs to be written
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if logs were created
    console.log('\n📊 Verificando logs no endpoint admin...');
    const logsResponse = await fetch('http://localhost:3000/api/admin/notification-logs');

    if (!logsResponse.ok) {
      throw new Error(`HTTP error! status: ${logsResponse.status}`);
    }

    const logsData = await logsResponse.json();
    console.log('📋 Logs encontrados:', JSON.stringify(logsData, null, 2));

    if (logsData.success && logsData.data && logsData.data.logs && logsData.data.logs.length > 0) {
      console.log('\n✅ SUCESSO! Logs persistentes foram criados e estão disponíveis no admin panel!');
      console.log(`📊 Total de logs: ${logsData.data.logs.length}`);
      console.log(`📈 Estatísticas:`, logsData.data.stats);
    } else {
      console.log('\n❌ Nenhum log foi encontrado no endpoint admin');
    }

  } catch (error) {
    console.error('❌ Erro ao testar sistema:', error);
  }
}

// Run the test
testNotificationSystem();