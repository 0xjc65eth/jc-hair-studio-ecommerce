#!/bin/bash

# ====================================================================
# MASTER DEPLOYMENT ORCHESTRATOR
# ====================================================================
#
# Script principal que coordena todas as estratégias de deployment
# alternativas ao Vercel, incluindo fallbacks automáticos
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
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ASCII Art Banner
show_banner() {
    echo -e "${CYAN}"
    cat << 'EOF'
     ██╗ ██████╗    ██╗  ██╗ █████╗ ██╗██████╗     ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
     ██║██╔════╝    ██║  ██║██╔══██╗██║██╔══██╗    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
     ██║██║         ███████║███████║██║██████╔╝    ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
██   ██║██║         ██╔══██║██╔══██║██║██╔══██╗    ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
╚█████╔╝╚██████╗    ██║  ██║██║  ██║██║██║  ██║    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
 ╚════╝  ╚═════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝

                              DEPLOYMENT ORCHESTRATOR v2.0
                             Alternative Deployment Strategies
EOF
    echo -e "${NC}"
}

# Configuration
PROJECT_NAME="jc-hair-studio"
VERSION="2.0.0"
LOG_DIR="logs"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
LOG_FILE="$LOG_DIR/deployment_${TIMESTAMP}.log"

# Deployment strategies (in priority order)
STRATEGIES=(
    "vercel"
    "git-hook"
    "static-s3"
    "static-netlify"
    "docker"
    "static-ftp"
)

# Function to log messages
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case "$level" in
        "INFO")  echo -e "${GREEN}[$timestamp] [INFO] $message${NC}" ;;
        "WARN")  echo -e "${YELLOW}[$timestamp] [WARN] $message${NC}" ;;
        "ERROR") echo -e "${RED}[$timestamp] [ERROR] $message${NC}" ;;
        "DEBUG") echo -e "${BLUE}[$timestamp] [DEBUG] $message${NC}" ;;
        "SUCCESS") echo -e "${GREEN}[$timestamp] [SUCCESS] $message${NC}" ;;
        *) echo -e "${CYAN}[$timestamp] $message${NC}" ;;
    esac

    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# ====================================================================
# 1. ENVIRONMENT VALIDATION
# ====================================================================

validate_environment() {
    log "INFO" "Validating deployment environment..."

    # Create log directory
    mkdir -p "$LOG_DIR"

    # Check Git repository
    if [ ! -d ".git" ]; then
        log "ERROR" "Not in a Git repository"
        return 1
    fi

    # Check if on main branch
    local current_branch=$(git rev-parse --abbrev-ref HEAD)
    if [ "$current_branch" != "main" ]; then
        log "WARN" "Not on main branch (current: $current_branch)"
        read -p "Continue with deployment? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "ERROR" "Deployment cancelled by user"
            return 1
        fi
    fi

    # Check Node.js version
    if ! command -v node &> /dev/null; then
        log "ERROR" "Node.js is not installed"
        return 1
    fi

    local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        log "ERROR" "Node.js version must be 18 or higher (current: $(node --version))"
        return 1
    fi

    # Check required files
    local required_files=("package.json" "next.config.js")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            log "ERROR" "Required file not found: $file"
            return 1
        fi
    done

    log "SUCCESS" "Environment validation completed"
    return 0
}

# ====================================================================
# 2. PRE-DEPLOYMENT CHECKS
# ====================================================================

pre_deployment_checks() {
    log "INFO" "Running pre-deployment checks..."

    # Check uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        log "WARN" "Uncommitted changes detected"
        read -p "Commit changes before deployment? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git add -A
            git commit -m "chore: pre-deployment commit - $(date)"
            log "INFO" "Changes committed"
        fi
    fi

    # Run tests if available
    if npm run test:unit &> /dev/null; then
        log "INFO" "Running unit tests..."
        if npm run test:unit; then
            log "SUCCESS" "Unit tests passed"
        else
            log "ERROR" "Unit tests failed"
            read -p "Continue deployment despite test failures? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                return 1
            fi
        fi
    fi

    # Check environment variables
    if [ ! -f ".env.production" ] && [ ! -f ".env" ]; then
        log "WARN" "No production environment file found"
        log "INFO" "Creating environment template..."
        ./env-manager.sh create production
    fi

    log "SUCCESS" "Pre-deployment checks completed"
    return 0
}

# ====================================================================
# 3. DEPLOYMENT STRATEGIES
# ====================================================================

deploy_vercel() {
    log "INFO" "Attempting Vercel deployment..."

    # Check if Vercel CLI is available
    if ! command -v vercel &> /dev/null; then
        log "INFO" "Installing Vercel CLI..."
        npm install -g vercel@latest
    fi

    # Try Vercel deployment
    if vercel --prod --yes --token="${VERCEL_TOKEN:-}" 2>&1 | tee -a "$LOG_FILE"; then
        log "SUCCESS" "Vercel deployment successful"
        return 0
    else
        log "ERROR" "Vercel deployment failed"
        return 1
    fi
}

deploy_git_hook() {
    log "INFO" "Attempting Git hook deployment..."

    if [ ! -f "deploy-git-hook.sh" ]; then
        log "ERROR" "Git hook deployment script not found"
        return 1
    fi

    chmod +x deploy-git-hook.sh

    if ./deploy-git-hook.sh deploy 2>&1 | tee -a "$LOG_FILE"; then
        log "SUCCESS" "Git hook deployment successful"
        return 0
    else
        log "ERROR" "Git hook deployment failed"
        return 1
    fi
}

deploy_static_s3() {
    log "INFO" "Attempting AWS S3 static deployment..."

    if [ ! -f "deploy-static.sh" ]; then
        log "ERROR" "Static deployment script not found"
        return 1
    fi

    chmod +x deploy-static.sh

    if ./deploy-static.sh s3 2>&1 | tee -a "$LOG_FILE"; then
        log "SUCCESS" "S3 deployment successful"
        return 0
    else
        log "ERROR" "S3 deployment failed"
        return 1
    fi
}

deploy_static_netlify() {
    log "INFO" "Attempting Netlify static deployment..."

    if [ ! -f "deploy-static.sh" ]; then
        log "ERROR" "Static deployment script not found"
        return 1
    fi

    chmod +x deploy-static.sh

    if ./deploy-static.sh netlify 2>&1 | tee -a "$LOG_FILE"; then
        log "SUCCESS" "Netlify deployment successful"
        return 0
    else
        log "ERROR" "Netlify deployment failed"
        return 1
    fi
}

deploy_docker() {
    log "INFO" "Attempting Docker deployment..."

    if [ ! -f "Dockerfile" ]; then
        log "ERROR" "Dockerfile not found"
        return 1
    fi

    if [ ! -f "deploy-static.sh" ]; then
        log "ERROR" "Static deployment script not found"
        return 1
    fi

    chmod +x deploy-static.sh

    if ./deploy-static.sh docker 2>&1 | tee -a "$LOG_FILE"; then
        log "SUCCESS" "Docker deployment successful"
        return 0
    else
        log "ERROR" "Docker deployment failed"
        return 1
    fi
}

deploy_static_ftp() {
    log "INFO" "Attempting FTP static deployment..."

    if [ ! -f "deploy-static.sh" ]; then
        log "ERROR" "Static deployment script not found"
        return 1
    fi

    chmod +x deploy-static.sh

    if ./deploy-static.sh ftp 2>&1 | tee -a "$LOG_FILE"; then
        log "SUCCESS" "FTP deployment successful"
        return 0
    else
        log "ERROR" "FTP deployment failed"
        return 1
    fi
}

# ====================================================================
# 4. DEPLOYMENT ORCHESTRATION
# ====================================================================

execute_deployment_strategy() {
    local strategy="$1"

    case "$strategy" in
        "vercel")
            deploy_vercel
            ;;
        "git-hook")
            deploy_git_hook
            ;;
        "static-s3")
            deploy_static_s3
            ;;
        "static-netlify")
            deploy_static_netlify
            ;;
        "docker")
            deploy_docker
            ;;
        "static-ftp")
            deploy_static_ftp
            ;;
        *)
            log "ERROR" "Unknown deployment strategy: $strategy"
            return 1
            ;;
    esac
}

deploy_with_fallback() {
    local specified_strategy="$1"
    local successful_strategy=""

    # Create pre-deployment backup
    if [ -f "rollback-system.sh" ]; then
        chmod +x rollback-system.sh
        ./rollback-system.sh backup "pre_deploy_${TIMESTAMP}"
    fi

    if [ -n "$specified_strategy" ]; then
        log "INFO" "Attempting specified strategy: $specified_strategy"

        if execute_deployment_strategy "$specified_strategy"; then
            successful_strategy="$specified_strategy"
        else
            log "WARN" "Specified strategy failed, trying fallback strategies..."
        fi
    fi

    # If no strategy specified or the specified one failed, try all strategies
    if [ -z "$successful_strategy" ]; then
        for strategy in "${STRATEGIES[@]}"; do
            if [ "$strategy" = "$specified_strategy" ]; then
                continue # Skip already tried strategy
            fi

            log "INFO" "Trying deployment strategy: $strategy"

            if execute_deployment_strategy "$strategy"; then
                successful_strategy="$strategy"
                break
            else
                log "WARN" "Strategy $strategy failed, trying next..."
                sleep 5 # Brief pause between attempts
            fi
        done
    fi

    if [ -n "$successful_strategy" ]; then
        log "SUCCESS" "Deployment successful using strategy: $successful_strategy"

        # Start monitoring if rollback system is available
        if [ -f "rollback-system.sh" ]; then
            log "INFO" "Starting post-deployment monitoring..."
            ./rollback-system.sh monitor 1800 &
            local monitor_pid=$!
            log "INFO" "Monitoring started (PID: $monitor_pid)"
        fi

        return 0
    else
        log "ERROR" "All deployment strategies failed"

        # Attempt rollback if available
        if [ -f "rollback-system.sh" ]; then
            log "INFO" "Attempting automatic rollback..."
            ./rollback-system.sh auto-rollback
        fi

        return 1
    fi
}

# ====================================================================
# 5. POST-DEPLOYMENT VERIFICATION
# ====================================================================

verify_deployment() {
    log "INFO" "Verifying deployment..."

    local urls=(
        "https://jchairstudios62.xyz"
        "https://www.jchairstudios62.xyz"
        "https://jchairstudios62.xyz/produtos"
        "https://jchairstudios62.xyz/api/health"
    )

    local failed_checks=0

    for url in "${urls[@]}"; do
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

        if [ "$response" = "200" ]; then
            log "SUCCESS" "✓ $url is accessible"
        else
            log "ERROR" "✗ $url returned HTTP $response"
            ((failed_checks++))
        fi
    done

    if [ $failed_checks -eq 0 ]; then
        log "SUCCESS" "All verification checks passed"
        return 0
    else
        log "ERROR" "$failed_checks verification checks failed"
        return 1
    fi
}

# ====================================================================
# 6. DEPLOYMENT SUMMARY AND REPORTING
# ====================================================================

generate_deployment_report() {
    local strategy="$1"
    local status="$2"

    cat > "deployment_report_${TIMESTAMP}.html" << EOF
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deployment Report - JC Hair Studio's 62</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; }
        .status-success { color: #059669; font-weight: bold; }
        .status-failed { color: #dc2626; font-weight: bold; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 6px; }
        .log-content { background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="header">
        <h1>JC Hair Studio's 62 - Deployment Report</h1>
        <p>Generated on: $(date)</p>
    </div>

    <div class="section">
        <h2>Deployment Summary</h2>
        <p><strong>Strategy Used:</strong> $strategy</p>
        <p><strong>Status:</strong> <span class="status-$status">$status</span></p>
        <p><strong>Timestamp:</strong> $TIMESTAMP</p>
        <p><strong>Git Commit:</strong> $(git rev-parse HEAD 2>/dev/null || echo 'N/A')</p>
        <p><strong>Git Branch:</strong> $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'N/A')</p>
    </div>

    <div class="section">
        <h2>Environment Information</h2>
        <p><strong>Node.js Version:</strong> $(node --version)</p>
        <p><strong>NPM Version:</strong> $(npm --version)</p>
        <p><strong>Platform:</strong> $(uname -s)</p>
        <p><strong>Architecture:</strong> $(uname -m)</p>
    </div>

    <div class="section">
        <h2>Deployment Log</h2>
        <div class="log-content">
            <pre>$(tail -50 "$LOG_FILE" | html_escape)</pre>
        </div>
    </div>

    <div class="section">
        <h2>Next Steps</h2>
        <ul>
            <li>Monitor application performance</li>
            <li>Check error logs</li>
            <li>Verify all features are working</li>
            <li>Update DNS records if necessary</li>
            <li>Set up monitoring alerts</li>
        </ul>
    </div>
</body>
</html>
EOF

    log "INFO" "Deployment report generated: deployment_report_${TIMESTAMP}.html"
}

html_escape() {
    sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g; s/'"'"'/\&#39;/g'
}

# ====================================================================
# 7. COMMAND LINE INTERFACE
# ====================================================================

show_help() {
    echo "JC Hair Studio's 62 - Master Deployment Orchestrator"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  deploy [STRATEGY]    Deploy using specific strategy or auto-fallback"
    echo "  verify              Verify current deployment"
    echo "  rollback            Rollback to previous version"
    echo "  status              Show deployment status"
    echo "  logs                Show deployment logs"
    echo "  setup               Setup deployment environment"
    echo "  help                Show this help message"
    echo ""
    echo "Strategies:"
    echo "  vercel              Deploy to Vercel (default)"
    echo "  git-hook            Deploy via Git hooks"
    echo "  static-s3           Deploy static files to AWS S3"
    echo "  static-netlify      Deploy static files to Netlify"
    echo "  docker              Deploy using Docker"
    echo "  static-ftp          Deploy static files via FTP"
    echo ""
    echo "Environment Variables:"
    echo "  VERCEL_TOKEN        Vercel authentication token"
    echo "  AWS_ACCESS_KEY_ID   AWS access key"
    echo "  AWS_SECRET_ACCESS_KEY AWS secret key"
    echo "  NETLIFY_AUTH_TOKEN  Netlify authentication token"
    echo "  FTP_HOST           FTP server hostname"
    echo "  FTP_USER           FTP username"
    echo "  FTP_PASS           FTP password"
    echo ""
    echo "Examples:"
    echo "  $0 deploy                    # Auto-deploy with fallback"
    echo "  $0 deploy vercel             # Deploy only to Vercel"
    echo "  $0 deploy static-s3          # Deploy only to S3"
    echo "  $0 verify                    # Verify deployment"
    echo "  $0 rollback                  # Rollback deployment"
}

setup_deployment_environment() {
    log "INFO" "Setting up deployment environment..."

    # Make all scripts executable
    local scripts=(
        "deploy-git-hook.sh"
        "deploy-static.sh"
        "env-manager.sh"
        "rollback-system.sh"
        "domain-setup.sh"
    )

    for script in "${scripts[@]}"; do
        if [ -f "$script" ]; then
            chmod +x "$script"
            log "INFO" "Made $script executable"
        else
            log "WARN" "$script not found"
        fi
    done

    # Initialize environment manager
    if [ -f "env-manager.sh" ]; then
        ./env-manager.sh create-all
    fi

    # Initialize rollback system
    if [ -f "rollback-system.sh" ]; then
        ./rollback-system.sh init
    fi

    log "SUCCESS" "Deployment environment setup completed"
}

show_status() {
    log "INFO" "Checking deployment status..."

    # Check if site is accessible
    local response=$(curl -s -o /dev/null -w "%{http_code}" "https://jchairstudios62.xyz" 2>/dev/null || echo "000")

    if [ "$response" = "200" ]; then
        log "SUCCESS" "Site is online and accessible"
    else
        log "ERROR" "Site is not accessible (HTTP $response)"
    fi

    # Show last deployment
    if [ -f "$LOG_DIR/deployment_"*.log ]; then
        local last_log=$(ls -t "$LOG_DIR"/deployment_*.log | head -n1)
        log "INFO" "Last deployment log: $last_log"
        echo "Last 10 lines:"
        tail -10 "$last_log"
    else
        log "INFO" "No deployment logs found"
    fi
}

show_logs() {
    if [ -f "$LOG_DIR/deployment_"*.log ]; then
        local last_log=$(ls -t "$LOG_DIR"/deployment_*.log | head -n1)
        log "INFO" "Showing logs from: $last_log"
        cat "$last_log"
    else
        log "ERROR" "No deployment logs found"
    fi
}

# ====================================================================
# 8. MAIN EXECUTION
# ====================================================================

main() {
    show_banner

    # Validate environment first
    if ! validate_environment; then
        exit 1
    fi

    case "$1" in
        deploy)
            if ! pre_deployment_checks; then
                exit 1
            fi

            if deploy_with_fallback "$2"; then
                verify_deployment
                generate_deployment_report "${2:-auto-fallback}" "success"
                log "SUCCESS" "Deployment completed successfully!"
            else
                generate_deployment_report "${2:-auto-fallback}" "failed"
                log "ERROR" "Deployment failed!"
                exit 1
            fi
            ;;
        verify)
            verify_deployment
            ;;
        rollback)
            if [ -f "rollback-system.sh" ]; then
                chmod +x rollback-system.sh
                ./rollback-system.sh auto-rollback
            else
                log "ERROR" "Rollback system not available"
                exit 1
            fi
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs
            ;;
        setup)
            setup_deployment_environment
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log "ERROR" "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"