#!/usr/bin/env node

/**
 * JC Hair Studio's 62 - Comprehensive System Check
 *
 * This script performs a complete health check of all systems:
 * - Environment configuration
 * - Database connectivity
 * - Email system (SendGrid)
 * - Stripe integration
 * - API endpoints
 * - File system permissions
 * - Dependencies
 */

import { createRequire } from 'module';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class SystemChecker {
  constructor() {
    this.results = {
      environment: { status: 'unknown', details: {} },
      database: { status: 'unknown', details: {} },
      email: { status: 'unknown', details: {} },
      stripe: { status: 'unknown', details: {} },
      apis: { status: 'unknown', details: {} },
      filesystem: { status: 'unknown', details: {} },
      dependencies: { status: 'unknown', details: {} }
    };

    this.startTime = Date.now();
  }

  log(level, category, message, details = null) {
    const timestamp = new Date().toISOString();
    const levelColors = {
      INFO: colors.blue,
      SUCCESS: colors.green,
      WARNING: colors.yellow,
      ERROR: colors.red,
      DEBUG: colors.cyan
    };

    const color = levelColors[level] || colors.reset;

    console.log(
      `${color}[${timestamp}] ${level.padEnd(7)} ${category.padEnd(12)} ${message}${colors.reset}`
    );

    if (details) {
      console.log(`${colors.cyan}${JSON.stringify(details, null, 2)}${colors.reset}`);
    }
  }

  async checkEnvironment() {
    this.log('INFO', 'ENVIRONMENT', 'Checking environment configuration...');

    const required = [
      'NODE_ENV',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'MONGODB_URI',
      'SENDGRID_API_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY'
    ];

    const optional = [
      'FROM_EMAIL',
      'FROM_NAME',
      'SUPPORT_EMAIL',
      'STRIPE_WEBHOOK_SECRET',
      'CLOUDINARY_CLOUD_NAME',
      'FORCE_SEND_EMAILS',
      'SENDGRID_SANDBOX_MODE'
    ];

    const missing = [];
    const present = [];
    const warnings = [];

    // Check required variables
    for (const envVar of required) {
      if (process.env[envVar]) {
        present.push(envVar);
      } else {
        missing.push(envVar);
      }
    }

    // Check optional variables
    for (const envVar of optional) {
      if (!process.env[envVar]) {
        warnings.push(envVar);
      }
    }

    // Validate specific formats
    const validations = {
      MONGODB_URI: /^mongodb(\+srv)?:\/\/.+/,
      SENDGRID_API_KEY: /^SG\./,
      STRIPE_SECRET_KEY: /^sk_(test|live)_/,
      STRIPE_PUBLISHABLE_KEY: /^pk_(test|live)_/
    };

    const invalidFormats = [];
    for (const [key, regex] of Object.entries(validations)) {
      if (process.env[key] && !regex.test(process.env[key])) {
        invalidFormats.push(key);
      }
    }

    const envStatus = missing.length === 0 && invalidFormats.length === 0 ? 'healthy' : 'error';

    this.results.environment = {
      status: envStatus,
      details: {
        required: { total: required.length, present: present.length, missing },
        optional: { total: optional.length, warnings },
        invalidFormats,
        nodeEnv: process.env.NODE_ENV,
        stripeMode: process.env.STRIPE_SECRET_KEY?.includes('test') ? 'test' : 'live'
      }
    };

    if (envStatus === 'healthy') {
      this.log('SUCCESS', 'ENVIRONMENT', 'All required environment variables are configured');
    } else {
      this.log('ERROR', 'ENVIRONMENT', 'Environment configuration issues detected', {
        missing,
        invalidFormats
      });
    }

    if (warnings.length > 0) {
      this.log('WARNING', 'ENVIRONMENT', `${warnings.length} optional variables not set`, warnings);
    }
  }

  async checkDatabase() {
    this.log('INFO', 'DATABASE', 'Testing MongoDB connection...');

    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI not configured');
      }

      // Dynamic import to avoid issues
      const { MongoClient } = await import('mongodb');

      const client = new MongoClient(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });

      const startTime = Date.now();
      await client.connect();

      // Test basic operations
      const db = client.db(process.env.MONGODB_DB_NAME || 'jc-hair-studio-ecommerce');
      await db.admin().ping();

      // Check collections
      const collections = await db.listCollections().toArray();
      const responseTime = Date.now() - startTime;

      await client.close();

      this.results.database = {
        status: 'healthy',
        details: {
          responseTime,
          collections: collections.length,
          collectionNames: collections.map(c => c.name),
          dbName: db.databaseName
        }
      };

      this.log('SUCCESS', 'DATABASE', `Connected successfully (${responseTime}ms)`, {
        collections: collections.length,
        database: db.databaseName
      });

    } catch (error) {
      this.results.database = {
        status: 'error',
        details: {
          error: error.message,
          configured: !!process.env.MONGODB_URI
        }
      };

      this.log('ERROR', 'DATABASE', 'Connection failed', { error: error.message });
    }
  }

  async checkEmail() {
    this.log('INFO', 'EMAIL', 'Testing SendGrid configuration...');

    try {
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY not configured');
      }

      if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
        throw new Error('Invalid SendGrid API key format');
      }

      // Import SendGrid
      const sgMail = (await import('@sendgrid/mail')).default;
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      // Test API key validity with a simple request
      const startTime = Date.now();

      try {
        // Try to send a test email in sandbox mode
        await sgMail.send({
          to: 'test@example.com',
          from: process.env.FROM_EMAIL || 'test@example.com',
          subject: 'System Check Test',
          text: 'This is a test email from system check',
          mail_settings: {
            sandbox_mode: { enable: true }
          }
        });

        const responseTime = Date.now() - startTime;

        this.results.email = {
          status: 'healthy',
          details: {
            provider: 'SendGrid',
            configured: true,
            responseTime,
            fromEmail: process.env.FROM_EMAIL,
            sandboxTest: true,
            testMode: process.env.SENDGRID_TEST_MODE === 'true',
            forceSend: process.env.FORCE_SEND_EMAILS === 'true'
          }
        };

        this.log('SUCCESS', 'EMAIL', `SendGrid API key valid (${responseTime}ms)`);

      } catch (sendError) {
        // API key might be valid but other issues exist
        if (sendError.code === 401) {
          throw new Error('Invalid SendGrid API key');
        }

        this.results.email = {
          status: 'warning',
          details: {
            provider: 'SendGrid',
            configured: true,
            apiKeyValid: true,
            sendError: sendError.message,
            testMode: process.env.SENDGRID_TEST_MODE === 'true'
          }
        };

        this.log('WARNING', 'EMAIL', 'SendGrid configured but test send failed', {
          error: sendError.message
        });
      }

    } catch (error) {
      this.results.email = {
        status: 'error',
        details: {
          error: error.message,
          configured: !!process.env.SENDGRID_API_KEY,
          keyFormat: process.env.SENDGRID_API_KEY?.startsWith('SG.') ? 'valid' : 'invalid'
        }
      };

      this.log('ERROR', 'EMAIL', 'SendGrid configuration failed', { error: error.message });
    }
  }

  async checkStripe() {
    this.log('INFO', 'STRIPE', 'Testing Stripe configuration...');

    try {
      if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLISHABLE_KEY) {
        throw new Error('Stripe keys not configured');
      }

      // Import Stripe
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const startTime = Date.now();

      // Test API by retrieving account information
      const account = await stripe.accounts.retrieve();
      const responseTime = Date.now() - startTime;

      const mode = process.env.STRIPE_SECRET_KEY.includes('test') ? 'test' : 'live';

      this.results.stripe = {
        status: 'healthy',
        details: {
          mode,
          responseTime,
          accountId: account.id,
          country: account.country,
          webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled
        }
      };

      this.log('SUCCESS', 'STRIPE', `API connection successful (${mode} mode, ${responseTime}ms)`, {
        accountId: account.id,
        webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET
      });

    } catch (error) {
      this.results.stripe = {
        status: 'error',
        details: {
          error: error.message,
          secretKeyConfigured: !!process.env.STRIPE_SECRET_KEY,
          publishableKeyConfigured: !!process.env.STRIPE_PUBLISHABLE_KEY,
          webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET
        }
      };

      this.log('ERROR', 'STRIPE', 'Configuration failed', { error: error.message });
    }
  }

  async checkAPIs() {
    this.log('INFO', 'API', 'Testing API endpoints...');

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const endpoints = [
      '/api/products',
      '/api/contact',
      '/api/points',
      '/api/search',
      '/api/debug/system-status'
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'GET',
          headers: { 'User-Agent': 'System-Check' },
          signal: AbortSignal.timeout(10000)
        });

        const responseTime = Date.now() - startTime;

        results.push({
          endpoint,
          status: response.ok ? 'healthy' : 'error',
          statusCode: response.status,
          responseTime
        });

        if (response.ok) {
          this.log('SUCCESS', 'API', `${endpoint} responding (${responseTime}ms)`);
        } else {
          this.log('ERROR', 'API', `${endpoint} error (${response.status})`);
        }

      } catch (error) {
        results.push({
          endpoint,
          status: 'error',
          error: error.message
        });

        this.log('ERROR', 'API', `${endpoint} failed`, { error: error.message });
      }
    }

    const healthyCount = results.filter(r => r.status === 'healthy').length;
    const overallStatus = healthyCount === results.length ? 'healthy' :
                         healthyCount > 0 ? 'warning' : 'error';

    this.results.apis = {
      status: overallStatus,
      details: {
        total: endpoints.length,
        healthy: healthyCount,
        endpoints: results
      }
    };
  }

  async checkFileSystem() {
    this.log('INFO', 'FILESYSTEM', 'Checking file system permissions...');

    const checks = [
      { path: '.', operation: 'read', required: true },
      { path: '.', operation: 'write', required: true },
      { path: './public', operation: 'read', required: true },
      { path: './public', operation: 'write', required: false },
      { path: './.next', operation: 'read', required: false },
      { path: './uploads', operation: 'write', required: false }
    ];

    const results = [];

    for (const check of checks) {
      try {
        const stats = fs.statSync(check.path);

        if (check.operation === 'read') {
          fs.accessSync(check.path, fs.constants.R_OK);
        } else if (check.operation === 'write') {
          fs.accessSync(check.path, fs.constants.W_OK);
        }

        results.push({
          path: check.path,
          operation: check.operation,
          status: 'success',
          exists: true,
          isDirectory: stats.isDirectory()
        });

      } catch (error) {
        results.push({
          path: check.path,
          operation: check.operation,
          status: check.required ? 'error' : 'warning',
          exists: false,
          error: error.message
        });

        const level = check.required ? 'ERROR' : 'WARNING';
        this.log(level, 'FILESYSTEM', `${check.path} ${check.operation} failed`, {
          error: error.message
        });
      }
    }

    const errors = results.filter(r => r.status === 'error').length;
    const warnings = results.filter(r => r.status === 'warning').length;

    this.results.filesystem = {
      status: errors > 0 ? 'error' : warnings > 0 ? 'warning' : 'healthy',
      details: {
        checks: results.length,
        errors,
        warnings,
        results
      }
    };

    if (errors === 0 && warnings === 0) {
      this.log('SUCCESS', 'FILESYSTEM', 'All file system checks passed');
    }
  }

  async checkDependencies() {
    this.log('INFO', 'DEPENDENCIES', 'Checking Node.js dependencies...');

    try {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      const critical = [
        'next', 'react', 'mongodb', '@sendgrid/mail', 'stripe',
        'next-auth', 'tailwindcss'
      ];

      const results = [];
      let outdatedPackages = [];

      for (const [pkg, version] of Object.entries(dependencies)) {
        const isCritical = critical.includes(pkg);

        try {
          // Check if package is installed
          const installedVersion = require(`${pkg}/package.json`).version;

          results.push({
            package: pkg,
            installed: installedVersion,
            required: version,
            critical: isCritical,
            status: 'installed'
          });

        } catch (error) {
          results.push({
            package: pkg,
            required: version,
            critical: isCritical,
            status: 'missing',
            error: error.message
          });
        }
      }

      // Check for security vulnerabilities
      let auditResult = null;
      try {
        const auditOutput = execSync('npm audit --audit-level=high --json', {
          encoding: 'utf8',
          timeout: 30000
        });
        auditResult = JSON.parse(auditOutput);
      } catch (auditError) {
        // npm audit returns non-zero exit code when vulnerabilities found
        if (auditError.stdout) {
          try {
            auditResult = JSON.parse(auditError.stdout);
          } catch (parseError) {
            this.log('WARNING', 'DEPENDENCIES', 'Could not parse audit results');
          }
        }
      }

      const missing = results.filter(r => r.status === 'missing' && r.critical).length;
      const vulnerabilities = auditResult?.metadata?.vulnerabilities || {};
      const highVulns = vulnerabilities.high || 0;
      const criticalVulns = vulnerabilities.critical || 0;

      this.results.dependencies = {
        status: missing > 0 || criticalVulns > 0 ? 'error' :
                highVulns > 0 ? 'warning' : 'healthy',
        details: {
          total: results.length,
          missing,
          vulnerabilities: {
            high: highVulns,
            critical: criticalVulns,
            total: Object.values(vulnerabilities).reduce((a, b) => a + b, 0)
          },
          nodeVersion: process.version,
          results: results.filter(r => r.critical || r.status === 'missing')
        }
      };

      if (missing === 0 && criticalVulns === 0) {
        this.log('SUCCESS', 'DEPENDENCIES', 'All critical dependencies are installed');
      }

      if (highVulns > 0 || criticalVulns > 0) {
        this.log('WARNING', 'DEPENDENCIES', 'Security vulnerabilities detected', vulnerabilities);
      }

    } catch (error) {
      this.results.dependencies = {
        status: 'error',
        details: { error: error.message }
      };

      this.log('ERROR', 'DEPENDENCIES', 'Failed to check dependencies', { error: error.message });
    }
  }

  generateReport() {
    const totalTime = Date.now() - this.startTime;

    console.log(`\n${colors.bold}${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}    JC HAIR STUDIO'S 62 SYSTEM CHECK    ${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}========================================${colors.reset}\n`);

    const categories = Object.keys(this.results);
    let overallHealthy = true;
    let warnings = 0;
    let errors = 0;

    for (const category of categories) {
      const result = this.results[category];
      const status = result.status;

      let statusColor = colors.green;
      let statusText = '✅ HEALTHY';

      if (status === 'warning') {
        statusColor = colors.yellow;
        statusText = '⚠️  WARNING';
        warnings++;
      } else if (status === 'error') {
        statusColor = colors.red;
        statusText = '❌ ERROR';
        errors++;
        overallHealthy = false;
      }

      console.log(
        `${statusColor}${statusText}${colors.reset} ${colors.bold}${category.toUpperCase()}${colors.reset}`
      );

      // Print key details
      if (result.details) {
        const details = result.details;
        switch (category) {
          case 'environment':
            console.log(`  📋 Required: ${details.required?.present}/${details.required?.total}`);
            if (details.missing?.length > 0) {
              console.log(`  ❌ Missing: ${details.missing.join(', ')}`);
            }
            break;
          case 'database':
            if (details.responseTime) {
              console.log(`  ⚡ Response Time: ${details.responseTime}ms`);
              console.log(`  📚 Collections: ${details.collections}`);
            }
            break;
          case 'email':
            console.log(`  📧 Provider: ${details.provider || 'Not configured'}`);
            if (details.responseTime) {
              console.log(`  ⚡ Response Time: ${details.responseTime}ms`);
            }
            break;
          case 'stripe':
            if (details.mode) {
              console.log(`  💳 Mode: ${details.mode}`);
              console.log(`  🔗 Webhook: ${details.webhookConfigured ? 'Configured' : 'Not configured'}`);
            }
            break;
          case 'apis':
            console.log(`  🌐 Endpoints: ${details.healthy}/${details.total} healthy`);
            break;
          case 'dependencies':
            console.log(`  📦 Node.js: ${details.nodeVersion}`);
            if (details.vulnerabilities) {
              const vulns = details.vulnerabilities;
              console.log(`  🔒 Vulnerabilities: ${vulns.critical} critical, ${vulns.high} high`);
            }
            break;
        }
      }
      console.log();
    }

    // Overall summary
    console.log(`${colors.bold}${colors.cyan}========================================${colors.reset}`);

    if (overallHealthy && warnings === 0) {
      console.log(`${colors.green}${colors.bold}🎉 SYSTEM STATUS: ALL SYSTEMS HEALTHY${colors.reset}`);
    } else if (overallHealthy) {
      console.log(`${colors.yellow}${colors.bold}⚠️  SYSTEM STATUS: HEALTHY WITH WARNINGS${colors.reset}`);
      console.log(`${colors.yellow}   ${warnings} warnings detected${colors.reset}`);
    } else {
      console.log(`${colors.red}${colors.bold}❌ SYSTEM STATUS: CRITICAL ISSUES DETECTED${colors.reset}`);
      console.log(`${colors.red}   ${errors} errors, ${warnings} warnings${colors.reset}`);
    }

    console.log(`\n${colors.cyan}📊 Check completed in ${totalTime}ms${colors.reset}`);
    console.log(`${colors.cyan}📅 ${new Date().toISOString()}${colors.reset}\n`);

    // Return results for programmatic use
    return {
      overall: overallHealthy ? (warnings > 0 ? 'warning' : 'healthy') : 'error',
      categories: this.results,
      summary: { errors, warnings, totalTime },
      timestamp: new Date().toISOString()
    };
  }

  async runAllChecks() {
    console.log(`${colors.bold}${colors.blue}🚀 Starting comprehensive system check...${colors.reset}\n`);

    await this.checkEnvironment();
    await this.checkDatabase();
    await this.checkEmail();
    await this.checkStripe();
    await this.checkAPIs();
    await this.checkFileSystem();
    await this.checkDependencies();

    return this.generateReport();
  }
}

// Main execution
async function main() {
  const checker = new SystemChecker();

  try {
    const results = await checker.runAllChecks();

    // Write results to file
    const reportPath = './system-check-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`${colors.green}📄 Detailed report saved to: ${reportPath}${colors.reset}\n`);

    // Exit with appropriate code
    process.exit(results.overall === 'error' ? 1 : 0);

  } catch (error) {
    console.error(`${colors.red}❌ System check failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default SystemChecker;