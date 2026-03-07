/**
 * Environment Variables Validation
 * JC Hair Studio's 62 E-commerce
 *
 * This module validates that all required environment variables are set
 * before the application starts. Prevents silent failures in production.
 */

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
  category: 'database' | 'auth' | 'payment' | 'email' | 'analytics' | 'seo' | 'storage' | 'general';
}

const ENV_VARS: EnvVar[] = [
  // Database
  { name: 'MONGODB_URI', required: true, description: 'MongoDB Atlas connection URI', category: 'database' },
  { name: 'DATABASE_NAME', required: false, description: 'MongoDB database name', category: 'database' },

  // Authentication
  { name: 'NEXTAUTH_URL', required: true, description: 'NextAuth base URL', category: 'auth' },
  { name: 'NEXTAUTH_SECRET', required: true, description: 'NextAuth encryption secret', category: 'auth' },
  { name: 'GOOGLE_CLIENT_ID', required: false, description: 'Google OAuth client ID', category: 'auth' },
  { name: 'GOOGLE_CLIENT_SECRET', required: false, description: 'Google OAuth client secret', category: 'auth' },
  { name: 'TWITTER_CLIENT_ID', required: false, description: 'Twitter OAuth client ID', category: 'auth' },
  { name: 'TWITTER_CLIENT_SECRET', required: false, description: 'Twitter OAuth client secret', category: 'auth' },

  // Payments
  { name: 'STRIPE_SECRET_KEY', required: true, description: 'Stripe secret API key', category: 'payment' },
  { name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', required: true, description: 'Stripe publishable key', category: 'payment' },
  { name: 'STRIPE_WEBHOOK_SECRET', required: true, description: 'Stripe webhook signing secret', category: 'payment' },

  // Email
  { name: 'SENDGRID_API_KEY', required: false, description: 'SendGrid API key for transactional emails', category: 'email' },
  { name: 'SUPPORT_EMAIL', required: false, description: 'Support email address', category: 'email' },

  // Analytics
  { name: 'NEXT_PUBLIC_GA_ID', required: false, description: 'Google Analytics 4 measurement ID', category: 'analytics' },
  { name: 'NEXT_PUBLIC_FACEBOOK_PIXEL_ID', required: false, description: 'Facebook Pixel ID', category: 'analytics' },

  // SEO Verification
  { name: 'NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION', required: false, description: 'Google Search Console verification token', category: 'seo' },
  { name: 'NEXT_PUBLIC_BING_VERIFICATION', required: false, description: 'Bing Webmaster verification token', category: 'seo' },

  // General
  { name: 'NEXT_PUBLIC_BASE_URL', required: true, description: 'Public base URL of the site', category: 'general' },
  { name: 'NEXT_PUBLIC_SITE_URL', required: false, description: 'Alternative site URL', category: 'general' },

  // Storage
  { name: 'CLOUDINARY_CLOUD_NAME', required: false, description: 'Cloudinary cloud name', category: 'storage' },
  { name: 'CLOUDINARY_API_KEY', required: false, description: 'Cloudinary API key', category: 'storage' },
  { name: 'CLOUDINARY_API_SECRET', required: false, description: 'Cloudinary API secret', category: 'storage' },
];

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    total: number;
    required: number;
    requiredSet: number;
    optional: number;
    optionalSet: number;
  };
}

export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let requiredSet = 0;
  let optionalSet = 0;

  const required = ENV_VARS.filter(v => v.required);
  const optional = ENV_VARS.filter(v => !v.required);

  for (const envVar of ENV_VARS) {
    const value = process.env[envVar.name];

    if (envVar.required && !value) {
      errors.push(`[${envVar.category.toUpperCase()}] Missing required: ${envVar.name} - ${envVar.description}`);
    } else if (envVar.required && value) {
      requiredSet++;
    } else if (!envVar.required && !value) {
      warnings.push(`[${envVar.category.toUpperCase()}] Optional not set: ${envVar.name} - ${envVar.description}`);
    } else if (!envVar.required && value) {
      optionalSet++;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    summary: {
      total: ENV_VARS.length,
      required: required.length,
      requiredSet,
      optional: optional.length,
      optionalSet,
    },
  };
}

/**
 * Validates environment on startup and logs results.
 * In production, throws if required vars are missing.
 * In development, only warns.
 */
export function checkEnvironment(): void {
  const result = validateEnvironment();
  const isProduction = process.env.NODE_ENV === 'production';

  if (!result.isValid) {
    const errorMessage = [
      '========================================',
      'ENVIRONMENT VALIDATION FAILED',
      '========================================',
      '',
      `${result.errors.length} required variable(s) missing:`,
      ...result.errors.map(e => `  - ${e}`),
      '',
      `Set: ${result.summary.requiredSet}/${result.summary.required} required`,
      `Optional: ${result.summary.optionalSet}/${result.summary.optional} set`,
      '========================================',
    ].join('\n');

    if (isProduction) {
      throw new Error(errorMessage);
    } else {
      console.warn(errorMessage);
    }
  }

  if (result.warnings.length > 0 && !isProduction) {
    console.info(
      `[ENV] ${result.warnings.length} optional variable(s) not set. ` +
      `Some features may be limited.`
    );
  }
}
