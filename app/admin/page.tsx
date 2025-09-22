'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { LowStockAlerts } from '@/components/admin/LowStockAlerts';
import { formatCurrency } from '@/lib/utils/formatters';
import {
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  Users,
  Settings,
  BarChart3,
  Truck,
  Tag,
  FileText,
  RefreshCw,
  Plus,
} from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    activeCoupons: 0,
    pendingOrders: 0,
    loading: true,
  });

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls - replace with real data
      setTimeout(() => {
        setDashboardData({
          totalOrders: 1247,
          totalRevenue: 89750.00,
          lowStockItems: 23,
          activeCoupons: 8,
          pendingOrders: 15,
          loading: false,
        });
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'orders', name: 'Pedidos', icon: ShoppingCart },
    { id: 'inventory', name: 'Estoque', icon: Package },
    { id: 'coupons', name: 'Cupons', icon: Tag },
    { id: 'tracking', name: 'Rastreamento', icon: Truck },
    { id: 'reports', name: 'Relatórios', icon: FileText },
    { id: 'settings', name: 'Configurações', icon: Settings },
  ];

  const DashboardCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-full bg-opacity-20 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {dashboardData.loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total de Pedidos"
            value={dashboardData.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            color="text-blue-600 bg-blue-600"
            subtext="Todos os tempos"
          />
          <DashboardCard
            title="Receita Total"
            value={formatCurrency(dashboardData.totalRevenue)}
            icon={TrendingUp}
            color="text-green-600 bg-green-600"
            subtext="Últimos 30 dias"
          />
          <DashboardCard
            title="Estoque Baixo"
            value={dashboardData.lowStockItems}
            icon={AlertTriangle}
            color="text-orange-600 bg-orange-600"
            subtext="Requer atenção"
          />
          <DashboardCard
            title="Cupons Ativos"
            value={dashboardData.activeCoupons}
            icon={Tag}
            color="text-purple-600 bg-purple-600"
            subtext="Disponíveis"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlerts />

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <Button
              onClick={() => setActiveTab('orders')}
              variant="outline"
              className="w-full justify-start"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ver Pedidos Pendentes ({dashboardData.pendingOrders})
            </Button>
            <Button
              onClick={() => setActiveTab('coupons')}
              variant="outline"
              className="w-full justify-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Cupom
            </Button>
            <Button
              onClick={() => setActiveTab('reports')}
              variant="outline"
              className="w-full justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Gerar Relatório de Estoque
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestão de Pedidos</h1>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Como Usar a API de Pedidos:</h2>
        <div className="space-y-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">📋 Listar Pedidos:</h3>
            <code className="text-blue-600">GET /api/orders</code>
            <p className="text-gray-600 mt-1">Lista todos os pedidos do usuário logado</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">👁️ Ver Detalhes do Pedido:</h3>
            <code className="text-blue-600">GET /api/orders/[id]</code>
            <p className="text-gray-600 mt-1">Mostra informações completas de um pedido</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">✏️ Atualizar Status:</h3>
            <code className="text-blue-600">PUT /api/orders/[id]</code>
            <p className="text-gray-600 mt-1">Atualiza status: CONFIRMED → PROCESSING → SHIPPED → DELIVERED</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestão de Estoque</h1>
      <LowStockAlerts />

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">APIs de Estoque:</h2>
        <div className="grid gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">📊 Verificar Estoque:</h3>
            <code className="text-blue-600">GET /api/inventory?productId=X</code>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">📈 Adicionar Estoque:</h3>
            <code className="text-blue-600">POST /api/inventory</code>
            <p className="text-gray-600 mt-1">Body: {"{ action: 'add', productId: 'X', quantity: 50 }"}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoupons = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestão de Cupons</h1>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Cupons Ativos:</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div>
              <span className="font-medium text-green-800">BEMVINDO20</span>
              <span className="text-sm text-green-600 ml-2">20% de desconto</span>
            </div>
            <span className="text-sm text-green-600">Ativo</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div>
              <span className="font-medium text-green-800">DESCONTO20</span>
              <span className="text-sm text-green-600 ml-2">20% de desconto</span>
            </div>
            <span className="text-sm text-green-600">Ativo</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-2">APIs de Cupons:</h3>
          <div className="space-y-2 text-sm">
            <code className="block text-blue-600">POST /api/coupons/validate</code>
            <code className="block text-blue-600">GET /api/coupons</code>
            <code className="block text-blue-600">POST /api/coupons</code>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Rastreamento de Pedidos</h1>

      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Como Funciona:</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">1. Criar Rastreamento:</h3>
            <code className="text-blue-600">POST /api/tracking</code>
            <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
{`{
  "orderId": "order_123",
  "trackingNumber": "BR123456789BR",
  "carrier": "CTT",
  "estimatedDelivery": "2024-02-15"
}`}
            </pre>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">2. Atualizar Status:</h3>
            <code className="text-green-600">PUT /api/tracking?id=track_123</code>
            <pre className="text-xs text-gray-600 mt-2 overflow-x-auto">
{`{
  "status": "SHIPPED",
  "location": "Lisboa",
  "description": "Pedido enviado"
}`}
            </pre>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">3. Cliente Consulta:</h3>
            <code className="text-purple-600">GET /api/tracking?orderId=order_123</code>
            <p className="text-gray-600 mt-1">Cliente vê status atual e histórico de movimentação</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>

      <div className="grid gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Relatórios Disponíveis:</h2>
          <div className="grid gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">📊 Resumo de Estoque:</h3>
              <code className="text-blue-600">GET /api/reports/inventory?type=summary</code>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">🔄 Análise de Giro:</h3>
              <code className="text-blue-600">GET /api/reports/inventory?type=turnover</code>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">🏆 Análise ABC:</h3>
              <code className="text-blue-600">GET /api/reports/inventory?type=abc</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'orders': return renderOrders();
      case 'inventory': return renderInventory();
      case 'coupons': return renderCoupons();
      case 'tracking': return renderTracking();
      case 'reports': return renderReports();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              JC Hair Studio - Painel Admin
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Sistema Completo v1.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu</h2>
                <nav className="space-y-2">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}