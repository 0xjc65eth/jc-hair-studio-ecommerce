# Guia de Testes - JC Hair Studio's 62

Este projeto inclui uma suíte completa de testes automatizados para garantir a qualidade e funcionamento do e-commerce.

## 🧪 Tipos de Testes

### 1. **Testes Unitários (Jest + React Testing Library)**
- Testa componentes individuais
- Validação de lógica de negócio
- Configuração: `jest.config.js` e `jest.setup.js`

### 2. **Testes de Integração de API**
- Testa endpoints da API sem interface
- Valida autenticação, newsletter, contato, etc.
- Arquivo: `tests/api-integration.test.js`

### 3. **Testes E2E (End-to-End)**
- Testa fluxos completos com Puppeteer
- Simula interação real do usuário
- Arquivo: `tests/e2e-automation.js`

## 🚀 Comandos de Teste

```bash
# Testes unitários básicos
npm test                    # Executa testes Jest
npm run test:watch          # Modo watch para desenvolvimento
npm run test:coverage       # Com relatório de cobertura

# Testes de integração de API
npm run test:integration    # Testa APIs sem front-end

# Testes E2E
npm run test:e2e           # E2E com configuração padrão
npm run test:e2e:headless  # E2E em modo headless (sem browser visível)
npm run test:e2e:dev       # E2E com browser visível (desenvolvimento)

# Todos os testes
npm run test:all           # Executa toda a suíte de testes
```

## ⚙️ Configuração de Ambiente

### Variáveis de Ambiente para Testes

Copie `tests/test.env` para `.env.test` ou configure:

```bash
# Base
TEST_BASE_URL=http://localhost:3000

# Banco de dados de teste
MONGODB_URI=mongodb://localhost:27017/jc-hair-studio-test

# SendGrid (use chaves de teste)
SENDGRID_API_KEY=SG.test-key
FROM_EMAIL=test@jchairstudios62.xyz

# Autenticação (use credenciais de teste)
GOOGLE_CLIENT_ID=test-client-id
GOOGLE_CLIENT_SECRET=test-client-secret

# Controle de testes
TEST_HEADLESS=true
TEST_TIMEOUT=30000
```

### Pré-requisitos

1. **Servidor local rodando**: `npm run dev`
2. **MongoDB disponível** (local ou test container)
3. **Puppeteer instalado**: Já incluído no `package.json`

## 📋 O que os Testes Verificam

### Testes E2E (`tests/e2e-automation.js`)

✅ **Verificações Realizadas:**
- Servidor acessível
- Seed do banco de dados
- Catálogo de produtos carregando
- Funcionalidade do carrinho
- Newsletter signup
- Formulário de contato
- Páginas principais (Home, Produtos, Sobre, etc.)
- Autenticação NextAuth
- Responsividade mobile
- Performance básica

### Testes de API (`tests/api-integration.test.js`)

✅ **APIs Testadas:**
- NextAuth providers e callbacks
- Newsletter (`POST /api/newsletter`)
- Contato (`POST /api/contact`)
- Carrinho (`GET /api/cart`)
- Seed (`GET /api/seed`)
- Produtos (varios endpoints)
- Verificações de segurança
- Health checks

## 🔧 Executando Testes

### 1. Desenvolvimento Local

```bash
# 1. Inicie o servidor
npm run dev

# 2. Em outro terminal, execute os testes
npm run test:all
```

### 2. Testes Específicos

```bash
# Apenas testes unitários
npm test

# Apenas APIs
npm run test:integration

# E2E com browser visível (debug)
npm run test:e2e:dev

# E2E silencioso
npm run test:e2e:headless
```

### 3. CI/CD Pipeline

```bash
# Para pipelines automatizados
TEST_HEADLESS=true npm run test:all
```

## 🐛 Troubleshooting

### Problemas Comuns

**1. Puppeteer não inicia:**
```bash
# Instalar dependências do sistema (Ubuntu/Debian)
sudo apt-get install -y libgconf-2-4 libxss1 libxtst6 libxrandr2 libasound2 libpangocairo-1.0-0 libatk1.0-0 libcairo-gobject2 libgtk-3-0 libgdk-pixbuf2.0-0

# macOS - geralmente funciona sem configuração adicional
```

**2. Testes de API falhando:**
- Verifique se `npm run dev` está rodando
- Confirme URLs em `TEST_BASE_URL`
- Verifique credenciais do SendGrid

**3. Timeout nos testes:**
```bash
# Aumentar timeout
TEST_TIMEOUT=60000 npm run test:e2e
```

**4. MongoDB não conecta:**
- Inicie MongoDB localmente: `mongod`
- Ou use Docker: `docker run -d -p 27017:27017 mongo`

## 📊 Interpretando Resultados

### Saída dos Testes E2E

```
🚀 Iniciando testes de E-commerce JC Hair Studio's 62
📍 URL Base: http://localhost:3000

🧪 Verificar saúde do servidor
✅ Verificar saúde do servidor - PASSOU

🧪 Executar seed do banco de dados
   📊 Seed executado: HTTP 200
✅ Executar seed do banco de dados - PASSOU

📊 Resultados dos Testes:
✅ Passou: 10
❌ Falhou: 0
```

### Códigos de Status

- ✅ **PASSOU**: Teste executado com sucesso
- ❌ **FALHOU**: Erro encontrado, veja detalhes
- ⚠️ **AVISO**: Funcionalidade não encontrada (não é erro)
- ℹ️ **INFO**: Informação adicional

## 🎯 Melhores Práticas

### 1. **Ambiente Isolado**
- Use banco de dados separado para testes
- Configure credenciais de teste
- Não use dados de produção

### 2. **Testes Determinísticos**
- Evite depender de dados externos variáveis
- Use mocks para APIs externas
- Reset estado entre testes

### 3. **Performance**
- Execute E2E em headless para CI/CD
- Use browser visível apenas para debug
- Paralelizar quando possível

### 4. **Manutenção**
- Atualize seletores quando UI mudar
- Mantenha timeouts realistas
- Documente testes complexos

## 📈 Próximos Passos

- [ ] Adicionar testes de performance (Lighthouse)
- [ ] Implementar testes de acessibilidade
- [ ] Configurar CI/CD com GitHub Actions
- [ ] Adicionar testes de carga (Artillery/k6)
- [ ] Implementar visual regression testing

## 🆘 Suporte

Se encontrar problemas com os testes:

1. Verifique este README
2. Confirme pré-requisitos
3. Execute com browser visível para debug: `npm run test:e2e:dev`
4. Veja logs detalhados nos arquivos de teste

---

**Developed for JC Hair Studio's 62** - E-commerce com 40+ anos de tradição familiar