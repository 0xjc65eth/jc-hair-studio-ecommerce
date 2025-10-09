# Guia Rápido de Uso - Meta Tags Otimizadas

## 🚀 Como Usar as Novas Meta Tags

### 1. Layout Principal (Raiz do Site)

O arquivo `/app/layout.tsx` já está configurado com meta tags otimizadas. **Não requer alteração**.

**O que foi otimizado:**
- ✅ Título: 54 caracteres (otimizado para mobile)
- ✅ Description: 158 caracteres (CTR otimizado)
- ✅ 11 idiomas com hreflang
- ✅ Open Graph completo
- ✅ Twitter Cards
- ✅ Geo-targeting para Portugal

---

### 2. Páginas de Produto

Use o gerador de meta tags para produtos:

```typescript
import { generateProductMeta } from '@/lib/utils/metaTags';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);

  return generateProductMeta(product);
}
```

**Formato esperado do produto:**
```typescript
{
  id: string,
  name: string,        // ou nome
  description: string, // ou descricao
  brand: string,       // ou marca
  price: number,       // ou preco_eur
  category: string,
  images: string[]     // ou imagens
}
```

---

### 3. Páginas de Categoria

Use o gerador de meta tags para categorias:

```typescript
import { generateCategoryMeta } from '@/lib/utils/metaTags';

export async function generateMetadata({ params }): Promise<Metadata> {
  const products = await getCategoryProducts(params.slug);

  return generateCategoryMeta(params.slug, products);
}
```

**Categorias suportadas:**
- `mega-hair` - Mega Hair Brasileiro
- `progressivas` - Progressivas e Tratamentos
- `maquiagens` - Maquiagem Brasileira
- `esmaltes` - Esmaltes IMPALA
- `perfumes` - Perfumes Virginia
- `tintas` - Tintas Capilares

---

### 4. Homepage

Use o gerador de homepage:

```typescript
import { generateHomepageMeta } from '@/lib/utils/metaTags';

export const metadata = generateHomepageMeta();
```

---

### 5. Páginas de Conteúdo/Blog

Use o gerador de conteúdo:

```typescript
import { generateContentMeta } from '@/lib/utils/metaTags';

export const metadata = generateContentMeta(
  'Como Aplicar Mega Hair Brasileiro',
  'Guia completo passo a passo...',
  'blog/como-aplicar-mega-hair',
  '/images/blog/mega-hair-aplicacao.jpg',
  '2024-10-09',
  'Julio César'
);
```

---

## 🎨 Personalização de Meta Tags

### Configuração Centralizada

Edite `/lib/config/seo-config.ts` para ajustar:

```typescript
export const SEO_CONFIG = {
  siteName: "JC Hair Studio's 62",
  siteTitle: 'Mega Hair & Produtos...',
  siteDescription: 'Mega hair 100%...',
  baseUrl: 'https://jchairstudios62.xyz',
  twitterHandle: '@jchairstudios62',
  email: 'contato@jchairstudios62.xyz',
  phone: '+351928375226',
  // ...
}
```

### Keywords por Categoria

Ajuste keywords no mesmo arquivo:

```typescript
keywords: {
  primary: [
    'mega hair brasileiro',
    'progressiva vogue',
    // ...
  ],
  // ...
}
```

---

## 🔍 Validação de Meta Tags

### Função de Validação

```typescript
import { validateMetadata } from '@/lib/config/seo-config';

const metadata = generateProductMeta(product);
const validation = validateMetadata(metadata);

if (!validation.valid) {
  console.error('Erros:', validation.errors);
  console.warn('Avisos:', validation.warnings);
}
```

**Regras de Validação:**
- ✅ Título: 30-60 caracteres
- ✅ Description: 120-160 caracteres
- ✅ Imagem OG: Obrigatória
- ✅ Canonical URL: Recomendado

---

## 🌍 hreflang Tags

### Implementação Automática

As hreflang tags são geradas automaticamente para 11 idiomas:

```typescript
import { generateHreflangTags } from '@/lib/config/seo-config';

// No <head>
<script dangerouslySetInnerHTML={{
  __html: generateHreflangTags('/mega-hair')
}} />
```

**Idiomas suportados:**
- 🇵🇹 Português (Portugal)
- 🇧🇷 Português (Brasil)
- 🇺🇸 English (US)
- 🇬🇧 English (UK)
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇧🇪 Nederlands (BE)
- 🇳🇱 Nederlands (NL)
- 🌐 x-default

---

## 📊 Monitoramento

### Ferramentas Recomendadas

#### Validação de Meta Tags
1. **[Meta Tags Checker](https://metatags.io/)**
   - Cole a URL
   - Veja preview em Google, Facebook, Twitter

2. **[Open Graph Debugger](https://www.opengraph.xyz/)**
   - Valida OG tags
   - Mostra erros e avisos

3. **[Twitter Card Validator](https://cards-dev.twitter.com/validator)**
   - Valida Twitter Cards
   - Preview no Twitter

#### SEO Técnico
4. **[Google Rich Results Test](https://search.google.com/test/rich-results)**
   - Valida Structured Data
   - Mostra rich snippets

5. **[Schema Markup Validator](https://validator.schema.org/)**
   - Valida JSON-LD
   - Mostra erros de schema

#### Performance
6. **[PageSpeed Insights](https://pagespeed.web.dev/)**
   - Core Web Vitals
   - Mobile vs Desktop

---

## 🛠️ Troubleshooting

### Problema: Meta tags não aparecem no preview

**Solução:**
1. Limpe o cache do Next.js: `rm -rf .next`
2. Rebuild: `npm run build`
3. Use o cache buster: adicione `?v=2` na URL

### Problema: Imagem OG não carrega

**Solução:**
1. Verifique se a imagem existe em `/public`
2. Use URL absoluta: `https://jchairstudios62.xyz/og-image.jpg`
3. Imagem deve ser 1200x630px (min)

### Problema: hreflang não indexa

**Solução:**
1. Verifique URLs no sitemap.xml
2. Submeta sitemap ao Google Search Console
3. Aguarde 1-2 semanas para indexação

---

## 📋 Checklist de Implementação

### Antes do Deploy
- [ ] Configurar variáveis de ambiente
- [ ] Gerar imagens OG (1200x630)
- [ ] Testar meta tags localmente
- [ ] Validar com ferramentas online

### Após Deploy
- [ ] Testar URLs de produção
- [ ] Submeter sitemap ao GSC
- [ ] Validar rich snippets
- [ ] Monitorar indexação

### Manutenção Mensal
- [ ] Analisar CTR no Search Console
- [ ] Ajustar descriptions com baixo CTR
- [ ] Testar novos formatos de título
- [ ] Atualizar keywords conforme tendências

---

## 📞 Contatos e Recursos

### Documentação
- **Configuração SEO**: `/lib/config/seo-config.ts`
- **Geradores**: `/lib/utils/metaTags.ts`
- **Relatório Completo**: `/SEO-OPTIMIZATION-REPORT.md`

### Suporte
- **Email**: contato@jchairstudios62.xyz
- **Telefone**: +351 928 375 226

---

## 🎯 Metas de SEO

### Curto Prazo (3 meses)
- 🎯 100% páginas indexadas
- 🎯 CTR médio > 5%
- 🎯 Top 10 para 5+ keywords principais

### Médio Prazo (6 meses)
- 🎯 Top 5 para keywords principais
- 🎯 Featured snippets para 3+ queries
- 🎯 1000+ visitantes orgânicos/mês

### Longo Prazo (12 meses)
- 🎯 Top 3 para keywords principais
- 🎯 5000+ visitantes orgânicos/mês
- 🎯 Domain Authority > 30

---

**Última atualização**: 09 de Outubro de 2025
**Versão**: 1.0.0
**Status**: ✅ Pronto para uso
