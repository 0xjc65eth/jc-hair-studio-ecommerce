#!/bin/bash
set -e

echo "🔍 Pipeline de Validação Pré-Push - JC Hair Studio"
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log com cores
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ===========================================
# 1. Verificação de Qualidade de Código
# ===========================================
log_info "Verificando qualidade do código..."

echo "📝 Executando ESLint..."
if npm run lint; then
    log_success "ESLint passou"
else
    log_error "ESLint falhou - corrija os erros antes do push"
    exit 1
fi

echo "🔤 Verificando TypeScript..."
if npm run type-check; then
    log_success "TypeScript check passou"
else
    log_error "TypeScript check falhou - corrija os tipos antes do push"
    exit 1
fi

echo "💅 Verificando formatação com Prettier..."
if npm run format:check; then
    log_success "Formatação está correta"
else
    log_warning "Formatação inconsistente - executando auto-fix..."
    npm run format
    log_success "Código formatado automaticamente"
fi

# ===========================================
# 2. Testes Unitários
# ===========================================
log_info "Executando testes unitários..."
if npm run test:unit; then
    log_success "Testes unitários passaram"
else
    log_error "Testes unitários falharam"
    exit 1
fi

# ===========================================
# 3. Testes de Integração
# ===========================================
log_info "Executando testes de integração..."
if npm run test:integration; then
    log_success "Testes de integração passaram"
else
    log_error "Testes de integração falharam"
    exit 1
fi

# ===========================================
# 4. Teste de Build
# ===========================================
log_info "Testando build de produção..."
if npm run build; then
    log_success "Build de produção bem-sucedido"
else
    log_error "Build falhou - corrija antes do push"
    exit 1
fi

# ===========================================
# 5. Testes E2E Críticos (apenas carrinho)
# ===========================================
log_info "Executando testes E2E críticos..."

# Verificar se servidor está rodando
if curl -f http://localhost:3001 >/dev/null 2>&1; then
    log_info "Servidor detectado em localhost:3001"

    if npm run test:cart; then
        log_success "Testes de carrinho/checkout passaram"
    else
        log_error "Testes de carrinho/checkout falharam"
        exit 1
    fi
else
    log_warning "Servidor não detectado - pulando testes E2E"
    log_warning "Execute 'npm run dev' em outra aba para testes completos"
fi

# ===========================================
# 6. Teste de Email (opcional)
# ===========================================
log_info "Testando funcionalidade de emails..."
if npm run test:email; then
    log_success "Sistema de emails funcionando"
else
    log_warning "Sistema de emails com problemas - verificar configuração SendGrid"
fi

# ===========================================
# Final
# ===========================================
echo ""
echo "🎉 Todas as validações passaram!"
echo "✨ Push liberado com segurança"
echo "=================================================="

exit 0