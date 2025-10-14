#!/usr/bin/env node

/**
 * PERFORMANCE OPTIMIZATION VERIFICATION
 * ======================================
 *
 * Verifies that all performance optimizations are properly installed
 * and configured. Run this after setup to ensure everything is ready.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  bright: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function check(condition, message) {
  if (condition) {
    log(`✓ ${message}`, 'green');
    return true;
  } else {
    log(`✗ ${message}`, 'red');
    return false;
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function verifyPerformanceSetup() {
  log('\n╔═══════════════════════════════════════════════════════════════════════════╗', 'bright');
  log('║                                                                           ║', 'bright');
  log('║         PERFORMANCE OPTIMIZATION VERIFICATION                            ║', 'bright');
  log('║         Checking installation and configuration...                       ║', 'bright');
  log('║                                                                           ║', 'bright');
  log('╚═══════════════════════════════════════════════════════════════════════════╝', 'bright');
  console.log();

  let allPassed = true;
  let passedChecks = 0;
  let totalChecks = 0;

  // Check 1: Scripts
  log('1. Performance Scripts', 'blue');
  totalChecks += 3;
  passedChecks += check(
    await fileExists(path.join(__dirname, 'scripts/optimize-images-webp.mjs')),
    'Image optimization script'
  ) ? 1 : 0;
  passedChecks += check(
    await fileExists(path.join(__dirname, 'scripts/analyze-bundle-size.mjs')),
    'Bundle analysis script'
  ) ? 1 : 0;
  passedChecks += check(
    await fileExists(path.join(__dirname, 'scripts/optimize-performance-complete.mjs')),
    'Complete optimization script'
  ) ? 1 : 0;
  console.log();

  // Check 2: Components
  log('2. Performance Components', 'blue');
  totalChecks += 3;
  passedChecks += check(
    await fileExists(path.join(__dirname, 'components/performance/PerformanceImageLoader.tsx')),
    'Performance Image Loader'
  ) ? 1 : 0;
  passedChecks += check(
    await fileExists(path.join(__dirname, 'components/performance/CoreWebVitals.tsx')),
    'Core Web Vitals Monitor'
  ) ? 1 : 0;
  passedChecks += check(
    await fileExists(path.join(__dirname, 'components/performance/PerformanceMonitor.tsx')),
    'Performance Dashboard'
  ) ? 1 : 0;
  console.log();

  // Check 3: Configuration
  log('3. Configuration Files', 'blue');
  totalChecks += 2;
  passedChecks += check(
    await fileExists(path.join(__dirname, 'next.config.js')),
    'Next.js configuration'
  ) ? 1 : 0;
  passedChecks += check(
    await fileExists(path.join(__dirname, 'middleware-performance.ts')),
    'Performance middleware'
  ) ? 1 : 0;
  console.log();

  // Check 4: Documentation
  log('4. Documentation', 'blue');
  totalChecks += 3;
  passedChecks += check(
    await fileExists(path.join(__dirname, 'PERFORMANCE-OPTIMIZATION.md')),
    'Full optimization guide'
  ) ? 1 : 0;
  passedChecks += check(
    await fileExists(path.join(__dirname, 'OPTIMIZATION-SUMMARY.md')),
    'Optimization summary'
  ) ? 1 : 0;
  passedChecks += check(
    await fileExists(path.join(__dirname, 'QUICKSTART-PERFORMANCE.md')),
    'Quick start guide'
  ) ? 1 : 0;
  console.log();

  // Check 5: Dependencies
  log('5. Required Dependencies', 'blue');
  try {
    const packageJson = JSON.parse(
      await fs.readFile(path.join(__dirname, 'package.json'), 'utf-8')
    );

    totalChecks += 3;
    passedChecks += check(
      packageJson.devDependencies?.sharp !== undefined,
      'sharp (image optimization)'
    ) ? 1 : 0;
    passedChecks += check(
      packageJson.devDependencies?.['web-vitals'] !== undefined,
      'web-vitals (performance monitoring)'
    ) ? 1 : 0;

    const hasPerformanceScripts = packageJson.scripts?.['perf:all'] !== undefined;
    passedChecks += check(
      hasPerformanceScripts,
      'Performance npm scripts'
    ) ? 1 : 0;
  } catch (error) {
    log('✗ Error reading package.json', 'red');
    allPassed = false;
  }
  console.log();

  // Check 6: Next.js Configuration
  log('6. Next.js Optimizations', 'blue');
  try {
    const configContent = await fs.readFile(path.join(__dirname, 'next.config.js'), 'utf-8');

    totalChecks += 5;
    passedChecks += check(
      configContent.includes('swcMinify: true'),
      'SWC minification enabled'
    ) ? 1 : 0;
    passedChecks += check(
      configContent.includes("formats: ['image/webp', 'image/avif']"),
      'WebP/AVIF image formats'
    ) ? 1 : 0;
    passedChecks += check(
      configContent.includes('minimumCacheTTL: 31536000'),
      'Long-term image caching'
    ) ? 1 : 0;
    passedChecks += check(
      configContent.includes('optimizeCss: true'),
      'CSS optimization'
    ) ? 1 : 0;
    passedChecks += check(
      configContent.includes('modularizeImports'),
      'Modular imports (tree shaking)'
    ) ? 1 : 0;
  } catch (error) {
    log('✗ Error reading next.config.js', 'red');
    allPassed = false;
  }
  console.log();

  // Summary
  log('═'.repeat(80), 'bright');
  log('VERIFICATION SUMMARY', 'bright');
  log('═'.repeat(80), 'bright');
  console.log();

  const percentage = Math.round((passedChecks / totalChecks) * 100);
  const status = percentage === 100 ? 'PERFECT' : percentage >= 80 ? 'GOOD' : 'NEEDS ATTENTION';
  const statusColor = percentage === 100 ? 'green' : percentage >= 80 ? 'yellow' : 'red';

  log(`Passed: ${passedChecks}/${totalChecks} checks (${percentage}%)`, statusColor);
  log(`Status: ${status}`, statusColor);
  console.log();

  if (percentage === 100) {
    log('🎉 All performance optimizations are properly configured!', 'green');
    console.log();
    log('Next steps:', 'blue');
    console.log('  1. npm run perf:all        - Run complete optimization');
    console.log('  2. npm run build           - Build for production');
    console.log('  3. npm run start           - Test locally');
    console.log('  4. vercel deploy --prod    - Deploy to production');
  } else if (percentage >= 80) {
    log('⚠️  Most optimizations are configured, but some checks failed.', 'yellow');
    console.log();
    log('Recommended actions:', 'blue');
    console.log('  1. Review failed checks above');
    console.log('  2. Run: npm install');
    console.log('  3. Re-run this verification');
  } else {
    log('❌ Some critical optimizations are missing.', 'red');
    console.log();
    log('Required actions:', 'blue');
    console.log('  1. Review all failed checks');
    console.log('  2. Run: npm install');
    console.log('  3. Check documentation: PERFORMANCE-OPTIMIZATION.md');
    console.log('  4. Re-run this verification');
  }

  console.log();
  log('Documentation:', 'blue');
  console.log('  - QUICKSTART-PERFORMANCE.md    - Quick start (5 minutes)');
  console.log('  - OPTIMIZATION-SUMMARY.md      - Complete summary');
  console.log('  - PERFORMANCE-OPTIMIZATION.md  - Full guide');
  console.log();

  process.exit(percentage === 100 ? 0 : 1);
}

// Run verification
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyPerformanceSetup().catch((error) => {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  });
}

export { verifyPerformanceSetup };
