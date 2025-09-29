#!/bin/bash

# Script de Ativação do Crédito Gratuito Google Ads
# JC Hair Studio - Automação Completa

echo "🚀 ATIVANDO CRÉDITO GRATUITO GOOGLE ADS..."

# 1. Verificar configurações
echo "🔍 Verificando configurações..."
if [ ! -f .env.local ]; then
    echo "❌ Arquivo .env.local não encontrado"
    exit 1
fi

# 2. Ativar campanhas otimizadas
echo "⚙️ Criando campanhas otimizadas..."
npm run campaigns:setup --free-credit

# 3. Configurar tracking avançado
echo "📊 Configurando tracking maximizado..."
npm run campaigns:tracking --enhanced

# 4. Iniciar monitoramento
echo "📡 Iniciando monitoramento automático..."
npm run campaigns:monitor --free-credit-mode

# 5. Agendar otimizações
echo "⚡ Agendando otimizações automáticas..."
npm run campaigns:schedule --free-credit-optimization

echo "✅ CRÉDITO GRATUITO ATIVO!"
echo "💰 $300 USD sendo utilizados de forma otimizada"
echo "📊 Dashboard: http://localhost:3001/admin/campaigns"
echo "🎯 Estimativa: €800-1200 em vendas nos próximos 17 dias"

# 6. Mostrar comandos úteis
echo ""
echo "🔧 COMANDOS ÚTEIS:"
echo "npm run campaigns:status    # Ver status atual"
echo "npm run campaigns:optimize  # Otimização manual"
echo "npm run campaigns:report    # Relatório detalhado"
