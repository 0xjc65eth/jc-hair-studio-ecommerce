#!/bin/bash

# ====================================================================
# AUTOMATIC ROLLBACK SYSTEM
# ====================================================================
#
# Sistema automático de rollback para reverter deployments problemáticos
# Inclui monitoramento de saúde, detecção de falhas e rollback automático
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
PROJECT_NAME="jc-hair-studio"
BACKUP_DIR="deployment-backups"
ROLLBACK_DIR="rollback-snapshots"
LOG_DIR="logs"
HEALTH_CHECK_INTERVAL=30
MAX_HEALTH_CHECK_FAILURES=3
ROLLBACK_TIMEOUT=300

# URLs for health checks
HEALTH_URLS=(
    "https://jchairstudios62.xyz"
    "https://jchairstudios62.xyz/api/health"
    "https://jchairstudios62.xyz/produtos"
)

# Critical API endpoints to monitor
API_ENDPOINTS=(
    "/api/health"
    "/api/products"
    "/api/auth/session"
    "/api/stripe/config"
)

# Function to log messages
log() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${GREEN}[$timestamp] $1${NC}"
    echo "[$timestamp] $1" >> "$LOG_DIR/rollback.log"
}

error() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] ERROR: $1${NC}" >&2
    echo "[$timestamp] ERROR: $1" >> "$LOG_DIR/rollback.log"
}

warning() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] WARNING: $1${NC}"
    echo "[$timestamp] WARNING: $1" >> "$LOG_DIR/rollback.log"
}

info() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp] INFO: $1${NC}"
    echo "[$timestamp] INFO: $1" >> "$LOG_DIR/rollback.log"
}

# ====================================================================
# 1. INITIALIZATION AND SETUP
# ====================================================================

init_rollback_system() {
    log "Initializing rollback system..."

    # Create necessary directories
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$ROLLBACK_DIR"
    mkdir -p "$LOG_DIR"

    # Create rollback configuration
    cat > rollback.config << 'EOF'
# Rollback System Configuration

# Health Check Settings
HEALTH_CHECK_INTERVAL=30
MAX_HEALTH_CHECK_FAILURES=3
HEALTH_CHECK_TIMEOUT=10
ROLLBACK_TIMEOUT=300

# Monitoring Settings
CPU_THRESHOLD=80
MEMORY_THRESHOLD=85
RESPONSE_TIME_THRESHOLD=5000
ERROR_RATE_THRESHOLD=5

# Notification Settings
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SLACK_NOTIFICATIONS=false
ENABLE_WEBHOOK_NOTIFICATIONS=false

# Rollback Settings
AUTO_ROLLBACK_ENABLED=true
BACKUP_RETENTION_DAYS=30
MAX_BACKUP_COUNT=10
EOF

    log "Rollback system initialized"
}

# ====================================================================
# 2. BACKUP MANAGEMENT
# ====================================================================

create_deployment_backup() {
    local backup_name="$1"
    local backup_timestamp=$(date '+%Y%m%d_%H%M%S')

    if [ -z "$backup_name" ]; then
        backup_name="backup_${backup_timestamp}"
    fi

    log "Creating deployment backup: $backup_name"

    local backup_path="$BACKUP_DIR/$backup_name"
    mkdir -p "$backup_path"

    # Backup application files
    if [ -d ".next" ]; then
        cp -r .next "$backup_path/"
        log "Next.js build backed up"
    fi

    # Backup configuration files
    local config_files=(
        "package.json"
        "package-lock.json"
        "next.config.js"
        "vercel.json"
        "dockerfile"
        "docker-compose.yml"
        ".env.production"
    )

    for file in "${config_files[@]}"; do
        if [ -f "$file" ]; then
            cp "$file" "$backup_path/"
        fi
    done

    # Backup database schema (if using Prisma)
    if [ -f "prisma/schema.prisma" ]; then
        mkdir -p "$backup_path/prisma"
        cp -r prisma/* "$backup_path/prisma/"
        log "Database schema backed up"
    fi

    # Create backup metadata
    cat > "$backup_path/backup-metadata.json" << EOF
{
  "backup_name": "$backup_name",
  "timestamp": "$backup_timestamp",
  "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "git_branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
  "node_version": "$(node --version)",
  "npm_version": "$(npm --version)",
  "deployment_type": "manual_backup",
  "environment": "${NODE_ENV:-development}"
}
EOF

    # Compress backup
    tar -czf "$backup_path.tar.gz" -C "$BACKUP_DIR" "$backup_name"
    rm -rf "$backup_path"

    log "Backup created: $backup_path.tar.gz"
    echo "$backup_path.tar.gz"
}

list_backups() {
    log "Available backups:"

    if [ ! -d "$BACKUP_DIR" ]; then
        warning "No backup directory found"
        return 1
    fi

    find "$BACKUP_DIR" -name "*.tar.gz" -type f -printf "%T@ %Tc %p\n" | sort -n | while read timestamp datetime path; do
        local size=$(du -h "$path" | cut -f1)
        echo "  $(basename "$path") - $datetime ($size)"
    done
}

cleanup_old_backups() {
    local retention_days=${1:-30}

    log "Cleaning up backups older than $retention_days days..."

    if [ -d "$BACKUP_DIR" ]; then
        find "$BACKUP_DIR" -name "*.tar.gz" -type f -mtime +$retention_days -delete
        log "Old backups cleaned up"
    fi
}

# ====================================================================
# 3. HEALTH MONITORING
# ====================================================================

check_site_health() {
    local url="$1"
    local timeout=${2:-10}

    local response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$timeout" "$url" 2>/dev/null || echo "000")
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time "$timeout" "$url" 2>/dev/null || echo "0")

    if [ "$response_code" = "200" ]; then
        echo "OK|$response_time"
    else
        echo "FAIL|$response_code|$response_time"
    fi
}

check_api_endpoints() {
    local base_url="$1"
    local failed_endpoints=()

    for endpoint in "${API_ENDPOINTS[@]}"; do
        local full_url="${base_url}${endpoint}"
        local result=$(check_site_health "$full_url")

        if [[ "$result" == FAIL* ]]; then
            failed_endpoints+=("$endpoint")
            warning "API endpoint failed: $endpoint"
        fi
    done

    if [ ${#failed_endpoints[@]} -gt 0 ]; then
        return 1
    fi

    return 0
}

perform_health_check() {
    local failed_checks=0
    local total_checks=${#HEALTH_URLS[@]}

    log "Performing health check on $total_checks URLs..."

    for url in "${HEALTH_URLS[@]}"; do
        local result=$(check_site_health "$url")

        if [[ "$result" == OK* ]]; then
            local response_time=$(echo "$result" | cut -d'|' -f2)
            info "✓ $url (${response_time}s)"
        else
            local error_code=$(echo "$result" | cut -d'|' -f2)
            error "✗ $url (HTTP $error_code)"
            ((failed_checks++))
        fi
    done

    if [ $failed_checks -gt 0 ]; then
        warning "$failed_checks/$total_checks health checks failed"
        return 1
    fi

    log "All health checks passed"
    return 0
}

monitor_system_resources() {
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | cut -d'%' -f1 2>/dev/null || echo "0")
    local memory_usage=$(ps aux | awk '{sum+=$4} END {print sum}' 2>/dev/null || echo "0")

    log "System resources - CPU: ${cpu_usage}%, Memory: ${memory_usage}%"

    # Check if resources are within acceptable limits
    if (( $(echo "$cpu_usage > 80" | bc -l 2>/dev/null || echo "0") )); then
        warning "High CPU usage detected: ${cpu_usage}%"
        return 1
    fi

    if (( $(echo "$memory_usage > 85" | bc -l 2>/dev/null || echo "0") )); then
        warning "High memory usage detected: ${memory_usage}%"
        return 1
    fi

    return 0
}

# ====================================================================
# 4. AUTOMATIC MONITORING AND ROLLBACK
# ====================================================================

start_monitoring() {
    local monitoring_duration=${1:-3600} # Default 1 hour
    local start_time=$(date +%s)
    local failure_count=0

    log "Starting automated monitoring for $monitoring_duration seconds..."

    while true; do
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))

        if [ $elapsed -ge $monitoring_duration ]; then
            log "Monitoring period completed successfully"
            break
        fi

        # Perform health checks
        if perform_health_check; then
            failure_count=0
            info "Health check passed (${elapsed}s elapsed)"
        else
            ((failure_count++))
            warning "Health check failed (failure $failure_count/$MAX_HEALTH_CHECK_FAILURES)"

            if [ $failure_count -ge $MAX_HEALTH_CHECK_FAILURES ]; then
                error "Maximum health check failures reached. Initiating rollback..."
                return 1
            fi
        fi

        # Monitor system resources
        if ! monitor_system_resources; then
            warning "System resource limits exceeded"
        fi

        sleep $HEALTH_CHECK_INTERVAL
    done

    return 0
}

auto_rollback() {
    local backup_file="$1"

    if [ -z "$backup_file" ]; then
        # Find the latest backup
        backup_file=$(find "$BACKUP_DIR" -name "*.tar.gz" -type f -printf "%T@ %p\n" | sort -n | tail -1 | cut -d' ' -f2)
    fi

    if [ -z "$backup_file" ] || [ ! -f "$backup_file" ]; then
        error "No backup file found for rollback"
        return 1
    fi

    log "Starting automatic rollback using: $(basename "$backup_file")"

    # Create snapshot of current state before rollback
    local snapshot_name="pre_rollback_$(date '+%Y%m%d_%H%M%S')"
    create_deployment_backup "$snapshot_name"

    # Extract backup
    local backup_name=$(basename "$backup_file" .tar.gz)
    local temp_dir="/tmp/rollback_$backup_name"

    mkdir -p "$temp_dir"
    tar -xzf "$backup_file" -C "$temp_dir"

    # Stop services (if using PM2)
    if command -v pm2 &> /dev/null; then
        pm2 stop "$PROJECT_NAME" 2>/dev/null || true
    fi

    # Restore files
    if [ -d "$temp_dir/$backup_name/.next" ]; then
        rm -rf .next
        cp -r "$temp_dir/$backup_name/.next" .
        log "Next.js build restored"
    fi

    # Restore configuration files
    local config_files=(
        "package.json"
        "package-lock.json"
        "next.config.js"
        "vercel.json"
    )

    for file in "${config_files[@]}"; do
        if [ -f "$temp_dir/$backup_name/$file" ]; then
            cp "$temp_dir/$backup_name/$file" .
            log "Restored: $file"
        fi
    done

    # Reinstall dependencies if package.json changed
    if [ -f "$temp_dir/$backup_name/package.json" ]; then
        log "Reinstalling dependencies..."
        npm ci --production
    fi

    # Restart services
    if command -v pm2 &> /dev/null; then
        pm2 start "$PROJECT_NAME" 2>/dev/null || pm2 start ecosystem.config.js
    fi

    # Clean up
    rm -rf "$temp_dir"

    log "Rollback completed successfully"

    # Verify rollback
    sleep 10
    if perform_health_check; then
        log "Rollback verification successful"
        return 0
    else
        error "Rollback verification failed"
        return 1
    fi
}

# ====================================================================
# 5. DEPLOYMENT WITH MONITORING
# ====================================================================

deploy_with_monitoring() {
    local monitoring_duration=${1:-1800} # Default 30 minutes

    log "Starting deployment with automatic monitoring..."

    # Create pre-deployment backup
    local backup_file=$(create_deployment_backup "pre_deploy_$(date '+%Y%m%d_%H%M%S')")

    # Deploy the application (customize based on your deployment method)
    log "Deploying application..."

    # Wait for deployment to be ready
    sleep 30

    # Start monitoring
    if start_monitoring "$monitoring_duration"; then
        log "Deployment successful and stable"
        # Clean up old backups
        cleanup_old_backups
        return 0
    else
        error "Deployment failed monitoring. Rolling back..."
        if auto_rollback "$backup_file"; then
            log "Rollback successful"
        else
            error "Rollback failed - manual intervention required"
        fi
        return 1
    fi
}

# ====================================================================
# 6. NOTIFICATION SYSTEM
# ====================================================================

send_notification() {
    local subject="$1"
    local message="$2"
    local severity="${3:-info}" # info, warning, error

    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    # Log notification
    log "NOTIFICATION [$severity]: $subject - $message"

    # Email notification (if configured)
    if [ "$ENABLE_EMAIL_NOTIFICATIONS" = "true" ] && [ -n "$NOTIFICATION_EMAIL" ]; then
        echo "Subject: [$PROJECT_NAME] $subject
Date: $timestamp
Severity: $severity

$message

---
JC Hair Studio's 62 Rollback System
" | sendmail "$NOTIFICATION_EMAIL" 2>/dev/null || warning "Failed to send email notification"
    fi

    # Slack notification (if configured)
    if [ "$ENABLE_SLACK_NOTIFICATIONS" = "true" ] && [ -n "$SLACK_WEBHOOK_URL" ]; then
        local color="good"
        case "$severity" in
            warning) color="warning" ;;
            error) color="danger" ;;
        esac

        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"[$PROJECT_NAME] $subject\",\"attachments\":[{\"color\":\"$color\",\"text\":\"$message\"}]}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || warning "Failed to send Slack notification"
    fi
}

# ====================================================================
# 7. COMMAND LINE INTERFACE
# ====================================================================

usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  init                    Initialize rollback system"
    echo "  backup [NAME]           Create deployment backup"
    echo "  list-backups           List available backups"
    echo "  rollback [BACKUP]      Perform rollback to specific backup"
    echo "  auto-rollback          Perform automatic rollback to latest backup"
    echo "  health-check           Perform health check"
    echo "  monitor [DURATION]     Start monitoring (default: 1 hour)"
    echo "  deploy-monitor [DURATION] Deploy with monitoring (default: 30 min)"
    echo "  cleanup [DAYS]         Clean up old backups (default: 30 days)"
    echo "  help                   Show this help message"
    echo ""
    echo "Environment variables:"
    echo "  NOTIFICATION_EMAIL     Email for notifications"
    echo "  SLACK_WEBHOOK_URL      Slack webhook URL"
    echo "  ENABLE_EMAIL_NOTIFICATIONS   Enable email notifications (true/false)"
    echo "  ENABLE_SLACK_NOTIFICATIONS   Enable Slack notifications (true/false)"
    echo ""
    echo "Examples:"
    echo "  $0 init                        # Initialize system"
    echo "  $0 backup production_v1.2      # Create named backup"
    echo "  $0 deploy-monitor 1800         # Deploy with 30min monitoring"
    echo "  $0 rollback backup_20231201_120000.tar.gz  # Rollback to specific backup"
}

# Load configuration if it exists
if [ -f "rollback.config" ]; then
    source rollback.config
fi

# Main execution
case "$1" in
    init)
        init_rollback_system
        ;;
    backup)
        create_deployment_backup "$2"
        ;;
    list-backups)
        list_backups
        ;;
    rollback)
        auto_rollback "$2"
        ;;
    auto-rollback)
        auto_rollback
        ;;
    health-check)
        if perform_health_check; then
            log "All health checks passed"
            exit 0
        else
            error "Health checks failed"
            exit 1
        fi
        ;;
    monitor)
        start_monitoring "${2:-3600}"
        ;;
    deploy-monitor)
        deploy_with_monitoring "${2:-1800}"
        ;;
    cleanup)
        cleanup_old_backups "${2:-30}"
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