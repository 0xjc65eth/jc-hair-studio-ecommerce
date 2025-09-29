// Teste Simples de Performance
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function runSimplePerformanceTest() {
  console.log('🚀 Teste simples de performance iniciado');
  console.log(`📍 URL: ${BASE_URL}`);

  let chrome;
  try {
    console.log('🔧 Iniciando Chrome...');
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox']
    });

    console.log('🔍 Executando Lighthouse...');
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port
    };

    const runnerResult = await lighthouse(`${BASE_URL}/`, options);
    const report = runnerResult.lhr;

    const performanceScore = Math.round(report.categories.performance.score * 100);
    console.log(`📊 Performance Score: ${performanceScore}/100`);

    const fcp = report.audits['first-contentful-paint'].numericValue;
    const lcp = report.audits['largest-contentful-paint'].numericValue;

    console.log(`⚡ FCP: ${Math.round(fcp)}ms`);
    console.log(`⚡ LCP: ${Math.round(lcp)}ms`);

    console.log('✅ Teste concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

runSimplePerformanceTest();