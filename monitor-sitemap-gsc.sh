#!/bin/bash

# Script de Monitoramento Contínuo do Sitemap
# Executa verificações e auto-correção

SITEMAP_URL="https://jchairstudios62.xyz/sitemap.xml"
LOG_FILE="sitemap-monitor.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🔍 Iniciando monitoramento do sitemap..."

# Check 1: HTTP Status
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITEMAP_URL")
if [ "$STATUS" != "200" ]; then
  log "❌ ERRO: HTTP $STATUS"
  exit 1
fi
log "✅ HTTP 200"

# Check 2: URL Count
URL_COUNT=$(curl -s "$SITEMAP_URL" | grep -c "<url>")
log "✅ URLs totais: $URL_COUNT"

# Check 3: Google pode ler?
GOOGLE_COUNT=$(curl -s -A "Google-InspectionTool/1.0" "$SITEMAP_URL" | grep -c "<url>")
log "✅ Google vê: $GOOGLE_COUNT URLs"

# Check 4: Comparar
if [ "$GOOGLE_COUNT" -eq 0 ] && [ "$URL_COUNT" -gt 0 ]; then
  log "🚨 PROBLEMA DETECTADO: Google não consegue ler!"
  log "🔧 Executando auto-correção..."
  ./fix-sitemap-for-google.sh
else
  log "✅ Tudo funcionando corretamente"
fi

# Check 5: Auto-submit se necessário
if [ "$GOOGLE_COUNT" -gt 0 ]; then
  log "📤 Submetendo atualização..."
  curl -s -X POST "https://pubsubhubbub.appspot.com/" \
    -d "hub.mode=publish&hub.url=${SITEMAP_URL}" > /dev/null
  log "✅ Submetido ao Google"
fi

log "✨ Monitoramento completo"
echo ""
