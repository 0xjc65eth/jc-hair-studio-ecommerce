#!/bin/bash

# Script para processar URLs do Google Drive em lote
# Criado para converter mais de 100 URLs para formatos diretos acessíveis

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar ajuda
show_help() {
    echo "Uso: $0 [OPÇÕES] [ARQUIVO_URLS]"
    echo ""
    echo "Processa URLs do Google Drive e converte para formatos diretos"
    echo ""
    echo "OPÇÕES:"
    echo "  -h, --help              Mostra esta ajuda"
    echo "  -f, --format FORMAT     Formato de saída (view|download|thumbnail) [padrão: view]"
    echo "  -o, --output ARQUIVO    Arquivo de saída [padrão: drive_urls_converted.csv]"
    echo "  -t, --test              Testa acessibilidade das URLs convertidas"
    echo "  -j, --json              Salva também em formato JSON"
    echo "  -v, --verbose           Mostra mais detalhes durante o processamento"
    echo ""
    echo "ARQUIVO_URLS: Arquivo de texto com uma URL por linha"
    echo "              Se não fornecido, lê URLs do stdin"
    echo ""
    echo "Exemplos:"
    echo "  $0 urls.txt"
    echo "  $0 -f thumbnail -t urls.txt"
    echo "  echo 'https://drive.google.com/file/d/ABC123/view' | $0"
    echo "  $0 -f download -o resultados.csv -j urls.txt"
}

# Função para extrair File ID de uma URL
extract_file_id() {
    local url="$1"
    echo "$url" | grep -oE '[a-zA-Z0-9_-]{25,}' | head -1
}

# Função para converter URL para formato direto
convert_url() {
    local original_url="$1"
    local format="$2"
    local file_id
    local direct_url

    file_id=$(extract_file_id "$original_url")

    if [ -z "$file_id" ]; then
        echo "ERROR: Não foi possível extrair File ID de: $original_url"
        return 1
    fi

    case "$format" in
        "view")
            direct_url="https://drive.google.com/uc?id=$file_id"
            ;;
        "download")
            direct_url="https://drive.google.com/uc?export=download&id=$file_id"
            ;;
        "thumbnail")
            direct_url="https://lh3.googleusercontent.com/d/$file_id"
            ;;
        "thumbnail_600")
            direct_url="https://lh3.googleusercontent.com/d/$file_id=w600-h600"
            ;;
        "preview")
            direct_url="https://drive.google.com/thumbnail?id=$file_id"
            ;;
        *)
            echo "ERROR: Formato '$format' não suportado"
            return 1
            ;;
    esac

    echo "$direct_url"
}

# Função para testar acessibilidade de uma URL
test_accessibility() {
    local url="$1"
    local http_code

    http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" || echo "000")

    if [ "$http_code" = "200" ]; then
        return 0
    else
        return 1
    fi
}

# Variáveis padrão
FORMAT="view"
OUTPUT_FILE="drive_urls_converted.csv"
INPUT_FILE=""
TEST_ACCESSIBILITY=false
SAVE_JSON=false
VERBOSE=false

# Parse dos argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -f|--format)
            FORMAT="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -t|--test)
            TEST_ACCESSIBILITY=true
            shift
            ;;
        -j|--json)
            SAVE_JSON=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -*)
            echo "Opção desconhecida: $1"
            show_help
            exit 1
            ;;
        *)
            INPUT_FILE="$1"
            shift
            ;;
    esac
done

# Função para log verbose
log_verbose() {
    if [ "$VERBOSE" = true ]; then
        echo -e "${BLUE}[INFO]${NC} $1"
    fi
}

# Função principal
main() {
    local urls=()
    local total_urls=0
    local successful=0
    local failed=0
    local accessible=0
    local inaccessible=0

    echo -e "${GREEN}=== CONVERSOR DE URLs DO GOOGLE DRIVE ===${NC}"
    echo ""

    # Lê URLs do arquivo ou stdin
    if [ -n "$INPUT_FILE" ]; then
        if [ ! -f "$INPUT_FILE" ]; then
            echo -e "${RED}ERROR: Arquivo '$INPUT_FILE' não encontrado${NC}"
            exit 1
        fi
        log_verbose "Lendo URLs do arquivo: $INPUT_FILE"
        while IFS= read -r line; do
            urls+=("$line")
        done < "$INPUT_FILE"
    else
        log_verbose "Lendo URLs do stdin..."
        while IFS= read -r line; do
            urls+=("$line")
        done
    fi

    total_urls=${#urls[@]}

    if [ $total_urls -eq 0 ]; then
        echo -e "${RED}ERROR: Nenhuma URL fornecida${NC}"
        exit 1
    fi

    echo "Total de URLs a processar: $total_urls"
    echo "Formato de saída: $FORMAT"
    echo "Arquivo de saída: $OUTPUT_FILE"
    echo ""

    # Cria cabeçalho do CSV
    echo "original_url,file_id,direct_url,format,success,error,accessible" > "$OUTPUT_FILE"

    # Processa cada URL
    for i in "${!urls[@]}"; do
        local url="${urls[$i]}"
        local progress=$((i + 1))
        local file_id=""
        local direct_url=""
        local error=""
        local accessible_status=""

        echo -ne "\rProcessando URL $progress/$total_urls..."

        # Remove espaços em branco
        url=$(echo "$url" | tr -d '[:space:]')

        # Pula linhas vazias
        if [ -z "$url" ]; then
            continue
        fi

        # Converte URL
        if direct_url=$(convert_url "$url" "$FORMAT" 2>/dev/null); then
            file_id=$(extract_file_id "$url")
            ((successful++))

            # Testa acessibilidade se solicitado
            if [ "$TEST_ACCESSIBILITY" = true ]; then
                if test_accessibility "$direct_url"; then
                    accessible_status="true"
                    ((accessible++))
                else
                    accessible_status="false"
                    ((inaccessible++))
                fi
            fi

            # Salva no CSV
            echo "\"$url\",\"$file_id\",\"$direct_url\",\"$FORMAT\",\"true\",\"\",\"$accessible_status\"" >> "$OUTPUT_FILE"

            log_verbose "✓ Convertido: $url -> $direct_url"
        else
            error="Falha na conversão"
            ((failed++))

            # Salva erro no CSV
            echo "\"$url\",\"\",\"\",\"$FORMAT\",\"false\",\"$error\",\"\"" >> "$OUTPUT_FILE"

            log_verbose "✗ Falha: $url"
        fi
    done

    echo "" # Nova linha após o progress

    # Mostra resumo
    echo ""
    echo -e "${GREEN}=== RESUMO ===${NC}"
    echo "Total processadas: $total_urls"
    echo "Conversões bem-sucedidas: $successful"
    echo "Conversões falharam: $failed"

    if [ "$TEST_ACCESSIBILITY" = true ]; then
        echo "URLs acessíveis: $accessible"
        echo "URLs inacessíveis: $inaccessible"
    fi

    echo ""
    echo "Resultados salvos em: $OUTPUT_FILE"

    # Salva em JSON se solicitado
    if [ "$SAVE_JSON" = true ]; then
        local json_file="${OUTPUT_FILE%.*}.json"
        python3 -c "
import csv
import json

# Lê CSV e converte para JSON
results = {'successful': [], 'failed': [], 'summary': {}}

with open('$OUTPUT_FILE', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['success'] == 'true':
            results['successful'].append(row)
        else:
            results['failed'].append(row)

results['summary'] = {
    'total': $total_urls,
    'successful': $successful,
    'failed': $failed,
    'accessible': $accessible,
    'inaccessible': $inaccessible
}

with open('$json_file', 'w') as f:
    json.dump(results, f, indent=2)

print('JSON salvo em: $json_file')
"
    fi

    # Mostra algumas URLs convertidas como exemplo
    if [ $successful -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}Exemplos de URLs convertidas:${NC}"
        head -6 "$OUTPUT_FILE" | tail -5 | while IFS=',' read -r orig file_id direct format success error accessible; do
            # Remove aspas
            orig=$(echo "$orig" | tr -d '"')
            direct=$(echo "$direct" | tr -d '"')
            echo "  $orig"
            echo "  -> $direct"
            echo ""
        done
    fi
}

# Executa função principal
main

echo -e "${GREEN}Processamento concluído!${NC}"