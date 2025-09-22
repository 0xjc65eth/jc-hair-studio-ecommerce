/**
 * JC Hair Studio's 62 - Environment Variables Configuration
 *
 * Centralized environment variable validation and type-safe access.
 * This module provides runtime validation of environment variables
 * and ensures type safety throughout the application.
 *
 * @author JC Hair Studio
 * @version 1.0.0
 */

import { z } from 'zod';

// =================================
// ENVIRONMENT SCHEMA DEFINITION
// =================================

/**
 * Schema for validating all required environment variables
 * Uses Zod for runtime validation and TypeScript inference
 */
const envSchema = z.object({
  // =================================
  // APPLICATION CONFIGURATION
  // =================================

  /** Node.js environment (development, production, test) */
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  /** Application base URL for absolute links and redirects */
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  /** Port number for the application server */
  PORT: z.string().transform(Number).pipe(z.number().int().positive()).default('3000'),

  // =================================
  // DATABASE CONFIGURATION
  // =================================

  /** MongoDB connection string with authentication */
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),

  /** Database name for the application */
  DATABASE_NAME: z.string().default('jc_hair_studio'),

  // =================================
  // AUTHENTICATION CONFIGURATION
  // =================================

  /** NextAuth secret for JWT signing and encryption */
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),

  /** NextAuth URL for callback redirects */
  NEXTAUTH_URL: z.string().url().optional(),

  /** Google OAuth client ID for social authentication */
  GOOGLE_CLIENT_ID: z.string().optional(),

  /** Google OAuth client secret */
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  /** Facebook OAuth app ID */
  FACEBOOK_CLIENT_ID: z.string().optional(),

  /** Facebook OAuth app secret */
  FACEBOOK_CLIENT_SECRET: z.string().optional(),

  // =================================
  // PAYMENT PROCESSING
  // =================================

  /** Stripe publishable key for frontend payment forms */
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'Stripe publishable key is required'),

  /** Stripe secret key for server-side payment processing */
  STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key is required'),

  /** Stripe webhook endpoint secret for event verification */
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'Stripe webhook secret is required'),

  /** PayPal client ID for PayPal payments */
  PAYPAL_CLIENT_ID: z.string().optional(),

  /** PayPal client secret */
  PAYPAL_CLIENT_SECRET: z.string().optional(),

  // =================================
  // EMAIL SERVICES
  // =================================

  /** SendGrid API key for transactional emails */
  SENDGRID_API_KEY: z.string().optional(),

  /** SendGrid verified sender email address */
  SENDGRID_FROM_EMAIL: z.string().email().optional(),

  /** SMTP server hostname for alternative email service */
  SMTP_HOST: z.string().optional(),

  /** SMTP server port number */
  SMTP_PORT: z.string().transform(Number).pipe(z.number().int().positive()).optional(),

  /** SMTP username for authentication */
  SMTP_USER: z.string().optional(),

  /** SMTP password for authentication */
  SMTP_PASS: z.string().optional(),

  // =================================
  // FILE STORAGE
  // =================================

  /** AWS S3 access key for file uploads */
  AWS_ACCESS_KEY_ID: z.string().optional(),

  /** AWS S3 secret access key */
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  /** AWS S3 bucket name for storing product images */
  AWS_S3_BUCKET: z.string().optional(),

  /** AWS S3 region */
  AWS_REGION: z.string().default('eu-west-1'),

  /** Cloudinary cloud name for image optimization */
  CLOUDINARY_CLOUD_NAME: z.string().optional(),

  /** Cloudinary API key */
  CLOUDINARY_API_KEY: z.string().optional(),

  /** Cloudinary API secret */
  CLOUDINARY_API_SECRET: z.string().optional(),

  // =================================
  // ANALYTICS & MONITORING
  // =================================

  /** Google Analytics measurement ID */
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  /** Google Tag Manager container ID */
  NEXT_PUBLIC_GTM_ID: z.string().optional(),

  /** Sentry DSN for error tracking */
  SENTRY_DSN: z.string().optional(),

  /** Vercel Analytics token */
  VERCEL_ANALYTICS_ID: z.string().optional(),

  // =================================
  // THIRD-PARTY INTEGRATIONS
  // =================================

  /** WhatsApp Business API token */
  WHATSAPP_API_TOKEN: z.string().optional(),

  /** WhatsApp phone number ID */
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),

  /** Mailchimp API key for newsletter management */
  MAILCHIMP_API_KEY: z.string().optional(),

  /** Mailchimp audience/list ID */
  MAILCHIMP_AUDIENCE_ID: z.string().optional(),

  // =================================
  // SECURITY & RATE LIMITING
  // =================================

  /** Redis URL for session storage and rate limiting */
  REDIS_URL: z.string().optional(),

  /** API rate limit per minute per IP */
  RATE_LIMIT_PER_MINUTE: z.string().transform(Number).pipe(z.number().int().positive()).default('60'),

  /** JWT expiration time in seconds */
  JWT_EXPIRES_IN: z.string().default('7d'),

  /** Password encryption salt rounds */
  BCRYPT_SALT_ROUNDS: z.string().transform(Number).pipe(z.number().int().min(8).max(15)).default('12'),

  // =================================
  // DEVELOPMENT & DEBUGGING
  // =================================

  /** Enable debug logging in development */
  DEBUG: z.string().transform(val => val === 'true').default('false'),

  /** Skip TypeScript type checking during build */
  SKIP_TYPE_CHECK: z.string().transform(val => val === 'true').default('false'),

  /** Enable verbose logging */
  VERBOSE: z.string().transform(val => val === 'true').default('false'),
});

// =================================
// ENVIRONMENT VALIDATION
// =================================

/**
 * Validates and parses environment variables at runtime
 * Throws descriptive errors if required variables are missing or invalid
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);

      console.error('❌ Environment validation failed:');
      console.error(missingVars.join('\n'));

      // In production, fail fast
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
    throw error;
  }
}

// =================================
// TYPED ENVIRONMENT EXPORT
// =================================

/**
 * Validated and typed environment variables
 * Use this instead of process.env for type safety
 */
export const env = validateEnv();

// =================================
// ENVIRONMENT HELPERS
// =================================

/**
 * Utility functions for environment-specific behavior
 */
export const envHelpers = {
  /** Check if running in development mode */
  isDevelopment: () => env.NODE_ENV === 'development',

  /** Check if running in production mode */
  isProduction: () => env.NODE_ENV === 'production',

  /** Check if running in test mode */
  isTesting: () => env.NODE_ENV === 'test',

  /** Check if debug mode is enabled */
  isDebugMode: () => env.DEBUG,

  /** Check if verbose logging is enabled */
  isVerbose: () => env.VERBOSE,

  /** Get the full application URL */
  getAppUrl: () => env.NEXT_PUBLIC_APP_URL,

  /** Check if email service is configured */
  hasEmailService: () => !!(env.SENDGRID_API_KEY || (env.SMTP_HOST && env.SMTP_USER)),

  /** Check if file storage is configured */
  hasFileStorage: () => !!(env.AWS_ACCESS_KEY_ID || env.CLOUDINARY_CLOUD_NAME),

  /** Check if analytics is configured */
  hasAnalytics: () => !!(env.NEXT_PUBLIC_GA_MEASUREMENT_ID || env.NEXT_PUBLIC_GTM_ID),

  /** Check if social auth is configured */
  hasSocialAuth: () => !!(env.GOOGLE_CLIENT_ID || env.FACEBOOK_CLIENT_ID),
} as const;

// =================================
// ENVIRONMENT TYPE EXPORT
// =================================

/**
 * Type definition for the validated environment
 * Use this type when passing env to functions
 */
export type Environment = typeof env;

/**
 * Configuration object for different environments
 * Contains environment-specific settings and feature flags
 */
export const config = {
  /** Current environment name */
  env: env.NODE_ENV,

  /** Application configuration */
  app: {
    url: env.NEXT_PUBLIC_APP_URL,
    port: env.PORT,
    debug: env.DEBUG,
  },

  /** Database configuration */
  database: {
    url: env.MONGODB_URI,
    name: env.DATABASE_NAME,
  },

  /** Authentication configuration */
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
    providers: {
      google: {
        enabled: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
      facebook: {
        enabled: !!(env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET),
        clientId: env.FACEBOOK_CLIENT_ID,
        clientSecret: env.FACEBOOK_CLIENT_SECRET,
      },
    },
  },

  /** Payment configuration */
  payments: {
    stripe: {
      publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      secretKey: env.STRIPE_SECRET_KEY,
      webhookSecret: env.STRIPE_WEBHOOK_SECRET,
    },
    paypal: {
      enabled: !!(env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET),
      clientId: env.PAYPAL_CLIENT_ID,
      clientSecret: env.PAYPAL_CLIENT_SECRET,
    },
  },

  /** Email service configuration */
  email: {
    provider: env.SENDGRID_API_KEY ? 'sendgrid' : 'smtp',
    sendgrid: {
      apiKey: env.SENDGRID_API_KEY,
      fromEmail: env.SENDGRID_FROM_EMAIL,
    },
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  },

  /** File storage configuration */
  storage: {
    provider: env.AWS_ACCESS_KEY_ID ? 'aws' : env.CLOUDINARY_CLOUD_NAME ? 'cloudinary' : 'local',
    aws: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      bucket: env.AWS_S3_BUCKET,
      region: env.AWS_REGION,
    },
    cloudinary: {
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      apiSecret: env.CLOUDINARY_API_SECRET,
    },
  },

  /** Analytics configuration */
  analytics: {
    google: {
      measurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    },
    gtm: {
      containerId: env.NEXT_PUBLIC_GTM_ID,
    },
    sentry: {
      dsn: env.SENTRY_DSN,
    },
  },

  /** Security configuration */
  security: {
    rateLimitPerMinute: env.RATE_LIMIT_PER_MINUTE,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
    bcryptSaltRounds: env.BCRYPT_SALT_ROUNDS,
    redis: {
      url: env.REDIS_URL,
    },
  },
} as const;