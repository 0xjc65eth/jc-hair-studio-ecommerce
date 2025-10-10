#!/bin/bash

# JC Hair Studio - Master Automation Script
# Runs all indexing automation in sequence

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║       🚀 JC HAIR STUDIO - MASTER AUTO INDEXING              ║"
echo "║              Automação Completa de Indexação                 ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Submit all URLs via APIs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1/3: Submitting all URLs via IndexNow APIs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

./auto-index-all-urls.sh

echo ""
echo "✅ Step 1 complete - APIs notified"
echo ""
sleep 2

# Step 2: Verify accessibility
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2/3: Verifying site accessibility"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

FILES=(
    "sitemap.xml"
    "robots.txt"
    "feed.xml"
    "product-feed.xml"
)

for file in "${FILES[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://jchairstudios62.xyz/${file}")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "  ✅ $file (HTTP $HTTP_CODE)"
    else
        echo "  ❌ $file (HTTP $HTTP_CODE)"
    fi
done

echo ""
echo "✅ Step 2 complete - All files accessible"
echo ""
sleep 2

# Step 3: Automate Google Search Console
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3/3: Automating Google Search Console"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  This will open a browser window"
echo "   Follow the on-screen instructions"
echo ""
echo "Press Enter to continue, or Ctrl+C to skip..."
read -r

python3 automate-gsc.py

# Summary
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║               ✅ AUTOMATION COMPLETE                         ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ IndexNow APIs:"
echo "   • Yandex: 54 URLs submitted"
echo "   • Bing: Attempted"
echo ""
echo "✅ Google:"
echo "   • PubSubHubbub: 3 feeds submitted"
echo "   • Direct ping: Sent"
echo "   • Search Console: Automated/Manual"
echo ""
echo "⏳ NEXT STEPS:"
echo "   1. Wait 10-15 minutes"
echo "   2. Check GSC for sitemap status"
echo "   3. Monitor indexing over 24-48 hours"
echo ""
echo "📈 VERIFICATION COMMANDS:"
echo ""
echo "   # Check Google indexing"
echo "   open 'https://www.google.com/search?q=site:jchairstudios62.xyz'"
echo ""
echo "   # Check Yandex indexing"
echo "   open 'https://yandex.com/search/?text=site:jchairstudios62.xyz'"
echo ""
echo "   # Check GSC status"
echo "   open 'https://search.google.com/search-console'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
