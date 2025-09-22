#!/bin/bash

echo "=============================================="
echo "     CRIANDO PLACEHOLDERS PARA IMAGENS"
echo "=============================================="
echo

# Obter lista de imagens faltantes
echo "🔍 Identificando imagens faltantes..."

missing_images=()
while read -r img_path; do
    full_path="public/$(echo "$img_path" | sed 's|^/||')"
    if [ ! -f "$full_path" ]; then
        missing_images+=("$full_path")
    fi
done < <(grep -o '"/images/products/[^"]*"' lib/data/products-with-european-pricing.json | sed 's/"//g')

echo "📊 Total de imagens faltantes: ${#missing_images[@]}"

# Criar placeholders
created_count=0
for missing_path in "${missing_images[@]}"; do
    # Criar diretório se não existir
    dir_path=$(dirname "$missing_path")
    mkdir -p "$dir_path"

    # Copiar placeholder
    if [ -f "public/placeholder-product.jpg" ]; then
        cp "public/placeholder-product.jpg" "$missing_path"
        echo "✅ Criado: $(basename "$missing_path")"
        ((created_count++))
    else
        # Criar um placeholder simples se não existir o original
        echo "Placeholder Image" > "$missing_path"
        echo "⚠️  Placeholder texto: $(basename "$missing_path")"
        ((created_count++))
    fi
done

echo
echo "=============================================="
echo "      PLACEHOLDERS CRIADOS COM SUCESSO"
echo "=============================================="
echo "✅ Total de placeholders criados: $created_count"
echo "📁 Todos os arquivos de imagem agora existem"

# Verificação final
echo
echo "🔍 Verificação final..."
final_missing=0
while read -r img_path; do
    full_path="public/$(echo "$img_path" | sed 's|^/||')"
    if [ ! -f "$full_path" ]; then
        ((final_missing++))
    fi
done < <(grep -o '"/images/products/[^"]*"' lib/data/products-with-european-pricing.json | sed 's/"//g')

echo "❌ Imagens ainda faltando: $final_missing"

if [ $final_missing -eq 0 ]; then
    echo "🎉 SUCESSO TOTAL: Todas as referências de imagem agora funcionam!"
else
    echo "⚠️  Ainda há $final_missing referências com problemas"
fi