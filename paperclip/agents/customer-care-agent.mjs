#!/usr/bin/env node

/**
 * JC Hair Studio - Customer Care Agent
 *
 * Agente autônomo de atendimento ao cliente que executa:
 * - Respostas automáticas multilíngues
 * - Gestão de reviews e reclamações
 * - Programa de fidelidade
 * - Follow-up pós-venda
 * - FAQ inteligente
 */

const PAPERCLIP_API = process.env.PAPERCLIP_API_URL || 'http://localhost:3100';
const STORE_API = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
const AGENT_ID = process.env.PAPERCLIP_AGENT_ID || 'customer-care';

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
// Multilingual FAQ System
// ═══════════════════════════════════════════════════════════════

function generateFAQ() {
  console.log('[FAQ] Gerando base de conhecimento multilíngue...');

  return {
    categories: [
      {
        category: 'Produtos e Qualidade',
        faqs: [
          {
            question: {
              pt: 'Qual a diferença entre cabelo virgem e cabelo remy?',
              en: 'What is the difference between virgin and remy hair?',
              fr: 'Quelle est la différence entre cheveux vierges et remy?',
              es: '¿Cuál es la diferencia entre cabello virgen y remy?',
            },
            answer: {
              pt: 'Cabelo virgem nunca foi quimicamente tratado e mantém todas as cutículas naturais. Cabelo remy tem cutículas alinhadas na mesma direção, podendo ter sido levemente processado. Ambos são de alta qualidade, mas o virgem é o mais premium.',
              en: 'Virgin hair has never been chemically treated and keeps all natural cuticles. Remy hair has cuticles aligned in the same direction and may have been lightly processed. Both are high quality, but virgin is the most premium.',
              fr: 'Les cheveux vierges n\'ont jamais été chimiquement traités et conservent toutes les cuticules naturelles. Les cheveux remy ont les cuticules alignées dans la même direction. Les deux sont de haute qualité, mais les vierges sont les plus premium.',
              es: 'El cabello virgen nunca ha sido tratado químicamente y mantiene todas las cutículas naturales. El cabello remy tiene cutículas alineadas en la misma dirección. Ambos son de alta calidad, pero el virgen es el más premium.',
            },
          },
          {
            question: {
              pt: 'Quanto tempo duram as extensões?',
              en: 'How long do extensions last?',
              fr: 'Combien de temps durent les extensions?',
              es: '¿Cuánto duran las extensiones?',
            },
            answer: {
              pt: 'Com cuidados adequados: Clip-in duram 6-12 meses, Tape-in 4-8 semanas (antes de reaplicar), Mega hair com queratina 3-6 meses, Perucas lace front 12-24 meses.',
              en: 'With proper care: Clip-ins last 6-12 months, Tape-ins 4-8 weeks (before reapplication), Keratin extensions 3-6 months, Lace front wigs 12-24 months.',
              fr: 'Avec les soins appropriés: Clip-in durent 6-12 mois, Tape-in 4-8 semaines (avant réapplication), Extensions kératine 3-6 mois, Perruques lace front 12-24 mois.',
              es: 'Con el cuidado adecuado: Clip-in duran 6-12 meses, Tape-in 4-8 semanas (antes de reaplicar), Extensiones de queratina 3-6 meses, Pelucas lace front 12-24 meses.',
            },
          },
        ],
      },
      {
        category: 'Envio e Entrega',
        faqs: [
          {
            question: {
              pt: 'Qual o prazo de entrega?',
              en: 'What are the delivery times?',
              fr: 'Quels sont les délais de livraison?',
              es: '¿Cuáles son los plazos de entrega?',
            },
            answer: {
              pt: 'Portugal: 1-3 dias úteis. França/Espanha: 2-4 dias. Alemanha/Itália: 3-5 dias. UK: 3-5 dias. Frete grátis para Portugal acima de €40 e Europa acima de €80.',
              en: 'Portugal: 1-3 business days. France/Spain: 2-4 days. Germany/Italy: 3-5 days. UK: 3-5 days. Free shipping to Portugal above €40 and Europe above €80.',
              fr: 'Portugal: 1-3 jours ouvrés. France/Espagne: 2-4 jours. Allemagne/Italie: 3-5 jours. UK: 3-5 jours. Livraison gratuite au Portugal au-dessus de 40€ et en Europe au-dessus de 80€.',
              es: 'Portugal: 1-3 días hábiles. Francia/España: 2-4 días. Alemania/Italia: 3-5 días. UK: 3-5 días. Envío gratis a Portugal arriba de €40 y Europa arriba de €80.',
            },
          },
        ],
      },
      {
        category: 'Devoluções e Trocas',
        faqs: [
          {
            question: {
              pt: 'Qual a política de devoluções?',
              en: 'What is the return policy?',
              fr: 'Quelle est la politique de retour?',
              es: '¿Cuál es la política de devolución?',
            },
            answer: {
              pt: 'Aceitamos devoluções em até 14 dias após recebimento, desde que o produto esteja lacrado e sem uso. Extensões de cabelo natural não podem ser devolvidas após abertas por questões de higiene. Reembolso processado em 5-7 dias úteis.',
              en: 'We accept returns within 14 days of receipt, as long as the product is sealed and unused. Natural hair extensions cannot be returned after opening for hygiene reasons. Refund processed in 5-7 business days.',
              fr: 'Nous acceptons les retours dans les 14 jours suivant la réception, à condition que le produit soit scellé et non utilisé. Les extensions de cheveux naturels ne peuvent être retournées après ouverture pour des raisons d\'hygiène. Remboursement traité en 5-7 jours ouvrés.',
              es: 'Aceptamos devoluciones dentro de los 14 días de recibido, siempre que el producto esté sellado y sin uso. Las extensiones de cabello natural no se pueden devolver después de abrirlas por razones de higiene. Reembolso procesado en 5-7 días hábiles.',
            },
          },
        ],
      },
    ],
    total_faqs: 4,
    languages: ['pt', 'en', 'fr', 'es'],
  };
}

// ═══════════════════════════════════════════════════════════════
// Loyalty Program
// ═══════════════════════════════════════════════════════════════

function generateLoyaltyProgram() {
  console.log('[Fidelidade] Gerando programa de fidelidade...');

  return {
    name: 'JC Hair Rewards',
    tiers: [
      {
        name: 'Bronze',
        min_spend: 0,
        points_multiplier: 1,
        benefits: ['1 ponto por €1 gasto', 'Acesso a promoções exclusivas', 'Newsletter VIP'],
      },
      {
        name: 'Prata',
        min_spend: 200,
        points_multiplier: 1.5,
        benefits: ['1.5 pontos por €1 gasto', 'Frete grátis em todos os pedidos', '5% OFF permanente', 'Acesso antecipado a novos produtos'],
      },
      {
        name: 'Ouro',
        min_spend: 500,
        points_multiplier: 2,
        benefits: ['2 pontos por €1 gasto', 'Frete expresso grátis', '10% OFF permanente', 'Amostras grátis em cada pedido', 'Consulta personalizada de cabelo'],
      },
      {
        name: 'Diamante',
        min_spend: 1000,
        points_multiplier: 3,
        benefits: ['3 pontos por €1 gasto', 'Frete expresso grátis worldwide', '15% OFF permanente', 'Presente de aniversário', 'Atendimento prioritário via WhatsApp', 'Convites para eventos exclusivos'],
      },
    ],
    redemption: {
      points_per_euro: 100,
      min_redemption: 500,
      expiry_months: 24,
    },
    referral: {
      referrer_reward: '€10 de crédito',
      referee_reward: '15% OFF na primeira compra',
      max_referrals_month: 20,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Auto-response Templates
// ═══════════════════════════════════════════════════════════════

function generateResponseTemplates() {
  console.log('[Templates] Gerando templates de resposta...');

  return [
    {
      trigger: 'order_confirmation',
      subject: { pt: 'Pedido confirmado! #{orderId}', en: 'Order confirmed! #{orderId}' },
      template: 'Obrigada por comprar no JC Hair Studio! Seu pedido #{orderId} foi confirmado e está sendo preparado com carinho.',
    },
    {
      trigger: 'shipping_notification',
      subject: { pt: 'Seu pedido está a caminho! 📦', en: 'Your order is on its way! 📦' },
      template: 'Ótima notícia! Seu pedido #{orderId} foi despachado. Código de rastreamento: #{trackingCode}',
    },
    {
      trigger: 'review_request',
      subject: { pt: 'Como foi sua experiência? ⭐', en: 'How was your experience? ⭐' },
      template: 'Queremos saber sua opinião! Avalie sua compra e ganhe 50 pontos no JC Hair Rewards.',
    },
    {
      trigger: 'reorder_reminder',
      subject: { pt: 'Hora de renovar seu visual! 💇‍♀️', en: 'Time to refresh your look! 💇‍♀️' },
      template: 'Já faz #{days} dias desde sua última compra. Que tal dar um upgrade no seu visual? Use o cupom VOLTE10 para 10% OFF.',
    },
    {
      trigger: 'birthday',
      subject: { pt: 'Feliz Aniversário! 🎂 Presente especial para você', en: 'Happy Birthday! 🎂 Special gift for you' },
      template: 'Feliz aniversário! Como presente, preparamos um cupom exclusivo de 20% OFF válido por 7 dias: ANIVER20',
    },
  ];
}

// ═══════════════════════════════════════════════════════════════
// Main Agent Loop
// ═══════════════════════════════════════════════════════════════

async function runCustomerCareAgent() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  JC Hair Studio - Customer Care Agent');
  console.log('  Heartbeat Interval: 2h');
  console.log('═══════════════════════════════════════════════════════════════\n');

  await heartbeat('starting');

  const results = {};

  // Task 1: FAQ System
  console.log('\n❓ Tarefa 1: Base de Conhecimento FAQ');
  await heartbeat('working', { task: 'faq_system', status: 'in_progress' });
  results.faq = generateFAQ();
  console.log(`   FAQs: ${results.faq.total_faqs} em ${results.faq.languages.length} idiomas`);

  // Task 2: Loyalty Program
  console.log('\n💎 Tarefa 2: Programa de Fidelidade');
  await heartbeat('working', { task: 'loyalty_program', status: 'in_progress' });
  results.loyalty = generateLoyaltyProgram();
  console.log(`   Tiers: ${results.loyalty.tiers.length}`);
  console.log(`   Referral: ${results.loyalty.referral.referrer_reward}`);

  // Task 3: Response Templates
  console.log('\n📝 Tarefa 3: Templates de Resposta');
  await heartbeat('working', { task: 'response_templates', status: 'in_progress' });
  results.templates = generateResponseTemplates();
  console.log(`   Templates: ${results.templates.length}`);

  await heartbeat('completed', {
    summary: {
      faq_entries: results.faq.total_faqs,
      loyalty_tiers: results.loyalty.tiers.length,
      response_templates: results.templates.length,
      languages_supported: results.faq.languages.length,
    },
  });

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  ✅ Customer Care Agent - Ciclo completo');
  console.log('═══════════════════════════════════════════════════════════════\n');

  return results;
}

runCustomerCareAgent().catch(console.error);
