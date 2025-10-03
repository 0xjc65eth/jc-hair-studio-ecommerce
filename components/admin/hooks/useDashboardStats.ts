import { useState, useEffect, useCallback } from 'react';

/**
 * Interface para estatísticas do dashboard
 */
interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  lowStockItems: number;
  activeCoupons: number;
  pendingOrders: number;
  stripeOrders: number;
  lastUpdate: string;
  loading: boolean;
  error?: string;
}

/**
 * Custom Hook: useDashboardStats
 *
 * Gerencia estatísticas do dashboard administrativo:
 * - Total de pedidos e receita
 * - Pedidos pendentes
 * - Items com stock baixo
 * - Cupons ativos
 * - Auto-refresh a cada 30 segundos
 * - Tratamento de erros
 *
 * @param {boolean} autoRefresh - Se deve atualizar automaticamente (padrão: true)
 * @returns {Object} Estatísticas e métodos de controle
 *
 * @example
 * const { stats, refresh, loading, error } = useDashboardStats();
 *
 * // Acessar estatísticas:
 * console.log(stats.totalOrders);
 * console.log(stats.totalRevenue);
 *
 * // Forçar atualização:
 * refresh();
 */
export function useDashboardStats(autoRefresh: boolean = true) {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    activeCoupons: 0,
    pendingOrders: 0,
    stripeOrders: 0,
    lastUpdate: '',
    loading: true,
    error: undefined,
  });

  /**
   * Busca dados do dashboard de múltiplas APIs em paralelo
   * Combina dados de pedidos e inventário
   *
   * APIs utilizadas:
   * - GET /api/admin/orders - Lista de pedidos
   * - GET /api/inventory?action=low-stock - Items com stock baixo
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      console.log('📊 Fetching dashboard data...');

      setStats(prev => ({ ...prev, loading: true, error: undefined }));

      // Buscar dados em paralelo para melhor performance
      const [ordersRes, inventoryRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/inventory?action=low-stock'),
      ]);

      const ordersData = await ordersRes.json();
      const inventoryData = await inventoryRes.json();

      if (ordersData.success && ordersData.orders) {
        const orders = ordersData.orders;

        // Calcular estatísticas dos pedidos
        const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

        // Atualizar estado com novas estatísticas
        setStats({
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
          stripeOrders: orders.length,
          lowStockItems: inventoryData.success ? inventoryData.data.length : 0,
          activeCoupons: 3, // TODO: Buscar de API de cupons quando disponível
          loading: false,
          lastUpdate: new Date().toLocaleString('pt-BR'),
          error: undefined,
        });

        console.log('✅ Dashboard data updated:', {
          totalOrders: orders.length,
          totalRevenue: totalRevenue.toFixed(2),
          pendingOrders,
        });
      } else {
        throw new Error(ordersData.error || 'Failed to fetch orders');
      }
    } catch (error: any) {
      console.error('❌ Error fetching dashboard data:', error);

      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao carregar dados',
      }));
    }
  }, []);

  /**
   * Calcula crescimento percentual comparado ao mês anterior
   * TODO: Implementar quando houver dados históricos
   *
   * @returns {number} Percentual de crescimento
   */
  const getRevenueGrowth = (): number => {
    // Placeholder - retorna 12% fixo
    // Em produção, calcular baseado em dados históricos
    return 12;
  };

  /**
   * Retorna resumo rápido das estatísticas principais
   *
   * @returns {Object} Resumo formatado
   */
  const getSummary = () => ({
    totalOrders: stats.totalOrders,
    revenue: `€${stats.totalRevenue.toFixed(2)}`,
    pending: stats.pendingOrders,
    growth: `+${getRevenueGrowth()}%`,
  });

  /**
   * Verifica se há alertas críticos
   * Considera crítico se houver:
   * - Items com stock baixo
   * - Mais de 5 pedidos pendentes
   *
   * @returns {boolean} true se há alertas críticos
   */
  const hasCriticalAlerts = (): boolean => {
    return stats.lowStockItems > 0 || stats.pendingOrders > 5;
  };

  /**
   * Retorna número total de alertas
   *
   * @returns {number} Total de alertas
   */
  const getAlertCount = (): number => {
    let count = 0;
    if (stats.lowStockItems > 0) count++;
    if (stats.pendingOrders > 5) count++;
    return count;
  };

  // Auto-refresh a cada 30 segundos (se habilitado)
  useEffect(() => {
    fetchDashboardData();

    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchDashboardData]);

  return {
    stats,
    loading: stats.loading,
    error: stats.error,
    refresh: fetchDashboardData,
    getSummary,
    hasCriticalAlerts,
    getAlertCount,
    getRevenueGrowth,
  };
}
