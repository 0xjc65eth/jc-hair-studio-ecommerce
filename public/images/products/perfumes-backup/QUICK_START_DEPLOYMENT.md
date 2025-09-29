# 🚀 Guia Rápido de Deployment - JC Hair Studio's 62

## ⚡ Start Rápido (5 minutos)

### 1. Executar Setup Inicial
```bash
# Tornar scripts executáveis
chmod +x *.sh

# Setup completo do sistema
./deploy-master.sh setup
```

### 2. Configurar Variáveis de Ambiente
```bash
# Editar variáveis de produção
nano .env.production

# Atualizar as seguintes variáveis obrigatórias:
# MONGODB_URI=sua-string-mongodb
# NEXTAUTH_SECRET=seu-secret-32-chars
# STRIPE_SECRET_KEY=sua-chave-stripe
# SENDGRID_API_KEY=sua-chave-sendgrid
```

### 3. Deploy Automático
```bash
# Deploy com fallback automático
./deploy-master.sh deploy
```

## 🎯 Deployment Específico

### Se o Vercel estiver falhando:

#### Opção 1: AWS S3 (Recomendado)
```bash
# Configurar credenciais AWS
export AWS_ACCESS_KEY_ID="sua-chave"
export AWS_SECRET_ACCESS_KEY="sua-chave-secreta"
export AWS_S3_BUCKET="jc-hair-studio-static"

# Deploy para S3
./deploy-master.sh deploy static-s3
```

#### Opção 2: Netlify
```bash
# Deploy para Netlify
./deploy-master.sh deploy static-netlify
```

#### Opção 3: Servidor Próprio (Git Hook)
```bash
# Configurar servidor
export DEPLOY_HOST="seu-servidor.com"
export DEPLOY_USER="deploy"

# Deploy via Git Hook
./deploy-master.sh deploy git-hook
```

## 🛡️ Verificação e Monitoramento

### Verificar Deployment
```bash
# Verificar se está funcionando
./deploy-master.sh verify

# Ver status detalhado
./deploy-master.sh status
```

### Em Caso de Problemas
```bash
# Rollback automático
./deploy-master.sh rollback

# Ver logs
./deploy-master.sh logs
```

## 🔥 Comandos de Emergência

### Deploy de Última Hora
```bash
# Force deploy (ignora testes)
FORCE_DEPLOY=true ./deploy-master.sh deploy static-s3
```

### Rollback de Emergência
```bash
# Rollback imediato
./rollback-system.sh auto-rollback
```

### Health Check Rápido
```bash
# Verificar se o site está online
curl -I https://jchairstudios62.xyz
```

## 📊 Comandos Úteis

```bash
# Ver todos os backups
./rollback-system.sh list-backups

# Criar backup manual
./rollback-system.sh backup "backup_manual_$(date +%Y%m%d)"

# Verificar DNS
dig jchairstudios62.xyz

# Testar SSL
openssl s_client -connect jchairstudios62.xyz:443 < /dev/null
```

## 🌐 URLs Importantes

- **Produção**: https://jchairstudios62.xyz
- **Staging**: https://staging.jchairstudios62.xyz
- **API**: https://api.jchairstudios62.xyz
- **Health Check**: https://jchairstudios62.xyz/api/health

## 📱 Notificações

Configure notificações para ser alertado sobre falhas:

```bash
# Email de notificação
export NOTIFICATION_EMAIL="seu-email@gmail.com"

# Webhook Slack (opcional)
export SLACK_WEBHOOK_URL="https://hooks.slack.com/seu-webhook"
```

## 🆘 Suporte

### Problemas Críticos
1. Execute: `./rollback-system.sh auto-rollback`
2. Verifique: `./deploy-master.sh status`
3. Se necessário: `./deploy-master.sh deploy git-hook`

### Logs Importantes
```bash
# Deployment logs
ls -la logs/deployment_*.log

# Nginx logs (se usando servidor próprio)
sudo tail -f /var/log/nginx/error.log

# Application logs
sudo journalctl -u jc-hair-studio -f
```

---

**✅ Checklist Rápido:**
- [ ] Scripts executáveis (`chmod +x *.sh`)
- [ ] Variáveis de ambiente configuradas
- [ ] Credenciais AWS/Netlify configuradas
- [ ] Deploy executado com sucesso
- [ ] Verificação passou
- [ ] Monitoramento ativo

**🎉 Pronto! Seu site está no ar com sistema de backup automático!**