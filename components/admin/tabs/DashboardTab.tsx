'use client';

import { useDashboardStats } from '../hooks';
import { StatsCard } from '../shared';
import { LowStockAlerts } from '../LowStockAlerts';
import {
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Tag,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * DashboardTab Component
 *
 * Tab principal do dashboard administrativo.
 * Exibe visão geral do negócio com estatísticas principais.
 *
 * Features:
 * - Estatísticas em tempo real (auto-refresh 30s)
 * - 4 cards principais: Pedidos, Receita, Stock Baixo, Cupons
 * - Indicador de sistema online
 * - Botão de atualização manual
 * - Alertas de stock baixo integrados
 * - Tratamento de erros com feedback visual
 *
 * Utiliza:
 * - useDashboardStats hook para dados
 * - StatsCard componente reutilizável
 * - LowStockAlerts para alertas de inventário
 *
 * @component
 *
 * @example
 * <DashboardTab />
 */
export function DashboardTab() {
  const {
    stats,
    loading,
    error,
    refresh,
    getRevenueGrowth,
  } = useDashboardStats(true); // Auto-refresh habilitado

  return (
    <div className="space-y-8">
      {/* Grid de Cartões de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card: Total de Pedidos */}
        <StatsCard
          title="Total de Pedidos"
          value={stats.totalOrders}
          subtitle={`${stats.pendingOrders} pendentes`}
          icon={ShoppingCart}
          color="blue"
          loading={loading}
        />

        {/* Card: Receita Total */}
        <StatsCard
          title="Receita Total"
          value={`€${stats.totalRevenue.toFixed(2)}`}
          subtitle={`+${getRevenueGrowth()}% vs mês anterior`}
          icon={DollarSign}
          color="green"
          loading={loading}
        />

        {/* Card: Stock Baixo */}
        <StatsCard
          title="Stock Baixo"
          value={stats.lowStockItems}
          subtitle="Items precisam reposição"
          icon={AlertTriangle}
          color="orange"
          loading={loading}
        />

        {/* Card: Cupons Ativos */}
        <StatsCard
          title="Cupons Ativos"
          value={stats.activeCoupons}
          subtitle="Campanhas em andamento"
          icon={Tag}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Status do Sistema e Última Atualização */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Indicador de Status (pulsante = online) */}
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>

            {/* Informações de Status */}
            <div>
              <h3 className="font-semibold text-gray-900">Sistema Operacional</h3>
              <p className="text-sm text-gray-600">
                Última atualização: {stats.lastUpdate || 'Carregando...'}
              </p>
            </div>
          </div>

          {/* Botão de Atualização Manual */}
          <Button
            onClick={refresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Exibir Erro se houver */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Erro:</span>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Alertas de Stock Baixo */}
      <LowStockAlerts />
    </div>
  );
}
