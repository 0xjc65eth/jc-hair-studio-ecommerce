/**
 * Performance Tests para Produção - JC Hair Studio's 62
 * Testa métricas de performance em produção usando Lighthouse programático
 */

import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { performance } from 'perf_hooks';

const PRODUCTION_URL = 'https://jc-hair-studio-1mx3w78jy-0xjc65eths-projects.vercel.app';

// URLs críticas para testar
const CRITICAL_URLS = [
  `${PRODUCTION_URL}`,
  `${PRODUCTION_URL}/produtos`,
  `${PRODUCTION_URL}/mega-hair`,
  `${PRODUCTION_URL}/cosmeticos`,
  `${PRODUCTION_URL}/contato`
];

// Thresholds de performance
const PERFORMANCE_THRESHOLDS = {
  performance: 70,
  accessibility: 90,
  bestPractices: 80,
  seo: 80,
  pwa: 60
};

const CORE_WEB_VITALS_THRESHOLDS = {
  'largest-contentful-paint': 2500, // ms
  'first-contentful-paint': 1800,   // ms
  'cumulative-layout-shift': 0.1,   // score
  'total-blocking-time': 200,       // ms
  'speed-index': 3400               // ms
};

/**
 * Executa teste de performance com Lighthouse
 */
async function runLighthouseTest(url) {
  console.log(`🚀 Testando performance de: ${url}`);

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
    port: 0
  });

  try {
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
      settings: {
        maxWaitForFcp: 30000,
        maxWaitForLoad: 45000,
        throttlingMethod: 'simulate',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        }
      }
    };

    const runnerResult = await lighthouse(url, options);
    await chrome.kill();

    if (!runnerResult || !runnerResult.lhr) {
      throw new Error('Lighthouse failed to generate report');
    }

    return runnerResult.lhr;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

/**
 * Analisa resultados do Lighthouse
 */
function analyzeResults(lhr, url) {
  const categories = lhr.categories;
  const audits = lhr.audits;

  const results = {
    url,
    timestamp: new Date().toISOString(),
    scores: {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100)
    },
    coreWebVitals: {
      lcp: audits['largest-contentful-paint']?.numericValue || 0,
      fcp: audits['first-contentful-paint']?.numericValue || 0,
      cls: audits['cumulative-layout-shift']?.numericValue || 0,
      tbt: audits['total-blocking-time']?.numericValue || 0,
      si: audits['speed-index']?.numericValue || 0
    },
    metrics: {
      loadTime: audits['speed-index']?.numericValue || 0,
      totalSize: audits['total-byte-weight']?.numericValue || 0,
      requests: audits['network-requests']?.details?.items?.length || 0
    }
  };

  return results;
}

/**
 * Valida se os resultados passam nos thresholds
 */
function validateThresholds(results) {
  const failures = [];

  // Validar scores das categorias
  Object.entries(PERFORMANCE_THRESHOLDS).forEach(([category, threshold]) => {
    const score = results.scores[category];
    if (score < threshold) {
      failures.push(`${category}: ${score} < ${threshold}`);
    }
  });

  // Validar Core Web Vitals
  Object.entries(CORE_WEB_VITALS_THRESHOLDS).forEach(([metric, threshold]) => {
    const value = results.coreWebVitals[metric.replace(/-/g, '').replace('largest', 'l').replace('contentful', 'c').replace('paint', 'p')];
    if (value > threshold) {
      failures.push(`${metric}: ${Math.round(value)} > ${threshold}`);
    }
  });

  return failures;
}

/**
 * Gera relatório de performance
 */
function generateReport(allResults) {
  console.log('\n📊 RELATÓRIO DE PERFORMANCE - JC HAIR STUDIO\'S 62\n');
  console.log('=' .repeat(60));

  let totalFailures = 0;

  allResults.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.url}`);
    console.log('-'.repeat(50));

    // Scores
    console.log('📈 SCORES:');
    Object.entries(result.scores).forEach(([category, score]) => {
      const threshold = PERFORMANCE_THRESHOLDS[category];
      const status = score >= threshold ? '✅' : '❌';
      console.log(`  ${status} ${category}: ${score}/100 (min: ${threshold})`);
    });

    // Core Web Vitals
    console.log('\n⚡ CORE WEB VITALS:');
    const cwv = result.coreWebVitals;
    console.log(`  LCP: ${Math.round(cwv.lcp)}ms (target: <2500ms)`);
    console.log(`  FCP: ${Math.round(cwv.fcp)}ms (target: <1800ms)`);
    console.log(`  CLS: ${cwv.cls.toFixed(3)} (target: <0.1)`);
    console.log(`  TBT: ${Math.round(cwv.tbt)}ms (target: <200ms)`);
    console.log(`  SI: ${Math.round(cwv.si)}ms (target: <3400ms)`);

    // Métricas gerais
    console.log('\n📊 MÉTRICAS:');
    console.log(`  Tempo de carregamento: ${Math.round(result.metrics.loadTime)}ms`);
    console.log(`  Tamanho total: ${Math.round(result.metrics.totalSize / 1024)}KB`);
    console.log(`  Número de requests: ${result.metrics.requests}`);

    // Validações
    const failures = validateThresholds(result);
    if (failures.length > 0) {
      console.log('\n❌ FALHAS:');
      failures.forEach(failure => console.log(`  • ${failure}`));
      totalFailures += failures.length;
    } else {
      console.log('\n✅ Todos os thresholds foram atendidos!');
    }
  });

  // Resumo final
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMO FINAL');
  console.log('='.repeat(60));

  const avgScores = allResults.reduce((acc, result) => {
    Object.entries(result.scores).forEach(([category, score]) => {
      acc[category] = (acc[category] || 0) + score;
    });
    return acc;
  }, {});

  Object.entries(avgScores).forEach(([category, total]) => {
    const avg = Math.round(total / allResults.length);
    const threshold = PERFORMANCE_THRESHOLDS[category];
    const status = avg >= threshold ? '✅' : '❌';
    console.log(`${status} ${category}: ${avg}/100 (média)`);
  });

  console.log(`\nTotal de URLs testadas: ${allResults.length}`);
  console.log(`Total de falhas: ${totalFailures}`);

  if (totalFailures === 0) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM! Site pronto para produção.');
    return true;
  } else {
    console.log('\n⚠️ ALGUNS TESTES FALHARAM. Revise as métricas acima.');
    return false;
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando testes de performance em produção...\n');

  const startTime = performance.now();
  const allResults = [];

  try {
    // Testar cada URL
    for (const url of CRITICAL_URLS) {
      try {
        const lhr = await runLighthouseTest(url);
        const results = analyzeResults(lhr, url);
        allResults.push(results);
      } catch (error) {
        console.error(`❌ Erro testando ${url}:`, error.message);
        // Continuar com próxima URL mesmo se uma falhar
      }
    }

    if (allResults.length === 0) {
      throw new Error('Nenhum teste foi executado com sucesso');
    }

    // Gerar relatório
    const allPassed = generateReport(allResults);

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    console.log(`\n⏱️ Tempo total de execução: ${duration}ms`);
    console.log(`📅 Executado em: ${new Date().toLocaleString('pt-BR')}`);

    // Sair com código apropriado
    process.exit(allPassed ? 0 : 1);

  } catch (error) {
    console.error('\n❌ Erro executando testes de performance:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}