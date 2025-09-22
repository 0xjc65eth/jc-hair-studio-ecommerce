#!/usr/bin/env node

/**
 * Script Multi-Agente para Testes Paralelos
 * Executa múltiplos agentes de teste simultaneamente
 * Cada agente foca em uma área específica do e-commerce
 */

const { spawn } = require("child_process");
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
const path = require("path");

// Configuração dos agentes
const AGENTS = {
  cart: {
    name: "🛒 Cart Agent",
    command: ["npm", "run", "test:cart"],
    description: "Testa funcionalidades do carrinho"
  },
  checkout: {
    name: "💳 Checkout Agent",
    command: ["npm", "run", "test:checkout"],
    description: "Testa fluxo de checkout e pagamentos"
  },
  newsletter: {
    name: "📧 Newsletter Agent",
    command: ["npm", "run", "test:newsletter"],
    description: "Testa inscrição e envio de newsletter"
  },
  account: {
    name: "👤 Account Agent",
    command: ["npm", "run", "test:account"],
    description: "Testa área do cliente e autenticação"
  },
  email: {
    name: "📮 Email Agent",
    command: ["npm", "run", "test:email"],
    description: "Testa sistema de emails (SendGrid)"
  },
  integration: {
    name: "🔧 Integration Agent",
    command: ["npm", "run", "test:integration"],
    description: "Testa integrações e APIs"
  },
  unit: {
    name: "🧪 Unit Test Agent",
    command: ["npm", "run", "test:unit"],
    description: "Testa unidades de código isoladas"
  },
  lint: {
    name: "📝 Code Quality Agent",
    command: ["npm", "run", "lint"],
    description: "Verifica qualidade e padrões do código"
  }
};

// Cores para output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m"
};

function log(color, prefix, message) {
  const timestamp = new Date().toISOString().substr(11, 8);
  console.log(`${color}[${timestamp}] ${prefix}: ${message}${colors.reset}`);
}

function createAgent(agentId, config) {
  return new Promise((resolve) => {
    const startTime = Date.now();

    log(colors.blue, config.name, `Iniciando: ${config.description}`);

    const process = spawn(config.command[0], config.command.slice(1), {
      stdio: "pipe",
      cwd: process.cwd()
    });

    let stdout = "";
    let stderr = "";

    process.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    process.on("exit", (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      if (code === 0) {
        log(colors.green, config.name, `✅ SUCESSO em ${duration}s`);
      } else {
        log(colors.red, config.name, `❌ FALHOU em ${duration}s (código: ${code})`);
        if (stderr) {
          log(colors.red, config.name, `Erro: ${stderr.slice(0, 200)}...`);
        }
      }

      resolve({
        agentId,
        name: config.name,
        success: code === 0,
        duration: parseFloat(duration),
        stdout: stdout.slice(0, 500),
        stderr: stderr.slice(0, 500)
      });
    });

    process.on("error", (error) => {
      log(colors.red, config.name, `💥 ERRO: ${error.message}`);
      resolve({
        agentId,
        name: config.name,
        success: false,
        duration: 0,
        error: error.message
      });
    });
  });
}

async function runMultiAgentTests() {
  console.log(`${colors.cyan}
╔══════════════════════════════════════════════════════════════╗
║              🤖 SISTEMA MULTI-AGENTE DE TESTES              ║
║                     JC Hair Studio's 62                     ║
╠══════════════════════════════════════════════════════════════╣
║  Agentes ativos: ${Object.keys(AGENTS).length.toString().padEnd(40)}    ║
║  Execução: Paralela                                         ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

  const startTime = Date.now();

  // Iniciar todos os agentes em paralelo
  const agentPromises = Object.entries(AGENTS).map(([id, config]) =>
    createAgent(id, config)
  );

  log(colors.magenta, "🚀 SISTEMA", `Lançando ${agentPromises.length} agentes em paralelo...`);

  // Aguardar todos os agentes terminarem
  const results = await Promise.all(agentPromises);

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  // Relatório final
  console.log(`\n${colors.cyan}
╔══════════════════════════════════════════════════════════════╗
║                     📊 RELATÓRIO MULTI-AGENTE               ║
╠══════════════════════════════════════════════════════════════╣
║  Tempo total: ${totalDuration.padEnd(42)}s  ║
║  Agentes bem-sucedidos: ${successful.toString().padEnd(32)}  ║
║  Agentes falharam: ${failed.toString().padEnd(35)}  ║
║  Taxa de sucesso: ${((successful/results.length)*100).toFixed(1).padEnd(33)}%  ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}`);

  // Detalhes por agente
  console.log(`\n${colors.white}📋 Detalhes por agente:${colors.reset}`);
  results.forEach(result => {
    const status = result.success ? "✅" : "❌";
    const duration = result.duration ? `${result.duration}s` : "N/A";
    console.log(`${status} ${result.name}: ${duration}`);
  });

  // Agentes que falharam
  const failedAgents = results.filter(r => !r.success);
  if (failedAgents.length > 0) {
    console.log(`\n${colors.red}⚠️  Agentes que falharam:${colors.reset}`);
    failedAgents.forEach(agent => {
      console.log(`${colors.red}   - ${agent.name}${colors.reset}`);
      if (agent.error) {
        console.log(`${colors.red}     Erro: ${agent.error}${colors.reset}`);
      }
    });
  }

  // Código de saída
  if (failed === 0) {
    log(colors.green, "🎉 SISTEMA", "Todos os agentes concluídos com sucesso!");
    process.exit(0);
  } else {
    log(colors.red, "💥 SISTEMA", `${failed} agente(s) falharam`);
    process.exit(1);
  }
}

// Loop contínuo com múltiplos agentes
async function runContinuousMultiAgent() {
  const LOOP_INTERVAL = 60000; // 1 minuto entre execuções
  let executionCount = 0;

  console.log(`${colors.magenta}
🔄 MODO LOOP CONTÍNUO ATIVADO
Execuções a cada ${LOOP_INTERVAL/1000}s
Pressione Ctrl+C para parar
${colors.reset}`);

  const runLoop = async () => {
    executionCount++;
    console.log(`\n${colors.yellow}🔄 Execução #${executionCount} iniciada${colors.reset}`);

    try {
      await runMultiAgentTests();
    } catch (error) {
      log(colors.red, "💥 SISTEMA", `Erro na execução #${executionCount}: ${error.message}`);
    }

    const nextRun = new Date(Date.now() + LOOP_INTERVAL);
    log(colors.blue, "⏰ SISTEMA", `Próxima execução: ${nextRun.toLocaleTimeString()}`);
  };

  // Executar imediatamente
  await runLoop();

  // Configurar loop
  const intervalId = setInterval(runLoop, LOOP_INTERVAL);

  // Graceful shutdown
  process.on('SIGINT', () => {
    clearInterval(intervalId);
    log(colors.yellow, "🛑 SISTEMA", `Loop parado após ${executionCount} execuções`);
    process.exit(0);
  });
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);
const isLoopMode = args.includes("--loop") || args.includes("-l");
const agentCount = parseInt(args.find(arg => arg.startsWith("--agents="))?.split("=")[1]) || Object.keys(AGENTS).length;

if (isLoopMode) {
  runContinuousMultiAgent();
} else {
  runMultiAgentTests();
}