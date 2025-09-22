#!/bin/bash

echo "=============================================="
echo "    CORRIGINDO PROBLEMAS DOS PRODUTOS"
echo "=============================================="
echo

# 1. ORGANIZANDO IMAGENS DA PASTA DOWNLOADED
echo "🗂️  ETAPA 1: Organizando imagens da pasta downloaded"
echo "---------------------------------------------"

# Criar diretórios organizados se não existirem
mkdir -p public/images/products/organize-temp

echo "✅ Criando backup do catálogo original..."
cp lib/data/products-with-european-pricing.json lib/data/products-with-european-pricing-backup.json

# 2. REMOVENDO DIRETÓRIOS VAZIOS
echo
echo "🗑️  ETAPA 2: Removendo diretórios vazios"
echo "---------------------------------------------"

# Verificar e remover diretórios vazios
for dir in public/images/products/*/; do
    if [ -d "$dir" ] && [ -z "$(ls -A "$dir")" ]; then
        echo "❌ Removendo diretório vazio: $dir"
        rmdir "$dir"
    fi
done

# 3. CONSOLIDANDO DUPLICAÇÕES
echo
echo "🔄 ETAPA 3: Identificando duplicações"
echo "---------------------------------------------"

# Verificar duplicações BIO EXTRATUS
bio1_count=$(ls public/images/products/bio_extratus_produtos_/ 2>/dev/null | wc -l)
bio2_count=$(ls public/images/products/bioextratus/ 2>/dev/null | wc -l)

echo "Bio Extratus produtos: $bio1_count imagens"
echo "Bio Extratus alternativo: $bio2_count imagens"

# Verificar duplicações HIDRATAÇÃO
hidra1_count=$(ls public/images/products/produtos_de_hidratacao/ 2>/dev/null | wc -l)
hidra2_count=$(ls public/images/products/hidratacao/ 2>/dev/null | wc -l)

echo "Produtos de hidratação: $hidra1_count imagens"
echo "Hidratação alternativa: $hidra2_count imagens"

# 4. MAPEANDO PRODUTOS POR CATEGORIA
echo
echo "📊 ETAPA 4: Mapeando produtos por categoria"
echo "---------------------------------------------"

# Contar produtos por categoria baseado nas imagens existentes
echo "=== TINTAS ==="
for tinta_dir in public/images/products/tinta_*/; do
    if [ -d "$tinta_dir" ]; then
        category_name=$(basename "$tinta_dir" | sed 's/tinta_//' | sed 's/_$//' | tr '_' ' ' | tr '[:lower:]' '[:upper:]')
        count=$(ls "$tinta_dir" 2>/dev/null | wc -l)
        echo "  $category_name: $count produtos"
    fi
done

echo
echo "=== TRATAMENTOS ==="
for treatment in progressivas_diversas relaxamentos_ selagem botox; do
    if [ -d "public/images/products/$treatment" ]; then
        count=$(ls "public/images/products/$treatment" 2>/dev/null | wc -l)
        treatment_name=$(echo "$treatment" | sed 's/_/ /g' | tr '[:lower:]' '[:upper:]')
        echo "  $treatment_name: $count produtos"
    fi
done

echo
echo "=== OUTRAS MARCAS ==="
for brand in cadiveu felps forever-liss g-hair honma-tokyo inoar karssel maria-escandalosa salvatore troia truss vogue zap; do
    if [ -d "public/images/products/$brand" ]; then
        count=$(ls "public/images/products/$brand" 2>/dev/null | wc -l)
        brand_name=$(echo "$brand" | tr '-' ' ' | tr '[:lower:]' '[:upper:]')
        echo "  $brand_name: $count produtos"
    fi
done

# 5. CRIANDO RELATÓRIO DE IMAGENS PROBLEMÁTICAS
echo
echo "⚠️  ETAPA 5: Relatório de imagens problemáticas"
echo "---------------------------------------------"

downloaded_refs=$(grep -c "downloaded" lib/data/products-with-european-pricing.json)
echo "Produtos usando pasta 'downloaded': $downloaded_refs"

# Listar alguns produtos com imagens problemáticas
echo
echo "Exemplos de produtos com imagens na pasta downloaded:"
grep -n "downloaded" lib/data/products-with-european-pricing.json | head -3 | while read line; do
    line_num=$(echo "$line" | cut -d: -f1)
    image_path=$(echo "$line" | grep -o '"/images/products/downloaded/[^"]*"')
    echo "  Linha $line_num: $image_path"
done

echo
echo "=============================================="
echo "           RELATÓRIO CONCLUÍDO"
echo "=============================================="

echo "✅ Backup criado: lib/data/products-with-european-pricing-backup.json"
echo "📁 Total de imagens: $(find public/images/products -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | wc -l)"
echo "📂 Total de diretórios: $(find public/images/products -type d -mindepth 1 | wc -l)"
echo "⚠️  Produtos com imagens problemáticas: $downloaded_refs"

echo
echo "PRÓXIMOS PASSOS RECOMENDADOS:"
echo "1. Renomear imagens da pasta 'downloaded' para nomes descritivos"
echo "2. Mover imagens para diretórios apropriados por categoria"
echo "3. Atualizar referências no catálogo JSON"
echo "4. Consolidar diretórios duplicados"
echo "5. Remover arquivos de catálogo não utilizados"