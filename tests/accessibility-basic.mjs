// Teste Básico de Acessibilidade - sem Lighthouse
import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function runBasicAccessibilityTest() {
  console.log('🔍 Iniciando teste básico de acessibilidade');
  console.log(`📍 URL Base: ${BASE_URL}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: process.env.TEST_HEADLESS !== 'false',
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      timeout: 30000
    });

    const page = await browser.newPage();

    console.log('🌐 Navegando para página inicial...');
    await page.goto(`${BASE_URL}/`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('🔍 Executando análise axe...');
    const results = await new AxePuppeteer(page)
      .withTags(['wcag2a', 'wcag21aa'])
      .analyze();

    console.log('📊 Resultados da análise:');
    console.log(`✅ Regras aprovadas: ${results.passes.length}`);
    console.log(`❌ Violações: ${results.violations.length}`);
    console.log(`⚠️  Incompletas: ${results.incomplete.length}`);

    if (results.violations.length > 0) {
      console.log('\n🚨 Violações encontradas:');
      results.violations.slice(0, 5).forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.id}`);
        console.log(`   ${violation.description}`);
        console.log(`   Impacto: ${violation.impact}`);
        console.log(`   Elementos: ${violation.nodes.length}`);
      });
    }

    console.log('\n✅ Teste concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runBasicAccessibilityTest().catch(console.error);