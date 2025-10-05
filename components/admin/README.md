# 🎛️ Admin Panel Components

Componentes modulares para o painel administrativo da JC Hair Studio.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura](#estrutura)
- [Custom Hooks](#custom-hooks)
- [Componentes Compartilhados](#componentes-compartilhados)
- [Tabs](#tabs)
- [Modais](#modais)
- [Como Usar](#como-usar)
- [Exemplos](#exemplos)

---

## 🎯 Visão Geral

Esta pasta contém todos os componentes modulares do painel administrativo, organizados por responsabilidade:

- **hooks/**: Lógica de negócio (autenticação, pedidos, stats, notificações)
- **shared/**: Componentes reutilizáveis (cards, botões, filtros, layouts)
- **tabs/**: Componentes de cada aba do admin
- **modals/**: Modais e diálogos

### Métricas
- **16 arquivos** modulares
- **~2,500 linhas** total
- **100% documentado** com JSDoc
- **TypeScript** totalmente tipado

---

## 📁 Estrutura

```
components/admin/
├── hooks/                    # 🎣 Lógica de Negócio
│   ├── index.ts
│   ├── useAuth.ts
│   ├── useOrders.ts
│   ├── useDashboardStats.ts
│   └── useNotifications.ts
│
├── shared/                   # 🧩 Componentes Reutilizáveis
│   ├── index.ts
│   ├── StatsCard.tsx
│   ├── FilterBar.tsx
│   ├── ActionButton.tsx
│   ├── StatusBadge.tsx
│   └── AdminLayout.tsx
│
├── tabs/                     # 📑 Componentes de Tabs
│   ├── index.ts
│   ├── DashboardTab.tsx
│   ├── OrdersTab.tsx
│   └── NotificationsTab.tsx
│
└── modals/                   # 🔔 Modais
    └── OrderDetailModal.tsx
```

---

## 🎣 Custom Hooks

### useAuth
Gerenciamento de autenticação e sessão.

```typescript
import { useAuth } from '@/components/admin/hooks';

const { isAuthenticated, login, logout, authError } = useAuth();

// Login
await login('minha-senha');

// Logout
logout();
```

**Features:**
- ✅ Login com senha via API
- ✅ Sessão persistente (localStorage, 1 hora)
- ✅ Validação automática de sessão
- ✅ Tratamento de erros

---

### useOrders
Gestão completa de pedidos.

```typescript
import { useOrders } from '@/components/admin/hooks';

const {
  orders,
  filteredOrders,
  filters,
  loading,
  updateFilter,
  updateOrderStatus,
  createShippingLabel,
  exportToCSV,
} = useOrders(true); // Auto-refresh habilitado

// Filtrar por status
updateFilter('status', 'pending');

// Atualizar status
await updateOrderStatus(orderId, 'shipped');

// Criar etiqueta
const result = await createShippingLabel(order);

// Exportar CSV
const csv = exportToCSV();
```

**Features:**
- ✅ Filtros em tempo real
- ✅ Ordenação personalizável
- ✅ Criação de etiquetas
- ✅ Exportação CSV
- ✅ Auto-refresh 30s

---

### useDashboardStats
Estatísticas do dashboard.

```typescript
import { useDashboardStats } from '@/components/admin/hooks';

const {
  stats,
  loading,
  refresh,
  hasCriticalAlerts,
  getAlertCount,
} = useDashboardStats(true); // Auto-refresh habilitado

// Acessar estatísticas
console.log(stats.totalOrders);
console.log(stats.totalRevenue);

// Verificar alertas
if (hasCriticalAlerts()) {
  console.log(`${getAlertCount()} alertas críticos`);
}
```

**Features:**
- ✅ Total pedidos e receita
- ✅ Pedidos pendentes
- ✅ Stock baixo
- ✅ Auto-refresh 30s
- ✅ Detecção de alertas

---

### useNotifications
Sistema de notificações.

```typescript
import { useNotifications } from '@/components/admin/hooks';

const {
  notifications,
  loading,
  sendTestNotification,
  getTotalStats,
  getSuccessRate,
} = useNotifications();

// Enviar teste
await sendTestNotification();

// Estatísticas
const stats = getTotalStats();
const successRate = getSuccessRate(); // %
```

**Features:**
- ✅ Logs de emails enviados
- ✅ Taxa de sucesso/falha
- ✅ Notificações de teste
- ✅ Reenvio de notificações

---

## 🧩 Componentes Compartilhados

### StatsCard
Card de estatística com gradiente.

```typescript
import { StatsCard } from '@/components/admin/shared';
import { ShoppingCart } from 'lucide-react';

<StatsCard
  title="Total de Pedidos"
  value={150}
  subtitle="12 pendentes"
  icon={ShoppingCart}
  color="blue"
  loading={false}
  onClick={() => console.log('Clicado')}
/>
```

**Props:**
- `title`: string - Título do card
- `value`: string | number - Valor principal
- `subtitle?`: string - Informação adicional
- `icon`: LucideIcon - Ícone
- `color?`: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'pink'
- `loading?`: boolean - Estado de carregamento
- `onClick?`: () => void - Callback de clique

---

### FilterBar
Barra de filtros universal.

```typescript
import { FilterBar } from '@/components/admin/shared';

<FilterBar
  filters={{
    statusOptions: [
      { value: 'all', label: 'Todos' },
      { value: 'pending', label: 'Pendente' }
    ],
    statusValue: filters.status,
    onStatusChange: (value) => updateFilter('status', value),

    searchValue: filters.customer,
    searchPlaceholder: "Buscar cliente...",
    onSearchChange: (value) => updateFilter('customer', value),

    sortOptions: [
      { value: 'date', label: 'Data' },
      { value: 'value', label: 'Valor' }
    ],
    sortValue: filters.sortBy,
    onSortChange: (value) => updateFilter('sortBy', value),
  }}
  onReset={resetFilters}
  showReset={true}
/>
```

---

### ActionButton
Botão de ação com ícone.

```typescript
import { ActionButton } from '@/components/admin/shared';
import { Download } from 'lucide-react';

<ActionButton
  icon={Download}
  label="Exportar"
  onClick={handleExport}
  variant="outline"
  size="sm"
  loading={false}
  disabled={false}
/>
```

**Variantes:**
- `default`: Botão primário (azul)
- `outline`: Botão com borda
- `ghost`: Botão transparente
- `destructive`: Botão de ação destrutiva (vermelho)

---

### StatusBadge
Badge visual de status.

```typescript
import { StatusBadge } from '@/components/admin/shared';

<StatusBadge
  status="pending"
  size="md"
  showIcon={true}
/>
```

**Status disponíveis:**
- `pending` → 🟡 Amarelo (Pendente)
- `processing` → 🔵 Azul (Processando)
- `shipped` → 🟣 Roxo (Enviado)
- `delivered` → 🟢 Verde (Entregue)
- `cancelled` → 🔴 Vermelho (Cancelado)

---

### AdminLayout
Layout wrapper do admin.

```typescript
import { AdminLayout } from '@/components/admin/shared/AdminLayout';

<AdminLayout
  activeTab="dashboard"
  onTabChange={(tab) => setActiveTab(tab)}
  stats={{
    totalOrders: 150,
    totalRevenue: 5000,
    pendingOrders: 12
  }}
  statsLoading={false}
>
  {/* Conteúdo da tab ativa */}
  <DashboardTab />
</AdminLayout>
```

**Features:**
- ✅ Header com logo e stats
- ✅ Navegação por tabs
- ✅ Indicador de sistema online
- ✅ Footer com contatos
- ✅ Design responsivo

---

## 📑 Tabs

### DashboardTab
Dashboard principal.

```typescript
import { DashboardTab } from '@/components/admin/tabs';

<DashboardTab />
```

**Inclui:**
- 4 cards de estatísticas
- Indicador de sistema
- Alertas de stock
- Auto-refresh 30s

---

### OrdersTab
Gestão de pedidos.

```typescript
import { OrdersTab } from '@/components/admin/tabs';

<OrdersTab
  onOrderSelect={(order) => setSelectedOrder(order)}
/>
```

**Inclui:**
- Listagem completa
- Filtros avançados
- Visualização de produtos
- Ações por pedido
- Exportação CSV

---

### NotificationsTab
Sistema de notificações.

```typescript
import { NotificationsTab } from '@/components/admin/tabs';

<NotificationsTab />
```

**Inclui:**
- Logs de emails
- Taxa de sucesso
- Notificações de teste

---

## 🔔 Modais

### OrderDetailModal
Detalhes completos do pedido.

```typescript
import { OrderDetailModal } from '@/components/admin/modals/OrderDetailModal';

<OrderDetailModal
  order={selectedOrder}
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onCreateLabel={(order) => handleCreateLabel(order)}
  onUpdateStatus={(orderId, status) => handleUpdateStatus(orderId, status)}
/>
```

**Seções:**
- ✅ Info do cliente
- ✅ Endereço de entrega
- ✅ Lista de produtos
- ✅ Resumo de valores
- ✅ Ações rápidas

---

## 🚀 Como Usar

### 1. Importar o que precisa

```typescript
// Hooks
import { useAuth, useOrders, useDashboardStats } from '@/components/admin/hooks';

// Shared Components
import { StatsCard, FilterBar, ActionButton } from '@/components/admin/shared';

// Tabs
import { DashboardTab, OrdersTab } from '@/components/admin/tabs';

// Modals
import { OrderDetailModal } from '@/components/admin/modals/OrderDetailModal';
```

### 2. Usar em seu componente

```typescript
export function MyAdminPage() {
  // Hooks
  const { isAuthenticated } = useAuth();
  const { stats } = useDashboardStats(true);
  const { orders, filters, updateFilter } = useOrders(true);

  // Estado local
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      stats={stats}
    >
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'orders' && <OrdersTab />}
    </AdminLayout>
  );
}
```

---

## 📝 Exemplos Completos

### Exemplo 1: Criar nova tab de Relatórios

```typescript
// 1. Criar componente em components/admin/tabs/ReportsTab.tsx
'use client';

export function ReportsTab() {
  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Relatórios</h3>
      {/* Seu conteúdo aqui */}
    </div>
  );
}

// 2. Exportar em components/admin/tabs/index.ts
export { ReportsTab } from './ReportsTab';

// 3. Usar em app/admin/page.tsx
import { ReportsTab } from '@/components/admin/tabs';

case 'reports':
  return <ReportsTab />;
```

---

### Exemplo 2: Criar hook customizado

```typescript
// components/admin/hooks/useReports.ts
import { useState, useEffect } from 'react';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    const response = await fetch('/api/admin/reports');
    const data = await response.json();
    setReports(data.reports);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    refresh: fetchReports,
  };
}

// Exportar em components/admin/hooks/index.ts
export { useReports } from './useReports';

// Usar em componente
import { useReports } from '@/components/admin/hooks';

const { reports, loading, refresh } = useReports();
```

---

### Exemplo 3: Dashboard customizado

```typescript
import {
  useDashboardStats,
  useAuth,
} from '@/components/admin/hooks';
import {
  StatsCard,
  AdminLayout,
} from '@/components/admin/shared';
import { ShoppingCart, DollarSign } from 'lucide-react';

export function CustomDashboard() {
  const { isAuthenticated } = useAuth();
  const { stats, loading } = useDashboardStats(isAuthenticated);

  return (
    <div className="grid grid-cols-2 gap-6">
      <StatsCard
        title="Pedidos"
        value={stats.totalOrders}
        icon={ShoppingCart}
        color="blue"
        loading={loading}
      />
      <StatsCard
        title="Receita"
        value={`€${stats.totalRevenue.toFixed(2)}`}
        icon={DollarSign}
        color="green"
        loading={loading}
      />
    </div>
  );
}
```

---

## 🔧 Desenvolvimento

### Adicionar novo componente

1. Criar arquivo na pasta apropriada
2. Adicionar JSDoc completo
3. Tipar props com TypeScript
4. Adicionar ao barrel export (index.ts)
5. Documentar exemplo de uso

### Convenções

- **Hooks**: `use` + PascalCase
- **Componentes**: PascalCase
- **Arquivos**: PascalCase
- **Props**: camelCase

### Estrutura de arquivo

```typescript
// 1. Imports
import { ... } from '...';

// 2. Interfaces
interface MyProps {
  ...
}

// 3. JSDoc + Componente
/**
 * Descrição
 * @component
 */
export function MyComponent({ ... }: MyProps) {
  // 4. Hooks e estado
  // 5. Funções
  // 6. Effects
  // 7. Render
}
```

---

## 📚 Documentação Adicional

- [REFACTORING_SUMMARY.md](../../REFACTORING_SUMMARY.md) - Resumo completo da refatoração
- [REFACTORING_CHECKLIST.md](../../REFACTORING_CHECKLIST.md) - Checklist de funcionalidades
- [ADMIN_STRUCTURE.md](../../ADMIN_STRUCTURE.md) - Estrutura e arquitetura

---

## 🆘 Suporte

Para dúvidas ou problemas:
1. Consultar documentação JSDoc nos arquivos
2. Verificar exemplos neste README
3. Consultar REFACTORING_SUMMARY.md

---

**Desenvolvido por**: Claude Code (Anthropic)
**Última atualização**: 03/10/2025
**Versão**: 1.0.0
