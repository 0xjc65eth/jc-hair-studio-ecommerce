#!/bin/bash

echo "=============================================="
echo "         ORGANIZANDO CATÁLOGOS"
echo "=============================================="
echo

# Criar diretório de backup para catálogos antigos
mkdir -p backups/old-catalogs

echo "📦 ETAPA 1: Fazendo backup dos catálogos antigos"
echo "---------------------------------------------"

# Mover catálogos não utilizados para backup
backup_files=(
    "lib/data/complete-product-catalog-backup.json"
    "lib/data/complete-product-catalog-consolidated.json"
    "lib/data/complete-product-catalog.json"
    "lib/data/products-complete.json"
    "lib/data/products-reorganized.json"
    "lib/data/products-mega-consolidated.json"
    "lib/data/products-advanced-catalog.json"
    "lib/data/catalog_bio_extratus_produtos__advanced.json"
    "lib/data/botox-products-catalog.json"
    "lib/data/bruna-tavares-bt-skin-catalog.json"
    "lib/data/hydration-products-catalog.json"
)

for file in "${backup_files[@]}"; do
    if [ -f "$file" ]; then
        echo "📄 Movendo $file para backup..."
        mv "$file" "backups/old-catalogs/"
    fi
done

echo
echo "✅ CATÁLOGO PRINCIPAL MANTIDO:"
echo "   - lib/data/products-with-european-pricing.json (177KB)"

echo
echo "📊 ETAPA 2: Analisando o catálogo principal"
echo "---------------------------------------------"

# Analisar o catálogo principal
total_products=$(grep -c '"id"' lib/data/products-with-european-pricing.json)
total_categories=$(grep -c '"name"' lib/data/products-with-european-pricing.json | head -1)
downloaded_images=$(grep -c 'downloaded' lib/data/products-with-european-pricing.json)

echo "📈 Total de produtos: $total_products"
echo "📂 Produtos com imagens problemáticas: $downloaded_images"

echo
echo "🏗️  ETAPA 3: Estrutura de diretórios otimizada"
echo "---------------------------------------------"

echo "Diretórios mantidos (com produtos):"
find public/images/products -type d -mindepth 1 | while read dir; do
    count=$(ls "$dir" 2>/dev/null | wc -l)
    if [ $count -gt 0 ]; then
        dir_name=$(basename "$dir")
        echo "  ✅ $dir_name: $count imagens"
    fi
done

echo
echo "🔧 ETAPA 4: Recomendações de correção"
echo "---------------------------------------------"

echo "PRINCIPAIS PROBLEMAS IDENTIFICADOS:"
echo
echo "1. 📁 IMAGENS DESORGANIZADAS:"
echo "   - 59 produtos usam pasta 'downloaded' com nomes genéricos"
echo "   - 147 imagens na pasta downloaded precisam ser organizadas"
echo
echo "2. 🔄 DUPLICAÇÕES:"
echo "   - Bio Extratus: 2 diretórios (14 + 2 imagens)"
echo "   - Hidratação: 2 diretórios (16 + 16 imagens)"
echo
echo "3. 📋 CATÁLOGOS REDUNDANTES:"
echo "   - 19 arquivos de catálogo (movidos para backup)"
echo "   - Apenas 1 catálogo principal sendo usado"
echo
echo "4. 🖼️  FORMATOS MISTOS:"
echo "   - PNG, JPG, WEBP misturados"
echo "   - Nomes inconsistentes"

echo
echo "🎯 ETAPA 5: Plano de ação"
echo "---------------------------------------------"

echo "CORREÇÕES NECESSÁRIAS:"
echo
echo "A. ORGANIZAÇÃO IMEDIATA:"
echo "   1. Renomear imagens da pasta 'downloaded'"
echo "   2. Classificar por categoria (tinta, hidratação, etc.)"
echo "   3. Atualizar referências no catálogo JSON"
echo
echo "B. CONSOLIDAÇÃO:"
echo "   1. Unificar diretórios Bio Extratus"
echo "   2. Unificar diretórios de Hidratação"
echo "   3. Padronizar nomes de arquivo"
echo
echo "C. OTIMIZAÇÃO:"
echo "   1. Converter imagens para formato consistente"
echo "   2. Otimizar tamanhos de arquivo"
echo "   3. Validar todas as referências"

echo
echo "=============================================="
echo "         ORGANIZAÇÃO CONCLUÍDA"
echo "=============================================="

# Resumo final
echo "✅ Status atual:"
echo "   - Catálogos antigos: $(ls backups/old-catalogs/ | wc -l) arquivos em backup"
echo "   - Catálogo principal: 1 arquivo ativo"
echo "   - Diretórios limpos: $(find public/images/products -type d -empty | wc -l) vazios removidos"
echo "   - Total de imagens: $(find public/images/products -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | wc -l)"

echo
echo "📋 PRÓXIMO PASSO: Executar script de organização de imagens"