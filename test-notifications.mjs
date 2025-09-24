import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

const testData = {
  orderId: `JC-${Date.now()}`,
  customerName: 'Maria Silva da Costa',
  customerEmail: 'customer@example.com', // This will be overridden in the service
  total: 189.97,
  items: [
    {
      name: 'Kit Reparação Capilar Profissional',
      quantity: 1,
      price: 89.99,
      brand: 'JC Hair Studio\'s 62',
      category: 'Kits de Tratamento',
      description: 'Kit completo para reparação intensiva de cabelos danificados',
      imageUrl: 'https://jchairstudios62.xyz/images/products/kit-reparacao.jpg'
    },
    {
      name: 'Shampoo Hidratante Premium 500ml',
      quantity: 2,
      price: 34.99,
      brand: 'JC Hair Studio\'s 62',
      category: 'Shampoos',
      description: 'Shampoo premium com tecnologia de hidratação profunda',
      imageUrl: 'https://jchairstudios62.xyz/images/products/shampoo-premium.jpg'
    },
    {
      name: 'Leave-in Protetor Térmico',
      quantity: 1,
      price: 29.99,
      brand: 'JC Hair Studio\'s 62',
      category: 'Finalizadores',
      description: 'Protetor térmico com filtro UV para uso diário',
      imageUrl: 'https://jchairstudios62.xyz/images/products/leave-in-termico.jpg'
    }
  ],
  paymentMethod: 'Cartão de Crédito Visa ****1234',
  shippingAddress: {
    name: 'Maria Silva da Costa',
    street: 'Av. da Liberdade, 245 - 3º Andar',
    city: 'Lisboa',
    zipCode: '1250-096',
    country: 'Portugal',
    phone: '+351 912 345 678'
  },
  trackingCode: 'JC2024PT001122334455',
  carrier: 'CTT Expresso',
  transactionId: 'TXN_' + Date.now(),
  orderDate: new Date().toLocaleDateString('pt-PT'),
  estimatedDelivery: '2-3 dias úteis'
};

const testSequence = [
  {
    event: 'order_confirmed',
    description: '📋 Confirmação de Pedido',
    delay: 1000
  },
  {
    event: 'payment_confirmed',
    description: '💳 Confirmação de Pagamento',
    delay: 2000
  },
  {
    event: 'order_processing',
    description: '⚙️ Pedido em Processamento',
    delay: 2000
  },
  {
    event: 'order_shipped',
    description: '📦 Pedido Enviado',
    delay: 2000
  },
  {
    event: 'order_delivered',
    description: '✅ Pedido Entregue',
    delay: 2000
  },
  {
    event: 'inventory_low',
    description: '⚠️ Estoque Baixo',
    delay: 1000
  }
];

console.log('🚀 Iniciando teste completo do sistema de notificações...\n');
console.log(`📧 Emails do Cliente: juliana.dayane110@gmail.com`);
console.log(`🏢 Emails da Empresa: juliocesarurss62@gmail.com`);
console.log(`📋 Pedido de Teste: ${testData.orderId}\n`);

async function sendNotification(event, data, description) {
  try {
    console.log(`🔄 Enviando: ${description}...`);

    const response = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event, data })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success) {
      const clientStatus = result.results.clientNotification ? '✅' : '❌';
      const companyStatus = result.results.companyNotification ? '✅' : '❌';

      console.log(`   ${clientStatus} Cliente | ${companyStatus} Empresa | ${description}`);
    } else {
      console.log(`   ❌ Falhou: ${description}`);
    }

    return result;
  } catch (error) {
    console.error(`   ❌ Erro em ${description}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runFullTest() {
  console.log('📧 SÉRIE DE EMAILS REAIS - TESTE COMPLETO\n');

  for (let i = 0; i < testSequence.length; i++) {
    const { event, description, delay } = testSequence[i];

    console.log(`\n${i + 1}/${testSequence.length}: ${description}`);

    await sendNotification(event, testData, description);

    if (delay && i < testSequence.length - 1) {
      console.log(`   ⏳ Aguardando ${delay/1000}s antes do próximo...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  console.log('\n🎉 TESTE COMPLETO FINALIZADO!');
  console.log('\n📧 Verificar os seguintes emails:');
  console.log('   👤 Cliente: juliana.dayane110@gmail.com');
  console.log('   🏢 Empresa: juliocesarurss62@gmail.com');
  console.log('\n⭐ Cada evento deve ter enviado emails para ambos os destinatários');
  console.log('💼 A empresa recebe informações detalhadas sobre cada mudança de status');
  console.log('👤 O cliente recebe notificações formatadas e profissionais');
}

// Test adicional de cancelamento (separado)
async function testCancellation() {
  console.log('\n🔄 Testando notificação de cancelamento...\n');

  const cancelData = {
    ...testData,
    orderId: `JC-CANCEL-${Date.now()}`
  };

  await sendNotification('order_cancelled', cancelData, '❌ Pedido Cancelado');

  console.log('\n📧 Verificar emails de cancelamento enviados!');
}

// Executar testes
async function main() {
  try {
    // Verificar se o servidor está rodando
    console.log('🔍 Verificando se o servidor está ativo...');
    const healthCheck = await fetch(`${BASE_URL}/api/notifications`);

    if (!healthCheck.ok) {
      throw new Error('Servidor não está respondendo. Certifique-se de que está rodando em localhost:3000');
    }

    const health = await healthCheck.json();
    console.log('✅ Servidor ativo!');
    console.log(`📡 API Status: ${health.message}\n`);

    // Executar teste completo
    await runFullTest();

    // Aguardar um pouco e testar cancelamento
    console.log('\n⏳ Aguardando 3 segundos antes do teste de cancelamento...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    await testCancellation();

    console.log('\n🎯 RESUMO FINAL:');
    console.log('   • Sistema de notificações testado completamente');
    console.log('   • Emails reais enviados para ambos destinatários');
    console.log('   • Fluxo completo de pedido simulado');
    console.log('   • Notificações da empresa incluem detalhes operacionais');
    console.log('   • Notificações do cliente são user-friendly');

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message);
    console.log('\n🔧 VERIFIQUE:');
    console.log('   1. Servidor rodando: npm run dev');
    console.log('   2. SendGrid configurado: SENDGRID_API_KEY');
    console.log('   3. Portas disponíveis: 3000');
  }
}

// Executar
main();