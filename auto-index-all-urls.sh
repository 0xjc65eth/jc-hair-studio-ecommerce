#!/bin/bash

# JC Hair Studio - Automatic URL Indexing (All URLs)
# Submits every URL individually via IndexNow to multiple search engines

SITE_URL="https://jchairstudios62.xyz"
INDEXNOW_KEY="d4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8"
URLS_FILE="/tmp/all-urls.txt"

echo "🚀 JC HAIR STUDIO - AUTOMATIC INDEXING (54 URLs)"
echo "=================================================="
echo ""

# Extract all URLs from sitemap
echo "📥 Extracting URLs from sitemap..."
curl -s "${SITE_URL}/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<loc>//g' | sed 's/<\/loc>//g' > "$URLS_FILE"
TOTAL_URLS=$(wc -l < "$URLS_FILE" | tr -d ' ')
echo "✅ $TOTAL_URLS URLs extracted"
echo ""

# Function to submit via IndexNow
submit_indexnow() {
    local engine_name=$1
    local endpoint=$2
    local url_to_submit=$3

    JSON_PAYLOAD=$(cat <<EOF
{
  "host": "jchairstudios62.xyz",
  "key": "$INDEXNOW_KEY",
  "keyLocation": "https://jchairstudios62.xyz/d4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8.txt",
  "urlList": ["$url_to_submit"]
}
EOF
)

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json; charset=utf-8" \
        -d "$JSON_PAYLOAD" \
        "$endpoint")

    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "202" ]; then
        return 0
    else
        return 1
    fi
}

# Submit to Bing IndexNow
echo "📤 Submitting to Bing IndexNow (individual URLs)..."
bing_success=0
bing_failed=0

while IFS= read -r url; do
    if submit_indexnow "Bing" "https://www.bing.com/indexnow" "$url"; then
        ((bing_success++))
    else
        ((bing_failed++))
    fi
    sleep 0.5  # Rate limiting
done < "$URLS_FILE"

echo "  ✅ Bing: $bing_success succeeded, $bing_failed failed"
echo ""

# Submit to Yandex IndexNow
echo "📤 Submitting to Yandex IndexNow (individual URLs)..."
yandex_success=0
yandex_failed=0

while IFS= read -r url; do
    if submit_indexnow "Yandex" "https://yandex.com/indexnow" "$url"; then
        ((yandex_success++))
    else
        ((yandex_failed++))
    fi
    sleep 0.5  # Rate limiting
done < "$URLS_FILE"

echo "  ✅ Yandex: $yandex_success succeeded, $yandex_failed failed"
echo ""

# Submit batch to Google PubSubHubbub
echo "📤 Submitting to Google PubSubHubbub..."
google_success=0

for feed in "sitemap.xml" "feed.xml" "product-feed.xml"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -d "hub.mode=publish&hub.url=${SITE_URL}/${feed}" \
        https://pubsubhubbub.appspot.com/publish)

    if [ "$HTTP_CODE" = "204" ]; then
        echo "  ✅ $feed: Success"
        ((google_success++))
    else
        echo "  ❌ $feed: Failed (HTTP $HTTP_CODE)"
    fi
done
echo ""

# Ping Google directly
echo "📤 Pinging Google directly..."
google_ping=$(curl -s "https://www.google.com/ping?sitemap=${SITE_URL}/sitemap.xml")
echo "  ✅ Google pinged"
echo ""

# Summary
echo "=================================================="
echo "✅ INDEXING SUMMARY"
echo "=================================================="
echo ""
echo "Total URLs processed: $TOTAL_URLS"
echo ""
echo "Bing IndexNow:"
echo "  ✅ Success: $bing_success"
echo "  ❌ Failed: $bing_failed"
echo ""
echo "Yandex IndexNow:"
echo "  ✅ Success: $yandex_success"
echo "  ❌ Failed: $yandex_failed"
echo ""
echo "Google PubSubHubbub:"
echo "  ✅ Feeds submitted: $google_success"
echo ""
echo "=================================================="
echo ""
echo "⏳ Note: Indexing takes 24-48 hours typically"
echo "   For Google, manual GSC verification is still recommended"
echo ""
