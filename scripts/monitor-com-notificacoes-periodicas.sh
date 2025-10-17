#!/bin/bash

# MONITOR COM NOTIFICAÇÕES PERIÓDICAS - SEMPRE NOTIFICA O STATUS

SITE_URL="https://jchairstudios62.xyz"
INTERVAL=180 # 3 minutos
NOTIFY_EVERY=3 # Notificar a cada 3 ciclos (9 minutos)
LOG_DIR="/Users/juliocesar/Jc-hair-studio's 62  ecommerce/jc-hair-studio/logs/monitoring"
DB_URI="mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/jc-hair-studio-ecommerce?retryWrites=true&w=majority&appName=JCHairCluster"

mkdir -p "$LOG_DIR"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

# Contadores
CYCLE=0
LAST_ORDER_COUNT=0
LAST_INDEX_COUNT=0

# Função de notificação melhorada
send_notification() {
    local title="$1"
    local message="$2"
    local sound="${3:-Glass}"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "display notification \"$message\" with title \"$title\" sound name \"$sound\"" 2>/dev/null
    fi
}

# Função para verificar vendas REAIS
check_sales() {
    local sales_data=$(node /Users/juliocesar/Jc-hair-studio\'s\ 62\ \ ecommerce/jc-hair-studio/scripts/check-real-sales.js 2>/dev/null)

    if [ -z "$sales_data" ]; then
        TOTAL_ORDERS=0
        TODAY_ORDERS=0
        return
    fi

    local success=$(echo "$sales_data" | grep -o '"success":[^,]*' | cut -d':' -f2)
    if [ "$success" == "true" ]; then
        TOTAL_ORDERS=$(echo "$sales_data" | grep -o '"totalOrders":[0-9]*' | cut -d':' -f2)
        TODAY_ORDERS=$(echo "$sales_data" | grep -o '"todayOrders":[0-9]*' | cut -d':' -f2)

        # Notificar se houver nova venda
        if [ "$TOTAL_ORDERS" -gt "$LAST_ORDER_COUNT" ] && [ "$LAST_ORDER_COUNT" -ne 0 ]; then
            local new_sales=$((TOTAL_ORDERS - LAST_ORDER_COUNT))
            send_notification "💰 VENDA DETECTADA!" "🎉 $new_sales nova(s) venda(s)! Total: $TOTAL_ORDERS" "Glass"
            afplay /System/Library/Sounds/Glass.aiff 2>/dev/null &
        fi

        LAST_ORDER_COUNT=$TOTAL_ORDERS
    fi
}

# Função para verificar indexação
check_indexation() {
    local search_result=$(curl -s -A "Mozilla/5.0" "https://www.google.com/search?q=site:jchairstudios62.xyz" 2>/dev/null)

    PAGES_INDEXED=0
    local critical_pages=("" "/produtos" "/mega-hair" "/mega-hair-brasileiro" "/tratamentos-capilares")

    for page in "${critical_pages[@]}"; do
        if curl -s -A "Mozilla/5.0" "https://www.google.com/search?q=site:jchairstudios62.xyz${page}" 2>/dev/null | grep -q "jchairstudios62.xyz${page}"; then
            ((PAGES_INDEXED++))
        fi
    done

    # Cache do Google
    local cache_check=$(curl -s "https://webcache.googleusercontent.com/search?q=cache:${SITE_URL}" 2>/dev/null | head -100)
    if echo "$cache_check" | grep -q "jchairstudios62"; then
        GOOGLE_CACHED="SIM"
    else
        GOOGLE_CACHED="NÃO"
    fi

    # Notificar se indexação aumentou
    if [ "$PAGES_INDEXED" -gt "$LAST_INDEX_COUNT" ] && [ "$LAST_INDEX_COUNT" -ne 0 ]; then
        send_notification "📈 INDEXAÇÃO AUMENTOU!" "Agora: $PAGES_INDEXED páginas indexadas!" "Glass"
    fi

    LAST_INDEX_COUNT=$PAGES_INDEXED
}

# Função para verificar site
check_site() {
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL")
    RESPONSE_MS=$(echo "$RESPONSE_TIME * 1000" | bc 2>/dev/null || echo "0")

    if [ "$HTTP_STATUS" != "200" ]; then
        SITE_STATUS="OFFLINE"
        send_notification "⚠️ SITE OFFLINE!" "HTTP $HTTP_STATUS - Verificar urgente!" "Sosumi"
        afplay /System/Library/Sounds/Sosumi.aiff 2>/dev/null &
    else
        SITE_STATUS="ONLINE"
    fi
}

# Loop principal
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║          🔔 MONITOR COM NOTIFICAÇÕES PERIÓDICAS ATIVO               ║${NC}"
echo -e "${GREEN}${BOLD}║              Verificação: 3 min | Notificação: 9 min                ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════════════════╝${NC}"

# Notificação inicial
send_notification "🚀 Monitor Iniciado" "Notificações a cada 9 minutos + alertas de mudanças" "Ping"

while true; do
    ((CYCLE++))
    clear

    echo "╔════════════════════════════════════════════════════════════════════╗"
    echo "║         🔔 MONITOR - CICLO #$CYCLE - $(date '+%H:%M:%S')            ║"
    echo "╚════════════════════════════════════════════════════════════════════╝"
    echo ""

    # Executar verificações
    check_site
    check_indexation
    check_sales

    # Exibir status
    echo -e "${BLUE}📊 STATUS ATUAL:${NC}"
    echo "────────────────────────────────────────────────────────────────────"
    echo -e "  🌐 Site: ${GREEN}$SITE_STATUS${NC} (${RESPONSE_MS%.*}ms)"
    echo -e "  📈 Indexadas: ${BOLD}$PAGES_INDEXED/5${NC} páginas"
    echo -e "  🔍 Cache Google: ${BOLD}$GOOGLE_CACHED${NC}"
    echo -e "  💰 Vendas Total: ${BOLD}$TOTAL_ORDERS${NC}"
    echo -e "  📅 Vendas Hoje: ${BOLD}$TODAY_ORDERS${NC}"
    echo "────────────────────────────────────────────────────────────────────"

    # NOTIFICAÇÃO PERIÓDICA (a cada 9 minutos)
    if [ $((CYCLE % NOTIFY_EVERY)) -eq 0 ]; then
        local status_msg="Site: $SITE_STATUS
Indexadas: $PAGES_INDEXED/5
Cache: $GOOGLE_CACHED
Vendas: $TOTAL_ORDERS (Hoje: $TODAY_ORDERS)"

        send_notification "📊 Status Periódico #$CYCLE" "$status_msg" "Ping"
        echo -e "\n${YELLOW}🔔 Notificação periódica enviada!${NC}"
    fi

    # Salvar log
    {
        echo "[$CYCLE] $(date '+%Y-%m-%d %H:%M:%S')"
        echo "Site: $SITE_STATUS | Cache: $GOOGLE_CACHED | Indexadas: $PAGES_INDEXED"
        echo "Vendas: $TOTAL_ORDERS | Hoje: $TODAY_ORDERS"
        echo "---"
    } >> "$LOG_DIR/monitor-$(date '+%Y%m%d').log"

    # Contador regressivo
    echo -e "\n${CYAN}⏰ Próxima verificação em:${NC}"
    for i in {180..1}; do
        local mins=$((i/60))
        local secs=$((i%60))
        printf "\r  ${BOLD}%02d:%02d${NC} " $mins $secs

        # Mensagem a cada 30 segundos
        if [ $((i % 30)) -eq 0 ] && [ $i -lt 180 ]; then
            local next_notify=$((NOTIFY_EVERY - (CYCLE % NOTIFY_EVERY)))
            echo -ne " ${YELLOW}(Notificação em $next_notify ciclos)${NC}"
        fi

        sleep 1
    done
done