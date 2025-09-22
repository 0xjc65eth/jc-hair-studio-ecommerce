# Testing Infrastructure - JC Hair Studio's 62

Este documento descreve a infraestrutura completa de testes implementada para o e-commerce JC Hair Studio's 62.

## 📋 Visão Geral

A infraestrutura de testes implementada inclui:

- ✅ **Testes Unitários** - Jest com React Testing Library
- ✅ **Testes de Integração API** - Testes de endpoints e serviços
- ✅ **Testes E2E** - Automação completa com Puppeteer
- ✅ **Testes de Acessibilidade** - Conformidade WCAG 2.1 AA com axe-core
- ✅ **Testes de Performance** - Lighthouse para Core Web Vitals
- ✅ **CI/CD Pipeline** - GitHub Actions com múltiplas etapas
- ✅ **Deploy Automatizado** - Integração com Vercel

## 🧪 Tipos de Testes

### 1. Testes Unitários
```bash
npm run test              # Executa testes unitários
npm run test:watch        # Modo watch
npm run test:coverage     # Com coverage
```

### 2. Testes de Integração API
```bash
npm run test:integration  # Testa endpoints e serviços
```

### 3. Testes End-to-End
```bash
npm run test:e2e         # Modo visual
npm run test:e2e:headless # Modo headless para CI
npm run test:e2e:dev     # Modo desenvolvimento
```

**Cenários testados:**
- ✅ Health check do servidor
- ✅ Navegação de produtos
- ✅ Funcionalidade do carrinho
- ✅ Newsletter e contato
- ✅ Páginas principais
- ✅ Autenticação
- ✅ Responsividade mobile
- ✅ Performance básica

### 4. Testes de Acessibilidade
```bash
npm run test:accessibility          # Modo visual
npm run test:accessibility:headless # Modo headless para CI
```

**Verificações WCAG 2.1 AA:**
- ✅ Contraste de cores
- ✅ Texto alternativo em imagens
- ✅ Navegação por teclado
- ✅ Estrutura de cabeçalhos
- ✅ Labels em formulários
- ✅ Compatibilidade com screen readers

### 5. Testes de Performance
```bash
npm run test:performance          # Modo visual
npm run test:performance:headless # Modo headless para CI
```

**Métricas avaliadas:**
- 🚀 Performance Score
- ⚡ First Contentful Paint (FCP)
- ⚡ Largest Contentful Paint (LCP)
- 🎯 Cumulative Layout Shift (CLS)
- 📊 Core Web Vitals

### 6. Suite Completa
```bash
npm run test:all   # Unit + Integration + E2E + Accessibility
npm run test:full  # Inclui também Performance
```

## 🔧 Configuração dos Testes

### Jest Configuration
- **Unit Tests**: `jest.config.js` - ambiente jsdom
- **Integration Tests**: `jest.config.integration.js` - ambiente Node.js

### Environment Variables
```env
TEST_BASE_URL=http://localhost:3001  # URL para testes
TEST_HEADLESS=true                   # Modo headless
MONGODB_URI=mongodb://...            # Database para testes
```

### Arquivos de Teste
```
tests/
├── e2e-automation.js              # Testes E2E
├── integration-test.js            # Testes de integração API
├── accessibility-minimal.mjs      # Testes de acessibilidade
├── performance-simple.mjs         # Testes de performance
└── reports/                       # Relatórios gerados
    ├── e2e-report.json
    ├── accessibility-report.json
    └── performance-report.json
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. CI Pipeline (`.github/workflows/ci.yml`)
**Jobs executados em paralelo:**

1. **Code Quality**
   - ESLint
   - TypeScript type check

2. **Tests**
   - Unit tests
   - Integration tests
   - MongoDB service

3. **E2E & Accessibility**
   - E2E automation
   - Accessibility tests
   - Report uploads

4. **Build Test**
   - Production build
   - Artifact upload

5. **Security**
   - npm audit
   - CodeQL analysis

6. **Performance** (main branch only)
   - Lighthouse CI
   - Performance reports

#### 2. Deploy Pipeline (`.github/workflows/deploy.yml`)
**Executado após CI bem-sucedido:**

1. **Deploy**
   - Vercel deployment
   - Production build

2. **Post-Deploy**
   - Smoke tests
   - Health checks
   - Notification

### Lighthouse CI Configuration
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['/', '/produtos', '/sobre', '/mega-hair', '/cosmeticos'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }]
      }
    }
  }
}
```

## 📊 Critérios de Qualidade

### Performance
- ✅ Performance Score ≥ 70/100
- ✅ FCP < 1800ms
- ✅ LCP < 2500ms
- ✅ CLS < 0.1

### Acessibilidade
- ✅ Accessibility Score ≥ 90/100
- ✅ Zero violações WCAG 2.1 AA
- ✅ Contraste adequado
- ✅ Navegação por teclado

### Code Quality
- ✅ ESLint sem erros
- ✅ TypeScript sem erros
- ✅ Testes unitários passando
- ✅ Coverage adequado

## 🛠️ Serviços Integrados

### MongoDB (Testes)
- **Unit/Integration**: Database em memória
- **E2E**: MongoDB service no GitHub Actions
- **Local**: MongoDB local ou Atlas

### Vercel (Deploy)
- **Staging**: Deploy automático de PRs
- **Production**: Deploy automático da main
- **Environment**: Variáveis sincronizadas

### GitHub (CI/CD)
- **Actions**: Pipelines automatizados
- **Artifacts**: Relatórios e builds
- **Notifications**: Status de deploy

## 📈 Monitoramento

### Relatórios Gerados
- **E2E Report**: Resultados detalhados dos testes E2E
- **Accessibility Report**: Violações e score WCAG
- **Performance Report**: Métricas e Core Web Vitals
- **Lighthouse Reports**: Análise completa de performance

### Artefatos do CI
- Build artifacts (30 dias)
- Test reports (30 dias)
- Lighthouse reports (30 dias)

## 🔄 Fluxo de Desenvolvimento

1. **Desenvolvimento Local**
   ```bash
   npm run dev                    # Inicia servidor
   npm run test:all              # Executa testes locais
   ```

2. **Pull Request**
   - CI pipeline executado automaticamente
   - Todos os testes devem passar
   - Code review obrigatório

3. **Merge para Main**
   - CI completo + testes de performance
   - Deploy automático para produção
   - Smoke tests pós-deploy

4. **Monitoramento**
   - Relatórios disponíveis nos GitHub Actions
   - Notificações de falhas
   - Métricas de performance trackadas

## 🎯 Próximos Passos

### Possíveis Melhorias
- [ ] Testes de carga com Artillery
- [ ] Testes visuais com Percy
- [ ] Monitoramento com Sentry
- [ ] Análise de bundle com Webpack Bundle Analyzer
- [ ] Testes de segurança com OWASP ZAP

### Configurações Recomendadas
- [ ] Branch protection rules
- [ ] Required status checks
- [ ] Automatic dependency updates
- [ ] Security alerts

---

**Status:** ✅ Infraestrutura completa implementada e funcional

**Última atualização:** Setembro 2025