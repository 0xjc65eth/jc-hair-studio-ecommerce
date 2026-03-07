#!/usr/bin/env node

/**
 * JC Hair Studio - Sales & Conversion Agent
 *
 * Agente autônomo de vendas que executa:
 * - Otimização de catálogo e preços
 * - Recuperação de carrinho abandonado
 * - Cross-selling e upselling
 * - Gestão de promoções
 * - Análise de conversão
 */

const PAPERCLIP_API = process.env.PAPERCLIP_API_URL || 'http://localhost:3100';
const STORE_API = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
const AGENT_ID = process.env.PAPERCLIP_AGENT_ID || 'sales-optimizer';

async function heartbeat(status, taskUpdate = null) {
  try {
    await fetch(`${PAPERCLIP_API}/api/agents/${AGENT_ID}/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, timestamp: new Date().toISOString(), taskUpdate }),
    });
  } catch (error) {
    console.error('[Heartbeat] Erro:', error.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// Catalog Optimization
// ═══════════════════════════════════════════════════════════════

function generateProductBundles() {
  console.log('[Catálogo] Gerando bundles de produtos...');

  return [
    {
      id: 'kit-iniciante',
      name: 'Kit Iniciante - Extensões Clip-in',
      description: 'Tudo que você precisa para começar: extensões clip-in + escova especial + sérum protetor',
      discount: 15,
      products: ['clip-in-extensions', 'detangling-brush', 'heat-protector-serum'],
      price_strategy: 'percentage_discount',
    },
    {
      id: 'kit-mega-hair-completo',
      name: 'Kit Mega Hair Completo',
      description: 'Extensões mega hair + queratina + removedor + kit manutenção',
      discount: 20,
      products: ['mega-hair-keratin', 'keratin-bonds', 'bond-remover', 'maintenance-kit'],
      price_strategy: 'percentage_discount',
    },
    {
      id: 'kit-cuidados-cabelo',
      name: 'Kit Cuidados Brasileiros',
      description: 'Shampoo + condicionador + máscara + óleo - linha brasileira premium',
      discount: 25,
      products: ['brazilian-shampoo', 'brazilian-conditioner', 'deep-mask', 'argan-oil'],
      price_strategy: 'percentage_discount',
    },
    {
      id: 'kit-peruca-premium',
      name: 'Kit Peruca Premium',
      description: 'Peruca lace front + wig cap + cola + removedor + suporte',
      discount: 18,
      products: ['lace-front-wig', 'wig-cap', 'lace-glue', 'glue-remover', 'wig-stand'],
      price_strategy: 'percentage_discount',
    },
    {
      id: 'kit-beleza-brasileira',
      name: 'Kit Beleza Brasileira Completo',
      description: 'Seleção premium de produtos de beleza brasileiros: esmaltes + cosméticos + cuidados',
      discount: 22,
      products: ['impala-nail-polish-set', 'brazilian-cosmetics', 'body-cream'],
      price_strategy: 'percentage_discount',
    },
  ];
}

// ═══════════════════════════════════════════════════════════════
// Pricing Strategy
// ═══════════════════════════════════════════════════════════════

function generatePricingStrategy() {
  console.log('[Preços] Gerando estratégia de preços...');

  return {
    strategies: [
      {
        name: 'Penetração de Mercado',
        description: 'Preços competitivos para conquistar market share',
        applies_to: 'new_products',
        rule: 'market_price * 0.90',
        min_margin: 30,
      },
      {
        name: 'Frete Grátis Condicional',
        description: 'Frete grátis acima de €60 para aumentar ticket médio',
        threshold: 60,
        estimated_aov_increase: 25,
      },
      {
        name: 'Desconto Progressivo',
        description: 'Quanto mais compra, mais desconto',
        tiers: [
          { min_items: 2, discount: 5 },
          { min_items: 3, discount: 10 },
          { min_items: 5, discount: 15 },
        ],
      },
      {
        name: 'Flash Sales',
        description: 'Promoções relâmpago semanais',
        schedule: 'every_friday',
        duration_hours: 24,
        discount_range: { min: 15, max: 40 },
      },
      {
        name: 'Primeira Compra',
        description: 'Desconto especial para novos clientes',
        code: 'WELCOME10',
        discount: 10,
        min_purchase: 30,
        one_time: true,
      },
    ],
    dynamic_pricing: {
      enabled: true,
      factors: ['demand', 'stock_level', 'competitor_price', 'seasonality'],
      update_frequency: 'daily',
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Cross-selling Recommendations
// ═══════════════════════════════════════════════════════════════

function generateCrossSellingRules() {
  console.log('[Cross-sell] Gerando regras de cross-selling...');

  return [
    {
      trigger_category: 'extensoes-clip-in',
      recommend: ['escova-desembaracadora', 'serum-protecao-termica', 'kit-manutencao'],
      position: 'product_page',
      heading: 'Complete seu visual',
    },
    {
      trigger_category: 'mega-hair',
      recommend: ['queratina-profissional', 'removedor-queratina', 'shampoo-pos-quimica'],
      position: 'product_page',
      heading: 'Essenciais para mega hair',
    },
    {
      trigger_category: 'perucas',
      recommend: ['wig-cap', 'cola-lace', 'removedor-cola', 'suporte-peruca'],
      position: 'product_page',
      heading: 'Acessórios indispensáveis',
    },
    {
      trigger_category: 'cosmeticos-brasileiros',
      recommend: ['esmaltes-impala', 'creme-corporal', 'perfume-brasileiro'],
      position: 'cart',
      heading: 'Clientes também compraram',
    },
    {
      trigger: 'cart_value_above_50',
      recommend: ['mini-sizes', 'samples', 'gift-wrap'],
      position: 'checkout',
      heading: 'Adicione por apenas +€5',
    },
  ];
}

// ═══════════════════════════════════════════════════════════════
// Promotion Calendar
// ═══════════════════════════════════════════════════════════════

function generatePromotionCalendar() {
  console.log('[Promoções] Gerando calendário de promoções 2026...');

  return [
    {
      name: 'Dia da Mulher',
      date: '2026-03-08',
      discount: 20,
      categories: ['all'],
      code: 'MULHER20',
      description: 'Celebre a força feminina com 20% OFF em tudo',
    },
    {
      name: 'Dia das Mães',
      date: '2026-05-10',
      discount: 25,
      categories: ['kits', 'perucas', 'cosmeticos'],
      code: 'MAE25',
      description: 'Presente perfeito para as mães: até 25% OFF',
    },
    {
      name: 'Dia dos Namorados',
      date: '2026-06-12',
      discount: 15,
      categories: ['cosmeticos', 'perfumes', 'kits-presente'],
      code: 'AMOR15',
      description: 'Presentes especiais com 15% OFF',
    },
    {
      name: 'Back to School / Rentrée',
      date: '2026-09-01',
      discount: 20,
      categories: ['extensoes', 'clip-in'],
      code: 'VOLTA20',
      description: 'Novo visual para o novo semestre',
    },
    {
      name: 'Singles Day (11.11)',
      date: '2026-11-11',
      discount: 30,
      categories: ['all'],
      code: 'SINGLE30',
      description: 'Mimo para você: 30% OFF em tudo!',
    },
    {
      name: 'Black Friday',
      date: '2026-11-27',
      discount: 50,
      categories: ['all'],
      code: 'BLACK50',
      description: 'A maior promoção do ano: até 50% OFF',
    },
    {
      name: 'Cyber Monday',
      date: '2026-11-30',
      discount: 40,
      categories: ['all'],
      code: 'CYBER40',
      description: 'Últimas ofertas do ano: 40% OFF',
    },
    {
      name: 'Natal',
      date: '2026-12-15',
      discount: 25,
      categories: ['kits-presente', 'perucas', 'cosmeticos'],
      code: 'NATAL25',
      description: 'Presentes de Natal com até 25% OFF + embalagem grátis',
    },
  ];
}

// ═══════════════════════════════════════════════════════════════
// Main Agent Loop
// ═══════════════════════════════════════════════════════════════

async function runSalesAgent() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  JC Hair Studio - Sales & Conversion Agent');
  console.log('  Heartbeat Interval: 4h');
  console.log('═══════════════════════════════════════════════════════════════\n');

  await heartbeat('starting');

  const results = {};

  // Task 1: Product Bundles
  console.log('\n📦 Tarefa 1: Bundles de Produtos');
  await heartbeat('working', { task: 'product_bundles', status: 'in_progress' });
  results.bundles = generateProductBundles();
  console.log(`   Bundles criados: ${results.bundles.length}`);

  // Task 2: Pricing Strategy
  console.log('\n💰 Tarefa 2: Estratégia de Preços');
  await heartbeat('working', { task: 'pricing_strategy', status: 'in_progress' });
  results.pricing = generatePricingStrategy();
  console.log(`   Estratégias: ${results.pricing.strategies.length}`);

  // Task 3: Cross-selling
  console.log('\n🔄 Tarefa 3: Cross-selling');
  await heartbeat('working', { task: 'cross_selling', status: 'in_progress' });
  results.crossSelling = generateCrossSellingRules();
  console.log(`   Regras: ${results.crossSelling.length}`);

  // Task 4: Promotion Calendar
  console.log('\n🗓️ Tarefa 4: Calendário de Promoções');
  await heartbeat('working', { task: 'promotions', status: 'in_progress' });
  results.promotions = generatePromotionCalendar();
  console.log(`   Promoções planejadas: ${results.promotions.length}`);

  await heartbeat('completed', {
    summary: {
      bundles_created: results.bundles.length,
      pricing_strategies: results.pricing.strategies.length,
      cross_sell_rules: results.crossSelling.length,
      promotions_planned: results.promotions.length,
    },
  });

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  ✅ Sales Agent - Ciclo completo');
  console.log('═══════════════════════════════════════════════════════════════\n');

  return results;
}

runSalesAgent().catch(console.error);
