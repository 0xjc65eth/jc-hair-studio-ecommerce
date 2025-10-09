# Search Engine Ping System

Sistema automático de notificação para search engines quando o sitemap é atualizado.

## Visão Geral

Este sistema automatiza o processo de notificação aos motores de busca (Google, Bing, Yandex, Baidu) sempre que o sitemap do site é atualizado, seja manualmente ou através de deploy na Vercel.

### Características

✅ **Multi-Engine Support**
- Google
- Bing
- Yandex
- Baidu
- IndexNow (Bing/Yandex/outros)

✅ **Rate Limiting**
- Previne spam aos search engines
- Configuração personalizada por engine
- Estado persistente entre execuções

✅ **Logging Completo**
- Logs detalhados de sucesso/falha
- Timestamps e dados de resposta
- Histórico persistente em arquivo

✅ **Retry Logic**
- Tentativas automáticas em caso de falha
- Exponential backoff
- Configurável (até 3 tentativas)

✅ **Webhook Integration**
- Trigger automático em deploy Vercel
- Validação de assinatura
- Rate limiting para webhooks

✅ **CLI Interface**
- Comandos simples e intuitivos
- Suporte a flags para engines específicas
- Modo verbose para debugging

## Instalação e Setup

### 1. Executar Setup Script

```bash
npm run seo:ping-setup
```

Este script irá:
- ✅ Verificar variáveis de ambiente
- ✅ Criar arquivo IndexNow key
- ✅ Criar diretório de logs
- ✅ Testar conexões com search engines
- ✅ Exibir instruções de configuração do webhook

### 2. Configurar Variáveis de Ambiente

Adicione ao seu `.env.local`:

```bash
# URL do site (obrigatório)
SITE_URL=https://jchairstudios62.xyz

# Secret para webhook da Vercel (opcional, recomendado)
WEBHOOK_SECRET=your_generated_secret_here
```

### 3. Configurar Webhook da Vercel (Opcional)

Para pings automáticos em cada deploy:

1. Acesse seu projeto no Vercel Dashboard
2. Vá para: **Settings → Git → Deploy Hooks**
3. Clique em **Create Hook**
4. Configure:
   - **Name**: Search Engine Ping
   - **Branch**: production (ou sua branch principal)
5. Salve o URL do hook

O endpoint do webhook já está criado em:
```
https://jchairstudios62.xyz/api/webhooks/ping-engines
```

## Uso

### Comandos Disponíveis

#### Ping Todos os Engines

```bash
npm run seo:ping-engines
```

#### Ping Engine Específico

```bash
# Google apenas
npm run seo:ping-engines:google

# Bing apenas
npm run seo:ping-engines:bing

# Com flags personalizadas
npm run seo:ping-engines -- --yandex
npm run seo:ping-engines -- --baidu
npm run seo:ping-engines -- --indexnow
```

#### Modo Verbose

```bash
npm run seo:ping-engines:verbose
```

Exibe informações detalhadas:
- URLs sendo pingados
- Tentativas de retry
- Dados completos de resposta

#### Forçar Ping (Ignorar Rate Limits)

```bash
npm run seo:ping-engines:force
```

⚠️ Use com moderação para não ser bloqueado pelos search engines.

### Exemplo de Output

```
🔔 Search Engine Ping System - JC Hair Studio

[2025-10-09T14:30:00.000Z] [SUCCESS] [google] Ping successful | {"statusCode":200}
[2025-10-09T14:30:01.000Z] [SUCCESS] [bing] Ping successful | {"statusCode":200}
[2025-10-09T14:30:02.000Z] [SUCCESS] [yandex] Ping successful | {"statusCode":200}
[2025-10-09T14:30:03.000Z] [WARNING] [baidu] Ping returned status 302 | {"statusCode":302}
[2025-10-09T14:30:04.000Z] [SUCCESS] [indexnow] Submission successful (45 URLs) | {"statusCode":200}

======================================================================
PING RESULTS SUMMARY
======================================================================

Total Engines: 5
Successful:    4
Failed:        0
Skipped:       1
Duration:      4.23s

──────────────────────────────────────────────────────────────────────
Individual Results:

✅ GOOGLE       SUCCESS
   └─ Status Code: 200
✅ BING         SUCCESS
   └─ Status Code: 200
✅ YANDEX       SUCCESS
   └─ Status Code: 200
⏭️  BAIDU        SKIPPED
   └─ Rate limit active
✅ INDEXNOW     SUCCESS
   └─ Status Code: 200
   └─ URLs Submitted: 45

======================================================================

Detailed logs: logs/search-engine-pings.log
```

## Rate Limits

Os rate limits são configurados para proteger contra spam:

| Engine    | Limite         | Motivo                        |
|-----------|----------------|-------------------------------|
| Google    | 1 hora         | Política do Google            |
| Bing      | 30 minutos     | Política do Bing              |
| Yandex    | 1 hora         | Política do Yandex            |
| Baidu     | 2 horas        | Mais restritivo               |
| IndexNow  | 30 minutos     | Recomendação da API           |

### Verificar Status de Rate Limit

O estado dos rate limits é salvo em:
```
logs/ping-state.json
```

Formato:
```json
{
  "google": 1696862400000,
  "bing": 1696862400000,
  "yandex": 1696862400000,
  "baidu": 1696862400000,
  "indexnow": 1696862400000
}
```

## Logs

### Localização

Todos os logs são salvos em:
```
logs/search-engine-pings.log
```

### Formato de Log

```
[timestamp] [level] [engine] message | data
```

Exemplo:
```
[2025-10-09T14:30:00.000Z] [SUCCESS] [google] Ping successful | {"statusCode":200}
[2025-10-09T14:30:01.000Z] [ERROR] [bing] Ping failed | {"error":"Connection timeout"}
[2025-10-09T14:30:02.000Z] [WARNING] [yandex] Rate limit active. Next ping available in 45 minute(s)
```

### Ver Logs Recentes

```bash
# Últimas 50 linhas
tail -n 50 logs/search-engine-pings.log

# Acompanhar em tempo real
tail -f logs/search-engine-pings.log

# Filtrar por engine específico
grep "\[google\]" logs/search-engine-pings.log

# Filtrar apenas erros
grep "\[ERROR\]" logs/search-engine-pings.log
```

## Webhook API

### Endpoint

```
POST /api/webhooks/ping-engines
```

### Autenticação

O webhook valida a assinatura da Vercel usando HMAC SHA256:

```
Header: x-vercel-signature
```

### Exemplo de Request

```bash
curl -X POST https://jchairstudios62.xyz/api/webhooks/ping-engines \
  -H "Content-Type: application/json" \
  -H "x-vercel-signature: <signature>"
```

### Response Format

```json
{
  "success": true,
  "timestamp": "2025-10-09T14:30:00.000Z",
  "results": [
    {
      "engine": "google",
      "success": true,
      "statusCode": 200
    },
    {
      "engine": "bing",
      "success": true,
      "statusCode": 200
    }
  ],
  "summary": {
    "total": 5,
    "successful": 4,
    "failed": 1
  }
}
```

### Rate Limiting no Webhook

O webhook possui rate limiting próprio:
- **Deploy pings**: 30 minutos entre chamadas
- **Manual pings**: 30 minutos entre chamadas

Se o rate limit estiver ativo:
```json
{
  "success": true,
  "skipped": true,
  "message": "Rate limit active, ping skipped"
}
```

### Teste Manual do Webhook

```bash
# Com autenticação
curl -X GET https://jchairstudios62.xyz/api/webhooks/ping-engines \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET"
```

## Como Funciona

### 1. Ping Manual

```
Usuário → CLI Script → Rate Limiter → Search Engines
                    ↓
                  Logger
```

1. Usuário executa comando CLI
2. Script verifica rate limits
3. Se permitido, envia requests para engines
4. Registra resultados em logs
5. Atualiza estado de rate limit

### 2. Ping Automático (Deploy)

```
Vercel Deploy → Deploy Hook → Webhook API → Ping System
                            ↓
                         Validation
                            ↓
                      Rate Limiter
                            ↓
                    Search Engines
                            ↓
                          Logs
```

1. Deploy completa na Vercel
2. Vercel chama deploy hook
3. Hook aciona webhook API
4. Webhook valida assinatura
5. Verifica rate limit
6. Executa pings
7. Retorna resultados

## Arquitetura

### Arquivos Principais

```
scripts/
├── ping-search-engines.js      # Script principal de ping
└── setup-search-engine-ping.js # Setup e configuração

app/api/webhooks/
└── ping-engines/
    └── route.ts                 # Webhook endpoint

logs/
├── search-engine-pings.log      # Log de todas as operações
└── ping-state.json              # Estado de rate limiting

public/
└── d4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8.txt  # IndexNow key
```

### Classes e Módulos

#### Logger
- Gerencia logging para arquivo e console
- Suporta níveis: success, error, warning, info
- Colorização ANSI para console
- Timestamps ISO 8601

#### RateLimiter
- Gerencia limites por engine
- Persiste estado em JSON
- Calcula tempo até próximo ping permitido
- Suporta formatação humanizada de tempo

#### Ping Functions
- `pingGoogle()` - Ping Google Search
- `pingBing()` - Ping Bing Webmaster
- `pingYandex()` - Ping Yandex Webmaster
- `pingBaidu()` - Ping Baidu Webmaster
- `submitIndexNow()` - Submit via IndexNow API

## Troubleshooting

### Problema: "Rate limit active"

**Solução**: Aguarde o tempo indicado ou use `--force`:
```bash
npm run seo:ping-engines:force
```

### Problema: "Connection timeout"

**Possíveis causas**:
- Firewall bloqueando requests
- Problemas de rede
- Search engine temporariamente indisponível

**Solução**: Tente novamente após alguns minutos.

### Problema: "Invalid webhook signature"

**Possíveis causas**:
- `WEBHOOK_SECRET` não configurado
- Secret diferente entre Vercel e aplicação

**Solução**:
1. Verifique o secret em `.env.local`
2. Atualize o secret nas variáveis de ambiente da Vercel
3. Reimplante a aplicação

### Problema: Logs não estão sendo criados

**Solução**:
```bash
# Criar diretório manualmente
mkdir -p logs
chmod 755 logs

# Executar setup
npm run seo:ping-setup
```

### Problema: IndexNow key não encontrada

**Solução**:
```bash
# Executar setup para recriar
npm run seo:ping-setup

# Ou criar manualmente
echo "d4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8" > public/d4f8c1b3a7e9d2f6b8a4c7e1d9f3b6a8.txt
```

## Best Practices

### 1. Rate Limiting
- ✅ Respeite os rate limits
- ❌ Não abuse do flag `--force`
- ✅ Use webhook para pings automáticos

### 2. Monitoring
- ✅ Revise logs regularmente
- ✅ Configure alertas para falhas frequentes
- ✅ Monitore taxas de sucesso

### 3. Security
- ✅ Use `WEBHOOK_SECRET` em produção
- ✅ Mantenha secrets em variáveis de ambiente
- ❌ Nunca commite secrets no Git

### 4. Deploy
- ✅ Configure webhook da Vercel
- ✅ Teste webhook antes de produção
- ✅ Verifique logs após deploy

## Integrações Futuras

Possíveis melhorias:

- [ ] Dashboard web para visualizar estatísticas
- [ ] Alertas por email/Slack para falhas
- [ ] Métricas de indexação por engine
- [ ] Suporte a mais search engines
- [ ] Integração com Google Search Console API
- [ ] Integração com Bing Webmaster API
- [ ] Retry automático agendado para falhas
- [ ] Health check dashboard

## Suporte

Para problemas ou dúvidas:

1. Verifique os logs: `logs/search-engine-pings.log`
2. Execute diagnóstico: `npm run seo:ping-setup`
3. Teste conexões manualmente
4. Verifique configuração de firewall/proxy

## Referências

- [Google Ping Service](http://www.google.com/ping)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [IndexNow Protocol](https://www.indexnow.org/)
- [Yandex Webmaster](https://webmaster.yandex.com/)
- [Baidu Webmaster Tools](https://ziyuan.baidu.com/)

## License

MIT - JC Hair Studio
