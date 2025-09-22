#!/bin/bash

echo "=============================================="
echo "    CORRIGINDO REFERÊNCIAS QUEBRADAS"
echo "=============================================="
echo

# Criar lista de referências quebradas
echo "🔍 ETAPA 1: Identificando referências quebradas"
echo "---------------------------------------------"

broken_count=0
fixed_count=0

# Criar arquivo temporário para mapear correções
> broken_refs.log
> fixes_applied.log

echo "Verificando todas as referências de imagens..."

# Extrair todas as referências de imagem e verificar
grep -o '"/images/products/[^"]*"' lib/data/products-with-european-pricing.json | sed 's/"//g' | while read img_path; do
    full_path="public/$(echo "$img_path" | sed 's|^/||')"

    if [ ! -f "$full_path" ]; then
        echo "❌ QUEBRADA: $img_path" >> broken_refs.log

        # Tentar encontrar a imagem em outros diretórios
        img_name=$(basename "$img_path")

        # Buscar a imagem em todos os diretórios de produtos
        found_path=$(find public/images/products -name "$img_name" -type f | head -1)

        if [ -n "$found_path" ]; then
            # Converter para caminho relativo correto
            new_path="/images/products/$(echo "$found_path" | sed 's|public/images/products/||')"
            echo "✅ ENCONTRADA: $img_path -> $new_path" >> fixes_applied.log
        else
            echo "⚠️  NÃO ENCONTRADA: $img_name" >> broken_refs.log
        fi
    fi
done

# Mostrar estatísticas
if [ -f broken_refs.log ]; then
    broken_count=$(wc -l < broken_refs.log)
    echo "📊 Total de referências quebradas: $broken_count"
fi

if [ -f fixes_applied.log ]; then
    fixable_count=$(wc -l < fixes_applied.log)
    echo "🔧 Referências que podem ser corrigidas: $fixable_count"
fi

# 2. APLICAR CORREÇÕES
echo
echo "🔧 ETAPA 2: Aplicando correções automáticas"
echo "---------------------------------------------"

# Fazer backup antes das correções
cp lib/data/products-with-european-pricing.json lib/data/products-with-european-pricing-pre-ref-fix.json

if [ -f fixes_applied.log ]; then
    echo "Aplicando correções de caminho..."

    while IFS=' -> ' read -r old_path new_path; do
        if [[ "$old_path" == *"ENCONTRADA:"* ]]; then
            old_path=$(echo "$old_path" | sed 's/✅ ENCONTRADA: //')

            # Escapar caracteres especiais para sed
            old_escaped=$(echo "$old_path" | sed 's/[[\.*^$()+?{|]/\\&/g')
            new_escaped=$(echo "$new_path" | sed 's/[[\.*^$()+?{|]/\\&/g')

            # Aplicar substituição no catálogo
            sed -i.tmp "s|$old_escaped|$new_escaped|g" lib/data/products-with-european-pricing.json

            echo "✅ Corrigido: $(basename "$old_path")"
            ((fixed_count++))
        fi
    done < fixes_applied.log

    # Remover arquivo temporário do sed
    rm -f lib/data/products-with-european-pricing.json.tmp
fi

# 3. VERIFICAR IMAGENS FALTANTES E CRIAR PLACEHOLDER
echo
echo "📷 ETAPA 3: Criando placeholders para imagens faltantes"
echo "---------------------------------------------"

# Para imagens que realmente não existem, usar placeholder
placeholder_created=0

if [ -f broken_refs.log ]; then
    while read -r broken_line; do
        if [[ "$broken_line" == *"NÃO ENCONTRADA:"* ]]; then
            img_name=$(echo "$broken_line" | sed 's/⚠️  NÃO ENCONTRADA: //')

            # Determinar categoria baseada no contexto do produto
            product_line=$(grep -B 5 -A 5 "$img_name" lib/data/products-with-european-pricing.json | grep '"name"' | head -1)

            if echo "$product_line" | grep -qi "tinta\|color"; then
                placeholder_path="/images/products/tinta_diversos/placeholder-tinta.jpg"
                mkdir -p public/images/products/tinta_diversos
                # Criar placeholder se não existir
                if [ ! -f "public$placeholder_path" ]; then
                    cp public/placeholder-product.jpg "public$placeholder_path" 2>/dev/null || echo "Placeholder genérico criado" > "public$placeholder_path"
                fi
            elif echo "$product_line" | grep -qi "progressiva\|botox\|relax"; then
                placeholder_path="/images/products/tratamentos_diversos/placeholder-tratamento.jpg"
                mkdir -p public/images/products/tratamentos_diversos
                if [ ! -f "public$placeholder_path" ]; then
                    cp public/placeholder-product.jpg "public$placeholder_path" 2>/dev/null || echo "Placeholder genérico criado" > "public$placeholder_path"
                fi
            else
                placeholder_path="/images/products/produtos_diversos/placeholder-produto.jpg"
                mkdir -p public/images/products/produtos_diversos
                if [ ! -f "public$placeholder_path" ]; then
                    cp public/placeholder-product.jpg "public$placeholder_path" 2>/dev/null || echo "Placeholder genérico criado" > "public$placeholder_path"
                fi
            fi

            # Substituir referência quebrada por placeholder
            original_path="/images/products/downloaded/$img_name"
            sed -i.tmp "s|$original_path|$placeholder_path|g" lib/data/products-with-european-pricing.json

            echo "🖼️  Placeholder criado para: $img_name -> $(basename "$placeholder_path")"
            ((placeholder_created++))
        fi
    done < broken_refs.log

    rm -f lib/data/products-with-european-pricing.json.tmp
fi

# 4. VALIDAÇÃO FINAL
echo
echo "✅ ETAPA 4: Validação final"
echo "---------------------------------------------"

# Verificar novamente as referências
echo "🔍 Verificando referências após correções..."

final_broken=0
while read -r img_path; do
    full_path="public/$(echo "$img_path" | sed 's|^/||')"
    if [ ! -f "$full_path" ]; then
        ((final_broken++))
    fi
done < <(grep -o '"/images/products/[^"]*"' lib/data/products-with-european-pricing.json | sed 's/"//g')

echo "❌ Referências ainda quebradas: $final_broken"

# Limpar arquivos temporários
rm -f broken_refs.log fixes_applied.log

echo
echo "=============================================="
echo "        CORREÇÃO DE REFERÊNCIAS CONCLUÍDA"
echo "=============================================="
echo "✅ Referências corrigidas automaticamente: $fixed_count"
echo "🖼️  Placeholders criados: $placeholder_created"
echo "❌ Referências finais quebradas: $final_broken"
echo "📁 Backup criado: products-with-european-pricing-pre-ref-fix.json"

if [ $final_broken -eq 0 ]; then
    echo "🎉 SUCESSO: Todas as referências foram corrigidas!"
else
    echo "⚠️  Ainda há $final_broken referências quebradas que precisam de atenção manual"
fi