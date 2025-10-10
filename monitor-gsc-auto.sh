#!/bin/bash

# JC Hair Studio - Monitoramento Automático GSC
# Verifica status a cada 3 minutos e reporta problemas

SITE_URL="https://jchairstudios62.xyz"
SITEMAP_URL="${SITE_URL}/sitemap.xml"
CHECK_INTERVAL=180  # 3 minutos em segundos
MAX_CHECKS=20       # Máximo de 20 verificações (1 hora)

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║     🔍 MONITORAMENTO AUTOMÁTICO - GOOGLE SEARCH CONSOLE     ║"
echo "║              Verificação a cada 3 minutos                    ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "⏰ Início: $(date '+%Y-%m-%d %H:%M:%S')"
echo "📊 Intervalo: 3 minutos"
echo "🔄 Máximo de verificações: $MAX_CHECKS (1 hora)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_count=0

while [ $check_count -lt $MAX_CHECKS ]; do
    ((check_count++))

    echo "🔍 VERIFICAÇÃO #$check_count - $(date '+%H:%M:%S')"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # 1. Verificar acessibilidade do sitemap
    echo ""
    echo "1️⃣  Verificando acessibilidade..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITEMAP_URL")

    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✅ Sitemap acessível (HTTP $HTTP_CODE)"
    else
        echo "   ❌ ERRO: Sitemap retornou HTTP $HTTP_CODE"
    fi

    # 2. Verificar Content-Type
    echo ""
    echo "2️⃣  Verificando Content-Type..."
    CONTENT_TYPE=$(curl -s -I "$SITEMAP_URL" | grep -i "content-type" | cut -d' ' -f2- | tr -d '\r')

    if [[ "$CONTENT_TYPE" == *"xml"* ]]; then
        echo "   ✅ Content-Type correto: $CONTENT_TYPE"
    else
        echo "   ❌ ERRO: Content-Type incorreto: $CONTENT_TYPE"
        echo "   ⚠️  Esperado: application/xml ou text/xml"
    fi

    # 3. Contar URLs
    echo ""
    echo "3️⃣  Contando URLs no sitemap..."
    URL_COUNT=$(curl -s "$SITEMAP_URL" | grep -o "<loc>" | wc -l | tr -d ' ')

    if [ "$URL_COUNT" -gt 0 ]; then
        echo "   ✅ URLs encontradas: $URL_COUNT"
    else
        echo "   ❌ ERRO: Nenhuma URL encontrada no sitemap"
    fi

    # 4. Validar XML
    echo ""
    echo "4️⃣  Validando estrutura XML..."
    XML_VALID=$(curl -s "$SITEMAP_URL" | xmllint --noout - 2>&1)

    if [ -z "$XML_VALID" ]; then
        echo "   ✅ XML válido"
    else
        echo "   ❌ ERRO: XML inválido"
        echo "   $XML_VALID"
    fi

    # 5. Testar como Googlebot
    echo ""
    echo "5️⃣  Testando como Googlebot..."
    GOOGLEBOT_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
        "$SITEMAP_URL")

    if [ "$GOOGLEBOT_CODE" = "200" ]; then
        echo "   ✅ Googlebot pode acessar (HTTP $GOOGLEBOT_CODE)"
    else
        echo "   ❌ ERRO: Googlebot bloqueado (HTTP $GOOGLEBOT_CODE)"
    fi

    # 6. Verificar robots.txt
    echo ""
    echo "6️⃣  Verificando robots.txt..."
    ROBOTS_SITEMAP=$(curl -s "${SITE_URL}/robots.txt" | grep -i "sitemap")

    if [ -n "$ROBOTS_SITEMAP" ]; then
        echo "   ✅ Sitemap declarado em robots.txt"
        echo "   $ROBOTS_SITEMAP"
    else
        echo "   ⚠️  Sitemap não encontrado em robots.txt"
    fi

    # 7. Verificar se há erros comuns
    echo ""
    echo "7️⃣  Verificando erros comuns..."

    # Baixar sitemap
    SITEMAP_CONTENT=$(curl -s "$SITEMAP_URL")

    # Verificar namespace
    if echo "$SITEMAP_CONTENT" | grep -q "xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\""; then
        echo "   ✅ Namespace correto"
    else
        echo "   ⚠️  Namespace pode estar incorreto"
    fi

    # Verificar se tem <?xml
    if echo "$SITEMAP_CONTENT" | head -1 | grep -q "<?xml"; then
        echo "   ✅ Declaração XML presente"
    else
        echo "   ⚠️  Declaração XML pode estar faltando"
    fi

    # Verificar se URLs são HTTPS
    HTTP_URLS=$(echo "$SITEMAP_CONTENT" | grep -o "<loc>http://[^<]*</loc>" | wc -l | tr -d ' ')
    if [ "$HTTP_URLS" -gt 0 ]; then
        echo "   ⚠️  Encontradas $HTTP_URLS URLs com HTTP (deveria ser HTTPS)"
    else
        echo "   ✅ Todas as URLs são HTTPS"
    fi

    # 8. Resubmeter automaticamente
    echo ""
    echo "8️⃣  Resubmetendo para motores de busca..."

    # Google PubSubHubbub
    PUBSUB_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST \
        -d "hub.mode=publish&hub.url=${SITEMAP_URL}" \
        https://pubsubhubbub.appspot.com/publish)

    if [ "$PUBSUB_CODE" = "204" ]; then
        echo "   ✅ Google PubSubHubbub notificado"
    else
        echo "   ⚠️  Google PubSubHubbub: HTTP $PUBSUB_CODE"
    fi

    # Resumo da verificação
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 RESUMO VERIFICAÇÃO #$check_count:"
    echo "   • HTTP Status: $HTTP_CODE"
    echo "   • Content-Type: $CONTENT_TYPE"
    echo "   • URLs: $URL_COUNT"
    echo "   • Googlebot: $GOOGLEBOT_CODE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    # Verificar se tudo está OK
    if [ "$HTTP_CODE" = "200" ] && [ "$URL_COUNT" -gt 0 ] && [ "$GOOGLEBOT_CODE" = "200" ]; then
        echo "✅ SUCESSO: Sitemap está funcionando perfeitamente!"
        echo ""
        echo "📋 PRÓXIMOS PASSOS:"
        echo "   1. Verificar Google Search Console manualmente"
        echo "   2. Aguardar 10-15 minutos para processamento"
        echo "   3. Verificar status em: https://search.google.com/search-console"
        echo ""

        if [ $check_count -lt 3 ]; then
            echo "⏱️  Continuando monitoramento..."
            echo "   Próxima verificação em 3 minutos..."
            echo ""
            sleep $CHECK_INTERVAL
        else
            echo "✅ Monitoramento concluído com sucesso!"
            echo ""
            break
        fi
    else
        echo "⚠️  ATENÇÃO: Problemas detectados!"
        echo ""
        echo "🔧 AÇÕES CORRETIVAS SUGERIDAS:"

        if [ "$HTTP_CODE" != "200" ]; then
            echo "   1. Verificar se o sitemap existe em: $SITEMAP_URL"
        fi

        if [ "$URL_COUNT" -eq 0 ]; then
            echo "   2. Regenerar sitemap: npm run prebuild"
        fi

        if [ "$GOOGLEBOT_CODE" != "200" ]; then
            echo "   3. Verificar configurações de firewall/CDN"
        fi

        echo ""

        if [ $check_count -lt $MAX_CHECKS ]; then
            echo "⏱️  Próxima verificação em 3 minutos..."
            echo "   (Verificação $(($check_count + 1)) de $MAX_CHECKS)"
            echo ""
            sleep $CHECK_INTERVAL
        else
            echo "⏰ Limite de verificações atingido"
            echo ""
            break
        fi
    fi
done

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║           ✅ MONITORAMENTO FINALIZADO                       ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "⏰ Término: $(date '+%Y-%m-%d %H:%M:%S')"
echo "🔄 Total de verificações: $check_count"
echo ""
echo "📋 AÇÕES MANUAIS RECOMENDADAS:"
echo ""
echo "1. Verificar Google Search Console:"
echo "   https://search.google.com/search-console"
echo ""
echo "2. Ir em Sitemaps e verificar status de sitemap.xml"
echo ""
echo "3. Se ainda houver erro, execute:"
echo "   ./check-seo-status.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
