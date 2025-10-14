#!/usr/bin/env node
/**
 * Script para aplicar correções aos produtos:
 * 1. Renomear categoria "tratamentos-capilares" → "relaxamentos"
 * 2. Aplicar mapeamento de imagens aos produtos sem imagem
 *
 * FASE 3, 4 e 5 combinadas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminhos dos arquivos
const JSON_FILE = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const MAPPING_FILE = path.join(__dirname, '../MAPEAMENTO-IMAGENS-PRODUTOS-FASE-2.json');
const BACKUP_DIR = path.join(__dirname, '../backups');

// Criar diretório de backup se não existir
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Criar backup
const timestamp = Date.now();
const backupFile = path.join(BACKUP_DIR, `products-european-pricing-backup-${timestamp}.json`);

console.log('📦 Criando backup...');
const originalData = fs.readFileSync(JSON_FILE, 'utf8');
fs.writeFileSync(backupFile, originalData);
console.log(`✅ Backup criado: ${path.basename(backupFile)}\n`);

// Carregar dados
console.log('📂 Carregando dados...');
const productsData = JSON.parse(originalData);
const mappingData = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));

// Estatísticas
let stats = {
  categoriasRenomeadas: 0,
  imagensAdicionadas: 0,
  produtosAtualizados: 0
};

// FASE 3: Renomear categoria "tratamentos-capilares" → "relaxamentos"
console.log('\n🔄 FASE 3: Renomeando categoria "tratamentos-capilares" → "relaxamentos"...');
productsData.categories.forEach(category => {
  if (category.id === 'tratamentos-capilares') {
    console.log(`   Renomeando categoria: "${category.name}" → "Relaxamentos"`);
    category.id = 'relaxamentos';
    category.name = 'Relaxamentos';
    category.slug = 'relaxamentos';
    category.description = 'Relaxamentos intensivos: hidratação, nutrição, reconstrução e controle de volume capilar';
    stats.categoriasRenomeadas++;
  }
});

console.log(`✅ ${stats.categoriasRenomeadas} categoria(s) renomeada(s)\n`);

// FASE 5: Aplicar mapeamento de imagens
console.log('🖼️  FASE 5: Aplicando mapeamento de imagens...\n');

// Criar mapa de mapeamentos para acesso rápido
const imageMap = new Map();
[...mappingData.progressivas_btx.mapeamento, ...mappingData.tratamentos_capilares.mapeamento].forEach(item => {
  imageMap.set(item.produtoId, item.imagemNova);
});

// Aplicar mapeamentos
productsData.categories.forEach(category => {
  category.products.forEach(product => {
    if (imageMap.has(product.id)) {
      const newImage = imageMap.get(product.id);
      const oldImage = product.image || 'null';

      if (oldImage === 'null' || oldImage === null) {
        console.log(`   ✅ ${product.id}`);
        console.log(`      ${product.name}`);
        console.log(`      Imagem: ${newImage}\n`);

        product.image = newImage;
        stats.imagensAdicionadas++;
        stats.produtosAtualizados++;
      }
    }
  });
});

console.log(`✅ ${stats.imagensAdicionadas} imagens adicionadas`);
console.log(`✅ ${stats.produtosAtualizados} produtos atualizados\n`);

// Salvar arquivo atualizado
console.log('💾 Salvando alterações...');
fs.writeFileSync(JSON_FILE, JSON.stringify(productsData, null, 2));
console.log('✅ Arquivo atualizado com sucesso!\n');

// Resumo final
console.log('═══════════════════════════════════════════════════════════');
console.log('📊 RESUMO DAS ALTERAÇÕES:');
console.log('═══════════════════════════════════════════════════════════');
console.log(`Categorias renomeadas: ${stats.categoriasRenomeadas}`);
console.log(`Imagens adicionadas: ${stats.imagensAdicionadas}`);
console.log(`Produtos atualizados: ${stats.produtosAtualizados}`);
console.log(`\nBackup salvo em: ${path.basename(backupFile)}`);
console.log('═══════════════════════════════════════════════════════════\n');

console.log('✨ CONCLUÍDO! Alterações aplicadas com sucesso.\n');
