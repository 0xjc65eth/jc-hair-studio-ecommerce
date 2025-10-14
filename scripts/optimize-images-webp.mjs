#!/usr/bin/env node

/**
 * COMPREHENSIVE IMAGE OPTIMIZATION SCRIPT
 * ========================================
 *
 * This script optimizes all images for maximum performance:
 * 1. Converts all JPG/PNG to WebP format
 * 2. Generates multiple sizes for responsive images
 * 3. Creates blur placeholders for better UX
 * 4. Optimizes file sizes with quality settings
 * 5. Preserves originals in backup folder
 *
 * Performance improvements:
 * - WebP: 25-35% smaller than JPEG
 * - Responsive images: Loads optimal size per device
 * - Blur placeholders: Eliminates layout shift (CLS)
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Directories to scan
  inputDirs: [
    path.join(__dirname, '../public/images'),
    path.join(__dirname, '../public/icons'),
  ],
  // Output directory for WebP images
  outputDir: path.join(__dirname, '../public/images/optimized'),
  // Backup directory
  backupDir: path.join(__dirname, '../public/images/backup'),
  // Responsive sizes to generate
  sizes: [
    { name: 'thumbnail', width: 256, quality: 85 },
    { name: 'small', width: 640, quality: 85 },
    { name: 'medium', width: 1024, quality: 85 },
    { name: 'large', width: 1920, quality: 80 },
  ],
  // WebP quality
  webpQuality: 85,
  // Generate blur placeholders
  generateBlur: true,
  // Image extensions to convert
  extensions: ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'],
  // Skip these directories
  skipDirs: ['backup', 'optimized', 'node_modules', '.next'],
};

// Statistics
const stats = {
  processed: 0,
  converted: 0,
  errors: 0,
  originalSize: 0,
  optimizedSize: 0,
};

/**
 * Get all image files recursively
 */
async function getImageFiles(dir, fileList = []) {
  try {
    const files = await fs.readdir(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);

      if (stat.isDirectory()) {
        // Skip certain directories
        if (!CONFIG.skipDirs.some(skip => filePath.includes(skip))) {
          await getImageFiles(filePath, fileList);
        }
      } else {
        const ext = path.extname(file);
        if (CONFIG.extensions.includes(ext)) {
          fileList.push(filePath);
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return fileList;
}

/**
 * Generate blur placeholder (base64)
 */
async function generateBlurPlaceholder(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(10, 10, { fit: 'inside' })
      .webp({ quality: 20 })
      .toBuffer();

    return `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error generating blur for ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Convert image to WebP with multiple sizes
 */
async function convertToWebP(imagePath) {
  try {
    stats.processed++;

    const filename = path.basename(imagePath, path.extname(imagePath));
    const relativePath = path.relative(path.join(__dirname, '../public'), imagePath);
    const relativeDir = path.dirname(relativePath);

    // Create output directory structure
    const outputDir = path.join(CONFIG.outputDir, relativeDir);
    await fs.mkdir(outputDir, { recursive: true });

    // Get original size
    const originalStat = await fs.stat(imagePath);
    stats.originalSize += originalStat.size;

    // Load image
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    console.log(`\n📸 Processing: ${relativePath}`);
    console.log(`   Original: ${(originalStat.size / 1024).toFixed(2)} KB`);

    let totalOptimizedSize = 0;

    // Generate WebP versions at different sizes
    for (const size of CONFIG.sizes) {
      // Skip if image is smaller than target size
      if (metadata.width < size.width) continue;

      const outputFilename = `${filename}-${size.name}.webp`;
      const outputPath = path.join(outputDir, outputFilename);

      await image
        .clone()
        .resize(size.width, null, { withoutEnlargement: true })
        .webp({ quality: size.quality })
        .toFile(outputPath);

      const outputStat = await fs.stat(outputPath);
      totalOptimizedSize += outputStat.size;

      console.log(`   ✓ ${size.name}: ${(outputStat.size / 1024).toFixed(2)} KB`);
    }

    // Generate main WebP (original dimensions)
    const mainOutputPath = path.join(outputDir, `${filename}.webp`);
    await image
      .clone()
      .webp({ quality: CONFIG.webpQuality })
      .toFile(mainOutputPath);

    const mainStat = await fs.stat(mainOutputPath);
    totalOptimizedSize += mainStat.size;
    stats.optimizedSize += totalOptimizedSize;

    console.log(`   ✓ main: ${(mainStat.size / 1024).toFixed(2)} KB`);

    // Generate blur placeholder
    if (CONFIG.generateBlur) {
      const blurData = await generateBlurPlaceholder(imagePath);
      if (blurData) {
        const blurPath = path.join(outputDir, `${filename}-blur.txt`);
        await fs.writeFile(blurPath, blurData);
        console.log(`   ✓ blur placeholder generated`);
      }
    }

    const savings = ((1 - totalOptimizedSize / originalStat.size) * 100).toFixed(1);
    console.log(`   💾 Space saved: ${savings}%`);

    stats.converted++;
  } catch (error) {
    stats.errors++;
    console.error(`❌ Error converting ${imagePath}:`, error.message);
  }
}

/**
 * Backup original images
 */
async function backupOriginals(files) {
  console.log('\n📦 Backing up original images...');

  await fs.mkdir(CONFIG.backupDir, { recursive: true });

  for (const file of files) {
    const relativePath = path.relative(path.join(__dirname, '../public'), file);
    const backupPath = path.join(CONFIG.backupDir, relativePath);
    const backupDir = path.dirname(backupPath);

    await fs.mkdir(backupDir, { recursive: true });
    await fs.copyFile(file, backupPath);
  }

  console.log(`✓ Backed up ${files.length} images`);
}

/**
 * Generate optimization report
 */
function generateReport() {
  const totalSaved = stats.originalSize - stats.optimizedSize;
  const percentSaved = ((totalSaved / stats.originalSize) * 100).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('📊 IMAGE OPTIMIZATION REPORT');
  console.log('='.repeat(60));
  console.log(`Total images processed: ${stats.processed}`);
  console.log(`Successfully converted: ${stats.converted}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`\nOriginal size: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized size: ${(stats.optimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Space saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${percentSaved}%)`);
  console.log('='.repeat(60));

  // Save report to file
  const report = {
    date: new Date().toISOString(),
    stats,
    savings: {
      bytes: totalSaved,
      megabytes: (totalSaved / 1024 / 1024).toFixed(2),
      percent: percentSaved,
    },
  };

  fs.writeFile(
    path.join(__dirname, '../public/images/optimization-report.json'),
    JSON.stringify(report, null, 2)
  ).catch(err => console.error('Error saving report:', err));
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting comprehensive image optimization...\n');

  // Check if sharp is installed
  try {
    await import('sharp');
  } catch (error) {
    console.error('❌ Sharp is not installed. Installing now...');
    console.error('Please run: npm install sharp --save-dev');
    process.exit(1);
  }

  // Create output directories
  await fs.mkdir(CONFIG.outputDir, { recursive: true });

  // Get all image files
  console.log('🔍 Scanning for images...');
  const allFiles = [];
  for (const dir of CONFIG.inputDirs) {
    try {
      const files = await getImageFiles(dir);
      allFiles.push(...files);
    } catch (error) {
      console.error(`Error scanning ${dir}:`, error.message);
    }
  }

  console.log(`Found ${allFiles.length} images to optimize\n`);

  if (allFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }

  // Backup originals
  await backupOriginals(allFiles);

  // Convert images
  console.log('\n🔄 Converting images to WebP...');
  for (const file of allFiles) {
    await convertToWebP(file);
  }

  // Generate report
  generateReport();

  console.log('\n✅ Image optimization complete!');
  console.log(`\nOptimized images saved to: ${CONFIG.outputDir}`);
  console.log(`Original images backed up to: ${CONFIG.backupDir}`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { main as optimizeImages };
