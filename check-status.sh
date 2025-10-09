#!/bin/bash
echo "🔍 Status dos Sitemaps"
echo "====================="
echo ""
echo "Sitemap Principal:"
MAIN=$(curl -s https://jchairstudios62.xyz/sitemap.xml | grep -c '<url>')
echo "  🌐 https://jchairstudios62.xyz/sitemap.xml"
echo "  📊 $MAIN URLs"
echo ""
echo "Sitemap Alternativo:"
NEW=$(curl -s https://jchairstudios62.xyz/sitemap-new.xml | grep -c '<url>')
echo "  🌐 https://jchairstudios62.xyz/sitemap-new.xml"
if [ "$NEW" -gt 0 ]; then
  echo "  ✅ $NEW URLs (pronto para usar!)"
else
  echo "  ⏳ Aguardando deployment... (tente em 5 min)"
fi
echo ""
if [ "$NEW" -gt 0 ]; then
  echo "🎯 AÇÃO: Adicione sitemap-new.xml no GSC"
  echo ""
  echo "   open 'https://search.google.com/search-console'"
  echo ""
fi
