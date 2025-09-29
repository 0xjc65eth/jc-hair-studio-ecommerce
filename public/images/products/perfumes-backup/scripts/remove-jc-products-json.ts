#!/usr/bin/env node

/**
 * Script para remover produtos JC Hair Studio dos arquivos JSON
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'lib/data');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

interface Product {
  id: string;
  name: string;
  brand?: string;
  manufacturer?: string;
  [key: string]: any;
}

function createBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function loadJsonFile(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

function saveJsonFile(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function isJCProduct(product: Product): boolean {
  // Convert product to string to search in all fields
  const productStr = JSON.stringify(product).toLowerCase();

  // Check for JC Hair Studio patterns
  if (productStr.includes('jc hair studio')) {
    return true;
  }

  // Check specific fields
  const checkFields = [
    product.name,
    product.brand,
    product.manufacturer,
    product.title,
    product.productLine,
    product.seo?.title,
    product.seo?.description
  ];

  return checkFields.some(field => {
    if (!field) return false;
    const lower = field.toLowerCase();
    return lower.includes('jc hair studio') ||
           lower.includes('jc:') ||
           (product.brand && product.brand.toLowerCase() === 'jc');
  });
}

function extractAllProducts(data: any, path: string = ''): Product[] {
  let products: Product[] = [];

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      if (item && typeof item === 'object') {
        if (item.name || item.title) {
          products.push(item);
        } else {
          products.push(...extractAllProducts(item, `${path}[${index}]`));
        }
      }
    });
  } else if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      if (key === 'metadata') return; // Skip metadata

      const value = data[key];
      if (Array.isArray(value)) {
        products.push(...extractAllProducts(value, `${path}.${key}`));
      } else if (value && typeof value === 'object') {
        if (value.name || value.title) {
          products.push(value);
        } else {
          products.push(...extractAllProducts(value, `${path}.${key}`));
        }
      }
    });
  }

  return products;
}

function removeJCProductsFromObject(obj: any): { modified: boolean, removedCount: number } {
  let modified = false;
  let removedCount = 0;

  if (Array.isArray(obj)) {
    const originalLength = obj.length;
    for (let i = obj.length - 1; i >= 0; i--) {
      if (obj[i] && typeof obj[i] === 'object') {
        if (obj[i].name || obj[i].title) {
          if (isJCProduct(obj[i])) {
            obj.splice(i, 1);
            removedCount++;
            modified = true;
          }
        } else {
          const result = removeJCProductsFromObject(obj[i]);
          if (result.modified) {
            modified = true;
            removedCount += result.removedCount;
          }
        }
      }
    }
  } else if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (key === 'metadata') return; // Skip metadata

      const value = obj[key];
      if (value) {
        const result = removeJCProductsFromObject(value);
        if (result.modified) {
          modified = true;
          removedCount += result.removedCount;
        }
      }
    });
  }

  return { modified, removedCount };
}

function processJsonFile(fileName: string, dryRun = true): { removed: Product[], kept: any } {
  const filePath = path.join(DATA_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  File not found: ${fileName}`);
    return { removed: [], kept: null };
  }

  const data = loadJsonFile(filePath);
  if (!data) {
    return { removed: [], kept: null };
  }

  // Extract all products recursively
  const allProducts = extractAllProducts(data);
  const jcProducts = allProducts.filter(isJCProduct);

  console.log(`   📄 ${fileName}:`);
  console.log(`      - Total products found: ${allProducts.length}`);
  console.log(`      - JC products: ${jcProducts.length}`);

  if (jcProducts.length > 0) {
    console.log(`      - Sample JC products:`);
    jcProducts.slice(0, 3).forEach(p => {
      console.log(`        * ${p.name || p.title} (${p.brand || 'No brand'})`);
    });
  }

  if (jcProducts.length > 0 && !dryRun) {
    // Create backup
    const backupFile = path.join(BACKUP_DIR, `${fileName}.${Date.now()}.backup`);
    fs.copyFileSync(filePath, backupFile);
    console.log(`      ✅ Backup created: ${path.basename(backupFile)}`);

    // Remove JC products from the data structure
    const dataCopy = JSON.parse(JSON.stringify(data));
    const result = removeJCProductsFromObject(dataCopy);

    if (result.modified) {
      saveJsonFile(filePath, dataCopy);
      console.log(`      ✅ File updated, removed ${result.removedCount} products`);
    }
  }

  return { removed: jcProducts, kept: data };
}

function main() {
  const args = process.argv.slice(2);
  const isDryRun = !args.includes('--execute');

  console.log('========================================');
  console.log('JC Hair Studio Product Removal (JSON)');
  console.log('========================================');

  if (isDryRun) {
    console.log('🔍 Running in DRY RUN mode');
    console.log('   Add --execute flag to actually remove products');
  } else {
    console.log('⚠️  EXECUTE MODE - Files will be modified!');
    console.log('   Press Ctrl+C within 3 seconds to cancel...');
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    sleep(3000);
  }

  createBackupDir();

  console.log('\n📂 Processing JSON files...\n');

  const jsonFiles = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'))
    .sort();

  let totalRemoved = 0;
  const allRemovedProducts: Product[] = [];

  for (const file of jsonFiles) {
    const result = processJsonFile(file, isDryRun);
    if (result.removed.length > 0) {
      totalRemoved += result.removed.length;
      allRemovedProducts.push(...result.removed);
    }
  }

  console.log('\n========================================');
  console.log('📊 Summary:');
  console.log(`   Total JC products found: ${totalRemoved}`);

  if (totalRemoved > 0 && allRemovedProducts.length > 0) {
    console.log('\n📋 Sample of products to be removed:');
    allRemovedProducts.slice(0, 10).forEach(p => {
      console.log(`   - ${p.name || p.title || 'Unnamed'} (${p.brand || 'No brand'})`);
    });
    if (allRemovedProducts.length > 10) {
      console.log(`   ... and ${allRemovedProducts.length - 10} more`);
    }

    // Save full list to backup
    const listFile = path.join(BACKUP_DIR, `jc-products-list-${Date.now()}.json`);
    saveJsonFile(listFile, {
      timestamp: new Date().toISOString(),
      total: allRemovedProducts.length,
      products: allRemovedProducts
    });
    console.log(`\n✅ Full product list saved to: ${path.basename(listFile)}`);
  }

  if (!isDryRun && totalRemoved > 0) {
    console.log('\n✅ JC Hair Studio products have been removed from JSON files');
  }
}

// Run the script
main();