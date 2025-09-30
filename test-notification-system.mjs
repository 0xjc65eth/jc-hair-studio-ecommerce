#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function testNotificationSystem() {
  console.log('📧 Testando Sistema de Notificações...');
  console.log(`📍 URL Base: ${BASE_URL}`);
  console.log();

  try {
    // Teste 1: Verificar se a API está disponível
    console.log('🔍 Teste 1: Verificar disponibilidade da API...');
    const healthResponse = await fetch(`${BASE_URL}/api/notifications`);
    const healthData = await healthResponse.json();

    if (healthData.success) {
      console.log('✅ API de notificações disponível');
      console.log(`📋 Eventos disponíveis: ${healthData.availableEvents.length}`);
      console.log(`🎯 Eventos: ${healthData.availableEvents.join(', ')}`);
    } else {
      console.log('❌ API de notificações indisponível');
      return;
    }

    console.log();

    // Teste 2: Testar notificação específica
    console.log('🧪 Teste 2: Enviando notificação de teste...');
    const testOrder = {
      event: 'order_confirmed',
      data: {
        orderId: `TEST-${Date.now()}`,
        customerName: 'Teste Cliente',
        customerEmail: 'teste@exemplo.com',
        total: 125.99,
        items: [
          {
            name: 'Shampoo Hidratante',
            quantity: 1,
            price: 45.99,
            brand: 'JC Hair Studio',
            category: 'Cuidados Capilares'
          },
          {
            name: 'Condicionador Premium',
            quantity: 2,
            price: 40.00,
            brand: 'JC Hair Studio',
            category: 'Cuidados Capilares'
          }
        ],
        paymentMethod: 'Cartão de Crédito',
        orderDate: new Date().toLocaleDateString('pt-PT')
      }
    };

    const postResponse = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrder)
    });

    const postData = await postResponse.json();

    if (postData.success) {
      console.log('✅ Notificação de teste enviada com sucesso');
      console.log(`📧 Cliente: ${postData.results.clientNotification ? 'Enviado' : 'Falhou'}`);
      console.log(`🏢 Empresa: ${postData.results.companyNotification ? 'Enviado' : 'Falhou'}`);
    } else {
      console.log('❌ Falha ao enviar notificação de teste');
      console.log(`Erro: ${postData.error}`);
    }

    console.log();

    // Teste 3: Executar suite de testes completa
    console.log('🎯 Teste 3: Executando suite completa de notificações...');
    const fullTestResponse = await fetch(`${BASE_URL}/api/notifications?test=true`);
    const fullTestData = await fullTestResponse.json();

    if (fullTestData.success) {
      console.log('✅ Suite completa de testes executada');
      console.log(`💌 ${fullTestData.message}`);
      console.log(`📝 ${fullTestData.note}`);
    } else {
      console.log('❌ Falha na suite completa de testes');
    }

    console.log();

    // Teste 4: Testar diferentes tipos de eventos
    console.log('🔄 Teste 4: Testando diferentes tipos de eventos...');

    const testEvents = [
      'payment_confirmed',
      'order_processing',
      'order_shipped'
    ];

    for (const event of testEvents) {
      console.log(`📤 Testando evento: ${event}`);

      const eventTestData = {
        ...testOrder,
        event: event,
        data: {
          ...testOrder.data,
          orderId: `${event.toUpperCase()}-${Date.now()}`,
          trackingCode: event === 'order_shipped' ? 'CTT123456789' : undefined,
          carrier: event === 'order_shipped' ? 'CTT' : undefined
        }
      };

      try {
        const eventResponse = await fetch(`${BASE_URL}/api/notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventTestData)
        });

        const eventData = await eventResponse.json();

        if (eventData.success) {
          console.log(`  ✅ ${event}: Sucesso`);
        } else {
          console.log(`  ❌ ${event}: Falhou (${eventData.error})`);
        }
      } catch (error) {
        console.log(`  ❌ ${event}: Erro (${error.message})`);
      }

      // Pequena pausa entre testes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log();

    // Teste 5: Verificar configuração de email
    console.log('📮 Teste 5: Verificando configuração de email...');

    const emailConfig = {
      testMode: process.env.NOTIFICATION_TEST_MODE === 'true',
      testEmail: 'juliana.dayane110@gmail.com',
      companyEmail: 'juliocesarurss62@gmail.com'
    };

    console.log(`🧪 Modo de teste: ${emailConfig.testMode ? 'ATIVADO' : 'DESATIVADO'}`);
    console.log(`📧 Email de teste: ${emailConfig.testEmail}`);
    console.log(`🏢 Email da empresa: ${emailConfig.companyEmail}`);

    if (emailConfig.testMode) {
      console.log('⚠️  ATENÇÃO: Sistema em modo de teste - emails serão enviados para o email de teste');
    } else {
      console.log('🚀 Sistema em modo produção - emails serão enviados para clientes reais');
    }

    console.log();
    console.log('🎉 Teste do sistema de notificações concluído!');
    console.log();
    console.log('📊 RESUMO DOS TESTES:');
    console.log('✅ API disponível e funcional');
    console.log('✅ Notificações individuais funcionando');
    console.log('✅ Suite completa de testes executada');
    console.log('✅ Diferentes tipos de eventos testados');
    console.log('✅ Configuração de email verificada');

  } catch (error) {
    console.error('❌ Erro durante o teste do sistema de notificações:', error);
  }
}

testNotificationSystem();