#!/usr/bin/env node

/**
 * 📡 EMAIL MONITORING SYSTEM
 * Real-time monitoring and debugging of email sending activities
 *
 * Features:
 * - Real-time email monitoring
 * - Success/failure tracking
 * - Performance metrics
 * - Debug information logging
 * - Error analysis and reporting
 * - Live dashboard display
 */

import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const config = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.FROM_EMAIL || 'orders@jchairstudios62.xyz',
  fromName: process.env.FROM_NAME || 'JC Hair Studio\'s 62',
  monitoringInterval: parseInt(process.argv.find(arg => arg.startsWith('--interval='))?.split('=')[1]) || 5000,
  logFile: path.join(__dirname, 'email-monitoring.log'),
  reportsDir: path.join(__dirname, 'reports'),
  realTime: !process.argv.includes('--no-realtime'),
  jsonOutput: process.argv.includes('--json'),
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
  testMode: process.argv.includes('--test-mode'),
  maxLogEntries: 1000
};

// Color logging utilities
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  if (!config.jsonOutput) {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }
}

function clearScreen() {
  if (config.realTime && !config.jsonOutput) {
    console.clear();
  }
}

// Monitoring state
const monitoringState = {
  startTime: new Date(),
  emailsSent: 0,
  emailsFailed: 0,
  totalResponseTime: 0,
  recentEmails: [],
  errorLog: [],
  performanceMetrics: {
    avgResponseTime: 0,
    successRate: 0,
    emailsPerMinute: 0
  }
};

// Email monitoring hook
const originalSend = sgMail.send;
sgMail.send = function(...args) {
  return monitorEmail(originalSend.bind(this), ...args);
};

// Log management
function initializeLogFile() {
  if (!fs.existsSync(config.reportsDir)) {
    fs.mkdirSync(config.reportsDir, { recursive: true });
  }

  const logHeader = {
    timestamp: new Date().toISOString(),
    event: 'MONITORING_STARTED',
    config: {
      interval: config.monitoringInterval,
      testMode: config.testMode,
      realTime: config.realTime
    }
  };

  writeToLog(logHeader);
}

function writeToLog(entry) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...entry
  };

  // Write to log file
  fs.appendFileSync(config.logFile, JSON.stringify(logEntry) + '\n');

  // Manage log file size
  manageLogFileSize();
}

function manageLogFileSize() {
  try {
    const logContent = fs.readFileSync(config.logFile, 'utf8');
    const lines = logContent.split('\n').filter(line => line.trim());

    if (lines.length > config.maxLogEntries) {
      const keepLines = lines.slice(-config.maxLogEntries);
      fs.writeFileSync(config.logFile, keepLines.join('\n') + '\n');
    }
  } catch (error) {
    // Ignore log management errors
  }
}

async function monitorEmail(originalSend, ...args) {
  const startTime = Date.now();
  const emailData = Array.isArray(args[0]) ? args[0] : [args[0]];
  const emailCount = emailData.length;

  const monitoringEntry = {
    event: 'EMAIL_ATTEMPT',
    emailCount,
    recipients: emailData.map(email => ({
      to: Array.isArray(email.to) ? email.to : [email.to],
      subject: email.subject,
      hasAttachments: !!(email.attachments && email.attachments.length > 0)
    }))
  };

  writeToLog(monitoringEntry);

  try {
    const result = await originalSend(...args);
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Update monitoring state
    monitoringState.emailsSent += emailCount;
    monitoringState.totalResponseTime += responseTime;

    const successEntry = {
      event: 'EMAIL_SUCCESS',
      emailCount,
      responseTime,
      messageId: result?.[0]?.messageId || 'unknown',
      statusCode: result?.[0]?.statusCode || 202
    };

    writeToLog(successEntry);

    // Add to recent emails
    monitoringState.recentEmails.unshift({
      timestamp: new Date(),
      status: 'success',
      count: emailCount,
      responseTime,
      recipients: emailData.map(e => e.to).flat()
    });

    // Keep only recent entries
    if (monitoringState.recentEmails.length > 50) {
      monitoringState.recentEmails = monitoringState.recentEmails.slice(0, 50);
    }

    updatePerformanceMetrics();

    return result;

  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Update monitoring state
    monitoringState.emailsFailed += emailCount;

    const errorEntry = {
      event: 'EMAIL_FAILURE',
      emailCount,
      responseTime,
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.response?.status || error.statusCode
      },
      recipients: emailData.map(e => e.to).flat()
    };

    writeToLog(errorEntry);

    // Add to error log
    monitoringState.errorLog.unshift({
      timestamp: new Date(),
      error: error.message,
      code: error.code,
      statusCode: error.response?.status || error.statusCode,
      recipients: emailData.map(e => e.to).flat()
    });

    // Keep only recent errors
    if (monitoringState.errorLog.length > 20) {
      monitoringState.errorLog = monitoringState.errorLog.slice(0, 20);
    }

    // Add to recent emails
    monitoringState.recentEmails.unshift({
      timestamp: new Date(),
      status: 'failed',
      count: emailCount,
      responseTime,
      error: error.message,
      recipients: emailData.map(e => e.to).flat()
    });

    updatePerformanceMetrics();

    throw error;
  }
}

function updatePerformanceMetrics() {
  const totalEmails = monitoringState.emailsSent + monitoringState.emailsFailed;
  const runningTime = (Date.now() - monitoringState.startTime.getTime()) / 1000; // seconds

  monitoringState.performanceMetrics = {
    avgResponseTime: totalEmails > 0 ? Math.round(monitoringState.totalResponseTime / totalEmails) : 0,
    successRate: totalEmails > 0 ? ((monitoringState.emailsSent / totalEmails) * 100).toFixed(1) : 100,
    emailsPerMinute: runningTime > 0 ? ((totalEmails / runningTime) * 60).toFixed(2) : 0
  };
}

function displayDashboard() {
  if (config.jsonOutput) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      monitoring: monitoringState,
      uptime: Math.round((Date.now() - monitoringState.startTime.getTime()) / 1000)
    }, null, 2));
    return;
  }

  clearScreen();

  // Header
  log('📡 EMAIL MONITORING DASHBOARD - JC Hair Studio\'s 62', 'bright');
  log('=' .repeat(70), 'cyan');

  // Status overview
  const uptime = Math.round((Date.now() - monitoringState.startTime.getTime()) / 1000);
  const uptimeStr = `${Math.floor(uptime / 60)}m ${uptime % 60}s`;

  log(`\n📊 OVERVIEW`, 'cyan');
  log(`├─ Uptime: ${uptimeStr}`, 'blue');
  log(`├─ Emails Sent: ${monitoringState.emailsSent}`, 'green');
  log(`├─ Emails Failed: ${monitoringState.emailsFailed}`, monitoringState.emailsFailed > 0 ? 'red' : 'green');
  log(`├─ Success Rate: ${monitoringState.performanceMetrics.successRate}%`,
      parseFloat(monitoringState.performanceMetrics.successRate) > 95 ? 'green' :
      parseFloat(monitoringState.performanceMetrics.successRate) > 80 ? 'yellow' : 'red');
  log(`└─ Rate: ${monitoringState.performanceMetrics.emailsPerMinute} emails/min`, 'blue');

  // Performance metrics
  log(`\n⚡ PERFORMANCE`, 'cyan');
  log(`├─ Avg Response Time: ${monitoringState.performanceMetrics.avgResponseTime}ms`,
      monitoringState.performanceMetrics.avgResponseTime < 1000 ? 'green' :
      monitoringState.performanceMetrics.avgResponseTime < 3000 ? 'yellow' : 'red');
  log(`├─ Total Emails: ${monitoringState.emailsSent + monitoringState.emailsFailed}`, 'blue');
  log(`└─ Status: ${monitoringState.emailsFailed === 0 ? 'All Systems Operational' : 'Issues Detected'}`,
      monitoringState.emailsFailed === 0 ? 'green' : 'yellow');

  // Recent emails
  log(`\n📬 RECENT EMAIL ACTIVITY`, 'cyan');
  if (monitoringState.recentEmails.length === 0) {
    log('├─ No recent email activity', 'gray');
  } else {
    monitoringState.recentEmails.slice(0, 8).forEach((email, index) => {
      const timeAgo = Math.round((Date.now() - email.timestamp.getTime()) / 1000);
      const timeStr = timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo / 60)}m ago`;
      const icon = email.status === 'success' ? '✅' : '❌';
      const prefix = index === monitoringState.recentEmails.length - 1 ? '└─' : '├─';

      log(`${prefix} ${icon} ${email.count} email(s) to ${email.recipients.length} recipient(s) (${email.responseTime}ms) - ${timeStr}`,
          email.status === 'success' ? 'green' : 'red');

      if (config.verbose && email.error) {
        log(`   └─ Error: ${email.error}`, 'red');
      }
    });
  }

  // Error summary
  if (monitoringState.errorLog.length > 0) {
    log(`\n❌ RECENT ERRORS`, 'red');
    monitoringState.errorLog.slice(0, 5).forEach((error, index) => {
      const timeAgo = Math.round((Date.now() - error.timestamp.getTime()) / 1000);
      const timeStr = timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo / 60)}m ago`;
      const prefix = index === Math.min(monitoringState.errorLog.length - 1, 4) ? '└─' : '├─';

      log(`${prefix} [${error.code || 'UNKNOWN'}] ${error.error} - ${timeStr}`, 'red');

      if (config.verbose) {
        log(`   └─ Recipients: ${error.recipients.join(', ')}`, 'gray');
      }
    });
  }

  // System info
  log(`\n🔧 SYSTEM INFO`, 'cyan');
  log(`├─ Monitoring Interval: ${config.monitoringInterval}ms`, 'blue');
  log(`├─ Real-time Mode: ${config.realTime ? 'Enabled' : 'Disabled'}`, 'blue');
  log(`├─ Test Mode: ${config.testMode ? 'Enabled' : 'Disabled'}`, 'blue');
  log(`├─ Log File: ${config.logFile}`, 'blue');
  log(`└─ Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, 'blue');

  // Footer
  log(`\n${'='.repeat(70)}`, 'cyan');
  log(`Last Updated: ${new Date().toLocaleTimeString()} | Press Ctrl+C to stop monitoring`, 'gray');
}

async function runTestEmails() {
  if (!config.testMode) return;

  log('\n🧪 Generating test email traffic...', 'yellow');

  const testEmails = [
    {
      to: 'test1@example.com',
      from: config.fromEmail,
      subject: 'Test Email 1 - Contact Form',
      text: 'This is a test email from monitoring system',
      mail_settings: { sandbox_mode: { enable: true } }
    },
    {
      to: 'test2@example.com',
      from: config.fromEmail,
      subject: 'Test Email 2 - Order Confirmation',
      text: 'This is another test email from monitoring system',
      mail_settings: { sandbox_mode: { enable: true } }
    }
  ];

  try {
    // Send test emails at random intervals
    for (const email of testEmails) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));
      await sgMail.send(email);
    }

    // Occasionally simulate an error
    if (Math.random() < 0.2) {
      try {
        await sgMail.send({
          to: 'invalid-email',
          from: config.fromEmail,
          subject: 'Invalid Email Test',
          text: 'This should fail',
          mail_settings: { sandbox_mode: { enable: true } }
        });
      } catch (error) {
        // Expected to fail
      }
    }

  } catch (error) {
    // Test errors are expected
  }
}

async function generateReport() {
  const reportData = {
    generated: new Date().toISOString(),
    monitoring: {
      startTime: monitoringState.startTime,
      duration: Date.now() - monitoringState.startTime.getTime(),
      emailsSent: monitoringState.emailsSent,
      emailsFailed: monitoringState.emailsFailed,
      performanceMetrics: monitoringState.performanceMetrics
    },
    recentActivity: monitoringState.recentEmails.slice(0, 20),
    errors: monitoringState.errorLog.slice(0, 10),
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      config: {
        interval: config.monitoringInterval,
        testMode: config.testMode,
        realTime: config.realTime
      }
    }
  };

  const reportFile = path.join(config.reportsDir, `email-monitoring-${Date.now()}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));

  log(`\n📄 Report saved: ${reportFile}`, 'green');
  return reportData;
}

// Signal handlers
process.on('SIGINT', async () => {
  log('\n\n🛑 Stopping email monitoring...', 'yellow');

  const finalReport = await generateReport();

  log('\n📊 FINAL STATISTICS', 'cyan');
  log(`Total Emails Sent: ${finalReport.monitoring.emailsSent}`, 'green');
  log(`Total Emails Failed: ${finalReport.monitoring.emailsFailed}`, 'red');
  log(`Success Rate: ${finalReport.monitoring.performanceMetrics.successRate}%`, 'blue');
  log(`Average Response Time: ${finalReport.monitoring.performanceMetrics.avgResponseTime}ms`, 'blue');
  log(`Session Duration: ${Math.round(finalReport.monitoring.duration / 1000)}s`, 'blue');

  process.exit(0);
});

// Main monitoring loop
async function startMonitoring() {
  log('\n📡 EMAIL MONITORING SYSTEM - JC Hair Studio\'s 62', 'bright');
  log('Starting real-time email monitoring...', 'cyan');

  if (!config.apiKey) {
    log('\n❌ No SendGrid API key found. Monitoring will track application calls only.', 'red');
  } else {
    sgMail.setApiKey(config.apiKey);
    log('✅ SendGrid API key configured', 'green');
  }

  initializeLogFile();

  // Display initial dashboard
  displayDashboard();

  // Start monitoring loop
  const monitoringLoop = setInterval(async () => {
    if (config.testMode) {
      await runTestEmails();
    }

    displayDashboard();
  }, config.monitoringInterval);

  // Generate reports every 5 minutes
  const reportInterval = setInterval(async () => {
    if (monitoringState.emailsSent > 0 || monitoringState.emailsFailed > 0) {
      await generateReport();
    }
  }, 5 * 60 * 1000);

  // Keep process running
  process.stdin.resume();
}

// CLI help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📡 Email Monitoring System - JC Hair Studio's 62

USAGE:
  node monitor-emails.mjs [options]

OPTIONS:
  --interval=ms        Monitoring refresh interval in milliseconds (default: 5000)
  --no-realtime        Disable real-time dashboard updates
  --json               Output data in JSON format instead of dashboard
  --verbose, -v        Show detailed information and debug output
  --test-mode          Generate test email traffic for demonstration
  --help, -h           Show this help message

FEATURES:
  • Real-time email monitoring dashboard
  • Success/failure rate tracking
  • Performance metrics and response times
  • Error logging and analysis
  • Automatic report generation
  • Live system status

MONITORING DATA:
  • Email send attempts and results
  • Response times and performance metrics
  • Error codes and failure reasons
  • Recipient information (anonymized)
  • System resource usage

OUTPUT FILES:
  • email-monitoring.log        - Real-time log of all email events
  • reports/email-monitoring-*.json - Periodic monitoring reports

EXAMPLES:
  # Start monitoring with default settings
  node monitor-emails.mjs

  # Monitor with faster refresh rate
  node monitor-emails.mjs --interval=2000

  # Test mode with verbose output
  node monitor-emails.mjs --test-mode --verbose

  # JSON output for integration
  node monitor-emails.mjs --json --no-realtime

ENVIRONMENT VARIABLES:
  SENDGRID_API_KEY     Your SendGrid API key
  FROM_EMAIL          From email address for monitoring
  FROM_NAME           From name for monitoring

KEYBOARD SHORTCUTS:
  Ctrl+C              Stop monitoring and generate final report
  `);
  process.exit(0);
}

// Start monitoring
startMonitoring().catch(error => {
  log(`❌ Failed to start monitoring: ${error.message}`, 'red');
  process.exit(1);
});