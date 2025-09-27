'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vendas
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total acumulado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Totais
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Desde o início
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos Hoje
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando processamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>
            Últimos {orders.length} pedidos recebidos
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        <Badge className={getStatusColor(order.status || 'pending')}>
                          {order.status || 'pending'}
                        </Badge>
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
        </CardContent>
      </Card>

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