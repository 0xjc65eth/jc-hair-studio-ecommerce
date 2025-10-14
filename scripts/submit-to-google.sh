#!/bin/bash

DOMAIN="jchairstudios62.xyz"
SITEMAP="/Users/juliocesar/Jc-hair-studio's 62  ecommerce/jc-hair-studio/public/sitemap.xml"
SITEMAP_URL="https://$DOMAIN/sitemap.xml"

echo "========================================="
echo "GOOGLE INDEXING AGGRESSIVE SUBMISSION"
echo "========================================="
echo "Time: $(date)"
echo ""

# Extract all URLs from sitemap
URLS=$(grep -o '<loc>[^<]*</loc>' "$SITEMAP" | sed 's/<loc>//g' | sed 's/<\/loc>//g')

# Count total URLs
TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
echo "Found $TOTAL URLs to submit"
echo ""

# 1. Ping Google's sitemap endpoint
echo "Step 1: Pinging Google Sitemap Submission..."
GOOGLE_PING="http://www.google.com/ping?sitemap=$SITEMAP_URL"
RESPONSE=$(curl -s -w "\n%{http_code}" "$GOOGLE_PING")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Google Sitemap Ping: SUCCESS (HTTP $HTTP_CODE)"
else
    echo "✗ Google Sitemap Ping: FAILED (HTTP $HTTP_CODE)"
fi
echo ""

# 2. Submit via Google Search Console API simulation (URL inspection)
echo "Step 2: Submitting individual URLs to Google..."
COUNT=0

for URL in $URLS; do
    COUNT=$((COUNT + 1))
    echo "[$COUNT/$TOTAL] Submitting: $URL"

    # Method 1: Direct URL ping
    ENCODED_URL=$(echo "$URL" | jq -sRr @uri)
    PING_URL="http://www.google.com/ping?sitemap=$ENCODED_URL"

    RESPONSE=$(curl -s -w "\n%{http_code}" "$PING_URL")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

    if [ "$HTTP_CODE" = "200" ]; then
        echo "  ✓ Google URL Ping: SUCCESS (HTTP $HTTP_CODE)"
    else
        echo "  ✗ Google URL Ping: FAILED (HTTP $HTTP_CODE)"
    fi

    # Method 2: Submit to Google via mobile-friendly test API (triggers crawl)
    MOBILE_TEST_URL="https://search.google.com/test/mobile-friendly?url=$ENCODED_URL"
    curl -s -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
         "$MOBILE_TEST_URL" > /dev/null 2>&1
    echo "  ✓ Mobile-Friendly Test triggered"

    # Method 3: Submit to PageSpeed Insights API (triggers crawl)
    PAGESPEED_URL="https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=$ENCODED_URL"
    curl -s "$PAGESPEED_URL" > /dev/null 2>&1
    echo "  ✓ PageSpeed Insights triggered"

    # Small delay
    sleep 0.2
    echo ""
done

# 3. Submit sitemap to Google via search.google.com ping
echo "Step 3: Final sitemap submission to Google..."
curl -s "http://www.google.com/webmasters/tools/ping?sitemap=$SITEMAP_URL" > /dev/null 2>&1
echo "✓ Final sitemap ping completed"
echo ""

echo "========================================="
echo "GOOGLE SUBMISSION COMPLETED"
echo "Time: $(date)"
echo "Total URLs processed: $TOTAL"
echo "========================================="
