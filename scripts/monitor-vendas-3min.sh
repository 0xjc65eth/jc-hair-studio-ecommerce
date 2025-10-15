#!/bin/bash

# ╔══════════════════════════════════════════════════════════════════════════════╗
# ║                 📊 MONITOR DE VENDAS E INDEXAÇÃO - 3 MINUTOS                  ║
# ╚══════════════════════════════════════════════════════════════════════════════╝

# Configurações
SITE_URL="https://jchairstudios62.xyz"
INTERVAL=180 # 3 minutos em segundos
LOG_DIR="/Users/juliocesar/Jc-hair-studio's 62  ecommerce/jc-hair-studio/logs/monitoring"
DB_URI="mongodb+srv://juliocesar62:juliocesar65@jchaircluster.o078ehn.mongodb.net/jc-hair-studio-ecommerce?retryWrites=true&w=majority&appName=JCHairCluster"

# Criar diretório de logs
mkdir -p "$LOG_DIR"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Contador de ciclos
CYCLE=0
LAST_ORDER_COUNT=0
LAST_INDEX_COUNT=0

# Função para som de notificação (macOS)
play_sound() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        case $1 in
            "success") afplay /System/Library/Sounds/Glass.aiff 2>/dev/null & ;;
            "alert") afplay /System/Library/Sounds/Ping.aiff 2>/dev/null & ;;
            "warning") afplay /System/Library/Sounds/Tink.aiff 2>/dev/null & ;;
            "critical") afplay /System/Library/Sounds/Sosumi.aiff 2>/dev/null & ;;
        esac
    fi
}

# Função para notificação do sistema (macOS)
send_notification() {
    local title="$1"
    local message="$2"
    local sound="${3:-Glass}"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "display notification \"$message\" with title \"$title\" sound name \"$sound\"" 2>/dev/null
    fi
}

# Função para verificar indexação no Google
check_google_indexation() {
    echo -e "${CYAN}🔍 Verificando Indexação no Google...${NC}"

    # Buscar por site:dominio
    local search_result=$(curl -s -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" \
        "https://www.google.com/search?q=site:jchairstudios62.xyz" 2>/dev/null)

    # Contar resultados
    local result_count=0
    if echo "$search_result" | grep -q "jchairstudios62.xyz"; then
        result_count=$(echo "$search_result" | grep -o "jchairstudios62.xyz" | wc -l)
    fi

    # Verificar páginas específicas
    local pages_indexed=0
    local critical_pages=(
        ""
        "/produtos"
        "/mega-hair"
        "/mega-hair-brasileiro"
        "/tratamentos-capilares"
    )

    for page in "${critical_pages[@]}"; do
        local check_url="https://www.google.com/search?q=site:jchairstudios62.xyz${page}"
        if curl -s -A "Mozilla/5.0" "$check_url" 2>/dev/null | grep -q "jchairstudios62.xyz${page}"; then
            ((pages_indexed++))
        fi
    done

    echo -e "${GREEN}  ✓ Páginas indexadas: ${BOLD}$pages_indexed/${#critical_pages[@]}${NC}"
    echo -e "${GREEN}  ✓ Menções totais: ${BOLD}$result_count${NC}"

    # Verificar cache do Google
    local cache_check=$(curl -s "https://webcache.googleusercontent.com/search?q=cache:${SITE_URL}" 2>/dev/null | head -100)
    if echo "$cache_check" | grep -q "jchairstudios62"; then
        echo -e "${GREEN}  ✓ Site em cache do Google!${NC}"
        GOOGLE_CACHED=1
    else
        echo -e "${YELLOW}  ⏳ Aguardando cache do Google...${NC}"
        GOOGLE_CACHED=0
    fi

    # Alerta se houve mudança
    if [ "$pages_indexed" -gt "$LAST_INDEX_COUNT" ]; then
        play_sound "success"
        send_notification "🎯 INDEXAÇÃO AUMENTOU!" "Agora temos $pages_indexed páginas indexadas!" "Glass"
    fi
    LAST_INDEX_COUNT=$pages_indexed

    return $pages_indexed
}

# Função para verificar vendas REAIS do MongoDB
check_sales() {
    echo -e "${PURPLE}💰 Verificando Vendas REAIS...${NC}"

    # Buscar dados REAIS do MongoDB usando o script Node.js
    local sales_data=$(node /Users/juliocesar/Jc-hair-studio\'s\ 62\ \ ecommerce/jc-hair-studio/scripts/check-real-sales.js 2>/dev/null)

    if [ -z "$sales_data" ]; then
        echo -e "${RED}  ✗ Erro ao conectar com banco de dados${NC}"
        TOTAL_ORDERS=0
        TODAY_ORDERS=0
        ABANDONED_CARTS=0
        return
    fi

    # Parse do JSON retornado
    local success=$(echo "$sales_data" | grep -o '"success":[^,]*' | cut -d':' -f2)

    if [ "$success" == "true" ]; then
        TOTAL_ORDERS=$(echo "$sales_data" | grep -o '"totalOrders":[0-9]*' | cut -d':' -f2)
        TODAY_ORDERS=$(echo "$sales_data" | grep -o '"todayOrders":[0-9]*' | cut -d':' -f2)
        ABANDONED_CARTS=$(echo "$sales_data" | grep -o '"abandonedCarts":[0-9]*' | cut -d':' -f2)
        local today_value=$(echo "$sales_data" | grep -o '"todayValue":[0-9.]*' | cut -d':' -f2)

        # Exibir resultados
        if [ "$TOTAL_ORDERS" -eq 0 ]; then
            echo -e "${YELLOW}  ⏳ Nenhuma venda registrada ainda${NC}"
        else
            echo -e "${GREEN}  ✓ Total de pedidos: ${BOLD}$TOTAL_ORDERS${NC}"
        fi

        if [ "$TODAY_ORDERS" -eq 0 ]; then
            echo -e "${YELLOW}  ⏳ Nenhuma venda hoje${NC}"
        else
            echo -e "${GREEN}  ✓ Pedidos hoje: ${BOLD}$TODAY_ORDERS${NC}"
            echo -e "${GREEN}  ✓ Valor hoje: ${BOLD}€${today_value}${NC}"
        fi

        if [ "$ABANDONED_CARTS" -gt 0 ]; then
            echo -e "${YELLOW}  ⚠ Carrinhos abandonados: ${BOLD}$ABANDONED_CARTS${NC}"
        fi

        # Alerta de nova venda REAL
        if [ "$TOTAL_ORDERS" -gt "$LAST_ORDER_COUNT" ] && [ "$LAST_ORDER_COUNT" -ne -1 ]; then
            local new_sales=$((TOTAL_ORDERS - LAST_ORDER_COUNT))
            play_sound "success"
            send_notification "💰 VENDA REAL DETECTADA!" "🎉 $new_sales nova(s) venda(s) confirmada(s)!" "Glass"
            echo -e "${GREEN}${BOLD}  🎉 NOVA VENDA REAL DETECTADA!${NC}"
        fi
    else
        echo -e "${RED}  ✗ Erro ao buscar vendas${NC}"
        TOTAL_ORDERS=0
        TODAY_ORDERS=0
        ABANDONED_CARTS=0
    fi

    # Atualizar contador apenas se não for primeira execução
    if [ "$LAST_ORDER_COUNT" -eq 0 ] && [ "$CYCLE" -eq 1 ]; then
        LAST_ORDER_COUNT=$TOTAL_ORDERS  # Primeira execução, apenas salvar
    else
        LAST_ORDER_COUNT=$TOTAL_ORDERS
    fi
}

# Função para verificar status do site
check_site_status() {
    echo -e "${BLUE}🌐 Verificando Status do Site...${NC}"

    # Verificar se site está online
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")

    if [ "$http_status" == "200" ]; then
        echo -e "${GREEN}  ✓ Site online (HTTP $http_status)${NC}"
        SITE_ONLINE=1
    else
        echo -e "${RED}  ✗ Site com problema (HTTP $http_status)${NC}"
        SITE_ONLINE=0
        play_sound "critical"
        send_notification "⚠️ ALERTA CRÍTICO!" "Site offline ou com problemas!" "Sosumi"
    fi

    # Verificar tempo de resposta
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL")
    local response_ms=$(echo "$response_time * 1000" | bc 2>/dev/null || echo "N/A")
    echo -e "${GREEN}  ✓ Tempo de resposta: ${BOLD}${response_ms}ms${NC}"
}

# Função para verificar processos de indexação rodando
check_indexation_processes() {
    echo -e "${YELLOW}⚙️ Processos de Indexação Ativos...${NC}"

    local nuclear_running=$(ps aux | grep -E "nuclear-indexer" | grep -v grep | wc -l)
    local ultimate_running=$(ps aux | grep -E "ultimate-indexer" | grep -v grep | wc -l)
    local crawler_processes=$(ps aux | grep -E "wget|curl" | grep "jchairstudios62" | grep -v grep | wc -l)

    if [ "$nuclear_running" -gt 0 ]; then
        echo -e "${GREEN}  ✓ Nuclear Indexer rodando${NC}"
    fi

    if [ "$ultimate_running" -gt 0 ]; then
        echo -e "${GREEN}  ✓ Ultimate Indexer rodando${NC}"
    fi

    if [ "$crawler_processes" -gt 0 ]; then
        echo -e "${GREEN}  ✓ $crawler_processes crawlers ativos${NC}"
    fi

    if [ "$nuclear_running" -eq 0 ] && [ "$ultimate_running" -eq 0 ] && [ "$crawler_processes" -eq 0 ]; then
        echo -e "${YELLOW}  ⚠ Nenhum processo de indexação ativo${NC}"
    fi
}

# Função principal de monitoramento
monitor_loop() {
    # Notificação inicial
    send_notification "🚀 MONITOR INICIADO" "Verificação a cada 3 minutos" "Ping"
    play_sound "alert"

    while true; do
        ((CYCLE++))
        clear

        # Cabeçalho com arte ASCII
        echo "╔══════════════════════════════════════════════════════════════════════════════╗"
        echo "║              🔔 MONITOR AUTOMÁTICO - CICLO #$CYCLE - $(date '+%H:%M:%S')              ║"
        echo "╚══════════════════════════════════════════════════════════════════════════════╝"
        echo ""

        # Executar verificações
        check_site_status
        echo ""
        check_google_indexation
        echo ""
        check_sales
        echo ""
        check_indexation_processes
        echo ""

        # Estatísticas resumidas com cores
        echo "════════════════════════════════════════════════════════════════════════════════"
        echo -e "${BOLD}📊 DASHBOARD:${NC}"
        echo "────────────────────────────────────────────────────────────────────────────────"

        # Status com ícones coloridos
        if [ "$SITE_ONLINE" == "1" ]; then
            echo -e "  🟢 Site: ${GREEN}ONLINE${NC}"
        else
            echo -e "  🔴 Site: ${RED}OFFLINE${NC}"
        fi

        if [ "$GOOGLE_CACHED" == "1" ]; then
            echo -e "  🟢 Cache Google: ${GREEN}SIM${NC}"
        else
            echo -e "  🟡 Cache Google: ${YELLOW}AGUARDANDO${NC}"
        fi

        echo -e "  📈 Páginas Indexadas: ${BOLD}$LAST_INDEX_COUNT${NC}"
        echo -e "  💰 Vendas Total: ${BOLD}$TOTAL_ORDERS${NC}"
        echo -e "  📅 Vendas Hoje: ${BOLD}$TODAY_ORDERS${NC}"

        if [ "$ABANDONED_CARTS" -gt 0 ]; then
            echo -e "  🛒 Carrinhos Abandonados: ${YELLOW}$ABANDONED_CARTS${NC}"
        fi

        echo "════════════════════════════════════════════════════════════════════════════════"

        # Salvar log
        {
            echo "[$CYCLE] $(date '+%Y-%m-%d %H:%M:%S')"
            echo "Site: $SITE_ONLINE | Cache: $GOOGLE_CACHED | Indexadas: $LAST_INDEX_COUNT"
            echo "Vendas Total: $TOTAL_ORDERS | Hoje: $TODAY_ORDERS | Abandonados: $ABANDONED_CARTS"
            echo "---"
        } >> "$LOG_DIR/monitor-$(date '+%Y%m%d').log"

        # Contador regressivo visual
        echo ""
        echo -e "${CYAN}⏰ Próxima verificação em:${NC}"
        for i in {180..1}; do
            local mins=$((i/60))
            local secs=$((i%60))
            printf "\r  ${BOLD}%02d:%02d${NC} " $mins $secs

            # A cada 30 segundos, mostrar mensagem motivacional
            if [ $((i % 30)) -eq 0 ] && [ $i -lt 180 ]; then
                local messages=(
                    "🚀 Indexação em progresso..."
                    "💪 Trabalhando para você..."
                    "📈 Monitorando vendas..."
                    "🎯 Foco no sucesso..."
                    "⚡ Sistema operacional..."
                )
                local msg=${messages[$((RANDOM % ${#messages[@]}))]}
                echo -ne " ${YELLOW}$msg${NC}"
            fi

            sleep 1
        done
    done
}

# Tratamento de sinal para saída limpa
trap cleanup EXIT INT TERM

cleanup() {
    echo ""
    echo "════════════════════════════════════════════════════════════════════════════════"
    echo -e "${YELLOW}🛑 Monitor encerrado${NC}"
    echo -e "📊 Total de ciclos: ${BOLD}$CYCLE${NC}"
    echo -e "📁 Logs salvos em: ${BOLD}$LOG_DIR${NC}"
    echo ""
    send_notification "Monitor Encerrado" "Executado $CYCLE ciclos de verificação" "Tink"
    play_sound "warning"
    exit 0
}

# Iniciar monitoramento
echo -e "${GREEN}${BOLD}"
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                         🚀 INICIANDO MONITOR AUTOMÁTICO                       ║"
echo "║                          Verificação a cada 3 minutos                         ║"
echo "║                            Pressione CTRL+C para parar                        ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
sleep 2

monitor_loop