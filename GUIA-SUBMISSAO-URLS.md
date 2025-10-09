# Guia de Submissao em Massa de URLs - JC Hair Studio

## Resumo Executivo

**Data de Geracao:** 09 de Outubro de 2025
**Total de URLs:** 316 URLs
**Arquivos Gerados:** 3 formatos (TXT, JSON, TXT Clean)

---

## Arquivos Disponiveis

### 1. urllist.txt (18 KB)
- **Localizacao:** `/public/urllist.txt`
- **Formato:** Lista com comentarios e categorizacao
- **Uso:** Documentacao e analise
- **Link:** https://jchairstudios62.xyz/urllist.txt

### 2. urllist-clean.txt (17 KB)
- **Localizacao:** `/public/urllist-clean.txt`
- **Formato:** Lista pura de URLs (sem comentarios)
- **Uso:** Submissao direta em ferramentas
- **Link:** https://jchairstudios62.xyz/urllist-clean.txt

### 3. urllist.json (48 KB)
- **Localizacao:** `/public/urllist.json`
- **Formato:** JSON estruturado com metadados
- **Uso:** Integracao com APIs e automacoes
- **Link:** https://jchairstudios62.xyz/urllist.json

---

## Distribuicao de URLs por Categoria

| Categoria | Quantidade | Percentual |
|-----------|------------|------------|
| Produtos - Bruna Tavares | 50 | 15.8% |
| Produtos - Progressivas | 49 | 15.5% |
| Produtos - Maquiagem Mari Maria | 29 | 9.2% |
| Paginas de Usuario | 21 | 6.6% |
| Categorias Principais | 20 | 6.3% |
| Categorias Multilingue | 20 | 6.3% |
| Produtos - Mega Hair | 18 | 5.7% |
| Produtos - Tratamentos | 18 | 5.7% |
| Produtos - Maquiagem Wepink | 15 | 4.7% |
| Paginas Institucionais | 15 | 4.7% |
| Produtos - PAM Makeup | 14 | 4.4% |
| Produtos - Bases Fran | 12 | 3.8% |
| Produtos - Relaxamentos | 11 | 3.5% |
| Paginas SEO Landing | 7 | 2.2% |
| Homepage Multilingue | 4 | 1.3% |
| Subcategorias | 4 | 1.3% |
| Paginas de Ajuda | 4 | 1.3% |
| Paginas Legais | 4 | 1.3% |
| Homepage | 1 | 0.3% |
| **TOTAL** | **316** | **100%** |

---

## URLs Prioritarias (Top 20)

### Prioridade Maxima (1.0)
1. Homepage: https://jchairstudios62.xyz

### Prioridade Muito Alta (0.95)
2. https://jchairstudios62.xyz/pt
3. https://jchairstudios62.xyz/en
4. https://jchairstudios62.xyz/es
5. https://jchairstudios62.xyz/fr
6. https://jchairstudios62.xyz/pt/botox-capilar
7. https://jchairstudios62.xyz/pt/hidratacao-capilar-profunda
8. https://jchairstudios62.xyz/pt/produtos-cabelo-cacheado
9. https://jchairstudios62.xyz/pt/progressiva-brasileira
10. https://jchairstudios62.xyz/pt/queratina-brasileira
11. https://jchairstudios62.xyz/pt/reconstrucao-capilar
12. https://jchairstudios62.xyz/pt/tintas-capilares-profissionais

### Prioridade Alta (0.9)
13. https://jchairstudios62.xyz/produtos
14. https://jchairstudios62.xyz/mega-hair
15. https://jchairstudios62.xyz/maquiagens
16. https://jchairstudios62.xyz/cosmeticos
17. https://jchairstudios62.xyz/tratamentos-capilares
18. https://jchairstudios62.xyz/progressiva-brasileira
19. https://jchairstudios62.xyz/progressiva-vogue-portugal
20. https://jchairstudios62.xyz/esmaltes-impala-portugal

---

## Como Submeter no Google Search Console

### Metodo 1: Submissao em Massa via API (RECOMENDADO)

```bash
# 1. Configurar credenciais da API do Google
# Acesse: https://console.cloud.google.com/
# Ative: Indexing API

# 2. Usar o script de submissao automatica
node scripts/submit-urls-google.js

# 3. Ou usar o script existente de ping
node scripts/ping-search-engines.mjs
```

### Metodo 2: Submissao Manual via Interface

1. Acesse: https://search.google.com/search-console
2. Selecione a propriedade: jchairstudios62.xyz
3. Va em "Cobertura" > "Submeter sitemap"
4. Adicione o sitemap: https://jchairstudios62.xyz/sitemap.xml
5. Para URLs individuais:
   - Va em "Inspecao de URL"
   - Cole a URL
   - Clique em "Solicitar indexacao"

### Metodo 3: Submissao via Sitemap

O sitemap ja esta configurado e atualizado:
- **URL do Sitemap:** https://jchairstudios62.xyz/sitemap.xml
- **Status:** Atualizado em 09/10/2025
- **URLs no Sitemap:** 343 URLs

**Acoes:**
1. Submeta o sitemap no Google Search Console
2. O Google crawleara automaticamente todas as URLs
3. Verifique o status em "Cobertura" apos 3-7 dias

---

## Como Submeter no Bing Webmaster Tools

### Metodo 1: Submissao em Massa

1. Acesse: https://www.bing.com/webmasters
2. Selecione seu site
3. Va em "Configuracao" > "Sitemaps"
4. Adicione: https://jchairstudios62.xyz/sitemap.xml
5. Clique em "Enviar"

### Metodo 2: Submissao via API do Bing

```bash
# Usando IndexNow (protocolo do Bing)
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "jchairstudios62.xyz",
    "key": "YOUR_API_KEY",
    "urlList": [
      "https://jchairstudios62.xyz/",
      "https://jchairstudios62.xyz/produtos",
      ...
    ]
  }'
```

### Metodo 3: Envio Manual de URLs

1. Acesse o Bing Webmaster Tools
2. Va em "URL Submission"
3. Cole as URLs do arquivo `urllist-clean.txt`
4. Limite: 10.000 URLs por dia
5. Submeta em lotes se necessario

---

## Script de Submissao Automatica

### Para Google (via Indexing API)

Crie o arquivo: `scripts/submit-urls-google.js`

```javascript
const { google } = require('googleapis');
const fs = require('fs');

async function submitToGoogle() {
  const urls = fs.readFileSync('public/urllist-clean.txt', 'utf8')
    .split('\n')
    .filter(url => url.trim());

  const auth = new google.auth.GoogleAuth({
    keyFile: 'google-credentials.json',
    scopes: ['https://www.googleapis.com/auth/indexing']
  });

  const indexing = google.indexing({
    version: 'v3',
    auth
  });

  for (const url of urls) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED'
        }
      });
      console.log(`✓ Submitted: ${url}`);
      await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit
    } catch (error) {
      console.error(`✗ Error submitting ${url}:`, error.message);
    }
  }
}

submitToGoogle();
```

### Para Bing (via IndexNow)

Crie o arquivo: `scripts/submit-urls-bing.js`

```javascript
const https = require('https');
const fs = require('fs');

async function submitToBing() {
  const urls = fs.readFileSync('public/urllist-clean.txt', 'utf8')
    .split('\n')
    .filter(url => url.trim());

  const data = JSON.stringify({
    host: 'jchairstudios62.xyz',
    key: 'YOUR_INDEXNOW_KEY', // Gere em: bing.com/webmasters
    keyLocation: 'https://jchairstudios62.xyz/YOUR_INDEXNOW_KEY.txt',
    urlList: urls
  });

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

submitToBing();
```

---

## Cronograma de Submissao Recomendado

### Semana 1: Submissao Inicial
- **Dia 1:** Submeter sitemap no Google Search Console
- **Dia 1:** Submeter sitemap no Bing Webmaster Tools
- **Dia 2:** Submeter URLs prioritarias (Top 20) manualmente
- **Dia 3:** Iniciar submissao automatica via API (lotes de 50 URLs/dia)

### Semana 2-4: Monitoramento
- Verificar status de indexacao diariamente
- Re-submeter URLs que nao foram indexadas
- Analisar relatorios de cobertura

### Manutencao Continua
- Submeter novas URLs quando criadas
- Atualizar sitemap automaticamente
- Executar scripts de ping semanalmente

---

## Ferramentas e Recursos

### Verificacao de Status de Indexacao

1. **Google:**
   ```
   site:jchairstudios62.xyz
   ```

2. **Bing:**
   ```
   site:jchairstudios62.xyz
   ```

3. **Verificacao Individual:**
   - Google: `site:jchairstudios62.xyz/sua-url-especifica`
   - Bing: `site:jchairstudios62.xyz/sua-url-especifica`

### Monitoramento de Progresso

```bash
# Verificar quantas paginas estao indexadas no Google
curl "https://www.google.com/search?q=site:jchairstudios62.xyz" | grep "results"

# Verificar sitemap
curl https://jchairstudios62.xyz/sitemap.xml

# Verificar robots.txt
curl https://jchairstudios62.xyz/robots.txt
```

---

## Checklist de Submissao

- [ ] Verificar que sitemap.xml esta acessivel
- [ ] Verificar que robots.txt permite crawling
- [ ] Submeter sitemap no Google Search Console
- [ ] Submeter sitemap no Bing Webmaster Tools
- [ ] Submeter 20 URLs prioritarias manualmente
- [ ] Configurar submissao automatica via API
- [ ] Configurar IndexNow para Bing
- [ ] Verificar status apos 7 dias
- [ ] Re-submeter URLs nao indexadas
- [ ] Configurar alertas de indexacao

---

## Metricas de Sucesso

### Objetivos (30 dias)
- [ ] 80% das URLs indexadas no Google
- [ ] 70% das URLs indexadas no Bing
- [ ] 100% das URLs prioritarias (Top 20) indexadas
- [ ] Tempo medio de indexacao < 7 dias

### Objetivos (90 dias)
- [ ] 95% das URLs indexadas no Google
- [ ] 90% das URLs indexadas no Bing
- [ ] Todas as paginas SEO Landing nas primeiras 3 paginas

---

## Proximos Passos

1. **Imediato (Hoje):**
   - Submeter sitemap no Google e Bing
   - Submeter Top 20 URLs manualmente

2. **Esta Semana:**
   - Configurar API do Google Indexing
   - Configurar IndexNow do Bing
   - Iniciar submissao automatica

3. **Proximas 2 Semanas:**
   - Monitorar progresso diariamente
   - Re-submeter URLs nao indexadas
   - Ajustar estrategia conforme necessario

4. **Manutencao Continua:**
   - Executar scripts semanalmente
   - Adicionar novas URLs ao sistema
   - Otimizar URLs com baixo desempenho

---

## Links Uteis

- **Google Search Console:** https://search.google.com/search-console
- **Bing Webmaster Tools:** https://www.bing.com/webmasters
- **Google Indexing API:** https://developers.google.com/search/apis/indexing-api/v3/quickstart
- **IndexNow:** https://www.indexnow.org/
- **Sitemap do Site:** https://jchairstudios62.xyz/sitemap.xml
- **Lista de URLs (Clean):** https://jchairstudios62.xyz/urllist-clean.txt
- **Lista de URLs (JSON):** https://jchairstudios62.xyz/urllist.json

---

## Contato e Suporte

Para questoes sobre indexacao ou problemas tecnicos:
- Email: contato@jchairstudios62.xyz
- Documentacao Interna: Ver arquivos em `/docs/`

---

**Documento gerado automaticamente em:** 09 de Outubro de 2025
**Ultima atualizacao das URLs:** 09 de Outubro de 2025, 17:02:28
**Versao:** 1.0
