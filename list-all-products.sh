#!/bin/bash

echo "=============================================="
echo "       LISTAGEM COMPLETA DE PRODUTOS"
echo "=============================================="
echo

# Função para listar produtos em uma categoria
list_category() {
    local dir="$1"
    local category_name="$2"

    if [ -d "$dir" ]; then
        echo "=== $category_name ==="
        local count=$(ls "$dir" 2>/dev/null | wc -l)
        echo "Total de produtos: $count"

        if [ $count -gt 0 ]; then
            echo "Primeiros 10 produtos:"
            ls "$dir" | head -10
            if [ $count -gt 10 ]; then
                echo "... e mais $((count - 10)) produtos"
            fi
        else
            echo "Nenhum produto encontrado"
        fi
        echo
    else
        echo "=== $category_name ==="
        echo "Diretório não encontrado: $dir"
        echo
    fi
}

# TINTAS
echo "🎨 CATEGORIA: TINTAS"
echo "----------------------------------------"
list_category "public/images/products/tinta_loreal" "TINTA LOREAL"
list_category "public/images/products/tinta_alta_moda_" "TINTA ALTA MODA"
list_category "public/images/products/tinta_amend" "TINTA AMEND"
list_category "public/images/products/tinta_beauty_color" "TINTA BEAUTY COLOR"
list_category "public/images/products/tinta_biocolor" "TINTA BIOCOLOR"
list_category "public/images/products/tinta_excllusiv" "TINTA EXCLLUSIV"
list_category "public/images/products/tinta_nutrisse" "TINTA NUTRISSE"
list_category "public/images/products/tinta_wella" "TINTA WELLA"

# HIDRATAÇÃO
echo "💧 CATEGORIA: HIDRATAÇÃO"
echo "----------------------------------------"
list_category "public/images/products/produtos_de_hidratacao" "PRODUTOS DE HIDRATAÇÃO"
list_category "public/images/products/hidratacao" "HIDRATAÇÃO (alternativa)"

# TRATAMENTOS
echo "💫 CATEGORIA: TRATAMENTOS"
echo "----------------------------------------"
list_category "public/images/products/progressivas_diversas" "PROGRESSIVAS DIVERSAS"
list_category "public/images/products/progressivas" "PROGRESSIVAS"
list_category "public/images/products/relaxamentos_" "RELAXAMENTOS"
list_category "public/images/products/selagem" "SELAGEM"
list_category "public/images/products/botox" "BOTOX"

# BIO EXTRATUS
echo "🌿 CATEGORIA: BIO EXTRATUS"
echo "----------------------------------------"
list_category "public/images/products/bio_extratus_produtos_" "BIO EXTRATUS PRODUTOS"
list_category "public/images/products/bioextratus" "BIO EXTRATUS (alternativa)"

# OUTRAS MARCAS
echo "🏷️ CATEGORIA: OUTRAS MARCAS"
echo "----------------------------------------"
list_category "public/images/products/cadiveu" "CADIVEU"
list_category "public/images/products/felps" "FELPS"
list_category "public/images/products/forever-liss" "FOREVER LISS"
list_category "public/images/products/g-hair" "G-HAIR"
list_category "public/images/products/honma-tokyo" "HONMA TOKYO"
list_category "public/images/products/inoar" "INOAR"
list_category "public/images/products/karssel" "KARSSEL"
list_category "public/images/products/maria-escandalosa" "MARIA ESCANDALOSA"
list_category "public/images/products/salvatore" "SALVATORE"
list_category "public/images/products/troia" "TROIA"
list_category "public/images/products/troia-hair" "TROIA HAIR"
list_category "public/images/products/truss" "TRUSS"
list_category "public/images/products/vogue" "VOGUE"
list_category "public/images/products/zap" "ZAP"
list_category "public/images/products/zap-all-time" "ZAP ALL TIME"

# MAQUIAGEM
echo "💄 CATEGORIA: MAQUIAGEM"
echo "----------------------------------------"
list_category "public/images/products/bruna-tavares-bt-skin" "BRUNA TAVARES BT SKIN"
list_category "public/images/products/mari-maria-bases" "MARI MARIA BASES"

# OUTROS
echo "📦 CATEGORIA: OUTROS"
echo "----------------------------------------"
list_category "public/images/products/downloaded" "IMAGENS BAIXADAS"

echo "=============================================="
echo "           RESUMO TOTAL"
echo "=============================================="

# Contar total de imagens
total_images=$(find public/images/products -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" 2>/dev/null | wc -l)
total_dirs=$(find public/images/products -type d -mindepth 1 | wc -l)

echo "Total de diretórios: $total_dirs"
echo "Total de imagens: $total_images"
echo "=============================================="