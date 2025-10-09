#!/bin/bash

echo "🤖 Automação Máxima - Abrindo Google Search Console"
echo "===================================================="
echo ""

# Aguardar deployment
echo "⏳ Aguardando deployment do sitemap-new.xml (2 min)..."
sleep 120

# Verificar se sitemap-new está online
echo "🔍 Verificando sitemap-new.xml online..."
NEW_URLS=$(curl -s https://jchairstudios62.xyz/sitemap-new.xml | grep -c "<url>")

if [ "$NEW_URLS" -gt 0 ]; then
  echo "✅ sitemap-new.xml online com $NEW_URLS URLs"
else
  echo "⏳ Ainda aguardando deployment..."
  sleep 60
  NEW_URLS=$(curl -s https://jchairstudios62.xyz/sitemap-new.xml | grep -c "<url>")
  if [ "$NEW_URLS" -gt 0 ]; then
    echo "✅ sitemap-new.xml online com $NEW_URLS URLs"
  else
    echo "❌ sitemap-new.xml ainda não está online. Tente novamente em 5 minutos."
    exit 1
  fi
fi

echo ""
echo "🌐 Abrindo Google Search Console automaticamente..."
echo ""

# Abrir GSC no browser padrão
open "https://search.google.com/search-console?resource_id=sc-domain:jchairstudios62.xyz"

sleep 3

# Instruções com osascript (AppleScript)
osascript << 'APPLESCRIPT'
tell application "System Events"
  display notification "Clique em 'Sitemaps' no menu lateral" with title "Google Search Console"
end tell
APPLESCRIPT

echo "✅ Google Search Console aberto!"
echo ""
echo "📋 PRÓXIMOS PASSOS (na janela do browser que abriu):"
echo "===================================================="
echo ""
echo "1. Faça login no Google (se necessário)"
echo ""
echo "2. Clique em 'Sitemaps' no menu lateral esquerdo"
echo ""
echo "3. OPÇÃO A - Adicionar sitemap NOVO (recomendado):"
echo "   • No campo 'Adicionar um novo sitemap'"
echo "   • Digite: sitemap-new.xml"
echo "   • Clique 'Enviar'"
echo "   • ✅ Deve funcionar imediatamente (sem cache!)"
echo ""
echo "4. OPÇÃO B - Limpar cache do sitemap antigo:"
echo "   • Encontre '/sitemap.xml' na lista"
echo "   • Clique nos 3 pontos (⋮)"
echo "   • Clique 'Remover sitemap'"
echo "   • Aguarde 5 minutos"
echo "   • Adicione novamente: sitemap.xml"
echo ""
echo "📊 RESULTADO ESPERADO:"
echo "   ✅ Status: Sucesso"
echo "   ✅ Páginas encontradas: $NEW_URLS"
echo "   ✅ Última leitura: Hoje"
echo ""
echo "💡 DICA: Use sitemap-new.xml para evitar o problema de cache!"
echo ""

# Criar notificação depois de 30 segundos
(
  sleep 30
  osascript << 'APPLESCRIPT2'
tell application "System Events"
  display notification "Não esqueça de adicionar o sitemap!" with title "Google Search Console"
end tell
APPLESCRIPT2
) &

echo "✨ Script completo! Siga as instruções no browser."
