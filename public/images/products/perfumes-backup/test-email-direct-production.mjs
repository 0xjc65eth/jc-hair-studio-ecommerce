#!/usr/bin/env node

/**
 * TESTE DIRETO DE EMAIL EM PRODUÇÃO
 * Simula uma compra real para testar emails
 */

import fetch from 'node-fetch';

const PRODUCTION_URL = 'https://jchairstudios62.xyz';

console.log('\n📧 TESTE DIRETO DE EMAIL EM PRODUÇÃO');
console.log('══════════════════════════════════════════════════════════');
console.log(`🌐 URL: ${PRODUCTION_URL}\n`);

const testDirectEmailProduction = async () => {
  try {
    console.log('💳 Simulando compra completa para teste de email...\n');

    // Dados do pedido de teste
    const orderData = {
      paymentIntentId: 'pi_test_email_' + Date.now(),
      amount: 42.99,
      currency: 'eur',
      customerInfo: {
        name: 'Teste Email Direto',
        email: 'juliocesarurss65@gmail.com',
        phone: '+351928375226',
        country: 'PT',
        address: {
          street: 'Rua do Teste Email',
          number: '999',
          city: 'Lisboa',
          state: 'Lisboa',
          zipCode: '1000-001'
        }
      },
      items: [
        {
          name: 'Mega Hair Teste Email',
          quantity: 1,
          price: 42.99
        }
      ],
      orderTotals: {
        subtotal: 42.99,
        taxAmount: 0,
        shippingCost: 0,
        finalTotal: 42.99
      },
      technicalInfo: {
        clientIp: '127.0.0.1',
        userAgent: 'Teste Email Direto Production',
        timestamp: new Date().toISOString()
      }
    };

    console.log('📤 Enviando para API payment-success...');
    console.log(`📧 Email destino: ${orderData.customerInfo.email}`);
    console.log(`💰 Valor: €${orderData.amount}`);

    const response = await fetch(`${PRODUCTION_URL}/api/payment-success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'EmailTestBot/1.0'
      },
      body: JSON.stringify(orderData)
    });

    console.log(`\n📊 Status da resposta: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ API respondeu com sucesso!');
      console.log('\n📋 RESULTADO:');
      console.log(`   Success: ${result.success}`);
      console.log(`   Payment ID: ${result.paymentIntentId}`);

      if (result.notifications) {
        console.log('\n📧 NOTIFICAÇÕES:');
        console.log(`   Email Cliente: ${result.notifications.customerEmail || 'N/A'}`);
        console.log(`   Email Admin: ${result.notifications.adminEmail || 'N/A'}`);
        console.log(`   Order Salva: ${result.notifications.orderSaved || 'N/A'}`);
      } else {
        console.log('\n⚠️ Nenhuma informação de notificações retornada');
      }

      console.log('\n🎯 PRÓXIMOS PASSOS:');
      console.log('1. Verifique sua caixa de entrada: juliocesarurss65@gmail.com');
      console.log('2. Verifique a pasta de spam/lixo eletrônico');
      console.log('3. Emails podem demorar 1-2 minutos para chegar');
      console.log('4. Verifique também o email de admin');

      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Erro na API:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Resposta: ${errorText.substring(0, 200)}...`);
      return false;
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    return false;
  }
};

// Executar teste múltiplas vezes para garantir
const runMultipleTests = async () => {
  console.log('🚀 Iniciando teste de email em produção...\n');

  let successCount = 0;
  const testCount = 2; // Testar 2 vezes

  for (let i = 1; i <= testCount; i++) {
    console.log(`\n🧪 TESTE ${i}/${testCount}`);
    console.log('─'.repeat(50));

    const success = await testDirectEmailProduction();
    if (success) successCount++;

    if (i < testCount) {
      console.log('\n⏳ Aguardando 3 segundos antes do próximo teste...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n📊 RELATÓRIO FINAL DE EMAILS');
  console.log('═══════════════════════════════════════');
  console.log(`✅ Testes bem-sucedidos: ${successCount}/${testCount}`);
  console.log(`📈 Taxa de sucesso: ${(successCount/testCount*100).toFixed(0)}%`);

  if (successCount > 0) {
    console.log('\n🎉 EMAILS SENDO ENVIADOS!');
    console.log('📧 Verifique sua caixa de entrada nos próximos minutos');
    console.log('📱 Lembre-se de verificar spam/lixo eletrônico');
    console.log('🕐 Tempo estimado de entrega: 1-3 minutos');
  } else {
    console.log('\n❌ Nenhum email foi enviado com sucesso');
    console.log('🔧 Verifique as configurações do SendGrid no Vercel');
  }

  console.log('\n🌐 Site: https://jchairstudios62.xyz');
  console.log('📧 Email de teste: juliocesarurss65@gmail.com');
  console.log('══════════════════════════════════════════════════════════');
};

runMultipleTests().catch(console.error);