# Schema.org - Instruções de Teste

## 🎯 Objetivo
Validar todos os schemas implementados e garantir que estão gerando rich snippets corretamente no Google.

---

## 📋 Pré-requisitos

1. Site em produção: https://jchairstudios62.xyz
2. Acesso ao Google Search Console
3. Navegador Chrome/Firefox atualizado

---

## 🧪 Testes a Realizar

### TESTE 1: Google Rich Results Test

#### Página: Homepage
```
URL: https://jchairstudios62.xyz/
```

**Schemas Esperados**:
- ✅ Organization
- ✅ WebSite com SearchAction

**Como Testar**:
1. Acesse: https://search.google.com/test/rich-results
2. Cole a URL da homepage
3. Clique em "Test URL"
4. Aguarde análise

**Resultado Esperado**:
- ✅ "Page is eligible for rich results"
- ✅ 2 schemas detectados
- ✅ 0 erros
- ⚠️ Avisos podem aparecer (são OK se não críticos)

**Screenshot**: Tire um screenshot dos resultados

---

#### Página: Mega Hair (Categoria)
```
URL: https://jchairstudios62.xyz/mega-hair
```

**Schemas Esperados**:
- ✅ BreadcrumbList (2 itens)
- ✅ FAQPage (5 perguntas)
- ✅ Product (múltiplos produtos)

**Como Testar**:
1. Acesse: https://search.google.com/test/rich-results
2. Cole a URL
3. Clique em "Test URL"

**Resultado Esperado**:
- ✅ BreadcrumbList válido
- ✅ FAQPage válido
- ✅ Produtos com preço e avaliação

**Validações Específicas**:
- [ ] Breadcrumb tem "Início" e "Mega Hair Brasileiro"
- [ ] FAQ tem 5 perguntas sobre mega hair
- [ ] Produtos mostram preço em EUR
- [ ] Produtos têm rating/reviews

---

#### Página: FAQ
```
URL: https://jchairstudios62.xyz/faq
```

**Schemas Esperados**:
- ✅ FAQPage (50+ perguntas)
- ✅ BreadcrumbList

**Como Testar**:
1. Rich Results Test com URL
2. Verificar quantidade de FAQs detectadas

**Resultado Esperado**:
- ✅ FAQPage com 50+ perguntas
- ✅ Todas perguntas têm respostas completas
- ✅ Breadcrumb correto

**Validações**:
- [ ] Todas 6 categorias de FAQ presentes
- [ ] Respostas têm mais de 150 caracteres
- [ ] Sem erros de formatação

---

#### Página: Contato
```
URL: https://jchairstudios62.xyz/contato
```

**Schemas Esperados**:
- ✅ LocalBusiness (HairSalon)
- ✅ BreadcrumbList
- ✅ FAQPage

**Como Testar**:
1. Rich Results Test
2. Validar LocalBusiness

**Resultado Esperado**:
- ✅ HairSalon detectado
- ✅ Endereço completo
- ✅ Horários de funcionamento
- ✅ Telefone e email

**Validações**:
- [ ] Endereço: R. Gil Vicente, N°5
- [ ] Cidade: Seixal, Portugal
- [ ] Telefone: +351928375226
- [ ] Geolocalização presente

---

#### Página: Produto Individual
```
URL: https://jchairstudios62.xyz/produto/mega-hair-50cm-liso-preto
```

**Schemas Esperados**:
- ✅ Product completo
- ✅ AggregateRating
- ✅ Offer com preço

**Como Testar**:
1. Rich Results Test
2. Verificar todos campos do produto

**Resultado Esperado**:
- ✅ Nome do produto
- ✅ Descrição
- ✅ Imagens (array)
- ✅ Preço em EUR
- ✅ Disponibilidade: InStock
- ✅ Rating: 4.9/5
- ✅ Reviews: 342
- ✅ SKU presente
- ✅ Brand: JC Hair Studio's 62

**Validações**:
- [ ] Preço: €94.50
- [ ] priceValidUntil é data futura
- [ ] Availability: InStock
- [ ] Shipping details presentes
- [ ] Material: 100% Human Hair
- [ ] Country of Origin: BR

---

### TESTE 2: Schema.org Validator

#### Como Usar
1. Acesse: https://validator.schema.org/
2. Escolha "Fetch URL"
3. Cole URL da página
4. Clique "Run Test"

#### URLs para Validar
```
✅ https://jchairstudios62.xyz/
✅ https://jchairstudios62.xyz/mega-hair
✅ https://jchairstudios62.xyz/faq
✅ https://jchairstudios62.xyz/contato
✅ https://jchairstudios62.xyz/produto/mega-hair-50cm-liso-preto
```

**Resultado Esperado**:
- ✅ 0 erros críticos
- ⚠️ Avisos são aceitáveis
- ✅ JSON-LD bem formatado

---

### TESTE 3: Validação Manual (Chrome DevTools)

#### Passo a Passo
1. Abra a página no Chrome
2. Pressione F12 (DevTools)
3. Vá para aba "Elements"
4. Procure por `<script type="application/ld+json">`
5. Copie o conteúdo JSON
6. Cole em https://jsonlint.com/
7. Verifique se é JSON válido

#### Checklist para Cada Página

**Homepage**:
- [ ] Organization schema presente
- [ ] WebSite schema com searchAction
- [ ] Logo URL válida
- [ ] Redes sociais presentes

**Mega Hair**:
- [ ] Breadcrumb com 2 níveis
- [ ] FAQ com 5 perguntas
- [ ] Todos produtos têm schema

**FAQ**:
- [ ] 50+ FAQs no schema
- [ ] Todas categorias incluídas

**Contato**:
- [ ] LocalBusiness tipo HairSalon
- [ ] Geolocalização presente
- [ ] Horários corretos

**Produto**:
- [ ] Preço correto
- [ ] Imagens presentes
- [ ] Rating presente
- [ ] SKU único

---

### TESTE 4: Google Search Console

#### Configuração Inicial
1. Acesse: https://search.google.com/search-console
2. Selecione propriedade: jchairstudios62.xyz
3. Aguarde indexação (pode levar 1-2 dias)

#### Verificações

**1. Enhancements > Products**
- [ ] Produtos detectados
- [ ] 0 erros
- [ ] Avisos aceitáveis
- [ ] Preços válidos

**2. Enhancements > Breadcrumbs**
- [ ] Breadcrumbs detectados
- [ ] Hierarquia correta
- [ ] URLs absolutas

**3. Enhancements > FAQ**
- [ ] FAQs detectados
- [ ] Páginas elegíveis para rich results

**4. Coverage**
- [ ] Todas páginas indexadas
- [ ] 0 erros de indexação

---

## 📊 Planilha de Testes

| Página | Rich Results | Schema Validator | DevTools | Search Console | Status |
|--------|-------------|------------------|----------|----------------|--------|
| Homepage | [ ] | [ ] | [ ] | [ ] | ⏳ |
| Mega Hair | [ ] | [ ] | [ ] | [ ] | ⏳ |
| FAQ | [ ] | [ ] | [ ] | [ ] | ⏳ |
| Contato | [ ] | [ ] | [ ] | [ ] | ⏳ |
| Produto 1 | [ ] | [ ] | [ ] | [ ] | ⏳ |
| Produto 2 | [ ] | [ ] | [ ] | [ ] | ⏳ |

---

## 🐛 Troubleshooting

### Erro: "Missing required field 'image'"
**Solução**: Verificar se todas imagens têm URLs absolutas

### Erro: "Invalid price format"
**Solução**: Garantir que preço usa .toFixed(2)

### Erro: "priceValidUntil is in the past"
**Solução**: Data deve ser futura (código já corrigido para +90 dias)

### Aviso: "URL is not accessible"
**Solução**: Verificar se site está em produção e acessível

### Erro: "Missing aggregateRating"
**Solução**: Adicionar rating e reviewCount nos produtos

---

## ✅ Critérios de Sucesso

### Mínimo Aceitável
- [ ] 0 erros críticos no Rich Results Test
- [ ] Todos schemas detectados corretamente
- [ ] JSON válido em todas páginas
- [ ] URLs absolutas funcionando

### Ideal
- [ ] Rich snippets aparecendo na SERP real
- [ ] Knowledge Panel para organização
- [ ] SearchBox nos resultados
- [ ] FAQ expandível na SERP
- [ ] Estrelas de produto visíveis

---

## 📅 Timeline de Testes

### Dia 1: Validação Técnica
- ✅ Implementação completa
- ⏳ Rich Results Test (todas páginas)
- ⏳ Schema Validator
- ⏳ DevTools manual

### Dia 2-3: Correções
- ⏳ Corrigir erros encontrados
- ⏳ Re-testar páginas corrigidas
- ⏳ Submeter sitemap atualizado

### Dia 4-7: Monitoramento
- ⏳ Verificar Search Console diariamente
- ⏳ Solicitar reindexação
- ⏳ Monitorar aparição de rich snippets

### Semana 2: Otimização
- ⏳ Análise de performance
- ⏳ Ajustes baseados em feedback
- ⏳ Expansão de schemas se necessário

---

## 📸 Screenshots Necessários

Tire screenshots de:
1. Rich Results Test - Homepage (com schemas detectados)
2. Rich Results Test - Produto (mostrando preço e rating)
3. Rich Results Test - FAQ (mostrando perguntas)
4. Schema Validator - Sem erros
5. DevTools - JSON-LD bem formatado
6. Search Console - Enhancements OK

Salvar em: `/docs/seo/screenshots/`

---

## 📝 Relatório de Testes

Após completar os testes, preencher:

**Data dos Testes**: _______________

**Testador**: _______________

**Resultados**:
- Páginas testadas: _____ / 5
- Schemas válidos: _____ / 7
- Erros encontrados: _____
- Erros corrigidos: _____

**Observações**:
```
[Suas observações aqui]
```

**Status Final**: [ ] Aprovado [ ] Reprovado

**Próximos Passos**:
```
[Ações necessárias]
```

---

## 🎓 Recursos de Suporte

### Documentação Oficial
- Google Search Central: https://developers.google.com/search
- Schema.org: https://schema.org/
- JSON-LD: https://json-ld.org/

### Ferramentas
- Rich Results Test: https://search.google.com/test/rich-results
- Schema Validator: https://validator.schema.org/
- JSON Lint: https://jsonlint.com/
- Search Console: https://search.google.com/search-console

### Suporte Interno
- Email: dev@jchairstudios62.xyz
- Documentação: `/SCHEMA_VALIDATION_GUIDE.md`
- Resumo: `/SCHEMA_IMPLEMENTATION_SUMMARY.md`

---

## ✨ Dicas Finais

1. **Seja Paciente**: Rich snippets podem levar 1-2 semanas para aparecer
2. **Monitore Diariamente**: Verifique Search Console todos os dias
3. **Documente Tudo**: Tire screenshots de sucessos e erros
4. **Teste Regularmente**: Re-teste após qualquer mudança no site
5. **Mantenha Atualizado**: Preços, reviews, e FAQs devem estar sempre atuais

---

**Boa Sorte com os Testes!** 🚀

Se encontrar problemas, consulte `/SCHEMA_VALIDATION_GUIDE.md` para soluções detalhadas.
