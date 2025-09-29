#!/usr/bin/env node

/**
 * Email Configuration Test
 * Tests if SendGrid is properly configured and can send emails
 */

import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env.local') });
config({ path: join(__dirname, '.env') });

console.log('🧪 Testing Email Configuration...\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log('  SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ EXISTS' : '❌ MISSING');
console.log('  FROM_EMAIL:', process.env.FROM_EMAIL || '❌ MISSING');
console.log('  FROM_NAME:', process.env.FROM_NAME || '❌ MISSING');
console.log('  SUPPORT_EMAIL:', process.env.SUPPORT_EMAIL || '❌ MISSING');
console.log('  FORCE_SEND_EMAILS:', process.env.FORCE_SEND_EMAILS || 'false');
console.log('  SENDGRID_SANDBOX_MODE:', process.env.SENDGRID_SANDBOX_MODE || 'false');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('');

// Configuration validation
const SENDGRID_ENABLED = !!process.env.SENDGRID_API_KEY &&
  process.env.SENDGRID_API_KEY !== 'SG.your-sendgrid-api-key' &&
  process.env.SENDGRID_API_KEY.startsWith('SG.');

const FORCE_SEND_EMAILS = process.env.FORCE_SEND_EMAILS === 'true';
const SANDBOX_MODE = process.env.SENDGRID_SANDBOX_MODE === 'true';

console.log('⚙️ Configuration Status:');
console.log('  SendGrid Enabled:', SENDGRID_ENABLED ? '✅ YES' : '❌ NO');
console.log('  Force Send Emails:', FORCE_SEND_EMAILS ? '✅ YES' : '❌ NO');
console.log('  Sandbox Mode:', SANDBOX_MODE ? '🧪 YES' : '❌ NO');
console.log('  Can Send Emails:', (SENDGRID_ENABLED || FORCE_SEND_EMAILS) ? '✅ YES' : '❌ NO');
console.log('');

if (!SENDGRID_ENABLED && !FORCE_SEND_EMAILS) {
  console.log('⚠️ WARNING: Emails will be simulated only!');
  console.log('To fix this:');
  console.log('1. Set SENDGRID_API_KEY with a valid API key');
  console.log('2. OR set FORCE_SEND_EMAILS=true to bypass checks');
  console.log('');
  process.exit(0);
}

// Test email sending
console.log('📧 Testing Email Sending...');

if (SENDGRID_ENABLED || FORCE_SEND_EMAILS) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const testEmail = {
      to: process.env.SUPPORT_EMAIL || 'test@example.com',
      from: `${process.env.FROM_NAME || 'JC Hair Studio\'s 62'} <${process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz'}>`,
      subject: '🧪 Email Configuration Test - JC Hair Studio\'s 62',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">JC Hair Studio's 62</h1>
            <p style="color: white; margin: 5px 0;">Email Configuration Test</p>
          </div>

          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #374151;">✅ Email System Working!</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              This is a test email to verify that the SendGrid configuration is working correctly.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Configuration Details:</h3>
              <ul style="color: #6b7280; line-height: 1.8;">
                <li><strong>SendGrid Enabled:</strong> ${SENDGRID_ENABLED}</li>
                <li><strong>Force Send Emails:</strong> ${FORCE_SEND_EMAILS}</li>
                <li><strong>Sandbox Mode:</strong> ${SANDBOX_MODE}</li>
                <li><strong>Node Environment:</strong> ${process.env.NODE_ENV}</li>
                <li><strong>Test Date:</strong> ${new Date().toLocaleString('pt-BR')}</li>
              </ul>
            </div>
          </div>

          <div style="background: #374151; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">JC Hair Studio's 62 - Email Test System</p>
          </div>
        </div>
      `,
      text: `
        JC Hair Studio's 62 - Email Configuration Test

        ✅ Email System Working!

        This is a test email to verify that the SendGrid configuration is working correctly.

        Configuration Details:
        - SendGrid Enabled: ${SENDGRID_ENABLED}
        - Force Send Emails: ${FORCE_SEND_EMAILS}
        - Sandbox Mode: ${SANDBOX_MODE}
        - Node Environment: ${process.env.NODE_ENV}
        - Test Date: ${new Date().toLocaleString('pt-BR')}
      `,
      mail_settings: {
        sandbox_mode: {
          enable: SANDBOX_MODE && !FORCE_SEND_EMAILS,
        },
      },
    };

    console.log('📤 Sending test email to:', testEmail.to);
    console.log('📤 From:', testEmail.from);
    console.log('📤 Sandbox Mode:', testEmail.mail_settings.sandbox_mode.enable);

    await sgMail.send(testEmail);

    if (SANDBOX_MODE && !FORCE_SEND_EMAILS) {
      console.log('✅ Test email sent in SANDBOX MODE (not delivered)');
    } else {
      console.log('✅ Test email sent successfully!');
    }

  } catch (error) {
    console.error('❌ Failed to send test email:', error);

    if (error.code) {
      console.error('Error Code:', error.code);
    }
    if (error.message) {
      console.error('Error Message:', error.message);
    }
    if (error.response && error.response.body) {
      console.error('SendGrid Response:', error.response.body);
    }

    process.exit(1);
  }
} else {
  console.log('📧 [SIMULATION] Would send email (SendGrid not configured)');
}

console.log('\n🎉 Email configuration test completed!');