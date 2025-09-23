#!/bin/bash

# ====================================================================
# DEPLOYMENT STRATEGY 1: Git Hook-Based Deployment
# ====================================================================
#
# Este script configura um deployment automático via git hooks
# que executa quando há push para a branch main
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
REPO_URL="https://github.com/0xjc65eth/jc-hair-studio-ecommerce.git"
DEPLOY_USER=${DEPLOY_USER:-"deploy"}
DEPLOY_HOST=${DEPLOY_HOST:-"your-server.com"}
DEPLOY_PATH=${DEPLOY_PATH:-"/var/www/jc-hair-studio"}
BACKUP_PATH="/var/backups/jc-hair-studio"
DOMAIN=${DOMAIN:-"jchairstudios62.xyz"}

# Logging
LOG_FILE="/var/log/jc-hair-studio-deploy.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Function to log messages
log() {
    echo -e "${GREEN}[$TIMESTAMP] $1${NC}"
    echo "[$TIMESTAMP] $1" >> $LOG_FILE
}

error() {
    echo -e "${RED}[$TIMESTAMP] ERROR: $1${NC}" >&2
    echo "[$TIMESTAMP] ERROR: $1" >> $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[$TIMESTAMP] WARNING: $1${NC}"
    echo "[$TIMESTAMP] WARNING: $1" >> $LOG_FILE
}

# ====================================================================
# 1. SETUP GIT HOOKS ON SERVER
# ====================================================================
setup_git_hooks() {
    log "Setting up Git hooks for automatic deployment..."

    # Create bare repository on server
    ssh $DEPLOY_USER@$DEPLOY_HOST "mkdir -p $DEPLOY_PATH.git"
    ssh $DEPLOY_USER@$DEPLOY_HOST "cd $DEPLOY_PATH.git && git init --bare"

    # Create post-receive hook
    cat > post-receive-hook.sh << 'EOF'
#!/bin/bash
# Git post-receive hook for JC Hair Studio deployment

while read oldrev newrev refname; do
    branch=$(git rev-parse --symbolic --abbrev-ref $refname)

    if [ "$branch" = "main" ]; then
        echo "Deploying branch: $branch"

        # Checkout files to deployment directory
        git --git-dir=$DEPLOY_PATH.git --work-tree=$DEPLOY_PATH checkout -f

        # Change to deployment directory
        cd $DEPLOY_PATH

        # Install dependencies
        npm ci --production

        # Generate Prisma client
        npx prisma generate

        # Build the application
        npm run build:safe

        # Restart the application (using PM2)
        pm2 restart jc-hair-studio || pm2 start ecosystem.config.js

        echo "Deployment complete!"
    fi
done
EOF

    # Upload and set permissions for hook
    scp post-receive-hook.sh $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH.git/hooks/post-receive
    ssh $DEPLOY_USER@$DEPLOY_HOST "chmod +x $DEPLOY_PATH.git/hooks/post-receive"

    # Clean up local hook file
    rm post-receive-hook.sh

    log "Git hooks configured successfully"
}

# ====================================================================
# 2. CONFIGURE REMOTE AND PUSH
# ====================================================================
configure_remote_and_deploy() {
    log "Configuring Git remote for deployment..."

    # Add deployment remote
    git remote remove deploy 2>/dev/null || true
    git remote add deploy $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH.git

    # Push to deployment server
    log "Pushing to deployment server..."
    git push deploy main --force

    log "Deployment via Git hook completed!"
}

# ====================================================================
# 3. CREATE PM2 ECOSYSTEM CONFIGURATION
# ====================================================================
create_pm2_config() {
    log "Creating PM2 ecosystem configuration..."

    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$PROJECT_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$DEPLOY_PATH',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/pm2/$PROJECT_NAME-error.log',
    out_file: '/var/log/pm2/$PROJECT_NAME-out.log',
    log_file: '/var/log/pm2/$PROJECT_NAME.log',
    time: true
  }]
};
EOF

    # Upload PM2 config to server
    scp ecosystem.config.js $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/

    log "PM2 configuration created and uploaded"
}

# ====================================================================
# 4. SETUP NGINX CONFIGURATION
# ====================================================================
setup_nginx() {
    log "Setting up Nginx configuration..."

    cat > nginx-site.conf << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL configuration (configure with your certificates)
    ssl_certificate /etc/ssl/certs/${DOMAIN}.crt;
    ssl_certificate_key /etc/ssl/private/${DOMAIN}.key;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static/ {
        alias $DEPLOY_PATH/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle API routes
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/api/health;
        access_log off;
    }
}
EOF

    # Upload Nginx configuration
    scp nginx-site.conf $DEPLOY_USER@$DEPLOY_HOST:/tmp/
    ssh $DEPLOY_USER@$DEPLOY_HOST "sudo mv /tmp/nginx-site.conf /etc/nginx/sites-available/$PROJECT_NAME"
    ssh $DEPLOY_USER@$DEPLOY_HOST "sudo ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/"
    ssh $DEPLOY_USER@$DEPLOY_HOST "sudo nginx -t && sudo systemctl reload nginx"

    # Clean up local file
    rm nginx-site.conf

    log "Nginx configuration completed"
}

# ====================================================================
# 5. SETUP ENVIRONMENT VARIABLES
# ====================================================================
setup_environment() {
    log "Setting up production environment variables..."

    cat > .env.production << EOF
# Production Environment Variables
NODE_ENV=production
PORT=3001

# Database
MONGODB_URI=$MONGODB_URI_PROD

# Authentication
NEXTAUTH_SECRET=$NEXTAUTH_SECRET_PROD
NEXTAUTH_URL=https://$DOMAIN

# Stripe
STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY_PROD
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY_PROD
STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET_PROD
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY_PROD

# Email
SENDGRID_API_KEY=$SENDGRID_API_KEY_PROD
FROM_EMAIL=noreply@$DOMAIN
SUPPORT_EMAIL=suporte@$DOMAIN

# Site
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
NEXT_PUBLIC_SITE_NAME="JC Hair Studio's 62"

# OAuth
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID_PROD
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET_PROD
TWITTER_CLIENT_ID=$TWITTER_CLIENT_ID_PROD
TWITTER_CLIENT_SECRET=$TWITTER_CLIENT_SECRET_PROD

# Analytics
NEXT_PUBLIC_GA_ID=$GA_ID_PROD
NEXT_PUBLIC_GTAG_ID=$GTAG_ID_PROD

# Cloudinary
CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME_PROD
CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY_PROD
CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET_PROD
EOF

    # Upload environment file
    scp .env.production $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/.env

    # Clean up local file
    rm .env.production

    log "Environment variables configured"
}

# ====================================================================
# 6. SETUP MONITORING AND HEALTH CHECKS
# ====================================================================
setup_monitoring() {
    log "Setting up monitoring and health checks..."

    # Create health check script
    cat > health-check.sh << 'EOF'
#!/bin/bash
# Health check script for JC Hair Studio

SITE_URL="https://jchairstudios62.xyz"
LOG_FILE="/var/log/jc-hair-studio-health.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Check main site
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $SITE_URL)
if [ $RESPONSE -eq 200 ]; then
    echo "[$TIMESTAMP] Site OK (HTTP $RESPONSE)" >> $LOG_FILE
else
    echo "[$TIMESTAMP] Site ERROR (HTTP $RESPONSE)" >> $LOG_FILE
    # Restart application if down
    pm2 restart jc-hair-studio
    # Send notification (implement your notification system here)
fi

# Check API endpoint
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $SITE_URL/api/health)
if [ $API_RESPONSE -eq 200 ]; then
    echo "[$TIMESTAMP] API OK (HTTP $API_RESPONSE)" >> $LOG_FILE
else
    echo "[$TIMESTAMP] API ERROR (HTTP $API_RESPONSE)" >> $LOG_FILE
    pm2 restart jc-hair-studio
fi
EOF

    # Upload health check script
    scp health-check.sh $DEPLOY_USER@$DEPLOY_HOST:/usr/local/bin/
    ssh $DEPLOY_USER@$DEPLOY_HOST "chmod +x /usr/local/bin/health-check.sh"

    # Add cron job for health checks (every 2 minutes)
    ssh $DEPLOY_USER@$DEPLOY_HOST "echo '*/2 * * * * /usr/local/bin/health-check.sh' | crontab -"

    # Clean up local file
    rm health-check.sh

    log "Monitoring setup completed"
}

# ====================================================================
# 7. MAIN EXECUTION FUNCTIONS
# ====================================================================

# Initial server setup
setup_server() {
    log "Setting up server environment..."

    # Install Node.js, PM2, Nginx
    ssh $DEPLOY_USER@$DEPLOY_HOST "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    ssh $DEPLOY_USER@$DEPLOY_HOST "sudo apt-get install -y nodejs nginx"
    ssh $DEPLOY_USER@$DEPLOY_HOST "sudo npm install -g pm2"
    ssh $DEPLOY_USER@$DEPLOY_HOST "pm2 startup"

    # Create deployment directory
    ssh $DEPLOY_USER@$DEPLOY_HOST "sudo mkdir -p $DEPLOY_PATH"
    ssh $DEPLOY_USER@$DEPLOY_HOST "sudo chown -R $DEPLOY_USER:$DEPLOY_USER $DEPLOY_PATH"

    # Create log directories
    ssh $DEPLOY_USER@$DEPLOY_HOST "sudo mkdir -p /var/log/pm2"
    ssh $DEPLOY_USER@$DEPLOY_HOST "sudo chown -R $DEPLOY_USER:$DEPLOY_USER /var/log/pm2"

    log "Server setup completed"
}

# Deploy function
deploy() {
    log "Starting Git hook-based deployment..."

    # Check if we're in a git repository
    if [ ! -d .git ]; then
        error "Not in a Git repository"
    fi

    # Check if main branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        warning "Not on main branch (current: $CURRENT_BRANCH)"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Deployment cancelled"
        fi
    fi

    # Run setup functions
    setup_git_hooks
    create_pm2_config
    setup_nginx
    setup_environment
    setup_monitoring
    configure_remote_and_deploy

    log "Git hook-based deployment completed successfully!"
    log "Site should be available at: https://$DOMAIN"
}

# Rollback function
rollback() {
    log "Rolling back to previous version..."

    ssh $DEPLOY_USER@$DEPLOY_HOST "cd $DEPLOY_PATH && git reset --hard HEAD~1"
    ssh $DEPLOY_USER@$DEPLOY_HOST "cd $DEPLOY_PATH && npm ci --production && npx prisma generate && npm run build:safe"
    ssh $DEPLOY_USER@$DEPLOY_HOST "pm2 restart jc-hair-studio"

    log "Rollback completed"
}

# ====================================================================
# 8. COMMAND LINE INTERFACE
# ====================================================================

usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup     Setup server environment"
    echo "  deploy    Deploy application using Git hooks"
    echo "  rollback  Rollback to previous version"
    echo "  help      Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  DEPLOY_USER        Deployment user (default: deploy)"
    echo "  DEPLOY_HOST        Deployment host (default: your-server.com)"
    echo "  DEPLOY_PATH        Deployment path (default: /var/www/jc-hair-studio)"
    echo "  DOMAIN             Domain name (default: jchairstudios62.xyz)"
    echo ""
    echo "Example:"
    echo "  DEPLOY_HOST=your-server.com DOMAIN=yourdomain.com $0 deploy"
}

case "$1" in
    setup)
        setup_server
        ;;
    deploy)
        deploy
        ;;
    rollback)
        rollback
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