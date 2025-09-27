#!/bin/bash

# Script para normalizar nomes de imagens e evitar problemas de 404
# Remove caracteres especiais e espaços que causam problemas de URL

echo "🔧 Normalizando nomes de arquivos de imagens..."

# Função para normalizar nomes de arquivos
normalize_filename() {
    local file="$1"
    local dir=$(dirname "$file")
    local basename=$(basename "$file")
    local extension="${basename##*.}"
    local filename="${basename%.*}"

    # Normalizar o nome do arquivo
    local normalized=$(echo "$filename" | \
        sed 's/[áàâäã]/a/g' | \
        sed 's/[éèêë]/e/g' | \
        sed 's/[íìîï]/i/g' | \
        sed 's/[óòôöõ]/o/g' | \
        sed 's/[úùûü]/u/g' | \
        sed 's/[ç]/c/g' | \
        sed 's/[ÁÀÂÄÃ]/A/g' | \
        sed 's/[ÉÈÊË]/E/g' | \
        sed 's/[ÍÌÎÏ]/I/g' | \
        sed 's/[ÓÒÔÖÕ]/O/g' | \
        sed 's/[ÚÙÛÜ]/U/g' | \
        sed 's/[Ç]/C/g' | \
        sed 's/[^a-zA-Z0-9._-]/_/g' | \
        sed 's/__*/_/g' | \
        sed 's/^_//' | \
        sed 's/_$//')

    local new_file="$dir/${normalized}.${extension}"

    if [ "$file" != "$new_file" ] && [ ! -f "$new_file" ]; then
        echo "📁 Renomeando: $(basename "$file") -> $(basename "$new_file")"
        mv "$file" "$new_file"
    fi
}

# Normalizar imagens em mega-hair-real
if [ -d "public/images/mega-hair-real" ]; then
    echo "🎯 Processando mega-hair-real..."
    find "public/images/mega-hair-real" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read file; do
        normalize_filename "$file"
    done
fi

# Normalizar imagens em mega-hair
if [ -d "public/images/mega-hair" ]; then
    echo "🎯 Processando mega-hair..."
    find "public/images/mega-hair" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read file; do
        normalize_filename "$file"
    done
fi

# Criar mega-hair-002.jpg se não existir
if [ ! -f "public/images/mega-hair/mega-hair-002.jpg" ] && [ -f "public/images/placeholder-product.jpg" ]; then
    echo "🔧 Criando mega-hair-002.jpg ausente..."
    cp "public/images/placeholder-product.jpg" "public/images/mega-hair/mega-hair-002.jpg"
fi

echo "✅ Normalização de imagens concluída!"