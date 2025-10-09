#!/usr/bin/env node

/**
 * Script de Verificação de Status de Indexação
 * JC Hair Studio - jchairstudios62.xyz
 *
 * Verifica:
 * - Acessibilidade do sitemap
 * - Acessibilidade do robots.txt
 * - Validade do sitemap XML
 * - Arquivo IndexNow
 * - Estrutura de URLs
 */

import https from 'https';
import http from 'http';

const SITE_URL = 'https://jchairstudios62.xyz';
const SITEMAP_PATH = '/sitemap.xml';
const ROBOTS_PATH = '/robots.txt';
const INDEXNOW_KEY = 'd4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8';

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// HTTP Request Helper
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    }).on('error', reject);
  });
}

// Extract URLs from sitemap
function extractUrls(sitemapXml) {
  const urlMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
  return urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
}

// Main verification function
async function verifyIndexationStatus() {
  console.log(`\n${colors.bright}${colors.cyan}╔═══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║     VERIFICAÇÃO DE STATUS DE INDEXAÇÃO - JC HAIR STUDIO      ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  console.log(`${colors.blue}🌐 Site:${colors.reset} ${SITE_URL}`);
  console.log(`${colors.blue}📅 Data:${colors.reset} ${new Date().toLocaleString('pt-PT')}\n`);

  const results = {
    sitemap: false,
    robots: false,
    indexnow: false,
    urls: 0,
    issues: []
  };

  // 1. Verificar Sitemap
  console.log(`${colors.bright}[1/4] Verificando Sitemap...${colors.reset}`);
  try {
    const sitemapRes = await makeRequest(`${SITE_URL}${SITEMAP_PATH}`);

    if (sitemapRes.statusCode === 200) {
      console.log(`  ${colors.green}✅ Sitemap acessível${colors.reset}`);
      console.log(`  ${colors.blue}   Status:${colors.reset} ${sitemapRes.statusCode}`);
      console.log(`  ${colors.blue}   Content-Type:${colors.reset} ${sitemapRes.headers['content-type']}`);

      const urls = extractUrls(sitemapRes.data);
      results.urls = urls.length;
      console.log(`  ${colors.green}   URLs encontradas:${colors.reset} ${urls.length}`);

      // Validate XML
      if (sitemapRes.data.includes('<?xml') && sitemapRes.data.includes('<urlset')) {
        console.log(`  ${colors.green}✅ Formato XML válido${colors.reset}`);
        results.sitemap = true;
      } else {
        console.log(`  ${colors.red}❌ Formato XML inválido${colors.reset}`);
        results.issues.push('Sitemap XML malformado');
      }
    } else {
      console.log(`  ${colors.red}❌ Sitemap não acessível (${sitemapRes.statusCode})${colors.reset}`);
      results.issues.push(`Sitemap retornou status ${sitemapRes.statusCode}`);
    }
  } catch (error) {
    console.log(`  ${colors.red}❌ Erro ao acessar sitemap: ${error.message}${colors.reset}`);
    results.issues.push(`Erro no sitemap: ${error.message}`);
  }

  // 2. Verificar Robots.txt
  console.log(`\n${colors.bright}[2/4] Verificando Robots.txt...${colors.reset}`);
  try {
    const robotsRes = await makeRequest(`${SITE_URL}${ROBOTS_PATH}`);

    if (robotsRes.statusCode === 200) {
      console.log(`  ${colors.green}✅ Robots.txt acessível${colors.reset}`);

      // Check if sitemap is referenced
      if (robotsRes.data.includes('Sitemap:')) {
        const sitemapRefs = (robotsRes.data.match(/Sitemap:/g) || []).length;
        console.log(`  ${colors.green}✅ Referências ao sitemap encontradas:${colors.reset} ${sitemapRefs}`);
        results.robots = true;
      } else {
        console.log(`  ${colors.yellow}⚠️  Nenhuma referência ao sitemap encontrada${colors.reset}`);
        results.issues.push('Robots.txt não referencia sitemap');
      }

      // Check for Googlebot rules
      if (robotsRes.data.includes('User-agent: Googlebot')) {
        console.log(`  ${colors.green}✅ Regras para Googlebot definidas${colors.reset}`);
      } else {
        console.log(`  ${colors.yellow}⚠️  Regras específicas para Googlebot não encontradas${colors.reset}`);
      }
    } else {
      console.log(`  ${colors.red}❌ Robots.txt não acessível (${robotsRes.statusCode})${colors.reset}`);
      results.issues.push(`Robots.txt retornou status ${robotsRes.statusCode}`);
    }
  } catch (error) {
    console.log(`  ${colors.red}❌ Erro ao acessar robots.txt: ${error.message}${colors.reset}`);
    results.issues.push(`Erro no robots.txt: ${error.message}`);
  }

  // 3. Verificar IndexNow Key File
  console.log(`\n${colors.bright}[3/4] Verificando IndexNow...${colors.reset}`);
  try {
    const indexnowRes = await makeRequest(`${SITE_URL}/${INDEXNOW_KEY}.txt`);

    if (indexnowRes.statusCode === 200) {
      const content = indexnowRes.data.trim();

      if (content === INDEXNOW_KEY) {
        console.log(`  ${colors.green}✅ Arquivo IndexNow verificado${colors.reset}`);
        console.log(`  ${colors.blue}   Key:${colors.reset} ${INDEXNOW_KEY}`);
        results.indexnow = true;
      } else {
        console.log(`  ${colors.yellow}⚠️  Conteúdo do arquivo IndexNow incorreto${colors.reset}`);
        console.log(`  ${colors.blue}   Esperado:${colors.reset} ${INDEXNOW_KEY}`);
        console.log(`  ${colors.blue}   Recebido:${colors.reset} ${content}`);
        results.issues.push('Conteúdo IndexNow não corresponde à chave');
      }
    } else {
      console.log(`  ${colors.yellow}⚠️  Arquivo IndexNow não encontrado (${indexnowRes.statusCode})${colors.reset}`);
      results.issues.push('Arquivo IndexNow ausente');
    }
  } catch (error) {
    console.log(`  ${colors.red}❌ Erro ao acessar IndexNow: ${error.message}${colors.reset}`);
    results.issues.push(`Erro no IndexNow: ${error.message}`);
  }

  // 4. Verificar Acessibilidade de URLs Principais
  console.log(`\n${colors.bright}[4/4] Verificando URLs Principais...${colors.reset}`);

  const testUrls = [
    `${SITE_URL}/`,
    `${SITE_URL}/produtos`,
    `${SITE_URL}/mega-hair`,
    `${SITE_URL}/pt`,
    `${SITE_URL}/pt/produtos`
  ];

  let accessibleUrls = 0;

  for (const url of testUrls) {
    try {
      const res = await makeRequest(url);
      if (res.statusCode === 200) {
        accessibleUrls++;
        console.log(`  ${colors.green}✅${colors.reset} ${url.replace(SITE_URL, '')}`);
      } else {
        console.log(`  ${colors.red}❌${colors.reset} ${url.replace(SITE_URL, '')} (${res.statusCode})`);
        results.issues.push(`URL ${url} retornou ${res.statusCode}`);
      }
    } catch (error) {
      console.log(`  ${colors.red}❌${colors.reset} ${url.replace(SITE_URL, '')} (${error.message})`);
      results.issues.push(`URL ${url} inacessível`);
    }
  }

  // Final Summary
  console.log(`\n${colors.bright}${colors.cyan}╔═══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║                      RESUMO FINAL                             ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const score = [
    results.sitemap ? 1 : 0,
    results.robots ? 1 : 0,
    results.indexnow ? 1 : 0,
    accessibleUrls === testUrls.length ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const percentage = Math.round((score / 4) * 100);
  const scoreColor = percentage >= 75 ? colors.green : percentage >= 50 ? colors.yellow : colors.red;

  console.log(`${colors.bright}📊 Score de Prontidão:${colors.reset} ${scoreColor}${percentage}%${colors.reset} (${score}/4)\n`);

  console.log(`${results.sitemap ? colors.green + '✅' : colors.red + '❌'} Sitemap XML${colors.reset}`);
  console.log(`${results.robots ? colors.green + '✅' : colors.red + '❌'} Robots.txt${colors.reset}`);
  console.log(`${results.indexnow ? colors.green + '✅' : colors.yellow + '⚠️ '} IndexNow${colors.reset}`);
  console.log(`${accessibleUrls === testUrls.length ? colors.green + '✅' : colors.red + '❌'} URLs Principais (${accessibleUrls}/${testUrls.length})${colors.reset}`);

  if (results.urls > 0) {
    console.log(`\n${colors.blue}📝 Total de URLs no Sitemap:${colors.reset} ${results.urls}`);
  }

  if (results.issues.length > 0) {
    console.log(`\n${colors.yellow}⚠️  Problemas Identificados:${colors.reset}`);
    results.issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
  } else {
    console.log(`\n${colors.green}✅ Nenhum problema identificado!${colors.reset}`);
  }

  // Recommendations
  console.log(`\n${colors.bright}${colors.blue}🎯 Próximas Ações Recomendadas:${colors.reset}\n`);

  if (!results.sitemap) {
    console.log(`   ${colors.red}[CRÍTICO]${colors.reset} Corrigir sitemap.xml`);
  }

  if (!results.robots) {
    console.log(`   ${colors.red}[CRÍTICO]${colors.reset} Atualizar robots.txt com referência ao sitemap`);
  }

  console.log(`   ${colors.blue}[IMPORTANTE]${colors.reset} Configurar Google Search Console`);
  console.log(`   ${colors.blue}[IMPORTANTE]${colors.reset} Submeter sitemap no GSC`);
  console.log(`   ${colors.blue}[IMPORTANTE]${colors.reset} Verificar indexação: site:jchairstudios62.xyz`);

  if (!results.indexnow) {
    console.log(`   ${colors.yellow}[OPCIONAL]${colors.reset} Resolver verificação IndexNow (Bing/Yandex)`);
  }

  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

  // Exit code based on results
  process.exit(score >= 3 ? 0 : 1);
}

// Run verification
verifyIndexationStatus().catch(error => {
  console.error(`\n${colors.red}❌ Erro fatal:${colors.reset}`, error.message);
  process.exit(1);
});
