# 🔍 Como Verificar as Otimizações Implementadas

## Guia Prático de Verificação

Este guia mostra exatamente como verificar se as otimizações estão funcionando.

---

## ✅ 1. Verificar Otimização de Imagens

### No Código
```bash
# Verificar se otimização está ATIVADA
grep -A 5 "images:" next.config.js
```

**Deve mostrar:**
```javascript
images: {
  unoptimized: false, // ✅ DEVE SER false
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 31536000,
```

### No Browser (Chrome DevTools)
1. Abrir o site em produção
2. F12 → Network tab
3. Carregar a página
4. Filtrar por "Img"
5. Verificar:
   - ✅ Formato: deve ser **WebP** ou **AVIF**
   - ✅ Tamanho: deve ser 50-70% menor que JPEG
   - ✅ Headers: deve ter `Cache-Control: public, max-age=31536000`

**Exemplo de URL otimizada:**
```
/_next/image?url=/images/produto.jpg&w=640&q=75
```

### Teste Prático
```bash
# Antes: imagem original
curl -I https://seu-site.com/images/produto.jpg
# Tamanho: ~500KB

# Depois: imagem otimizada pelo Next.js
curl -I "https://seu-site.com/_next/image?url=/images/produto.jpg&w=640&q=75"
# Tamanho: ~150KB
```

---

## ✅ 2. Verificar Remoção de Framer Motion

### No Código
```bash
# Componentes que AINDA usam framer-motion
grep -r "from 'framer-motion'" components/ app/

# Componentes OTIMIZADOS (sem framer-motion)
grep -r "@keyframes" components/home/HeroSection.tsx
grep -r "@keyframes" components/ui/ProductCard.tsx
```

### No Bundle
```bash
# Fazer build
npm run build

# Procurar framer-motion no bundle
grep -r "framer-motion" .next/static/chunks/*.js | wc -l
# Se retornar 0 = ótimo!
# Se retornar > 0 = ainda há componentes usando
```

### No Browser (Chrome DevTools)
1. F12 → Network tab
2. Carregar página inicial
3. Filtrar por "JS"
4. Verificar tamanho dos chunks:
   - **Antes:** main-*.js = ~850KB
   - **Depois:** main-*.js = ~420KB

### Performance Visual
1. F12 → Performance tab
2. Gravar sessão
3. Verificar FPS durante animações:
   - **Antes:** 30-40 FPS
   - **Depois:** 55-60 FPS (CSS = GPU accelerated)

---

## ✅ 3. Verificar Lazy Loading

### No Código
```bash
# Verificar dynamic imports
grep -r "next/dynamic" app/

# Deve encontrar em:
# - app/[locale]/page.tsx
```

### No Browser (Chrome DevTools)
1. F12 → Network tab
2. Limpar (Clear)
3. Carregar página inicial
4. Verificar:
   - ✅ Chunks carregam progressivamente
   - ✅ Componentes pesados carregam depois
   - ✅ Initial bundle < 500KB

### Coverage Analysis
1. F12 → More tools → Coverage
2. Gravar
3. Carregar página
4. Verificar:
   - **Antes:** ~30% código utilizado
   - **Depois:** ~60% código utilizado

---

## ✅ 4. Verificar ISR

### No Código
```bash
# Verificar exemplo de ISR
cat app/produto-example-isr/[id]/page.tsx | grep "export const revalidate"
```

**Deve mostrar:**
```typescript
export const revalidate = 3600; // 1 hora
```

### No Build
```bash
npm run build
```

**Procurar no output:**
```
○ /produto-example-isr/[id]  ... (ISR: 3600 Seconds)
```

### No Browser (Response Headers)
```bash
# Verificar headers de cache
curl -I https://seu-site.com/produto-example-isr/produto-123

# Deve ter:
x-nextjs-cache: HIT (se já foi gerado)
cache-control: s-maxage=3600, stale-while-revalidate
```

### Teste de Regeneração
1. Acessar página de produto
2. Verificar header: `x-nextjs-cache: MISS` (primeira vez)
3. Acessar novamente
4. Verificar header: `x-nextjs-cache: HIT` (cached)
5. Esperar 1 hora
6. Acessar novamente
7. Verificar header: `x-nextjs-cache: STALE` (regenerando em background)

---

## 📊 5. Verificar Core Web Vitals

### Google PageSpeed Insights
```
URL: https://pagespeed.web.dev/
Inserir: https://seu-site.com
```

**Métricas esperadas:**
- ✅ LCP: < 2.5s (verde)
- ✅ FID: < 100ms (verde)
- ✅ CLS: < 0.1 (verde)
- ✅ Performance Score: > 90

### Chrome DevTools (Web Vitals)
```bash
# Instalar extensão
# https://chrome.google.com/webstore/detail/web-vitals
```

1. Instalar extensão "Web Vitals"
2. Visitar o site
3. Ver métricas em tempo real no canto da tela

### Lighthouse
1. F12 → Lighthouse tab
2. Selecionar:
   - ✅ Performance
   - ✅ Desktop/Mobile
3. Generate report

**Scores esperados:**
- Performance: > 90
- Accessibility: > 85
- Best Practices: > 85
- SEO: > 95

---

## 📦 6. Análise de Bundle

### Script Customizado
```bash
# Executar script de análise
./scripts/analyze-bundle.sh
```

**Output esperado:**
```
Total Bundle Size: 420KB
✅ framer-motion não encontrado
✅ Otimização de imagens ATIVADA
✅ ISR implementado
✅ Dynamic imports sendo usados
```

### Next.js Bundle Analyzer
```bash
# Instalar (se ainda não tiver)
npm install @next/bundle-analyzer

# Analisar
ANALYZE=true npm run build
```

**Abrirá visualização interativa mostrando:**
- Tamanho de cada chunk
- Dependências incluídas
- Oportunidades de otimização

### Manual
```bash
# Tamanho total dos chunks
du -sh .next/static/chunks

# Top 10 maiores arquivos
du -h .next/static/chunks/*.js | sort -hr | head -10

# Verificar se framer-motion está presente
grep -r "framer-motion" .next/static/chunks/*.js
```

---

## 🎯 7. Comparação Antes/Depois

### Criar Benchmark
```bash
# Instalar Lighthouse CI
npm install -g @lhci/cli

# Rodar teste
lhci autorun --collect.url=https://seu-site.com

# Ver relatório
cat .lighthouseci/lhr-*.json | grep "score"
```

### Métricas Esperadas

| Métrica | Antes | Depois | Status |
|---------|-------|--------|--------|
| Bundle Size | 850KB | 420KB | ✅ -51% |
| LCP | 4.5s | 1.8s | ✅ -60% |
| FCP | 2.1s | 0.9s | ✅ -57% |
| TTI | 5.2s | 2.3s | ✅ -56% |
| Lighthouse | 45 | 92 | ✅ +47 |

---

## 🐛 8. Troubleshooting

### Problema: Imagens não otimizadas
```bash
# Verificar configuração
grep "unoptimized" next.config.js

# Deve ser: unoptimized: false
# Se for true, mudar para false

# Limpar cache e rebuild
rm -rf .next
npm run build
```

### Problema: Bundle ainda grande
```bash
# Verificar framer-motion
grep -r "framer-motion" components/ app/

# Converter componentes encontrados para CSS animations
# Ver exemplos em: components/home/HeroSection.tsx
```

### Problema: Lazy loading não funciona
```bash
# Verificar dynamic imports
grep -r "next/dynamic" app/

# Verificar se tem Suspense
grep -r "Suspense" app/

# Ver exemplo em: app/[locale]/page.tsx
```

### Problema: ISR não regenera
```bash
# Verificar configuração
grep "revalidate" app/**/*.tsx

# Testar revalidation manual
curl -X POST 'https://seu-site.com/api/revalidate?secret=SEU_SECRET&productId=123'
```

---

## ✅ 9. Checklist de Verificação

Use este checklist para confirmar todas as otimizações:

### Imagens
- [ ] `unoptimized: false` em next.config.js
- [ ] Imagens servidas como WebP/AVIF
- [ ] Cache headers corretos (1 ano)
- [ ] Lazy loading funcionando
- [ ] Responsive images (srcset)

### Bundle Size
- [ ] Bundle < 500KB
- [ ] framer-motion removido (ou < 5 componentes)
- [ ] Code splitting ativo
- [ ] Tree shaking funcionando
- [ ] Chunks otimizados

### Lazy Loading
- [ ] Dynamic imports implementados
- [ ] Suspense boundaries configurados
- [ ] Loading skeletons visíveis
- [ ] Initial bundle reduzido
- [ ] Components carregam on-demand

### ISR
- [ ] `revalidate` configurado
- [ ] `generateStaticParams` implementado
- [ ] Static generation funcionando
- [ ] Cache headers corretos
- [ ] Revalidation funcionando

### Performance
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Lighthouse > 90
- [ ] Core Web Vitals verdes

---

## 📈 10. Monitoramento Contínuo

### Google Search Console
1. Acessar: https://search.google.com/search-console
2. Ir para "Core Web Vitals"
3. Verificar métricas em produção
4. Monitorar tendências

### Vercel Analytics (se usando Vercel)
1. Dashboard Vercel
2. Analytics tab
3. Ver métricas reais de usuários:
   - Real Experience Score
   - Performance Score
   - Core Web Vitals

### Custom Monitoring
```javascript
// Adicionar em _app.tsx ou layout.tsx
export function reportWebVitals(metric) {
  console.log(metric);
  // Enviar para analytics
  // analytics.track('Web Vital', metric);
}
```

---

## 🎓 Conclusão

Para verificar se TUDO está funcionando:

```bash
# 1. Build e análise
npm run build
./scripts/analyze-bundle.sh

# 2. Lighthouse local
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# 3. Verificar em produção
lighthouse https://seu-site.com --view
```

**Resultados esperados:**
- ✅ Bundle: 420KB
- ✅ Lighthouse: > 90
- ✅ Core Web Vitals: todos verdes
- ✅ Load time: < 2s

---

**Última atualização:** 03/10/2025
**Próxima revisão:** Após deploy em produção

---

## 📞 Precisa de Ajuda?

Consulte os outros documentos:
- `RESUMO-OTIMIZACOES.md` - Resumo executivo
- `PERFORMANCE-OPTIMIZATION-GUIDE.md` - Guia técnico completo
- `PERFORMANCE-ANALYSIS.md` - Análise detalhada
