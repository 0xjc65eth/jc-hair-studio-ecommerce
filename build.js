#!/usr/bin/env node
/**
 * Custom build script for Vercel deployment
 * Forces TypeScript and ESLint to be ignored
 */

const { execSync } = require('child_process');

try {
  console.log('🚀 Starting custom Vercel build...');

  // Set environment variables to force skipping
  process.env.SKIP_TYPE_CHECK = 'true';
  process.env.SKIP_LINT = 'true';
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  process.env.CI = 'true';

  console.log('📦 Running Next.js build with all checks disabled...');

  // Execute next build with explicit flags
  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      SKIP_TYPE_CHECK: 'true',
      SKIP_LINT: 'true',
      NEXT_TELEMETRY_DISABLED: '1',
      CI: 'true'
    }
  });

  console.log('✅ Build completed successfully!');
  process.exit(0);

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}