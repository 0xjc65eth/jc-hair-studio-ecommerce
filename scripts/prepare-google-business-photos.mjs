#!/usr/bin/env node

/**
 * Google Business Profile Photo Preparation
 *
 * WHY: Prepare optimized photos for Google Business Profile
 * HOW: Select best product images and create download list
 *
 * Google Business Profile photo requirements:
 * - Format: JPG or PNG
 * - Size: Between 10 KB and 5 MB
 * - Recommended resolution: 720px × 720px minimum
 * - Aspect ratio: Prefer square (1:1) or landscape (4:3, 16:9)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://jchairstudios62.xyz';

/**
 * WHY: Find representative product images
 * HOW: Search for diverse product categories
 */
function findProductImages() {
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'products');

  const categories = [
    'g-hair',          // Mega hair
    'honma-tokyo',     // Progressivas
    'forever-liss',    // Tratamentos
    'karssel',         // Alisamentos
    'bio_extratus_produtos_', // Shampoos
    'produtos_diversos' // Maquiagem/Cosméticos
  ];

  const selectedImages = [];

  categories.forEach(category => {
    const categoryPath = path.join(imagesDir, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .slice(0, 3); // 3 images per category

      files.forEach(file => {
        selectedImages.push({
          category: category.replace(/_/g, ' '),
          path: path.join(categoryPath, file),
          url: `${SITE_URL}/images/products/${category}/${file}`,
          filename: file
        });
      });
    }
  });

  return selectedImages;
}

/**
 * WHY: Copy selected images to easy access folder
 * HOW: Create google-business-photos directory
 */
function copyImagesToFolder(images) {
  const outputDir = path.join(process.cwd(), 'google-business-photos');

  // Clean and create directory
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });

  const copiedFiles = [];

  images.forEach((img, index) => {
    const newName = `${index + 1}-${img.category.replace(/\s+/g, '-')}-${img.filename}`;
    const destPath = path.join(outputDir, newName);

    fs.copyFileSync(img.path, destPath);
    copiedFiles.push({
      number: index + 1,
      category: img.category,
      filename: newName,
      path: destPath,
      url: img.url
    });
  });

  return { outputDir, files: copiedFiles };
}

/**
 * Main execution
 */
async function main() {
  console.log('📸 Preparing Google Business Profile photos...\n');

  // Find images
  const images = findProductImages();
  console.log(`✅ Found ${images.length} representative product images`);

  // Copy to accessible folder
  const { outputDir, files } = copyImagesToFolder(images);
  console.log(`✅ Copied ${files.length} images to: ${outputDir}\n`);

  // Create instructions file
  const instructionsPath = path.join(outputDir, 'README.txt');
  const instructions = `
╔════════════════════════════════════════════════════════════════════════╗
║        FOTOS PARA GOOGLE BUSINESS PROFILE - JC HAIR STUDIO           ║
╚════════════════════════════════════════════════════════════════════════╝

📸 TOTAL DE FOTOS PREPARADAS: ${files.length}

📋 COMO USAR:

1. Abrir Google Business Profile:
   🔗 https://www.google.com/business/

2. Fazer login com sua conta Google

3. Ir em "Fotos" no menu lateral

4. Clicar em "Adicionar fotos"

5. Selecionar TODAS as fotos desta pasta:
   ${outputDir}

6. Categorizar as fotos:
   - Produtos: TODAS as fotos (são produtos)
   - Logo: Use se tiver logo da empresa
   - Capa: Escolha 1-2 fotos principais

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📸 LISTA DE FOTOS:

${files.map(f => `${f.number}. ${f.category} - ${f.filename}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ CHECKLIST:

[ ] Abrir Google Business Profile
[ ] Fazer upload de todas as ${files.length} fotos
[ ] Marcar fotos como "Produtos"
[ ] Adicionar descrição em cada foto (opcional):
    - Exemplo: "Mega hair 100% natural - JC Hair Studio"
[ ] Publicar fotos

💡 DICAS:

• Adicione pelo menos 10 fotos para melhor visibilidade
• Atualize fotos regularmente (mensal)
• Fotos de produtos aumentam conversões em 30%
• Use fotos de alta qualidade (estas já estão otimizadas!)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆘 PRECISA DE MAIS FOTOS?

Execute novamente: npm run seo:prepare-photos

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Criado em: ${new Date().toLocaleString('pt-PT')}
`;

  fs.writeFileSync(instructionsPath, instructions, 'utf-8');

  // Print summary
  console.log('━'.repeat(70));
  console.log('📋 PRÓXIMOS PASSOS:');
  console.log('━'.repeat(70));
  console.log('\n1. Abra a pasta de fotos:');
  console.log(`   ${outputDir}`);
  console.log('\n2. Acesse Google Business Profile:');
  console.log('   🔗 https://www.google.com/business/\n');
  console.log('3. Faça upload de TODAS as fotos da pasta');
  console.log('\n4. Leia as instruções completas em:');
  console.log(`   ${instructionsPath}\n`);
  console.log('━'.repeat(70));
  console.log(`✅ ${files.length} fotos prontas para upload!`);
  console.log('━'.repeat(70));
  console.log('\n💡 Abrindo pasta de fotos...\n');

  // Open folder automatically
  try {
    if (process.platform === 'darwin') {
      await execAsync(`open "${outputDir}"`);
      console.log('✅ Pasta aberta no Finder!');
    } else if (process.platform === 'win32') {
      await execAsync(`explorer "${outputDir}"`);
      console.log('✅ Pasta aberta no Explorer!');
    } else {
      await execAsync(`xdg-open "${outputDir}"`);
      console.log('✅ Pasta aberta!');
    }
  } catch (error) {
    console.log(`⚠️  Abra manualmente: ${outputDir}`);
  }

  console.log('\n🌐 Após fazer upload, abra:');
  console.log('   https://www.google.com/business/\n');
}

main().catch(console.error);
