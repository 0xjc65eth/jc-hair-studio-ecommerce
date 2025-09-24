#!/usr/bin/env node

console.log('🔄 TESTE DOS MODOS: TESTE vs PRODUÇÃO\n');

const testNotification = {
  event: 'order_confirmed',
  data: {
    orderId: `MODE-TEST-${Date.now()}`,
    customerName: 'Cliente Real da Silva',
    customerEmail: 'cliente.real@gmail.com', // Email real do cliente
    total: 99.99,
    items: [
      {
        name: 'Produto Real de Teste',
        quantity: 1,
        price: 99.99,
        brand: 'JC Hair Studio\'s',
        category: 'Teste'
      }
    ],
    paymentMethod: 'Cartão de Crédito'
  }
};

console.log('📧 Email original do cliente:', testNotification.data.customerEmail);
console.log('🧪 Modo atual (NOTIFICATION_TEST_MODE):', process.env.NOTIFICATION_TEST_MODE || 'não definido');
console.log('');

async function testCurrentMode() {
  try {
    console.log('🚀 Enviando notificação no modo atual...');

    const response = await fetch('http://localhost:3001/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testNotification)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Resultado:', result);

    // Check the logs to see which email was actually used
    await new Promise(resolve => setTimeout(resolve, 1000));

    const logsResponse = await fetch('http://localhost:3001/api/admin/notification-logs');
    const logsData = await logsResponse.json();

    if (logsData.success && logsData.data.logs.length > 0) {
      const latestLog = logsData.data.logs[0];
      console.log('\n📊 Último log registrado:');
      console.log(`   • Email original: ${latestLog.customerEmail}`);
      console.log(`   • Email enviado para: ${latestLog.clientEmail}`);

      if (latestLog.customerEmail === latestLog.clientEmail) {
        console.log('✅ MODO PRODUÇÃO: Email foi enviado para o cliente real!');
      } else {
        console.log('🧪 MODO TESTE: Email foi redirecionado para email de teste!');
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

console.log('📋 INSTRUÇÕES PARA ALTERNAR MODOS:');
console.log('');
console.log('🧪 PARA MODO TESTE (atual):');
console.log('   • .env.local: NOTIFICATION_TEST_MODE="true"');
console.log('   • Emails vão para: juliana.dayane110@gmail.com');
console.log('');
console.log('🌟 PARA MODO PRODUÇÃO:');
console.log('   • .env.local: NOTIFICATION_TEST_MODE="false"');
console.log('   • Emails vão para o email real do cliente');
console.log('');

await testCurrentMode();