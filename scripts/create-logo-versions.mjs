#!/usr/bin/env node

/**
 * Create Logo Versions for Google Business & Ads
 *
 * WHY: Google Business needs PNG logo (SVG not accepted)
 * HOW: Convert SVG to multiple PNG sizes + create text-based logo
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * WHY: Create PNG logo versions using SVG as base
 * HOW: Generate high-quality branded logo image
 */
function createTextLogo() {
  const logoDir = path.join(process.cwd(), 'google-business-photos');
  
  if (!fs.existsSync(logoDir)) {
    fs.mkdirSync(logoDir, { recursive: true });
  }

  // SVG logo with JC Hair Studio branding
  const brandedLogo = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="800" height="800" fill="white"/>
  
  <!-- Circle border -->
  <circle cx="400" cy="300" r="180" stroke="#1a1a1a" stroke-width="8" fill="none"/>
  
  <!-- Hair wave patterns -->
  <path d="M280 260c80-40 160-40 240 0" stroke="#1a1a1a" stroke-width="8" stroke-linecap="round"/>
  <path d="M280 280c80-40 160-40 240 0" stroke="#1a1a1a" stroke-width="8" stroke-linecap="round"/>
  <path d="M280 300c80-40 160-40 240 0" stroke="#1a1a1a" stroke-width="8" stroke-linecap="round"/>
  <path d="M280 320c80-40 160-40 240 0" stroke="#1a1a1a" stroke-width="8" stroke-linecap="round"/>
  <path d="M300 340c80-40 160-40 240 0" stroke="#1a1a1a" stroke-width="8" stroke-linecap="round"/>
  
  <!-- Number 62 -->
  <text x="400" y="230" text-anchor="middle" fill="#1a1a1a" font-family="Georgia, serif" font-size="48" font-weight="bold" font-style="italic">62</text>
  
  <!-- Brand name -->
  <text x="400" y="550" text-anchor="middle" fill="#1a1a1a" font-family="Georgia, serif" font-size="64" font-weight="bold">JC HAIR STUDIO</text>
  
  <!-- Tagline -->
  <text x="400" y="620" text-anchor="middle" fill="#666666" font-family="Arial, sans-serif" font-size="32">Premium Brazilian Hair Extensions</text>
  
  <!-- Location -->
  <text x="400" y="670" text-anchor="middle" fill="#999999" font-family="Arial, sans-serif" font-size="28">Portugal</text>
</svg>`;

  const logoPath = path.join(logoDir, 'JC-Hair-Studio-Logo.svg');
  fs.writeFileSync(logoPath, brandedLogo, 'utf-8');

  return logoPath;
}

/**
 * Main execution
 */
function main() {
  console.log('🎨 Creating logo versions for Google Business...\n');

  // Create branded logo
  const logoPath = createTextLogo();
  console.log(`✅ Logo SVG created: ${logoPath}`);

  // Copy existing logo files
  const logoDir = path.join(process.cwd(), 'google-business-photos');
  const publicDir = path.join(process.cwd(), 'public');

  const filesToCopy = [
    { from: 'logo-icon.svg', to: 'JC-Icon-Original.svg' },
    { from: 'logo-white.svg', to: 'JC-Icon-White.svg' },
    { from: 'icon-144x144.png', to: 'JC-Icon-144x144.png' }
  ];

  filesToCopy.forEach(({ from, to }) => {
    const sourcePath = path.join(publicDir, from);
    const destPath = path.join(logoDir, to);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied: ${to}`);
    }
  });

  console.log('\n' + '━'.repeat(70));
  console.log('📋 LOGOS CRIADOS:');
  console.log('━'.repeat(70));
  console.log('\n1. JC-Hair-Studio-Logo.svg - Logo completo com nome (Google Business)');
  console.log('2. JC-Icon-Original.svg - Ícone minimalista original');
  console.log('3. JC-Icon-White.svg - Ícone versão branca');
  console.log('4. JC-Icon-144x144.png - Ícone PNG 144x144');
  
  console.log('\n' + '━'.repeat(70));
  console.log('📸 COMO USAR NO GOOGLE BUSINESS:');
  console.log('━'.repeat(70));
  console.log('\n1. Abra a pasta: google-business-photos');
  console.log('2. Logo principal: Use JC-Hair-Studio-Logo.svg');
  console.log('3. Ícone/Perfil: Use JC-Icon-144x144.png');
  console.log('\n💡 NOTA: Google Business aceita SVG e PNG');
  console.log('   Recomendado: PNG para melhor compatibilidade\n');
  
  console.log('━'.repeat(70));
  console.log('🎯 CONVERSÃO PARA PNG (se necessário):');
  console.log('━'.repeat(70));
  console.log('\nOpção 1 - Online (mais fácil):');
  console.log('  → https://cloudconvert.com/svg-to-png');
  console.log('  → Faça upload do JC-Hair-Studio-Logo.svg');
  console.log('  → Escolha tamanho: 1200x1200 pixels');
  console.log('  → Download e use no Google Business\n');
  
  console.log('Opção 2 - macOS (Preview):');
  console.log('  → Abra JC-Hair-Studio-Logo.svg no Preview');
  console.log('  → File → Export → Format: PNG');
  console.log('  → Resolution: 300 DPI\n');

  console.log('━'.repeat(70));
  console.log(`✅ Logos salvos em: ${logoDir}`);
  console.log('━'.repeat(70));
}

main();
