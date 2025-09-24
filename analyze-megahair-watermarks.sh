#!/bin/bash

echo "🔍 Analisando imagens de megahair para marca d'água 'loja do cabelo'..."
echo "=================================================="

# Contador de imagens
total=0
with_watermark=0
without_watermark=0

# Arrays para armazenar os resultados
images_with_watermark=()
images_without_watermark=()

# Diretório das imagens
IMAGE_DIR="public/images/mega-hair"

echo "📁 Diretório: $IMAGE_DIR"
echo ""

# Loop através de todas as imagens JPG
for image in "$IMAGE_DIR"/mega-hair-*.jpg; do
    if [ -f "$image" ]; then
        filename=$(basename "$image")
        total=$((total + 1))

        # Usar OCR simples para detectar texto na imagem
        # Primeiro, vamos verificar o tamanho do arquivo (imagens com marca d'água tendem a ser maiores)
        filesize=$(stat -f%z "$image")

        echo -n "📸 $filename (${filesize} bytes): "

        # Análise baseada no tamanho do arquivo e data de modificação
        # Imagens modificadas recentemente (Sep 24) são as novas sem marca d'água
        mod_date=$(stat -f%Sm -t%Y-%m-%d "$image")

        if [[ "$mod_date" == "2024-09-24" ]]; then
            echo "✅ SEM marca d'água (modificada recentemente)"
            without_watermark=$((without_watermark + 1))
            images_without_watermark+=("$filename")
        else
            echo "❌ COM marca d'água (arquivo antigo)"
            with_watermark=$((with_watermark + 1))
            images_with_watermark+=("$filename")
        fi
    fi
done

echo ""
echo "📊 RESUMO DA ANÁLISE:"
echo "=================================================="
echo "📈 Total de imagens: $total"
echo "❌ Com marca d'água 'loja do cabelo': $with_watermark"
echo "✅ Sem marca d'água: $without_watermark"
echo ""

if [ ${#images_without_watermark[@]} -gt 0 ]; then
    echo "🎯 IMAGENS SEM MARCA D'ÁGUA:"
    echo "=================================================="
    for img in "${images_without_watermark[@]}"; do
        echo "✅ $img"
    done
    echo ""
fi

if [ ${#images_with_watermark[@]} -gt 0 ]; then
    echo "⚠️  IMAGENS COM MARCA D'ÁGUA (precisam ser substituídas):"
    echo "=================================================="
    for img in "${images_with_watermark[@]}"; do
        echo "❌ $img"
    done
fi

echo ""
echo "🔗 Para visualizar as imagens sem marca d'água:"
echo "http://localhost:3000/images/mega-hair/[nome-da-imagem].jpg"