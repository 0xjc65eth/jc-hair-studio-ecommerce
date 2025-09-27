# Environment Variables Configuration

This document provides a comprehensive guide to all environment variables required for the JC Hair Studio's 62 e-commerce platform.

## Quick Start

### Validation
Before deploying, always validate your environment variables:
```bash
npm run validate-env
```

### Setting Variables in Vercel
```bash
vercel env add VARIABLE_NAME production
```

## Required Variables

### 🔐 Authentication & Security
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | ✅ | Application environment | `production` |
| `NEXTAUTH_SECRET` | ✅ | JWT signing secret (32+ chars) | `your-super-secret-32-character-string` |
| `NEXTAUTH_URL` | ⚠️ | Auth callback URL (production) | `https://jchairstudios62.xyz` |

### 💳 Payment Processing
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | ✅ | Stripe server-side key | `sk_live_...` or `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe client-side key | `pk_live_...` or `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook verification | `whsec_...` |

### 📧 Email Service
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SENDGRID_API_KEY` | ✅ | SendGrid API key | `SG.xxxxxxxxxxxxx...` |
| `SENDGRID_FROM_EMAIL` | ✅ | Verified sender email | `orders@jchairstudios62.xyz` |
| `FROM_EMAIL` | ✅ | Default from email | `orders@jchairstudios62.xyz` |
| `SUPPORT_EMAIL` | ✅ | Support contact email | `suporte@jchairstudios62.xyz` |
| `FROM_NAME` | ✅ | Sender display name | `JC Hair Studio's 62` |

### 🛡️ Email Security Settings
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SENDGRID_SANDBOX_MODE` | ✅ | Sandbox mode (false in prod) | `false` |
| `FORCE_SEND_EMAILS` | ✅ | Force email sending | `false` |

### 🗄️ Database
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | ✅ | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |

## Optional Variables

### 🔑 OAuth Providers
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth client ID | `your-google-client-id` |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth secret | `your-google-secret` |

### 📊 Analytics
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ❌ | Google Analytics ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_GTM_ID` | ❌ | Google Tag Manager ID | `GTM-XXXXXXX` |

### 📁 File Storage
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `CLOUDINARY_CLOUD_NAME` | ❌ | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | ❌ | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | ❌ | Cloudinary API secret | `your-api-secret` |

## Environment-Specific Configuration

### 🚀 Production Requirements

**CRITICAL**: These settings are mandatory for production:

1. **Email Configuration**:
   - `SENDGRID_SANDBOX_MODE` must be `false`
   - `FORCE_SEND_EMAILS` must be `false`
   - All email variables must use the official domain `jchairstudios62.xyz`

2. **Payment Configuration**:
   - Use live Stripe keys (`sk_live_` and `pk_live_`) for real transactions
   - Test keys (`sk_test_` and `pk_test_`) are acceptable for staging

3. **Security**:
   - `NEXTAUTH_SECRET` must be at least 32 characters
   - `SENDGRID_API_KEY` must start with `SG.`
   - No placeholder values like `your-` or `test-`

### 🧪 Development/Testing

For local development, you can use:
- Stripe test keys (`sk_test_` and `pk_test_`)
- `SENDGRID_SANDBOX_MODE=true` to prevent real emails
- `NODE_ENV=development`

## Setup Commands

### 1. Clone Environment Template
```bash
cp .env.example .env.local
```

### 2. Configure Production Variables in Vercel
```bash
# Required variables
vercel env add NODE_ENV production
vercel env add MONGODB_URI production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production

# Payment
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production

# Email
vercel env add SENDGRID_API_KEY production
vercel env add SENDGRID_FROM_EMAIL production
vercel env add FROM_EMAIL production
vercel env add SUPPORT_EMAIL production
vercel env add FROM_NAME production

# Security
vercel env add SENDGRID_SANDBOX_MODE production  # Set to "false"
vercel env add FORCE_SEND_EMAILS production      # Set to "false"
```

### 3. Validate Configuration
```bash
npm run validate-env
```

## Production Checklist

Before deploying to production, ensure:

- [ ] All required variables are set in Vercel
- [ ] `SENDGRID_SANDBOX_MODE` is set to `false`
- [ ] `FORCE_SEND_EMAILS` is set to `false`
- [ ] Email addresses use the official domain
- [ ] Stripe keys are appropriate for the environment
- [ ] `NEXTAUTH_SECRET` is properly secured
- [ ] Validation script passes: `npm run validate-env`

## Troubleshooting

### Common Issues

1. **Email not sending in production**:
   - Check `SENDGRID_SANDBOX_MODE` is `false`
   - Verify `SENDGRID_API_KEY` starts with `SG.`
   - Ensure sender email is verified in SendGrid

2. **Payment failures**:
   - Verify Stripe keys match environment
   - Check webhook secret is correct
   - Ensure webhook endpoint is configured in Stripe

3. **Authentication errors**:
   - `NEXTAUTH_SECRET` must be at least 32 characters
   - `NEXTAUTH_URL` must match deployment URL

### Getting Help

1. Run the validation script:
   ```bash
   npm run validate-env
   ```

2. Check Vercel environment variables:
   ```bash
   vercel env ls production
   ```

3. Review application logs in Vercel dashboard

## Security Notes

🔒 **Important Security Practices**:

- Never commit `.env` files to version control
- Use strong, unique secrets for production
- Regularly rotate API keys and secrets
- Use different credentials for each environment
- Monitor for leaked credentials in logs

## File Structure

```
project/
├── .env.example          # Template with all variables
├── .env.local           # Local development (gitignored)
├── .env.production      # Production values (gitignored)
├── scripts/
│   └── validate-env.ts  # Validation script
└── ENVIRONMENT-VARIABLES.md  # This documentation
```

---

**Last Updated**: January 2025
**Version**: 1.0.0