#!/bin/bash

###############################################################################
# Indexing Monitor - JC Hair Studio
# Check indexing status and search visibility
###############################################################################

set -e

echo "=================================="
echo "INDEXING MONITOR"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Domain
DOMAIN="jchairstudios62.xyz"

echo -e "${BLUE}1. Google Indexing Check...${NC}"
echo "Checking how many pages are indexed..."

# Google site: search
GOOGLE_INDEXED=$(curl -s "https://www.google.com/search?q=site:${DOMAIN}" | grep -o "About [0-9,]* results" | grep -o "[0-9,]*" | tr -d ',' || echo "0")

if [ -z "$GOOGLE_INDEXED" ] || [ "$GOOGLE_INDEXED" == "0" ]; then
  echo -e "  ${RED}✗${NC} No pages indexed yet (or unable to check)"
else
  echo -e "  ${GREEN}✓${NC} ~${GOOGLE_INDEXED} pages indexed on Google"
fi

echo ""

echo -e "${BLUE}2. Bing Indexing Check...${NC}"
BING_INDEXED=$(curl -s "https://www.bing.com/search?q=site:${DOMAIN}" | grep -o "[0-9,]* results" | grep -o "[0-9,]*" | head -1 | tr -d ',' || echo "0")

if [ -z "$BING_INDEXED" ] || [ "$BING_INDEXED" == "0" ]; then
  echo -e "  ${RED}✗${NC} No pages indexed yet (or unable to check)"
else
  echo -e "  ${GREEN}✓${NC} ~${BING_INDEXED} pages indexed on Bing"
fi

echo ""

echo -e "${BLUE}3. Key Pages Availability Test...${NC}"

PAGES=(
  "https://${DOMAIN}/"
  "https://${DOMAIN}/pt"
  "https://${DOMAIN}/categoria/tratamentos-capilares"
  "https://${DOMAIN}/categoria/progressivas-alisamentos"
  "https://${DOMAIN}/sobre"
  "https://${DOMAIN}/contacto"
)

for page in "${PAGES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$page")
  if [ "$STATUS" == "200" ]; then
    echo -e "  ${GREEN}✓${NC} $page"
  else
    echo -e "  ${RED}✗${NC} $page (HTTP $STATUS)"
  fi
done

echo ""

echo -e "${BLUE}4. Sitemap Status...${NC}"

SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}/sitemap.xml")
if [ "$SITEMAP_STATUS" == "200" ]; then
  echo -e "  ${GREEN}✓${NC} Sitemap accessible"

  # Count URLs in sitemap
  SITEMAP_URLS=$(curl -s "https://${DOMAIN}/sitemap.xml" | grep -c "<loc>" || echo "0")
  echo -e "  ${BLUE}ℹ${NC} ~${SITEMAP_URLS} URLs in sitemap"
else
  echo -e "  ${RED}✗${NC} Sitemap not accessible (HTTP $SITEMAP_STATUS)"
fi

echo ""

echo -e "${BLUE}5. Robots.txt Check...${NC}"

ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}/robots.txt")
if [ "$ROBOTS_STATUS" == "200" ]; then
  echo -e "  ${GREEN}✓${NC} Robots.txt accessible"

  # Check for blocks
  DISALLOWS=$(curl -s "https://${DOMAIN}/robots.txt" | grep -c "Disallow:" || echo "0")
  echo -e "  ${BLUE}ℹ${NC} ${DISALLOWS} Disallow directives"
else
  echo -e "  ${RED}✗${NC} Robots.txt not accessible"
fi

echo ""

echo -e "${BLUE}6. SSL Certificate Check...${NC}"

SSL_EXPIRY=$(echo | openssl s_client -servername ${DOMAIN} -connect ${DOMAIN}:443 2>/dev/null | openssl x509 -noout -dates | grep "notAfter" | cut -d'=' -f2)

if [ -n "$SSL_EXPIRY" ]; then
  echo -e "  ${GREEN}✓${NC} SSL Certificate valid"
  echo -e "  ${BLUE}ℹ${NC} Expires: $SSL_EXPIRY"
else
  echo -e "  ${YELLOW}⚠${NC} Unable to check SSL certificate"
fi

echo ""

echo -e "${BLUE}7. Page Speed Test...${NC}"
echo "Testing homepage performance..."

START_TIME=$(date +%s%3N)
curl -s "https://${DOMAIN}" > /dev/null
END_TIME=$(date +%s%3N)
LOAD_TIME=$((END_TIME - START_TIME))

if [ "$LOAD_TIME" -lt 1000 ]; then
  echo -e "  ${GREEN}✓${NC} Fast load time: ${LOAD_TIME}ms"
elif [ "$LOAD_TIME" -lt 3000 ]; then
  echo -e "  ${YELLOW}⚠${NC} Moderate load time: ${LOAD_TIME}ms"
else
  echo -e "  ${RED}✗${NC} Slow load time: ${LOAD_TIME}ms"
fi

echo ""

echo -e "${BLUE}8. Mobile-Friendly Test...${NC}"
echo "Check mobile-friendliness at:"
echo "  https://search.google.com/test/mobile-friendly?url=https://${DOMAIN}"
echo ""

echo -e "${BLUE}9. Rich Results Test...${NC}"
echo "Check structured data at:"
echo "  https://search.google.com/test/rich-results?url=https://${DOMAIN}"
echo ""

echo -e "${GREEN}=================================="
echo "MONITORING SUMMARY"
echo "==================================${NC}"
echo ""
echo "Domain: ${DOMAIN}"
echo "Google Indexed: ~${GOOGLE_INDEXED} pages"
echo "Bing Indexed: ~${BING_INDEXED} pages"
echo "Sitemap URLs: ~${SITEMAP_URLS} URLs"
echo "Load Time: ${LOAD_TIME}ms"
echo ""
echo "Recommendations:"
echo "  1. Run this check daily for first week"
echo "  2. Monitor Search Console for errors"
echo "  3. Check page speed with PageSpeed Insights"
echo "  4. Verify structured data in Rich Results Test"
echo ""
echo "Next Steps:"
echo "  - Submit to Google Search Console"
echo "  - Submit to Bing Webmaster Tools"
echo "  - Monitor analytics for traffic growth"
echo ""
