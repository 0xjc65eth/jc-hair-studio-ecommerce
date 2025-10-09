#!/bin/bash

# JC Hair Studio - SEO Status Checker
# Quick script to check indexing status across all search engines

SITE_URL="https://jchairstudios62.xyz"
DOMAIN="jchairstudios62.xyz"

echo "🔍 JC HAIR STUDIO - SEO STATUS CHECK"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Check files accessibility
echo "📁 CHECKING FILE ACCESSIBILITY..."
echo "--------------------------------"

FILES=(
    "sitemap.xml"
    "robots.txt"
    "feed.xml"
    "product-feed.xml"
    "d4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8.txt"
    "google-site-verification.html"
    "BingSiteAuth.xml"
)

for file in "${FILES[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${SITE_URL}/${file}")
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅${NC} $file (HTTP $HTTP_CODE)"
    else
        echo -e "${RED}❌${NC} $file (HTTP $HTTP_CODE)"
    fi
done

# 2. Count URLs in sitemap
echo ""
echo "📊 SITEMAP STATISTICS..."
echo "------------------------"

URL_COUNT=$(curl -s "${SITE_URL}/sitemap.xml" 2>/dev/null | grep -o "<loc>" | wc -l | tr -d ' ')
echo "Total URLs in sitemap: $URL_COUNT"

# 3. Check indexing status (requires internet)
echo ""
echo "🌐 INDEXING STATUS (Estimated)..."
echo "----------------------------------"
echo "To check exact numbers, visit:"
echo ""
echo "  Google:"
echo "  → https://www.google.com/search?q=site:${DOMAIN}"
echo ""
echo "  Bing:"
echo "  → https://www.bing.com/search?q=site:${DOMAIN}"
echo ""
echo "  Yandex:"
echo "  → https://yandex.com/search/?text=site:${DOMAIN}"
echo ""

# 4. Check last submission
echo "📋 LAST AUTOMATED SUBMISSION..."
echo "--------------------------------"

if [ -f "seo-indexing-report.txt" ]; then
    LAST_RUN=$(grep "Generated:" seo-indexing-report.txt | cut -d' ' -f2)
    SUCCESS=$(grep "Successful:" seo-indexing-report.txt | grep -o "[0-9]*")
    FAILED=$(grep "Failed:" seo-indexing-report.txt | grep -o "[0-9]*")

    echo "Last run: $LAST_RUN"
    echo -e "Successful: ${GREEN}$SUCCESS${NC}"
    echo -e "Failed: ${RED}$FAILED${NC}"
else
    echo -e "${YELLOW}⚠️${NC} No report found. Run: npm run seo:index"
fi

# 5. Check automation logs
echo ""
echo "📝 RECENT AUTOMATION LOGS..."
echo "----------------------------"

if ls logs/auto-submit-*.log 1> /dev/null 2>&1; then
    LATEST_LOG=$(ls -t logs/auto-submit-*.log | head -1)
    echo "Latest log: $LATEST_LOG"
    echo ""
    echo "Last 5 lines:"
    tail -5 "$LATEST_LOG"
else
    echo -e "${YELLOW}⚠️${NC} No logs found"
fi

# 6. Configuration checks
echo ""
echo "⚙️ CONFIGURATION STATUS..."
echo "--------------------------"

# Check if cron is configured
if crontab -l 2>/dev/null | grep -q "auto-submit-sitemap"; then
    echo -e "${GREEN}✅${NC} Cron job configured"
else
    echo -e "${YELLOW}⚠️${NC} Cron job not configured"
    echo "   Setup: crontab -e"
    echo "   Add: 0 3 * * 1 cd '$(pwd)' && ./auto-submit-sitemap.sh"
fi

# Check npm scripts
if grep -q "seo:index" package.json; then
    echo -e "${GREEN}✅${NC} NPM scripts configured"
else
    echo -e "${RED}❌${NC} NPM scripts not found in package.json"
fi

# 7. Verification files
echo ""
echo "🔐 VERIFICATION FILES..."
echo "------------------------"

if [ -f "public/google-site-verification.html" ]; then
    echo -e "${GREEN}✅${NC} Google verification file exists"
else
    echo -e "${RED}❌${NC} Google verification file missing"
fi

if [ -f "public/BingSiteAuth.xml" ]; then
    echo -e "${GREEN}✅${NC} Bing verification file exists"
else
    echo -e "${RED}❌${NC} Bing verification file missing"
fi

if [ -f "public/d4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8.txt" ]; then
    echo -e "${GREEN}✅${NC} IndexNow key file exists"
else
    echo -e "${RED}❌${NC} IndexNow key file missing"
fi

# 8. Manual actions reminder
echo ""
echo "⚠️ MANUAL ACTIONS REQUIRED..."
echo "------------------------------"
echo ""
echo "1. Google Search Console:"
echo "   Status: ${YELLOW}Pending${NC}"
echo "   Action: https://search.google.com/search-console"
echo "   Time: 15 minutes"
echo ""
echo "2. Bing Webmaster Tools:"
echo "   Status: ${YELLOW}Pending${NC}"
echo "   Action: https://www.bing.com/webmasters"
echo "   Time: 5 minutes (import from Google)"
echo ""

# 9. Quick actions
echo ""
echo "🚀 QUICK ACTIONS..."
echo "-------------------"
echo ""
echo "Re-run indexation:"
echo "  npm run seo:index"
echo ""
echo "Submit to all engines:"
echo "  ./submit-all-search-engines.sh"
echo ""
echo "Auto submission:"
echo "  ./auto-submit-sitemap.sh"
echo ""
echo "Run all SEO tasks:"
echo "  npm run seo:all"
echo ""

echo "===================================="
echo "✨ SEO Status Check Complete!"
echo "===================================="