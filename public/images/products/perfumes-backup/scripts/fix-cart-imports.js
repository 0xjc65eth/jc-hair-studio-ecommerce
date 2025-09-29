#!/usr/bin/env node

/**
 * 🔧 SCRIPT DE CORREÇÃO - IMPORTS DO CARRINHO
 * Consolida todos os imports para o store unificado
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 INICIANDO CORREÇÃO DOS IMPORTS DO CARRINHO\n');

// Arquivos que precisam ser corrigidos
const filesToFix = [
  'components/checkout/CheckoutPage.tsx',
  'components/cart/CartPage.tsx',
  'components/products/UnifiedAddToCartButton.tsx',
  'components/layout/Header.tsx',
  'components/cart/EnhancedCartDrawer.tsx',
  'components/cart/CartDrawer.tsx',
  'components/ui/ProductCard.tsx',
  'components/products/AddToCartButton.tsx',
  'components/cart/CartButton.tsx',
  'components/ui/MiniCart.tsx',
  'components/shared/CartDrawer.tsx',
  'components/shared/AddToCartButton.tsx',
  'components/mega-hair/EnhancedProductCard.tsx'
];

// Padrões de import para substituir
const importPatterns = [
  {
    old: /import.*useEnhancedCartStore.*from.*enhancedCartStore.*/g,
    new: "import { useCart } from '@/lib/stores/cartStore';"
  },
  {
    old: /import.*useUnifiedCartStore.*from.*unifiedCartStore.*/g,
    new: "import { useCart } from '@/lib/stores/cartStore';"
  },
  {
    old: /import.*useCartStore.*from.*cart-store.*/g,
    new: "import { useCart } from '@/lib/stores/cartStore';"
  },
  {
    old: /useEnhancedCartStore\(\)/g,
    new: "useCart()"
  },
  {
    old: /useUnifiedCartStore\(\)/g,
    new: "useCart()"
  }
];

let fixedFiles = 0;
let totalReplacements = 0;

filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let fileChanged = false;
    let replacements = 0;

    // Aplicar todas as substituições
    importPatterns.forEach(pattern => {
      const before = content;
      content = content.replace(pattern.old, pattern.new);
      if (content !== before) {
        fileChanged = true;
        replacements++;
      }
    });

    if (fileChanged) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${filePath} - ${replacements} substituições`);
      fixedFiles++;
      totalReplacements += replacements;
    } else {
      console.log(`➖ ${filePath} - nenhuma alteração necessária`);
    }

  } catch (error) {
    console.log(`❌ Erro ao processar ${filePath}:`, error.message);
  }
});

console.log(`\n📊 RELATÓRIO DE CORREÇÃO:`);
console.log(`✅ Arquivos corrigidos: ${fixedFiles}`);
console.log(`🔄 Total de substituições: ${totalReplacements}`);

// Verificar se há imports restantes dos stores removidos
console.log(`\n🔍 VERIFICANDO IMPORTS RESTANTES...`);

try {
  const grepResult = execSync('grep -r "enhancedCartStore\\|unifiedCartStore\\|cart-store" --include="*.tsx" --include="*.ts" . || true', { encoding: 'utf8' });

  if (grepResult.trim()) {
    console.log(`⚠️  IMPORTS RESTANTES ENCONTRADOS:`);
    console.log(grepResult);
  } else {
    console.log(`✅ Nenhum import problemático encontrado!`);
  }
} catch (error) {
  console.log(`⚠️  Erro na verificação: ${error.message}`);
}

console.log(`\n🎯 CORREÇÃO CONCLUÍDA!`);
console.log(`📝 Próximo passo: Testar o carrinho no navegador`);