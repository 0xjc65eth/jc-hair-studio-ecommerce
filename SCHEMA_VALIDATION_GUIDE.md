# Schema.org Structured Data - Validation Guide

## Overview
Este documento descreve como validar os dados estruturados Schema.org implementados no JC Hair Studio's 62 usando Google Rich Results Test e outras ferramentas.

## Implementação Completa

### 1. Schemas Implementados

#### Global (Todas as Páginas)
- **Organization Schema** (`/app/[locale]/layout.tsx`)
  - Informações da empresa, endereço, contatos
  - Redes sociais e avaliações agregadas
  - Logo e imagens da marca

- **WebSite Schema** (`/app/[locale]/layout.tsx`)
  - SearchAction para busca do site
  - Metadata básica do website
  - Relacionamento com Organization

#### Páginas de Produtos (`/components/products/SimpleProductCard.tsx`)
- **Product Schema**
  - Nome, descrição, imagens
  - Preços e ofertas estruturadas
  - Avaliações e reviews (AggregateRating)
  - Informações de envio (ShippingDetails)
  - Propriedades do produto (cor, comprimento, material)
  - Disponibilidade em estoque
  - SKU e identificadores

#### Páginas de Categoria (`/app/[locale]/mega-hair/page.tsx`)
- **BreadcrumbList Schema**
  - Navegação estruturada
  - Links hierárquicos

- **FAQ Schema**
  - Perguntas frequentes sobre mega hair
  - Respostas detalhadas para rich snippets

#### Páginas Institucionais
- **LocalBusiness Schema**
  - Informações da loja física
  - Horários de funcionamento
  - Geolocalização
  - Métodos de pagamento
  - Serviços oferecidos

## Como Validar

### 1. Google Rich Results Test
URL: https://search.google.com/test/rich-results

#### Passo a Passo:
1. Acesse https://search.google.com/test/rich-results
2. Insira a URL da página que deseja testar:
   - Homepage: `https://jchairstudios62.xyz/`
   - Mega Hair: `https://jchairstudios62.xyz/mega-hair`
   - Produto: `https://jchairstudios62.xyz/produto/[id]`
3. Clique em "Test URL"
4. Aguarde a análise
5. Verifique os resultados:
   - ✅ Verde: Schema válido
   - ⚠️ Amarelo: Avisos (não críticos)
   - ❌ Vermelho: Erros que precisam correção

#### O que Verificar:
- **Product Schema**: Preço, disponibilidade, reviews
- **Organization**: Logo, redes sociais, contato
- **BreadcrumbList**: Hierarquia de navegação
- **FAQ**: Perguntas e respostas
- **LocalBusiness**: Endereço, horários

### 2. Schema.org Validator
URL: https://validator.schema.org/

#### Como usar:
1. Acesse https://validator.schema.org/
2. Cole o código JSON-LD direto ou insira a URL
3. Clique em "Validate"
4. Analise erros e avisos

### 3. Google Search Console
URL: https://search.google.com/search-console

#### Monitoramento Contínuo:
1. Acesse Google Search Console
2. Vá em "Enhancements" (Melhorias)
3. Verifique seções:
   - Products (Produtos)
   - Breadcrumbs (Navegação estruturada)
   - FAQ
   - Organization
4. Monitore erros e avisos
5. Solicite reindexação após correções

### 4. Ferramentas de Desenvolvedor do Chrome
#### Verificação Manual:
1. Abra a página no Chrome
2. Clique F12 (DevTools)
3. Vá para "Elements"
4. Procure por `<script type="application/ld+json">`
5. Verifique se o JSON está bem formatado
6. Copie e cole em https://jsonlint.com/ para validar sintaxe

## URLs para Testar

### Páginas Principais:
```
Homepage:
https://jchairstudios62.xyz/

Mega Hair (Categoria):
https://jchairstudios62.xyz/mega-hair

Produto Individual:
https://jchairstudios62.xyz/produto/mega-hair-50cm-liso-preto

FAQ:
https://jchairstudios62.xyz/faq

Contato:
https://jchairstudios62.xyz/contato

Sobre:
https://jchairstudios62.xyz/sobre
```

## Checklist de Validação

### Product Schema
- [ ] Nome do produto presente
- [ ] Descrição completa
- [ ] Imagens (mínimo 1, recomendado 3+)
- [ ] Preço em EUR
- [ ] Disponibilidade (InStock/OutOfStock)
- [ ] Brand (marca)
- [ ] Reviews (rating + reviewCount)
- [ ] SKU único
- [ ] Informações de envio
- [ ] Validade do preço (priceValidUntil)

### Organization Schema
- [ ] Nome da empresa
- [ ] Logo (URL absoluta)
- [ ] Endereço completo
- [ ] Telefone de contato
- [ ] Redes sociais (sameAs)
- [ ] Rating agregado
- [ ] Área de serviço

### BreadcrumbList Schema
- [ ] Posições corretas (1, 2, 3...)
- [ ] Nomes descritivos
- [ ] URLs absolutas
- [ ] Último item é a página atual

### FAQ Schema
- [ ] Perguntas relevantes
- [ ] Respostas completas (mínimo 150 caracteres)
- [ ] Formato correto Question/Answer
- [ ] Mínimo 3 FAQs

### LocalBusiness Schema
- [ ] Tipo correto (HairSalon)
- [ ] Geolocalização (lat/long)
- [ ] Horários de funcionamento
- [ ] Métodos de pagamento
- [ ] Preço range (€€)

## Erros Comuns e Soluções

### 1. "Missing required field 'image'"
**Solução**: Verificar se todas as imagens têm URLs absolutas
```typescript
image: product.images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`)
```

### 2. "Invalid price format"
**Solução**: Sempre usar .toFixed(2) para preços
```typescript
price: product.price.toFixed(2)
```

### 3. "priceValidUntil is in the past"
**Solução**: Data deve ser futura (implementado +90 dias)
```typescript
priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
```

### 4. "Missing aggregateRating"
**Solução**: Incluir rating e reviewCount para produtos com reviews
```typescript
aggregateRating: {
  '@type': 'AggregateRating',
  ratingValue: '4.8',
  reviewCount: '150'
}
```

### 5. "URL is not absolute"
**Solução**: Sempre usar baseUrl para construir URLs
```typescript
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jchairstudios62.xyz';
url: `${baseUrl}/produto/${product.id}`
```

## Resultados Esperados

### Rich Snippets Possíveis:
1. **Product Rich Snippets**
   - Preço visível
   - Avaliações (estrelas)
   - Disponibilidade
   - Imagem do produto

2. **Breadcrumb Navigation**
   - Caminho de navegação nos resultados
   - Links clicáveis na SERP

3. **FAQ Rich Results**
   - Perguntas expandíveis
   - Respostas diretas na SERP
   - Maior espaço nos resultados

4. **Organization Panel**
   - Painel lateral com info da empresa
   - Logo, redes sociais, contato
   - Knowledge Graph

5. **Local Business**
   - Google Maps integration
   - Informações de contato
   - Horários de funcionamento

## Monitoramento Contínuo

### Frequência Recomendada:
- **Diariamente**: Verificar Search Console para novos erros
- **Semanalmente**: Testar páginas principais no Rich Results Test
- **Mensalmente**: Auditoria completa de todos os schemas

### KPIs para Acompanhar:
1. Taxa de rich snippets vs resultados normais
2. CTR (Click-Through Rate) em páginas com rich snippets
3. Impressões e cliques no Search Console
4. Posição média nos resultados
5. Páginas com erros de estruturação

## Recursos Adicionais

### Documentação Oficial:
- Schema.org: https://schema.org/
- Google Search Central: https://developers.google.com/search/docs/appearance/structured-data
- Product Schema Guide: https://developers.google.com/search/docs/appearance/structured-data/product

### Ferramentas:
- Rich Results Test: https://search.google.com/test/rich-results
- Schema Validator: https://validator.schema.org/
- JSON-LD Playground: https://json-ld.org/playground/
- Search Console: https://search.google.com/search-console

## Implementação Técnica

### Arquivos Principais:
```
/components/seo/UnifiedSchema.tsx          - Componente principal unificado
/app/[locale]/layout.tsx                    - Schemas globais (Organization, Website)
/app/[locale]/mega-hair/page.tsx           - Schemas de categoria (Breadcrumb, FAQ)
/components/products/SimpleProductCard.tsx  - Schema de produto individual
```

### Uso nos Componentes:
```tsx
// Homepage
import { OrganizationSchema, WebsiteSchema } from '@/components/seo/UnifiedSchema';
<OrganizationSchema />
<WebsiteSchema />

// Página de Produto
import { ProductSchema } from '@/components/seo/UnifiedSchema';
<ProductSchema product={productData} />

// Categoria
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/UnifiedSchema';
<BreadcrumbSchema breadcrumbs={breadcrumbs} />
<FAQSchema faqs={faqs} />
```

## Próximos Passos

1. ✅ Implementar schemas em todas as páginas
2. ✅ Validar com Rich Results Test
3. 🔄 Submeter sitemap atualizado no Search Console
4. 🔄 Monitorar performance por 30 dias
5. 🔄 Ajustar baseado em feedback do Google
6. 🔄 Expandir FAQs baseado em perguntas reais
7. 🔄 Adicionar reviews reais de clientes

## Suporte

Para dúvidas sobre implementação ou validação:
- Email: dev@jchairstudios62.xyz
- Documentação interna: /docs/seo/
- Google Search Central Community

---

**Última atualização**: 09/10/2025
**Responsável**: Equipe de Desenvolvimento JC Hair Studio's 62
**Status**: ✅ Implementação completa e validada
