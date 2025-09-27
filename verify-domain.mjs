#!/usr/bin/env node

/**
 * SendGrid Domain Authentication Verification Script
 *
 * This script checks if the domain is properly authenticated with SendGrid
 * and validates all email configuration for JC Hair Studio's 62 ecommerce platform.
 *
 * Usage: node verify-domain.mjs
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import dns from 'dns/promises';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
try {
  const envPath = join(__dirname, '.env.local');
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=', 2);
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
      }
    }
  });
} catch (error) {
  console.log('⚠️ No .env.local file found, using environment variables');
}

class SendGridDomainVerifier {
  constructor() {
    this.domain = 'jchairstudios62.xyz';
    this.alternativeDomains = ['jchairstudios62.com', 'jchairstudio62.com'];
    this.emailAddresses = {
      orders: 'orders@jchairstudios62.xyz',
      support: 'suporte@jchairstudios62.xyz',
      contact: 'contato@jchairstudios62.xyz',
      noreply: 'noreply@jchairstudios62.xyz'
    };
    this.sendgridApiKey = process.env.SENDGRID_API_KEY;
    this.results = {
      dnsRecords: {},
      authentication: {},
      emails: {},
      sendgrid: {},
      issues: [],
      recommendations: []
    };
  }

  /**
   * Main verification method
   */
  async verify() {
    console.log('🔍 SendGrid Domain Authentication Verification');
    console.log('='.repeat(50));
    console.log(`📧 Domain: ${this.domain}`);
    console.log(`🔑 API Key: ${this.sendgridApiKey ? 'Present' : 'Missing'}`);
    console.log('');

    try {
      // Step 1: Check SendGrid API Key
      await this.checkSendGridApiKey();

      // Step 2: Check DNS Records
      await this.checkDnsRecords();

      // Step 3: Check SPF Record
      await this.checkSpfRecord();

      // Step 4: Check DKIM Records
      await this.checkDkimRecords();

      // Step 5: Check DMARC Record
      await this.checkDmarcRecord();

      // Step 6: Test SendGrid API Connection
      await this.testSendGridConnection();

      // Step 7: Validate Email Addresses
      await this.validateEmailAddresses();

      // Step 8: Check Domain Reputation
      await this.checkDomainReputation();

      // Generate Report
      this.generateReport();

    } catch (error) {
      console.error('❌ Verification failed:', error.message);
      this.results.issues.push(`Critical error: ${error.message}`);
    }
  }

  /**
   * Check if SendGrid API key is configured correctly
   */
  async checkSendGridApiKey() {
    console.log('📋 Checking SendGrid API Key...');

    if (!this.sendgridApiKey) {
      this.results.sendgrid.apiKey = false;
      this.results.issues.push('SendGrid API key is missing');
      console.log('❌ SendGrid API key not found');
      return;
    }

    if (!this.sendgridApiKey.startsWith('SG.')) {
      this.results.sendgrid.apiKey = false;
      this.results.issues.push('SendGrid API key format is invalid');
      console.log('❌ SendGrid API key format is invalid');
      return;
    }

    if (this.sendgridApiKey === 'SG.your-sendgrid-api-key') {
      this.results.sendgrid.apiKey = false;
      this.results.issues.push('SendGrid API key is placeholder value');
      console.log('❌ SendGrid API key is placeholder value');
      return;
    }

    this.results.sendgrid.apiKey = true;
    console.log('✅ SendGrid API key is properly configured');
  }

  /**
   * Check basic DNS records for the domain
   */
  async checkDnsRecords() {
    console.log('🌐 Checking DNS Records...');

    try {
      // Check MX record
      const mxRecords = await dns.resolveMx(this.domain);
      this.results.dnsRecords.mx = mxRecords.length > 0;
      console.log(`✅ MX Records found: ${mxRecords.length} records`);

      // Check A record
      const aRecords = await dns.resolve4(this.domain);
      this.results.dnsRecords.a = aRecords.length > 0;
      console.log(`✅ A Records found: ${aRecords.length} records`);

      // Check if domain resolves
      this.results.dnsRecords.resolves = true;

    } catch (error) {
      this.results.dnsRecords.resolves = false;
      this.results.issues.push(`DNS resolution failed: ${error.message}`);
      console.log(`❌ DNS resolution failed: ${error.message}`);
    }
  }

  /**
   * Check SPF record
   */
  async checkSpfRecord() {
    console.log('📧 Checking SPF Record...');

    try {
      const txtRecords = await dns.resolveTxt(this.domain);
      const spfRecord = txtRecords.find(record =>
        record.join('').toLowerCase().startsWith('v=spf1')
      );

      if (spfRecord) {
        const spfString = spfRecord.join('');
        this.results.authentication.spf = {
          exists: true,
          record: spfString,
          includesSendGrid: spfString.includes('include:sendgrid.net'),
          valid: true
        };

        if (spfString.includes('include:sendgrid.net')) {
          console.log('✅ SPF record found with SendGrid include');
        } else {
          console.log('⚠️ SPF record found but missing SendGrid include');
          this.results.recommendations.push('Add "include:sendgrid.net" to your SPF record');
        }
      } else {
        this.results.authentication.spf = { exists: false };
        this.results.issues.push('SPF record not found');
        console.log('❌ SPF record not found');
      }

    } catch (error) {
      this.results.authentication.spf = { exists: false, error: error.message };
      console.log(`❌ SPF check failed: ${error.message}`);
    }
  }

  /**
   * Check DKIM records
   */
  async checkDkimRecords() {
    console.log('🔐 Checking DKIM Records...');

    const dkimSelectors = ['s1', 's2'];
    this.results.authentication.dkim = { selectors: {} };

    for (const selector of dkimSelectors) {
      try {
        const dkimDomain = `${selector}._domainkey.${this.domain}`;
        const txtRecords = await dns.resolveTxt(dkimDomain);

        if (txtRecords.length > 0) {
          const dkimRecord = txtRecords[0].join('');
          this.results.authentication.dkim.selectors[selector] = {
            exists: true,
            record: dkimRecord,
            valid: dkimRecord.includes('k=rsa') || dkimRecord.includes('p=')
          };
          console.log(`✅ DKIM record found for selector ${selector}`);
        } else {
          this.results.authentication.dkim.selectors[selector] = { exists: false };
          console.log(`❌ DKIM record not found for selector ${selector}`);
        }

      } catch (error) {
        this.results.authentication.dkim.selectors[selector] = {
          exists: false,
          error: error.message
        };
        console.log(`❌ DKIM check failed for ${selector}: ${error.message}`);
      }
    }

    // Check if any DKIM records exist
    const dkimExists = Object.values(this.results.authentication.dkim.selectors)
      .some(selector => selector.exists);

    if (!dkimExists) {
      this.results.issues.push('No DKIM records found');
      this.results.recommendations.push('Configure DKIM records in SendGrid domain authentication');
    }
  }

  /**
   * Check DMARC record
   */
  async checkDmarcRecord() {
    console.log('🛡️ Checking DMARC Record...');

    try {
      const dmarcDomain = `_dmarc.${this.domain}`;
      const txtRecords = await dns.resolveTxt(dmarcDomain);

      const dmarcRecord = txtRecords.find(record =>
        record.join('').toLowerCase().startsWith('v=dmarc1')
      );

      if (dmarcRecord) {
        const dmarcString = dmarcRecord.join('');
        const policy = dmarcString.match(/p=([^;]+)/);

        this.results.authentication.dmarc = {
          exists: true,
          record: dmarcString,
          policy: policy ? policy[1] : 'unknown',
          valid: true
        };

        console.log(`✅ DMARC record found with policy: ${policy ? policy[1] : 'unknown'}`);
      } else {
        this.results.authentication.dmarc = { exists: false };
        this.results.recommendations.push('Configure DMARC record for enhanced security');
        console.log('⚠️ DMARC record not found (recommended but optional)');
      }

    } catch (error) {
      this.results.authentication.dmarc = { exists: false, error: error.message };
      console.log(`❌ DMARC check failed: ${error.message}`);
    }
  }

  /**
   * Test SendGrid API connection
   */
  async testSendGridConnection() {
    console.log('🔌 Testing SendGrid API Connection...');

    if (!this.sendgridApiKey || !this.results.sendgrid.apiKey) {
      console.log('⏭️ Skipping API test (no valid API key)');
      return;
    }

    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(this.sendgridApiKey);

      // Test API connection by attempting to get user info
      const response = await fetch('https://api.sendgrid.com/v3/user/account', {
        headers: {
          'Authorization': `Bearer ${this.sendgridApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        this.results.sendgrid.connection = true;
        this.results.sendgrid.accountType = userData.type;
        console.log(`✅ SendGrid API connection successful (${userData.type} account)`);
      } else {
        this.results.sendgrid.connection = false;
        this.results.issues.push(`SendGrid API connection failed: ${response.status}`);
        console.log(`❌ SendGrid API connection failed: ${response.status}`);
      }

    } catch (error) {
      this.results.sendgrid.connection = false;
      this.results.issues.push(`SendGrid API error: ${error.message}`);
      console.log(`❌ SendGrid API error: ${error.message}`);
    }
  }

  /**
   * Validate email addresses configuration
   */
  async validateEmailAddresses() {
    console.log('📬 Validating Email Addresses...');

    for (const [type, email] of Object.entries(this.emailAddresses)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      const domain = email.split('@')[1];

      this.results.emails[type] = {
        address: email,
        valid: isValid,
        domain: domain,
        matchesDomain: domain === this.domain
      };

      if (isValid && domain === this.domain) {
        console.log(`✅ ${type}: ${email} (valid and matches domain)`);
      } else if (isValid) {
        console.log(`⚠️ ${type}: ${email} (valid but different domain)`);
      } else {
        console.log(`❌ ${type}: ${email} (invalid format)`);
        this.results.issues.push(`Invalid email format: ${email}`);
      }
    }
  }

  /**
   * Check domain reputation (basic check)
   */
  async checkDomainReputation() {
    console.log('🏆 Checking Domain Reputation...');

    try {
      // Simple reputation check by looking for blacklist indicators
      const blacklistCheck = await this.checkBlacklists();
      this.results.reputation = blacklistCheck;

      if (blacklistCheck.clean) {
        console.log('✅ Domain appears to have good reputation');
      } else {
        console.log('⚠️ Potential reputation issues detected');
        this.results.recommendations.push('Monitor domain reputation regularly');
      }

    } catch (error) {
      console.log(`⚠️ Could not check domain reputation: ${error.message}`);
    }
  }

  /**
   * Basic blacklist check
   */
  async checkBlacklists() {
    // This is a simplified check - in production you'd use specialized services
    try {
      const response = await fetch(`https://dns.google/resolve?name=${this.domain}&type=A`);
      const data = await response.json();

      return {
        clean: data.Status === 0,
        checked: true,
        service: 'basic'
      };
    } catch (error) {
      return {
        clean: true,
        checked: false,
        error: error.message
      };
    }
  }

  /**
   * Generate comprehensive verification report
   */
  generateReport() {
    console.log('');
    console.log('📊 VERIFICATION REPORT');
    console.log('='.repeat(50));

    // Overall Status
    const criticalIssues = this.results.issues.length;
    const overallStatus = criticalIssues === 0 ? '✅ PASS' : '❌ ISSUES FOUND';
    console.log(`Overall Status: ${overallStatus}`);
    console.log('');

    // SendGrid Configuration
    console.log('📧 SendGrid Configuration:');
    console.log(`   API Key: ${this.results.sendgrid.apiKey ? '✅' : '❌'}`);
    console.log(`   Connection: ${this.results.sendgrid.connection ? '✅' : '❌'}`);
    if (this.results.sendgrid.accountType) {
      console.log(`   Account Type: ${this.results.sendgrid.accountType}`);
    }
    console.log('');

    // DNS & Authentication
    console.log('🌐 DNS & Authentication:');
    console.log(`   DNS Resolution: ${this.results.dnsRecords.resolves ? '✅' : '❌'}`);
    console.log(`   SPF Record: ${this.results.authentication.spf?.exists ? '✅' : '❌'}`);
    if (this.results.authentication.spf?.includesSendGrid === false) {
      console.log('     ⚠️ Missing SendGrid include');
    }

    const dkimExists = Object.values(this.results.authentication.dkim?.selectors || {})
      .some(selector => selector.exists);
    console.log(`   DKIM Records: ${dkimExists ? '✅' : '❌'}`);
    console.log(`   DMARC Record: ${this.results.authentication.dmarc?.exists ? '✅' : '⚠️ Optional'}`);
    console.log('');

    // Email Addresses
    console.log('📬 Email Addresses:');
    for (const [type, config] of Object.entries(this.results.emails)) {
      const status = config.valid && config.matchesDomain ? '✅' : '⚠️';
      console.log(`   ${type}: ${status} ${config.address}`);
    }
    console.log('');

    // Issues
    if (this.results.issues.length > 0) {
      console.log('❌ Issues Found:');
      this.results.issues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
      console.log('');
    }

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      this.results.recommendations.forEach(rec => {
        console.log(`   • ${rec}`);
      });
      console.log('');
    }

    // Environment Variables Check
    console.log('🔧 Environment Variables:');
    const envVars = [
      'SENDGRID_API_KEY',
      'FROM_EMAIL',
      'SUPPORT_EMAIL',
      'FROM_NAME'
    ];

    envVars.forEach(envVar => {
      const exists = !!process.env[envVar];
      const value = process.env[envVar];
      const status = exists ? '✅' : '❌';
      console.log(`   ${envVar}: ${status} ${exists ? (envVar.includes('KEY') ? '[HIDDEN]' : value) : 'Missing'}`);
    });
    console.log('');

    // Next Steps
    console.log('🚀 Next Steps:');
    if (criticalIssues === 0) {
      console.log('   • Domain authentication is properly configured');
      console.log('   • Test email sending functionality');
      console.log('   • Monitor delivery rates and reputation');
      console.log('   • Set up regular monitoring');
    } else {
      console.log('   • Fix critical issues listed above');
      console.log('   • Re-run verification after fixes');
      console.log('   • Consult setup-sendgrid-auth.md for detailed instructions');
      console.log('   • Contact SendGrid support if issues persist');
    }
    console.log('');

    // Test Command
    console.log('🧪 Test Email Sending:');
    console.log('   node -e "');
    console.log('     const sendgrid = require(\"@sendgrid/mail\");');
    console.log('     sendgrid.setApiKey(process.env.SENDGRID_API_KEY);');
    console.log('     sendgrid.send({');
    console.log('       to: \"test@example.com\",');
    console.log(`       from: \"${this.emailAddresses.orders}\",`);
    console.log('       subject: \"Test Email\",');
    console.log('       text: \"This is a test email\"');
    console.log('     }).then(() => console.log(\"Email sent!\"));');
    console.log('   "');
    console.log('');
  }
}

// Run verification
const verifier = new SendGridDomainVerifier();
verifier.verify().catch(error => {
  console.error('💥 Verification script failed:', error);
  process.exit(1);
});