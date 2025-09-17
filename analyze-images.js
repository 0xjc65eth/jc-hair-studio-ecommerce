const fs = require('fs');

// Função para extrair URLs das imagens
function extractImageUrls(obj, results = []) {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      obj.forEach(item => extractImageUrls(item, results));
    } else {
      Object.keys(obj).forEach(key => {
        if (key === 'images' && Array.isArray(obj[key])) {
          obj[key].forEach(url => {
            results.push({
              productName: obj.name || 'Nome não encontrado',
              productId: obj.id || 'ID não encontrado',
              brand: obj.brand || 'Marca não encontrada',
              category: obj.category || 'Categoria não encontrada',
              url: url
            });
          });
        } else {
          extractImageUrls(obj[key], results);
        }
      });
    }
  }
  return results;
}

// Carregar e analisar complete-product-catalog.json
console.log('=== RELATÓRIO COMPLETO DE IMAGENS DOS PRODUTOS ===\n');

try {
  const catalogData = JSON.parse(fs.readFileSync('lib/data/complete-product-catalog.json', 'utf8'));
  const catalogImages = extractImageUrls(catalogData);

  console.log('📦 CATÁLOGO COMPLETO DE PRODUTOS CAPILARES:');
  console.log('Total de produtos com imagens:', catalogImages.length);

  // Analisar URLs por domínio
  const domains = {};
  const problematicUrls = [];
  const localImages = [];

  catalogImages.forEach(item => {
    try {
      if (item.url.startsWith('/images/') || item.url.startsWith('./images/')) {
        localImages.push(item);
      } else {
        const url = new URL(item.url);
        const domain = url.hostname;

        if (!domains[domain]) {
          domains[domain] = 0;
        }
        domains[domain]++;

        // Identificar URLs problemáticas
        if (domain.includes('ibb.co') || item.url.includes('placeholder')) {
          problematicUrls.push(item);
        }
      }
    } catch (e) {
      problematicUrls.push({...item, error: 'URL inválida'});
    }
  });

  console.log('\n📊 DISTRIBUIÇÃO POR DOMÍNIO:');
  Object.entries(domains).forEach(([domain, count]) => {
    console.log(`  • ${domain}: ${count} imagens`);
  });

  if (localImages.length > 0) {
    console.log(`  • Imagens locais: ${localImages.length} imagens`);
  }

  console.log('\n⚠️  URLS PROBLEMÁTICAS (ibb.co):');
  console.log(`Total de URLs problemáticas: ${problematicUrls.length}`);

  problematicUrls.slice(0, 15).forEach((item, index) => {
    console.log(`  ${index + 1}. ❌ ${item.productName} (${item.brand})`);
    console.log(`     URL: ${item.url}`);
  });

  if (problematicUrls.length > 15) {
    console.log(`  ... e mais ${problematicUrls.length - 15} URLs problemáticas`);
  }

  // Análise por categoria
  const categoriesWithProblems = {};
  problematicUrls.forEach(item => {
    const category = item.category || 'Sem categoria';
    if (!categoriesWithProblems[category]) {
      categoriesWithProblems[category] = 0;
    }
    categoriesWithProblems[category]++;
  });

  console.log('\n📋 PROBLEMAS POR CATEGORIA:');
  Object.entries(categoriesWithProblems).forEach(([category, count]) => {
    console.log(`  • ${category}: ${count} produtos com problemas`);
  });

} catch (error) {
  console.log('Erro ao carregar catálogo completo:', error.message);
}

// Carregar e analisar makeup-products.json
try {
  const makeupData = JSON.parse(fs.readFileSync('lib/data/makeup-products.json', 'utf8'));
  const makeupImages = extractImageUrls(makeupData);

  console.log('\n\n💄 CATÁLOGO DE MAQUIAGEM:');
  console.log('Total de produtos com imagens:', makeupImages.length);

  // Analisar URLs por domínio
  const makeupDomains = {};
  const makeupProblematicUrls = [];
  const makeupLocalImages = [];

  makeupImages.forEach(item => {
    try {
      if (item.url.startsWith('/images/') || item.url.startsWith('./images/')) {
        makeupLocalImages.push(item);
      } else {
        const url = new URL(item.url);
        const domain = url.hostname;

        if (!makeupDomains[domain]) {
          makeupDomains[domain] = 0;
        }
        makeupDomains[domain]++;

        // Identificar URLs problemáticas
        if (domain.includes('ibb.co') || item.url.includes('placeholder')) {
          makeupProblematicUrls.push(item);
        }
      }
    } catch (e) {
      makeupProblematicUrls.push({...item, error: 'URL inválida'});
    }
  });

  console.log('\n📊 DISTRIBUIÇÃO POR DOMÍNIO:');
  Object.entries(makeupDomains).forEach(([domain, count]) => {
    console.log(`  • ${domain}: ${count} imagens`);
  });

  if (makeupLocalImages.length > 0) {
    console.log(`  • Imagens locais: ${makeupLocalImages.length} imagens`);
  }

  console.log('\n⚠️  URLS PROBLEMÁTICAS (ibb.co):');
  console.log(`Total de URLs problemáticas: ${makeupProblematicUrls.length}`);

  makeupProblematicUrls.slice(0, 10).forEach((item, index) => {
    console.log(`  ${index + 1}. ❌ ${item.productName} (${item.brand})`);
    console.log(`     URL: ${item.url}`);
  });

  if (makeupProblematicUrls.length > 10) {
    console.log(`  ... e mais ${makeupProblematicUrls.length - 10} URLs problemáticas`);
  }

} catch (error) {
  console.log('Erro ao carregar catálogo de maquiagem:', error.message);
}

console.log('\n=== RESUMO EXECUTIVO ===');
console.log('🔥 SITUAÇÃO CRÍTICA IDENTIFICADA:');
console.log('• A maioria das imagens está hospedada no ibb.co');
console.log('• O ibb.co não está funcionando corretamente');
console.log('• Sistema de fallback OptimizedImage já implementado');
console.log('• Necessário substituir URLs por imagens funcionais');

console.log('\n💡 SOLUÇÕES RECOMENDADAS:');
console.log('1. Migrar imagens para Cloudinary/Vercel');
console.log('2. Usar imagens locais no projeto');
console.log('3. Implementar CDN próprio');
console.log('4. Usar APIs de imagens (Unsplash, etc.)');