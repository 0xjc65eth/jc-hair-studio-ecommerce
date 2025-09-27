# Email Addresses Documentation - JC Hair Studio's 62

## Overview

This document provides a comprehensive list of all email addresses used throughout the JC Hair Studio's 62 ecommerce platform, their purposes, and configuration requirements.

## Primary Email Addresses

### 1. Orders & Notifications
- **Address**: `orders@jchairstudios62.xyz`
- **Purpose**: Primary sender for all order-related communications
- **Used For**:
  - Order confirmation emails
  - Payment confirmation notifications
  - Shipping notifications
  - Cart abandonment recovery
  - Newsletter subscriptions
  - System notifications

### 2. Customer Support
- **Address**: `suporte@jchairstudios62.xyz`
- **Purpose**: Receives customer inquiries and support requests
- **Used For**:
  - Contact form submissions
  - Customer service inquiries
  - Technical support requests
  - Return/refund requests
  - General business communications

### 3. Contact Forms
- **Address**: `contato@jchairstudios62.xyz`
- **Purpose**: Alternative contact address
- **Used For**:
  - General contact inquiries
  - Business partnership requests
  - Alternative support channel

## Alternative Domain Configurations

Based on the codebase analysis, the following domain variations are referenced:

### Domain: jchairstudios62.com
- `orders@jchairstudios62.com`
- `suporte@jchairstudios62.com`

### Domain: jchairstudio62.com (Legacy)
- `suporte@jchairstudio62.com`
- `contato@jchairstudio62.com`

## Environment Variable Mapping

### Current Configuration (.env)
```bash
# Primary email configuration
FROM_EMAIL="orders@jchairstudios62.xyz"
SUPPORT_EMAIL="suporte@jchairstudios62.xyz"
FROM_NAME="JC Hair Studio's 62"

# SendGrid configuration
SENDGRID_API_KEY="SG.your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="orders@jchairstudios62.xyz"

# Email behavior controls
FORCE_SEND_EMAILS="false"
SENDGRID_SANDBOX_MODE="false"
SENDGRID_TEST_MODE="false"
```

## Email Usage by Module

### 1. Contact Form (`lib/utils/sendgrid.ts`)
- **From**: `orders@jchairstudios62.xyz`
- **To Customer**: Confirmation email
- **To Support**: `suporte@jchairstudios62.xyz`
- **Function**: `sendContactEmail()`

### 2. Order Confirmation (`lib/utils/sendgrid.ts`)
- **From**: `orders@jchairstudios62.xyz`
- **To**: Customer email
- **Function**: `sendOrderConfirmationEmail()`

### 3. Payment Confirmation (`lib/utils/sendgrid.ts`)
- **From**: `orders@jchairstudios62.xyz`
- **To**: Customer email
- **Function**: `sendPaymentConfirmationEmail()`

### 4. Shipping Notifications (`lib/utils/sendgrid.ts`)
- **From**: `orders@jchairstudios62.xyz`
- **To**: Customer email
- **Function**: `sendShippingNotificationEmail()`

### 5. Newsletter Subscription (`lib/utils/sendgrid.ts`)
- **From**: `orders@jchairstudios62.xyz`
- **To**: Subscriber email
- **Function**: `sendNewsletterEmail()`

### 6. Cart Abandonment (`lib/utils/sendgrid.ts`)
- **From**: `orders@jchairstudios62.xyz`
- **To**: Customer email
- **Function**: `sendCartAbandonmentEmail()`

### 7. Stripe Webhooks (`app/api/webhooks/stripe/route.ts`)
- **To**: `suporte@jchairstudios62.xyz`
- **Purpose**: Payment failure notifications

### 8. Shipping APIs (`app/api/shipping/track/route.ts`)
- **To**: `suporte@jchairstudios62.com`
- **Purpose**: Shipping status updates

### 9. Admin Notifications (`app/api/admin/shipping/`)
- **To**: `suporte@jchairstudios62.com`
- **Purpose**: Administrative alerts

## Email Authentication Requirements

### Domain: jchairstudios62.xyz
- **SPF Record**: Must include `include:sendgrid.net`
- **DKIM Records**: Configured through SendGrid domain authentication
- **DMARC Policy**: Recommended for enhanced security

### Required DNS Records
```dns
; SPF Record
@ TXT "v=spf1 include:sendgrid.net ~all"

; DMARC Record (recommended)
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@jchairstudios62.xyz; ruf=mailto:dmarc@jchairstudios62.xyz; fo=1"

; DKIM Records (automatically configured by SendGrid)
s1._domainkey CNAME s1.domainkey.u[sendgrid-id].wl[sendgrid-id].sendgrid.net
s2._domainkey CNAME s2.domainkey.u[sendgrid-id].wl[sendgrid-id].sendgrid.net
```

## Email Templates Overview

### 1. Order Confirmation Email
- **Subject**: `✨ Pedido Confirmado #[ORDER_ID] - JC Hair Studio's 62`
- **Features**: Responsive design, product images, pricing breakdown
- **Language**: Portuguese

### 2. Payment Confirmation Email
- **Subject**: `💳 Pagamento Aprovado - Pedido #[ORDER_ID] - JC Hair Studio's 62`
- **Features**: Payment details, security information
- **Language**: Portuguese

### 3. Shipping Notification Email
- **Subject**: `📦 Seu pedido foi enviado! #[ORDER_ID] - JC Hair Studio's 62`
- **Features**: Tracking information, delivery estimates
- **Language**: Portuguese

### 4. Contact Form Confirmation
- **Subject**: `Recebemos sua mensagem - JC Hair Studio's 62`
- **Features**: WhatsApp contact options, business hours
- **Language**: Portuguese

### 5. Newsletter Welcome Email
- **Subject**: `Bem-vindo(a) à Newsletter JC Hair Studio's 62! 🎉`
- **Features**: Welcome discount, product links
- **Language**: Portuguese

## Fallback Email Configuration

### Gmail SMTP Backup
When SendGrid is unavailable, the system can fall back to Gmail SMTP:

```javascript
// Gmail SMTP Configuration
const gmailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
};
```

### Required Gmail Environment Variables
```bash
GMAIL_USER="orders@jchairstudios62.xyz"
GMAIL_APP_PASSWORD="your-app-specific-password"
ENABLE_GMAIL_FALLBACK="true"
```

## Email Validation Rules

### Format Validation
- Must follow RFC 5322 standard
- Must include @ symbol with valid domain
- Domain must have valid MX record

### Domain Validation
- Preferred domain: `jchairstudios62.xyz`
- Alternative domains: `jchairstudios62.com`
- Legacy domain: `jchairstudio62.com`

### Sender Reputation
- All emails use authenticated domains
- SPF, DKIM, and DMARC alignment required
- Regular monitoring of delivery rates

## Testing and Verification

### Environment-Specific Behavior
- **Development**: Emails logged but not sent (unless `FORCE_SEND_EMAILS=true`)
- **Test**: Mock email sending with detailed logging
- **Production**: Full email delivery with SendGrid

### Test Email Addresses
```bash
# Test environment addresses
FROM_EMAIL="test@jchairstudios62.xyz"
SUPPORT_EMAIL="test-support@jchairstudios62.xyz"
```

## Monitoring and Analytics

### SendGrid Analytics
- Track open rates, click rates, and bounce rates
- Monitor spam complaints and unsubscribe rates
- Review delivery statistics regularly

### DMARC Reports
- Monitor authentication failures
- Track domain abuse attempts
- Adjust policies based on reports

## Best Practices

### Email Security
1. Use authenticated domains only
2. Implement proper SPF/DKIM/DMARC alignment
3. Regular monitoring of email reputation
4. Secure storage of API keys and credentials

### Content Guidelines
1. Professional branding consistent with JC Hair Studio's 62
2. Portuguese language for primary market
3. Mobile-responsive email templates
4. Clear unsubscribe mechanisms
5. GDPR compliance for European customers

### Operational Guidelines
1. Regular backup of email configurations
2. Test email deliverability monthly
3. Monitor domain reputation weekly
4. Update DNS records as needed
5. Maintain fallback email service

## Support and Troubleshooting

### Common Issues
1. **Emails not delivering**: Check domain authentication
2. **High bounce rates**: Validate email lists
3. **Spam folder delivery**: Review sender reputation
4. **Authentication failures**: Verify DNS records

### Emergency Contacts
- **SendGrid Support**: https://support.sendgrid.com/
- **Domain DNS Support**: Contact domain registrar
- **Technical Support**: Check logs and run `verify-domain.mjs`

## Changelog

### Recent Updates
- Added `FORCE_SEND_EMAILS` parameter for testing
- Enhanced email template responsiveness
- Improved error handling and logging
- Added Gmail SMTP fallback configuration
- Updated domain authentication documentation

---

**Last Updated**: 2024
**Document Version**: 1.0
**Maintained By**: JC Hair Studio's 62 Development Team