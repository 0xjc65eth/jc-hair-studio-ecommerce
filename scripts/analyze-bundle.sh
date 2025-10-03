#!/bin/bash

# SCRIPT DE ANÁLISE DE BUNDLE SIZE
# Analisa o tamanho do bundle e identifica oportunidades de otimização

echo "📦 Analisando Bundle Size do JC Hair Studio..."
echo "================================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se o build existe
if [ ! -d ".next" ]; then
    echo -e "${YELLOW}⚠️  Build não encontrado. Executando build...${NC}"
    npm run build
fi

echo ""
echo "📊 Análise de Bundle Size"
echo "=========================="
echo ""

# Analisar tamanho total
TOTAL_SIZE=$(du -sh .next/static/chunks | cut -f1)
echo -e "${GREEN}Total Bundle Size: ${TOTAL_SIZE}${NC}"

# Analisar chunks individuais
echo ""
echo "📦 Chunks Principais:"
echo "--------------------"
du -h .next/static/chunks/*.js 2>/dev/null | sort -hr | head -10

# Verificar se framer-motion ainda está no bundle
echo ""
echo "🔍 Verificando dependências pesadas..."
echo "--------------------------------------"

if grep -r "framer-motion" .next/static/chunks/*.js 2>/dev/null | wc -l | grep -v "0" > /dev/null; then
    FRAMER_COUNT=$(grep -r "framer-motion" .next/static/chunks/*.js 2>/dev/null | wc -l)
    echo -e "${YELLOW}⚠️  framer-motion encontrado em ${FRAMER_COUNT} chunks${NC}"
    echo "   Considere substituir por CSS animations"
else
    echo -e "${GREEN}✅ framer-motion não encontrado (ótimo!)${NC}"
fi

# Análise de imagens
echo ""
echo "🖼️  Análise de Imagens:"
echo "----------------------"
if [ -d "public/images" ]; then
    IMAGES_SIZE=$(du -sh public/images | cut -f1)
    echo -e "Tamanho total: ${IMAGES_SIZE}"

    # Contar imagens não otimizadas
    JPG_COUNT=$(find public/images -name "*.jpg" -o -name "*.jpeg" | wc -l)
    PNG_COUNT=$(find public/images -name "*.png" | wc -l)
    WEBP_COUNT=$(find public/images -name "*.webp" | wc -l)
    AVIF_COUNT=$(find public/images -name "*.avif" | wc -l)

    echo "  JPG/JPEG: $JPG_COUNT"
    echo "  PNG: $PNG_COUNT"
    echo "  WebP: $WEBP_COUNT"
    echo "  AVIF: $AVIF_COUNT"

    if [ $JPG_COUNT -gt 0 ] || [ $PNG_COUNT -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Considere converter imagens para WebP/AVIF${NC}"
    else
        echo -e "${GREEN}✅ Imagens otimizadas!${NC}"
    fi
else
    echo "Pasta public/images não encontrada"
fi

# Análise de node_modules (apenas principais dependências)
echo ""
echo "📚 Principais Dependências:"
echo "--------------------------"
if [ -f "package.json" ]; then
    echo "React:"
    du -sh node_modules/react node_modules/react-dom 2>/dev/null | cut -f1 | paste -sd+ | bc 2>/dev/null || echo "N/A"

    echo "Next.js:"
    du -sh node_modules/next 2>/dev/null | cut -f1

    if [ -d "node_modules/framer-motion" ]; then
        echo -e "${YELLOW}framer-motion:${NC}"
        du -sh node_modules/framer-motion 2>/dev/null | cut -f1
    fi
fi

# Recomendações
echo ""
echo "💡 Recomendações de Otimização:"
echo "==============================="

# Verificar se há CSS não usado
if [ -d ".next/static/css" ]; then
    CSS_SIZE=$(du -sh .next/static/css | cut -f1)
    echo "1. CSS total: ${CSS_SIZE}"
    echo "   Considere usar PurgeCSS para remover CSS não utilizado"
fi

# Verificar configuração de imagens
if grep -q "unoptimized: true" next.config.js 2>/dev/null; then
    echo -e "2. ${RED}❌ Otimização de imagens DESATIVADA${NC}"
    echo "   Execute: Mude 'unoptimized: true' para 'unoptimized: false' em next.config.js"
else
    echo -e "2. ${GREEN}✅ Otimização de imagens ATIVADA${NC}"
fi

# Verificar ISR
if find app -name "page.tsx" -exec grep -l "export const revalidate" {} \; | wc -l | grep -v "0" > /dev/null; then
    echo -e "3. ${GREEN}✅ ISR implementado em algumas páginas${NC}"
else
    echo -e "3. ${YELLOW}⚠️  ISR não encontrado${NC}"
    echo "   Implemente ISR em páginas de produto para melhor performance"
fi

# Verificar dynamic imports
if grep -r "next/dynamic" app/**/*.tsx 2>/dev/null | wc -l | grep -v "0" > /dev/null; then
    echo -e "4. ${GREEN}✅ Dynamic imports sendo usados${NC}"
else
    echo -e "4. ${YELLOW}⚠️  Dynamic imports não encontrados${NC}"
    echo "   Use 'next/dynamic' para lazy loading de componentes pesados"
fi

echo ""
echo "================================================"
echo "✅ Análise concluída!"
echo ""
echo "Para análise detalhada, execute:"
echo "  ANALYZE=true npm run build"
echo ""
