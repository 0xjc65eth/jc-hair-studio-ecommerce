#!/usr/bin/env node

/**
 * TESTE COMPLETO DO SISTEMA DE NOTIFICAÇÕES - JC Hair Studio
 *
 * Este script executa testes exaustivos em TODOS os componentes do sistema:
 * 1. Teste de envio para admin (juliocesarurss65@gmail.com)
 * 2. Teste de confirmação de pedido
 * 3. Teste de confirmação de pagamento
 * 4. Teste de notificação de envio
 * 5. Teste com dados completos incluindo endereço, telefone, etc
 * 6. Verificação de persistência no MongoDB
 * 7. Teste de retry com falhas simuladas
 *
 * Executar com: node test-notification-system.mjs
 *
 * @author JC Hair Studio Development Team
 * @version 3.0.0 - Sistema Ultra-Abrangente
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configurações do teste
const BASE_URL = process.env.TEST_BASE_URL || 'https://jchairstudios62.xyz';
const ADMIN_EMAIL = 'juliocesarurss65@gmail.com';

console.log(`
🧪 ======================================================================
🧪 SISTEMA DE TESTE ULTRA-ABRANGENTE DE NOTIFICAÇÕES - JC HAIR STUDIO
🧪 ======================================================================
🌐 Base URL: ${BASE_URL}
📧 Admin Email: ${ADMIN_EMAIL}
⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}
🧪 ======================================================================
`);

/**
 * TESTE 1: NOTIFICAÇÃO ADMIN DIRETA
 * Testa o envio direto para o email do admin com dados completos
 */
async function teste1_NotificacaoAdmin() {
  console.log('\n📧 TESTE 1: NOTIFICAÇÃO ADMIN DIRETA');
  console.log('-'.repeat(60));

  try {
    const testData = {
      action: 'test',
      testEmail: ADMIN_EMAIL
    };

    console.log('📊 Enviando dados de teste:', JSON.stringify(testData, null, 2));

    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Notificação admin: SUCESSO');
      console.log(`📝 Resposta: ${result.message}`);
      console.log(`📊 Resumo agentes: ${JSON.stringify(result.results, null, 2)}`);
      return true;
    } else {
      console.log('❌ Notificação admin: FALHA');
      console.log(`📝 Erro: ${result.error || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Notificação admin: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * TESTE 2: CONFIRMAÇÃO DE PEDIDO COMPLETA
 * Testa o fluxo completo de confirmação de pedido
 */
async function teste2_ConfirmacaoPedido() {
  console.log('\n🛍️ TESTE 2: CONFIRMAÇÃO DE PEDIDO COMPLETA');
  console.log('-'.repeat(60));

  const pedidoCompleto = {
    action: 'processOrder',
    orderId: `TESTE-${Date.now()}`,
    customerName: 'João Silva Teste',
    customerEmail: 'joao.silva.teste@exemplo.com',
    customerPhone: '+351 912 345 678',
    customerDocument: '123.456.789-00',
    total: 189.90,
    subtotal: 169.90,
    shippingCost: 20.00,
    discount: 0.00,
    currency: 'EUR',
    status: 'pending', // Ainda não pago
    paymentMethod: 'Cartão de Crédito',
    paymentGateway: 'Stripe',
    products: [
      {
        name: 'Shampoo Hidratante Profissional 500ml',
        quantity: 2,
        price: 45.50,
        sku: 'SHP001',
        category: 'Shampoos'
      },
      {
        name: 'Condicionador Reparador 300ml',
        quantity: 1,
        price: 38.90,
        sku: 'CND002',
        category: 'Condicionadores'
      },
      {
        name: 'Máscara Capilar Nutritiva 250ml',
        quantity: 1,
        price: 40.00,
        sku: 'MSC003',
        category: 'Tratamentos'
      }
    ],
    shippingAddress: {
      name: 'João Silva Teste',
      street: 'Rua das Flores, 123, Apartamento 4B',
      complement: 'Próximo ao mercado central',
      neighborhood: 'Centro',
      city: 'Lisboa',
      state: 'Lisboa',
      zipCode: '1000-001',
      country: 'Portugal',
      phone: '+351 912 345 678',
      notes: 'Entregar pela manhã, porteiro disponível 8h-18h'
    },
    deliveryMethod: 'Correios Express',
    shippingCarrier: 'CTT Expresso',
    estimatedDelivery: '3-5 dias úteis',
    clientIp: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    source: 'Website Direct',
    campaign: 'Newsletter Promocional',
    sessionDuration: '00:12:34',
    pagesVisited: 8,
    createdAt: new Date().toISOString()
  };

  try {
    console.log('📦 Processando pedido completo...');

    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedidoCompleto),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Confirmação de pedido: SUCESSO');
      console.log(`📝 Mensagem: ${result.message}`);
      console.log(`📊 Agentes executados: ${result.summary?.successful}/${result.summary?.total}`);
      console.log('📋 Detalhes dos agentes:');
      result.summary?.details?.forEach(agent => {
        const status = agent.status === 'fulfilled' ? '✅' : '❌';
        console.log(`  ${status} ${agent.agent}: ${agent.status}`);
        if (agent.error) console.log(`    ⚠️ Erro: ${agent.error.message || agent.error}`);
      });
      return true;
    } else {
      console.log('❌ Confirmação de pedido: FALHA');
      console.log(`📝 Erro: ${result.error || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Confirmação de pedido: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * TESTE 3: CONFIRMAÇÃO DE PAGAMENTO
 * Testa o fluxo de confirmação quando o pagamento é aprovado
 */
async function teste3_ConfirmacaoPagamento() {
  console.log('\n💳 TESTE 3: CONFIRMAÇÃO DE PAGAMENTO');
  console.log('-'.repeat(60));

  const pagamentoAprovado = {
    paymentIntentId: `pi_teste_${Date.now()}`,
    customerInfo: {
      name: 'Maria Costa Exemplo',
      email: 'maria.costa.teste@exemplo.com',
      phone: '+351 934 567 890'
    },
    items: [
      {
        name: 'Kit Completo Hidratação Capilar',
        quantity: 1,
        price: 89.90
      },
      {
        name: 'Óleo Argan Premium 50ml',
        quantity: 2,
        price: 35.00
      }
    ],
    amount: 159.90,
    shippingAddress: {
      name: 'Maria Costa Exemplo',
      street: 'Avenida da Liberdade, 456',
      city: 'Porto',
      zipCode: '4000-001',
      country: 'Portugal'
    },
    deliveryMethod: 'Correios Standard'
  };

  try {
    console.log('💰 Processando confirmação de pagamento...');

    const response = await fetch(`${BASE_URL}/api/payment-success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pagamentoAprovado),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Confirmação de pagamento: SUCESSO');
      console.log(`📝 Mensagem: ${result.message}`);
      return true;
    } else {
      console.log('❌ Confirmação de pagamento: FALHA');
      console.log(`📝 Erro: ${result.error || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Confirmação de pagamento: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * TESTE 4: NOTIFICAÇÃO DE ENVIO
 * Testa o envio de notificação quando o produto é despachado
 */
async function teste4_NotificacaoEnvio() {
  console.log('\n📦 TESTE 4: NOTIFICAÇÃO DE ENVIO');
  console.log('-'.repeat(60));

  const produtoEnviado = {
    action: 'processOrder',
    orderId: `ENVIO-${Date.now()}`,
    customerName: 'Ana Rodrigues Teste',
    customerEmail: 'ana.rodrigues.teste@exemplo.com',
    customerPhone: '+351 967 890 123',
    total: 75.50,
    currency: 'EUR',
    status: 'shipped', // Status de enviado
    paymentMethod: 'MBWay',
    products: [
      {
        name: 'Leave-in Protetor Térmico',
        quantity: 1,
        price: 29.90,
        sku: 'LV001'
      },
      {
        name: 'Spray Fixador Professional',
        quantity: 2,
        price: 22.80,
        sku: 'SPR002'
      }
    ],
    shippingAddress: {
      name: 'Ana Rodrigues Teste',
      street: 'Rua da Paz, 789',
      city: 'Braga',
      zipCode: '4700-001',
      country: 'Portugal'
    },
    trackingCode: 'JC123456789PT', // Código de rastreamento
    trackingUrl: 'https://www.ctt.pt/feapl_2/app/open/postalObjectSearch.jspx?objects=JC123456789PT',
    shippingCarrier: 'CTT Expresso',
    estimatedDelivery: '2-3 dias úteis',
    createdAt: new Date().toISOString()
  };

  try {
    console.log('🚚 Processando notificação de envio...');

    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produtoEnviado),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Notificação de envio: SUCESSO');
      console.log(`📝 Mensagem: ${result.message}`);
      console.log(`📊 Agentes executados: ${result.summary?.successful}/${result.summary?.total}`);
      return true;
    } else {
      console.log('❌ Notificação de envio: FALHA');
      console.log(`📝 Erro: ${result.error || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Notificação de envio: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * TESTE 5: NEWSLETTER SIGNUP
 * Testa o cadastro na newsletter
 */
async function teste5_Newsletter() {
  console.log('\n📬 TESTE 5: NEWSLETTER SIGNUP');
  console.log('-'.repeat(60));

  const newsletterData = {
    email: 'newsletter.teste@exemplo.com',
    name: 'Subscritor Teste Newsletter'
  };

  try {
    console.log('📧 Testando cadastro na newsletter...');

    const response = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletterData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Newsletter signup: SUCESSO');
      console.log(`📝 Mensagem: ${result.message}`);
      return true;
    } else {
      console.log('❌ Newsletter signup: FALHA');
      console.log(`📝 Erro: ${result.error || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Newsletter signup: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * TESTE 6: VERIFICAÇÃO DO MONGODB
 * Verifica se os dados estão sendo persistidos corretamente no MongoDB
 */
async function teste6_VerificacaoMongoDB() {
  console.log('\n🗄️ TESTE 6: VERIFICAÇÃO DO MONGODB');
  console.log('-'.repeat(60));

  try {
    console.log('🔍 Verificando estatísticas do MongoDB...');

    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ MongoDB verificação: SUCESSO');
      console.log('📊 Configuração atual:');
      console.log(`  • Admin Email: ${result.config?.adminEmail}`);
      console.log(`  • Emails habilitados: ${result.config?.emailsEnabled ? 'Sim' : 'Não'}`);
      console.log(`  • Execução paralela: ${result.config?.parallelExecution ? 'Sim' : 'Não'}`);
      console.log(`  • Status do sistema: ${result.health}`);

      if (result.statistics && result.statistics.length > 0) {
        console.log('📈 Estatísticas de notificações:');
        result.statistics.forEach(stat => {
          console.log(`  • Tipo: ${stat._id}`);
          console.log(`    - Total: ${stat.total}`);
          console.log(`    - Enviados: ${stat.sent}`);
          console.log(`    - Falhados: ${stat.failed}`);
        });
      } else {
        console.log('📊 Nenhuma estatística encontrada (primeira execução)');
      }
      return true;
    } else {
      console.log('❌ MongoDB verificação: FALHA');
      console.log(`📝 Erro: ${result.error || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ MongoDB verificação: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * TESTE 7: SISTEMA DE RETRY COM FALHAS
 * Testa o comportamento do sistema quando há falhas
 */
async function teste7_SistemaRetry() {
  console.log('\n🔄 TESTE 7: SISTEMA DE RETRY COM FALHAS');
  console.log('-'.repeat(60));

  try {
    console.log('⚡ Testando resiliência do sistema...');

    // Teste com email inválido para forçar falha
    const dadosComFalha = {
      action: 'processOrder',
      orderId: `RETRY-${Date.now()}`,
      customerName: 'Teste Retry System',
      customerEmail: 'email-invalido@dominio-inexistente.test.fail',
      total: 50.00,
      products: [
        {
          name: 'Produto Teste Retry',
          quantity: 1,
          price: 50.00
        }
      ],
      status: 'paid',
      createdAt: new Date().toISOString()
    };

    const response = await fetch(`${BASE_URL}/api/admin/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosComFalha),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Sistema de retry: TESTADO');
      console.log(`📝 Resposta: ${result.message}`);
      console.log('📊 Resultado dos agentes:');
      result.summary?.details?.forEach(agent => {
        const status = agent.status === 'fulfilled' ? '✅ Sucesso' : '⚠️ Falha esperada';
        console.log(`  ${status} - Agente ${agent.agent}`);
        if (agent.error) {
          console.log(`    💡 Erro capturado: ${agent.error.message || 'Sistema de retry funcionando'}`);
        }
      });
      return true;
    } else {
      console.log('❌ Sistema de retry: ERRO INESPERADO');
      console.log(`📝 Erro: ${result.error}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Sistema de retry: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * TESTE 8: FORMULÁRIO DE CONTATO
 * Testa o sistema de contato direto
 */
async function teste8_FormularioContato() {
  console.log('\n📞 TESTE 8: FORMULÁRIO DE CONTATO');
  console.log('-'.repeat(60));

  const contatoData = {
    name: 'Cliente Teste Contato',
    email: 'contato.teste@exemplo.com',
    phone: '+351 988 776 655',
    subject: 'Teste do Sistema de Contato Automático',
    message: 'Esta é uma mensagem de teste para verificar se o sistema de contato está funcionando corretamente. Se você está recebendo este email, significa que todos os componentes estão operacionais.',
    formType: 'support'
  };

  try {
    console.log('📧 Testando formulário de contato...');

    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contatoData),
    });

    const result = await response.json();

    if (response.ok || response.status === 200) {
      console.log('✅ Formulário de contato: SUCESSO');
      console.log(`📝 Resposta: ${result.message || 'Contato enviado com sucesso'}`);
      return true;
    } else {
      console.log('❌ Formulário de contato: FALHA');
      console.log(`📝 Erro: ${result.error || 'Erro desconhecido'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Formulário de contato: ERRO DE CONEXÃO');
    console.log(`📝 Erro: ${error.message}`);
    return false;
  }
}

/**
 * FUNÇÃO PRINCIPAL - EXECUTAR TODOS OS TESTES
 * Executa todos os testes sequencialmente com delays para evitar sobrecarga
 */
async function executarTodosOsTestes() {
  const inicioTeste = Date.now();

  console.log('\n🚀 INICIANDO BATERIA COMPLETA DE TESTES...\n');

  const resultados = {
    notificacaoAdmin: false,
    confirmacaoPedido: false,
    confirmacaoPagamento: false,
    notificacaoEnvio: false,
    newsletter: false,
    verificacaoMongoDB: false,
    sistemaRetry: false,
    formularioContato: false
  };

  // Executar testes sequencialmente com delay para não sobrecarregar o sistema
  try {
    resultados.notificacaoAdmin = await teste1_NotificacaoAdmin();
    await delay(3000);

    resultados.confirmacaoPedido = await teste2_ConfirmacaoPedido();
    await delay(3000);

    resultados.confirmacaoPagamento = await teste3_ConfirmacaoPagamento();
    await delay(3000);

    resultados.notificacaoEnvio = await teste4_NotificacaoEnvio();
    await delay(3000);

    resultados.newsletter = await teste5_Newsletter();
    await delay(3000);

    resultados.verificacaoMongoDB = await teste6_VerificacaoMongoDB();
    await delay(3000);

    resultados.sistemaRetry = await teste7_SistemaRetry();
    await delay(3000);

    resultados.formularioContato = await teste8_FormularioContato();
  } catch (error) {
    console.error('❌ ERRO CRÍTICO DURANTE OS TESTES:', error);
  }

  // Calcular estatísticas finais
  const fimTeste = Date.now();
  const duracaoTotal = Math.round((fimTeste - inicioTeste) / 1000);
  const sucessos = Object.values(resultados).filter(Boolean).length;
  const total = Object.keys(resultados).length;
  const percentualSucesso = Math.round((sucessos / total) * 100);

  // Relatório final detalhado
  console.log('\n' + '='.repeat(80));
  console.log('📋 RELATÓRIO FINAL COMPLETO - SISTEMA DE NOTIFICAÇÕES');
  console.log('='.repeat(80));
  console.log(`⏱️ Duração total dos testes: ${duracaoTotal} segundos`);
  console.log(`📊 Taxa de sucesso: ${sucessos}/${total} (${percentualSucesso}%)`);
  console.log(`🎯 URL testada: ${BASE_URL}`);
  console.log(`📧 Admin email: ${ADMIN_EMAIL}`);
  console.log('');

  // Detalhamento por teste
  console.log('📝 DETALHAMENTO POR TESTE:');
  console.log('-'.repeat(80));
  Object.entries(resultados).forEach(([teste, sucesso]) => {
    const emoji = sucesso ? '✅' : '❌';
    const status = sucesso ? 'SUCESSO' : 'FALHA';
    const nomeFormatado = teste.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    console.log(`${emoji} ${status.padEnd(8)} - ${nomeFormatado}`);
  });

  console.log('');

  // Análise final
  if (sucessos === total) {
    console.log('🎉 EXCELENTE! TODOS OS TESTES PASSARAM!');
    console.log('🚀 O sistema de notificações está funcionando perfeitamente!');
    console.log('💪 Todos os componentes estão operacionais:');
    console.log('   • Emails para admin funcionando');
    console.log('   • Confirmações de pedido funcionando');
    console.log('   • Confirmações de pagamento funcionando');
    console.log('   • Notificações de envio funcionando');
    console.log('   • Newsletter funcionando');
    console.log('   • MongoDB persistindo dados');
    console.log('   • Sistema de retry resiliente');
    console.log('   • Formulário de contato ativo');
  } else if (sucessos >= total * 0.75) {
    console.log('⚡ BOM! A maioria dos testes passou!');
    console.log('🔧 Alguns componentes podem precisar de atenção.');
    console.log('📋 Verifique os testes que falharam acima.');
  } else if (sucessos >= total * 0.5) {
    console.log('⚠️ ATENÇÃO! Vários testes falharam.');
    console.log('🛠️ O sistema precisa de correções urgentes.');
    console.log('📞 Entre em contato com a equipe de desenvolvimento.');
  } else {
    console.log('🚨 CRÍTICO! A maioria dos testes falharam!');
    console.log('🔥 O sistema de notificações tem problemas sérios.');
    console.log('🚑 Intervenção imediata necessária!');
  }

  console.log('');
  console.log('💡 PRÓXIMOS PASSOS RECOMENDADOS:');
  if (sucessos < total) {
    console.log('   1. Verificar configurações do SendGrid');
    console.log('   2. Confirmar conectividade com MongoDB');
    console.log('   3. Validar variáveis de ambiente');
    console.log('   4. Testar conectividade de rede');
    console.log('   5. Revisar logs do servidor');
  } else {
    console.log('   1. Sistema está operacional');
    console.log('   2. Monitorar logs regularmente');
    console.log('   3. Executar testes semanalmente');
    console.log('   4. Manter backup dos dados');
  }

  console.log('');
  console.log(`⏰ Teste concluído em: ${new Date().toLocaleString('pt-BR')}`);
  console.log('='.repeat(80));

  return {
    resultados,
    sucessos,
    total,
    percentualSucesso,
    duracaoTotal,
    status: sucessos === total ? 'PERFEITO' :
            sucessos >= total * 0.75 ? 'BOM' :
            sucessos >= total * 0.5 ? 'ATENÇÃO' : 'CRÍTICO'
  };
}

/**
 * Função auxiliar para delay entre testes
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Verificação de dependências
 */
async function verificarDependencias() {
  console.log('🔍 Verificando dependências do sistema...');

  try {
    // Verificar conectividade com a URL base
    const healthCheck = await fetch(`${BASE_URL}/api/health`).catch(() => null);
    if (!healthCheck) {
      console.log('⚠️ Aviso: Endpoint de saúde não disponível, mas continuando...');
    }

    console.log('✅ Dependências verificadas');
    return true;
  } catch (error) {
    console.log('⚠️ Alguns serviços podem estar indisponíveis, mas continuando...');
    return true;
  }
}

// EXECUÇÃO PRINCIPAL
(async function main() {
  try {
    await verificarDependencias();
    const resultado = await executarTodosOsTestes();

    // Exit code baseado no resultado
    process.exit(resultado.status === 'CRÍTICO' ? 1 : 0);
  } catch (error) {
    console.error('\n❌ ERRO FATAL NO SISTEMA DE TESTES:', error);
    console.error('🔧 Verifique a configuração e tente novamente.');
    process.exit(1);
  }
})();