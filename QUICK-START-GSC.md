# 🚀 QUICK START - Google Search Console

## ⚡ Ação Imediata (15 minutos)

### 1. Acesse o Google Search Console
**URL:** https://search.google.com/search-console

### 2. Adicione a Propriedade
- Tipo: **Prefixo de URL**
- Digite: `https://jchairstudios62.xyz`

### 3. Verifique (Escolha o método mais fácil)

#### Opção A: Meta Tag HTML (RECOMENDADO)
1. Google fornece: `<meta name="google-site-verification" content="ABC123..." />`
2. Adicione em `app/layout.tsx`:
```typescript
export const metadata = {
  verification: {
    google: 'ABC123...' // Cole o código aqui
  }
}
```
3. Deploy no Vercel
4. Aguarde 2 minutos
5. Clique "Verificar" no GSC

#### Opção B: Arquivo HTML
1. Baixe o arquivo `google[hash].html`
2. Coloque em `public/google[hash].html`
3. Deploy no Vercel
4. Clique "Verificar" no GSC

### 4. Submeta o Sitemap
1. No GSC, vá em: **Indexação > Sitemaps**
2. Digite: `sitemap.xml`
3. Clique em **Enviar**

### 5. Solicite Indexação Manual (Opcional)
Use "Inspecionar URL" para estas páginas:
- `https://jchairstudios62.xyz/`
- `https://jchairstudios62.xyz/produtos`
- `https://jchairstudios62.xyz/mega-hair`
- `https://jchairstudios62.xyz/pt/botox-capilar`

---

## 📊 Status Atual

✅ **Sitemap:** Online e funcionando (29 URLs)  
✅ **Robots.txt:** Otimizado  
✅ **IndexNow:** Configurado (aguardando propagação)  
✅ **URLs:** Todas acessíveis  

**Score de Prontidão:** 100% (4/4)

---

## 📅 Cronograma Esperado

| Tempo | Evento |
|-------|--------|
| Agora | Configurar GSC e submeter sitemap |
| 24-48h | Primeiras páginas indexadas |
| 1-2 semanas | Indexação completa (29 URLs) |
| 2-3 meses | Tráfego orgânico mensurável |

---

## 🔧 Scripts Disponíveis

```bash
# Verificar status de indexação
node scripts/check-indexation-status.mjs

# Ver guia completo de configuração
node scripts/gsc-setup-guide.mjs

# Ping a motores de busca (após 48h)
node scripts/ping-search-engines.mjs --indexnow --force
```

---

## 📚 Documentação Completa

- **Relatório Detalhado:** `RELATORIO-SUBMISSAO-GOOGLE.md`
- **Resumo Visual:** `RESUMO-SUBMISSAO-GOOGLE.txt`
- **Este Guia:** `QUICK-START-GSC.md`

---

## ⚠️ Importante

O Google **descontinuou** o serviço de ping em junho/2023.  
**Único método oficial:** Google Search Console

---

**Pronto para começar? Acesse:** https://search.google.com/search-console
