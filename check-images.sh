#!/bin/bash

echo "=== VERIFICANDO IMAGENS DOS PRODUTOS ==="
echo

# Extrair todos os caminhos de imagem do catálogo
echo "Extraindo caminhos de imagem do catálogo..."
grep -o '"/images/products/[^"]*"' lib/data/products-with-european-pricing.json | sed 's/"//g' | sed 's|^/||' > temp_image_paths.txt

echo "Total de referências de imagem encontradas: $(wc -l < temp_image_paths.txt)"
echo

# Verificar se existem
echo "=== VERIFICANDO EXISTÊNCIA DAS IMAGENS ==="
exists=0
missing=0

while read -r img_path; do
    if [ -f "public/$img_path" ]; then
        echo "✅ $img_path"
        ((exists++))
    else
        echo "❌ $img_path"
        ((missing++))
    fi
done < temp_image_paths.txt

echo
echo "=== RESUMO ==="
echo "Imagens encontradas: $exists"
echo "Imagens faltando: $missing"

# Limpar arquivo temporário
rm temp_image_paths.txt

echo
echo "=== VERIFICANDO IMAGENS NA PASTA DOWNLOADED ==="
downloaded_count=$(ls public/images/products/downloaded/ | wc -l)
echo "Imagens na pasta downloaded: $downloaded_count"

echo
echo "=== VERIFICANDO PRODUTOS COM IMAGENS QUEBRADAS ==="
grep -n "downloaded" lib/data/products-with-european-pricing.json | head -5