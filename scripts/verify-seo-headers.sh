#!/bin/bash

# SEO Headers Verification Script
# Usage: ./scripts/verify-seo-headers.sh [URL]
# Default URL: https://jchairstudios62.xyz

URL="${1:-https://jchairstudios62.xyz}"

echo "=================================================="
echo "SEO HEADERS VERIFICATION"
echo "=================================================="
echo "Testing URL: $URL"
echo ""

echo "1. Checking HTTP Response Headers..."
echo "--------------------------------------------------"
curl -I -s "$URL" | grep -i "x-robots-tag\|cache-control\|content-type"
echo ""

echo "2. Checking HTML Meta Tags..."
echo "--------------------------------------------------"
curl -s "$URL" | grep -i "robots" | head -5
echo ""

echo "3. Testing robots.txt..."
echo "--------------------------------------------------"
curl -s "${URL}/robots.txt" | head -20
echo ""

echo "4. Testing sitemap.xml..."
echo "--------------------------------------------------"
curl -I -s "${URL}/sitemap.xml" | grep -i "content-type\|x-robots"
echo ""

echo "5. Testing Product Page..."
echo "--------------------------------------------------"
curl -I -s "${URL}/produtos" | grep -i "x-robots-tag\|cache-control"
echo ""

echo "6. Testing Mega Hair Page..."
echo "--------------------------------------------------"
curl -I -s "${URL}/mega-hair-brasileiro" | grep -i "x-robots-tag\|cache-control"
echo ""

echo "=================================================="
echo "VERIFICATION COMPLETE"
echo "=================================================="
echo ""
echo "Expected Results:"
echo "✅ X-Robots-Tag: index, follow, all"
echo "✅ Meta robots: index, follow"
echo "✅ Sitemaps listed in robots.txt"
echo "✅ All URLs accessible"
echo ""
