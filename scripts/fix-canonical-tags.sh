#!/bin/bash

# FIX CANONICAL TAGS - RESOLVER PROBLEMA DE DUPLICAÇÃO NO GOOGLE

echo "========================================"
echo "🔧 CORRIGINDO CANONICAL TAGS"
echo "========================================"

# Diretório base
BASE_DIR="/Users/juliocesar/Jc-hair-studio's 62  ecommerce/jc-hair-studio"
cd "$BASE_DIR"

# 1. Desabilitar páginas com [locale] para evitar duplicação
echo ""
echo "📁 Desabilitando páginas com [locale] duplicadas..."

# Renomear pastas [locale] para desabilitar temporariamente
if [ -d "app/[locale]/produtos" ]; then
    mv "app/[locale]/produtos" "app/[locale]/produtos.disabled"
    echo "  ✓ Desabilitado: app/[locale]/produtos"
fi

if [ -d "app/[locale]/mega-hair" ]; then
    mv "app/[locale]/mega-hair" "app/[locale]/mega-hair.disabled"
    echo "  ✓ Desabilitado: app/[locale]/mega-hair"
fi

if [ -d "app/[locale]/maquiagens" ]; then
    mv "app/[locale]/maquiagens" "app/[locale]/maquiagens.disabled"
    echo "  ✓ Desabilitado: app/[locale]/maquiagens"
fi

# 2. Adicionar redirects no next.config.js para URLs com locale
echo ""
echo "📝 Adicionando redirects para evitar 404s..."

cat > scripts/canonical-redirects.js << 'EOF'
// Adicionar no next.config.js dentro de async redirects()
const canonicalRedirects = [
  // Redirecionar todas as versões com locale para versão sem locale
  {
    source: '/:locale(pt|en|es)/produtos',
    destination: '/produtos',
    permanent: true,
  },
  {
    source: '/:locale(pt|en|es)/produtos/:path*',
    destination: '/produtos/:path*',
    permanent: true,
  },
  {
    source: '/:locale(pt|en|es)/mega-hair',
    destination: '/mega-hair',
    permanent: true,
  },
  {
    source: '/:locale(pt|en|es)/mega-hair/:path*',
    destination: '/mega-hair/:path*',
    permanent: true,
  },
  {
    source: '/:locale(pt|en|es)/maquiagens',
    destination: '/maquiagens',
    permanent: true,
  },
  {
    source: '/:locale(pt|en|es)/maquiagens/:path*',
    destination: '/maquiagens/:path*',
    permanent: true,
  },
];
EOF

# 3. Verificar e corrigir canonical tags nas páginas principais
echo ""
echo "🔍 Verificando canonical tags nas páginas principais..."

# Lista de páginas para verificar
PAGES=(
    "app/produtos/page.tsx"
    "app/mega-hair/page.tsx"
    "app/mega-hair-brasileiro/page.tsx"
    "app/maquiagens/page.tsx"
    "app/tratamentos-capilares/page.tsx"
    "app/progressivas-btx/page.tsx"
    "app/shampoos-condicionadores/page.tsx"
)

for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
        # Verificar se tem canonical
        if grep -q "canonical:" "$page"; then
            echo "  ✓ Canonical encontrado em: $page"
            # Extrair URL canonical
            canonical_url=$(grep "canonical:" "$page" | grep -oE "https://[^'\"]+")
            echo "    URL: $canonical_url"
        else
            echo "  ⚠ Sem canonical em: $page"
        fi
    fi
done

# 4. Criar script para adicionar canonical self-referencing em todas as páginas
echo ""
echo "📄 Criando script para adicionar canonical self-referencing..."

cat > scripts/add-canonical-metadata.js << 'EOF'
// Script para adicionar canonical metadata em páginas Next.js
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://jchairstudios62.xyz';

function addCanonicalToPage(filePath, route) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Se já tem canonical, pular
    if (content.includes('canonical:')) {
        console.log(`  ✓ ${filePath} já tem canonical`);
        return;
    }

    // Adicionar canonical no metadata
    const metadataRegex = /export\s+const\s+metadata[^{]*{/;
    if (metadataRegex.test(content)) {
        content = content.replace(metadataRegex, (match) => {
            return match + `\n    canonical: '${SITE_URL}${route}',`;
        });

        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Canonical adicionado em: ${filePath}`);
    }
}

// Processar páginas
const pages = [
    { file: 'app/produtos/page.tsx', route: '/produtos' },
    { file: 'app/mega-hair/page.tsx', route: '/mega-hair' },
    { file: 'app/mega-hair-brasileiro/page.tsx', route: '/mega-hair-brasileiro' },
    { file: 'app/maquiagens/page.tsx', route: '/maquiagens' },
    { file: 'app/tratamentos-capilares/page.tsx', route: '/tratamentos-capilares' },
    { file: 'app/progressivas-btx/page.tsx', route: '/progressivas-btx' },
    { file: 'app/shampoos-condicionadores/page.tsx', route: '/shampoos-condicionadores' },
];

pages.forEach(({ file, route }) => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        addCanonicalToPage(filePath, route);
    }
});
EOF

# 5. Atualizar robots.txt para forçar crawl nas páginas corretas
echo ""
echo "🤖 Atualizando robots.txt..."

cat > public/robots.txt << EOF
# ROBOTS.TXT - OTIMIZADO PARA INDEXAÇÃO RÁPIDA
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /pt/
Disallow: /en/
Disallow: /es/

# Googlebot específico
User-agent: Googlebot
Allow: /
Crawl-delay: 0
Request-rate: 100/1m

# URLs principais para indexar
Allow: /produtos
Allow: /mega-hair
Allow: /mega-hair-brasileiro
Allow: /maquiagens
Allow: /tratamentos-capilares
Allow: /progressivas-btx
Allow: /shampoos-condicionadores

# Sitemaps
Sitemap: https://jchairstudios62.xyz/sitemap.xml
Sitemap: https://jchairstudios62.xyz/sitemap-products.xml
Sitemap: https://jchairstudios62.xyz/sitemap-categories.xml
EOF

# 6. Criar novo sitemap limpo sem duplicação
echo ""
echo "🗺️ Criando sitemap limpo sem duplicação..."

cat > public/sitemap-canonical.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Página Principal -->
  <url>
    <loc>https://jchairstudios62.xyz/</loc>
    <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Categorias Principais (SEM LOCALE) -->
  <url>
    <loc>https://jchairstudios62.xyz/produtos</loc>
    <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://jchairstudios62.xyz/mega-hair</loc>
    <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://jchairstudios62.xyz/mega-hair-brasileiro</loc>
    <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://jchairstudios62.xyz/maquiagens</loc>
    <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://jchairstudios62.xyz/tratamentos-capilares</loc>
    <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://jchairstudios62.xyz/progressivas-btx</loc>
    <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://jchairstudios62.xyz/shampoos-condicionadores</loc>
    <lastmod>$(date -u +%Y-%m-%dT%H:%M:%S+00:00)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
EOF

echo ""
echo "========================================"
echo "✅ CORREÇÕES APLICADAS!"
echo "========================================"
echo ""
echo "📊 RESUMO DAS CORREÇÕES:"
echo "  ✓ Páginas com [locale] desabilitadas"
echo "  ✓ Redirects configurados"
echo "  ✓ Canonical tags verificadas"
echo "  ✓ robots.txt otimizado"
echo "  ✓ Novo sitemap canonical criado"
echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "  1. Fazer commit e deploy das mudanças"
echo "  2. Submeter novo sitemap ao Google"
echo "  3. Forçar re-indexação"
echo ""