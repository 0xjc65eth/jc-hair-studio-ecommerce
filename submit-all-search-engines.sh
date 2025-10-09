#!/bin/bash

# JC Hair Studio - Complete Search Engine Submission Script
# This script attempts to submit the sitemap to all available search engines

SITEMAP_URL="https://jchairstudios62.xyz/sitemap.xml"
SITE_URL="https://jchairstudios62.xyz"

echo "🚀 Starting Complete Search Engine Submission..."
echo "================================================"

# 1. Google PubSubHubbub (Alternative to deprecated ping)
echo "📍 Submitting to Google PubSubHubbub..."
curl -X POST "https://pubsubhubbub.appspot.com/" \
  -d "hub.mode=publish" \
  -d "hub.url=${SITEMAP_URL}" \
  2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Google PubSubHubbub: Submitted"
else
    echo "❌ Google PubSubHubbub: Failed"
fi

# 2. Bing/Microsoft (via deprecated ping - will fail but try anyway)
echo "📍 Attempting Bing ping (deprecated)..."
curl -I "https://www.bing.com/ping?sitemap=${SITEMAP_URL}" 2>/dev/null | head -1

# 3. IndexNow API (Bing, Yandex, Seznam.cz, Naver)
echo "📍 Submitting via IndexNow API..."
INDEX_NOW_KEY="d4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8"

# Create the JSON payload with URLs
cat > /tmp/indexnow-payload.json << EOF
{
  "host": "jchairstudios62.xyz",
  "key": "${INDEX_NOW_KEY}",
  "keyLocation": "https://jchairstudios62.xyz/${INDEX_NOW_KEY}.txt",
  "urlList": [
    "https://jchairstudios62.xyz/",
    "https://jchairstudios62.xyz/mega-hair",
    "https://jchairstudios62.xyz/progressiva-brasileira",
    "https://jchairstudios62.xyz/maquiagens",
    "https://jchairstudios62.xyz/cosmeticos",
    "https://jchairstudios62.xyz/faq",
    "https://jchairstudios62.xyz/contato",
    "https://jchairstudios62.xyz/pt/botox-capilar",
    "https://jchairstudios62.xyz/pt/queratina-brasileira",
    "https://jchairstudios62.xyz/pt/progressiva-brasileira"
  ]
}
EOF

# Submit to Bing IndexNow
echo "  → Bing IndexNow..."
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d @/tmp/indexnow-payload.json \
  2>/dev/null

# Submit to Yandex IndexNow
echo "  → Yandex IndexNow..."
curl -X POST "https://yandex.com/indexnow" \
  -H "Content-Type: application/json" \
  -d @/tmp/indexnow-payload.json \
  2>/dev/null

# 4. Yandex Direct Ping
echo "📍 Submitting to Yandex (direct)..."
curl -I "https://webmaster.yandex.com/ping?sitemap=${SITEMAP_URL}" 2>/dev/null | head -1

# 5. Baidu (China)
echo "📍 Attempting Baidu submission..."
curl -I "http://www.baidu.com/search/url_submit.html?sitemap=${SITEMAP_URL}" 2>/dev/null | head -1

# 6. Seznam (Czech Republic)
echo "📍 Submitting to Seznam.cz..."
curl -I "https://search.seznam.cz/ping?sitemap=${SITEMAP_URL}" 2>/dev/null | head -1

# 7. Naver (South Korea)
echo "📍 Submitting to Naver..."
curl -X POST "https://searchadvisor.naver.com/indexnow" \
  -H "Content-Type: application/json" \
  -d @/tmp/indexnow-payload.json \
  2>/dev/null

# 8. Create a simple sitemap submission report
echo ""
echo "================================================"
echo "📊 SUBMISSION REPORT"
echo "================================================"
echo "Sitemap URL: ${SITEMAP_URL}"
echo "IndexNow Key: ${INDEX_NOW_KEY}"
echo ""
echo "✅ Attempted submissions to:"
echo "  • Google PubSubHubbub"
echo "  • Bing (deprecated ping + IndexNow)"
echo "  • Yandex (ping + IndexNow)"
echo "  • Baidu"
echo "  • Seznam.cz"
echo "  • Naver (IndexNow)"
echo ""
echo "📋 MANUAL ACTIONS STILL REQUIRED:"
echo "================================="
echo "1. Google Search Console:"
echo "   → https://search.google.com/search-console"
echo "   → Add property: jchairstudios62.xyz"
echo "   → Submit sitemap manually"
echo ""
echo "2. Bing Webmaster Tools:"
echo "   → https://www.bing.com/webmasters"
echo "   → Import from Google Search Console (easiest!)"
echo ""
echo "3. Verification files created:"
echo "   → /public/google-site-verification.html"
echo "   → /public/BingSiteAuth.xml"
echo "   → /public/${INDEX_NOW_KEY}.txt"
echo ""
echo "✨ Script completed! Check above for any errors."

# Clean up
rm -f /tmp/indexnow-payload.json