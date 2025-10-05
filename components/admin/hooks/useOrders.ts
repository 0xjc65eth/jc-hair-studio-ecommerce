import { useState, useEffect, useCallback } from 'react';

/**
 * Interface para pedido
 */
interface Order {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  products?: any[];
  createdAt: string;
  trackingNumber?: string;
  shippingCost?: number;
}

/**
 * Interface para filtros de pedidos
 */
interface OrderFilters {
  status: string;
  customer: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  minValue: string;
  maxValue: string;
}

/**
 * Custom Hook: useOrders
 *
 * Gerencia toda a lógica de pedidos:
 * - Carregamento de pedidos da API
 * - Filtros e busca em tempo real
 * - Ordenação personalizável
 * - Atualização de status
 * - Criação de etiquetas de envio
 * - Reenvio de notificações
 * - Auto-refresh a cada 30 segundos
 *
 * @param {boolean} autoRefresh - Se deve atualizar automaticamente (padrão: true)
 * @returns {Object} Estado e métodos de gerenciamento de pedidos
 *
 * @example
 * const {
 *   orders,
 *   filteredOrders,
 *   filters,
 *   loading,
 *   updateFilter,
 *   updateOrderStatus,
 *   createShippingLabel,
 *   refresh
 * } = useOrders();
 */
export function useOrders(autoRefresh: boolean = true) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado de filtros
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    customer: '',
    sortBy: 'date',
    sortOrder: 'desc',
    minValue: '',
    maxValue: '',
  });

  /**
   * Busca todos os pedidos da API
   * Utiliza endpoint: GET /api/admin/orders
   */
  const fetchOrders = useCallback(async () => {
    try {
      console.log('📦 Fetching orders...');
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/orders');
      const data = await response.json();

      if (data.success && data.orders) {
        console.log(`✅ Loaded ${data.orders.length} orders`);
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } else {
        throw new Error(data.error || 'Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('❌ Error fetching orders:', err);
      setError(err.message || 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualiza o status de um pedido
   *
   * @param {string} orderId - ID do pedido
   * @param {string} newStatus - Novo status do pedido
   * @returns {Promise<boolean>} true se sucesso, false caso contrário
   */
  const updateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        console.log(`✅ Status do pedido ${orderId} atualizado para ${newStatus}`);
        await fetchOrders(); // Recarregar pedidos
        return true;
      } else {
        throw new Error('Falha ao atualizar status');
      }
    } catch (err: any) {
      console.error('❌ Erro ao atualizar status:', err);
      return false;
    }
  };

  /**
   * Cria etiqueta de envio para um pedido
   *
   * @param {Order} order - Pedido completo
   * @returns {Promise<{success: boolean, trackingNumber?: string, labelUrl?: string}>}
   */
  const createShippingLabel = async (order: Order) => {
    try {
      console.log('🏷️ Criando etiqueta de envio para pedido:', order._id);

      const shippingData = {
        orderId: order._id,
        customerInfo: {
          name: order.name,
          email: order.email,
          phone: order.phone || '',
        },
        shippingAddress: {
          street: order.address,
          city: order.city,
          state: order.state,
          postalCode: order.postalCode,
          country: order.country || 'BR',
        },
        products: order.products || [],
        weight: 1, // Peso padrão em kg
        dimensions: { length: 20, width: 15, height: 5 }, // Dimensões padrão em cm
        value: order.totalAmount,
        service: 'standard',
      };

      const response = await fetch('/api/admin/shipping/create-label', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingData),
      });

      const result = await response.json();

      if (result.success) {
        // Atualizar status do pedido para 'processing'
        await updateOrderStatus(order._id, 'processing');

        console.log('✅ Etiqueta criada com sucesso:', result.trackingNumber);
        return {
          success: true,
          trackingNumber: result.trackingNumber,
          carrier: result.carrier,
          labelUrl: result.labelUrl,
        };
      } else {
        throw new Error(result.message || 'Erro ao criar etiqueta');
      }
    } catch (err: any) {
      console.error('❌ Erro ao criar etiqueta de envio:', err);
      return {
        success: false,
        error: err.message,
      };
    }
  };

  /**
   * Reenvia notificação para um pedido
   *
   * @param {string} orderId - ID do pedido
   * @param {string} type - Tipo de notificação ('customer' ou 'company')
   * @returns {Promise<boolean>} true se sucesso, false caso contrário
   */
  const resendNotification = async (orderId: string, type: string): Promise<boolean> => {
    try {
      console.log('📧 Reenviando notificação:', { orderId, type });

      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'resend', orderId, customer: type }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Notificação reenviada com sucesso');
        return true;
      } else {
        throw new Error('Falha ao reenviar notificação');
      }
    } catch (err: any) {
      console.error('❌ Erro ao reenviar notificação:', err);
      return false;
    }
  };

  /**
   * Atualiza um filtro específico
   *
   * @param {string} key - Chave do filtro
   * @param {any} value - Valor do filtro
   */
  const updateFilter = (key: keyof OrderFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Reseta todos os filtros
   */
  const resetFilters = () => {
    setFilters({
      status: 'all',
      customer: '',
      sortBy: 'date',
      sortOrder: 'desc',
      minValue: '',
      maxValue: '',
    });
  };

  /**
   * Exporta pedidos filtrados para CSV
   *
   * @returns {string} Conteúdo CSV
   */
  const exportToCSV = (): string => {
    const headers = ['ID', 'Cliente', 'Email', 'Total', 'Status', 'Data', 'Produtos'];
    const csvRows = filteredOrders.map(order => [
      order._id,
      order.name,
      order.email,
      `€${order.totalAmount?.toFixed(2)}`,
      order.status,
      new Date(order.createdAt).toLocaleDateString('pt-BR'),
      order.products?.map(p => `${p.name} (${p.quantity}x)`).join('; ') || 'N/A',
    ]);

    const escapeField = (field: any) => {
      return typeof field === 'string' && field.includes(',') ? `"${field}"` : field;
    };

    const csvContent = [headers, ...csvRows.map(row => row.map(escapeField))];
    return csvContent.map(row => row.join(',')).join('\n');
  };

  // Aplicar filtros e ordenação sempre que orders ou filters mudarem
  useEffect(() => {
    let filtered = [...orders];

    // Filtro por status
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Filtro por cliente (busca em nome e email)
    if (filters.customer) {
      const searchTerm = filters.customer.toLowerCase();
      filtered = filtered.filter(order =>
        order.name?.toLowerCase().includes(searchTerm) ||
        order.email?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por valor mínimo
    if (filters.minValue) {
      filtered = filtered.filter(order => order.totalAmount >= parseFloat(filters.minValue));
    }

    // Filtro por valor máximo
    if (filters.maxValue) {
      filtered = filtered.filter(order => order.totalAmount <= parseFloat(filters.maxValue));
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aVal: any = a[filters.sortBy as keyof Order];
      let bVal: any = b[filters.sortBy as keyof Order];

      if (filters.sortBy === 'date') {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }

      if (filters.sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, filters]);

  // Auto-refresh a cada 30 segundos (se habilitado)
  useEffect(() => {
    fetchOrders();

    if (autoRefresh) {
      const interval = setInterval(fetchOrders, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchOrders]);

  return {
    orders,
    filteredOrders,
    filters,
    loading,
    error,
    updateFilter,
    resetFilters,
    updateOrderStatus,
    createShippingLabel,
    resendNotification,
    exportToCSV,
    refresh: fetchOrders,
  };
}
