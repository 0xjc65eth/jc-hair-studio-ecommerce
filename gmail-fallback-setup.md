# Gmail SMTP Fallback Configuration Guide

## Overview

This guide provides step-by-step instructions for setting up Gmail SMTP as a fallback email service when SendGrid is unavailable for the JC Hair Studio's 62 ecommerce platform.

## Prerequisites

1. Google Account with Gmail
2. Custom domain email setup (recommended)
3. Application-specific password generation
4. Environment variables configuration

## Step 1: Gmail Account Setup

### 1.1 Create or Use Existing Gmail Account
For the domain `jchairstudios62.xyz`, you have several options:

**Option A: Gmail with Custom Domain (Recommended)**
- Use Google Workspace to set up `orders@jchairstudios62.xyz`
- Professional appearance and domain consistency
- Better deliverability rates

**Option B: Gmail Alias**
- Create a Gmail account like `jchairstudios62orders@gmail.com`
- Set up custom "From" name in Gmail settings
- More affordable but less professional appearance

**Option C: Gmail Forwarding**
- Use an existing Gmail account
- Configure forwarding rules for replies
- Set custom reply-to addresses

### 1.2 Enable 2-Factor Authentication
1. Go to Google Account settings
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-factor authentication (required for app passwords)

### 1.3 Generate App-Specific Password
1. Go to Google Account → **Security** → **App passwords**
2. Select **Mail** as the app
3. Select **Other** as the device and name it "JC Hair Studio SMTP"
4. Copy the 16-character password (save it securely)

## Step 2: Environment Variables Configuration

### 2.1 Add Gmail Variables to .env
```bash
# Gmail SMTP Fallback Configuration
GMAIL_USER="orders@jchairstudios62.xyz"
GMAIL_APP_PASSWORD="your-16-character-app-password"
ENABLE_GMAIL_FALLBACK="true"

# Gmail behavior settings
GMAIL_FALLBACK_PRIORITY="low"  # low, medium, high
GMAIL_RETRY_ATTEMPTS="3"
GMAIL_TIMEOUT="30000"  # 30 seconds
```

### 2.2 Production Environment Variables (Vercel)
For production deployment, add these in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:

```
GMAIL_USER = orders@jchairstudios62.xyz
GMAIL_APP_PASSWORD = [your-app-password]
ENABLE_GMAIL_FALLBACK = true
```

## Step 3: DNS Configuration for Custom Domain

### 3.1 MX Records (If using Gmail with custom domain)
Add these MX records to your DNS:

```dns
Priority  Host  Value
1         @     aspmx.l.google.com
5         @     alt1.aspmx.l.google.com
5         @     alt2.aspmx.l.google.com
10        @     alt3.aspmx.l.google.com
10        @     alt4.aspmx.l.google.com
```

### 3.2 SPF Record Update
Update your SPF record to include Google:

```dns
TXT @ "v=spf1 include:_spf.google.com include:sendgrid.net ~all"
```

### 3.3 DKIM Setup (Google Workspace)
If using Google Workspace:
1. Go to Admin Console → **Apps** → **Google Workspace** → **Gmail**
2. Click **Authenticate email**
3. Follow the DKIM setup instructions
4. Add the provided DKIM record to your DNS

## Step 4: Implementation Integration

### 4.1 Using the Gmail Fallback Service

```typescript
import { emailService } from '@/lib/utils/gmailFallback';

// Automatic fallback (tries SendGrid first, then Gmail)
const result = await emailService.sendContactEmail(contactData);

// Force Gmail usage
const result = await emailService.sendEmail(emailTemplate, true);

// Check service status
const status = emailService.getServiceStatus();
console.log('SendGrid available:', status.sendgrid);
console.log('Gmail available:', status.gmail);
```

### 4.2 Fallback Triggers
The system automatically falls back to Gmail when:
- SendGrid API key is missing or invalid
- SendGrid API returns error responses
- SendGrid rate limits are exceeded
- Network connectivity issues with SendGrid

### 4.3 Email Template Compatibility
The Gmail fallback uses simplified templates optimized for:
- Better compatibility across email clients
- Reduced HTML complexity
- Faster delivery times
- Mobile responsiveness

## Step 5: Testing the Configuration

### 5.1 Test Gmail Connection
```bash
node -e "
const { testGmailConnection } = require('./lib/utils/gmailFallback');
testGmailConnection().then(result => {
  console.log('Gmail connection:', result ? 'SUCCESS' : 'FAILED');
});
"
```

### 5.2 Test Fallback Functionality
```bash
# Test with SendGrid disabled
SENDGRID_API_KEY="" node -e "
const { emailService } = require('./lib/utils/gmailFallback');
emailService.sendEmail({
  to: 'test@example.com',
  from: 'orders@jchairstudios62.xyz',
  subject: 'Test Email',
  html: '<p>This is a test email</p>',
  text: 'This is a test email'
}).then(result => console.log('Result:', result));
"
```

### 5.3 Comprehensive Test Script
```javascript
// test-gmail-fallback.mjs
import { emailService, testGmailConnection } from './lib/utils/gmailFallback.js';

async function runTests() {
  console.log('🧪 Testing Gmail Fallback Configuration');
  console.log('='.repeat(40));

  // Test connection
  const connectionResult = await testGmailConnection();
  console.log(`Gmail Connection: ${connectionResult ? '✅' : '❌'}`);

  // Test service status
  const status = emailService.getServiceStatus();
  console.log('Service Status:', status);

  // Test email sending
  const testEmail = {
    to: process.env.SUPPORT_EMAIL || 'test@example.com',
    from: process.env.GMAIL_USER,
    subject: 'Gmail Fallback Test',
    html: '<h1>Test Email</h1><p>This email was sent via Gmail fallback.</p>',
    text: 'Test Email - This email was sent via Gmail fallback.'
  };

  const emailResult = await emailService.sendEmail(testEmail, true);
  console.log(`Email Sending: ${emailResult ? '✅' : '❌'}`);
}

runTests().catch(console.error);
```

## Step 6: Monitoring and Maintenance

### 6.1 Email Delivery Monitoring
Monitor Gmail fallback usage through logs:

```bash
# Check recent logs for fallback usage
grep "Gmail" logs/application.log | tail -20

# Monitor fallback frequency
grep "Falling back to Gmail" logs/application.log | wc -l
```

### 6.2 Performance Considerations
- Gmail SMTP has rate limits (100 emails/day for personal accounts)
- Google Workspace has higher limits (2000 emails/day)
- Monitor sending volumes and upgrade if necessary

### 6.3 Security Best Practices
1. Rotate app passwords every 90 days
2. Monitor for unauthorized access in Google Account activity
3. Use environment variables for sensitive data
4. Enable security alerts in Google Account

## Step 7: Troubleshooting

### Common Issues and Solutions

#### Issue 1: Authentication Failed
```
Error: Invalid login credentials
```
**Solution:**
- Verify 2-factor authentication is enabled
- Regenerate app-specific password
- Check GMAIL_USER format (full email address)

#### Issue 2: Connection Timeout
```
Error: Connection timeout
```
**Solution:**
- Check network connectivity
- Verify firewall settings allow port 587
- Try alternative ports (465 for SSL)

#### Issue 3: Daily Limit Exceeded
```
Error: Daily sending quota exceeded
```
**Solution:**
- Upgrade to Google Workspace for higher limits
- Implement email queuing system
- Monitor sending volumes

#### Issue 4: Emails Going to Spam
**Solution:**
- Ensure proper SPF/DKIM setup
- Use consistent "From" addresses
- Avoid spam trigger words in subject lines
- Monitor sender reputation

### Advanced Configuration

#### Custom SMTP Settings
```typescript
// Advanced Gmail configuration
const advancedConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  },
  pool: true,          // Use connection pooling
  maxConnections: 5,   // Limit concurrent connections
  maxMessages: 100,    // Messages per connection
  rateDelta: 1000,     // 1 second between emails
  rateLimit: 5         // Max 5 emails per rateDelta
};
```

#### Email Queue Implementation
```typescript
// Simple email queue for high-volume scenarios
class EmailQueue {
  private queue: EmailTemplate[] = [];
  private processing = false;

  async addToQueue(email: EmailTemplate) {
    this.queue.push(email);
    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    this.processing = true;
    while (this.queue.length > 0) {
      const email = this.queue.shift()!;
      await emailService.sendEmail(email);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
    this.processing = false;
  }
}
```

## Step 8: Production Deployment Checklist

### Pre-deployment
- [ ] Gmail account configured with 2FA
- [ ] App-specific password generated
- [ ] Environment variables set in production
- [ ] DNS records configured (if using custom domain)
- [ ] SPF record updated to include Google
- [ ] DKIM configured (if using Google Workspace)

### Post-deployment
- [ ] Test Gmail connection in production
- [ ] Send test emails through fallback system
- [ ] Monitor email delivery logs
- [ ] Set up alerting for fallback usage
- [ ] Document fallback procedures for team

### Monitoring Setup
```javascript
// Add to monitoring service
const emailMonitoring = {
  sendgridFailures: 0,
  gmailFallbackUsage: 0,
  totalEmailsSent: 0,

  logFallback() {
    this.gmailFallbackUsage++;
    // Send alert if fallback usage is high
    if (this.gmailFallbackUsage > 10) {
      console.warn('⚠️ High Gmail fallback usage - check SendGrid status');
    }
  }
};
```

## Conclusion

The Gmail SMTP fallback provides a reliable secondary email service ensuring business continuity when SendGrid experiences issues. Regular monitoring and maintenance of both services ensure optimal email delivery for JC Hair Studio's 62 customers.

## Support and Resources

- **Gmail SMTP Documentation**: https://support.google.com/mail/answer/7126229
- **Google Workspace Setup**: https://workspace.google.com/
- **Nodemailer Documentation**: https://nodemailer.com/
- **Email Testing Tools**: https://www.mail-tester.com/

---

**Last Updated**: 2024
**Document Version**: 1.0
**Maintained By**: JC Hair Studio's 62 Development Team