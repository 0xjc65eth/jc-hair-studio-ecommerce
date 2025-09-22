#!/usr/bin/env npx tsx

import { seedComprehensiveDatabase } from '../lib/seeders/comprehensive-products';

async function main() {
  try {
    console.log('🚀 Iniciando processo de seeding completo...');

    const result = await seedComprehensiveDatabase();

    console.log('\n🎉 Processo concluído com sucesso!');
    console.log(`📊 Resumo:`);
    console.log(`   - Categorias: ${result.categories}`);
    console.log(`   - Produtos: ${result.products}`);
    console.log(`   - Distribuição por categoria:`);

    result.productsByCategory.forEach(cat => {
      console.log(`     • ${cat._id}: ${cat.count} produtos`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro no processo de seeding:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default main;