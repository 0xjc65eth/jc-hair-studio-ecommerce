#!/usr/bin/env node

/**
 * JC Hair Studio - Paperclip AI Setup Script
 *
 * Configura a empresa no Paperclip AI com todos os agentes,
 * departamentos, metas e workflows de automação.
 *
 * Uso: node paperclip/setup.mjs [--reset] [--dry-run]
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAPERCLIP_API = process.env.PAPERCLIP_API_URL || 'http://localhost:3100';

const flags = {
  reset: process.argv.includes('--reset'),
  dryRun: process.argv.includes('--dry-run'),
};

function loadConfig(filename) {
  const path = join(__dirname, 'config', filename);
  return JSON.parse(readFileSync(path, 'utf-8'));
}

async function apiCall(method, endpoint, body = null) {
  const url = `${PAPERCLIP_API}${endpoint}`;

  if (flags.dryRun) {
    console.log(`[DRY RUN] ${method} ${url}`);
    if (body) console.log(JSON.stringify(body, null, 2));
    return { ok: true, data: { id: 'dry-run-id' } };
  }

  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error ${response.status}: ${text}`);
  }
  return response.json();
}

async function checkHealth() {
  console.log('\n🔍 Verificando conexão com Paperclip...');
  try {
    const health = await apiCall('GET', '/api/health');
    console.log('✅ Paperclip está rodando:', health);
    return true;
  } catch (error) {
    console.error('❌ Paperclip não está acessível em', PAPERCLIP_API);
    console.error('   Certifique-se de que o Paperclip está rodando.');
    console.error('   Execute: npx paperclipai onboard --yes');
    return false;
  }
}

async function createCompany(companyConfig) {
  console.log('\n🏢 Criando empresa:', companyConfig.company.name);

  const company = await apiCall('POST', '/api/companies', {
    name: companyConfig.company.name,
    description: companyConfig.company.description,
    mission: companyConfig.company.mission,
    metadata: {
      industry: companyConfig.company.industry,
      website: companyConfig.company.website,
      locale: companyConfig.company.locale,
      target_markets: companyConfig.company.target_markets,
      currency: companyConfig.company.currency,
      timezone: companyConfig.company.timezone,
      brand: companyConfig.brand,
    },
  });

  console.log('✅ Empresa criada com ID:', company.data?.id || company.id);
  return company.data?.id || company.id;
}

async function createDepartments(companyId, departments) {
  console.log('\n📋 Criando departamentos...');

  const departmentIds = {};
  for (const dept of departments) {
    const result = await apiCall('POST', `/api/companies/${companyId}/departments`, {
      name: dept.name,
      description: dept.description,
      externalId: dept.id,
    });
    departmentIds[dept.id] = result.data?.id || result.id;
    console.log(`  ✅ ${dept.name}`);
  }

  return departmentIds;
}

async function createAgents(companyId, agents, departmentIds) {
  console.log('\n🤖 Contratando agentes AI...');

  const agentIds = {};
  for (const agent of agents) {
    const result = await apiCall('POST', `/api/companies/${companyId}/agents`, {
      name: agent.name,
      role: agent.role,
      description: agent.description,
      runtime: agent.runtime,
      departmentId: agent.department ? departmentIds[agent.department] : null,
      capabilities: agent.capabilities,
      schedule: agent.schedule,
      budget: agent.budget,
      reportsTo: agent.reports_to ? agentIds[agent.reports_to] : null,
      metadata: {
        integrations: agent.integrations || [],
      },
    });
    agentIds[agent.id] = result.data?.id || result.id;
    console.log(`  ✅ ${agent.name} (${agent.role}) - ${agent.runtime}`);
  }

  return agentIds;
}

async function createGoals(companyId, goalsConfig, agentIds) {
  console.log('\n🎯 Definindo metas e objetivos...');

  const goalIds = {};

  // Mission
  const mission = goalsConfig.mission;
  const missionResult = await apiCall('POST', `/api/companies/${companyId}/goals`, {
    title: mission.title,
    description: mission.description,
    type: 'mission',
    kpis: mission.kpis,
  });
  goalIds[mission.id] = missionResult.data?.id || missionResult.id;
  console.log(`  🏆 Missão: ${mission.title}`);

  // Strategic goals
  for (const goal of goalsConfig.strategic) {
    const result = await apiCall('POST', `/api/companies/${companyId}/goals`, {
      title: goal.title,
      parentId: goalIds[goal.parent],
      ownerId: agentIds[goal.owner],
      type: 'strategic',
      deadline: goal.deadline,
      kpis: goal.kpis,
    });
    goalIds[goal.id] = result.data?.id || result.id;
    console.log(`  📊 Estratégica: ${goal.title}`);
  }

  // Tactical goals with tasks
  for (const goal of goalsConfig.tactical) {
    const result = await apiCall('POST', `/api/companies/${companyId}/goals`, {
      title: goal.title,
      parentId: goalIds[goal.parent],
      ownerId: agentIds[goal.owner],
      type: 'tactical',
      tasks: goal.tasks.map((task) => ({
        title: task,
        status: 'pending',
      })),
    });
    goalIds[goal.id] = result.data?.id || result.id;
    console.log(`  📌 Tática: ${goal.title} (${goal.tasks.length} tarefas)`);
  }

  return goalIds;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  JC Hair Studio - Configuração Paperclip AI');
  console.log('  Orquestração de IA para gestão completa da empresa');
  console.log('═══════════════════════════════════════════════════════════════');

  if (flags.dryRun) {
    console.log('\n⚠️  Modo DRY RUN - Nenhuma alteração será feita\n');
  }

  // Load configurations
  const companyConfig = loadConfig('company.json');
  const agentsConfig = loadConfig('agents.json');
  const goalsConfig = loadConfig('goals.json');

  // Check Paperclip health
  if (!flags.dryRun) {
    const healthy = await checkHealth();
    if (!healthy) {
      console.log('\n📦 Para instalar o Paperclip, execute:');
      console.log('   npx paperclipai onboard --yes');
      console.log('\n   Ou inicie o servidor:');
      console.log('   cd paperclip && pnpm dev');
      process.exit(1);
    }
  }

  try {
    // Step 1: Create company
    const companyId = await createCompany(companyConfig);

    // Step 2: Create departments
    const departmentIds = await createDepartments(companyId, companyConfig.departments);

    // Step 3: Create agents
    const agentIds = await createAgents(companyId, agentsConfig.agents, departmentIds);

    // Step 4: Create goals
    const goalIds = await createGoals(companyId, goalsConfig.goals, agentIds);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ✅ CONFIGURAÇÃO COMPLETA!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`\n  🏢 Empresa: ${companyConfig.company.name}`);
    console.log(`  📋 Departamentos: ${companyConfig.departments.length}`);
    console.log(`  🤖 Agentes: ${agentsConfig.agents.length}`);
    console.log(`  🎯 Metas: ${Object.keys(goalIds).length}`);
    console.log(`\n  🌐 Dashboard: ${PAPERCLIP_API}`);
    console.log(`  📊 API: ${PAPERCLIP_API}/api/companies`);
    console.log('\n  Próximos passos:');
    console.log('  1. Acesse o dashboard do Paperclip');
    console.log('  2. Revise e aprove os agentes contratados');
    console.log('  3. Configure as chaves de API das integrações');
    console.log('  4. Ative os heartbeats dos agentes');
    console.log('═══════════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('\n❌ Erro durante a configuração:', error.message);
    process.exit(1);
  }
}

main();
