#!/usr/bin/env node

// Build Validation Script - JC Hair Studio's 62
// Validates build output and configuration before deployment

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating build configuration...');

const checks = [];

// Check if .next directory exists
if (fs.existsSync('.next')) {
  checks.push('✅ .next directory exists');

  // Check for BUILD_ID
  if (fs.existsSync('.next/BUILD_ID')) {
    const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8').trim();
    checks.push(`✅ BUILD_ID exists: ${buildId}`);
  } else {
    checks.push('❌ BUILD_ID missing');
  }

  // Check for static files
  if (fs.existsSync('.next/static')) {
    checks.push('✅ Static files generated');
  } else {
    checks.push('❌ Static files missing');
  }

  // Check for server components
  if (fs.existsSync('.next/server')) {
    checks.push('✅ Server components generated');
  } else {
    checks.push('❌ Server components missing');
  }
} else {
  checks.push('❌ .next directory missing');
}

// Check package.json
if (fs.existsSync('package.json')) {
  checks.push('✅ package.json exists');

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  // Check required scripts
  const requiredScripts = ['build', 'start', 'build:vercel'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      checks.push(`✅ Script "${script}" exists`);
    } else {
      checks.push(`❌ Script "${script}" missing`);
    }
  });

  // Check for Next.js
  if (packageJson.dependencies && packageJson.dependencies.next) {
    checks.push(`✅ Next.js version: ${packageJson.dependencies.next}`);
  } else {
    checks.push('❌ Next.js dependency missing');
  }
} else {
  checks.push('❌ package.json missing');
}

// Check next.config.js
if (fs.existsSync('next.config.js')) {
  checks.push('✅ next.config.js exists');
} else {
  checks.push('❌ next.config.js missing');
}

// Check vercel.json
if (fs.existsSync('vercel.json')) {
  checks.push('✅ vercel.json exists');

  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    if (vercelConfig.buildCommand) {
      checks.push(`✅ Build command: ${vercelConfig.buildCommand}`);
    }
    if (vercelConfig.framework) {
      checks.push(`✅ Framework: ${vercelConfig.framework}`);
    }
  } catch (error) {
    checks.push('❌ vercel.json invalid JSON');
  }
} else {
  checks.push('⚠️  vercel.json missing (optional)');
}

// Check for critical environment variables
const criticalEnvVars = [
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

criticalEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    checks.push(`✅ Environment variable ${envVar} set`);
  } else {
    checks.push(`⚠️  Environment variable ${envVar} not set`);
  }
});

// Check TypeScript configuration
if (fs.existsSync('tsconfig.json')) {
  checks.push('✅ tsconfig.json exists');

  try {
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    if (tsConfig.compilerOptions && tsConfig.compilerOptions.skipLibCheck) {
      checks.push('✅ TypeScript skipLibCheck enabled');
    }
  } catch (error) {
    checks.push('❌ tsconfig.json invalid JSON');
  }
} else {
  checks.push('❌ tsconfig.json missing');
}

// Check ESLint configuration
if (fs.existsSync('.eslintrc.json')) {
  checks.push('✅ .eslintrc.json exists');
} else {
  checks.push('⚠️  .eslintrc.json missing (optional)');
}

// Check Prisma
if (fs.existsSync('prisma/schema.prisma')) {
  checks.push('✅ Prisma schema exists');

  if (fs.existsSync('lib/generated/prisma') || fs.existsSync('node_modules/.prisma/client')) {
    checks.push('✅ Prisma client generated');
  } else {
    checks.push('⚠️  Prisma client not generated');
  }
} else {
  checks.push('❌ Prisma schema missing');
}

// Print results
console.log('\n📋 Build Validation Results:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

checks.forEach(check => {
  console.log(check);
});

// Count results
const passed = checks.filter(check => check.startsWith('✅')).length;
const warnings = checks.filter(check => check.startsWith('⚠️')).length;
const failed = checks.filter(check => check.startsWith('❌')).length;

console.log('\n📊 Summary:');
console.log(`✅ Passed: ${passed}`);
console.log(`⚠️  Warnings: ${warnings}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 Build validation passed! Ready for deployment.');
  process.exit(0);
} else {
  console.log('\n⚠️  Build validation has issues. Review failed checks before deployment.');
  process.exit(1);
}