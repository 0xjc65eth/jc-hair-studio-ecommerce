// Teste de Acessibilidade Simplificado - JC Hair Studio's 62
import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function runSimpleAccessibilityTest() {
  console.log('🔍 Iniciando teste de acessibilidade simplificado');
  console.log(`📍 URL Base: ${BASE_URL}`);

  const browser = await puppeteer.launch({
    headless: process.env.TEST_HEADLESS !== 'false',
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Teste 1: Página inicial
    console.log('\n🧪 Testando página inicial...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });

    const results = await new AxePuppeteer(page)
      .configure({
        rules: {
          'color-contrast': { enabled: true },
          'image-alt': { enabled: true },
          'heading-order': { enabled: true },
          'button-name': { enabled: true },
          'link-name': { enabled: true }
        }
      })
      .analyze();

    if (results.violations.length > 0) {
      console.log(`❌ ${results.violations.length} violações encontradas:`);
      results.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.id}: ${violation.description}`);
        console.log(`   Impacto: ${violation.impact}`);
        console.log(`   Elementos afetados: ${violation.nodes.length}`);
      });
    } else {
      console.log('✅ Página inicial: Nenhuma violação encontrada');
    }

    // Teste 2: Página de produtos
    console.log('\n🧪 Testando página de produtos...');
    await page.goto(`${BASE_URL}/produtos`, { waitUntil: 'networkidle2' });

    const productResults = await new AxePuppeteer(page)
      .withTags(['wcag21aa'])
      .analyze();

    if (productResults.violations.length > 0) {
      console.log(`❌ ${productResults.violations.length} violações na página de produtos`);
    } else {
      console.log('✅ Página de produtos: Nenhuma violação encontrada');
    }

    console.log('\n📊 Teste de acessibilidade concluído');
    console.log(`✅ Total de páginas testadas: 2`);
    console.log(`📋 Total de violações: ${results.violations.length + productResults.violations.length}`);

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  } finally {
    await browser.close();
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runSimpleAccessibilityTest().catch(console.error);
}

export { runSimpleAccessibilityTest };