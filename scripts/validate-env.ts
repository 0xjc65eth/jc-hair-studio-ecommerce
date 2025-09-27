#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 *
 * This script validates that all required environment variables are properly configured
 * for production deployment. It checks for missing variables, incorrect formats,
 * and potential security issues.
 *
 * Usage:
 *   npm run validate-env
 *   or
 *   node scripts/validate-env.ts
 */

import { z } from 'zod';
import chalk from 'chalk';

// Define required environment variables schema
const requiredEnvSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // Database
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),

  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),
  NEXTAUTH_URL: z.string().url().optional(),

  // Payment Processing (Required for production)
  STRIPE_SECRET_KEY: z.string().refine(
    (val) => val.startsWith('sk_live_') || val.startsWith('sk_test_'),
    'Stripe secret key must start with sk_live_ or sk_test_'
  ),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().refine(
    (val) => val.startsWith('pk_live_') || val.startsWith('pk_test_'),
    'Stripe publishable key must start with pk_live_ or pk_test_'
  ),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'Stripe webhook secret is required'),

  // Email Service (Required for production)
  SENDGRID_API_KEY: z.string().refine(
    (val) => val.startsWith('SG.'),
    'SendGrid API key must start with SG.'
  ),
  SENDGRID_FROM_EMAIL: z.string().email('SendGrid from email must be valid'),
  FROM_EMAIL: z.string().email('From email must be valid'),
  SUPPORT_EMAIL: z.string().email('Support email must be valid'),
  FROM_NAME: z.string().min(1, 'From name is required'),

  // Security flags
  SENDGRID_SANDBOX_MODE: z.string().refine(
    (val) => val === 'false' || val === 'true',
    'SENDGRID_SANDBOX_MODE must be "true" or "false"'
  ),
  FORCE_SEND_EMAILS: z.string().refine(
    (val) => val === 'false' || val === 'true',
    'FORCE_SEND_EMAILS must be "true" or "false"'
  ),
});

// Optional environment variables
const optionalEnvSchema = z.object({
  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_GTM_ID: z.string().optional(),

  // File Storage
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

function validateEnvironmentVariables(): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    recommendations: []
  };

  console.log(chalk.blue.bold('\n🔍 Validating Environment Variables...\n'));

  // Check required variables
  try {
    const parsed = requiredEnvSchema.parse(process.env);
    console.log(chalk.green('✅ All required environment variables are present'));

    // Production-specific checks
    if (process.env.NODE_ENV === 'production') {
      // Check for test/sandbox flags in production
      if (parsed.SENDGRID_SANDBOX_MODE === 'true') {
        result.errors.push('❌ SENDGRID_SANDBOX_MODE is enabled in production');
        result.isValid = false;
      }

      // Check for production keys
      if (parsed.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
        result.warnings.push('⚠️  Using Stripe test keys in production environment');
      }

      if (parsed.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_')) {
        result.warnings.push('⚠️  Using Stripe test publishable key in production environment');
      }

      // Validate email configuration
      if (parsed.SENDGRID_FROM_EMAIL !== parsed.FROM_EMAIL) {
        result.warnings.push('⚠️  SENDGRID_FROM_EMAIL and FROM_EMAIL should match');
      }

      // Check email domains
      const emailDomain = parsed.FROM_EMAIL.split('@')[1];
      if (!['jchairstudios62.xyz'].includes(emailDomain)) {
        result.warnings.push('⚠️  FROM_EMAIL should use the official domain');
      }
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      result.isValid = false;
      error.errors.forEach(err => {
        result.errors.push(`❌ ${err.path.join('.')}: ${err.message}`);
      });
    }
  }

  // Check optional variables
  try {
    optionalEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        result.warnings.push(`⚠️  Optional: ${err.path.join('.')}: ${err.message}`);
      });
    }
  }

  // Additional security checks
  const sensitiveVars = ['SENDGRID_API_KEY', 'STRIPE_SECRET_KEY', 'NEXTAUTH_SECRET', 'MONGODB_URI'];
  if (sensitiveVars && Array.isArray(sensitiveVars)) {
    sensitiveVars.forEach(varName => {
      const value = process.env[varName];
      if (value && (value.includes('your-') || value.includes('test-') || value.includes('example'))) {
        result.errors.push(`❌ ${varName} appears to be a placeholder value`);
        result.isValid = false;
      }
    });
  }

  // Recommendations
  if (!process.env.REDIS_URL) {
    result.recommendations.push('💡 Consider adding REDIS_URL for better performance and caching');
  }

  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    result.recommendations.push('💡 Consider adding Google Analytics for tracking');
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    result.recommendations.push('💡 Consider adding Cloudinary for optimized image delivery');
  }

  return result;
}

function generateReport(result: ValidationResult): void {
  console.log(chalk.blue.bold('\n📊 Validation Report\n'));

  if (result.isValid) {
    console.log(chalk.green.bold('🎉 Environment validation passed!'));
  } else {
    console.log(chalk.red.bold('❌ Environment validation failed!'));
  }

  if (result.errors.length > 0) {
    console.log(chalk.red.bold('\n🚨 Critical Errors:'));
    result.errors.forEach(error => console.log(`  ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log(chalk.yellow.bold('\n⚠️  Warnings:'));
    result.warnings.forEach(warning => console.log(`  ${warning}`));
  }

  if (result.recommendations.length > 0) {
    console.log(chalk.cyan.bold('\n💡 Recommendations:'));
    result.recommendations.forEach(rec => console.log(`  ${rec}`));
  }

  console.log('\n' + chalk.blue('─'.repeat(60)));

  if (!result.isValid) {
    console.log(chalk.red.bold('\n❌ Fix the critical errors above before deploying to production!'));
    process.exit(1);
  } else {
    console.log(chalk.green.bold('\n✅ Environment is ready for production!'));
  }
}

function showUsage(): void {
  console.log(chalk.blue.bold('\n🔧 Environment Variable Validation Tool\n'));
  console.log(chalk.white('This script validates all required environment variables for production deployment.\n'));

  console.log(chalk.yellow.bold('Required Variables:'));
  console.log('  NODE_ENV                     - Application environment');
  console.log('  MONGODB_URI                  - Database connection string');
  console.log('  NEXTAUTH_SECRET              - Authentication secret (32+ chars)');
  console.log('  STRIPE_SECRET_KEY            - Stripe payment processing');
  console.log('  STRIPE_WEBHOOK_SECRET        - Stripe webhook verification');
  console.log('  SENDGRID_API_KEY             - Email service (must start with SG.)');
  console.log('  SENDGRID_FROM_EMAIL          - Verified sender email');
  console.log('  FROM_EMAIL                   - Default from email');
  console.log('  SUPPORT_EMAIL                - Support contact email');
  console.log('  FROM_NAME                    - Sender name');

  console.log(chalk.cyan.bold('\nSecurity Variables:'));
  console.log('  SENDGRID_SANDBOX_MODE=false  - Disable sandbox in production');
  console.log('  FORCE_SEND_EMAILS=false      - Production email settings');

  console.log(chalk.gray.bold('\nUsage:'));
  console.log('  npm run validate-env');
  console.log('  node scripts/validate-env.ts');
  console.log('  ts-node scripts/validate-env.ts');
}

// Main execution
if (require.main === module) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showUsage();
    process.exit(0);
  }

  try {
    const result = validateEnvironmentVariables();
    generateReport(result);
  } catch (error) {
    console.error(chalk.red.bold('\n💥 Validation script failed:'), error);
    process.exit(1);
  }
}

export { validateEnvironmentVariables, ValidationResult };