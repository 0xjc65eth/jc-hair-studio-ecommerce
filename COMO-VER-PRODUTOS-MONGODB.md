# 📦 Como Ver Seus Produtos no MongoDB

Você tem **155 produtos** no MongoDB! Aqui estão todas as formas de visualizá-los:

## 🚀 Comandos Rápidos

### 1. **Resumo Geral** (Mais Usado)
```bash
npx tsx scripts/view-products.ts
```

### 2. **Ver Todos os Produtos** (Primeiros 50)
```bash
npx tsx scripts/view-products.ts all
```

### 3. **Produtos por Categoria**
```bash
# Maquiagem (41 produtos)
npx tsx scripts/view-products.ts category maquiagem

# Tratamentos capilares (112 produtos)
npx tsx scripts/view-products.ts category tratamento_capilar

# Cuidados diários (2 produtos)
npx tsx scripts/view-products.ts category cuidados_diarios
```

### 4. **Produtos por Marca**
```bash
# Bruna Tavares (30 produtos)
npx tsx scripts/view-products.ts brand "Bruna Tavares"

# Mari Maria (11 produtos)
npx tsx scripts/view-products.ts brand "Mari Maria"

# Bio Extratus (18 produtos)
npx tsx scripts/view-products.ts brand "Bio Extratus"

# Novex (20 produtos)
npx tsx scripts/view-products.ts brand "Novex"
```

### 5. **Buscar Produtos**
```bash
# Buscar por "base"
npx tsx scripts/view-products.ts search "base"

# Buscar por "botox"
npx tsx scripts/view-products.ts search "botox"

# Buscar por "hidratação"
npx tsx scripts/view-products.ts search "hidratação"
```

### 6. **Produtos em Destaque**
```bash
npx tsx scripts/view-products.ts featured
```

## 🌐 Via API Web (Browser/Postman)

### Resumo Geral
```
GET http://localhost:3001/api/admin/products?action=summary
```

### Todos os Produtos
```
GET http://localhost:3001/api/admin/products?action=all&limit=100
```

### Por Categoria
```
GET http://localhost:3001/api/admin/products?action=category&category=maquiagem
GET http://localhost:3001/api/admin/products?action=category&category=tratamento_capilar
```

### Por Marca
```
GET http://localhost:3001/api/admin/products?action=brand&brand=Mari Maria
GET http://localhost:3001/api/admin/products?action=brand&brand=Bruna Tavares
```

### Buscar
```
GET http://localhost:3001/api/admin/products?action=search&search=base
GET http://localhost:3001/api/admin/products?action=search&search=botox
```

### Produtos em Destaque
```
GET http://localhost:3001/api/admin/products?action=featured
```

## 📊 Seus Dados Atuais

**Total de Produtos:** 155
**Total de Categorias:** 5

### Produtos por Categoria:
- **Tratamentos Capilares:** 112 produtos
- **Maquiagem:** 41 produtos
- **Cuidados Diários:** 2 produtos

### Top 10 Marcas:
1. **Bruna Tavares:** 30 produtos
2. **Novex:** 20 produtos
3. **Bio Extratus:** 18 produtos
4. **Mari Maria:** 11 produtos
5. **HairLife:** 8 produtos
6. **Salon Line:** 7 produtos
7. **TopVip:** 6 produtos
8. **Prohall:** 3 produtos
9. **Forever Liss:** 3 produtos
10. **Probelle:** 3 produtos

### Categorias Disponíveis:
- ⭐ **Maquiagem** (maquiagem)
- ⭐ **Tratamentos Capilares** (tratamento_capilar)
- ⭐ **Cuidados Diários** (cuidados_diarios)
- **Ferramentas Profissionais** (ferramentas)
- **Produtos Corporais** (corporais)

## 🔧 Scripts de Gestão

### Verificar Dados
```bash
npx tsx scripts/verify-seeding.ts
```

### Re-importar Todos os Produtos
```bash
curl -X POST "http://localhost:3001/api/seed?mode=comprehensive"
```

### Limpar e Re-importar
```bash
# Via API
curl -X POST "http://localhost:3001/api/seed?mode=comprehensive"

# Via Script
npx tsx scripts/seed-comprehensive.ts
```

## 📝 Exemplos de Produtos

### Maquiagem Mari Maria:
- **MAR-BASEMA-MAR:** Base Matte Velvet Skin - Amêndoa
- **MAR-BASEMA-001:** Base Matte Velvet Skin - Baunilha
- **MAR-BASEMA-002:** Base Matte Velvet Skin - Bege Claro

### Maquiagem Bruna Tavares:
- **BRU-BTSKIN-BTS:** BT Skin D10
- **BRU-BTSKIN-001:** BT Skin D20
- **BRU-BTSKIN-002:** BT Skin D30

### Tratamentos Capilares:
- Produtos Bio Extratus
- Produtos Novex
- Botox Capilares
- Hidratação

## 🎯 Dicas de Uso

1. **Para ver rapidamente:** Use `npx tsx scripts/view-products.ts`
2. **Para usar no browser:** Abra `http://localhost:3001/api/admin/products?action=summary`
3. **Para buscar específico:** Use o comando `search`
4. **Para desenvolver:** Use as APIs para integrar com seu frontend

Todos os seus produtos estão organizados e prontos para gestão! 🎉