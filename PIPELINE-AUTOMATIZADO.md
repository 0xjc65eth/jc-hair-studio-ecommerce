# 🚀 Pipeline Automatizado de Testes - JC Hair Studio

## 📋 Visão Geral

Este documento descreve o pipeline automatizado completo para testes contínuos do e-commerce JC Hair Studio, incluindo:

- ✅ Testes de carrinho e checkout (Stripe + Crypto)
- ✅ Testes de newsletter e emails (SendGrid)
- ✅ Testes da área do cliente
- ✅ Validação de qualidade de código
- ✅ Sistema multi-agente paralelo
- ✅ Integração com GitHub Actions CI/CD

## 🛠️ Estrutura do Pipeline

### 1. Local (Desenvolvimento)

#### Hook Pre-Push
- **Localização**: `.husky/pre-push`
- **Script**: `scripts/prepush.sh`
- **Executa**: ESLint, TypeScript, testes unitários, integração e E2E críticos

#### Loop Contínuo
```bash
# Executar testes em loop (até Ctrl+C)
npm run test:loop

# Multi-agente paralelo
npm run test:agents

# Multi-agente em loop
npm run test:agents --loop
```

### 2. Docker (Ambiente Isolado)

#### Subir ambiente completo
```bash
# Subir todos os serviços
docker-compose up -d

# Apenas aplicação e banco
docker-compose up web mongo mailhog

# Executar testes dentro do container
docker-compose run test-runner

# Multi-agente em container
docker-compose run multi-agent-tests
```

#### Serviços Disponíveis
- **App**: http://localhost:3001
- **MongoDB UI**: http://localhost:8081 (admin/admin)
- **MailHog**: http://localhost:8025 (emails capturados)
- **Redis**: localhost:6379

### 3. CI/CD (GitHub Actions)

- **Trigger**: Push/PR para `main` ou `develop`
- **Jobs**: Quality → Integration → Build → E2E → Deploy
- **Deploy**: Automático para Vercel (apenas branch `main`)

## 📝 Scripts Disponíveis

### Testes Individuais
```bash
npm run test:cart         # Carrinho e checkout
npm run test:newsletter   # Newsletter
npm run test:account      # Área do cliente
npm run test:email        # Sistema de emails
npm run test:unit         # Testes unitários
npm run test:integration  # Testes de integração
```

### Testes Combinados
```bash
npm run test:local        # Todos os testes locais
npm run test:pipeline     # Pipeline completo
npm run test:all          # Incluindo performance
```

### Testes Especiais
```bash
npm run test:e2e          # Playwright E2E
npm run test:e2e:headed   # Com interface visual
npm run test:e2e:ui       # Interface do Playwright
```

## 🤖 Sistema Multi-Agente

### 8 Agentes Especializados

1. **🛒 Cart Agent** - Testa carrinho
2. **💳 Checkout Agent** - Testa checkout e pagamentos
3. **📧 Newsletter Agent** - Testa newsletter
4. **👤 Account Agent** - Testa área do cliente
5. **📮 Email Agent** - Testa SendGrid
6. **🔧 Integration Agent** - Testa integrações
7. **🧪 Unit Test Agent** - Testa unidades
8. **📝 Code Quality Agent** - Testa qualidade

### Uso
```bash
# Executar todos os agentes uma vez
npm run test:agents

# Executar em loop contínuo
npm run test:agents --loop

# Docker
docker-compose run multi-agent-tests
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` com:
```env
# Banco de dados
DATABASE_URL=mongodb://localhost:27017/jc_hair_studio

# Auth
NEXTAUTH_SECRET=seu-secret-aqui
NEXTAUTH_URL=http://localhost:3001
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

# Pagamentos
STRIPE_SECRET_KEY=sk_test_sua-chave-stripe
STRIPE_WEBHOOK_SECRET=whsec_seu-webhook-secret

# Emails
SENDGRID_API_KEY=SG.sua-chave-sendgrid
FROM_EMAIL=orders@jchairstudios62.xyz
SUPPORT_EMAIL=suporte@jchairstudios62.xyz
```

### GitHub Secrets

Configure no GitHub (Settings → Secrets):
```
SENDGRID_API_KEY
STRIPE_SECRET_KEY
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

## 🚨 Validações de Segurança

### Hook Pre-Push Executa
1. ✅ ESLint (qualidade de código)
2. ✅ TypeScript check (tipos)
3. ✅ Prettier (formatação)
4. ✅ Testes unitários
5. ✅ Testes de integração
6. ✅ Build de produção
7. ✅ Testes E2E críticos (se servidor rodando)
8. ✅ Sistema de emails

### O Push é BLOQUEADO se
- ❌ Lint falhar
- ❌ Tipos TypeScript incorretos
- ❌ Testes unitários falharem
- ❌ Testes de integração falharem
- ❌ Build falhar
- ❌ Testes E2E críticos falharem

## 🎯 Cenários de Teste

### E2E (End-to-End)

#### Carrinho & Checkout
- ✅ Adicionar produto ao carrinho
- ✅ Visualizar carrinho
- ✅ Checkout com Stripe (cartão teste)
- ✅ Checkout com Bitcoin
- ✅ Checkout com Ethereum

#### Newsletter
- ✅ Inscrição com email válido
- ✅ Validação de email inválido
- ✅ Newsletter no rodapé

#### Área do Cliente
- ✅ Página de login
- ✅ Login simulado
- ✅ Navegação entre seções
- ✅ Histórico de pedidos
- ✅ Gerenciar endereços
- ✅ Editar perfil

### Integração

#### Emails
- ✅ Envio via SendGrid API
- ✅ Email de confirmação de pedido
- ✅ Newsletter via API
- ✅ Recuperação de senha
- ✅ Configuração do SendGrid

## 🚀 Como Usar

### 1. Primeira Configuração
```bash
# Instalar dependências
npm install

# Configurar Husky
npm run prepare

# Configurar Playwright
npx playwright install
```

### 2. Desenvolvimento Local
```bash
# Iniciar aplicação
npm run dev

# Em outra aba: executar testes em loop
npm run test:loop

# Ou multi-agente
npm run test:agents
```

### 3. Docker (Recomendado)
```bash
# Subir ambiente completo
docker-compose up -d

# Ver logs dos testes
docker-compose logs -f test-runner

# Ver logs dos agentes
docker-compose logs -f multi-agent-tests
```

### 4. Verificar Pipeline Antes do Push
```bash
# Executar validação completa
npm run test:pipeline

# Se tudo passou, pode fazer push
git push origin main
```

## 📊 Monitoramento

### Logs em Tempo Real
```bash
# Docker
docker-compose logs -f test-runner
docker-compose logs -f multi-agent-tests

# Local
npm run test:loop    # Mostra resultados a cada 30s
npm run test:agents  # Mostra resultados de 8 agentes
```

### Interface Web
- **MailHog**: http://localhost:8025 (emails capturados)
- **MongoDB**: http://localhost:8081 (dados do banco)
- **Playwright UI**: `npm run test:e2e:ui`

## 🔄 Fluxo Completo

### Desenvolvimento
1. Codificar feature
2. `npm run test:loop` em background
3. Corrigir erros em tempo real
4. `git commit` (sem validação)
5. `git push` (com validação completa via Husky)

### CI/CD
1. Push para GitHub
2. GitHub Actions executa pipeline
3. Se tudo passar: deploy automático
4. Notificação de sucesso/falha

## 📞 Suporte

Se algo não funcionar:

1. **Verificar logs**: `docker-compose logs serviço`
2. **Recriar containers**: `docker-compose down && docker-compose up --build`
3. **Limpar cache**: `npm run clean && npm install`
4. **Verificar .env**: Todas as variáveis configuradas?

## 🎉 Resultado

Com este pipeline, você tem:
- ✅ **Zero bugs em produção** (testes impedem push quebrado)
- ✅ **Feedback imediato** (loop contínuo detecta problemas)
- ✅ **Deploy confiável** (CI/CD com múltiplas validações)
- ✅ **Cobertura completa** (8 agentes testam tudo)
- ✅ **Ambiente isolado** (Docker reproduz produção)

**🚀 Seu e-commerce está blindado contra falhas!**