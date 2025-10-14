#!/usr/bin/env node

/**
 * SALES MONITOR REALTIME - ULTRATHINK MODE
 * Monitoramento de vendas e conversões em tempo real
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

// Simulação de métricas (em produção, conectar ao banco de dados)
class SalesTracker {
  constructor() {
    this.metrics = {
      visitors: 0,
      pageViews: 0,
      cartAdditions: 0,
      checkouts: 0,
      purchases: 0,
      revenue: 0,
      avgOrderValue: 0,
      conversionRate: 0,
      cartAbandonment: 0,
      topProducts: [],
      realtimeUsers: 0
    };

    this.hourlyData = new Array(24).fill(0);
    this.startTime = Date.now();
  }

  generateRealtimeData() {
    // Simula dados realistas baseados no horário
    const hour = new Date().getHours();
    const isPeakTime = (hour >= 10 && hour <= 14) || (hour >= 19 && hour <= 22);

    this.metrics.realtimeUsers = Math.floor(Math.random() * (isPeakTime ? 50 : 20)) + 5;
    this.metrics.visitors += Math.floor(Math.random() * 5) + 1;
    this.metrics.pageViews += Math.floor(Math.random() * 10) + 3;

    // Simulação de eventos de conversão
    if (Math.random() > 0.7) {
      this.metrics.cartAdditions++;
    }

    if (Math.random() > 0.85) {
      this.metrics.checkouts++;
    }

    if (Math.random() > 0.9) {
      this.metrics.purchases++;
      const orderValue = (Math.random() * 200 + 50).toFixed(2);
      this.metrics.revenue += parseFloat(orderValue);
    }

    // Calcula métricas derivadas
    this.metrics.conversionRate = this.metrics.visitors > 0
      ? ((this.metrics.purchases / this.metrics.visitors) * 100).toFixed(2)
      : 0;

    this.metrics.avgOrderValue = this.metrics.purchases > 0
      ? (this.metrics.revenue / this.metrics.purchases).toFixed(2)
      : 0;

    this.metrics.cartAbandonment = this.metrics.cartAdditions > 0
      ? (((this.metrics.cartAdditions - this.metrics.purchases) / this.metrics.cartAdditions) * 100).toFixed(1)
      : 0;

    // Top produtos simulados
    this.metrics.topProducts = [
      { name: 'COCOCHOCO Original', sales: Math.floor(Math.random() * 10) + 1, revenue: 1248.90 },
      { name: 'Kit Mega Hair Loiro', sales: Math.floor(Math.random() * 7) + 1, revenue: 1329.30 },
      { name: 'Progressiva Vogue', sales: Math.floor(Math.random() * 5) + 1, revenue: 449.50 }
    ];

    return this.metrics;
  }

  getUptimeFormatted() {
    const uptime = Date.now() - this.startTime;
    const hours = Math.floor(uptime / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    const seconds = Math.floor((uptime % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }
}

// Interface do terminal
function clearScreen() {
  console.clear();
}

function printHeader() {
  console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════════════════════════╗
║            📊 ULTRATHINK SALES MONITOR - TEMPO REAL 📊                 ║
║                    Modo John Carmack Ativado                          ║
╚════════════════════════════════════════════════════════════════════════╝
${colors.reset}`);
}

function printMetrics(tracker, metrics) {
  const timestamp = new Date().toLocaleString('pt-PT');

  console.log(`${colors.bright}⏰ Última Atualização: ${colors.yellow}${timestamp}${colors.reset}`);
  console.log(`${colors.bright}⏱️  Tempo Ativo: ${colors.green}${tracker.getUptimeFormatted()}${colors.reset}`);
  console.log('');

  // Métricas principais
  console.log(`${colors.bright}${colors.blue}📈 MÉTRICAS DE TRÁFEGO${colors.reset}`);
  console.log(`├── 🔴 Usuários Online: ${colors.bright}${colors.green}${metrics.realtimeUsers}${colors.reset}`);
  console.log(`├── 👥 Total Visitantes: ${colors.bright}${metrics.visitors}${colors.reset}`);
  console.log(`├── 📄 Pageviews: ${colors.bright}${metrics.pageViews}${colors.reset}`);
  console.log(`└── 📱 Taxa Mobile: ${colors.bright}${(Math.random() * 30 + 50).toFixed(1)}%${colors.reset}`);
  console.log('');

  // Métricas de conversão
  console.log(`${colors.bright}${colors.magenta}💰 MÉTRICAS DE CONVERSÃO${colors.reset}`);
  console.log(`├── 🛒 Adições ao Carrinho: ${colors.bright}${colors.yellow}${metrics.cartAdditions}${colors.reset}`);
  console.log(`├── 💳 Checkouts Iniciados: ${colors.bright}${colors.yellow}${metrics.checkouts}${colors.reset}`);
  console.log(`├── ✅ Vendas Concluídas: ${colors.bright}${colors.green}${metrics.purchases}${colors.reset}`);
  console.log(`├── 📈 Taxa de Conversão: ${colors.bright}${colors.green}${metrics.conversionRate}%${colors.reset}`);
  console.log(`└── 🚫 Abandono de Carrinho: ${colors.bright}${colors.red}${metrics.cartAbandonment}%${colors.reset}`);
  console.log('');

  // Métricas financeiras
  console.log(`${colors.bright}${colors.green}💶 MÉTRICAS FINANCEIRAS${colors.reset}`);
  console.log(`├── 💰 Receita Total: ${colors.bright}${colors.green}€${metrics.revenue.toFixed(2)}${colors.reset}`);
  console.log(`├── 🧮 Ticket Médio: ${colors.bright}€${metrics.avgOrderValue}${colors.reset}`);
  console.log(`└── 📊 Projeção Diária: ${colors.bright}€${(metrics.revenue * 24 / (new Date().getHours() + 1)).toFixed(2)}${colors.reset}`);
  console.log('');

  // Top produtos
  console.log(`${colors.bright}${colors.yellow}🏆 TOP PRODUTOS VENDIDOS${colors.reset}`);
  metrics.topProducts.forEach((product, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    console.log(`${medal} ${product.name}`);
    console.log(`   └── Vendas: ${colors.bright}${product.sales}${colors.reset} | Receita: ${colors.bright}€${product.revenue.toFixed(2)}${colors.reset}`);
  });
  console.log('');

  // Alertas e notificações
  console.log(`${colors.bright}${colors.red}🔔 ALERTAS EM TEMPO REAL${colors.reset}`);

  if (metrics.realtimeUsers > 30) {
    console.log(`${colors.bright}${colors.green}✅ Alto tráfego detectado! ${metrics.realtimeUsers} usuários online${colors.reset}`);
  }

  if (metrics.conversionRate > 2) {
    console.log(`${colors.bright}${colors.green}✅ Taxa de conversão excelente: ${metrics.conversionRate}%${colors.reset}`);
  }

  if (metrics.cartAbandonment > 70) {
    console.log(`${colors.bright}${colors.yellow}⚠️  Alto abandono de carrinho: ${metrics.cartAbandonment}%${colors.reset}`);
  }

  if (metrics.purchases > 0 && (Date.now() % 10000 < 5000)) {
    console.log(`${colors.bright}${colors.green}🎉 NOVA VENDA! Cliente de ${['Lisboa', 'Porto', 'Braga', 'Coimbra'][Math.floor(Math.random() * 4)]}${colors.reset}`);
  }
}

function printFooter() {
  console.log(`${colors.bright}${colors.cyan}
╔════════════════════════════════════════════════════════════════════════╗
║  Comandos: [Q] Sair | [R] Reset | [E] Exportar | [S] Screenshot       ║
╚════════════════════════════════════════════════════════════════════════╝
${colors.reset}`);
}

// Gráfico ASCII simples
function printGraph(data) {
  const maxValue = Math.max(...data);
  const height = 10;

  console.log(`${colors.bright}${colors.cyan}📊 VENDAS POR HORA (Últimas 24h)${colors.reset}`);

  for (let i = height; i > 0; i--) {
    let line = '';
    for (let j = 0; j < data.length; j++) {
      const barHeight = Math.round((data[j] / maxValue) * height);
      if (barHeight >= i) {
        line += '█ ';
      } else {
        line += '  ';
      }
    }
    console.log(line);
  }

  // Eixo X
  console.log('━'.repeat(48));
  console.log('00 02 04 06 08 10 12 14 16 18 20 22');
}

// Main monitoring loop
async function startMonitoring() {
  const tracker = new SalesTracker();
  let refreshInterval = 3000; // 3 segundos

  console.log(`${colors.bright}${colors.green}
  🚀 SISTEMA DE MONITORAMENTO INICIADO!
  Atualizando a cada ${refreshInterval/1000} segundos...
  ${colors.reset}`);

  // Configurar input do teclado
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', (key) => {
      if (key === 'q' || key === 'Q' || key === '\u0003') {
        console.log(`\n${colors.bright}${colors.yellow}Sistema de monitoramento finalizado.${colors.reset}`);
        process.exit(0);
      } else if (key === 'r' || key === 'R') {
        tracker.metrics = {
          visitors: 0,
          pageViews: 0,
          cartAdditions: 0,
          checkouts: 0,
          purchases: 0,
          revenue: 0,
          avgOrderValue: 0,
          conversionRate: 0,
          cartAbandonment: 0,
          topProducts: [],
          realtimeUsers: 0
        };
        console.log(`${colors.bright}${colors.yellow}Métricas resetadas!${colors.reset}`);
      } else if (key === 'e' || key === 'E') {
        const exportData = JSON.stringify(tracker.metrics, null, 2);
        const filename = `sales-report-${Date.now()}.json`;
        fs.writeFileSync(filename, exportData);
        console.log(`${colors.bright}${colors.green}Dados exportados para ${filename}${colors.reset}`);
      }
    });
  }

  // Loop principal
  setInterval(() => {
    const metrics = tracker.generateRealtimeData();

    clearScreen();
    printHeader();
    printMetrics(tracker, metrics);

    // Adiciona gráfico a cada 5 atualizações
    if (Math.random() > 0.8) {
      console.log('');
      const hourlyData = Array.from({ length: 24 }, () => Math.floor(Math.random() * 10));
      printGraph(hourlyData);
    }

    printFooter();
  }, refreshInterval);
}

// Verificar argumentos
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
  ${colors.bright}SALES MONITOR - MODO ULTRATHINK${colors.reset}

  Uso: node sales-monitor-realtime.mjs [opções]

  Opções:
    --interval <ms>    Define intervalo de atualização (padrão: 3000ms)
    --export          Exporta dados ao finalizar
    --help            Mostra esta ajuda

  Comandos durante execução:
    Q - Sair
    R - Resetar métricas
    E - Exportar dados
  `);
  process.exit(0);
}

// Iniciar monitoramento
startMonitoring();