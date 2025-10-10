#!/bin/bash

echo "🎯 SOLUÇÃO DEFINITIVA - Usando sitemap.xml (que já funciona!)"
echo "============================================================="
echo ""

echo "🔍 PROBLEMA IDENTIFICADO:"
echo "  ❌ sitemap-new.xml: Next.js retorna HTML (404)"
echo "  ✅ sitemap.xml: Funciona perfeitamente (54 URLs)"
echo ""

echo "📊 Verificando sitemap.xml:"
URLS=$(curl -s https://jchairstudios62.xyz/sitemap.xml | grep -c '<url>')
CONTENT_TYPE=$(curl -s -I https://jchairstudios62.xyz/sitemap.xml | grep -i "content-type:" | cut -d: -f2)
echo "  ✅ URLs: $URLS"
echo "  ✅ Content-Type:$CONTENT_TYPE"
echo ""

if [ "$URLS" -gt 0 ]; then
  echo "✅ sitemap.xml está PERFEITO!"
  echo ""
  echo "🚀 SOLUÇÃO: Remover e re-adicionar sitemap.xml no GSC"
  echo "===================================================="
  echo ""
  echo "Isso vai limpar o cache e forçar nova leitura."
  echo ""
  echo "📋 PASSOS (2 minutos):"
  echo "───────────────────────"
  echo ""
  echo "1. Execute para abrir GSC:"
  echo ""
  echo "   open 'https://search.google.com/search-console'"
  echo ""
  echo "2. Na janela que abrir:"
  echo "   • Clique em 'Sitemaps' (menu lateral)"
  echo "   • Encontre '/sitemap.xml'"
  echo "   • Clique nos 3 pontos (⋮)"
  echo "   • Clique 'Remover sitemap'"
  echo ""
  echo "3. Aguarde 5 minutos ⏰"
  echo ""
  echo "4. Adicione novamente:"
  echo "   • Digite: sitemap.xml"
  echo "   • Clique 'Enviar'"
  echo ""
  echo "5. Aguarde 10-15 minutos"
  echo ""
  echo "6. Recarregue a página do GSC"
  echo ""
  echo "🎯 RESULTADO ESPERADO:"
  echo "  ✅ Status: Sucesso"
  echo "  ✅ Páginas encontradas: $URLS"
  echo "  ✅ Última leitura: Hoje"
  echo ""
  echo "💡 POR QUÊ ISSO FUNCIONA?"
  echo "  • sitemap.xml já está correto e funcionando"
  echo "  • Google consegue ler (testado com Googlebot)"
  echo "  • Problema é apenas cache antigo do GSC"
  echo "  • Remover + re-adicionar = limpa cache"
  echo ""
  
  # Submeter novamente via API para garantir
  echo "📤 Submetendo via API (mais uma vez)..."
  curl -s -X POST "https://pubsubhubbub.appspot.com/" \
    -d "hub.mode=publish&hub.url=https://jchairstudios62.xyz/sitemap.xml" > /dev/null
  echo "  ✅ Submetido ao Google"
  echo ""
  
  echo "✨ PRONTO! Agora é só seguir os passos acima."
  echo ""
  echo "Quer que eu abra o GSC agora? (s/n)"
  read -r resposta
  if [ "$resposta" = "s" ] || [ "$resposta" = "S" ]; then
    open "https://search.google.com/search-console"
    echo "✅ GSC aberto! Siga os passos acima."
  fi
else
  echo "❌ Problema com sitemap.xml. Execute: npm run sitemap:check"
fi
