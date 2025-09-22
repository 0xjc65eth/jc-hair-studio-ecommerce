// Teste Mínimo de Acessibilidade
import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function runMinimalAccessibilityTest() {
  console.log('🔍 Teste mínimo de acessibilidade iniciado');
  console.log(`📍 URL: ${BASE_URL}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: process.env.TEST_HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 10000
    });

    const page = await browser.newPage();

    console.log('🌐 Carregando página...');
    await page.goto(`${BASE_URL}/`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // Aguardar alguns segundos para garantir que a página esteja pronta
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verificar se a página tem conteúdo
    const title = await page.title();
    console.log(`📄 Título da página: ${title}`);

    console.log('🔍 Executando análise axe...');
    const results = await new AxePuppeteer(page)
      .withTags(['wcag2a'])
      .analyze();

    console.log(`✅ Análise concluída: ${results.violations.length} violações`);

    if (results.violations.length > 0) {
      console.log('🚨 Principais violações:');
      results.violations.slice(0, 3).forEach((v, i) => {
        console.log(`${i + 1}. ${v.id}: ${v.impact}`);
        console.log(`   ${v.description}`);
        console.log(`   Elementos afetados: ${v.nodes.length}`);
      });
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runMinimalAccessibilityTest();