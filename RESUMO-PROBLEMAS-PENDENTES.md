# Problemas Pendentes - /produtos e Relaxamentos

## Problema 1: Contador em /produtos ainda mostra 0 Relaxamentos

**Status**: ⚠️ NÃO RESOLVIDO

**O que foi feito**:
- ✅ JSON atualizado: 16 produtos com `category: "Relaxamentos"`
- ✅ Filtro em `app/produtos/page.tsx` atualizado para buscar `'Relaxamentos'` e `'relaxamentos'`
- ✅ Ícone mudado de 🌊 para 💆
- ✅ Cache limpo e servidor reiniciado

**Problema persiste**:
- Usuário reporta: "ainda precisa resolver algumas imagens e produtos em /produtos"
- Contador provavelmente ainda mostra `💆 Relaxamentos (0)`

**Possível causa**:
O `productResolver` carrega produtos de `allEuropeanProducts`, mas pode estar com cache ou problemas de compilação do TypeScript.

**Ação necessária**:
1. Hard refresh no browser: `Cmd+Shift+R` (Mac) ou `Ctrl+Shift+F5` (Windows)
2. Verificar se produtos aparecem após refresh
3. Verificar imagens que podem estar faltando

---

## Problema 2: /relaxamentos está "totalmente errado"

**Status**: ❌ PÁGINA NÃO EXISTE

**O que descobrimos**:
- ❌ Rota `/relaxamentos` não existe
- ✅ Existe `/categoria/[slug]/page.tsx` (dinâmica)
- 🔍 Precisa verificar se `/categoria/relaxamentos` funciona

**Possível causa**:
- Usuário pode estar tentando acessar `/relaxamentos` que não existe
- A rota correta é `/categoria/relaxamentos`
- Ou precisa criar redirect de `/relaxamentos` → `/categoria/relaxamentos`

**Ação necessária**:
1. Verificar se existe entrada em `categories.ts` para "relaxamentos"
2. Testar `/categoria/relaxamentos`
3. Se não funcionar, adicionar entrada no categories.ts
4. Criar redirect opcional: `/relaxamentos` → `/categoria/relaxamentos`

---

## Próximos Passos:

1. **Verificar categories.ts** - Ver se existe categoria "relaxamentos"
2. **Testar no browser** - Pedir ao usuário fazer hard refresh
3. **Verificar imagens** - Quais imagens específicas estão faltando?
4. **Criar redirect** - Se necessário: `/relaxamentos` → `/categoria/relaxamentos`
