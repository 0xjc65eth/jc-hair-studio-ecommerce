'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  CreditCard,
  Users,
  ShoppingCart,
  TrendingUp,
  RefreshCw,
  Package
} from 'lucide-react';

export default function SimpleAdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    pendingOrders: 0
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders-simple');
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders || []);

        // Calculate stats
        const total = data.orders?.length || 0;
        const revenue = data.orders?.reduce((sum: number, order: any) =>
          sum + (order.total || order.amount || 0), 0) || 0;

        const today = new Date().toISOString().split('T')[0];
        const todayCount = data.orders?.filter((order: any) =>
          order.createdAt?.startsWith(today)).length || 0;

        const pending = data.orders?.filter((order: any) =>
          order.status === 'pending').length || 0;

        setStats({
          totalOrders: total,
          totalRevenue: revenue,
          todayOrders: todayCount,
          pendingOrders: pending
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 mt-2">
            Gestão simplificada de pedidos
          </p>
        </div>
        <Button
          onClick={fetchOrders}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total de Vendas</h3>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <p className="text-xs text-gray-500">Total acumulado</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pedidos Totais</h3>
            <ShoppingCart className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
          <p className="text-xs text-gray-500">Desde o início</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pedidos Hoje</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.todayOrders}</div>
          <p className="text-xs text-gray-500">Últimas 24 horas</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Pendentes</h3>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</div>
          <p className="text-xs text-gray-500">Aguardando processamento</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h2>
          <p className="text-sm text-gray-600">
            Últimos {orders.length} pedidos recebidos
          </p>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Carregando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">ID do Pedido</th>
                    <th className="text-left py-2">Cliente</th>
                    <th className="text-left py-2">Valor</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id || index} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <span className="font-mono text-sm">
                          {(order.id || order.orderId || order.paymentIntentId || 'N/A').substring(0, 12)}...
                        </span>
                      </td>
                      <td className="py-3">
                        <div>
                          <p className="font-medium">
                            {order.customerName || 'Cliente'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.customerEmail || 'email@example.com'}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 font-semibold">
                        {formatCurrency(order.total || order.amount || 0)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || 'pending')}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 text-sm">
                        {formatDate(order.createdAt || new Date().toISOString())}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900">ℹ️ Informação</h3>
        <p className="text-blue-700 text-sm mt-2">
          Este painel administrativo simplificado armazena pedidos temporariamente em memória.
          Para uma solução completa com banco de dados, configure o MongoDB em produção.
        </p>
      </div>
    </div>
  );
}