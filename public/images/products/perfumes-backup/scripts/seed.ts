#!/usr/bin/env ts-node

import { seedDatabase } from '../lib/seeders/products';

async function runSeed() {
  console.log('🌱 Iniciando processo de seeding do Hair Studio Brasil...');
  
  try {
    await seedDatabase();
    console.log('✅ Processo de seeding concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no processo de seeding:', error);
    process.exit(1);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  runSeed();
}

export { runSeed };