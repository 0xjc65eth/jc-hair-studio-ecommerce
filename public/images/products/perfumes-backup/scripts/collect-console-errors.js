#!/usr/bin/env node

/**
 * Script para coletar erros do console da página de cosméticos
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function collectConsoleErrors() {
  console.log('🔍 Iniciando coleta de erros do console...');

  const browser = await puppeteer.launch({
    headless: false, // Mostra o browser para debug
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const errors = [];
  const warnings = [];
  const networkErrors = [];
  const consoleMessages = [];

  // Capturar mensagens do console
  page.on('console', (msg) => {
    const message = {
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    };

    consoleMessages.push(message);

    if (msg.type() === 'error') {
      errors.push(message);
    } else if (msg.type() === 'warning') {
      warnings.push(message);
    }

    console.log(`Console ${msg.type()}: ${msg.text()}`);
  });

  // Capturar erros de rede
  page.on('response', (response) => {
    if (!response.ok()) {
      const networkError = {
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      };
      networkErrors.push(networkError);
      console.log(`Network error: ${response.status()} ${response.url()}`);
    }
  });

  // Capturar erros JavaScript não tratados
  page.on('pageerror', (error) => {
    const jsError = {
      type: 'javascript_error',
      message: error.message,
      stack: error.stack
    };
    errors.push(jsError);
    console.log(`JavaScript error: ${error.message}`);
  });

  try {
    console.log('📱 Navegando para página de cosméticos...');

    // Navegar para a página de cosméticos
    await page.goto('http://localhost:3002/cosmeticos', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('⏳ Aguardando carregamento completo...');

    // Aguardar mais um pouco para capturar todos os erros
    await page.waitForTimeout(10000);

    // Tentar interagir com elementos para gerar mais erros
    try {
      await page.evaluate(() => {
        // Scroll da página para carregar mais conteúdo
        window.scrollTo(0, document.body.scrollHeight);
      });

      await page.waitForTimeout(3000);

      // Voltar ao topo
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });

      await page.waitForTimeout(2000);

    } catch (interactionError) {
      console.log('Erro durante interação:', interactionError.message);
    }

  } catch (error) {
    console.error('Erro ao navegar:', error.message);
  }

  await browser.close();

  // Compilar relatório
  const report = {
    timestamp: new Date().toISOString(),
    page: '/cosmeticos',
    summary: {
      totalConsoleMessages: consoleMessages.length,
      totalErrors: errors.length,
      totalWarnings: warnings.length,
      totalNetworkErrors: networkErrors.length
    },
    errors: errors,
    warnings: warnings,
    networkErrors: networkErrors,
    allConsoleMessages: consoleMessages
  };

  // Salvar relatório
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportFile = path.join(reportsDir, `console-errors-${Date.now()}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

  console.log('\n📊 RELATÓRIO DE ERROS:');
  console.log(`   Total de mensagens do console: ${report.summary.totalConsoleMessages}`);
  console.log(`   Total de erros: ${report.summary.totalErrors}`);
  console.log(`   Total de warnings: ${report.summary.totalWarnings}`);
  console.log(`   Total de erros de rede: ${report.summary.totalNetworkErrors}`);
  console.log(`\n💾 Relatório salvo em: ${reportFile}`);

  if (errors.length > 0) {
    console.log('\n🔥 PRINCIPAIS ERROS:');
    errors.slice(0, 10).forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.text || error.message}`);
    });
  }

  return report;
}

// Verificar se puppeteer está instalado
try {
  require('puppeteer');
} catch (error) {
  console.log('📦 Puppeteer não encontrado. Instalando...');
  const { execSync } = require('child_process');
  execSync('npm install puppeteer', { stdio: 'inherit' });
  console.log('✅ Puppeteer instalado com sucesso');
}

collectConsoleErrors().catch(console.error);