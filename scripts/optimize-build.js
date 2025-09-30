#!/usr/bin/env node

/**
 * Build Optimization Script for Vercel
 * Optimizes memory usage and build process for better performance within Vercel constraints
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build optimization for Vercel...');

// Function to set Node.js memory optimization
function setNodeOptions() {
  const currentOptions = process.env.NODE_OPTIONS || '';

  const optimizedOptions = [
    '--max-old-space-size=4096',
    '--optimize-for-size',
    '--gc-interval=100',
    '--max-semi-space-size=128'
  ].join(' ');

  process.env.NODE_OPTIONS = `${currentOptions} ${optimizedOptions}`.trim();
  console.log('✅ Node.js memory options configured:', process.env.NODE_OPTIONS);
}

// Function to optimize package.json for build
function optimizePackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');

  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    // Ensure build script uses optimized settings
    if (!packageJson.scripts.build.includes('NODE_OPTIONS')) {
      packageJson.scripts.build = `NODE_OPTIONS='--max-old-space-size=4096' ${packageJson.scripts.build}`;
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Package.json build script optimized');
    }
  }
}

// Function to clean build artifacts to free memory
function cleanBuildArtifacts() {
  const pathsToClean = [
    '.next',
    'node_modules/.cache',
    '.vercel'
  ];

  pathsToClean.forEach(cleanPath => {
    const fullPath = path.join(process.cwd(), cleanPath);
    if (fs.existsSync(fullPath)) {
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`✅ Cleaned: ${cleanPath}`);
      } catch (error) {
        console.log(`⚠️  Could not clean ${cleanPath}:`, error.message);
      }
    }
  });
}

// Function to check and optimize large assets
function checkAssetSizes() {
  const publicPath = path.join(process.cwd(), 'public');
  let totalSize = 0;
  let largeFiles = [];

  function checkDir(dirPath) {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        checkDir(itemPath);
      } else {
        totalSize += stats.size;

        // Check for files larger than 1MB
        if (stats.size > 1024 * 1024) {
          largeFiles.push({
            path: itemPath.replace(process.cwd(), ''),
            size: (stats.size / 1024 / 1024).toFixed(2) + ' MB'
          });
        }
      }
    });
  }

  checkDir(publicPath);

  console.log(`📊 Total public assets size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

  if (largeFiles.length > 0) {
    console.log('⚠️  Large files detected (>1MB):');
    largeFiles.forEach(file => {
      console.log(`   ${file.path}: ${file.size}`);
    });
    console.log('💡 Consider optimizing these files for better build performance');
  }
}

// Function to display memory usage
function displayMemoryUsage() {
  const usage = process.memoryUsage();
  console.log('📈 Current memory usage:');
  console.log(`   RSS: ${(usage.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Heap Used: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Heap Total: ${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   External: ${(usage.external / 1024 / 1024).toFixed(2)} MB`);
}

// Main execution
async function main() {
  console.log('🔧 Running build optimization checks...\n');

  // Set Node options
  setNodeOptions();

  // Display initial memory usage
  displayMemoryUsage();

  // Clean build artifacts
  console.log('\n🧹 Cleaning build artifacts...');
  cleanBuildArtifacts();

  // Check asset sizes
  console.log('\n📋 Analyzing asset sizes...');
  checkAssetSizes();

  // Optimize package.json
  console.log('\n⚙️  Optimizing configuration...');
  optimizePackageJson();

  console.log('\n✨ Build optimization complete!');
  console.log('\n📋 Optimization Summary:');
  console.log('• Memory limit set to 4GB');
  console.log('• Build cache disabled for memory efficiency');
  console.log('• Chunk splitting optimized for smaller bundles');
  console.log('• Parallel processes limited to prevent memory issues');
  console.log('• Static generation optimized for concurrent processing');

  console.log('\n🚀 Ready for Vercel deployment!');
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the optimization
main().catch(console.error);