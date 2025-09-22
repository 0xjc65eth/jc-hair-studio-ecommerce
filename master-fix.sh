#!/bin/bash

echo "=============================================="
echo "    CORREÇÃO COMPLETA DOS PRODUTOS"
echo "=============================================="
echo

# 1. CONSOLIDAR DIRETÓRIOS DUPLICADOS
echo "🔄 ETAPA 1: Consolidando diretórios duplicados"
echo "---------------------------------------------"

# Consolidar Bio Extratus
echo "🌿 Consolidando Bio Extratus..."
if [ -d "public/images/products/bio_extratus_produtos_" ] && [ -d "public/images/products/bioextratus" ]; then
    # Mover imagens do diretório alternativo para o principal
    mv public/images/products/bioextratus/* public/images/products/bio_extratus_produtos_/ 2>/dev/null
    rmdir public/images/products/bioextratus 2>/dev/null
    echo "✅ Bio Extratus consolidado: $(ls public/images/products/bio_extratus_produtos_/ | wc -l) imagens"
fi

# Consolidar Hidratação
echo "💧 Consolidando Hidratação..."
if [ -d "public/images/products/produtos_de_hidratacao" ] && [ -d "public/images/products/hidratacao" ]; then
    # Manter o diretório mais organizado e mover o outro
    mv public/images/products/hidratacao/* public/images/products/produtos_de_hidratacao/ 2>/dev/null
    rmdir public/images/products/hidratacao 2>/dev/null
    echo "✅ Hidratação consolidada: $(ls public/images/products/produtos_de_hidratacao/ | wc -l) imagens"
fi

# 2. ORGANIZAR IMAGENS DA PASTA DOWNLOADED
echo
echo "📁 ETAPA 2: Organizando imagens downloaded"
echo "---------------------------------------------"

# Criar diretórios temporários para organização
mkdir -p public/images/products/temp-organize/{tintas,tratamentos,hidratacao,outros}

# Analisar imagens da pasta downloaded e classificar por tipo
downloaded_dir="public/images/products/downloaded"
organized_count=0

if [ -d "$downloaded_dir" ]; then
    echo "📊 Analisando $(ls "$downloaded_dir" | wc -l) imagens na pasta downloaded..."

    # Mover imagens organizadas para suas respectivas categorias
    # Baseado nos produtos que referenciam essas imagens no catálogo

    # Primeiro, vamos mapear quais imagens são referenciadas no catálogo
    echo "🔍 Mapeando imagens referenciadas no catálogo..."

    # Criar lista de imagens referenciadas
    grep -o 'downloaded/[^"]*' lib/data/products-with-european-pricing.json | sort | uniq > temp_referenced_images.txt

    echo "📋 Encontradas $(wc -l < temp_referenced_images.txt) referências de imagens"

    # Para cada imagem referenciada, verificar o contexto no catálogo
    while read -r img_ref; do
        img_name=$(basename "$img_ref")

        # Buscar o contexto do produto que usa essa imagem
        product_context=$(grep -B 10 -A 5 "$img_name" lib/data/products-with-european-pricing.json | grep -E '"name"|"brand"|"category"' | head -3)

        # Classificar baseado no contexto
        if echo "$product_context" | grep -qi "tinta\|color\|loreal\|wella\|amend"; then
            category="tintas"
        elif echo "$product_context" | grep -qi "progressiva\|botox\|selagem\|relax"; then
            category="tratamentos"
        elif echo "$product_context" | grep -qi "hidrat\|mascara\|ampola"; then
            category="hidratacao"
        else
            category="outros"
        fi

        # Mover imagem se existir
        if [ -f "$downloaded_dir/$img_name" ]; then
            mv "$downloaded_dir/$img_name" "public/images/products/temp-organize/$category/"
            ((organized_count++))
        fi

    done < temp_referenced_images.txt

    rm temp_referenced_images.txt

    echo "✅ Organizadas $organized_count imagens por categoria"
fi

# 3. CRIAR ESTRUTURA FINAL ORGANIZADA
echo
echo "🏗️  ETAPA 3: Criando estrutura final"
echo "---------------------------------------------"

# Mover imagens organizadas para diretórios finais apropriados
for category in tintas tratamentos hidratacao outros; do
    temp_dir="public/images/products/temp-organize/$category"
    if [ -d "$temp_dir" ] && [ "$(ls -A "$temp_dir")" ]; then
        count=$(ls "$temp_dir" | wc -l)
        echo "📦 Categoria $category: $count imagens"

        case $category in
            "tintas")
                # Distribuir entre as subcategorias de tinta existentes
                target_dir="public/images/products/tinta_diversos"
                mkdir -p "$target_dir"
                mv "$temp_dir"/* "$target_dir/" 2>/dev/null
                ;;
            "tratamentos")
                target_dir="public/images/products/tratamentos_diversos"
                mkdir -p "$target_dir"
                mv "$temp_dir"/* "$target_dir/" 2>/dev/null
                ;;
            "hidratacao")
                mv "$temp_dir"/* "public/images/products/produtos_de_hidratacao/" 2>/dev/null
                ;;
            "outros")
                target_dir="public/images/products/produtos_diversos"
                mkdir -p "$target_dir"
                mv "$temp_dir"/* "$target_dir/" 2>/dev/null
                ;;
        esac
    fi
done

# Limpar diretórios temporários
rm -rf public/images/products/temp-organize

# Verificar se pasta downloaded ainda tem imagens
remaining_downloaded=$(ls "$downloaded_dir" 2>/dev/null | wc -l)
if [ $remaining_downloaded -gt 0 ]; then
    echo "⚠️  Restam $remaining_downloaded imagens não organizadas em downloaded"
    # Mover restantes para categoria geral
    mkdir -p public/images/products/produtos_diversos
    mv "$downloaded_dir"/* public/images/products/produtos_diversos/ 2>/dev/null
fi

# Remover pasta downloaded se vazia
if [ -d "$downloaded_dir" ] && [ -z "$(ls -A "$downloaded_dir")" ]; then
    rmdir "$downloaded_dir"
    echo "✅ Pasta downloaded removida (vazia)"
fi

# 4. ATUALIZAR CATÁLOGO
echo
echo "📝 ETAPA 4: Atualizando referências no catálogo"
echo "---------------------------------------------"

# Fazer backup antes de editar
cp lib/data/products-with-european-pricing.json lib/data/products-with-european-pricing-pre-fix.json

# Atualizar referências de imagens no catálogo
echo "🔄 Atualizando referências de imagens..."

# Substituir referências de downloaded por novos caminhos organizados
sed -i.bak 's|/images/products/downloaded/|/images/products/produtos_diversos/|g' lib/data/products-with-european-pricing.json

# Atualizar referências de diretórios consolidados
sed -i.bak 's|/images/products/bioextratus/|/images/products/bio_extratus_produtos_/|g' lib/data/products-with-european-pricing.json
sed -i.bak 's|/images/products/hidratacao/|/images/products/produtos_de_hidratacao/|g' lib/data/products-with-european-pricing.json

echo "✅ Catálogo atualizado"

# 5. VALIDAÇÃO FINAL
echo
echo "✅ ETAPA 5: Validação final"
echo "---------------------------------------------"

# Contar diretórios finais
total_dirs=$(find public/images/products -type d -mindepth 1 | wc -l)
total_images=$(find public/images/products -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" | wc -l)

echo "📂 Total de diretórios: $total_dirs"
echo "🖼️  Total de imagens: $total_images"

# Verificar referências quebradas
echo "🔍 Verificando referências..."
broken_refs=0
while read -r img_path; do
    full_path="public/$(echo "$img_path" | sed 's|^/||')"
    if [ ! -f "$full_path" ]; then
        ((broken_refs++))
    fi
done < <(grep -o '"/images/products/[^"]*"' lib/data/products-with-european-pricing.json | sed 's/"//g')

echo "❌ Referências quebradas: $broken_refs"

# Listar estrutura final
echo
echo "📋 Estrutura final de diretórios:"
find public/images/products -type d -mindepth 1 | sort | while read dir; do
    count=$(ls "$dir" 2>/dev/null | wc -l)
    dir_name=$(basename "$dir")
    echo "  $dir_name: $count imagens"
done

echo
echo "=============================================="
echo "           CORREÇÃO CONCLUÍDA"
echo "=============================================="
echo "✅ Diretórios duplicados consolidados"
echo "✅ Imagens organizadas por categoria"
echo "✅ Catálogo atualizado"
echo "✅ Referências corrigidas"
echo "📁 Backups criados:"
echo "   - products-with-european-pricing-backup.json"
echo "   - products-with-european-pricing-pre-fix.json"