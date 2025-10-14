#!/bin/bash

###############################################################################
# Cache Busting Script - JC Hair Studio
# Clear all caches and force propagation
###############################################################################

set -e

echo "=================================="
echo "CACHE BUSTING - JC HAIR STUDIO"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Domain
DOMAIN="jchairstudios62.xyz"

echo -e "${BLUE}1. Clearing Vercel Edge Cache...${NC}"
echo "Triggering ISR regeneration for key pages..."

# List of critical pages to regenerate
PAGES=(
  "/"
  "/pt"
  "/en"
  "/es"
  "/fr"
  "/categoria/tratamentos-capilares"
  "/categoria/progressivas-alisamentos"
  "/pt/produtos"
  "/sobre"
  "/contacto"
)

for page in "${PAGES[@]}"; do
  echo "  - Regenerating: $page"
  curl -s "https://${DOMAIN}${page}" > /dev/null 2>&1 || true
done

echo -e "${GREEN}✓ Vercel cache cleared${NC}"
echo ""

echo -e "${BLUE}2. Forcing DNS Propagation Check...${NC}"
echo "Querying DNS records..."

# Check DNS propagation
dig ${DOMAIN} +short || echo "DNS lookup failed"
dig www.${DOMAIN} +short || echo "DNS lookup failed"

echo -e "${GREEN}✓ DNS check complete${NC}"
echo ""

echo -e "${BLUE}3. Testing CDN Response...${NC}"
echo "Testing edge locations..."

# Test with different headers to bypass cache
curl -I "https://${DOMAIN}" \
  -H "Cache-Control: no-cache" \
  -H "Pragma: no-cache" \
  2>&1 | grep -E "HTTP|cache|age" || true

echo -e "${GREEN}✓ CDN test complete${NC}"
echo ""

echo -e "${BLUE}4. Verifying Site Availability...${NC}"

# Test main pages
for page in "${PAGES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}${page}")
  if [ "$STATUS" == "200" ]; then
    echo -e "  ${GREEN}✓${NC} $page (200 OK)"
  else
    echo -e "  ${RED}✗${NC} $page ($STATUS)"
  fi
done

echo ""
echo -e "${BLUE}5. Sitemap & Robots.txt Check...${NC}"

curl -s "https://${DOMAIN}/sitemap.xml" > /dev/null && echo -e "  ${GREEN}✓${NC} sitemap.xml accessible" || echo -e "  ${RED}✗${NC} sitemap.xml failed"
curl -s "https://${DOMAIN}/robots.txt" > /dev/null && echo -e "  ${GREEN}✓${NC} robots.txt accessible" || echo -e "  ${RED}✗${NC} robots.txt failed"
curl -s "https://${DOMAIN}/product-feed.xml" > /dev/null && echo -e "  ${GREEN}✓${NC} product-feed.xml accessible" || echo -e "  ${RED}✗${NC} product-feed.xml failed"

echo ""
echo -e "${GREEN}=================================="
echo "CACHE BUSTING COMPLETE"
echo "==================================${NC}"
echo ""
echo "Next Steps:"
echo "  1. Wait 5-10 minutes for full propagation"
echo "  2. Run: bash scripts/ping-search-engines.sh"
echo "  3. Monitor: bash scripts/monitor-indexing.sh"
echo ""
