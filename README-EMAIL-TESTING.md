# 📧 Email Testing Suite - JC Hair Studio's 62

Comprehensive email testing and monitoring system for SendGrid integration.

## 🧪 Test Scripts Overview

### 1. `test-email-system.mjs` - Direct API Testing
Tests SendGrid API directly, bypassing all application logic.

**Features:**
- Direct SendGrid SDK integration testing
- Multiple email template validation
- Real email sending capability (with `--force-real` flag)
- Sandbox mode for safe testing
- Performance monitoring
- Comprehensive error reporting

**Usage:**
```bash
# Safe testing (sandbox mode - no real emails sent)
node test-email-system.mjs

# Send real test emails
node test-email-system.mjs --force-real

# Verbose output with detailed diagnostics
node test-email-system.mjs --force-real --verbose

# Using environment variable
FORCE_REAL_EMAIL=true node test-email-system.mjs
```

**Environment Variables:**
- `SENDGRID_API_KEY` - Your SendGrid API key (required)
- `TEST_EMAIL` - Email address to receive test emails
- `FORCE_REAL_EMAIL=true` - Force real email sending
- `FROM_EMAIL` - From email address
- `FROM_NAME` - From name

### 2. `validate-sendgrid.mjs` - Configuration Validator
Comprehensive validation of SendGrid setup and domain configuration.

**Features:**
- API key validation and authentication
- Domain authentication (SPF, DKIM) verification
- Sender reputation checks
- Account limits and permissions analysis
- Security configuration review
- DNS record validation

**Usage:**
```bash
# Basic validation
node validate-sendgrid.mjs

# Detailed validation with DNS checks
node validate-sendgrid.mjs --verbose

# Comprehensive validation (all features)
node validate-sendgrid.mjs --verbose --deep-scan

# Quick validation (skip DNS checks)
node validate-sendgrid.mjs --skip-dns
```

**Exit Codes:**
- `0` - Excellent configuration (≥90% pass rate)
- `1` - Good configuration with warnings (≥70% pass rate)
- `2` - Poor configuration needs fixes (<70% pass rate)
- `3` - Critical validation error

### 3. `monitor-emails.mjs` - Real-Time Monitoring
Live monitoring and debugging of email sending activities.

**Features:**
- Real-time dashboard with live updates
- Success/failure rate tracking
- Performance metrics and response times
- Error logging and analysis
- Automatic report generation
- Test traffic generation

**Usage:**
```bash
# Start monitoring with default settings
node monitor-emails.mjs

# Monitor with faster refresh rate (2 seconds)
node monitor-emails.mjs --interval=2000

# Test mode with generated email traffic
node monitor-emails.mjs --test-mode --verbose

# JSON output for automation/integration
node monitor-emails.mjs --json --no-realtime
```

**Controls:**
- `Ctrl+C` - Stop monitoring and generate final report

## 🚀 Quick Start Guide

### Step 1: Validate Configuration
```bash
# Check if SendGrid is properly configured
node validate-sendgrid.mjs --verbose
```

### Step 2: Test Email System
```bash
# Test in sandbox mode (safe)
node test-email-system.mjs --verbose

# Test with real emails (when ready)
node test-email-system.mjs --force-real --verbose
```

### Step 3: Monitor Live Activity
```bash
# Start real-time monitoring
node monitor-emails.mjs

# Or with test traffic for demonstration
node monitor-emails.mjs --test-mode
```

## 📊 Test Templates

The system tests these email templates:

1. **Contact Form Email** - Customer contact form submissions
2. **Order Confirmation** - Purchase confirmation with order details
3. **Newsletter Subscription** - Welcome email for newsletter subscribers
4. **Payment Confirmation** - Payment processing confirmation

Each template is tested for:
- HTML rendering and CSS styling
- Template variable substitution
- Mobile responsiveness
- Send performance

## 🔧 Configuration

### Required Environment Variables
```env
# SendGrid Configuration
SENDGRID_API_KEY="SG.your-sendgrid-api-key"
FROM_EMAIL="orders@jchairstudios62.xyz"
FROM_NAME="JC Hair Studio's 62"
SUPPORT_EMAIL="suporte@jchairstudios62.xyz"

# Testing Configuration
FORCE_SEND_EMAILS="false"          # Force real emails in dev mode
SENDGRID_SANDBOX_MODE="false"      # Enable sandbox testing
SENDGRID_TEST_MODE="false"         # Disable SendGrid entirely
TEST_EMAIL="your-test@email.com"   # Where to send test emails
```

### Optional Configuration
```env
# For advanced testing
NODE_ENV="development"             # Environment mode
VERBOSE_LOGGING="true"             # Detailed logging
```

## 📈 Monitoring Output

### Dashboard Metrics
- **Uptime** - How long monitoring has been running
- **Emails Sent/Failed** - Success/failure counts
- **Success Rate** - Percentage of successful sends
- **Average Response Time** - Performance metric
- **Rate** - Emails per minute

### Log Files
- `email-monitoring.log` - Real-time event log
- `reports/email-monitoring-*.json` - Periodic reports

### Performance Thresholds
- **Good Response Time**: < 1000ms
- **Warning Response Time**: 1000-3000ms
- **Poor Response Time**: > 3000ms

- **Excellent Success Rate**: ≥ 95%
- **Good Success Rate**: 80-94%
- **Poor Success Rate**: < 80%

## 🛠️ Troubleshooting

### Common Issues

**1. API Key Authentication Failed**
```bash
# Validate your API key
node validate-sendgrid.mjs
```
- Check API key format (must start with `SG.`)
- Verify key is not expired
- Ensure key has send permissions

**2. Domain Authentication Issues**
```bash
# Check domain setup
node validate-sendgrid.mjs --verbose
```
- Verify SPF record includes SendGrid
- Check DKIM configuration
- Confirm domain ownership

**3. Emails Not Sending**
```bash
# Test with verbose output
node test-email-system.mjs --verbose
```
- Check if in test mode
- Verify API permissions
- Review error messages

**4. High Failure Rate**
```bash
# Monitor in real-time
node monitor-emails.mjs --verbose
```
- Check error patterns
- Verify recipient addresses
- Review SendGrid account status

### Debug Commands

```bash
# Full system validation
node validate-sendgrid.mjs --verbose --deep-scan

# Test all templates
node test-email-system.mjs --verbose

# Generate test traffic and monitor
node monitor-emails.mjs --test-mode --verbose
```

## 📋 Best Practices

### Testing Workflow
1. **Always validate first** - Run `validate-sendgrid.mjs`
2. **Test in sandbox** - Use default settings initially
3. **Progressive testing** - Start with sandbox, then real emails
4. **Monitor production** - Use `monitor-emails.mjs` in production

### Production Monitoring
- Set up continuous monitoring during high-traffic periods
- Monitor success rates during campaign sends
- Track performance metrics for optimization
- Set up alerts for failure rate thresholds

### Security Considerations
- Never commit API keys to version control
- Use environment variables for configuration
- Regularly rotate API keys
- Monitor for unusual sending patterns

## 🔗 Integration

### NPM Scripts Integration
Add to your `package.json`:

```json
{
  "scripts": {
    "email:validate": "node validate-sendgrid.mjs",
    "email:test": "node test-email-system.mjs",
    "email:test:real": "node test-email-system.mjs --force-real",
    "email:monitor": "node monitor-emails.mjs",
    "email:monitor:test": "node monitor-emails.mjs --test-mode"
  }
}
```

### CI/CD Integration
```yaml
# Example GitHub Actions step
- name: Validate Email Configuration
  run: node validate-sendgrid.mjs
  env:
    SENDGRID_API_KEY: ${{ secrets.SENDGRID_API_KEY }}
```

## 📞 Support

For issues with the email testing suite:
1. Check the troubleshooting section above
2. Run validation with `--verbose` flag
3. Review log files in the `reports/` directory
4. Verify SendGrid account status and limits

---

**JC Hair Studio's 62** - Tradição Familiar há mais de 40 anos