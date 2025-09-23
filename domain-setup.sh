#!/bin/bash

# ====================================================================
# CUSTOM DOMAIN SETUP AND MANAGEMENT
# ====================================================================
#
# Script para configurar domínio customizado, SSL, DNS e CDN
# para diversos provedores de hosting
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
PRIMARY_DOMAIN="jchairstudios62.xyz"
WWW_DOMAIN="www.jchairstudios62.xyz"
STAGING_DOMAIN="staging.jchairstudios62.xyz"
API_DOMAIN="api.jchairstudios62.xyz"

# DNS Providers
CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN:-""}
CLOUDFLARE_ZONE_ID=${CLOUDFLARE_ZONE_ID:-""}
NAMECHEAP_API_USER=${NAMECHEAP_API_USER:-""}
NAMECHEAP_API_KEY=${NAMECHEAP_API_KEY:-""}

# SSL Configuration
SSL_EMAIL="admin@jchairstudios62.xyz"
ACME_SERVER="https://acme-v02.api.letsencrypt.org/directory"

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
# 1. DNS CONFIGURATION
# ====================================================================

configure_cloudflare_dns() {
    log "Configuring Cloudflare DNS..."

    if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ZONE_ID" ]; then
        error "Cloudflare API token and Zone ID are required"
    fi

    # Function to create/update DNS record
    create_dns_record() {
        local name="$1"
        local type="$2"
        local content="$3"
        local ttl="${4:-1}"
        local proxied="${5:-true}"

        info "Creating DNS record: $name -> $content"

        curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "{
                \"type\":\"$type\",
                \"name\":\"$name\",
                \"content\":\"$content\",
                \"ttl\":$ttl,
                \"proxied\":$proxied
            }" | jq -r '.success'
    }

    # DNS Records Configuration
    local server_ip=${SERVER_IP:-"192.168.1.100"} # Replace with actual server IP
    local vercel_cname=${VERCEL_CNAME:-"76.76.21.21"} # Vercel's IP

    # A records for main domain
    create_dns_record "$PRIMARY_DOMAIN" "A" "$server_ip" 1 true
    create_dns_record "www" "CNAME" "$PRIMARY_DOMAIN" 1 true
    create_dns_record "staging" "A" "$server_ip" 1 true
    create_dns_record "api" "A" "$server_ip" 1 true

    # Additional records
    create_dns_record "_dmarc" "TXT" "v=DMARC1; p=quarantine; rua=mailto:dmarc@$PRIMARY_DOMAIN" 1 false
    create_dns_record "$PRIMARY_DOMAIN" "TXT" "v=spf1 include:sendgrid.net ~all" 1 false

    log "Cloudflare DNS configuration completed"
}

configure_namecheap_dns() {
    log "Configuring Namecheap DNS..."

    if [ -z "$NAMECHEAP_API_USER" ] || [ -z "$NAMECHEAP_API_KEY" ]; then
        error "Namecheap API credentials are required"
    fi

    # Create Namecheap DNS configuration
    local domain_parts=(${PRIMARY_DOMAIN//./ })
    local sld="${domain_parts[0]}"
    local tld="${domain_parts[1]}"

    info "Setting DNS records for $sld.$tld"

    # This is a simplified example - Namecheap API requires more complex handling
    warning "Namecheap DNS configuration requires manual setup"
    warning "Please configure the following DNS records in Namecheap dashboard:"
    echo ""
    echo "A Record: @ -> $SERVER_IP"
    echo "CNAME Record: www -> $PRIMARY_DOMAIN"
    echo "CNAME Record: staging -> $PRIMARY_DOMAIN"
    echo "A Record: api -> $SERVER_IP"
}

verify_dns_propagation() {
    local domain="$1"
    local expected_ip="$2"

    log "Verifying DNS propagation for $domain..."

    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        local resolved_ip=$(dig +short "$domain" @8.8.8.8 | tail -n1)

        if [ "$resolved_ip" = "$expected_ip" ]; then
            log "✓ DNS propagation verified for $domain -> $expected_ip"
            return 0
        fi

        info "Attempt $attempt/$max_attempts: $domain resolves to $resolved_ip (expected: $expected_ip)"
        sleep 30
        ((attempt++))
    done

    warning "DNS propagation not completed after ${max_attempts} attempts"
    return 1
}

# ====================================================================
# 2. SSL CERTIFICATE MANAGEMENT
# ====================================================================

install_certbot() {
    log "Installing Certbot..."

    if command -v certbot &> /dev/null; then
        log "Certbot already installed"
        return 0
    fi

    # Install based on OS
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    elif command -v yum &> /dev/null; then
        sudo yum install -y certbot python3-certbot-nginx
    elif command -v brew &> /dev/null; then
        brew install certbot
    else
        error "Unable to install Certbot. Please install manually."
    fi

    log "Certbot installed successfully"
}

generate_ssl_certificates() {
    log "Generating SSL certificates..."

    install_certbot

    # Generate certificates for all domains
    local domains="$PRIMARY_DOMAIN,$WWW_DOMAIN,$STAGING_DOMAIN,$API_DOMAIN"

    sudo certbot certonly \
        --nginx \
        --email "$SSL_EMAIL" \
        --agree-tos \
        --no-eff-email \
        --domains "$domains"

    if [ $? -eq 0 ]; then
        log "SSL certificates generated successfully"
    else
        error "Failed to generate SSL certificates"
    fi
}

setup_ssl_auto_renewal() {
    log "Setting up SSL certificate auto-renewal..."

    # Create renewal script
    cat > ssl-renewal.sh << 'EOF'
#!/bin/bash
# SSL Certificate Auto-Renewal Script

/usr/bin/certbot renew --quiet

# Reload Nginx if certificates were renewed
if [ $? -eq 0 ]; then
    systemctl reload nginx
fi
EOF

    chmod +x ssl-renewal.sh

    # Add to crontab
    (crontab -l 2>/dev/null; echo "0 12 * * * $(pwd)/ssl-renewal.sh") | crontab -

    log "SSL auto-renewal configured"
}

# ====================================================================
# 3. NGINX CONFIGURATION
# ====================================================================

create_nginx_config() {
    log "Creating Nginx configuration..."

    cat > nginx-domain.conf << EOF
# JC Hair Studio's 62 - Nginx Configuration
# Generated on $(date)

# Rate limiting
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=general:10m rate=50r/s;

# Upstream servers
upstream jc_hair_studio_app {
    server 127.0.0.1:3001;
    keepalive 32;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name $PRIMARY_DOMAIN $WWW_DOMAIN $STAGING_DOMAIN $API_DOMAIN;

    # ACME challenge location
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# Main production site
server {
    listen 443 ssl http2;
    server_name $PRIMARY_DOMAIN $WWW_DOMAIN;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$PRIMARY_DOMAIN/privkey.pem;

    # SSL Settings
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://www.google-analytics.com; frame-src https://js.stripe.com;" always;

    # Rate limiting
    limit_req zone=general burst=20 nodelay;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Root location
    location / {
        proxy_pass http://jc_hair_studio_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API routes with rate limiting
    location /api/ {
        limit_req zone=api burst=10 nodelay;

        proxy_pass http://jc_hair_studio_app;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files with caching
    location /_next/static/ {
        alias /var/www/jc-hair-studio/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Cache-Status "STATIC";
    }

    # Image optimization
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|avif)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept";
    }

    # Security
    location ~ /\. {
        deny all;
    }

    # Health check
    location /health {
        access_log off;
        proxy_pass http://jc_hair_studio_app/api/health;
    }
}

# Staging environment
server {
    listen 443 ssl http2;
    server_name $STAGING_DOMAIN;

    # SSL Configuration (same certificates)
    ssl_certificate /etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$PRIMARY_DOMAIN/privkey.pem;

    # SSL Settings (same as production)
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Basic authentication for staging
    auth_basic "Staging Environment";
    auth_basic_user_file /etc/nginx/.htpasswd;

    # Same proxy configuration as production
    location / {
        proxy_pass http://jc_hair_studio_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}

# API subdomain
server {
    listen 443 ssl http2;
    server_name $API_DOMAIN;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$PRIMARY_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$PRIMARY_DOMAIN/privkey.pem;

    # API-specific rate limiting
    limit_req zone=api burst=20 nodelay;

    # CORS headers for API
    add_header Access-Control-Allow-Origin "https://$PRIMARY_DOMAIN" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;

    # Handle preflight requests
    location / {
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://$PRIMARY_DOMAIN";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization";
            add_header Access-Control-Max-Age 3600;
            add_header Content-Type "text/plain; charset=utf-8";
            add_header Content-Length 0;
            return 204;
        }

        proxy_pass http://jc_hair_studio_app/api;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    log "Nginx configuration created"
}

deploy_nginx_config() {
    log "Deploying Nginx configuration..."

    # Test configuration
    sudo nginx -t -c nginx-domain.conf

    if [ $? -ne 0 ]; then
        error "Nginx configuration test failed"
    fi

    # Backup existing configuration
    if [ -f "/etc/nginx/sites-available/jc-hair-studio" ]; then
        sudo cp /etc/nginx/sites-available/jc-hair-studio /etc/nginx/sites-available/jc-hair-studio.backup
    fi

    # Deploy new configuration
    sudo cp nginx-domain.conf /etc/nginx/sites-available/jc-hair-studio
    sudo ln -sf /etc/nginx/sites-available/jc-hair-studio /etc/nginx/sites-enabled/

    # Remove default configuration if present
    sudo rm -f /etc/nginx/sites-enabled/default

    # Test and reload
    sudo nginx -t && sudo systemctl reload nginx

    log "Nginx configuration deployed successfully"
}

# ====================================================================
# 4. CDN CONFIGURATION
# ====================================================================

configure_cloudflare_cdn() {
    log "Configuring Cloudflare CDN..."

    if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ -z "$CLOUDFLARE_ZONE_ID" ]; then
        error "Cloudflare API credentials are required"
    fi

    # Configure zone settings
    local settings=(
        '{"value":"flexible"}:ssl'
        '{"value":"on"}:always_use_https'
        '{"value":"on"}:automatic_https_rewrites'
        '{"value":"on"}:brotli'
        '{"value":"on"}:early_hints'
        '{"value":"on"}:http3'
        '{"value":"aggressive"}:cache_level'
        '{"value":"on"}:development_mode'
    )

    for setting in "${settings[@]}"; do
        local value=$(echo "$setting" | cut -d':' -f1)
        local setting_id=$(echo "$setting" | cut -d':' -f2)

        curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/settings/$setting_id" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "$value"
    done

    log "Cloudflare CDN configured"
}

create_cache_rules() {
    log "Creating CDN cache rules..."

    cat > cloudflare-rules.json << 'EOF'
{
  "cache_rules": [
    {
      "expression": "(http.request.uri.path matches \"^/_next/static/.*\")",
      "action": "cache",
      "cache_key": {
        "cache_by_device_type": false,
        "custom_key": {
          "query_string": {
            "exclude": ["*"]
          }
        }
      },
      "edge_cache_ttl": 31536000
    },
    {
      "expression": "(http.request.uri.path matches \"^/api/.*\")",
      "action": "cache",
      "edge_cache_ttl": 300
    },
    {
      "expression": "(http.request.uri.path eq \"/\" or http.request.uri.path matches \"^/produtos.*\")",
      "action": "cache",
      "edge_cache_ttl": 3600
    }
  ]
}
EOF

    info "Cache rules template created"
    info "Apply these rules manually in Cloudflare dashboard"
}

# ====================================================================
# 5. DOMAIN VERIFICATION AND TESTING
# ====================================================================

verify_domain_setup() {
    log "Verifying domain setup..."

    local domains=("$PRIMARY_DOMAIN" "$WWW_DOMAIN" "$STAGING_DOMAIN" "$API_DOMAIN")

    for domain in "${domains[@]}"; do
        info "Testing $domain..."

        # Test HTTP to HTTPS redirect
        local http_response=$(curl -s -o /dev/null -w "%{http_code}" "http://$domain")
        if [ "$http_response" = "301" ] || [ "$http_response" = "302" ]; then
            log "✓ HTTP to HTTPS redirect working for $domain"
        else
            warning "✗ HTTP to HTTPS redirect not working for $domain (got $http_response)"
        fi

        # Test HTTPS
        local https_response=$(curl -s -o /dev/null -w "%{http_code}" "https://$domain")
        if [ "$https_response" = "200" ]; then
            log "✓ HTTPS working for $domain"
        else
            warning "✗ HTTPS not working for $domain (got $https_response)"
        fi

        # Test SSL
        if openssl s_client -connect "$domain:443" -servername "$domain" < /dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
            log "✓ SSL certificate valid for $domain"
        else
            warning "✗ SSL certificate issues for $domain"
        fi
    done

    # Test specific endpoints
    local endpoints=(
        "https://$PRIMARY_DOMAIN/"
        "https://$PRIMARY_DOMAIN/produtos"
        "https://$PRIMARY_DOMAIN/api/health"
        "https://$API_DOMAIN/health"
    )

    for endpoint in "${endpoints[@]}"; do
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
        if [ "$response" = "200" ]; then
            log "✓ $endpoint is accessible"
        else
            warning "✗ $endpoint returned $response"
        fi
    done
}

performance_test() {
    log "Running performance tests..."

    local test_url="https://$PRIMARY_DOMAIN"

    # Test with curl
    local metrics=$(curl -s -w "DNS: %{time_namelookup}s, Connect: %{time_connect}s, SSL: %{time_appconnect}s, Transfer: %{time_total}s, Size: %{size_download} bytes" -o /dev/null "$test_url")

    log "Performance metrics: $metrics"

    # Test with multiple requests
    log "Testing with 10 concurrent requests..."
    for i in {1..10}; do
        curl -s -o /dev/null "$test_url" &
    done
    wait
    log "Concurrent test completed"
}

# ====================================================================
# 6. MAINTENANCE AND MONITORING
# ====================================================================

create_monitoring_script() {
    log "Creating domain monitoring script..."

    cat > domain-monitor.sh << 'EOF'
#!/bin/bash
# Domain Monitoring Script

DOMAINS=("jchairstudios62.xyz" "www.jchairstudios62.xyz" "staging.jchairstudios62.xyz" "api.jchairstudios62.xyz")
LOG_FILE="/var/log/domain-monitor.log"

for domain in "${DOMAINS[@]}"; do
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    # Check HTTP status
    status=$(curl -s -o /dev/null -w "%{http_code}" "https://$domain")

    # Check response time
    response_time=$(curl -s -w "%{time_total}" -o /dev/null "https://$domain")

    if [ "$status" = "200" ]; then
        echo "[$timestamp] ✓ $domain OK ($response_time s)" >> $LOG_FILE
    else
        echo "[$timestamp] ✗ $domain FAILED (HTTP $status)" >> $LOG_FILE
        # Send alert (customize as needed)
        echo "Domain $domain is down (HTTP $status)" | mail -s "Domain Alert" admin@jchairstudios62.xyz
    fi
done
EOF

    chmod +x domain-monitor.sh

    # Add to crontab
    (crontab -l 2>/dev/null; echo "*/5 * * * * $(pwd)/domain-monitor.sh") | crontab -

    log "Domain monitoring configured (runs every 5 minutes)"
}

# ====================================================================
# 7. COMMAND LINE INTERFACE
# ====================================================================

usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  dns-cloudflare    Configure Cloudflare DNS"
    echo "  dns-namecheap     Configure Namecheap DNS"
    echo "  ssl-generate      Generate SSL certificates"
    echo "  ssl-renew         Setup SSL auto-renewal"
    echo "  nginx-config      Create Nginx configuration"
    echo "  nginx-deploy      Deploy Nginx configuration"
    echo "  cdn-setup         Configure Cloudflare CDN"
    echo "  verify            Verify domain setup"
    echo "  performance       Run performance tests"
    echo "  monitor           Setup domain monitoring"
    echo "  full-setup        Complete domain setup"
    echo "  help              Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  PRIMARY_DOMAIN           Main domain (default: jchairstudios62.xyz)"
    echo "  SERVER_IP                Server IP address"
    echo "  CLOUDFLARE_API_TOKEN     Cloudflare API token"
    echo "  CLOUDFLARE_ZONE_ID       Cloudflare Zone ID"
    echo "  SSL_EMAIL                Email for SSL certificates"
    echo ""
    echo "Examples:"
    echo "  $0 full-setup                    # Complete setup"
    echo "  SERVER_IP=1.2.3.4 $0 dns-cloudflare  # Configure DNS"
    echo "  $0 ssl-generate                  # Generate SSL certificates"
}

# Main execution
case "$1" in
    dns-cloudflare)
        configure_cloudflare_dns
        ;;
    dns-namecheap)
        configure_namecheap_dns
        ;;
    ssl-generate)
        generate_ssl_certificates
        ;;
    ssl-renew)
        setup_ssl_auto_renewal
        ;;
    nginx-config)
        create_nginx_config
        ;;
    nginx-deploy)
        deploy_nginx_config
        ;;
    cdn-setup)
        configure_cloudflare_cdn
        create_cache_rules
        ;;
    verify)
        verify_domain_setup
        ;;
    performance)
        performance_test
        ;;
    monitor)
        create_monitoring_script
        ;;
    full-setup)
        log "Starting complete domain setup..."
        configure_cloudflare_dns
        generate_ssl_certificates
        setup_ssl_auto_renewal
        create_nginx_config
        deploy_nginx_config
        configure_cloudflare_cdn
        verify_domain_setup
        create_monitoring_script
        log "Complete domain setup finished!"
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