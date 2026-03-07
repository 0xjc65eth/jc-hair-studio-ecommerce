#!/usr/bin/env node

/**
 * JC Hair Studio - Run All Agents
 *
 * Executa todos os agentes de IA em sequência ou paralelo.
 *
 * Uso:
 *   node paperclip/scripts/run-all-agents.mjs              # Executa todos sequencialmente
 *   node paperclip/scripts/run-all-agents.mjs --parallel    # Executa todos em paralelo
 *   node paperclip/scripts/run-all-agents.mjs --agent=cmo   # Executa apenas um agente
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const agentsDir = join(__dirname, '..', 'agents');

const agents = [
  { id: 'marketing', file: 'marketing-agent.mjs', name: 'CMO Marketing Digital' },
  { id: 'sales', file: 'sales-agent.mjs', name: 'Gestor de Vendas' },
  { id: 'operations', file: 'operations-agent.mjs', name: 'Gestor de Operações' },
  { id: 'customer', file: 'customer-care-agent.mjs', name: 'Atendimento ao Cliente' },
  { id: 'analytics', file: 'analytics-agent.mjs', name: 'Analista de Dados' },
];

const flags = {
  parallel: process.argv.includes('--parallel'),
  agent: process.argv.find((a) => a.startsWith('--agent='))?.split('=')[1],
};

function runAgent(agent) {
  return new Promise((resolve, reject) => {
    console.log(`\n🤖 Iniciando: ${agent.name}`);
    const child = spawn('node', [join(agentsDir, agent.file)], {
      stdio: 'inherit',
      env: { ...process.env },
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${agent.name} - Completo`);
        resolve();
      } else {
        console.error(`❌ ${agent.name} - Falhou (código ${code})`);
        reject(new Error(`Agent ${agent.id} failed with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  JC Hair Studio - Executor de Agentes AI');
  console.log('═══════════════════════════════════════════════════════════════');

  let agentsToRun = agents;

  if (flags.agent) {
    agentsToRun = agents.filter((a) => a.id.includes(flags.agent));
    if (agentsToRun.length === 0) {
      console.error(`❌ Agente "${flags.agent}" não encontrado`);
      console.log('   Agentes disponíveis:', agents.map((a) => a.id).join(', '));
      process.exit(1);
    }
  }

  console.log(`\n📋 Agentes: ${agentsToRun.length}`);
  console.log(`⚡ Modo: ${flags.parallel ? 'Paralelo' : 'Sequencial'}\n`);

  const startTime = Date.now();

  try {
    if (flags.parallel) {
      await Promise.all(agentsToRun.map(runAgent));
    } else {
      for (const agent of agentsToRun) {
        await runAgent(agent);
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`  ✅ Todos os agentes completaram em ${elapsed}s`);
    console.log('═══════════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('\n❌ Erro ao executar agentes:', error.message);
    process.exit(1);
  }
}

main();
