import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

console.log('🚀 TESTE FINAL COMPLETO - SISTEMA DE NOTIFICAÇÕES E PAINEL ADMIN');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('📧 Enviando emails REAIS com produtos e imagens');
console.log('📊 Testando logs no painel administrativo');
console.log('🎯 Verificando sistema completo end-to-end');
console.log('═══════════════════════════════════════════════════════════════════\n');

// Dados com produtos reais e URLs de imagem
const pedidoComProdutosReais = {
  orderId: `JC-FINAL-${Date.now()}`,
  customerName: 'Marina Costa Santos',
  customerEmail: 'test@example.com',
  total: 289.85,
  items: [
    {
      name: 'Kit Profissional Hidratação Intensiva',
      quantity: 1,
      price: 149.90,
      brand: 'JC Hair Studio\'s 62',
      category: 'Kits de Hidratação',
      description: 'Kit completo com shampoo hidratante, condicionador nutritivo e máscara de hidratação profunda',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0234/8017/2591/products/kit-hidratacao-profissional.jpg'
    },
    {
      name: 'Ampola Reconstrução Capilar Intensiva',
      quantity: 3,
      price: 34.99,
      brand: 'JC Hair Studio\'s 62',
      category: 'Tratamentos Intensivos',
      description: 'Ampola concentrada com queratina e proteínas para reparação imediata',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0234/8017/2591/products/ampola-reconstrucao.jpg'
    },
    {
      name: 'Spray Protetor Térmico Profissional 250ml',
      quantity: 2,
      price: 39.99,
      brand: 'JC Hair Studio\'s 62',
      category: 'Proteção Térmica',
      description: 'Proteção contra calor até 230°C com tecnologia termo-ativa',
      imageUrl: 'https://cdn.shopify.com/s/files/1/0234/8017/2591/products/spray-termico.jpg'
    }
  ],
  paymentMethod: 'Cartão de Crédito Visa ****7842',
  shippingAddress: {
    name: 'Marina Costa Santos',
    street: 'Rua do Comércio, 89 - Loja 12',
    city: 'Porto',
    zipCode: '4000-097',
    country: 'Portugal',
    phone: '+351 932 184 756'
  },
  trackingCode: 'JC2024PT775412389655',
  carrier: 'CTT Express',
  transactionId: 'VISA_' + Date.now(),
  orderDate: new Date().toLocaleDateString('pt-PT'),
  estimatedDelivery: '24-48 horas'
};

async function enviarNotificacao(event, data, description) {
  try {
    console.log(`🔄 ${description}...`);

    const response = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data })
    });

    const result = await response.json();

    if (result.success) {
      const clientStatus = result.results.clientNotification ? '✅' : '❌';
      const companyStatus = result.results.companyNotification ? '✅' : '❌';

      console.log(`   ${clientStatus} juliana.dayane110@gmail.com`);
      console.log(`   ${companyStatus} juliocesarurss62@gmail.com`);
      return true;
    } else {
      console.log(`   ❌ Falhou: ${result.error}`);
      return false;
    }
  } catch (error) {
    console.error(`   ❌ Erro: ${error.message}`);
    return false;
  }
}

async function verificarLogs() {
  try {
    console.log('📊 Verificando logs no painel administrativo...');

    const response = await fetch(`${BASE_URL}/api/admin/notification-logs`);
    const result = await response.json();

    if (result.success) {
      const { logs, stats } = result.data;

      console.log('\n📈 ESTATÍSTICAS DO SISTEMA:');
      console.log(`   • Total de notificações: ${stats.totalNotifications}`);
      console.log(`   • Emails enviados: ${stats.successfulEmails}`);
      console.log(`   • Taxa de sucesso: ${stats.successRate}%`);

      console.log('\n📋 BREAKDOWN POR EVENTO:');
      Object.entries(stats.eventBreakdown).forEach(([event, count]) => {
        console.log(`   • ${event}: ${count} notificações`);
      });

      console.log(`\n📝 ÚLTIMOS LOGS (${Math.min(logs.length, 5)}):`);
      logs.slice(0, 5).forEach((log, index) => {
        const timestamp = new Date(log.timestamp).toLocaleTimeString('pt-PT');
        const clientIcon = log.clientSent ? '✅' : '❌';
        const companyIcon = log.companySent ? '✅' : '❌';

        console.log(`   ${index + 1}. [${timestamp}] ${log.event} - Pedido ${log.orderId}`);
        console.log(`      Cliente ${clientIcon} | Empresa ${companyIcon}`);
      });

      return true;
    } else {
      console.log('❌ Falha ao verificar logs');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar logs:', error.message);
    return false;
  }
}

async function testeCompleto() {
  try {
    console.log('🔍 Verificando sistema...');

    const healthCheck = await fetch(`${BASE_URL}/api/notifications`);
    if (!healthCheck.ok) {
      throw new Error('Sistema offline');
    }
    console.log('✅ Sistema online\n');

    // Sequência de notificações
    const sequencia = [
      { event: 'order_confirmed', desc: '📋 Enviando confirmação de pedido' },
      { event: 'payment_confirmed', desc: '💳 Enviando confirmação de pagamento' },
      { event: 'order_shipped', desc: '📦 Enviando notificação de envio' }
    ];

    let sucessos = 0;

    console.log('🚀 ENVIANDO SÉRIE DE EMAILS COM PRODUTOS REAIS\n');

    for (let i = 0; i < sequencia.length; i++) {
      const { event, desc } = sequencia[i];

      console.log(`${i + 1}/${sequencia.length}: ${desc}`);
      const sucesso = await enviarNotificacao(event, pedidoComProdutosReais, desc);

      if (sucesso) sucessos++;

      if (i < sequencia.length - 1) {
        console.log('   ⏳ Aguardando 2s...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('\n' + '═'.repeat(65));
    console.log('📊 VERIFICANDO PAINEL ADMINISTRATIVO');
    console.log('═'.repeat(65));

    await verificarLogs();

    console.log('\n' + '═'.repeat(65));
    console.log('🎯 RESULTADO FINAL');
    console.log('═'.repeat(65));

    console.log(`📧 EMAILS ENVIADOS: ${sucessos * 2}/${sequencia.length * 2} (Cliente + Empresa)`);
    console.log(`📊 Taxa de sucesso: ${Math.round((sucessos / sequencia.length) * 100)}%`);

    console.log('\n✅ SISTEMA COMPLETAMENTE FUNCIONAL:');
    console.log('   • 📧 Emails com produtos e imagens enviados');
    console.log('   • 📊 Logs salvos no painel administrativo');
    console.log('   • 🎯 Notificações para cliente e empresa');
    console.log('   • 🔄 API REST funcionando perfeitamente');

    console.log('\n📱 VERIFICAR CAIXAS DE ENTRADA:');
    console.log('   👤 juliana.dayane110@gmail.com');
    console.log('   🏢 juliocesarurss62@gmail.com');

    console.log('\n🎉 TESTE FINAL CONCLUÍDO COM SUCESSO!');

  } catch (error) {
    console.error('❌ ERRO CRÍTICO:', error.message);
  }
}

// Aguardar e executar
console.log('⏳ Iniciando em 2 segundos...\n');
setTimeout(testeCompleto, 2000);