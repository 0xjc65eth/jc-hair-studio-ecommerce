#!/bin/bash

# ====================================================================
# DEPLOYMENT STRATEGY 2: Local Build + Static Upload
# ====================================================================
#
# Este script executa build local e faz upload dos arquivos estáticos
# para diversos provedores de hosting (S3, FTP, Netlify, etc.)
#
# Autor: JC Hair Studio's 62 Deployment System
# Data: $(date)
# ====================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="jc-hair-studio"
BUILD_DIR=".next"
DIST_DIR="dist"
BACKUP_DIR="backups"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')

# Provider configurations
AWS_S3_BUCKET=${AWS_S3_BUCKET:-"jc-hair-studio-static"}
AWS_REGION=${AWS_REGION:-"us-east-1"}
AWS_CLOUDFRONT_DISTRIBUTION=${AWS_CLOUDFRONT_DISTRIBUTION:-""}
NETLIFY_SITE_ID=${NETLIFY_SITE_ID:-""}
FTP_HOST=${FTP_HOST:-""}
FTP_USER=${FTP_USER:-""}
FTP_PASS=${FTP_PASS:-""}
FTP_PATH=${FTP_PATH:-"/public_html"}

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
# 1. ENVIRONMENT VALIDATION
# ====================================================================
validate_environment() {
    log "Validating build environment..."

    # Check Node.js version
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version must be 18 or higher (current: $(node --version))"
    fi

    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        error "package.json not found. Are you in the project root?"
    fi

    # Check if .env.production exists
    if [ ! -f ".env.production" ] && [ ! -f ".env.local" ]; then
        warning "No production environment file found. Creating template..."
        create_env_template
    fi

    log "Environment validation completed"
}

# ====================================================================
# 2. CREATE ENVIRONMENT TEMPLATE
# ====================================================================
create_env_template() {
    cat > .env.production << 'EOF'
# Production Environment Variables
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jc-hair-studio?retryWrites=true&w=majority

# Authentication
NEXTAUTH_SECRET=your-secret-key-32-chars-minimum
NEXTAUTH_URL=https://yourdomain.com

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key

# Email
SENDGRID_API_KEY=SG.your_sendgrid_key
FROM_EMAIL=noreply@yourdomain.com
SUPPORT_EMAIL=suporte@yourdomain.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME="JC Hair Studio's 62"

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTAG_ID=G-XXXXXXXXXX

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EOF

    warning "Environment template created at .env.production"
    warning "Please update with your production values before deploying"
}

# ====================================================================
# 3. CLEAN AND PREPARE BUILD
# ====================================================================
clean_and_prepare() {
    log "Cleaning previous builds..."

    # Remove previous builds
    rm -rf $BUILD_DIR
    rm -rf $DIST_DIR
    rm -rf out
    rm -rf node_modules/.cache

    # Create backup directory
    mkdir -p $BACKUP_DIR

    # Install dependencies
    log "Installing dependencies..."
    npm ci --production=false

    # Generate Prisma client
    log "Generating Prisma client..."
    npx prisma generate || warning "Prisma generation failed, continuing..."

    log "Preparation completed"
}

# ====================================================================
# 4. BUILD APPLICATION
# ====================================================================
build_application() {
    log "Building application for production..."

    # Set production environment
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    export SKIP_TYPE_CHECK=true
    export SKIP_LINT=true

    # Build the application
    if npm run build:safe; then
        log "Build completed successfully"
    else
        error "Build failed"
    fi

    # Create distribution directory
    mkdir -p $DIST_DIR

    # Copy build files
    if [ -d ".next" ]; then
        cp -r .next $DIST_DIR/
        log "Next.js build files copied"
    else
        error "Next.js build directory not found"
    fi

    # Copy public files
    if [ -d "public" ]; then
        cp -r public $DIST_DIR/
        log "Public files copied"
    fi

    # Copy package.json and other necessary files
    cp package.json $DIST_DIR/
    cp package-lock.json $DIST_DIR/ 2>/dev/null || true

    # Create production environment file in dist
    if [ -f ".env.production" ]; then
        cp .env.production $DIST_DIR/.env
    fi

    log "Distribution files prepared in $DIST_DIR"
}

# ====================================================================
# 5. CREATE STATIC BUILD (FOR STATIC HOSTING)
# ====================================================================
build_static() {
    log "Creating static build for CDN deployment..."

    # Export static files
    npm run build && npm run export 2>/dev/null || {
        warning "Static export not configured, creating manual export..."

        # Create static export manually
        mkdir -p out

        # Copy static assets
        if [ -d ".next/static" ]; then
            cp -r .next/static out/_next/static
        fi

        # Copy public assets
        if [ -d "public" ]; then
            cp -r public/* out/
        fi

        log "Manual static export created"
    }

    if [ -d "out" ]; then
        log "Static files ready for CDN deployment in 'out' directory"
    else
        warning "Static export failed"
    fi
}

# ====================================================================
# 6. AWS S3 DEPLOYMENT
# ====================================================================
deploy_to_s3() {
    log "Deploying to AWS S3..."

    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed. Please install it first."
    fi

    # Check if bucket exists
    if ! aws s3 ls "s3://$AWS_S3_BUCKET" &> /dev/null; then
        log "Creating S3 bucket: $AWS_S3_BUCKET"
        aws s3 mb "s3://$AWS_S3_BUCKET" --region $AWS_REGION

        # Configure bucket for static website hosting
        aws s3 website "s3://$AWS_S3_BUCKET" \
            --index-document index.html \
            --error-document 404.html
    fi

    # Sync files to S3
    if [ -d "out" ]; then
        log "Uploading static files to S3..."
        aws s3 sync out/ "s3://$AWS_S3_BUCKET" \
            --delete \
            --cache-control "public, max-age=31536000" \
            --exclude "*.html" \
            --exclude "*.xml" \
            --exclude "*.txt"

        # Upload HTML files with different cache control
        aws s3 sync out/ "s3://$AWS_S3_BUCKET" \
            --delete \
            --cache-control "public, max-age=0, must-revalidate" \
            --include "*.html" \
            --include "*.xml" \
            --include "*.txt"
    else
        error "No static files found for S3 deployment"
    fi

    # Invalidate CloudFront if distribution ID is provided
    if [ -n "$AWS_CLOUDFRONT_DISTRIBUTION" ]; then
        log "Invalidating CloudFront distribution..."
        aws cloudfront create-invalidation \
            --distribution-id $AWS_CLOUDFRONT_DISTRIBUTION \
            --paths "/*"
    fi

    log "S3 deployment completed"
    log "Site URL: http://$AWS_S3_BUCKET.s3-website-$AWS_REGION.amazonaws.com"
}

# ====================================================================
# 7. NETLIFY DEPLOYMENT
# ====================================================================
deploy_to_netlify() {
    log "Deploying to Netlify..."

    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        log "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi

    # Deploy to Netlify
    if [ -d "out" ]; then
        if [ -n "$NETLIFY_SITE_ID" ]; then
            netlify deploy --prod --dir=out --site=$NETLIFY_SITE_ID
        else
            netlify deploy --prod --dir=out
        fi
        log "Netlify deployment completed"
    else
        error "No static files found for Netlify deployment"
    fi
}

# ====================================================================
# 8. FTP DEPLOYMENT
# ====================================================================
deploy_to_ftp() {
    log "Deploying via FTP..."

    # Check if lftp is installed
    if ! command -v lftp &> /dev/null; then
        error "lftp is not installed. Please install it first."
    fi

    # Validate FTP credentials
    if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
        error "FTP credentials not configured"
    fi

    # Upload files via FTP
    if [ -d "out" ]; then
        log "Uploading files via FTP..."
        lftp -c "
            set ftp:ssl-allow no;
            open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST;
            lcd out;
            cd $FTP_PATH;
            mirror --reverse --delete --verbose;
            bye
        "
        log "FTP deployment completed"
    else
        error "No static files found for FTP deployment"
    fi
}

# ====================================================================
# 9. DOCKER DEPLOYMENT
# ====================================================================
deploy_docker() {
    log "Building and deploying Docker container..."

    # Build Docker image
    docker build -t $PROJECT_NAME:$TIMESTAMP .
    docker tag $PROJECT_NAME:$TIMESTAMP $PROJECT_NAME:latest

    # Create docker-compose.prod.yml for production
    cat > docker-compose.prod.yml << EOF
version: '3.9'

services:
  web:
    image: $PROJECT_NAME:latest
    container_name: $PROJECT_NAME-prod
    restart: always
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    env_file:
      - .env.production
    volumes:
      - ./logs:/app/logs
    networks:
      - prod-network

  nginx:
    image: nginx:alpine
    container_name: $PROJECT_NAME-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - web
    networks:
      - prod-network

networks:
  prod-network:
    driver: bridge
EOF

    # Create Nginx configuration
    cat > nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream app {
        server web:3001;
    }

    server {
        listen 80;
        server_name jchairstudios62.xyz www.jchairstudios62.xyz;
        return 301 https://\$server_name\$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name jchairstudios62.xyz www.jchairstudios62.xyz;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF

    log "Docker deployment files created"
    log "Run 'docker-compose -f docker-compose.prod.yml up -d' to start the production container"
}

# ====================================================================
# 10. BACKUP CURRENT DEPLOYMENT
# ====================================================================
create_backup() {
    log "Creating deployment backup..."

    BACKUP_NAME="backup_${TIMESTAMP}.tar.gz"

    # Create backup of current deployment
    tar -czf "$BACKUP_DIR/$BACKUP_NAME" \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=backups \
        --exclude=logs \
        .

    log "Backup created: $BACKUP_DIR/$BACKUP_NAME"
}

# ====================================================================
# 11. DEPLOY TO MULTIPLE PROVIDERS
# ====================================================================
deploy_multi() {
    log "Deploying to multiple providers..."

    # Build once, deploy everywhere
    build_application
    build_static

    # Deploy to configured providers
    if [ -n "$AWS_S3_BUCKET" ]; then
        deploy_to_s3
    fi

    if [ -n "$NETLIFY_SITE_ID" ] || command -v netlify &> /dev/null; then
        deploy_to_netlify
    fi

    if [ -n "$FTP_HOST" ]; then
        deploy_to_ftp
    fi

    log "Multi-provider deployment completed"
}

# ====================================================================
# 12. VERIFY DEPLOYMENT
# ====================================================================
verify_deployment() {
    log "Verifying deployment..."

    # List of URLs to check
    URLS=(
        "https://jchairstudios62.xyz"
        "https://www.jchairstudios62.xyz"
    )

    for URL in "${URLS[@]}"; do
        if curl -sSf "$URL" > /dev/null; then
            log "✓ $URL is accessible"
        else
            warning "✗ $URL is not accessible"
        fi
    done
}

# ====================================================================
# 13. COMMAND LINE INTERFACE
# ====================================================================

usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  build         Build application locally"
    echo "  static        Create static build for CDN"
    echo "  s3            Deploy to AWS S3"
    echo "  netlify       Deploy to Netlify"
    echo "  ftp           Deploy via FTP"
    echo "  docker        Create Docker deployment"
    echo "  multi         Deploy to multiple providers"
    echo "  backup        Create deployment backup"
    echo "  verify        Verify deployment URLs"
    echo "  help          Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  AWS_S3_BUCKET              S3 bucket name"
    echo "  AWS_REGION                 AWS region"
    echo "  AWS_CLOUDFRONT_DISTRIBUTION CloudFront distribution ID"
    echo "  NETLIFY_SITE_ID            Netlify site ID"
    echo "  FTP_HOST                   FTP hostname"
    echo "  FTP_USER                   FTP username"
    echo "  FTP_PASS                   FTP password"
    echo "  FTP_PATH                   FTP path"
    echo ""
    echo "Examples:"
    echo "  $0 build                   # Build application"
    echo "  $0 static                  # Create static build"
    echo "  AWS_S3_BUCKET=mybucket $0 s3  # Deploy to S3"
    echo "  $0 multi                   # Deploy to all configured providers"
}

# Main execution
case "$1" in
    build)
        validate_environment
        clean_and_prepare
        build_application
        ;;
    static)
        validate_environment
        clean_and_prepare
        build_static
        ;;
    s3)
        validate_environment
        clean_and_prepare
        build_static
        deploy_to_s3
        ;;
    netlify)
        validate_environment
        clean_and_prepare
        build_static
        deploy_to_netlify
        ;;
    ftp)
        validate_environment
        clean_and_prepare
        build_static
        deploy_to_ftp
        ;;
    docker)
        validate_environment
        deploy_docker
        ;;
    multi)
        validate_environment
        create_backup
        deploy_multi
        verify_deployment
        ;;
    backup)
        create_backup
        ;;
    verify)
        verify_deployment
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