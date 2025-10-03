# 🏗️ ESTRUTURA COMPLETA DO ADMIN PANEL

## 📂 Árvore de Arquivos

```
app/admin/
├── page.tsx                           # ✅ REFATORADO (255 linhas)
└── page.backup.tsx                    # 💾 Backup original (2,128 linhas)

components/admin/
├── hooks/                             # 🎣 Custom Hooks
│   ├── index.ts                       # Barrel export
│   ├── useAuth.ts                     # Autenticação (146 linhas)
│   ├── useOrders.ts                   # Gestão de pedidos (347 linhas)
│   ├── useDashboardStats.ts           # Estatísticas (166 linhas)
│   └── useNotifications.ts            # Notificações (239 linhas)
│
├── shared/                            # 🧩 Componentes Compartilhados
│   ├── index.ts                       # Barrel export
│   ├── StatsCard.tsx                  # Card de estatística (121 linhas)
│   ├── FilterBar.tsx                  # Barra de filtros (163 linhas)
│   ├── ActionButton.tsx               # Botão de ação (64 linhas)
│   ├── StatusBadge.tsx                # Badge de status (94 linhas)
│   └── AdminLayout.tsx                # Layout principal (234 linhas)
│
├── tabs/                              # 📑 Componentes de Tabs
│   ├── index.ts                       # Barrel export
│   ├── DashboardTab.tsx               # Dashboard (114 linhas)
│   ├── OrdersTab.tsx                  # Pedidos (325 linhas)
│   └── NotificationsTab.tsx           # Notificações (115 linhas)
│
├── modals/                            # 🔔 Componentes de Modais
│   └── OrderDetailModal.tsx           # Detalhes do pedido (242 linhas)
│
└── [existentes]
    ├── CampaignDashboard.tsx
    ├── DebugPanel.tsx
    ├── LowStockAlerts.tsx
    └── ProductionMonitoringDashboard.tsx
```

---

## 📊 ESTATÍSTICAS POR CATEGORIA

### Custom Hooks (898 linhas total)
| Arquivo | Linhas | Responsabilidade |
|---------|--------|------------------|
| `useAuth.ts` | 146 | Autenticação e sessão |
| `useOrders.ts` | 347 | Gestão completa de pedidos |
| `useDashboardStats.ts` | 166 | Estatísticas do dashboard |
| `useNotifications.ts` | 239 | Sistema de notificações |
| `index.ts` | 10 | Barrel exports |

### Componentes Shared (676 linhas total)
| Arquivo | Linhas | Responsabilidade |
|---------|--------|------------------|
| `StatsCard.tsx` | 121 | Card de estatística reutilizável |
| `FilterBar.tsx` | 163 | Barra de filtros universal |
| `ActionButton.tsx` | 64 | Botão de ação com ícone |
| `StatusBadge.tsx` | 94 | Badge visual de status |
| `AdminLayout.tsx` | 234 | Layout wrapper do admin |
| `index.ts` | 8 | Barrel exports |

### Componentes Tabs (554 linhas total)
| Arquivo | Linhas | Responsabilidade |
|---------|--------|------------------|
| `DashboardTab.tsx` | 114 | Tab do dashboard |
| `OrdersTab.tsx` | 325 | Tab de gestão de pedidos |
| `NotificationsTab.tsx` | 115 | Tab de notificações |
| `index.ts` | 6 | Barrel exports |

### Modais (242 linhas total)
| Arquivo | Linhas | Responsabilidade |
|---------|--------|------------------|
| `OrderDetailModal.tsx` | 242 | Modal de detalhes do pedido |

---

## 🔄 FLUXO DE DADOS

```
┌─────────────────────────────────────────────────────────┐
│                    app/admin/page.tsx                    │
│                  (Componente Principal)                  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              AUTHENTICATION                      │   │
│  │  useAuth() → { isAuthenticated, login, ... }    │   │
│  └─────────────────────────────────────────────────┘   │
│                           ↓                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │              ADMIN LAYOUT                        │   │
│  │  <AdminLayout activeTab={...} onTabChange={...}> │   │
│  │    - Header com stats                            │   │
│  │    - Navegação por tabs                          │   │
│  │    - Footer                                      │   │
│  └─────────────────────────────────────────────────┘   │
│                           ↓                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │           CONTENT (baseado na tab)               │   │
│  │                                                   │   │
│  │  Dashboard Tab                                    │   │
│  │  ├─ useDashboardStats()                          │   │
│  │  ├─ <StatsCard /> × 4                            │   │
│  │  └─ <LowStockAlerts />                           │   │
│  │                                                   │   │
│  │  Orders Tab                                       │   │
│  │  ├─ useOrders()                                  │   │
│  │  ├─ <FilterBar />                                │   │
│  │  ├─ <StatusBadge />                              │   │
│  │  └─ <ActionButton />                             │   │
│  │                                                   │   │
│  │  Notifications Tab                                │   │
│  │  ├─ useNotifications()                           │   │
│  │  └─ <ActionButton />                             │   │
│  └─────────────────────────────────────────────────┘   │
│                           ↓                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │              ORDER DETAIL MODAL                  │   │
│  │  <OrderDetailModal                               │   │
│  │    order={selectedOrder}                         │   │
│  │    isOpen={showOrderModal}                       │   │
│  │    onClose={...}                                 │   │
│  │  />                                              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 RESPONSABILIDADES POR CAMADA

### 1️⃣ **Camada de Apresentação** (Componentes)
**O que faz:**
- Renderiza UI
- Recebe props
- Dispara callbacks
- Exibe estado visual

**Não deve fazer:**
- Buscar dados de API
- Manipular lógica de negócio
- Gerenciar estado global

**Arquivos:**
- `tabs/*`
- `modals/*`
- `shared/StatsCard.tsx`
- `shared/StatusBadge.tsx`
- `shared/ActionButton.tsx`

---

### 2️⃣ **Camada de Lógica** (Custom Hooks)
**O que faz:**
- Busca dados de APIs
- Gerencia estado complexo
- Implementa regras de negócio
- Processa e transforma dados

**Não deve fazer:**
- Renderizar JSX
- Manipular DOM diretamente

**Arquivos:**
- `hooks/useAuth.ts`
- `hooks/useOrders.ts`
- `hooks/useDashboardStats.ts`
- `hooks/useNotifications.ts`

---

### 3️⃣ **Camada de Layout** (Estrutura)
**O que faz:**
- Define estrutura da página
- Gerencia navegação
- Exibe informações globais

**Arquivos:**
- `shared/AdminLayout.tsx`
- `shared/FilterBar.tsx`

---

### 4️⃣ **Camada de Coordenação** (Página Principal)
**O que faz:**
- Orquestra componentes
- Gerencia estado local
- Redireciona ações

**Arquivos:**
- `app/admin/page.tsx`

---

## 🔗 DEPENDÊNCIAS ENTRE COMPONENTES

```
page.tsx
  ├── useAuth                    (hook)
  ├── useDashboardStats          (hook)
  ├── AdminLayout                (shared)
  │   └── (Recebe stats e activeTab)
  ├── DashboardTab               (tab)
  │   ├── useDashboardStats      (hook)
  │   ├── StatsCard × 4          (shared)
  │   └── LowStockAlerts         (existente)
  ├── OrdersTab                  (tab)
  │   ├── useOrders              (hook)
  │   ├── FilterBar              (shared)
  │   ├── ActionButton           (shared)
  │   └── StatusBadge            (shared)
  ├── NotificationsTab           (tab)
  │   ├── useNotifications       (hook)
  │   └── ActionButton           (shared)
  └── OrderDetailModal           (modal)
      └── ActionButton           (shared)
```

---

## 📈 COMPARAÇÃO ANTES vs DEPOIS

### ANTES (Monolítico)
```
app/admin/page.tsx
  ├─ 2,128 linhas
  ├─ 1 arquivo gigante
  ├─ Toda lógica misturada
  ├─ Difícil de testar
  ├─ Difícil de manter
  └─ Sem documentação
```

### DEPOIS (Modular)
```
app/admin/page.tsx (255 linhas)
  ├─ 88% menos código
  ├─ 16 arquivos modulares
  ├─ Lógica separada em hooks
  ├─ Componentes reutilizáveis
  ├─ Fácil de testar
  ├─ Fácil de manter
  └─ Totalmente documentado
```

---

## 🚀 IMPORTS SIMPLIFICADOS

### Antes (Monolítico)
```typescript
// Tudo em um arquivo - sem imports
```

### Depois (Modular)
```typescript
// Imports organizados por responsabilidade

// Hooks
import { useAuth, useDashboardStats } from '@/components/admin/hooks';

// Shared Components
import { AdminLayout } from '@/components/admin/shared/AdminLayout';

// Tabs
import { DashboardTab, OrdersTab, NotificationsTab } from '@/components/admin/tabs';

// Modals
import { OrderDetailModal } from '@/components/admin/modals/OrderDetailModal';

// Existing Components
import { LowStockAlerts } from '@/components/admin/LowStockAlerts';
```

---

## 💡 PADRÕES DE USO

### 1. **Como adicionar nova tab**
```typescript
// 1. Criar arquivo em components/admin/tabs/
// components/admin/tabs/MyNewTab.tsx
export function MyNewTab() {
  // Usar hooks conforme necessário
  const { data, loading } = useMyCustomHook();

  return (
    <div>
      {/* Seu conteúdo aqui */}
    </div>
  );
}

// 2. Exportar em components/admin/tabs/index.ts
export { MyNewTab } from './MyNewTab';

// 3. Adicionar em app/admin/page.tsx
case 'my-new-tab':
  return <MyNewTab />;

// 4. Adicionar tab no AdminLayout
{ id: 'my-new-tab', name: 'Minha Tab', icon: MyIcon }
```

---

### 2. **Como criar novo hook**
```typescript
// components/admin/hooks/useMyFeature.ts
export function useMyFeature() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch('/api/my-endpoint');
    const result = await response.json();
    setData(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    refresh: fetchData,
  };
}

// Exportar em components/admin/hooks/index.ts
export { useMyFeature } from './useMyFeature';
```

---

### 3. **Como criar componente compartilhado**
```typescript
// components/admin/shared/MyComponent.tsx
interface MyComponentProps {
  title: string;
  onClick: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <button onClick={onClick}>
      {title}
    </button>
  );
}

// Exportar em components/admin/shared/index.ts
export { MyComponent } from './MyComponent';
```

---

## 📝 CONVENÇÕES DE CÓDIGO

### Nomenclatura
- **Hooks**: `use` + PascalCase (ex: `useOrders`, `useAuth`)
- **Componentes**: PascalCase (ex: `DashboardTab`, `StatsCard`)
- **Arquivos**: PascalCase (ex: `OrdersTab.tsx`, `useAuth.ts`)
- **Variáveis**: camelCase (ex: `selectedOrder`, `showModal`)
- **Constantes**: UPPER_CASE (ex: `MAX_RETRIES`, `API_URL`)

### Estrutura de Arquivo
```typescript
// 1. Imports
import { ... } from '...';

// 2. Interfaces/Types
interface MyProps {
  ...
}

// 3. Componente/Hook com JSDoc
/**
 * Descrição completa
 * @component ou @returns
 */
export function MyComponent({ props }: MyProps) {
  // 4. Estado
  const [state, setState] = useState();

  // 5. Hooks customizados
  const { data } = useMyHook();

  // 6. Funções auxiliares
  const handleClick = () => { ... };

  // 7. Effects
  useEffect(() => { ... }, []);

  // 8. Render
  return ( ... );
}
```

---

## ✅ CHECKLIST PARA NOVOS COMPONENTES

- [ ] Criar arquivo na pasta correta
- [ ] Adicionar JSDoc completo
- [ ] Tipar todas as props com TypeScript
- [ ] Adicionar ao barrel export (index.ts)
- [ ] Documentar exemplo de uso
- [ ] Seguir convenções de nomenclatura
- [ ] Implementar tratamento de erros
- [ ] Adicionar loading states quando necessário
- [ ] Garantir responsividade
- [ ] Testar em diferentes cenários

---

**Última atualização**: 03/10/2025
**Mantido por**: Claude Code (Anthropic)
