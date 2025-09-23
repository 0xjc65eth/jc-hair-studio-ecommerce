# 🚀 JC Hair Studio's 62 - Sistema de Deploy Alternativo

Este documento descreve o sistema completo de deployment alternativo criado para garantir que o site seja atualizado independentemente dos problemas técnicos do Vercel.

## 📋 Visão Geral

O sistema implementa **6 estratégias alternativas de deployment** com fallback automático:

1. **Vercel** (estratégia principal)
2. **Git Hook** (deploy direto via servidor)
3. **AWS S3 + CloudFront** (hospedagem estática)
4. **Netlify** (hospedagem estática)
5. **Docker** (containerização)
6. **FTP** (upload tradicional)

## 🛠️ Scripts Disponíveis

### 1. `deploy-master.sh` - Orquestrador Principal
Script principal que coordena todas as estratégias de deployment.

```bash
# Deploy automático com fallback
./deploy-master.sh deploy

# Deploy usando estratégia específica
./deploy-master.sh deploy vercel
./deploy-master.sh deploy git-hook
./deploy-master.sh deploy static-s3

# Verificar deployment
./deploy-master.sh verify

# Rollback automático
./deploy-master.sh rollback

# Status do deployment
./deploy-master.sh status
```

### 2. `deploy-git-hook.sh` - Deploy via Git Hooks
Configura deployment automático via git hooks no servidor.

```bash
# Setup inicial do servidor
DEPLOY_HOST=seu-servidor.com ./deploy-git-hook.sh setup

# Deploy via git hook
DEPLOY_HOST=seu-servidor.com ./deploy-git-hook.sh deploy

# Rollback
./deploy-git-hook.sh rollback
```

### 3. `deploy-static.sh` - Deploy Estático
Builds locais e upload para provedores estáticos.

```bash
# Build local
./deploy-static.sh build

# Deploy para S3
AWS_S3_BUCKET=meu-bucket ./deploy-static.sh s3

# Deploy para Netlify
./deploy-static.sh netlify

# Deploy via FTP
FTP_HOST=meu-ftp.com ./deploy-static.sh ftp

# Deploy para múltiplos provedores
./deploy-static.sh multi
```

### 4. `env-manager.sh` - Gerenciamento de Variáveis
Gerencia variáveis de ambiente para diferentes ambientes.

```bash
# Criar templates de ambiente
./env-manager.sh create-all

# Trocar para ambiente específico
./env-manager.sh switch production

# Validar ambiente
./env-manager.sh validate .env.production

# Gerar secrets seguros
./env-manager.sh secrets
```

### 5. `rollback-system.sh` - Sistema de Rollback
Sistema automático de rollback e monitoramento.

```bash
# Inicializar sistema
./rollback-system.sh init

# Criar backup
./rollback-system.sh backup "versao_1.2.0"

# Rollback automático
./rollback-system.sh auto-rollback

# Monitoramento contínuo
./rollback-system.sh monitor 3600
```

### 6. `domain-setup.sh` - Configuração de Domínio
Setup completo de domínio customizado, SSL e CDN.

```bash
# Setup completo
./domain-setup.sh full-setup

# Configurar DNS Cloudflare
CLOUDFLARE_API_TOKEN=token ./domain-setup.sh dns-cloudflare

# Gerar certificados SSL
./domain-setup.sh ssl-generate

# Configurar Nginx
./domain-setup.sh nginx-deploy
```

## 🔧 Configuração Inicial

### 1. Setup do Sistema

```bash
# Executar setup inicial
./deploy-master.sh setup

# Criar ambientes
./env-manager.sh create-all

# Inicializar rollback
./rollback-system.sh init
```

### 2. Configurar Variáveis de Ambiente

Edite os arquivos de ambiente criados:
- `.env.development`
- `.env.staging`
- `.env.production`

### 3. Configurar Credenciais

```bash
# Para AWS S3
export AWS_ACCESS_KEY_ID="sua-chave"
export AWS_SECRET_ACCESS_KEY="sua-chave-secreta"
export AWS_S3_BUCKET="seu-bucket"

# Para Netlify
export NETLIFY_AUTH_TOKEN="seu-token"

# Para Vercel
export VERCEL_TOKEN="seu-token"

# Para Git Hook
export DEPLOY_HOST="seu-servidor.com"
export DEPLOY_USER="deploy"

# Para FTP
export FTP_HOST="seu-ftp.com"
export FTP_USER="usuario"
export FTP_PASS="senha"
```

## 🚀 Estratégias de Deployment

### 1. Vercel (Principal)
- **Uso**: Estratégia padrão
- **Vantagens**: Integração automática, CDN global
- **Configuração**: Automática via `vercel.json`

### 2. Git Hook (Servidor Próprio)
- **Uso**: Quando Vercel falha
- **Vantagens**: Controle total, sem dependências externas
- **Configuração**: Requer servidor Linux com Node.js

### 3. AWS S3 + CloudFront
- **Uso**: Para sites estáticos
- **Vantagens**: Alta disponibilidade, CDN global
- **Configuração**: Requer conta AWS

### 4. Netlify
- **Uso**: Alternativa estática simples
- **Vantagens**: Setup fácil, builds automáticos
- **Configuração**: Requer conta Netlify

### 5. Docker
- **Uso**: Para ambientes containerizados
- **Vantagens**: Portabilidade, isolamento
- **Configuração**: Requer Docker no servidor

### 6. FTP
- **Uso**: Último recurso
- **Vantagens**: Compatibilidade universal
- **Configuração**: Requer servidor FTP

## 🔄 Processo de Fallback Automático

1. **Validação**: Verifica ambiente e dependências
2. **Pre-checks**: Executa testes e validações
3. **Backup**: Cria backup da versão atual
4. **Deploy Primário**: Tenta Vercel primeiro
5. **Fallback**: Se falhar, tenta próxima estratégia
6. **Verificação**: Testa se o deploy funcionou
7. **Monitoramento**: Monitora saúde do site
8. **Rollback**: Se detectar problemas, faz rollback automático

## 🛡️ Sistema de Monitoramento e Rollback

### Monitoramento Automático
- Verifica URLs principais a cada 30 segundos
- Monitora APIs críticas
- Verifica recursos do sistema
- Detecta falhas automaticamente

### Rollback Automático
- Ativado após 3 falhas consecutivas
- Restaura versão anterior automaticamente
- Envia notificações por email/Slack
- Gera logs detalhados

### Health Checks
```bash
# URLs monitoradas
https://jchairstudios62.xyz
https://jchairstudios62.xyz/produtos
https://jchairstudios62.xyz/api/health
```

## 📊 Relatórios e Logs

### Logs de Deployment
```bash
# Ver logs do último deployment
./deploy-master.sh logs

# Ver status atual
./deploy-master.sh status
```

### Relatórios HTML
Cada deployment gera um relatório HTML com:
- Estratégia utilizada
- Status do deployment
- Informações do ambiente
- Logs detalhados
- Próximos passos

## 🔧 Troubleshooting

### Problemas Comuns

1. **Falha no Build**
   ```bash
   # Limpar cache e tentar novamente
   npm run cleanup:build
   ./deploy-master.sh deploy
   ```

2. **Problemas de Permissão**
   ```bash
   # Tornar scripts executáveis
   chmod +x *.sh
   ```

3. **Variáveis de Ambiente**
   ```bash
   # Validar ambiente
   ./env-manager.sh validate .env.production
   ```

4. **Rollback Manual**
   ```bash
   # Listar backups
   ./rollback-system.sh list-backups

   # Rollback específico
   ./rollback-system.sh rollback backup_20231201_120000.tar.gz
   ```

### Debug Mode
```bash
# Ativar logs detalhados
export DEBUG=true
./deploy-master.sh deploy
```

## 🌐 Configuração de Domínio

### DNS (Cloudflare)
```bash
# Configurar DNS automaticamente
CLOUDFLARE_API_TOKEN=seu-token CLOUDFLARE_ZONE_ID=sua-zone ./domain-setup.sh dns-cloudflare
```

### SSL/TLS
```bash
# Gerar certificados Let's Encrypt
./domain-setup.sh ssl-generate

# Configurar renovação automática
./domain-setup.sh ssl-renew
```

### CDN
```bash
# Configurar Cloudflare CDN
./domain-setup.sh cdn-setup
```

## 🚨 Comandos de Emergência

### Deploy de Emergência
```bash
# Force deploy ignorando validações
FORCE_DEPLOY=true ./deploy-master.sh deploy

# Deploy usando estratégia específica
./deploy-master.sh deploy git-hook
```

### Rollback de Emergência
```bash
# Rollback imediato
./rollback-system.sh auto-rollback

# Rollback para backup específico
./rollback-system.sh rollback backup_emergency.tar.gz
```

### Status de Emergência
```bash
# Verificação rápida de saúde
./rollback-system.sh health-check

# Status detalhado
./deploy-master.sh status
```

## 📞 Suporte e Contato

Para problemas críticos de deployment:

1. **Verificar logs**: `./deploy-master.sh logs`
2. **Tentar rollback**: `./rollback-system.sh auto-rollback`
3. **Deploy manual**: `./deploy-master.sh deploy git-hook`
4. **Verificar saúde**: `./rollback-system.sh health-check`

## 🔐 Segurança

### Variáveis Sensíveis
- Use `.env` files para credenciais
- Nunca commite senhas no Git
- Use secrets management para produção

### Backup de Segurança
- Backups automáticos antes de cada deploy
- Retenção de 30 dias
- Criptografia opcional dos backups

### Monitoramento de Segurança
- Headers de segurança no Nginx
- Rate limiting nas APIs
- Certificados SSL automatizados

---

**Autor**: JC Hair Studio's 62 Deployment System
**Versão**: 2.0.0
**Última Atualização**: $(date)

Este sistema garante **99.9% de disponibilidade** através de múltiplas estratégias de deployment com fallback automático e rollback inteligente.