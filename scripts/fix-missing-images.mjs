import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFile = path.join(__dirname, '../lib/data/products-with-european-pricing.json');
const jsonData = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

console.log('=== CORREÇÃO AUTOMÁTICA DE IMAGENS ===\n');

// Mapear imagens disponíveis por categoria
const imageMap = {
  // Progressivas e BTX
  'cadiveu-professional-brasil-cacau-1l': '/images/products/cadiveu/cadiveu-1.png',
  'cadiveu-professional-brasil-cacau-300ml': '/images/products/cadiveu/cadiveu-2.png',
  'forever-liss-btx-zero-formol-250g': '/images/products/forever-liss/forever-liss-1.png',
  'forever-liss-btx-zero-formol-1kg': '/images/products/forever-liss/forever-liss-2.png',

  // BTX genéricos
  'btx-professional-premium-01': '/images/products/botox/botox_1.png',
  'btx-repair-intensive-03': '/images/products/botox/botox_3.png',
  'btx-collagen-boost-05': '/images/products/botox/botox_4.png',
  'btx-vitamin-complex-07': '/images/products/botox/botox_6.png',
  'btx-argan-oil-09': '/images/products/botox/botox_2.png',
  'btx-ultra-reconstruction-12': '/images/products/botox/botox_7.png',
  'professional-btx-therapy-14': '/images/products/botox/botox_8.png',
  'premium-btx-diamond-15': '/images/products/botox/botox_9.png',

  // Progressivas diversas
  'progressiva-advanced-02': '/images/products/progressivas_diversas/progressivas_diversas_7.png',
  'progressiva-keratin-04': '/images/products/progressivas_diversas/progressivas_diversas_8.png',
  'progressiva-silk-protein-06': '/images/products/progressivas_diversas/progressivas_diversas_9.png',
  'progressiva-nano-technology-08': '/images/products/progressivas_diversas/progressivas_diversas_10.png',
  'progressiva-diamond-shine-10': '/images/products/progressivas_diversas/progressivas_diversas_12.png',
  'advanced-progressive-system-11': '/images/products/progressivas_diversas/progressivas_diversas_13.png',
  'luxury-progressive-gold-13': '/images/products/progressivas_diversas/progressivas_diversas_14.png',
  'royal-progressive-platinum-16': '/images/products/progressivas_diversas/progressivas_diversas_15.png',

  // COCOCHOCO e novos produtos
  'cocochoco-original-premium': '/images/products/cadiveu/cadiveu-3.png',
  'cocochoco-gold-premium': '/images/products/cadiveu/cadiveu-4.png',
  'nuance-liso-perfect': '/images/products/cadiveu/cadiveu-5.png',
  'ineya-professional-keratin': '/images/products/cadiveu/cadiveu-6.png',
  'relaxamento-keratin-smooth': '/images/products/forever-liss/forever-liss-3.png',

  // Bases Bruna Tavares
  'bruna-tavares-bt-skin-d10': '/images/products/bruna-tavares-bt-skin/BT Skin D10 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-d20': '/images/products/bruna-tavares-bt-skin/BT Skin D20 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-d30': '/images/products/bruna-tavares-bt-skin/BT Skin D30 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-d40': '/images/products/bruna-tavares-bt-skin/BT Skin D40 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-d50': '/images/products/bruna-tavares-bt-skin/BT Skin D50 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-d60': '/images/products/bruna-tavares-bt-skin/BT Skin D60 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-f10': '/images/products/bruna-tavares-bt-skin/BT Skin F10 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-f20': '/images/products/bruna-tavares-bt-skin/BT Skin F20 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-f30': '/images/products/bruna-tavares-bt-skin/BT Skin F30 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-f40': '/images/products/bruna-tavares-bt-skin/BT Skin F40 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-f50': '/images/products/bruna-tavares-bt-skin/BT Skin F50 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-f60': '/images/products/bruna-tavares-bt-skin/BT Skin F60 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-l10': '/images/products/bruna-tavares-bt-skin/BT Skin L10 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-l20': '/images/products/bruna-tavares-bt-skin/BT Skin L20 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-l30': '/images/products/bruna-tavares-bt-skin/BT Skin L30 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-l40': '/images/products/bruna-tavares-bt-skin/BT Skin L40 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-l50': '/images/products/bruna-tavares-bt-skin/BT Skin L50 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-l60': '/images/products/bruna-tavares-bt-skin/BT Skin L60 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-m10': '/images/products/bruna-tavares-bt-skin/BT Skin M10 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-m20': '/images/products/bruna-tavares-bt-skin/BT Skin M20 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-m30': '/images/products/bruna-tavares-bt-skin/BT Skin M30 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-m40': '/images/products/bruna-tavares-bt-skin/BT Skin M40 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-m50': '/images/products/bruna-tavares-bt-skin/BT Skin M50 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-m60': '/images/products/bruna-tavares-bt-skin/BT Skin M60 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-t10': '/images/products/bruna-tavares-bt-skin/BT Skin T10 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-t20': '/images/products/bruna-tavares-bt-skin/BT Skin T20 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-t30': '/images/products/bruna-tavares-bt-skin/BT Skin T30 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-t40': '/images/products/bruna-tavares-bt-skin/BT Skin T40 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-t50': '/images/products/bruna-tavares-bt-skin/BT Skin T50 Base Bruna Tavares.png',
  'bruna-tavares-bt-skin-t60': '/images/products/bruna-tavares-bt-skin/BT Skin T60 Base Bruna Tavares.png',

  // Bases Mari Maria
  'mari-maria-base-amndoa': '/images/products/mari-maria-bases/mari-maria-base-amndoa.png',
  'mari-maria-base-baunilha': '/images/products/mari-maria-bases/mari-maria-base-baunilha.png',
  'mari-maria-base-bege-claro': '/images/products/mari-maria-bases/mari-maria-base-bege-claro.png',
  'mari-maria-base-bege-escuro': '/images/products/mari-maria-bases/mari-maria-base-bege-escuro.png',
  'mari-maria-base-bege-medio': '/images/products/mari-maria-bases/mari-maria-base-bege-mdio.png',
  'mari-maria-base-cacau': '/images/products/mari-maria-bases/mari-maria-base-cacau.png',
  'mari-maria-base-canela': '/images/products/mari-maria-bases/mari-maria-base-canela.png',
  'mari-maria-base-caramelo': '/images/products/mari-maria-bases/mari-maria-base-caramelo.png',
  'mari-maria-base-chocolate': '/images/products/mari-maria-bases/mari-maria-base-chocolate.png',
  'mari-maria-base-nude': '/images/products/mari-maria-bases/mari-maria-base-nude.png',

  // Bio Extratus
  'bio-extratus-hidratacao-intensiva': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__1.png',

  // Colorações (15 produtos) - usando imagens de g-hair e inoar disponíveis
  'professional-color-01': '/images/products/g-hair/g-hair-1.png',
  'professional-color-02': '/images/products/g-hair/g-hair-2.png',
  'professional-color-03': '/images/products/g-hair/g-hair-3.png',
  'professional-color-04': '/images/products/g-hair/g-hair-4.png',
  'intensive-color-05': '/images/products/g-hair/g-hair-5.png',
  'salon-grade-color-06': '/images/products/g-hair/g-hair-6.png',
  'ultra-color-07': '/images/products/inoar/inoar-1.png',
  'master-color-08': '/images/products/honma-tokyo/honma-1.png',
  'elite-color-09': '/images/products/honma-tokyo/honma-2.png',
  'platinum-color-10': '/images/products/honma-tokyo/honma-3.png',
  'elite-coloracao-premium-11': '/images/products/honma-tokyo/honma-4.png',
  'supreme-color-intensive-12': '/images/products/karssel/karssel-1.png',
  'luxury-color-diamond-13': '/images/products/felps/felps-1.png',
  'professional-color-platinum-14': '/images/products/maria-escandalosa/maria-1.png',
  'royal-color-exclusive-15': '/images/products/g-hair/inoar-ghair-alemanha-3.png',

  // Tratamentos Capilares (15 produtos) - usando Bio Extratus disponíveis
  'advanced-treatment-system-16': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__2.png',
  'intensive-repair-therapy-17': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__3.png',
  'professional-nutrition-complex-18': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__4.png',
  'ultra-hydration-therapy-19': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__5.png',
  'regenerative-treatment-premium-20': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__6.png',
  'premium-hidratacao-intensiva-1': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__7.png',
  'nutricao-avancada-2': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__8.png',
  'reconstrucao-total-3': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__9.png',
  'mascara-nutritiva-4': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__10.png',
  'ampola-fortalecimento-5': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__11.png',
  'serum-anti-frizz-6': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__12.png',
  'oleo-capilar-7': '/images/products/oleo-argan.jpg',
  'creme-leave-in-8': '/images/products/leave-in-hidratante.jpg',
  'mascara-reparadora-9': '/images/products/mascara-reparadora.jpg',
  'tonico-crescimento-10': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__13.png',
  'spray-termoativo-11': '/images/products/bio_extratus_produtos_/bio_extratus_produtos__14.png',
  'condicionador-profundo-12': '/images/products/cronograma-capilar.jpg',
  'serum-antiqueda-13': '/images/products/ampola-reconstruction.jpg',
  'mascara-detox-14': '/images/products/mascara-matizadora.jpg',
  'ampola-shock-15': '/images/products/felps/felps-sos-1.png',

  // Maquiagem Premium genérica (9 produtos) - usando produtos disponíveis
  'premium-lipstick-01': '/images/products/mari-maria-lipsticks/Batom-Liquido-Creamy-Matte---Blazing---Mari-Maria-Makeup.png',
  'premium-foundation-02': '/images/products/base-fran/fran-c01.png',
  'premium-concealer-03': '/images/products/base-fran/fran-m01.png',
  'premium-mascara-04': '/images/products/pam-by-pamella/MÁSCARA PARA CÍLIOS MAX TURBO PAM BY PAMELLA.png',
  'premium-eyeshadow-05': '/images/products/pam-by-pamella/PALETA DE SOMBRAS 16 CORES 16 PRECIOSOS! PAM BY PAMELLA.png',
  'premium-blush-06': '/images/products/pam-by-pamella/PALETA MULTIFUNCIONAL 9 CORES - CONTORNO + BLUSH + ILUMINADOR 9 NECESSÁRIOS! PAM BY PAMELLA.png',
  'premium-eyeliner-07': '/images/products/pam-by-pamella/CANETA DELINEADORA PARA OLHOS SPEED PAM BY PAMELLA.png',
  'premium-powder-08': '/images/products/pam-by-pamella/PRIMER SOFT FOCUS DRIFT PAM BY PAMELLA.png',
  'produto-teste-001': '/images/products/bruna-tavares-bt-transition/BT Transition.png',
};

let updatedCount = 0;
let notFoundCount = 0;

// Atualizar produtos com imagens
jsonData.categories.forEach(category => {
  if (category.products) {
    category.products.forEach(product => {
      if (!product.image || product.image === '' || product.image.includes('placeholder')) {
        if (imageMap[product.id]) {
          product.image = imageMap[product.id];
          updatedCount++;
          console.log(`✓ ${product.name} -> ${product.image}`);
        } else {
          notFoundCount++;
          console.log(`✗ ${product.name} -> IMAGEM NÃO ENCONTRADA NO MAPEAMENTO!`);
        }
      }
    });
  }
});

// Salvar JSON atualizado
fs.writeFileSync(productsFile, JSON.stringify(jsonData, null, 2), 'utf8');

console.log('\n=== RESUMO DA CORREÇÃO ===');
console.log(`Produtos atualizados com imagens reais: ${updatedCount}`);
console.log(`Produtos sem mapeamento: ${notFoundCount}`);
console.log(`Total corrigido: ${updatedCount}`);

if (notFoundCount === 0) {
  console.log('\n✅ TODOS OS PRODUTOS TÊM IMAGENS REAIS!');
  console.log('✅ Arquivo atualizado com sucesso!');
} else {
  console.log(`\n⚠️  ${notFoundCount} produtos ainda precisam de mapeamento!`);
}
