#!/bin/bash

echo "🔧 Configuração Gmail OAuth para JC Hair Studio"
echo "=============================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Informações do projeto
PROJECT_ID="jc-hair-studio-gmail"
APP_NAME="JC Hair Studio E-commerce"
SUPPORT_EMAIL="juliocesarurss65@gmail.com"

echo -e "${BLUE}📋 Verificando configuração atual...${NC}"
echo "Projeto: $PROJECT_ID"
echo "Email de suporte: $SUPPORT_EMAIL"
echo ""

# Verificar se o projeto está selecionado
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠️  Configurando projeto...${NC}"
    gcloud config set project $PROJECT_ID
fi

echo -e "${GREEN}✅ Projeto configurado: $PROJECT_ID${NC}"

# URLs importantes
PRODUCTION_URL="https://jc-hair-studio.vercel.app"
LOCAL_URL="http://localhost:3001"

echo ""
echo -e "${BLUE}🌐 URLs de redirecionamento configuradas:${NC}"
echo "- Produção: $PRODUCTION_URL"
echo "- Local: $LOCAL_URL"

echo ""
echo -e "${YELLOW}📝 Próximos passos MANUAIS necessários:${NC}"
echo ""
echo "1. Acesse: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo ""
echo "2. Configure a Tela de Consentimento OAuth:"
echo "   - Clique em 'CONFIGURAR TELA DE CONSENTIMENTO'"
echo "   - Escolha 'Externa' (para permitir qualquer usuário Gmail)"
echo "   - Preencha os campos obrigatórios:"
echo "     * Nome do aplicativo: $APP_NAME"
echo "     * Email de suporte do usuário: $SUPPORT_EMAIL"
echo "     * Email de contato do desenvolvedor: $SUPPORT_EMAIL"
echo "   - Salve e continue"
echo ""
echo "3. Crie Credenciais OAuth 2.0:"
echo "   - Clique em '+ CRIAR CREDENCIAIS'"
echo "   - Escolha 'ID do cliente OAuth 2.0'"
echo "   - Tipo de aplicativo: 'Aplicativo da Web'"
echo "   - Nome: 'JC Hair Studio Web Client'"
echo "   - URIs de redirecionamento autorizados:"
echo "     * $PRODUCTION_URL/api/auth/callback/google"
echo "     * $LOCAL_URL/api/auth/callback/google"
echo "   - Clique em 'CRIAR'"
echo ""
echo "4. Baixe o arquivo JSON das credenciais"
echo "   - Renomeie para 'google-credentials.json'"
echo "   - Coloque na pasta do projeto"
echo ""
echo "5. Configure as variáveis de ambiente no .env.local:"
echo "   GOOGLE_CLIENT_ID=seu_client_id_aqui"
echo "   GOOGLE_CLIENT_SECRET=seu_client_secret_aqui"
echo ""

# Criar template do .env
echo -e "${BLUE}📄 Criando template de variáveis de ambiente...${NC}"

ENV_TEMPLATE="# Google OAuth Configuration for Gmail Integration
# Get these values from Google Cloud Console > APIs & Credentials > OAuth 2.0 Client IDs
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Gmail API Configuration
GOOGLE_REDIRECT_URI_PROD=$PRODUCTION_URL/api/auth/callback/google
GOOGLE_REDIRECT_URI_LOCAL=$LOCAL_URL/api/auth/callback/google

# NextAuth Configuration
NEXTAUTH_URL_PROD=$PRODUCTION_URL
NEXTAUTH_URL_LOCAL=$LOCAL_URL
NEXTAUTH_SECRET=your_nextauth_secret_here

# Gmail Integration Settings
GMAIL_FROM_NAME=\"JC Hair Studio\"
GMAIL_FROM_EMAIL=\"$SUPPORT_EMAIL\"
"

echo "$ENV_TEMPLATE" > .env.google-setup

echo -e "${GREEN}✅ Template criado em .env.google-setup${NC}"
echo ""
echo -e "${YELLOW}🔗 Links úteis:${NC}"
echo "- Console Google Cloud: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo "- Documentação Gmail API: https://developers.google.com/gmail/api"
echo "- NextAuth Google Provider: https://next-auth.js.org/providers/google"
echo ""
echo -e "${GREEN}🎉 Setup básico concluído!${NC}"
echo -e "${YELLOW}⚠️  Complete os passos manuais acima para finalizar a configuração.${NC}"