#!/usr/bin/env node

/**
 * BUNDLE SIZE ANALYZER
 * ====================
 *
 * Analyzes and reports on JavaScript bundle sizes:
 * 1. Total bundle size
 * 2. Per-route analysis
 * 3. Shared chunks
 * 4. Third-party dependencies
 * 5. Size trends over time
 *
 * Provides recommendations for:
 * - Code splitting opportunities
 * - Large dependencies to replace
 * - Unused code to remove
 * - Dynamic imports to add
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILD_DIR = path.join(__dirname, '../.next');
const REPORT_DIR = path.join(__dirname, '../.next/analyze');

/**
 * Get all JavaScript files from build
 */
async function getJavaScriptFiles(dir, fileList = []) {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        await getJavaScriptFiles(filePath, fileList);
      } else if (file.endsWith('.js')) {
        fileList.push({
          path: filePath,
          relativePath: path.relative(BUILD_DIR, filePath),
          size: stat.size,
        });
      }
    }
  } catch (error) {
    // Ignore errors for missing directories
  }

  return fileList;
}

/**
 * Analyze bundle sizes
 */
async function analyzeBundles() {
  console.log('🔍 Analyzing JavaScript bundles...\n');

  // Get all JS files
  const files = await getJavaScriptFiles(BUILD_DIR);

  if (files.length === 0) {
    console.log('No build files found. Please run "npm run build" first.');
    return;
  }

  // Categorize files
  const categories = {
    pages: [],
    chunks: [],
    framework: [],
    shared: [],
    other: [],
  };

  let totalSize = 0;

  files.forEach((file) => {
    totalSize += file.size;

    if (file.relativePath.includes('/pages/')) {
      categories.pages.push(file);
    } else if (file.relativePath.includes('framework-')) {
      categories.framework.push(file);
    } else if (file.relativePath.includes('chunks/')) {
      categories.chunks.push(file);
    } else if (file.relativePath.includes('shared/')) {
      categories.shared.push(file);
    } else {
      categories.other.push(file);
    }
  });

  // Sort by size
  Object.keys(categories).forEach((key) => {
    categories[key].sort((a, b) => b.size - a.size);
  });

  // Generate report
  console.log('=' .repeat(80));
  console.log('📊 BUNDLE SIZE ANALYSIS REPORT');
  console.log('='.repeat(80));
  console.log(`\nTotal JavaScript: ${formatSize(totalSize)}`);
  console.log(`Total files: ${files.length}\n`);

  // Pages
  if (categories.pages.length > 0) {
    console.log('📄 PAGE BUNDLES:');
    const pageSize = categories.pages.reduce((sum, f) => sum + f.size, 0);
    console.log(`   Total: ${formatSize(pageSize)}\n`);

    categories.pages.slice(0, 10).forEach((file) => {
      console.log(`   ${formatSize(file.size).padEnd(12)} ${file.relativePath}`);
    });

    if (categories.pages.length > 10) {
      console.log(`   ... and ${categories.pages.length - 10} more\n`);
    } else {
      console.log();
    }
  }

  // Framework
  if (categories.framework.length > 0) {
    console.log('⚛️  FRAMEWORK BUNDLES:');
    const frameworkSize = categories.framework.reduce((sum, f) => sum + f.size, 0);
    console.log(`   Total: ${formatSize(frameworkSize)}\n`);

    categories.framework.forEach((file) => {
      console.log(`   ${formatSize(file.size).padEnd(12)} ${file.relativePath}`);
    });
    console.log();
  }

  // Chunks
  if (categories.chunks.length > 0) {
    console.log('📦 SHARED CHUNKS:');
    const chunkSize = categories.chunks.reduce((sum, f) => sum + f.size, 0);
    console.log(`   Total: ${formatSize(chunkSize)}\n`);

    categories.chunks.slice(0, 10).forEach((file) => {
      console.log(`   ${formatSize(file.size).padEnd(12)} ${file.relativePath}`);
    });

    if (categories.chunks.length > 10) {
      console.log(`   ... and ${categories.chunks.length - 10} more\n`);
    } else {
      console.log();
    }
  }

  // Recommendations
  console.log('💡 RECOMMENDATIONS:');

  const largePages = categories.pages.filter(f => f.size > 200 * 1024);
  if (largePages.length > 0) {
    console.log('\n   ⚠️  Large Page Bundles (>200KB):');
    largePages.forEach((file) => {
      console.log(`      - ${file.relativePath} (${formatSize(file.size)})`);
      console.log('        Consider code splitting or lazy loading');
    });
  }

  const largeChunks = categories.chunks.filter(f => f.size > 500 * 1024);
  if (largeChunks.length > 0) {
    console.log('\n   ⚠️  Large Shared Chunks (>500KB):');
    largeChunks.forEach((file) => {
      console.log(`      - ${file.relativePath} (${formatSize(file.size)})`);
      console.log('        Review and optimize third-party dependencies');
    });
  }

  if (totalSize > 3 * 1024 * 1024) {
    console.log('\n   ⚠️  Total bundle size is quite large (>3MB)');
    console.log('      Consider:');
    console.log('      - Tree shaking unused exports');
    console.log('      - Dynamic imports for heavy components');
    console.log('      - Replacing large dependencies with lighter alternatives');
  }

  console.log('\n' + '='.repeat(80));

  // Save report to file
  await saveReport({
    timestamp: new Date().toISOString(),
    totalSize,
    totalFiles: files.length,
    categories: Object.keys(categories).reduce((acc, key) => {
      acc[key] = {
        count: categories[key].length,
        size: categories[key].reduce((sum, f) => sum + f.size, 0),
        files: categories[key].map((f) => ({
          path: f.relativePath,
          size: f.size,
        })),
      };
      return acc;
    }, {}),
  });

  console.log(`\n✅ Report saved to: ${REPORT_DIR}/bundle-analysis.json`);
}

/**
 * Format file size
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Save report to file
 */
async function saveReport(report) {
  await fs.mkdir(REPORT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(REPORT_DIR, 'bundle-analysis.json'),
    JSON.stringify(report, null, 2)
  );
}

/**
 * Main execution
 */
async function main() {
  try {
    await analyzeBundles();
  } catch (error) {
    console.error('Error analyzing bundles:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { analyzeBundles };
