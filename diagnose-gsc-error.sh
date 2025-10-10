#!/bin/bash

# JC Hair Studio - Diagnóstico Rápido de Erro GSC
# Identifica qual é o erro atual

SITE_URL="https://jchairstudios62.xyz"
SITEMAP_URL="${SITE_URL}/sitemap.xml"

clear

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║        🔍 DIAGNÓSTICO RÁPIDO - ERRO GSC                     ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "🕐 $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Diagnóstico 1: HTTP Status
echo "1️⃣  HTTP Status Code"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITEMAP_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "   ${GREEN}✅ HTTP $HTTP_CODE${NC} - OK"
else
    echo -e "   ${RED}❌ HTTP $HTTP_CODE${NC} - ERRO!"
    echo "   ⚠️  O sitemap não está acessível"
fi
echo ""

# Diagnóstico 2: Content-Type
echo "2️⃣  Content-Type Header"
CONTENT_TYPE=$(curl -sI "$SITEMAP_URL" | grep -i "content-type:" | cut -d' ' -f2- | tr -d '\r' | tr -d '\n')
echo "   Recebido: $CONTENT_TYPE"

if [[ "$CONTENT_TYPE" == *"xml"* ]] || [[ "$CONTENT_TYPE" == *"application/xml"* ]] || [[ "$CONTENT_TYPE" == *"text/xml"* ]]; then
    echo -e "   ${GREEN}✅ Content-Type correto${NC}"
else
    echo -e "   ${YELLOW}⚠️  Content-Type pode estar incorreto${NC}"
    echo "   Esperado: application/xml ou text/xml"
    echo "   🔧 CORREÇÃO: Configurar no next.config.js"
fi
echo ""

# Diagnóstico 3: URLs no sitemap
echo "3️⃣  Contagem de URLs"
URL_COUNT=$(curl -s "$SITEMAP_URL" | grep -c "<url>")
if [ "$URL_COUNT" -gt 0 ]; then
    echo -e "   ${GREEN}✅ $URL_COUNT URLs encontradas${NC}"
else
    echo -e "   ${RED}❌ Nenhuma URL encontrada${NC} - ERRO!"
    echo "   🔧 CORREÇÃO: Regenerar sitemap"
fi
echo ""

# Diagnóstico 4: Validação XML
echo "4️⃣  Validação XML"
XML_ERROR=$(curl -s "$SITEMAP_URL" | xmllint --noout - 2>&1)
if [ -z "$XML_ERROR" ]; then
    echo -e "   ${GREEN}✅ XML válido${NC}"
else
    echo -e "   ${RED}❌ XML inválido${NC} - ERRO!"
    echo "   $XML_ERROR"
    echo "   🔧 CORREÇÃO: Corrigir formatação XML"
fi
echo ""

# Diagnóstico 5: Acesso Googlebot
echo "5️⃣  Acesso do Googlebot"
GOOGLEBOT_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
    "$SITEMAP_URL")
if [ "$GOOGLEBOT_CODE" = "200" ]; then
    echo -e "   ${GREEN}✅ Googlebot pode acessar${NC} (HTTP $GOOGLEBOT_CODE)"
else
    echo -e "   ${RED}❌ Googlebot bloqueado${NC} (HTTP $GOOGLEBOT_CODE) - ERRO!"
    echo "   🔧 CORREÇÃO: Verificar firewall/robots.txt"
fi
echo ""

# Diagnóstico 6: Namespace
echo "6️⃣  XML Namespace"
NAMESPACE=$(curl -s "$SITEMAP_URL" | grep -o 'xmlns="[^"]*"' | head -1)
if echo "$NAMESPACE" | grep -q "sitemaps.org"; then
    echo -e "   ${GREEN}✅ Namespace correto${NC}"
    echo "   $NAMESPACE"
else
    echo -e "   ${YELLOW}⚠️  Namespace pode estar incorreto${NC}"
    echo "   Encontrado: $NAMESPACE"
fi
echo ""

# Diagnóstico 7: Verificar lastmod
echo "7️⃣  Data de Modificação"
LASTMOD=$(curl -s "$SITEMAP_URL" | grep -o '<lastmod>[^<]*</lastmod>' | head -1)
echo "   Última modificação: $LASTMOD"
if echo "$LASTMOD" | grep -qE "[0-9]{4}-[0-9]{2}-[0-9]{2}"; then
    echo -e "   ${GREEN}✅ Formato de data correto${NC}"
else
    echo -e "   ${YELLOW}⚠️  Formato de data pode estar incorreto${NC}"
fi
echo ""

# Diagnóstico 8: Verificar HTTPS
echo "8️⃣  Protocolo HTTPS"
HTTP_URLS=$(curl -s "$SITEMAP_URL" | grep -c "<loc>http://")
HTTPS_URLS=$(curl -s "$SITEMAP_URL" | grep -c "<loc>https://")
echo "   URLs HTTP: $HTTP_URLS"
echo "   URLs HTTPS: $HTTPS_URLS"
if [ "$HTTP_URLS" -gt 0 ]; then
    echo -e "   ${YELLOW}⚠️  Encontradas URLs com HTTP${NC}"
    echo "   🔧 CORREÇÃO: Converter todas para HTTPS"
else
    echo -e "   ${GREEN}✅ Todas as URLs são HTTPS${NC}"
fi
echo ""

# Resumo de problemas
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 RESUMO DO DIAGNÓSTICO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ERRORS=0
WARNINGS=0

if [ "$HTTP_CODE" != "200" ]; then
    ((ERRORS++))
    echo -e "${RED}❌ ERRO:${NC} Sitemap não acessível (HTTP $HTTP_CODE)"
fi

if [ "$URL_COUNT" -eq 0 ]; then
    ((ERRORS++))
    echo -e "${RED}❌ ERRO:${NC} Nenhuma URL no sitemap"
fi

if [ -n "$XML_ERROR" ]; then
    ((ERRORS++))
    echo -e "${RED}❌ ERRO:${NC} XML inválido"
fi

if [ "$GOOGLEBOT_CODE" != "200" ]; then
    ((ERRORS++))
    echo -e "${RED}❌ ERRO:${NC} Googlebot bloqueado"
fi

if [[ "$CONTENT_TYPE" != *"xml"* ]]; then
    ((WARNINGS++))
    echo -e "${YELLOW}⚠️  AVISO:${NC} Content-Type pode estar incorreto"
fi

if [ "$HTTP_URLS" -gt 0 ]; then
    ((WARNINGS++))
    echo -e "${YELLOW}⚠️  AVISO:${NC} URLs HTTP encontradas (devem ser HTTPS)"
fi

echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ SUCESSO: Sitemap está perfeito!${NC}"
    echo ""
    echo "📋 PRÓXIMAS AÇÕES:"
    echo "   1. Verificar Google Search Console manualmente"
    echo "   2. Se ainda houver erro no GSC, pode ser cache"
    echo "   3. Remover e re-adicionar sitemap no GSC"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  ATENÇÃO: $WARNINGS avisos encontrados${NC}"
    echo ""
    echo "O sitemap funciona, mas pode ter pequenos problemas."
    echo "Verifique os avisos acima."
else
    echo -e "${RED}❌ PROBLEMAS: $ERRORS erros, $WARNINGS avisos${NC}"
    echo ""
    echo "🔧 AÇÕES CORRETIVAS NECESSÁRIAS:"
    echo ""

    if [ "$HTTP_CODE" != "200" ]; then
        echo "1. Verificar se sitemap existe:"
        echo "   ls -lh public/sitemap.xml"
        echo ""
    fi

    if [ "$URL_COUNT" -eq 0 ]; then
        echo "2. Regenerar sitemap:"
        echo "   npm run prebuild"
        echo ""
    fi

    if [ -n "$XML_ERROR" ]; then
        echo "3. Corrigir XML:"
        echo "   Verificar formatação em public/sitemap.xml"
        echo ""
    fi

    if [ "$GOOGLEBOT_CODE" != "200" ]; then
        echo "4. Verificar acesso Googlebot:"
        echo "   Verificar robots.txt e configurações CDN"
        echo ""
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 Links úteis:"
echo "   • Sitemap: $SITEMAP_URL"
echo "   • GSC: https://search.google.com/search-console"
echo "   • Validador: https://www.xml-sitemaps.com/validate-xml-sitemap.html"
echo ""
echo "🔄 Monitoramento automático:"
echo "   ./monitor-gsc-auto.sh"
echo ""
