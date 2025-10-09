# Schema.org Structured Data - Quick Reference

## 🚀 Quick Start

### Validar Implementação
```bash
# Teste rápido - Cole no navegador
https://search.google.com/test/rich-results?url=https://jchairstudios62.xyz/mega-hair
```

### Status
✅ **IMPLEMENTAÇÃO COMPLETA**
- 7 tipos de schema implementados
- 50+ FAQs estruturadas
- Todos produtos com rich snippets
- Breadcrumbs em navegação
- LocalBusiness configurado

---

## 📁 Arquivos Principais

```
/components/seo/UnifiedSchema.tsx     ← Componente principal
/app/[locale]/layout.tsx               ← Schemas globais
/components/products/SimpleProductCard.tsx ← Product schemas
```

---

## 🎯 Schemas Implementados

| Schema | Localização | Status |
|--------|-------------|--------|
| Organization | layout.tsx | ✅ |
| WebSite | layout.tsx | ✅ |
| Product | SimpleProductCard.tsx | ✅ |
| LocalBusiness | contato/page.tsx | ✅ |
| BreadcrumbList | Múltiplas páginas | ✅ |
| FAQ | faq/page.tsx + outros | ✅ |
| AggregateRating | Product schema | ✅ |

---

## 💡 Como Usar

### Adicionar Product Schema
```tsx
import { ProductSchema } from '@/components/seo/UnifiedSchema';

<ProductSchema
  product={{
    id: 'produto-id',
    name: 'Nome do Produto',
    description: 'Descrição',
    images: ['/img1.jpg'],
    price: 99.99,
    rating: 4.8,
    reviewCount: 150
  }}
/>
```

### Adicionar FAQ Schema
```tsx
import { FAQSchema } from '@/components/seo/UnifiedSchema';

<FAQSchema
  faqs={[
    { question: 'Pergunta?', answer: 'Resposta detalhada' }
  ]}
/>
```

### Adicionar Breadcrumbs
```tsx
import { BreadcrumbSchema } from '@/components/seo/UnifiedSchema';

<BreadcrumbSchema
  breadcrumbs={[
    { name: 'Início', url: '/' },
    { name: 'Categoria', url: '/categoria' }
  ]}
/>
```

---

## 🧪 Testar Schemas

### 1. Rich Results Test (Rápido)
```
https://search.google.com/test/rich-results
```
Cole a URL e clique "Test URL"

### 2. Schema Validator (Completo)
```
https://validator.schema.org/
```
Valida JSON-LD completo

### 3. DevTools (Manual)
1. F12 no navegador
2. Procure `<script type="application/ld+json">`
3. Copie JSON
4. Valide em https://jsonlint.com/

---

## ✅ Checklist Rápido

- [ ] Testar homepage no Rich Results Test
- [ ] Testar página de produto
- [ ] Testar FAQ
- [ ] Verificar Search Console
- [ ] Screenshots dos resultados

---

## 🐛 Erros Comuns

| Erro | Solução |
|------|---------|
| Missing image | Verificar URLs absolutas |
| Invalid price | Usar .toFixed(2) |
| Past priceValidUntil | Data futura (+90 dias) |
| Missing rating | Adicionar rating e reviewCount |

---

## 📊 Páginas com Schema

✅ Homepage - Organization + WebSite
✅ /mega-hair - Products + FAQ + Breadcrumb
✅ /faq - 50+ FAQs + Breadcrumb
✅ /contato - LocalBusiness + FAQ + Breadcrumb
✅ Todos produtos - Product + Rating

---

## 📚 Documentação Completa

- `SCHEMA_VALIDATION_GUIDE.md` - Guia de validação completo
- `SCHEMA_IMPLEMENTATION_SUMMARY.md` - Resumo da implementação
- `SCHEMA_TESTING_INSTRUCTIONS.md` - Instruções de teste

---

## 🎯 Resultados Esperados

### Rich Snippets
- ⭐ Estrelas de avaliação em produtos
- 💰 Preços visíveis na SERP
- 📋 FAQ expandível
- 🗂️ Breadcrumbs clicáveis
- 🏢 Knowledge Panel da empresa

### Métricas
- +15% CTR (1 mês)
- +20% tráfego orgânico (3 meses)
- 80%+ páginas com rich snippets

---

## 🔗 Links Úteis

- Rich Results Test: https://search.google.com/test/rich-results
- Schema Validator: https://validator.schema.org/
- Search Console: https://search.google.com/search-console
- Schema.org Docs: https://schema.org/

---

## 📞 Suporte

Email: dev@jchairstudios62.xyz
Docs: `/docs/seo/`

---

**Versão**: 1.0.0
**Status**: ✅ Production Ready
**Última Atualização**: 09/10/2025
