#!/usr/bin/env node

/**
 * Script para criar tickets de suporte automaticamente
 * Vercel e Stripe para resolver problema de conectividade
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Informações do problema
const ISSUE_DATA = {
  domain: 'jchairstudios62.xyz',
  project: 'jc-hair-studio',
  error: 'An error occurred with our connection to Stripe. Request was retried X times.',
  impact: 'Complete payment processing failure - Business Critical',
  tested: [
    'Multiple Stripe SDK configurations',
    'Different timeout and retry settings',
    'Minimal API calls (payment intents, checkout sessions)',
    'Direct HTTPS calls to api.stripe.com'
  ]
};

// Criar issue no GitHub da Vercel (público)
async function createVercelGitHubIssue() {
  console.log('\n📝 Criando issue no GitHub da Vercel...\n');

  const title = 'Critical: Stripe Live API Connection Failure from Vercel Functions';

  const body = `## Issue Description
Our production e-commerce site cannot connect to Stripe Live API from Vercel Functions.

**Project:** ${ISSUE_DATA.project}
**Domain:** ${ISSUE_DATA.domain}
**Environment:** Production

## Error Details
\`\`\`
${ISSUE_DATA.error}
\`\`\`

## What We've Tested
${ISSUE_DATA.tested.map(t => `- ${t}`).join('\n')}

## Impact
${ISSUE_DATA.impact}

## Expected Behavior
Stripe API calls should complete successfully from Vercel Functions.

## Actual Behavior
100% failure rate on all Stripe API calls with connection error.

## Additional Context
- Same code works locally with same live keys
- Issue appears to be infrastructure-level
- Affects both Payment Intents and Checkout Sessions APIs

Please help investigate potential network connectivity issues between Vercel and Stripe Live API servers.`;

  const issueUrl = `https://github.com/vercel/next.js/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;

  console.log('🔗 Abrindo browser para criar issue no GitHub...');
  console.log('URL:', issueUrl.substring(0, 100) + '...\n');

  try {
    await execAsync(`open "${issueUrl}"`);
    console.log('✅ Browser aberto! Complete o issue no GitHub.\n');
  } catch (error) {
    console.log('⚠️  Não foi possível abrir o browser automaticamente.');
    console.log('📋 Copie esta URL e cole no navegador:\n');
    console.log(issueUrl);
  }
}

// Criar email para Vercel Support
async function createVercelSupportEmail() {
  console.log('\n📧 Preparando email para Vercel Support...\n');

  const subject = 'Critical: Stripe Live API Connection Failure from Vercel Functions';
  const to = 'support@vercel.com';

  const body = `Dear Vercel Support Team,

I'm experiencing a critical connectivity issue between Vercel Functions and Stripe's Live API that's preventing payment processing on my production e-commerce application.

PROJECT DETAILS:
- Domain: ${ISSUE_DATA.domain}
- Project: ${ISSUE_DATA.project}
- Region: Deployed globally
- Runtime: Node.js (Next.js 15.5.3)

ISSUE DESCRIPTION:
All Stripe API calls from Vercel Functions consistently fail with the error:
"${ISSUE_DATA.error}"

This occurs regardless of:
- Different Stripe SDK configurations (timeouts, retries, hosts)
- Multiple API endpoints (Payment Intents, Checkout Sessions)
- Various implementation approaches (direct calls, robust connection systems)
- Different retry strategies and fallback mechanisms

TECHNICAL INVESTIGATION COMPLETED:
${ISSUE_DATA.tested.map((t, i) => `${i + 1}. ${t}`).join('\n')}

ERROR PATTERNS:
- Consistent across all Function invocations
- Occurs on initial connection attempt to Stripe API
- Not related to specific Stripe operations (affects both simple and complex calls)
- Error message suggests infrastructure-level connection issues

CODE EXAMPLE:
Even the most minimal Stripe configuration fails:

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000,
  currency: 'eur',
  automatic_payment_methods: { enabled: true }
});

IMPACT:
${ISSUE_DATA.impact}

REQUEST:
Could you please investigate potential network connectivity issues between Vercel's infrastructure and Stripe's Live API servers? This appears to be an infrastructure-level problem rather than a code issue, as the same code works in other environments.

Is there any known connectivity issues with Stripe Live API from Vercel Functions? Are there specific network configurations or regions that might resolve this issue?

Thank you for your assistance in resolving this critical issue.

Best regards,
JC Hair Studio Team`;

  const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  console.log('📧 Abrindo cliente de email...');

  try {
    await execAsync(`open "${mailtoUrl}"`);
    console.log('✅ Email preparado! Revise e envie.\n');
  } catch (error) {
    console.log('⚠️  Não foi possível abrir o cliente de email.');
    console.log('\n📋 Informações do email:\n');
    console.log('Para:', to);
    console.log('Assunto:', subject);
    console.log('\nCorpo do email:\n');
    console.log(body);
  }
}

// Criar email para Stripe Support
async function createStripeSupportEmail() {
  console.log('\n📧 Preparando email para Stripe Support...\n');

  const subject = 'Live API Connection Issues from Vercel Infrastructure';
  const to = 'support@stripe.com';

  const body = `Hello Stripe Support,

We're experiencing consistent connection failures when trying to reach Stripe Live API from Vercel Functions.

ERROR DETAILS:
- Error: "${ISSUE_DATA.error}"
- Environment: Production (Vercel Functions)
- API Keys: Verified live keys (sk_live_...)
- Issue: 100% failure rate on all Stripe API calls

WHAT WE'VE TESTED:
${ISSUE_DATA.tested.map((t, i) => `${i + 1}. ${t}`).join('\n')}

The same code works perfectly:
- Locally with same live keys
- From other hosting providers

QUESTIONS:
1. Is there any IP blocking for Vercel's infrastructure?
2. Are there known connectivity issues between Vercel and Stripe?
3. Do we need to whitelist specific IPs?

ACCOUNT DETAILS:
Domain: ${ISSUE_DATA.domain}
Hosting: Vercel Functions
Issue Started: Today

Please help us resolve this critical issue affecting our payment processing.

Thank you,
JC Hair Studio Team`;

  const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  console.log('📧 Abrindo cliente de email para Stripe...');

  try {
    await execAsync(`open "${mailtoUrl}"`);
    console.log('✅ Email para Stripe preparado! Adicione seu Account ID e envie.\n');
    console.log('⚠️  IMPORTANTE: Adicione seu Stripe Account ID no email!\n');
  } catch (error) {
    console.log('⚠️  Não foi possível abrir o cliente de email.');
    console.log('\n📋 Informações do email:\n');
    console.log('Para:', to);
    console.log('Assunto:', subject);
    console.log('\nCorpo do email:\n');
    console.log(body);
  }
}

// Abrir Vercel Dashboard para criar ticket
async function openVercelDashboard() {
  console.log('\n🌐 Abrindo Vercel Dashboard...\n');

  const dashboardUrl = 'https://vercel.com/dashboard';
  const helpUrl = 'https://vercel.com/help';

  try {
    await execAsync(`open "${helpUrl}"`);
    console.log('✅ Vercel Help Center aberto!');
    console.log('👉 Clique em "Contact Support" e escolha "Production Issue"\n');
  } catch (error) {
    console.log('📋 Acesse: ' + helpUrl);
  }
}

// Abrir Stripe Dashboard
async function openStripeDashboard() {
  console.log('\n💳 Abrindo Stripe Dashboard...\n');

  const dashboardUrl = 'https://dashboard.stripe.com/support';

  try {
    await execAsync(`open "${dashboardUrl}"`);
    console.log('✅ Stripe Support aberto!');
    console.log('👉 Selecione "API & Integration Issues"\n');
  } catch (error) {
    console.log('📋 Acesse: ' + dashboardUrl);
  }
}

// Menu principal
async function main() {
  console.log('🚨 SISTEMA DE CRIAÇÃO DE TICKETS DE SUPORTE 🚨');
  console.log('===============================================');
  console.log('Problema: Falha de conectividade Stripe ↔ Vercel\n');

  console.log('Este script vai ajudar você a criar tickets de suporte.\n');

  console.log('🎯 Ações que serão executadas:');
  console.log('1. Abrir Vercel Help Center');
  console.log('2. Preparar email para Vercel Support');
  console.log('3. Abrir Stripe Support Dashboard');
  console.log('4. Preparar email para Stripe Support');
  console.log('5. Criar issue público no GitHub (opcional)\n');

  console.log('Iniciando em 3 segundos...\n');

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Executar todas as ações
  await openVercelDashboard();
  await new Promise(resolve => setTimeout(resolve, 2000));

  await createVercelSupportEmail();
  await new Promise(resolve => setTimeout(resolve, 2000));

  await openStripeDashboard();
  await new Promise(resolve => setTimeout(resolve, 2000));

  await createStripeSupportEmail();

  console.log('\n❓ Deseja criar um issue público no GitHub? (pode acelerar resposta)');
  console.log('   Se sim, execute: node create-support-tickets.mjs --github\n');

  if (process.argv.includes('--github')) {
    await createVercelGitHubIssue();
  }

  console.log('\n✅ TICKETS PREPARADOS!\n');
  console.log('📋 PRÓXIMOS PASSOS:');
  console.log('1. ✉️  Envie os emails preparados');
  console.log('2. 💬 Entre no Discord da Vercel: https://vercel.com/discord');
  console.log('3. 🐦 Tweet para @vercel e @stripe mencionando o problema');
  console.log('4. 📱 Acompanhe as respostas\n');

  console.log('⏰ Tempo estimado de resposta:');
  console.log('   - Vercel: 1-4 horas (Discord pode ser mais rápido)');
  console.log('   - Stripe: 2-8 horas');
  console.log('   - GitHub Issue: 1-3 dias\n');

  // Salvar resumo em arquivo
  const summary = `
TICKETS DE SUPORTE CRIADOS - ${new Date().toISOString()}
================================================

PROBLEMA: ${ISSUE_DATA.error}
DOMÍNIO: ${ISSUE_DATA.domain}
PROJETO: ${ISSUE_DATA.project}

CANAIS CONTACTADOS:
- [ ] Vercel Support (email)
- [ ] Vercel Help Center (dashboard)
- [ ] Stripe Support (email)
- [ ] Stripe Dashboard
- [ ] GitHub Issue (opcional)
- [ ] Discord Vercel
- [ ] Twitter

INFORMAÇÕES IMPORTANTES:
- Stripe Account ID: [ADICIONE NO EMAIL]
- Vercel Team ID: [VERIFIQUE NO DASHBOARD]
- Região de Deploy: [VERIFIQUE NO DASHBOARD]

LINKS ÚTEIS:
- Vercel Discord: https://vercel.com/discord
- Vercel Status: https://www.vercel-status.com/
- Stripe Status: https://status.stripe.com/

ACOMPANHAMENTO:
- Email responses
- Discord #help channel
- Dashboard notifications
`;

  await execAsync(`echo "${summary}" > support-tickets-summary.txt`);
  console.log('💾 Resumo salvo em: support-tickets-summary.txt\n');
}

// Executar
main().catch(console.error);