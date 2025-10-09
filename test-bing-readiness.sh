#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     BING WEBMASTER TOOLS - TESTE DE PRONTIDÃO                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

SITE_URL="https://jchairstudios62.xyz"
PASS=0
FAIL=0
WARN=0

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🌐 Testando: $SITE_URL"
echo ""
echo "────────────────────────────────────────────────────────────────"
echo "1. VERIFICANDO SITEMAP.XML"
echo "────────────────────────────────────────────────────────────────"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/sitemap.xml")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Sitemap acessível${NC} (HTTP $HTTP_CODE)"
    ((PASS++))
else
    echo -e "${RED}❌ Sitemap inacessível${NC} (HTTP $HTTP_CODE)"
    ((FAIL++))
fi

SITEMAP_SIZE=$(curl -s "$SITE_URL/sitemap.xml" | wc -c)
echo "   Tamanho: $SITEMAP_SIZE bytes"

URLS_COUNT=$(curl -s "$SITE_URL/sitemap.xml" | grep -c "<loc>")
echo "   URLs encontradas: $URLS_COUNT"

echo ""
echo "────────────────────────────────────────────────────────────────"
echo "2. VERIFICANDO INDEXNOW KEY FILE"
echo "────────────────────────────────────────────────────────────────"

KEY="d4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/$KEY.txt")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ IndexNow key acessível${NC} (HTTP $HTTP_CODE)"
    ((PASS++))
    KEY_CONTENT=$(curl -s "$SITE_URL/$KEY.txt")
    if [ "$KEY_CONTENT" = "$KEY" ]; then
        echo -e "${GREEN}✅ Conteúdo da chave correto${NC}"
        ((PASS++))
    else
        echo -e "${RED}❌ Conteúdo da chave incorreto${NC}"
        ((FAIL++))
    fi
else
    echo -e "${RED}❌ IndexNow key inacessível${NC} (HTTP $HTTP_CODE)"
    ((FAIL++))
fi

echo ""
echo "────────────────────────────────────────────────────────────────"
echo "3. VERIFICANDO ROBOTS.TXT"
echo "────────────────────────────────────────────────────────────────"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/robots.txt")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ robots.txt acessível${NC} (HTTP $HTTP_CODE)"
    ((PASS++))
else
    echo -e "${RED}❌ robots.txt inacessível${NC} (HTTP $HTTP_CODE)"
    ((FAIL++))
fi

BINGBOT_RULES=$(curl -s "$SITE_URL/robots.txt" | grep -c "User-agent: Bingbot")
if [ "$BINGBOT_RULES" -gt 0 ]; then
    echo -e "${GREEN}✅ Regras Bingbot encontradas${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  Nenhuma regra específica Bingbot${NC}"
    ((WARN++))
fi

SITEMAP_DECLARED=$(curl -s "$SITE_URL/robots.txt" | grep -c "Sitemap:")
echo "   Sitemaps declarados: $SITEMAP_DECLARED"

echo ""
echo "────────────────────────────────────────────────────────────────"
echo "4. VERIFICANDO META TAGS (HOMEPAGE)"
echo "────────────────────────────────────────────────────────────────"

BING_META=$(curl -s "$SITE_URL" | grep -c "msvalidate.01")
if [ "$BING_META" -gt 0 ]; then
    echo -e "${GREEN}✅ Meta tag Bing encontrada${NC}"
    ((PASS++))
    
    META_CONTENT=$(curl -s "$SITE_URL" | grep "msvalidate.01" | sed 's/.*content="\([^"]*\)".*/\1/')
    if [ "$META_CONTENT" = "your-bing-verification" ]; then
        echo -e "${YELLOW}⚠️  Meta tag é placeholder (precisa código real)${NC}"
        ((WARN++))
    else
        echo -e "${GREEN}✅ Meta tag com código real: $META_CONTENT${NC}"
        ((PASS++))
    fi
else
    echo -e "${RED}❌ Meta tag Bing não encontrada${NC}"
    ((FAIL++))
fi

echo ""
echo "────────────────────────────────────────────────────────────────"
echo "5. TESTANDO ACESSIBILIDADE GERAL"
echo "────────────────────────────────────────────────────────────────"

RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' "$SITE_URL")
echo "   Tempo de resposta: ${RESPONSE_TIME}s"

if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
    echo -e "${GREEN}✅ Tempo de resposta ótimo (<2s)${NC}"
    ((PASS++))
elif (( $(echo "$RESPONSE_TIME < 5.0" | bc -l) )); then
    echo -e "${YELLOW}⚠️  Tempo de resposta aceitável (<5s)${NC}"
    ((WARN++))
else
    echo -e "${RED}❌ Tempo de resposta lento (>5s)${NC}"
    ((FAIL++))
fi

echo ""
echo "────────────────────────────────────────────────────────────────"
echo "6. VERIFICANDO ARQUIVOS LOCAIS"
echo "────────────────────────────────────────────────────────────────"

if [ -f "scripts/submit-indexnow.mjs" ]; then
    echo -e "${GREEN}✅ Script IndexNow presente${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ Script IndexNow ausente${NC}"
    ((FAIL++))
fi

if [ -f "scripts/ping-search-engines.mjs" ]; then
    echo -e "${GREEN}✅ Script ping engines presente${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ Script ping engines ausente${NC}"
    ((FAIL++))
fi

if [ -f "public/sitemap.xml" ]; then
    echo -e "${GREEN}✅ Sitemap local presente${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  Sitemap local não encontrado (verificar build)${NC}"
    ((WARN++))
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📊 RESULTADO FINAL"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Testes Passaram: $PASS${NC}"
echo -e "${YELLOW}⚠️  Avisos: $WARN${NC}"
echo -e "${RED}❌ Testes Falharam: $FAIL${NC}"
echo ""

TOTAL=$((PASS + WARN + FAIL))
SCORE=$((PASS * 100 / TOTAL))

echo "📈 Score de Prontidão: $SCORE%"
echo ""

if [ $FAIL -eq 0 ] && [ $WARN -le 2 ]; then
    echo "✅ STATUS: PRONTO PARA BING WEBMASTER TOOLS!"
    echo ""
    echo "Próximos passos:"
    echo "1. Acesse: https://www.bing.com/webmasters"
    echo "2. Verifique o site (5 min)"
    echo "3. Submeta sitemap.xml (1 min)"
    echo "4. Execute: npm run seo:indexnow"
elif [ $FAIL -eq 0 ]; then
    echo "⚠️  STATUS: QUASE PRONTO (pequenos ajustes necessários)"
    echo ""
    echo "Revisar avisos acima antes de prosseguir."
else
    echo "❌ STATUS: NECESSITA CORREÇÕES"
    echo ""
    echo "Corrigir erros críticos antes de submeter ao Bing."
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📚 Documentação: Ver BING_WEBMASTER_SUBMISSION_REPORT.md"
echo "════════════════════════════════════════════════════════════════"
