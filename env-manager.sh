#!/bin/bash

# ====================================================================
# ENVIRONMENT VARIABLES MANAGER
# ====================================================================
#
# Script para gerenciar variáveis de ambiente para diferentes ambientes
# (development, staging, production) e diferentes provedores de deploy
#
# Autor: JC Hair Studio's 62 Deployment System
# Data: $(date)
# ====================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENTS=("development" "staging" "production")
PROVIDERS=("vercel" "netlify" "aws" "docker" "local")

# Function to log messages
log() {
    echo -e "${GREEN}[$(date '+%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%H:%M:%S')] ERROR: $1${NC}" >&2
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')] INFO: $1${NC}"
}

# ====================================================================
# 1. CREATE ENVIRONMENT TEMPLATES
# ====================================================================

create_development_env() {
    log "Creating development environment template..."

    cat > .env.development << 'EOF'
# ====================================================================
# DEVELOPMENT ENVIRONMENT - JC Hair Studio's 62
# ====================================================================

# Node Environment
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Development Server
PORT=3001
NEXT_PUBLIC_SITE_URL=http://localhost:3001
NEXT_PUBLIC_SITE_NAME="JC Hair Studio's 62 - DEV"

# Database (Development)
MONGODB_URI=mongodb://localhost:27017/jc_hair_studio_dev
# Alternative MongoDB Atlas for development
# MONGODB_URI=mongodb+srv://dev_user:dev_password@dev-cluster.mongodb.net/jc_hair_studio_dev?retryWrites=true&w=majority

# Authentication (Development)
NEXTAUTH_SECRET=dev-secret-key-min-32-chars-required-for-jwt
NEXTAUTH_URL=http://localhost:3001

# Stripe (Test Keys)
STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef
STRIPE_SECRET_KEY=sk_test_51234567890abcdef
STRIPE_WEBHOOK_SECRET=whsec_test_1234567890abcdef
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef

# Email (Development - MailHog)
SENDGRID_API_KEY=SG.test_key_for_development
FROM_EMAIL=noreply@localhost
SUPPORT_EMAIL=suporte@localhost
SMTP_HOST=localhost
SMTP_PORT=1025

# OAuth (Development)
GOOGLE_CLIENT_ID=your-dev-google-client-id
GOOGLE_CLIENT_SECRET=your-dev-google-client-secret
TWITTER_CLIENT_ID=your-dev-twitter-client-id
TWITTER_CLIENT_SECRET=your-dev-twitter-client-secret

# Analytics (Development - Disabled)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTAG_ID=

# Cloudinary (Development)
CLOUDINARY_CLOUD_NAME=dev-cloud-name
CLOUDINARY_API_KEY=dev-api-key
CLOUDINARY_API_SECRET=dev-api-secret

# Bitcoin Wallet (Test)
BITCOIN_WALLET_ADDRESS=tb1qtest1234567890abcdef

# Development Flags
DEBUG=true
SKIP_TYPE_CHECK=false
SKIP_LINT=false

# Redis (Development)
REDIS_URL=redis://localhost:6379

# Internationalization
NEXT_PUBLIC_DEFAULT_LOCALE=pt
NEXT_PUBLIC_LOCALES=pt,en,es,fr
EOF

    log "Development environment template created"
}

create_staging_env() {
    log "Creating staging environment template..."

    cat > .env.staging << 'EOF'
# ====================================================================
# STAGING ENVIRONMENT - JC Hair Studio's 62
# ====================================================================

# Node Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Staging Server
PORT=3001
NEXT_PUBLIC_SITE_URL=https://staging.jchairstudios62.xyz
NEXT_PUBLIC_SITE_NAME="JC Hair Studio's 62 - STAGING"

# Database (Staging)
MONGODB_URI=mongodb+srv://staging_user:staging_password@staging-cluster.mongodb.net/jc_hair_studio_staging?retryWrites=true&w=majority

# Authentication (Staging)
NEXTAUTH_SECRET=staging-secret-key-min-32-chars-required-for-jwt-security
NEXTAUTH_URL=https://staging.jchairstudios62.xyz

# Stripe (Test Keys for Staging)
STRIPE_PUBLISHABLE_KEY=pk_test_staging_51234567890abcdef
STRIPE_SECRET_KEY=sk_test_staging_51234567890abcdef
STRIPE_WEBHOOK_SECRET=whsec_staging_1234567890abcdef
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_staging_51234567890abcdef

# Email (Staging)
SENDGRID_API_KEY=SG.staging_sendgrid_api_key
FROM_EMAIL=noreply@staging.jchairstudios62.xyz
SUPPORT_EMAIL=suporte@staging.jchairstudios62.xyz

# OAuth (Staging)
GOOGLE_CLIENT_ID=your-staging-google-client-id
GOOGLE_CLIENT_SECRET=your-staging-google-client-secret
TWITTER_CLIENT_ID=your-staging-twitter-client-id
TWITTER_CLIENT_SECRET=your-staging-twitter-client-secret

# Analytics (Staging)
NEXT_PUBLIC_GA_ID=G-STAGING123456
NEXT_PUBLIC_GTAG_ID=G-STAGING123456

# Cloudinary (Staging)
CLOUDINARY_CLOUD_NAME=staging-cloud-name
CLOUDINARY_API_KEY=staging-api-key
CLOUDINARY_API_SECRET=staging-api-secret

# Bitcoin Wallet (Staging - Testnet)
BITCOIN_WALLET_ADDRESS=tb1qstaging1234567890abcdef

# Staging Flags
DEBUG=false
SKIP_TYPE_CHECK=true
SKIP_LINT=true

# Redis (Staging)
REDIS_URL=redis://staging-redis.jchairstudios62.xyz:6379

# Internationalization
NEXT_PUBLIC_DEFAULT_LOCALE=pt
NEXT_PUBLIC_LOCALES=pt,en,es,fr

# Build Optimizations
NEXT_PRIVATE_STANDALONE=true
EOF

    log "Staging environment template created"
}

create_production_env() {
    log "Creating production environment template..."

    cat > .env.production << 'EOF'
# ====================================================================
# PRODUCTION ENVIRONMENT - JC Hair Studio's 62
# ====================================================================

# Node Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Production Server
PORT=3001
NEXT_PUBLIC_SITE_URL=https://jchairstudios62.xyz
NEXT_PUBLIC_SITE_NAME="JC Hair Studio's 62"

# Database (Production)
MONGODB_URI=mongodb+srv://prod_user:CHANGE_THIS_PASSWORD@prod-cluster.mongodb.net/jc_hair_studio_prod?retryWrites=true&w=majority

# Authentication (Production)
NEXTAUTH_SECRET=CHANGE_THIS_PRODUCTION_SECRET_MIN_32_CHARS_REQUIRED_FOR_JWT_SECURITY
NEXTAUTH_URL=https://jchairstudios62.xyz

# Stripe (Production Keys)
STRIPE_PUBLISHABLE_KEY=pk_live_CHANGE_THIS_PRODUCTION_KEY
STRIPE_SECRET_KEY=sk_live_CHANGE_THIS_PRODUCTION_KEY
STRIPE_WEBHOOK_SECRET=whsec_CHANGE_THIS_PRODUCTION_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_CHANGE_THIS_PRODUCTION_KEY

# Email (Production)
SENDGRID_API_KEY=SG.CHANGE_THIS_PRODUCTION_SENDGRID_API_KEY
FROM_EMAIL=noreply@jchairstudios62.xyz
SUPPORT_EMAIL=suporte@jchairstudios62.xyz

# OAuth (Production)
GOOGLE_CLIENT_ID=CHANGE_THIS_PRODUCTION_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=CHANGE_THIS_PRODUCTION_GOOGLE_CLIENT_SECRET
TWITTER_CLIENT_ID=CHANGE_THIS_PRODUCTION_TWITTER_CLIENT_ID
TWITTER_CLIENT_SECRET=CHANGE_THIS_PRODUCTION_TWITTER_CLIENT_SECRET

# Analytics (Production)
NEXT_PUBLIC_GA_ID=G-CHANGE_THIS_PRODUCTION_GA_ID
NEXT_PUBLIC_GTAG_ID=G-CHANGE_THIS_PRODUCTION_GTAG_ID

# Cloudinary (Production)
CLOUDINARY_CLOUD_NAME=CHANGE_THIS_PRODUCTION_CLOUD_NAME
CLOUDINARY_API_KEY=CHANGE_THIS_PRODUCTION_API_KEY
CLOUDINARY_API_SECRET=CHANGE_THIS_PRODUCTION_API_SECRET

# Bitcoin Wallet (Production - Mainnet)
BITCOIN_WALLET_ADDRESS=bc1qCHANGE_THIS_PRODUCTION_WALLET_ADDRESS

# Production Flags
DEBUG=false
SKIP_TYPE_CHECK=true
SKIP_LINT=true

# Redis (Production)
REDIS_URL=redis://prod-redis.jchairstudios62.xyz:6379

# Internationalization
NEXT_PUBLIC_DEFAULT_LOCALE=pt
NEXT_PUBLIC_LOCALES=pt,en,es,fr

# Security Headers
NEXT_PRIVATE_STANDALONE=true

# Shipping API (Production)
SHIPPING_API_KEY=CHANGE_THIS_PRODUCTION_SHIPPING_API_KEY
SHIPPING_API_URL=https://api.shipping-provider.com
EOF

    log "Production environment template created"
    warning "IMPORTANT: Update all CHANGE_THIS values with actual production credentials!"
}

# ====================================================================
# 2. PROVIDER-SPECIFIC CONFIGURATIONS
# ====================================================================

create_vercel_config() {
    log "Creating Vercel environment configuration..."

    # Create vercel-env.sh for easy deployment
    cat > vercel-env.sh << 'EOF'
#!/bin/bash
# Vercel Environment Variables Setup

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    npm install -g vercel
fi

# Set environment variables for Vercel
vercel env add MONGODB_URI production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add SENDGRID_API_KEY production
vercel env add FROM_EMAIL production
vercel env add SUPPORT_EMAIL production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add NEXT_PUBLIC_GA_ID production
vercel env add CLOUDINARY_CLOUD_NAME production
vercel env add CLOUDINARY_API_KEY production
vercel env add CLOUDINARY_API_SECRET production

echo "Vercel environment variables configured"
echo "Don't forget to set the actual values in Vercel dashboard"
EOF

    chmod +x vercel-env.sh
    log "Vercel configuration script created"
}

create_netlify_config() {
    log "Creating Netlify environment configuration..."

    cat > netlify.toml << 'EOF'
[build]
  publish = "out"
  command = "npm run build && npm run export"

[build.environment]
  NODE_ENV = "production"
  NEXT_TELEMETRY_DISABLED = "1"
  SKIP_TYPE_CHECK = "true"
  SKIP_LINT = "true"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "public, max-age=300"
EOF

    log "Netlify configuration created"
}

create_docker_env() {
    log "Creating Docker environment configuration..."

    cat > .env.docker << 'EOF'
# Docker Environment Configuration
COMPOSE_PROJECT_NAME=jc-hair-studio
COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml

# Container Configuration
WEB_PORT=3001
NGINX_PORT=80
NGINX_SSL_PORT=443
MONGO_PORT=27017
REDIS_PORT=6379

# MongoDB Configuration
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=CHANGE_THIS_MONGO_ROOT_PASSWORD
MONGO_INITDB_DATABASE=jc_hair_studio

# SSL Configuration (for Docker Nginx)
SSL_CERT_PATH=./ssl/cert.pem
SSL_KEY_PATH=./ssl/key.pem
EOF

    log "Docker environment configuration created"
}

# ====================================================================
# 3. ENVIRONMENT VALIDATION
# ====================================================================

validate_env() {
    local env_file="$1"

    if [ ! -f "$env_file" ]; then
        error "Environment file $env_file not found"
    fi

    log "Validating $env_file..."

    # Check for required variables
    required_vars=(
        "NODE_ENV"
        "MONGODB_URI"
        "NEXTAUTH_SECRET"
        "NEXTAUTH_URL"
        "STRIPE_SECRET_KEY"
        "SENDGRID_API_KEY"
    )

    missing_vars=()

    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" "$env_file"; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -gt 0 ]; then
        error "Missing required variables in $env_file: ${missing_vars[*]}"
    fi

    # Check for placeholder values
    placeholder_patterns=(
        "CHANGE_THIS"
        "your-"
        "test_"
        "localhost"
    )

    if [ "$(basename "$env_file")" = ".env.production" ]; then
        for pattern in "${placeholder_patterns[@]}"; do
            if grep -q "$pattern" "$env_file"; then
                warning "Found placeholder values in production environment file"
                warning "Please update all placeholder values before deploying to production"
                break
            fi
        done
    fi

    log "Environment validation completed for $env_file"
}

# ====================================================================
# 4. ENVIRONMENT SWITCHING
# ====================================================================

switch_env() {
    local target_env="$1"

    if [[ ! " ${ENVIRONMENTS[@]} " =~ " ${target_env} " ]]; then
        error "Invalid environment. Valid options: ${ENVIRONMENTS[*]}"
    fi

    local env_file=".env.${target_env}"

    if [ ! -f "$env_file" ]; then
        error "Environment file $env_file not found"
    fi

    # Backup current .env if it exists
    if [ -f ".env" ]; then
        cp .env ".env.backup.$(date +%s)"
        log "Current .env backed up"
    fi

    # Copy target environment to .env
    cp "$env_file" .env
    log "Switched to $target_env environment"

    # Validate the environment
    validate_env .env
}

# ====================================================================
# 5. SECRETS MANAGEMENT
# ====================================================================

generate_secrets() {
    log "Generating secure secrets..."

    # Generate NEXTAUTH_SECRET
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET: $NEXTAUTH_SECRET"

    # Generate other secrets as needed
    JWT_SECRET=$(openssl rand -base64 32)
    echo "JWT_SECRET: $JWT_SECRET"

    # Generate API keys (placeholder format)
    API_KEY=$(openssl rand -hex 16)
    echo "API_KEY: $API_KEY"

    log "Secrets generated. Copy these to your environment files."
}

encrypt_env() {
    local env_file="$1"

    if [ ! -f "$env_file" ]; then
        error "Environment file $env_file not found"
    fi

    # Encrypt environment file
    gpg --symmetric --cipher-algo AES256 "$env_file"
    log "Environment file encrypted: ${env_file}.gpg"

    warning "Store the encrypted file securely and delete the original if it contains sensitive data"
}

decrypt_env() {
    local encrypted_file="$1"

    if [ ! -f "$encrypted_file" ]; then
        error "Encrypted file $encrypted_file not found"
    fi

    # Decrypt environment file
    gpg --decrypt "$encrypted_file" > "${encrypted_file%.gpg}"
    log "Environment file decrypted: ${encrypted_file%.gpg}"
}

# ====================================================================
# 6. ENVIRONMENT COMPARISON
# ====================================================================

compare_envs() {
    local env1="$1"
    local env2="$2"

    if [ ! -f ".env.$env1" ] || [ ! -f ".env.$env2" ]; then
        error "One or both environment files not found"
    fi

    log "Comparing .env.$env1 and .env.$env2..."

    # Show differences
    diff -u ".env.$env1" ".env.$env2" || true
}

# ====================================================================
# 7. COMMAND LINE INTERFACE
# ====================================================================

usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  create [ENV]     Create environment template (development/staging/production)"
    echo "  create-all       Create all environment templates"
    echo "  validate [FILE]  Validate environment file"
    echo "  switch [ENV]     Switch to environment (development/staging/production)"
    echo "  compare [E1] [E2] Compare two environments"
    echo "  secrets          Generate secure secrets"
    echo "  encrypt [FILE]   Encrypt environment file"
    echo "  decrypt [FILE]   Decrypt environment file"
    echo "  vercel           Create Vercel configuration"
    echo "  netlify          Create Netlify configuration"
    echo "  docker           Create Docker configuration"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 create production     # Create production template"
    echo "  $0 create-all           # Create all templates"
    echo "  $0 switch development   # Switch to development"
    echo "  $0 validate .env        # Validate current environment"
    echo "  $0 compare development production  # Compare environments"
}

# Main execution
case "$1" in
    create)
        case "$2" in
            development)
                create_development_env
                ;;
            staging)
                create_staging_env
                ;;
            production)
                create_production_env
                ;;
            *)
                error "Invalid environment. Use: development, staging, or production"
                ;;
        esac
        ;;
    create-all)
        create_development_env
        create_staging_env
        create_production_env
        log "All environment templates created"
        ;;
    validate)
        validate_env "${2:-.env}"
        ;;
    switch)
        switch_env "$2"
        ;;
    compare)
        compare_envs "$2" "$3"
        ;;
    secrets)
        generate_secrets
        ;;
    encrypt)
        encrypt_env "$2"
        ;;
    decrypt)
        decrypt_env "$2"
        ;;
    vercel)
        create_vercel_config
        ;;
    netlify)
        create_netlify_config
        ;;
    docker)
        create_docker_env
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        echo "Error: Unknown command '$1'"
        echo ""
        usage
        exit 1
        ;;
esac