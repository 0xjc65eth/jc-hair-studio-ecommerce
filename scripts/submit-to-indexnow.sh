#!/bin/bash

# IndexNow API Key (you can generate one or use your domain as key)
API_KEY="jchairstudios62xyz"
DOMAIN="jchairstudios62.xyz"
SITEMAP="/Users/juliocesar/Jc-hair-studio's 62  ecommerce/jc-hair-studio/public/sitemap.xml"

echo "========================================="
echo "INDEXNOW AGGRESSIVE SUBMISSION STARTING"
echo "========================================="
echo "Time: $(date)"
echo ""

# Extract all URLs from sitemap
URLS=$(grep -o '<loc>[^<]*</loc>' "$SITEMAP" | sed 's/<loc>//g' | sed 's/<\/loc>//g')

# Count total URLs
TOTAL=$(echo "$URLS" | wc -l | tr -d ' ')
echo "Found $TOTAL URLs to submit"
echo ""

# Counter
COUNT=0

# IndexNow endpoints (multiple search engines)
ENDPOINTS=(
    "https://api.indexnow.org/indexnow"
    "https://www.bing.com/indexnow"
    "https://yandex.com/indexnow"
    "https://api.seznam.cz/indexnow"
)

# Submit each URL to each endpoint
for URL in $URLS; do
    COUNT=$((COUNT + 1))
    echo "[$COUNT/$TOTAL] Submitting: $URL"

    # Submit to each IndexNow endpoint
    for ENDPOINT in "${ENDPOINTS[@]}"; do
        RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
            -H "Content-Type: application/json; charset=utf-8" \
            -d "{
                \"host\": \"$DOMAIN\",
                \"key\": \"$API_KEY\",
                \"keyLocation\": \"https://$DOMAIN/$API_KEY.txt\",
                \"urlList\": [\"$URL\"]
            }")

        HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

        if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "202" ]; then
            echo "  ✓ Success: $(echo $ENDPOINT | sed 's/https:\/\///' | sed 's/\/.*//') (HTTP $HTTP_CODE)"
        else
            echo "  ✗ Failed: $(echo $ENDPOINT | sed 's/https:\/\///' | sed 's/\/.*//') (HTTP $HTTP_CODE)"
        fi
    done

    # Small delay to avoid rate limiting (100ms)
    sleep 0.1
    echo ""
done

echo "========================================="
echo "INDEXNOW SUBMISSION COMPLETED"
echo "Time: $(date)"
echo "Total URLs processed: $TOTAL"
echo "========================================="
