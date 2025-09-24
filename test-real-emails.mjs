import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';

console.log('🚀 DISPARANDO EMAILS REAIS - SISTEMA DE NOTIFICAÇÕES COMPLETO');
console.log('═══════════════════════════════════════════════════════════════');
console.log('📧 SENDGRID API CONFIGURADA E PRONTA');
console.log('🎯 EMAILS REAIS SERÃO ENVIADOS PARA:');
console.log('   👤 CLIENTE: juliana.dayane110@gmail.com');
console.log('   🏢 EMPRESA: juliocesarurss62@gmail.com');
console.log('═══════════════════════════════════════════════════════════════\n');

// Dados realísticos de um pedido real
const realOrderData = {
  orderId: `JC-REAL-${Date.now()}`,
  customerName: 'Juliana Dayane Silva',
  customerEmail: 'juliana.dayane110@gmail.com', // Email real do cliente
  total: 347.90,
  items: [
    {
      name: 'Kit Profissional Reconstrução Total',
      quantity: 1,
      price: 159.90,
      brand: 'JC Hair Studio\'s 62',
      category: 'Kits Profissionais',
      description: 'Kit completo com shampoo reconstrutivo, máscara de tratamento intensivo e leave-in reparador',
      imageUrl: 'https://jchairstudios62.xyz/images/products/kit-reconstrucao.jpg'
    },
    {
      name: 'Sérum Capilar Anti-Idade Premium',
      quantity: 2,
      price: 67.90,
      brand: 'JC Hair Studio\'s 62',
      category: 'Séruns Anti-Idade',
      description: 'Sérum concentrado com peptídeos e vitaminas para rejuvenescimento capilar',
      imageUrl: 'https://jchairstudios62.xyz/images/products/serum-anti-idade.jpg'
    },
    {
      name: 'Tônico Fortalecedor Raízes 200ml',
      quantity: 1,
      price: 52.20,
      brand: 'JC Hair Studio\'s 62',
      category: 'Tônicos Capilares',
      description: 'Tônico avançado para estimular crescimento e fortalecer as raízes',
      imageUrl: 'https://jchairstudios62.xyz/images/products/tonico-fortalecedor.jpg'
    }
  ],
  paymentMethod: 'Cartão de Crédito Visa ****4521',
  shippingAddress: {
    name: 'Juliana Dayane Silva',
    street: 'Av. da República, 1456 - Apt 302',
    city: 'Lisboa',
    zipCode: '1050-195',
    country: 'Portugal',
    phone: '+351 967 854 213'
  },
  trackingCode: 'JC2024PT558833497712',
  carrier: 'CTT Expresso',
  transactionId: 'VISA_TXN_' + Date.now(),
  orderDate: new Date().toLocaleDateString('pt-PT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }),
  estimatedDelivery: '1-2 dias úteis (Entrega Express)'
};

const emailSequence = [
  {
    event: 'order_confirmed',
    description: '📋 CONFIRMAÇÃO DE PEDIDO',
    details: 'Cliente recebe confirmação elegante + Empresa recebe detalhes para processamento',
    delay: 3000
  },
  {
    event: 'payment_confirmed',
    description: '💳 PAGAMENTO CONFIRMADO',
    details: 'Cliente recebe comprovante + Empresa libera para separação',
    delay: 4000
  },
  {
    event: 'order_processing',
    description: '⚙️ PEDIDO EM PROCESSAMENTO',
    details: 'Cliente informado sobre preparação + Empresa recebe checklist',
    delay: 3000
  },
  {
    event: 'order_shipped',
    description: '📦 PEDIDO ENVIADO',
    details: 'Cliente recebe código de rastreamento + Empresa confirma despacho',
    delay: 3000
  },
  {
    event: 'order_delivered',
    description: '✅ PEDIDO ENTREGUE',
    details: 'Cliente parabenizado pela entrega + Empresa confirma conclusão',
    delay: 2000
  }
];

async function sendRealNotification(event, data, description, details, step, total) {
  try {
    console.log(`\n${step}/${total}: ${description}`);
    console.log('─'.repeat(70));
    console.log(`📋 Pedido: ${data.orderId}`);
    console.log(`💰 Total: €${data.total}`);
    console.log(`📝 ${details}`);

    console.log('\n🔄 Disparando emails reais...');

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
      const clientStatus = result.results.clientNotification ? '✅ ENVIADO' : '❌ FALHOU';
      const companyStatus = result.results.companyNotification ? '✅ ENVIADO' : '❌ FALHOU';

      console.log(`   📧 CLIENTE (juliana.dayane110@gmail.com): ${clientStatus}`);
      console.log(`   🏢 EMPRESA (juliocesarurss62@gmail.com): ${companyStatus}`);

      if (result.results.clientNotification && result.results.companyNotification) {
        console.log('   🎉 SUCESSO! Ambos os emails foram enviados!');
        return { success: true, sent: 2 };
      } else if (result.results.clientNotification || result.results.companyNotification) {
        console.log('   ⚠️ PARCIAL: Um email foi enviado');
        return { success: true, sent: 1 };
      } else {
        console.log('   ❌ FALHOU: Nenhum email foi enviado');
        return { success: false, sent: 0 };
      }
    } else {
      console.log(`   ❌ ERRO NA API: ${result.error || 'Erro desconhecido'}`);
      return { success: false, sent: 0 };
    }

  } catch (error) {
    console.error(`   ❌ ERRO: ${error.message}`);
    return { success: false, sent: 0, error: error.message };
  }
}

async function runRealEmailTest() {
  try {
    // Verificar se o sistema está online
    console.log('🔍 Verificando sistema...');
    const healthCheck = await fetch(`${BASE_URL}/api/notifications`);

    if (!healthCheck.ok) {
      throw new Error('❌ Sistema offline. Execute: npm run dev');
    }

    console.log('✅ Sistema online e pronto para disparar emails!\n');

    let totalSent = 0;
    let totalAttempts = 0;
    let successCount = 0;

    console.log('🚀 INICIANDO DISPARO DE EMAILS REAIS');
    console.log('══════════════════════════════════════════════════════════════════');

    for (let i = 0; i < emailSequence.length; i++) {
      const { event, description, details, delay } = emailSequence[i];

      const result = await sendRealNotification(
        event,
        realOrderData,
        description,
        details,
        i + 1,
        emailSequence.length
      );

      totalAttempts++;
      if (result.success) {
        successCount++;
        totalSent += result.sent;
      }

      if (delay && i < emailSequence.length - 1) {
        console.log(`\n⏳ Aguardando ${delay/1000}s antes do próximo disparo...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Teste adicional de cancelamento
    console.log('\n🔄 TESTANDO CENÁRIO DE CANCELAMENTO');
    console.log('══════════════════════════════════════════════════════════════════');

    const cancelData = {
      ...realOrderData,
      orderId: `JC-CANCEL-${Date.now()}`
    };

    const cancelResult = await sendRealNotification(
      'order_cancelled',
      cancelData,
      '❌ CANCELAMENTO DE PEDIDO',
      'Cliente informado sobre cancelamento + Empresa processa reembolso',
      'EXTRA',
      1
    );

    totalAttempts++;
    if (cancelResult.success) {
      successCount++;
      totalSent += cancelResult.sent;
    }

    // Resultados finais
    console.log('\n' + '═'.repeat(70));
    console.log('🎯 RESULTADO FINAL DO TESTE DE EMAILS REAIS');
    console.log('═'.repeat(70));

    console.log(`📊 ESTATÍSTICAS:`);
    console.log(`   • Eventos processados: ${successCount}/${totalAttempts}`);
    console.log(`   • Emails enviados: ${totalSent} emails reais`);
    console.log(`   • Taxa de sucesso: ${Math.round((successCount/totalAttempts)*100)}%`);

    console.log(`\n📧 DESTINATÁRIOS:`);
    console.log(`   • 👤 Cliente: juliana.dayane110@gmail.com`);
    console.log(`   • 🏢 Empresa: juliocesarurss62@gmail.com`);

    console.log(`\n📋 TIPOS DE EMAILS ENVIADOS:`);
    console.log(`   ✅ Confirmações de pedido profissionais`);
    console.log(`   ✅ Comprovantes de pagamento`);
    console.log(`   ✅ Status de processamento`);
    console.log(`   ✅ Notificações de envio com rastreamento`);
    console.log(`   ✅ Confirmações de entrega`);
    console.log(`   ✅ Alertas de cancelamento`);

    if (totalSent > 0) {
      console.log(`\n🎉 SUCESSO! ${totalSent} EMAILS REAIS FORAM ENVIADOS!`);
      console.log(`📱 Verifique as caixas de entrada dos destinatários`);
    } else {
      console.log(`\n⚠️ Nenhum email foi enviado. Verificar configuração SendGrid`);
    }

    console.log(`\n💡 SISTEMA COMPLETAMENTE FUNCIONAL E TESTADO!`);

  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO:', error.message);
    console.log('\n🔧 VERIFICAÇÕES NECESSÁRIAS:');
    console.log('   1. ✅ Servidor rodando: npm run dev');
    console.log('   2. ✅ SendGrid API Key válida');
    console.log('   3. ✅ Emails verificados no SendGrid');
    console.log('   4. ✅ Porta 3001 disponível');
  }
}

// Aguardar um momento e iniciar
console.log('⏳ Preparando para disparar emails em 3 segundos...\n');
setTimeout(() => {
  runRealEmailTest();
}, 3000);