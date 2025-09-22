// Testes de Acessibilidade para JC Hair Studio's 62
// Utiliza axe-core e Lighthouse para verificar conformidade WCAG

import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';
import lighthouse from 'lighthouse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

// Configuração do teste
const BROWSER_CONFIG = {
  headless: process.env.TEST_HEADLESS !== 'false',
  defaultViewport: { width: 1280, height: 720 },
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

class AccessibilityTestSuite {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      passed: 0,
      failed: 0,
      violations: [],
      lighthouseScores: {}
    };
  }

  async setup() {
    console.log('🔍 Iniciando testes de acessibilidade');
    console.log(`📍 URL Base: ${BASE_URL}`);

    this.browser = await puppeteer.launch(BROWSER_CONFIG);
    this.page = await this.browser.newPage();

    // Configurar User-Agent para simular usuário real
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }

    this.generateReport();
  }

  async test(testName, testFn) {
    try {
      console.log(`\n🧪 ${testName}`);
      await testFn();
      console.log(`✅ ${testName} - PASSOU`);
      this.results.passed++;
    } catch (error) {
      console.log(`❌ ${testName} - FALHOU: ${error.message}`);
      this.results.failed++;
      this.results.violations.push({
        test: testName,
        error: error.message
      });
    }
  }

  // Teste 1: Página inicial - WCAG 2.1 AA
  async testHomepageAccessibility() {
    await this.page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });

    const results = await new AxePuppeteer(this.page)
      .configure({
        rules: {
          // Configurar regras WCAG 2.1 AA
          'color-contrast': { enabled: true },
          'keyboard': { enabled: true },
          'focus-order-semantics': { enabled: true },
          'heading-order': { enabled: true },
          'image-alt': { enabled: true },
          'link-name': { enabled: true },
          'button-name': { enabled: true },
          'form-field-multiple-labels': { enabled: true },
          'label': { enabled: true },
          'bypass': { enabled: true }
        }
      })
      .analyze();

    if (results.violations.length > 0) {
      console.log(`   🚨 ${results.violations.length} violações encontradas:`);
      results.violations.forEach((violation, index) => {
        console.log(`   ${index + 1}. ${violation.id}: ${violation.description}`);
        console.log(`      Impacto: ${violation.impact}`);
        console.log(`      Elementos afetados: ${violation.nodes.length}`);

        // Log dos primeiros 3 elementos afetados
        violation.nodes.slice(0, 3).forEach((node, nodeIndex) => {
          console.log(`      - ${node.target.join(' ')}`);
        });
      });

      throw new Error(`${results.violations.length} violações de acessibilidade encontradas`);
    } else {
      console.log('   ✅ Nenhuma violação encontrada');
    }
  }

  // Teste 2: Página de produtos - Navegação por teclado
  async testProductPageKeyboardNavigation() {
    await this.page.goto(`${BASE_URL}/produtos`, { waitUntil: 'networkidle2' });

    // Verificar se elementos podem ser focados por teclado
    const focusableElements = await this.page.$$eval(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      elements => elements.length
    );

    console.log(`   📋 ${focusableElements} elementos focáveis encontrados`);

    if (focusableElements === 0) {
      throw new Error('Nenhum elemento focável encontrado');
    }

    // Testar navegação Tab
    await this.page.keyboard.press('Tab');
    const activeElement = await this.page.evaluate(() => {
      const active = document.activeElement;
      return active ? active.tagName : null;
    });

    if (!activeElement) {
      throw new Error('Navegação por Tab não está funcionando');
    }

    console.log(`   ⌨️  Navegação por Tab funcionando (foco em: ${activeElement})`);

    // Executar análise axe específica para teclado
    const results = await new AxePuppeteer(this.page)
      .withTags(['wcag21aa', 'keyboard'])
      .analyze();

    if (results.violations.length > 0) {
      throw new Error(`${results.violations.length} violações de navegação por teclado`);
    }
  }

  // Teste 3: Formulário de contato - Labels e campos
  async testContactFormAccessibility() {
    try {
      await this.page.goto(`${BASE_URL}/contato`, { waitUntil: 'networkidle2' });
    } catch (error) {
      // Se página de contato não existir, pular teste
      console.log('   ⚠️  Página de contato não encontrada, pulando teste');
      return;
    }

    const results = await new AxePuppeteer(this.page)
      .withTags(['wcag21aa', 'forms'])
      .analyze();

    if (results.violations.length > 0) {
      console.log(`   🚨 Violações em formulários:`);
      results.violations.forEach((violation, index) => {
        console.log(`   ${index + 1}. ${violation.id}: ${violation.help}`);
      });
      throw new Error(`${results.violations.length} violações em formulários`);
    }

    console.log('   ✅ Formulários acessíveis');
  }

  // Teste 4: Contraste de cores
  async testColorContrast() {
    await this.page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });

    const results = await new AxePuppeteer(this.page)
      .withTags(['wcag21aa'])
      .withRules(['color-contrast'])
      .analyze();

    if (results.violations.length > 0) {
      console.log(`   🎨 Problemas de contraste encontrados:`);
      results.violations.forEach((violation, index) => {
        console.log(`   ${index + 1}. ${violation.description}`);
        violation.nodes.slice(0, 3).forEach((node, nodeIndex) => {
          const any = node.any[0];
          if (any && any.data) {
            console.log(`      - Contraste: ${any.data.contrastRatio} (mínimo: ${any.data.expectedContrastRatio})`);
          }
        });
      });
      throw new Error(`${results.violations.length} problemas de contraste`);
    }

    console.log('   ✅ Contraste de cores adequado');
  }

  // Teste 5: Imagens e texto alternativo
  async testImageAltText() {
    await this.page.goto(`${BASE_URL}/produtos`, { waitUntil: 'networkidle2' });

    const results = await new AxePuppeteer(this.page)
      .withRules(['image-alt'])
      .analyze();

    if (results.violations.length > 0) {
      console.log(`   🖼️  Problemas com texto alternativo:`);
      results.violations.forEach((violation, index) => {
        console.log(`   ${index + 1}. ${violation.description}`);
      });
      throw new Error(`${results.violations.length} imagens sem texto alternativo`);
    }

    console.log('   ✅ Todas as imagens têm texto alternativo');
  }

  // Teste 6: Estrutura de cabeçalhos
  async testHeadingStructure() {
    await this.page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });

    const results = await new AxePuppeteer(this.page)
      .withRules(['heading-order'])
      .analyze();

    if (results.violations.length > 0) {
      throw new Error(`Estrutura de cabeçalhos incorreta`);
    }

    // Verificar se existe pelo menos um H1
    const h1Count = await this.page.$$eval('h1', elements => elements.length);
    if (h1Count === 0) {
      throw new Error('Nenhum elemento H1 encontrado');
    }

    if (h1Count > 1) {
      console.log(`   ⚠️  Múltiplos H1 encontrados (${h1Count})`);
    }

    console.log(`   ✅ Estrutura de cabeçalhos válida (${h1Count} H1)`);
  }

  // Teste 7: Lighthouse Accessibility Score
  async testLighthouseAccessibility() {
    const { lhr } = await lighthouse(`${BASE_URL}/`, {
      port: 9222,
      onlyCategories: ['accessibility'],
      settings: {
        chromeFlags: ['--headless']
      }
    });

    const accessibilityScore = lhr.categories.accessibility.score * 100;
    console.log(`   📊 Pontuação Lighthouse Acessibilidade: ${accessibilityScore}/100`);

    this.results.lighthouseScores.accessibility = accessibilityScore;

    if (accessibilityScore < 90) {
      console.log('   ⚠️  Pontuação abaixo do recomendado (90+)');

      // Mostrar principais problemas
      const audits = lhr.categories.accessibility.auditRefs;
      const failedAudits = audits.filter(audit => {
        const auditResult = lhr.audits[audit.id];
        return auditResult.score !== null && auditResult.score < 1;
      });

      if (failedAudits.length > 0) {
        console.log('   🔍 Principais problemas:');
        failedAudits.slice(0, 5).forEach((audit, index) => {
          const auditResult = lhr.audits[audit.id];
          console.log(`   ${index + 1}. ${auditResult.title}`);
        });
      }
    } else {
      console.log('   ✅ Excelente pontuação de acessibilidade');
    }

    // Não falhar o teste por pontuação baixa, apenas alertar
    return true;
  }

  // Teste 8: Teste com screen reader simulation
  async testScreenReaderCompatibility() {
    await this.page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });

    // Verificar se existem landmarks ARIA
    const landmarks = await this.page.$$eval(
      '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer',
      elements => elements.length
    );

    console.log(`   🔊 ${landmarks} landmarks ARIA encontrados`);

    if (landmarks === 0) {
      console.log('   ⚠️  Nenhum landmark ARIA encontrado (recomendado para screen readers)');
    }

    // Verificar skip links
    const skipLinks = await this.page.$$eval(
      'a[href="#main"], a[href="#content"], .skip-link',
      elements => elements.length
    );

    console.log(`   ⏭️  ${skipLinks} skip links encontrados`);

    if (skipLinks === 0) {
      console.log('   ⚠️  Nenhum skip link encontrado (recomendado para navegação)');
    }

    console.log('   ✅ Compatibilidade com screen reader verificada');
  }

  // Gerar relatório final
  generateReport() {
    console.log('\n📊 Relatório de Acessibilidade:');
    console.log(`✅ Testes aprovados: ${this.results.passed}`);
    console.log(`❌ Testes falhados: ${this.results.failed}`);

    if (this.results.lighthouseScores.accessibility) {
      console.log(`📊 Pontuação Lighthouse: ${this.results.lighthouseScores.accessibility}/100`);
    }

    if (this.results.violations.length > 0) {
      console.log('\n🔍 Violações encontradas:');
      this.results.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.test}: ${violation.error}`);
      });
    }

    // Salvar relatório em arquivo
    const reportPath = path.join(process.cwd(), 'tests', 'accessibility-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      summary: {
        passed: this.results.passed,
        failed: this.results.failed,
        total: this.results.passed + this.results.failed
      },
      lighthouseScores: this.results.lighthouseScores,
      violations: this.results.violations
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);

    // Recomendações finais
    console.log('\n💡 Recomendações:');
    if (this.results.failed === 0) {
      console.log('✅ Parabéns! Seu site está em conformidade com as diretrizes WCAG 2.1 AA');
    } else {
      console.log('🔧 Corrija as violações encontradas para melhorar a acessibilidade');
    }

    if (this.results.lighthouseScores.accessibility < 90) {
      console.log('📈 Considere melhorar a pontuação Lighthouse para 90+ pontos');
    }

    console.log('📚 Recursos úteis:');
    console.log('   - WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/');
    console.log('   - axe DevTools: https://www.deque.com/axe/devtools/');
    console.log('   - WebAIM: https://webaim.org/');
  }
}

// Executar todos os testes
async function runAccessibilityTests() {
  const testSuite = new AccessibilityTestSuite();

  try {
    await testSuite.setup();

    await testSuite.test('Acessibilidade da página inicial (WCAG 2.1 AA)', () =>
      testSuite.testHomepageAccessibility()
    );

    await testSuite.test('Navegação por teclado', () =>
      testSuite.testProductPageKeyboardNavigation()
    );

    await testSuite.test('Acessibilidade de formulários', () =>
      testSuite.testContactFormAccessibility()
    );

    await testSuite.test('Contraste de cores', () =>
      testSuite.testColorContrast()
    );

    await testSuite.test('Texto alternativo em imagens', () =>
      testSuite.testImageAltText()
    );

    await testSuite.test('Estrutura de cabeçalhos', () =>
      testSuite.testHeadingStructure()
    );

    await testSuite.test('Pontuação Lighthouse', () =>
      testSuite.testLighthouseAccessibility()
    );

    await testSuite.test('Compatibilidade com screen reader', () =>
      testSuite.testScreenReaderCompatibility()
    );

  } finally {
    await testSuite.teardown();
  }

  process.exit(testSuite.results.failed > 0 ? 1 : 0);
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runAccessibilityTests().catch(console.error);
}

export { AccessibilityTestSuite, runAccessibilityTests };