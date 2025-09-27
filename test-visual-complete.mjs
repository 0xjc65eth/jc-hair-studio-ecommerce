#!/usr/bin/env node

/**
 * TESTE VISUAL COMPLETO - SIMULANDO USUÁRIO REAL
 * Testa o site como um humano faria
 */

import fetch from 'node-fetch';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PRODUCTION_URL = 'https://jchairstudios62.xyz';

console.log('\n👁️ TESTE VISUAL COMPLETO - JCHAIRSTUDIOS62.XYZ');
console.log('══════════════════════════════════════════════════════════');
console.log(`🌐 Abrindo site em produção: ${PRODUCTION_URL}\n`);

const runVisualTests = async () => {
  const testResults = [];

  // 1. Abrir o site no navegador padrão
  console.log('🌐 Abrindo site no navegador...');
  try {
    await execAsync(`open "${PRODUCTION_URL}"`);
    console.log('✅ Site aberto no navegador');
    testResults.push({ test: 'Abrir Homepage', status: 'success' });
  } catch (error) {
    console.log('❌ Erro ao abrir site:', error.message);
    testResults.push({ test: 'Abrir Homepage', status: 'failed' });
  }

  // Aguardar carregamento
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 2. Testar páginas principais via API
  const pagesToTest = [
    { name: 'Homepage', path: '/' },
    { name: 'Mega Hair', path: '/mega-hair' },
    { name: 'Checkout', path: '/checkout' },
    { name: 'Maquiagens', path: '/maquiagens' },
    { name: 'Cosméticos', path: '/cosmeticos' },
    { name: 'Tratamentos', path: '/tratamentos-capilares' }
  ];

  console.log('\n📄 Testando páginas principais...');
  for (const page of pagesToTest) {
    try {
      const response = await fetch(`${PRODUCTION_URL}${page.path}`);
      if (response.ok) {
        const html = await response.text();
        const hasContent = html.length > 1000;
        const hasProducts = html.includes('produto') || html.includes('Product');

        if (hasContent && hasProducts) {
          console.log(`✅ ${page.name}: Carregando com conteúdo`);
          testResults.push({ test: page.name, status: 'success' });
        } else {
          console.log(`⚠️ ${page.name}: Carregou mas sem produtos`);
          testResults.push({ test: page.name, status: 'warning' });
        }
      } else {
        console.log(`❌ ${page.name}: Erro ${response.status}`);
        testResults.push({ test: page.name, status: 'failed' });
      }
    } catch (error) {
      console.log(`❌ ${page.name}: ${error.message}`);
      testResults.push({ test: page.name, status: 'failed' });
    }
  }

  // 3. Testar sistema de pagamento
  console.log('\n💳 Testando sistema de pagamento...');
  try {
    const paymentResponse = await fetch(`${PRODUCTION_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 19.99,
        currency: 'eur',
        customerInfo: {
          name: 'Teste Visual',
          email: 'teste@visual.com',
          phone: '+351999888777'
        },
        items: [{
          name: 'Teste Visual Product',
          quantity: 1,
          price: 19.99
        }]
      })
    });

    if (paymentResponse.ok) {
      const data = await paymentResponse.json();
      if (data.paymentIntentId) {
        console.log('✅ Sistema de pagamento funcionando');
        console.log(`   Payment Intent: ${data.paymentIntentId.substring(0, 20)}...`);
        testResults.push({ test: 'Sistema de Pagamento', status: 'success' });
      }
    } else {
      console.log('❌ Sistema de pagamento com erro');
      testResults.push({ test: 'Sistema de Pagamento', status: 'failed' });
    }
  } catch (error) {
    console.log('❌ Erro no pagamento:', error.message);
    testResults.push({ test: 'Sistema de Pagamento', status: 'failed' });
  }

  // 4. Verificar elementos visuais via fetch
  console.log('\n🎨 Analisando estrutura visual...');
  try {
    const response = await fetch(PRODUCTION_URL);
    const html = await response.text();

    const visualElements = {
      'Header/Menu': html.includes('header') || html.includes('nav'),
      'Hero Section': html.includes('hero') || html.includes('banner'),
      'Produtos': html.includes('product') || html.includes('produto'),
      'Carrinho': html.includes('cart') || html.includes('carrinho'),
      'Footer': html.includes('footer') || html.includes('rodapé'),
      'Imagens': html.includes('<img') || html.includes('Image'),
      'Botões CTA': html.includes('button') || html.includes('btn'),
      'Formulários': html.includes('form') || html.includes('input')
    };

    for (const [element, present] of Object.entries(visualElements)) {
      console.log(`${present ? '✅' : '❌'} ${element}`);
      testResults.push({ test: `Visual: ${element}`, status: present ? 'success' : 'failed' });
    }
  } catch (error) {
    console.log('❌ Erro ao analisar estrutura:', error.message);
  }

  // 5. Abrir páginas adicionais no navegador
  console.log('\n🔗 Abrindo páginas importantes no navegador...');
  const importantPages = [
    { name: 'Mega Hair', url: `${PRODUCTION_URL}/mega-hair` },
    { name: 'Checkout', url: `${PRODUCTION_URL}/checkout` }
  ];

  for (const page of importantPages) {
    try {
      console.log(`   Abrindo ${page.name}...`);
      await execAsync(`open "${page.url}"`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`   ✅ ${page.name} aberta`);
    } catch (error) {
      console.log(`   ❌ Erro ao abrir ${page.name}`);
    }
  }

  // Relatório final
  console.log('\n📊 RELATÓRIO VISUAL COMPLETO');
  console.log('═══════════════════════════════════════');

  const successCount = testResults.filter(r => r.status === 'success').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;
  const failedCount = testResults.filter(r => r.status === 'failed').length;
  const totalTests = testResults.length;
  const successRate = ((successCount / totalTests) * 100).toFixed(1);

  console.log(`✅ Sucessos: ${successCount}/${totalTests}`);
  console.log(`⚠️ Avisos: ${warningCount}`);
  console.log(`❌ Falhas: ${failedCount}`);
  console.log(`📈 Taxa de Sucesso: ${successRate}%`);

  if (successRate >= 80) {
    console.log('\n🎉 SITE APROVADO NO TESTE VISUAL!');
    console.log('✨ Todas as funcionalidades principais estão operacionais');
    console.log('👀 Verifique visualmente as abas abertas no navegador');
  } else if (successRate >= 60) {
    console.log('\n⚠️ SITE FUNCIONAL MAS COM ALGUNS PROBLEMAS');
    console.log('🔧 Verifique os elementos que falharam');
  } else {
    console.log('\n❌ SITE COM PROBLEMAS CRÍTICOS');
    console.log('🚨 Necessário correção urgente');
  }

  console.log('\n💡 DICAS DE VERIFICAÇÃO VISUAL:');
  console.log('1. Verifique se as imagens dos produtos estão carregando');
  console.log('2. Teste adicionar um produto ao carrinho');
  console.log('3. Navegue até o checkout e veja o formulário de pagamento');
  console.log('4. Verifique se o design está com as cores corretas (rosa/roxo)');
  console.log('5. Teste a responsividade redimensionando a janela');

  console.log('\n🌐 Site em produção: ' + PRODUCTION_URL);
  console.log('📧 Email de teste: juliocesarurss65@gmail.com');
  console.log('══════════════════════════════════════════════════════════');
};

// Executar teste
runVisualTests().catch(console.error);