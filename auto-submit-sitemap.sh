#!/bin/bash

# JC Hair Studio - Automated Sitemap Submission
# Run this script daily/weekly via cron to keep search engines updated
# Example cron: 0 3 * * 1 /path/to/auto-submit-sitemap.sh

# Configuration
SITE_URL="https://jchairstudios62.xyz"
SITEMAP_URL="${SITE_URL}/sitemap.xml"
FEED_URL="${SITE_URL}/feed.xml"
PRODUCT_FEED_URL="${SITE_URL}/product-feed.xml"
INDEXNOW_KEY="d4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8"
LOG_FILE="logs/auto-submit-$(date +%Y%m%d).log"

# Create log directory if it doesn't exist
mkdir -p logs

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_message "=========================================="
log_message "Starting Automated Sitemap Submission"
log_message "=========================================="

# 1. Google PubSubHubbub (for sitemap and feeds)
log_message "Submitting to Google PubSubHubbub..."

for URL in "$SITEMAP_URL" "$FEED_URL" "$PRODUCT_FEED_URL"; do
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "https://pubsubhubbub.appspot.com/" \
        -d "hub.mode=publish" \
        -d "hub.url=${URL}" 2>/dev/null)
    HTTP_CODE=$(echo "$RESPONSE" | tail -1)

    if [ "$HTTP_CODE" = "204" ]; then
        log_message "  ✅ ${URL##*/}: Success (HTTP $HTTP_CODE)"
    else
        log_message "  ⚠️ ${URL##*/}: HTTP $HTTP_CODE"
    fi
done

# 2. Yandex (Direct submission + IndexNow)
log_message "Submitting to Yandex..."

# Direct ping
YANDEX_RESPONSE=$(curl -s -I "https://webmaster.yandex.com/ping?sitemap=${SITEMAP_URL}" 2>/dev/null | head -1)
log_message "  Yandex Ping: ${YANDEX_RESPONSE}"

# IndexNow to Yandex
YANDEX_INDEXNOW=$(curl -s -X POST "https://yandex.com/indexnow" \
    -H "Content-Type: application/json" \
    -d '{
        "host": "jchairstudios62.xyz",
        "key": "'${INDEXNOW_KEY}'",
        "keyLocation": "'${SITE_URL}'/'${INDEXNOW_KEY}'.txt",
        "urlList": [
            "'${SITE_URL}'/",
            "'${SITE_URL}'/mega-hair",
            "'${SITE_URL}'/progressiva-brasileira",
            "'${SITE_URL}'/maquiagens",
            "'${SITE_URL}'/cosmeticos"
        ]
    }' 2>/dev/null)

if echo "$YANDEX_INDEXNOW" | grep -q "success.*true"; then
    log_message "  ✅ Yandex IndexNow: Success"
else
    log_message "  ⚠️ Yandex IndexNow: ${YANDEX_INDEXNOW}"
fi

# 3. Check sitemap accessibility
log_message "Verifying sitemap accessibility..."
SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITEMAP_URL")
if [ "$SITEMAP_STATUS" = "200" ]; then
    log_message "  ✅ Sitemap is accessible (HTTP 200)"
else
    log_message "  ❌ Sitemap error: HTTP $SITEMAP_STATUS"
fi

# 4. Count URLs in sitemap
URL_COUNT=$(curl -s "$SITEMAP_URL" | grep -o "<loc>" | wc -l | tr -d ' ')
log_message "  📊 Total URLs in sitemap: $URL_COUNT"

# 5. Summary
log_message ""
log_message "=========================================="
log_message "SUBMISSION SUMMARY"
log_message "=========================================="
log_message "✅ Google PubSubHubbub: Submitted"
log_message "✅ Yandex: Submitted"
log_message "📊 URLs in sitemap: $URL_COUNT"
log_message "📁 Log saved to: $LOG_FILE"
log_message ""
log_message "ℹ️ Note: Google Search Console and Bing Webmaster"
log_message "   require manual setup. This script maintains"
log_message "   automatic submissions to available APIs."
log_message "=========================================="

# Send notification (optional - uncomment if you have mail configured)
# echo "Sitemap submission completed. Check $LOG_FILE for details." | mail -s "Sitemap Submission Report" your-email@example.com

exit 0