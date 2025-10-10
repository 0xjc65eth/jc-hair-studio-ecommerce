#!/bin/bash

# JC Hair Studio - Monitoramento GSC em Background
# Executa monitoramento a cada 3 minutos em background e salva logs

LOG_FILE="logs/gsc-monitor-$(date +%Y%m%d-%H%M%S).log"
MONITOR_SCRIPT="./monitor-gsc-auto.sh"

# Criar diretório de logs se não existir
mkdir -p logs

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║     🔄 MONITORAMENTO GSC - INICIADO EM BACKGROUND           ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "⏰ Início: $(date '+%Y-%m-%d %H:%M:%S')"
echo "📁 Log: $LOG_FILE"
echo "🔄 Intervalo: 3 minutos"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Monitoramento em execução..."
echo ""
echo "📊 Para ver o progresso em tempo real:"
echo "   tail -f $LOG_FILE"
echo ""
echo "⏹️  Para parar o monitoramento:"
echo "   pkill -f monitor-gsc-auto.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Executar em background
nohup $MONITOR_SCRIPT > "$LOG_FILE" 2>&1 &

MONITOR_PID=$!

echo "✅ Processo iniciado (PID: $MONITOR_PID)"
echo ""
echo "📋 COMANDOS ÚTEIS:"
echo ""
echo "   # Ver log em tempo real"
echo "   tail -f $LOG_FILE"
echo ""
echo "   # Ver últimas 20 linhas"
echo "   tail -20 $LOG_FILE"
echo ""
echo "   # Parar monitoramento"
echo "   kill $MONITOR_PID"
echo ""
