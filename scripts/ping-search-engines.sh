#!/bin/bash

###############################################################################
# Search Engine Ping Script - JC Hair Studio
# Submit sitemap and pages to all major search engines
###############################################################################

set -e

echo "=================================="
echo "SEARCH ENGINE SUBMISSION"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Domain and Sitemap
DOMAIN="jchairstudios62.xyz"
SITEMAP_URL="https://${DOMAIN}/sitemap.xml"
PRODUCT_FEED="https://${DOMAIN}/product-feed.xml"

# Key URLs to submit
URLS=(
  "https://${DOMAIN}/"
  "https://${DOMAIN}/pt"
  "https://${DOMAIN}/en"
  "https://${DOMAIN}/es"
  "https://${DOMAIN}/fr"
  "https://${DOMAIN}/categoria/tratamentos-capilares"
  "https://${DOMAIN}/categoria/progressivas-alisamentos"
  "https://${DOMAIN}/pt/produtos"
  "https://${DOMAIN}/sobre"
  "https://${DOMAIN}/contacto"
)

echo -e "${BLUE}1. Google Search Console Ping...${NC}"
echo "Submitting sitemap to Google..."

# Google Ping
curl -s "https://www.google.com/ping?sitemap=${SITEMAP_URL}" > /dev/null 2>&1 && \
  echo -e "  ${GREEN}✓${NC} Google sitemap submitted" || \
  echo -e "  ${YELLOW}⚠${NC} Google submission may have failed"

echo ""

echo -e "${BLUE}2. Bing Webmaster Tools Ping...${NC}"
echo "Submitting sitemap to Bing..."

# Bing Ping
curl -s "https://www.bing.com/ping?sitemap=${SITEMAP_URL}" > /dev/null 2>&1 && \
  echo -e "  ${GREEN}✓${NC} Bing sitemap submitted" || \
  echo -e "  ${YELLOW}⚠${NC} Bing submission may have failed"

echo ""

echo -e "${BLUE}3. IndexNow Protocol (Bing, Yandex, etc.)...${NC}"
echo "Submitting URLs via IndexNow..."

# Read IndexNow API key if exists
INDEXNOW_KEY=""
if [ -f ".env.local" ]; then
  INDEXNOW_KEY=$(grep INDEXNOW_KEY .env.local 2>/dev/null | cut -d '=' -f2 | tr -d '"' | tr -d ' ') || true
fi

if [ -z "$INDEXNOW_KEY" ]; then
  echo -e "  ${YELLOW}⚠${NC} No IndexNow key found in .env.local"
  echo "  To enable IndexNow:"
  echo "    1. Generate key: https://www.bing.com/indexnow"
  echo "    2. Add to .env.local: INDEXNOW_KEY=your-key-here"
else
  # Submit URLs via IndexNow
  for url in "${URLS[@]}"; do
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
      "https://api.indexnow.org/indexnow?url=${url}&key=${INDEXNOW_KEY}")

    if [ "$RESPONSE" == "200" ] || [ "$RESPONSE" == "202" ]; then
      echo -e "  ${GREEN}✓${NC} ${url}"
    else
      echo -e "  ${YELLOW}⚠${NC} ${url} (HTTP ${RESPONSE})"
    fi
  done
fi

echo ""

echo -e "${BLUE}4. Manual Submission Instructions...${NC}"
echo ""
echo "GOOGLE SEARCH CONSOLE:"
echo "  1. Visit: https://search.google.com/search-console"
echo "  2. Add property: ${DOMAIN}"
echo "  3. Submit sitemap: ${SITEMAP_URL}"
echo "  4. Request URL indexing for key pages"
echo ""
echo "BING WEBMASTER TOOLS:"
echo "  1. Visit: https://www.bing.com/webmasters"
echo "  2. Add site: ${DOMAIN}"
echo "  3. Submit sitemap: ${SITEMAP_URL}"
echo "  4. Use URL Submission tool"
echo ""
echo "YANDEX WEBMASTER:"
echo "  1. Visit: https://webmaster.yandex.com"
echo "  2. Add site: ${DOMAIN}"
echo "  3. Submit sitemap: ${SITEMAP_URL}"
echo ""

echo -e "${BLUE}5. Social Media & Web Directories...${NC}"
echo "Consider submitting to:"
echo "  - Facebook: https://developers.facebook.com/tools/debug/"
echo "  - LinkedIn: https://www.linkedin.com/post-inspector/"
echo "  - Pinterest: https://pinterest.com/website/verify/"
echo "  - Google Business Profile"
echo ""

echo -e "${GREEN}=================================="
echo "SEARCH ENGINE SUBMISSION COMPLETE"
echo "==================================${NC}"
echo ""
echo "Sitemap URL: ${SITEMAP_URL}"
echo "Product Feed: ${PRODUCT_FEED}"
echo ""
echo "Next Steps:"
echo "  1. Verify submissions in respective webmaster tools"
echo "  2. Monitor indexing with: bash scripts/monitor-indexing.sh"
echo "  3. Check site performance in 24-48 hours"
echo ""
