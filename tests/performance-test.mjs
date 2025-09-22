// Testes de Performance com Lighthouse - JC Hair Studio's 62
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

class PerformanceTestSuite {
  constructor() {
    this.chrome = null;
    this.results = {
      tests: [],
      summary: {
        totalPages: 0,
        averagePerformance: 0,
        averageAccessibility: 0,
        averageBestPractices: 0,
        averageSEO: 0,
        passed: 0,
        failed: 0
      }
    };
  }

  async setup() {
    console.log('🚀 Iniciando testes de performance com Lighthouse');
    console.log(`📍 URL Base: ${BASE_URL}`);

    this.chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
    });
  }

  async teardown() {
    if (this.chrome) {
      await this.chrome.kill();
    }
    this.generateReport();
  }

  async testPage(url, pageName) {
    console.log(`\n🔍 Testando: ${pageName}`);
    console.log(`📊 URL: ${url}`);

    try {
      const options = {
        logLevel: 'info',
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        port: this.chrome.port,
        settings: {
          maxWaitForFcp: 15 * 1000,
          maxWaitForLoad: 35 * 1000,
          skipAudits: ['uses-http2'], // Pular para testes locais
        }
      };

      const runnerResult = await lighthouse(url, options);
      const report = runnerResult.lhr;

      const scores = {
        performance: Math.round(report.categories.performance.score * 100),
        accessibility: Math.round(report.categories.accessibility.score * 100),
        bestPractices: Math.round(report.categories['best-practices'].score * 100),
        seo: Math.round(report.categories.seo.score * 100)
      };

      console.log(`📊 Resultados para ${pageName}:`);
      console.log(`   🚀 Performance: ${scores.performance}/100`);
      console.log(`   ♿ Acessibilidade: ${scores.accessibility}/100`);
      console.log(`   ✅ Boas Práticas: ${scores.bestPractices}/100`);
      console.log(`   🔍 SEO: ${scores.seo}/100`);

      // Verificar Core Web Vitals
      const fcp = report.audits['first-contentful-paint'].numericValue;
      const lcp = report.audits['largest-contentful-paint'].numericValue;
      const cls = report.audits['cumulative-layout-shift'].numericValue;

      console.log(`\n⚡ Core Web Vitals:`);
      console.log(`   FCP: ${Math.round(fcp)}ms ${fcp < 1800 ? '✅' : '⚠️'}`);
      console.log(`   LCP: ${Math.round(lcp)}ms ${lcp < 2500 ? '✅' : '⚠️'}`);
      console.log(`   CLS: ${cls.toFixed(3)} ${cls < 0.1 ? '✅' : '⚠️'}`);

      // Determinar se passou nos critérios mínimos
      const passed = scores.performance >= 70 &&
                    scores.accessibility >= 90 &&
                    scores.bestPractices >= 80 &&
                    scores.seo >= 80;

      if (passed) {
        console.log(`✅ ${pageName}: Todos os critérios atendidos`);
        this.results.summary.passed++;
      } else {
        console.log(`❌ ${pageName}: Alguns critérios não atendidos`);
        this.results.summary.failed++;
      }

      const pageResult = {
        pageName,
        url,
        scores,
        coreWebVitals: {
          fcp: Math.round(fcp),
          lcp: Math.round(lcp),
          cls: parseFloat(cls.toFixed(3))
        },
        passed,
        timestamp: new Date().toISOString()
      };

      this.results.tests.push(pageResult);
      return pageResult;

    } catch (error) {
      console.error(`❌ Erro ao testar ${pageName}:`, error.message);

      const errorResult = {
        pageName,
        url,
        error: error.message,
        passed: false,
        timestamp: new Date().toISOString()
      };

      this.results.tests.push(errorResult);
      this.results.summary.failed++;
      return errorResult;
    }
  }

  calculateAverages() {
    const validTests = this.results.tests.filter(test => test.scores);

    if (validTests.length === 0) return;

    this.results.summary.averagePerformance = Math.round(
      validTests.reduce((sum, test) => sum + test.scores.performance, 0) / validTests.length
    );

    this.results.summary.averageAccessibility = Math.round(
      validTests.reduce((sum, test) => sum + test.scores.accessibility, 0) / validTests.length
    );

    this.results.summary.averageBestPractices = Math.round(
      validTests.reduce((sum, test) => sum + test.scores.bestPractices, 0) / validTests.length
    );

    this.results.summary.averageSEO = Math.round(
      validTests.reduce((sum, test) => sum + test.scores.seo, 0) / validTests.length
    );
  }

  generateReport() {
    this.results.summary.totalPages = this.results.tests.length;
    this.calculateAverages();

    console.log('\n📊 Relatório de Performance:');
    console.log(`📄 Páginas testadas: ${this.results.summary.totalPages}`);
    console.log(`✅ Páginas aprovadas: ${this.results.summary.passed}`);
    console.log(`❌ Páginas reprovadas: ${this.results.summary.failed}`);

    if (this.results.summary.totalPages > 0) {
      console.log('\n📈 Médias Gerais:');
      console.log(`🚀 Performance: ${this.results.summary.averagePerformance}/100`);
      console.log(`♿ Acessibilidade: ${this.results.summary.averageAccessibility}/100`);
      console.log(`✅ Boas Práticas: ${this.results.summary.averageBestPractices}/100`);
      console.log(`🔍 SEO: ${this.results.summary.averageSEO}/100`);
    }

    // Salvar relatório em arquivo
    const reportPath = path.join(process.cwd(), 'tests', 'performance-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      ...this.results
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);

    // Recomendações
    console.log('\n💡 Recomendações:');
    if (this.results.summary.averagePerformance < 70) {
      console.log('🚀 Performance: Considere otimizar imagens, reduzir JavaScript e usar cache');
    }
    if (this.results.summary.averageAccessibility < 90) {
      console.log('♿ Acessibilidade: Verifique contraste de cores, alt text e navegação por teclado');
    }
    if (this.results.summary.averageBestPractices < 80) {
      console.log('✅ Boas Práticas: Implemente HTTPS, CSP e otimize segurança');
    }
    if (this.results.summary.averageSEO < 80) {
      console.log('🔍 SEO: Adicione meta descriptions, otimize títulos e estruture dados');
    }
  }
}

// Executar todos os testes
async function runPerformanceTests() {
  const testSuite = new PerformanceTestSuite();

  try {
    await testSuite.setup();

    // Lista de páginas para testar
    const pagesToTest = [
      { url: `${BASE_URL}/`, name: 'Página Inicial' },
      { url: `${BASE_URL}/produtos`, name: 'Página de Produtos' },
      { url: `${BASE_URL}/sobre`, name: 'Página Sobre' },
      { url: `${BASE_URL}/mega-hair`, name: 'Página Mega Hair' },
      { url: `${BASE_URL}/cosmeticos`, name: 'Página Cosméticos' }
    ];

    // Testar cada página
    for (const page of pagesToTest) {
      await testSuite.testPage(page.url, page.name);
    }

  } finally {
    await testSuite.teardown();
  }

  // Exit com código de erro se algum teste falhou
  process.exit(testSuite.results.summary.failed > 0 ? 1 : 0);
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runPerformanceTests().catch(console.error);
}

export { PerformanceTestSuite, runPerformanceTests };