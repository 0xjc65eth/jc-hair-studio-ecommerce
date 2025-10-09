#!/usr/bin/env node

/**
 * Google Search Console - Guia Interativo de Configuração
 * JC Hair Studio
 *
 * Este script fornece um guia passo a passo para configurar o GSC
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

console.log(`\n${colors.bright}${colors.cyan}╔═══════════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}║      GOOGLE SEARCH CONSOLE - GUIA DE CONFIGURAÇÃO                 ║${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}║      JC Hair Studio (jchairstudios62.xyz)                         ║${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}╚═══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

console.log(`${colors.bright}${colors.blue}🎯 OBJETIVO:${colors.reset} Configurar Google Search Console para submeter sitemap.xml\n`);

// Step 1
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}PASSO 1: Acessar Google Search Console${colors.reset}\n`);
console.log(`${colors.blue}📍 URL:${colors.reset} https://search.google.com/search-console\n`);
console.log(`${colors.yellow}Ação:${colors.reset}`);
console.log(`   1. Abra o navegador`);
console.log(`   2. Acesse: ${colors.cyan}https://search.google.com/search-console${colors.reset}`);
console.log(`   3. Faça login com sua conta Google`);
console.log(`      (Use a conta que será responsável pelo site)\n`);

// Step 2
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}PASSO 2: Adicionar Propriedade${colors.reset}\n`);
console.log(`${colors.yellow}Ação:${colors.reset}`);
console.log(`   1. Clique no menu dropdown no topo (ao lado do logo)`);
console.log(`   2. Clique em "${colors.cyan}Adicionar propriedade${colors.reset}"`);
console.log(`   3. Você verá duas opções:\n`);
console.log(`      ${colors.green}✓ RECOMENDADO:${colors.reset} Prefixo de URL`);
console.log(`        Digite: ${colors.cyan}https://jchairstudios62.xyz${colors.reset}\n`);
console.log(`      ${colors.yellow}  Alternativa:${colors.reset} Domínio (requer DNS)`);
console.log(`        Digite: ${colors.cyan}jchairstudios62.xyz${colors.reset}\n`);
console.log(`   4. Clique em "${colors.cyan}Continuar${colors.reset}"\n`);

// Step 3
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}PASSO 3: Verificar Propriedade${colors.reset}\n`);
console.log(`${colors.yellow}Escolha UM dos métodos abaixo:${colors.reset}\n`);

console.log(`${colors.bright}${colors.blue}MÉTODO A: Tag HTML (Mais Fácil)${colors.reset}`);
console.log(`   ${colors.green}✓ Vantagem:${colors.reset} Mais simples, não requer acesso DNS\n`);
console.log(`   1. O Google fornecerá uma tag como:`);
console.log(`      ${colors.cyan}<meta name="google-site-verification" content="ABC123..." />${colors.reset}\n`);
console.log(`   2. Adicione esta tag no arquivo:`);
console.log(`      ${colors.yellow}app/layout.tsx${colors.reset} ou ${colors.yellow}app/[locale]/layout.tsx${colors.reset}\n`);
console.log(`   3. Coloque dentro da tag <head>:`);
console.log(`      ${colors.dim}export const metadata = {`);
console.log(`        verification: {`);
console.log(`          google: 'ABC123...' // Cole o código aqui`);
console.log(`        }`);
console.log(`      }${colors.reset}\n`);
console.log(`   4. Faça deploy no Vercel`);
console.log(`   5. Aguarde 1-2 minutos para propagação`);
console.log(`   6. Volte ao GSC e clique em "${colors.cyan}Verificar${colors.reset}"\n`);

console.log(`${colors.bright}${colors.blue}MÉTODO B: Arquivo HTML${colors.reset}`);
console.log(`   ${colors.green}✓ Vantagem:${colors.reset} Não requer alteração de código\n`);
console.log(`   1. O Google fornecerá um arquivo como:`);
console.log(`      ${colors.cyan}google123abc456def.html${colors.reset}\n`);
console.log(`   2. Baixe este arquivo`);
console.log(`   3. Coloque na pasta: ${colors.yellow}public/${colors.reset}`);
console.log(`   4. Faça deploy no Vercel`);
console.log(`   5. Verifique acessibilidade:`);
console.log(`      ${colors.cyan}https://jchairstudios62.xyz/google123abc456def.html${colors.reset}`);
console.log(`   6. Volte ao GSC e clique em "${colors.cyan}Verificar${colors.reset}"\n`);

console.log(`${colors.bright}${colors.blue}MÉTODO C: DNS (Avançado)${colors.reset}`);
console.log(`   ${colors.green}✓ Vantagem:${colors.reset} Verifica o domínio completo (incluindo subdomínios)\n`);
console.log(`   1. O Google fornecerá um registro TXT como:`);
console.log(`      ${colors.cyan}google-site-verification=ABC123...${colors.reset}\n`);
console.log(`   2. Acesse o painel do seu provedor DNS (ex: Vercel DNS)`);
console.log(`   3. Adicione um novo registro TXT:`);
console.log(`      ${colors.yellow}Tipo:${colors.reset} TXT`);
console.log(`      ${colors.yellow}Nome:${colors.reset} @ (ou deixe em branco)`);
console.log(`      ${colors.yellow}Valor:${colors.reset} google-site-verification=ABC123...`);
console.log(`   4. Salve e aguarde propagação (5-10 minutos)`);
console.log(`   5. Volte ao GSC e clique em "${colors.cyan}Verificar${colors.reset}"\n`);

console.log(`${colors.bright}${colors.blue}MÉTODO D: Google Analytics${colors.reset}`);
console.log(`   ${colors.green}✓ Vantagem:${colors.reset} Se já tem GA4 configurado\n`);
console.log(`   1. Certifique-se que o Google Analytics está instalado no site`);
console.log(`   2. Use a mesma conta Google do GSC`);
console.log(`   3. O GSC detectará automaticamente`);
console.log(`   4. Clique em "${colors.cyan}Verificar${colors.reset}"\n`);

// Step 4
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}PASSO 4: Submeter Sitemap${colors.reset}\n`);
console.log(`${colors.yellow}Após verificação bem-sucedida:${colors.reset}\n`);
console.log(`   1. No menu lateral esquerdo, clique em "${colors.cyan}Indexação${colors.reset}"`);
console.log(`   2. Clique em "${colors.cyan}Sitemaps${colors.reset}"`);
console.log(`   3. Você verá um campo: "${colors.yellow}Adicionar um novo sitemap${colors.reset}"`);
console.log(`   4. Digite: ${colors.cyan}sitemap.xml${colors.reset}`);
console.log(`   5. Clique em "${colors.cyan}Enviar${colors.reset}"\n`);
console.log(`   ${colors.green}✓ Sucesso!${colors.reset} Você verá o status como "${colors.green}Sucesso${colors.reset}" após alguns minutos\n`);

console.log(`   ${colors.blue}📝 Sitemaps adicionais (opcional):${colors.reset}`);
console.log(`      • ${colors.cyan}product-feed.xml${colors.reset} (feed de produtos)`);
console.log(`      • ${colors.cyan}feed.xml${colors.reset} (RSS feed)`);
console.log(`      • ${colors.cyan}sitemap-index.xml${colors.reset} (se existir)\n`);

// Step 5
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}PASSO 5: Solicitar Indexação de URLs Prioritárias${colors.reset}\n`);
console.log(`${colors.yellow}Ação (Opcional, mas recomendado):${colors.reset}\n`);
console.log(`   1. No topo do GSC, clique na barra de pesquisa`);
console.log(`   2. Digite uma URL completa, exemplo:`);
console.log(`      ${colors.cyan}https://jchairstudios62.xyz/${colors.reset}`);
console.log(`   3. Pressione Enter`);
console.log(`   4. Aguarde a inspeção (10-30 segundos)`);
console.log(`   5. Clique em "${colors.cyan}Solicitar indexação${colors.reset}"`);
console.log(`   6. Aguarde confirmação (1-2 minutos)\n`);

console.log(`   ${colors.blue}📝 URLs prioritárias para solicitar:${colors.reset}`);
const priorityUrls = [
  'https://jchairstudios62.xyz/',
  'https://jchairstudios62.xyz/produtos',
  'https://jchairstudios62.xyz/mega-hair',
  'https://jchairstudios62.xyz/pt',
  'https://jchairstudios62.xyz/pt/produtos',
  'https://jchairstudios62.xyz/pt/mega-hair',
  'https://jchairstudios62.xyz/pt/botox-capilar',
  'https://jchairstudios62.xyz/pt/queratina-brasileira',
  'https://jchairstudios62.xyz/pt/progressiva-brasileira',
];

priorityUrls.forEach((url, i) => {
  console.log(`      ${i + 1}. ${colors.cyan}${url}${colors.reset}`);
});

console.log(`\n   ${colors.yellow}⚠️  Limite:${colors.reset} 10-20 URLs por dia\n`);

// Step 6
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}PASSO 6: Monitorar Performance${colors.reset}\n`);
console.log(`${colors.yellow}Onde acompanhar:${colors.reset}\n`);
console.log(`   ${colors.blue}📊 Cobertura (Indexação > Páginas):${colors.reset}`);
console.log(`      • Total de páginas indexadas`);
console.log(`      • Páginas válidas vs. com erros`);
console.log(`      • Razões de exclusão\n`);

console.log(`   ${colors.blue}🔍 Desempenho:${colors.reset}`);
console.log(`      • Impressões (quantas vezes apareceu no Google)`);
console.log(`      • Cliques`);
console.log(`      • CTR (Taxa de cliques)`);
console.log(`      • Posição média\n`);

console.log(`   ${colors.blue}🛠️  Melhorias:${colors.reset}`);
console.log(`      • Core Web Vitals`);
console.log(`      • Usabilidade móvel`);
console.log(`      • Problemas de segurança\n`);

// Timeline
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}📅 CRONOGRAMA ESPERADO${colors.reset}\n`);

const timeline = [
  { time: 'Imediatamente', action: 'Sitemap submetido com sucesso', icon: '✅' },
  { time: '24-48 horas', action: 'Primeiras páginas rastreadas e indexadas', icon: '🔍' },
  { time: '1-2 semanas', action: 'Indexação completa (29 URLs)', icon: '📊' },
  { time: '2-4 semanas', action: 'Dados de performance começam a aparecer', icon: '📈' },
  { time: '2-3 meses', action: 'Rankings estabelecidos e tráfego orgânico', icon: '🎯' },
];

timeline.forEach(({ time, action, icon }) => {
  console.log(`   ${icon}  ${colors.yellow}${time.padEnd(20)}${colors.reset} ${action}`);
});

console.log();

// Checklist
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}✅ CHECKLIST DE CONFIGURAÇÃO${colors.reset}\n`);

const checklist = [
  'Acessar Google Search Console',
  'Fazer login com conta Google',
  'Adicionar propriedade jchairstudios62.xyz',
  'Verificar propriedade (escolher método)',
  'Aguardar confirmação de verificação',
  'Ir em Indexação > Sitemaps',
  'Submeter sitemap.xml',
  'Aguardar status "Sucesso"',
  'Solicitar indexação de URLs prioritárias (opcional)',
  'Configurar alertas de email (recomendado)',
];

checklist.forEach((item, i) => {
  console.log(`   [ ] ${i + 1}. ${item}`);
});

console.log();

// Resources
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}📚 RECURSOS E LINKS ÚTEIS${colors.reset}\n`);

const resources = [
  { name: 'Google Search Console', url: 'https://search.google.com/search-console' },
  { name: 'Guia oficial do GSC', url: 'https://support.google.com/webmasters' },
  { name: 'Sitemap do site', url: 'https://jchairstudios62.xyz/sitemap.xml' },
  { name: 'Verificar indexação', url: 'Google: site:jchairstudios62.xyz' },
  { name: 'Relatório completo', url: './RELATORIO-SUBMISSAO-GOOGLE.md' },
];

resources.forEach(({ name, url }) => {
  console.log(`   ${colors.blue}•${colors.reset} ${name}`);
  console.log(`     ${colors.cyan}${url}${colors.reset}\n`);
});

// Troubleshooting
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}🔧 SOLUÇÃO DE PROBLEMAS${colors.reset}\n`);

console.log(`${colors.yellow}Problema:${colors.reset} Verificação falhou\n`);
console.log(`   ${colors.blue}Soluções:${colors.reset}`);
console.log(`   • Aguarde 5-10 minutos após deploy`);
console.log(`   • Limpe cache do navegador`);
console.log(`   • Verifique se o arquivo/tag está correto`);
console.log(`   • Teste acesso direto ao arquivo de verificação\n`);

console.log(`${colors.yellow}Problema:${colors.reset} Sitemap não aparece no GSC\n`);
console.log(`   ${colors.blue}Soluções:${colors.reset}`);
console.log(`   • Aguarde 24-48h para processamento`);
console.log(`   • Verifique se o sitemap está acessível:`);
console.log(`     ${colors.cyan}https://jchairstudios62.xyz/sitemap.xml${colors.reset}`);
console.log(`   • Valide o XML em: ${colors.cyan}https://www.xml-sitemaps.com/validate-xml-sitemap.html${colors.reset}\n`);

console.log(`${colors.yellow}Problema:${colors.reset} Páginas não estão sendo indexadas\n`);
console.log(`   ${colors.blue}Soluções:${colors.reset}`);
console.log(`   • Verifique robots.txt (não deve bloquear Googlebot)`);
console.log(`   • Use "Inspecionar URL" no GSC para ver o motivo`);
console.log(`   • Aguarde mais tempo (pode levar 1-2 semanas)`);
console.log(`   • Solicite indexação manual\n`);

// Final message
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}🎉 BOA SORTE!${colors.reset}\n`);
console.log(`Após configurar o Google Search Console, execute:\n`);
console.log(`   ${colors.cyan}node scripts/check-indexation-status.mjs${colors.reset}\n`);
console.log(`Para verificar o status de indexação a qualquer momento.\n`);
console.log(`${colors.bright}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
