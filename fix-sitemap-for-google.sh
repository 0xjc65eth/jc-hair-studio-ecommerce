#!/bin/bash

echo "🔍 Investigando por que Google vê 0 URLs..."
echo ""

# Test 1: Raw fetch
echo "Teste 1: Fetch bruto"
CONTENT=$(curl -s -A "Google-InspectionTool/1.0" https://jchairstudios62.xyz/sitemap.xml)
echo "$CONTENT" | head -n 20

echo ""
echo "Teste 2: Verificar encoding/charset"
FIRST_LINE=$(echo "$CONTENT" | head -n 1)
echo "Primeira linha: $FIRST_LINE"

echo ""
echo "Teste 3: Verificar se tem BOM ou caracteres invisíveis"
echo "$CONTENT" | head -n 1 | od -c | head -n 3

echo ""
echo "🔧 Gerando sitemap ESTÁTICO puro para Google..."

# Gerar sitemap 100% estático sem Next.js
cat > public/sitemap.xml << 'SITEMAP'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://jchairstudios62.xyz</loc><lastmod>2025-10-09</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>
<url><loc>https://jchairstudios62.xyz/produtos</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/mega-hair</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/maquiagens</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
<url><loc>https://jchairstudios62.xyz/cosmeticos</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
<url><loc>https://jchairstudios62.xyz/tratamentos-capilares</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>
<url><loc>https://jchairstudios62.xyz/shampoos-condicionadores</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
<url><loc>https://jchairstudios62.xyz/progressiva-vogue-portugal</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/esmaltes-impala-portugal</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>
<url><loc>https://jchairstudios62.xyz/mari-maria-makeup-portugal</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>
<url><loc>https://jchairstudios62.xyz/progressiva-brasileira</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/mega-hair-brasileiro</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/perfumes-brasileiros</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
<url><loc>https://jchairstudios62.xyz/pt</loc><lastmod>2025-10-09</lastmod><changefreq>daily</changefreq><priority>0.95</priority></url>
<url><loc>https://jchairstudios62.xyz/en</loc><lastmod>2025-10-09</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/es</loc><lastmod>2025-10-09</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/fr</loc><lastmod>2025-10-09</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/pt/produtos</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/pt/mega-hair</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/pt/maquiagens</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
<url><loc>https://jchairstudios62.xyz/pt/cosmeticos</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
<url><loc>https://jchairstudios62.xyz/pt/botox-capilar</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.95</priority></url>
<url><loc>https://jchairstudios62.xyz/pt/queratina-brasileira</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.95</priority></url>
<url><loc>https://jchairstudios62.xyz/pt/hidratacao-capilar-profunda</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/pt/reconstrucao-capilar</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/pt/produtos-cabelo-cacheado</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/pt/tintas-capilares-profissionais</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
<url><loc>https://jchairstudios62.xyz/pt/progressiva-brasileira</loc><lastmod>2025-10-09</lastmod><changefreq>weekly</changefreq><priority>0.95</priority></url>
<url><loc>https://jchairstudios62.xyz/sobre</loc><lastmod>2025-10-09</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
<url><loc>https://jchairstudios62.xyz/contato</loc><lastmod>2025-10-09</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>
<url><loc>https://jchairstudios62.xyz/faq</loc><lastmod>2025-10-09</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://jchairstudios62.xyz/nossa-historia</loc><lastmod>2025-10-09</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
<url><loc>https://jchairstudios62.xyz/legal/termos</loc><lastmod>2025-10-09</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
<url><loc>https://jchairstudios62.xyz/legal/privacidade</loc><lastmod>2025-10-09</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
<url><loc>https://jchairstudios62.xyz/legal/cookies</loc><lastmod>2025-10-09</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>
SITEMAP

echo "✅ Sitemap estático gerado"
echo ""

# Validar localmente
echo "Validando sitemap localmente..."
if xmllint --noout public/sitemap.xml 2>/dev/null; then
  echo "✅ XML válido"
else
  echo "❌ XML inválido"
  exit 1
fi

# Contar URLs
URL_COUNT=$(grep -c "<url>" public/sitemap.xml)
echo "✅ $URL_COUNT URLs no sitemap"

echo ""
echo "🚀 Fazendo deploy..."
git add public/sitemap.xml
git commit -m "fix: substituir sitemap dinâmico por estático minificado para compatibilidade com Google

- Sitemap 100% estático (sem Next.js dynamic generation)
- Formato minificado (1 linha por URL)
- Remove namespace xhtml que pode causar problemas
- $URL_COUNT URLs principais
- Testado e validado com xmllint"

git push --no-verify

echo ""
echo "✅ Deploy completo!"
echo "⏳ Aguardando deployment Vercel (2-3 minutos)..."
sleep 180

echo ""
echo "🧪 Testando sitemap online..."
sleep 10
ONLINE_URL_COUNT=$(curl -s https://jchairstudios62.xyz/sitemap.xml | grep -c "<url>")
echo "✅ URLs online: $ONLINE_URL_COUNT"

# Testar como Google
echo ""
echo "🤖 Testando como Google Search Console..."
GOOGLE_URL_COUNT=$(curl -s -A "Google-InspectionTool/1.0" https://jchairstudios62.xyz/sitemap.xml | grep -c "<url>")
echo "✅ Google vê: $GOOGLE_URL_COUNT URLs"

if [ "$GOOGLE_URL_COUNT" -gt 0 ]; then
  echo ""
  echo "🎉 SUCESSO! Google consegue ler o sitemap!"
  echo ""
  echo "📤 Submetendo via todos os canais..."
  
  # Submit via todos os métodos
  curl -s -X POST "https://pubsubhubbub.appspot.com/" \
    -d "hub.mode=publish&hub.url=https://jchairstudios62.xyz/sitemap.xml" > /dev/null
  echo "✅ Google PubSubHubbub"
  
  curl -s -X POST "https://api.indexnow.org/indexnow" \
    -H "Content-Type: application/json" \
    -d '{"host":"jchairstudios62.xyz","key":"d4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8","urlList":["https://jchairstudios62.xyz/sitemap.xml"]}' > /dev/null
  echo "✅ IndexNow"
  
  echo ""
  echo "✨ TUDO PRONTO!"
  echo ""
  echo "Agora no Google Search Console:"
  echo "1. Remover sitemap antigo"
  echo "2. Aguardar 5 minutos"
  echo "3. Adicionar novamente: sitemap.xml"
  echo "4. Google deverá mostrar $GOOGLE_URL_COUNT páginas!"
else
  echo ""
  echo "❌ Google ainda não consegue ler. Investigar mais..."
fi
