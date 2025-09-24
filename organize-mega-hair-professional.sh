#!/bin/bash

# Script para organizar mega hair profissionalmente por tipo e comprimento
echo "🚀 Organizando Mega Hair Profissionalmente..."

SOURCE_DIR="$HOME/Downloads/cabelos mega hair lasted version"
DEST_DIR="/Users/juliocesar/Jc-hair-studio's 62  ecommerce/jc-hair-studio/public/images/mega-hair"

# Arrays de comprimentos para distribuição inteligente
COMPRIMENTOS_LISO=(25cm 30cm 40cm 50cm 60cm 70cm 80cm 90cm 100cm)
COMPRIMENTOS_ONDULADO=(30cm 40cm 50cm 65cm 75cm 85cm 95cm)
COMPRIMENTOS_CACHEADO=(25cm 35cm 45cm 55cm 65cm 75cm 85cm)
COMPRIMENTOS_CRESPO=(25cm 30cm 35cm 40cm 45cm 50cm)

cd "$SOURCE_DIR"

# Contador para distribuição inteligente
contador_liso=0
contador_ondulado=0
contador_cacheado=0
contador_crespo=0

echo "📁 Organizando por categorias..."

# LISOS (1A e 2A)
for arquivo in *1A*; do
    if [ -f "$arquivo" ]; then
        comprimento=${COMPRIMENTOS_LISO[$contador_liso]}

        if [[ "$arquivo" == *"Preto natural"* ]]; then
            nome="preto-natural-liso-1a.jpg"
        elif [[ "$arquivo" == *"Loiro platinado"* ]]; then
            nome="loiro-platinado-liso-1a.jpg"
        elif [[ "$arquivo" == *"Loiro levemente acobreado"* ]]; then
            nome="loiro-acobreado-liso-1a.jpg"
        elif [[ "$arquivo" == *"Grisalho acinzentado"* ]]; then
            nome="grisalho-acinzentado-liso-1a.jpg"
        elif [[ "$arquivo" == *"Grisalho em 40"* ]]; then
            nome="grisalho-mix-liso-1a.jpg"
        elif [[ "$arquivo" == *"Alaranjado"* ]]; then
            nome="ruivo-alaranjado-liso-1a.jpg"
        fi

        cp "$arquivo" "$DEST_DIR/liso/$comprimento/$nome"
        echo "✅ Liso $comprimento: $nome"
        contador_liso=$((contador_liso + 1))
    fi
done

for arquivo in *2A*; do
    if [ -f "$arquivo" ]; then
        comprimento=${COMPRIMENTOS_LISO[$contador_liso]}

        if [[ "$arquivo" == *"Preto natural"* ]]; then
            nome="preto-natural-liso-2a.jpg"
        elif [[ "$arquivo" == *"Marrom ou chocolate"* ]]; then
            nome="castanho-chocolate-liso-2a.jpg"
        fi

        cp "$arquivo" "$DEST_DIR/liso/$comprimento/$nome"
        echo "✅ Liso $comprimento: $nome"
        contador_liso=$((contador_liso + 1))
    fi
done

# ONDULADOS (2C e 3A)
for arquivo in *2C*; do
    if [ -f "$arquivo" ]; then
        comprimento=${COMPRIMENTOS_ONDULADO[$contador_ondulado]}
        nome="preto-natural-ondulado-2c.jpg"

        cp "$arquivo" "$DEST_DIR/ondulado/$comprimento/$nome"
        echo "✅ Ondulado $comprimento: $nome"
        contador_ondulado=$((contador_ondulado + 1))
    fi
done

for arquivo in *3A*; do
    if [ -f "$arquivo" ]; then
        comprimento=${COMPRIMENTOS_ONDULADO[$contador_ondulado]}
        nome="preto-natural-ondulado-3a.jpg"

        cp "$arquivo" "$DEST_DIR/ondulado/$comprimento/$nome"
        echo "✅ Ondulado $comprimento: $nome"
        contador_ondulado=$((contador_ondulado + 1))
    fi
done

# CACHEADOS (3C)
for arquivo in *3C*; do
    if [ -f "$arquivo" ]; then
        comprimento=${COMPRIMENTOS_CACHEADO[$contador_cacheado]}

        if [[ "$arquivo" == *"Preto"* ]]; then
            nome="preto-natural-cacheado-3c.jpg"
        elif [[ "$arquivo" == *"Castanho médio"* ]]; then
            nome="castanho-medio-cacheado-3c.jpg"
        elif [[ "$arquivo" == *"Ruivo"* ]]; then
            nome="ruivo-cacheado-3c.jpg"
        elif [[ "$arquivo" == *"Vermelho borgonha"* ]]; then
            nome="borgonha-cacheado-3c.jpg"
        fi

        cp "$arquivo" "$DEST_DIR/cacheado/$comprimento/$nome"
        echo "✅ Cacheado $comprimento: $nome"
        contador_cacheado=$((contador_cacheado + 1))
    fi
done

# CRESPOS (4A, 4B, 4C)
for arquivo in *4A*; do
    if [ -f "$arquivo" ]; then
        comprimento=${COMPRIMENTOS_CRESPO[$contador_crespo]}

        if [[ "$arquivo" == *"degrade dourado"* ]]; then
            nome="ombre-dourado-crespo-4a.jpg"
        elif [[ "$arquivo" == *"mechas carameladas"* ]]; then
            nome="preto-mechas-caramelo-crespo-4a.jpg"
        fi

        cp "$arquivo" "$DEST_DIR/crespo/$comprimento/$nome"
        echo "✅ Crespo $comprimento: $nome"
        contador_crespo=$((contador_crespo + 1))
    fi
done

for arquivo in *4B*; do
    if [ -f "$arquivo" ]; then
        comprimento=${COMPRIMENTOS_CRESPO[$contador_crespo]}
        nome="preto-natural-crespo-4b.jpg"

        cp "$arquivo" "$DEST_DIR/crespo/$comprimento/$nome"
        echo "✅ Crespo $comprimento: $nome"
        contador_crespo=$((contador_crespo + 1))
    fi
done

for arquivo in *4C*; do
    if [ -f "$arquivo" ]; then
        comprimento=${COMPRIMENTOS_CRESPO[$contador_crespo]}
        nome="preto-natural-crespo-4c.jpg"

        cp "$arquivo" "$DEST_DIR/crespo/$comprimento/$nome"
        echo "✅ Crespo $comprimento: $nome"
        contador_crespo=$((contador_crespo + 1))
    fi
done

echo ""
echo "🎯 ORGANIZAÇÃO CONCLUÍDA!"
echo "📊 Resumo:"
echo "   Lisos: $contador_liso imagens"
echo "   Ondulados: $contador_ondulado imagens"
echo "   Cacheados: $contador_cacheado imagens"
echo "   Crespos: $contador_crespo imagens"
echo ""
echo "🌐 Estrutura criada de 25cm até 100cm para todos os tipos!"