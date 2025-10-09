# Feed RSS - JC Hair Studio's 62

## Visão Geral

O feed RSS foi implementado para notificar search engines e agregadores de conteúdo sobre atualizações de produtos na loja. O feed segue as especificações RSS 2.0 e inclui extensões para mídia e e-commerce.

## Localização do Feed

- **URL Pública**: https://jchairstudios62.xyz/feed.xml
- **Arquivo Local**: `/public/feed.xml`

## Características Implementadas

### 1. Especificações RSS 2.0
- ✅ Elementos obrigatórios do channel (title, link, description)
- ✅ Elementos recomendados (language, lastBuildDate, pubDate, ttl)
- ✅ Elementos obrigatórios dos items (title, link, description)
- ✅ GUIDs únicos para cada item
- ✅ Categorização de produtos

### 2. Namespaces Implementados

#### Atom (xmlns:atom)
- Link autodescoberta do feed
- Categorias de produtos

#### Dublin Core (xmlns:dc)
- dc:creator - Marca do produto

#### Media RSS (xmlns:media)
- media:content - Imagens dos produtos com metadados
- media:title - Título da imagem
- media:description - Descrição da imagem

#### Google Shopping (xmlns:g)
- g:price - Preço do produto em EUR
- g:availability - Disponibilidade (in stock)
- g:condition - Condição (new)

### 3. Autodiscovery no HTML

O feed foi configurado no `<head>` do site para autodiscovery:

```html
<link rel="alternate" type="application/rss+xml"
      title="JC Hair Studio's 62 - Feed RSS de Produtos"
      href="/feed.xml" />
```

### 4. Imagens e Mídia

Cada produto inclui:
- Tag `<media:content>` com URL completa da imagem
- Tag `<enclosure>` para compatibilidade com agregadores antigos
- Metadados de mídia (título e descrição)

### 5. Categorização

Produtos são categorizados automaticamente em:
- Mega Hair
- Progressivas e Tratamentos
- Relaxamentos
- Tratamentos Capilares
- Maquiagem
- Colorações Capilares
- Esmaltes
- Shampoos e Condicionadores
- Produtos Capilares (genérico)

### 6. Limitação de Itens

- **Máximo**: 50 produtos mais recentes
- **Razão**: Otimização de performance e melhores práticas RSS

### 7. TTL (Time To Live)

- **Valor**: 1440 minutos (24 horas)
- **Significado**: Agregadores devem verificar atualizações a cada 24h

## Scripts Disponíveis

### Gerar Feed RSS
```bash
npm run seo:generate-rss
```

### Validar Feed RSS
```bash
npm run seo:validate-rss
```

### Gerar Todos os Feeds SEO
```bash
npm run seo:all
```

## Estrutura do Item RSS

Cada produto no feed contém:

```xml
<item>
  <title>Nome do Produto</title>
  <link>URL do Produto</link>
  <guid isPermaLink="true">URL do Produto</guid>
  <description><![CDATA[Descrição do produto]]></description>
  <pubDate>Data de Publicação</pubDate>
  <category>Categoria do Produto</category>
  <dc:creator>Marca</dc:creator>
  <atom:category term="Badge" label="Badge"/>
  <media:content url="URL da Imagem" medium="image" type="image/jpeg">
    <media:title>Título da Imagem</media:title>
    <media:description>Descrição da Imagem</media:description>
  </media:content>
  <enclosure url="URL da Imagem" type="image/jpeg" length="0"/>
  <g:price>Preço EUR</g:price>
  <g:availability>in stock</g:availability>
  <g:condition>new</g:condition>
</item>
```

## Validação

O feed pode ser validado usando:

### Validadores Online
1. **W3C Feed Validator**: https://validator.w3.org/feed/
   - Cole a URL: https://jchairstudios62.xyz/feed.xml

2. **RSS Feed Validator**: https://www.feedvalidator.org/
   - Valida compatibilidade com agregadores

### Validação Local
```bash
npm run seo:validate-rss
```

Saída esperada:
```
Statistics:
  - Total items: 50
  - Items with categories: 50
  - Items with media content: 50
  - Items with prices: 50

✓ RSS feed is valid and ready for production!
```

## Benefícios para SEO

### 1. Notificação de Search Engines
- Google, Bing e outros search engines descobrem novos produtos automaticamente
- Indexação mais rápida de produtos

### 2. Agregadores de Conteúdo
- Feedly, Inoreader e outros agregadores podem exibir produtos
- Possibilidade de seguidores receberem notificações

### 3. Google Discover e News
- Feed estruturado aumenta chances de aparecer no Google Discover
- Formato otimizado para mobile

### 4. Rich Snippets
- Imagens e preços no feed ajudam search engines a criar rich snippets
- Melhor CTR nos resultados de busca

### 5. Freshness Signal
- Feed RSS é um sinal de "freshness" para Google
- Sites com conteúdo atualizado regularmente ranqueiam melhor

## Integração com Search Engines

### Google Search Console

1. Submeter o feed manualmente:
   - Acesse Google Search Console
   - Vá em "Sitemaps"
   - Adicione: `https://jchairstudios62.xyz/feed.xml`

2. O Google verificará periodicamente por atualizações

### Bing Webmaster Tools

1. Submeter o feed:
   - Acesse Bing Webmaster Tools
   - Configure RSS feed submission
   - Cole a URL do feed

### Yandex Webmaster

1. Adicionar RSS feed:
   - Acesse Yandex Webmaster
   - Vá em "Indexing" > "RSS"
   - Adicione a URL do feed

## Manutenção

### Atualização Automática

O feed é gerado automaticamente durante o build:

```json
"prebuild": "node scripts/generate-product-feed.mjs"
```

Para incluir RSS no prebuild, adicione:

```json
"prebuild": "npm run seo:generate-rss && node scripts/generate-product-feed.mjs"
```

### Frequência de Atualização

Recomendado:
- **Produtos novos**: Gerar feed imediatamente
- **Atualizações de preço**: Diariamente
- **Atualizações gerais**: Semanalmente

### Monitoramento

Verificar regularmente:
- Feed continua válido
- Todos os produtos têm imagens
- Preços estão atualizados
- Categorias estão corretas

## Troubleshooting

### Problema: Feed não está sendo descoberto

**Solução**:
1. Verificar se o link de autodiscovery está no `<head>`
2. Testar URL manualmente: https://jchairstudios62.xyz/feed.xml
3. Verificar console do navegador por erros

### Problema: Imagens não aparecem

**Solução**:
1. Verificar se URLs das imagens estão completas (incluindo domínio)
2. Testar se imagens carregam no navegador
3. Verificar CORS headers para imagens

### Problema: Search engines não indexam

**Solução**:
1. Submeter feed manualmente no Search Console
2. Verificar robots.txt não bloqueia feed
3. Aguardar 24-48h após submissão
4. Verificar se há erros no Search Console

### Problema: Feed inválido

**Solução**:
1. Executar validador local: `npm run seo:validate-rss`
2. Testar em validador online: https://validator.w3.org/feed/
3. Verificar encoding UTF-8
4. Verificar caracteres especiais escapados

## Recursos Adicionais

### Documentação
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)
- [Media RSS Specification](https://www.rssboard.org/media-rss)
- [Google Merchant Feed Specification](https://support.google.com/merchants/answer/7052112)

### Ferramentas
- [W3C Feed Validator](https://validator.w3.org/feed/)
- [RSS Feed Validator](https://www.feedvalidator.org/)
- [Feed Burner](https://feedburner.google.com/) - Para analytics de RSS

### Leituras Recomendadas
- [RSS for SEO: Best Practices](https://moz.com/learn/seo/rss)
- [Using RSS to Improve SEO](https://searchengineland.com/rss-seo-benefits)

## Changelog

### v1.0.0 - 2025-10-09
- ✅ Implementação inicial do feed RSS 2.0
- ✅ Adicionados namespaces: Atom, Dublin Core, Media RSS, Google Shopping
- ✅ Limitado a 50 produtos mais recentes
- ✅ Categorização automática de produtos
- ✅ Autodiscovery no HTML
- ✅ Validador de feed RSS
- ✅ Documentação completa

## Suporte

Para problemas ou dúvidas sobre o feed RSS:
- Email: suporte@jchairstudios62.xyz
- Issues: [GitHub Issues](se disponível)
