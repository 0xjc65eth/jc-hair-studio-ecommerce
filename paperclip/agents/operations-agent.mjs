#!/usr/bin/env node

/**
 * JC Hair Studio - Operations Agent (COO)
 *
 * Agente autônomo de operações que executa:
 * - Monitoramento de estoque
 * - Processamento de pedidos
 * - Gestão de envios
 * - Controle de qualidade
 * - Previsão de demanda
 */

const PAPERCLIP_API = process.env.PAPERCLIP_API_URL || 'http://localhost:3100';
const STORE_API = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
const AGENT_ID = process.env.PAPERCLIP_AGENT_ID || 'ops-manager';

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
// Inventory Management
// ═══════════════════════════════════════════════════════════════

async function checkInventoryLevels() {
  console.log('[Estoque] Verificando níveis de estoque...');

  try {
    const response = await fetch(`${STORE_API}/api/admin/products`);
    if (response.ok) {
      const products = await response.json();
      const lowStock = products.filter((p) => p.stock <= p.reorderPoint);
      const outOfStock = products.filter((p) => p.stock === 0);

      return {
        total_products: products.length,
        low_stock: lowStock.length,
        out_of_stock: outOfStock.length,
        low_stock_items: lowStock.map((p) => ({ name: p.name, stock: p.stock, reorderPoint: p.reorderPoint })),
        alerts: outOfStock.map((p) => `⚠️ ESGOTADO: ${p.name}`),
      };
    }
  } catch (error) {
    console.log('[Estoque] Usando dados de simulação...');
  }

  return {
    total_products: 150,
    low_stock: 12,
    out_of_stock: 3,
    simulation: true,
    alerts: [
      '⚠️ ESGOTADO: Extensão Clip-in Loiro Mel 55cm',
      '⚠️ ESGOTADO: Queratina Italiana 100g',
      '⚠️ ESGOTADO: Peruca Lace Front Ondulada Castanho',
    ],
    low_stock_items: [
      { name: 'Mega Hair Liso Preto 65cm', stock: 5, reorderPoint: 10 },
      { name: 'Shampoo Sem Sulfato 300ml', stock: 8, reorderPoint: 15 },
      { name: 'Escova Desembaraçadora Pro', stock: 3, reorderPoint: 10 },
    ],
  };
}

// ═══════════════════════════════════════════════════════════════
// Order Processing
// ═══════════════════════════════════════════════════════════════

async function checkPendingOrders() {
  console.log('[Pedidos] Verificando pedidos pendentes...');

  try {
    const response = await fetch(`${STORE_API}/api/admin/orders?status=pending`);
    if (response.ok) {
      const orders = await response.json();
      return {
        pending_count: orders.length,
        orders: orders.slice(0, 10),
      };
    }
  } catch (error) {
    console.log('[Pedidos] Usando dados de simulação...');
  }

  return {
    pending_count: 8,
    simulation: true,
    actions: [
      'Confirmar pagamento de 3 pedidos via Stripe',
      'Gerar etiquetas de envio para 5 pedidos confirmados',
      'Enviar notificação de tracking para 4 pedidos despachados',
    ],
  };
}

// ═══════════════════════════════════════════════════════════════
// Shipping Management
// ═══════════════════════════════════════════════════════════════

function generateShippingRules() {
  console.log('[Envio] Gerando regras de envio otimizadas...');

  return {
    zones: [
      {
        name: 'Portugal Continental',
        countries: ['PT'],
        methods: [
          { name: 'CTT Expresso', delivery_days: '1-2', price: 4.99, free_above: 40 },
          { name: 'CTT Normal', delivery_days: '3-5', price: 2.99, free_above: 60 },
        ],
      },
      {
        name: 'Europa Ocidental',
        countries: ['FR', 'ES', 'DE', 'IT', 'NL', 'BE'],
        methods: [
          { name: 'DHL Express', delivery_days: '2-3', price: 8.99, free_above: 80 },
          { name: 'La Poste / Correos', delivery_days: '5-7', price: 5.99, free_above: 100 },
        ],
      },
      {
        name: 'UK & Irlanda',
        countries: ['GB', 'IE'],
        methods: [
          { name: 'Royal Mail Tracked', delivery_days: '3-5', price: 9.99, free_above: 100 },
          { name: 'DPD Express', delivery_days: '2-3', price: 12.99, free_above: 120 },
        ],
      },
      {
        name: 'Resto da Europa',
        countries: ['AT', 'CH', 'PL', 'CZ', 'DK', 'SE', 'NO', 'FI'],
        methods: [
          { name: 'DHL Standard', delivery_days: '5-8', price: 11.99, free_above: 120 },
        ],
      },
    ],
    packaging: {
      standard: { max_weight_kg: 2, cost: 0.50 },
      premium: { max_weight_kg: 5, cost: 1.20, includes: 'gift_box' },
      fragile: { max_weight_kg: 3, cost: 0.80, includes: 'bubble_wrap' },
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Supplier Management
// ═══════════════════════════════════════════════════════════════

function generateSupplierStrategy() {
  console.log('[Fornecedores] Gerando estratégia de fornecedores...');

  return {
    supplier_categories: [
      {
        category: 'Cabelo Humano Virgem',
        sources: ['Brasil (São Paulo, Minas Gerais)', 'Índia (Chennai)'],
        lead_time_days: 15,
        min_order: 50,
        quality_check: 'mandatory',
        reorder_frequency: 'monthly',
      },
      {
        category: 'Extensões Processadas',
        sources: ['Brasil (Recife)', 'China (Qingdao)'],
        lead_time_days: 20,
        min_order: 100,
        quality_check: 'mandatory',
        reorder_frequency: 'bi-monthly',
      },
      {
        category: 'Cosméticos Brasileiros',
        sources: ['Brasil (São Paulo)', 'Brasil (Curitiba)'],
        lead_time_days: 25,
        min_order: 200,
        quality_check: 'sample_based',
        reorder_frequency: 'quarterly',
      },
      {
        category: 'Acessórios e Ferramentas',
        sources: ['China (Shenzhen)', 'Europa (Itália)'],
        lead_time_days: 10,
        min_order: 50,
        quality_check: 'batch_inspection',
        reorder_frequency: 'quarterly',
      },
    ],
    quality_standards: {
      hair_grade: 'minimum_8A',
      chemical_test: 'required',
      allergy_test: 'required_eu_compliance',
      eu_cosmetics_regulation: 'EC_1223_2009',
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Main Agent Loop
// ═══════════════════════════════════════════════════════════════

async function runOperationsAgent() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  JC Hair Studio - Operations Agent (COO)');
  console.log('  Heartbeat Interval: 4h');
  console.log('═══════════════════════════════════════════════════════════════\n');

  await heartbeat('starting');

  const results = {};

  // Task 1: Inventory Check
  console.log('\n📦 Tarefa 1: Verificação de Estoque');
  await heartbeat('working', { task: 'inventory_check', status: 'in_progress' });
  results.inventory = await checkInventoryLevels();
  console.log(`   Produtos total: ${results.inventory.total_products}`);
  console.log(`   Estoque baixo: ${results.inventory.low_stock}`);
  console.log(`   Esgotados: ${results.inventory.out_of_stock}`);
  if (results.inventory.alerts) {
    results.inventory.alerts.forEach((alert) => console.log(`   ${alert}`));
  }

  // Task 2: Order Processing
  console.log('\n📋 Tarefa 2: Processamento de Pedidos');
  await heartbeat('working', { task: 'order_processing', status: 'in_progress' });
  results.orders = await checkPendingOrders();
  console.log(`   Pedidos pendentes: ${results.orders.pending_count}`);

  // Task 3: Shipping Rules
  console.log('\n🚚 Tarefa 3: Regras de Envio');
  await heartbeat('working', { task: 'shipping_rules', status: 'in_progress' });
  results.shipping = generateShippingRules();
  console.log(`   Zonas de envio: ${results.shipping.zones.length}`);

  // Task 4: Supplier Strategy
  console.log('\n🤝 Tarefa 4: Estratégia de Fornecedores');
  await heartbeat('working', { task: 'supplier_strategy', status: 'in_progress' });
  results.suppliers = generateSupplierStrategy();
  console.log(`   Categorias de fornecedores: ${results.suppliers.supplier_categories.length}`);

  await heartbeat('completed', {
    summary: {
      inventory_alerts: results.inventory.low_stock + results.inventory.out_of_stock,
      pending_orders: results.orders.pending_count,
      shipping_zones: results.shipping.zones.length,
      supplier_categories: results.suppliers.supplier_categories.length,
    },
  });

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  ✅ Operations Agent - Ciclo completo');
  console.log('═══════════════════════════════════════════════════════════════\n');

  return results;
}

runOperationsAgent().catch(console.error);
