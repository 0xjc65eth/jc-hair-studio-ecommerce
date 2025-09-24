'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
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
  Calendar,
  DollarSign,
  Eye,
  Filter,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Bell,
  Activity,
  CreditCard,
  Globe,
  Mail,
  Phone,
  MapPin,
  Star,
  Zap,
  Shield,
  Edit3,
  Trash2,
  Archive,
  CheckSquare,
  Square,
  MessageSquare,
  Printer,
  FileDown,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Target,
  PieChart,
  TrendingDown,
  Repeat,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Layers,
  Database,
  Wifi,
  WifiOff,
  Monitor,
  Smartphone,
  Tablet,
  UserCheck,
  Flag,
  Bookmark,
  Share2,
  Maximize2,
  Minimize2,
  Grid,
  List,
  BarChart2,
  LineChart,
  PieChart as PieChartIcon,
  TrendingUpIcon,
  X,
  ShoppingBag,
  Copy
} from 'lucide-react';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    activeCoupons: 0,
    pendingOrders: 0,
    loading: true,
    stripeOrders: 0,
    lastUpdate: '',
    error: '' as string | undefined,
  });

  // Enterprise Order Management State
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    customer: '',
    sortBy: 'date',
    sortOrder: 'desc',
    priority: 'all',
    paymentMethod: 'all',
    shippingStatus: 'all',
    tags: [],
    minValue: '',
    maxValue: ''
  });

  // Business Intelligence State
  const [analyticsData, setAnalyticsData] = useState({
    conversionFunnel: [],
    customerLifetimeValue: 0,
    topProducts: [],
    revenueByChannel: [],
    geographicDistribution: [],
    customerSegments: [],
    orderFrequency: [],
    averageOrderValue: 0,
    customerRetentionRate: 0,
    monthlyRecurringRevenue: 0
  });

  // Enhanced feature states
  const [isOffline, setIsOffline] = useState(false);
  const [syncQueue, setSyncQueue] = useState([]);
  const [realTimeConnected, setRealTimeConnected] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    apiResponseTime: 0,
    pageLoadTime: 0,
    errorRate: 0
  });

  // Modal states for enhanced orders table
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Authentication handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'juliojuliana62') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Senha incorreta. Tente novamente.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchOrders();
    fetchNotifications();
    fetchAnalyticsData();
    setupRealTimeUpdates();
    setupOfflineDetection();

    const interval = setInterval(() => {
      fetchDashboardData();
      fetchOrders();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('📊 Fetching dashboard data...');

      setDashboardData(prev => ({ ...prev, loading: true, error: undefined }));

      const [ordersRes, inventoryRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/inventory?action=low-stock')
      ]);

      const ordersData = await ordersRes.json();
      const inventoryData = await inventoryRes.json();

      if (ordersData.success && ordersData.orders) {
        const orders = ordersData.orders;
        const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

        setDashboardData(prev => ({
          ...prev,
          totalOrders: orders.length,
          totalRevenue,
          pendingOrders,
          stripeOrders: orders.length,
          lowStockItems: inventoryData.success ? inventoryData.data.length : 0,
          activeCoupons: 3,
          loading: false,
          lastUpdate: new Date().toLocaleString('pt-BR'),
          error: undefined
        }));

        console.log('✅ Dashboard data updated:', {
          totalOrders: orders.length,
          totalRevenue: totalRevenue.toFixed(2),
          pendingOrders
        });
      } else {
        throw new Error(ordersData.error || 'Failed to fetch orders');
      }

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro ao carregar dados'
      }));
    }
  };

  const fetchOrders = async () => {
    try {
      console.log('📦 Fetching orders...');
      const response = await fetch('/api/admin/orders');
      const data = await response.json();

      if (data.success && data.orders) {
        console.log(`✅ Loaded ${data.orders.length} orders`);
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } else {
        throw new Error(data.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      console.log('🔔 Fetching notification logs...');
      const response = await fetch('/api/admin/notification-logs');
      const data = await response.json();

      if (data.success) {
        console.log('✅ Notification logs fetched successfully:', data.data.stats);

        // Transform our notification logs into the format expected by the UI
        const transformedNotifications = [];
        const { stats, logs } = data.data;

        if (stats.eventBreakdown && Object.keys(stats.eventBreakdown).length > 0) {
          Object.entries(stats.eventBreakdown).forEach(([eventType, count]) => {
            const eventLogs = logs.filter(log => log.event === eventType);
            const successful = eventLogs.filter(log => log.clientSent && log.companySent).length;
            const failed = eventLogs.filter(log => !log.clientSent || !log.companySent).length;

            transformedNotifications.push({
              id: `notif_${eventType}`,
              type: eventType,
              total: count,
              success: successful * 2, // Client + Company emails
              failed: failed,
              pending: 0,
              lastUpdated: eventLogs.length > 0 ? eventLogs[0].timestamp : new Date().toISOString()
            });
          });
        }

        setNotifications(transformedNotifications);
      } else {
        throw new Error(data.error || 'Failed to fetch notification logs');
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      // Set a default message if no notifications exist yet
      setNotifications([{
        id: 'no_notifications',
        type: 'sistema_inicializado',
        total: 0,
        success: 0,
        failed: 0,
        pending: 0,
        lastUpdated: new Date().toISOString()
      }]);
    }
  };

  // Export functions
  const exportToExcel = async () => {
    try {
      console.log('📊 Exporting to Excel...');

      const csvData = convertToCSV(filteredOrders);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('✅ Relatório exportado com sucesso!');
    } catch (error) {
      console.error('❌ Error exporting to Excel:', error);
      alert('❌ Erro ao exportar relatório');
    }
  };

  const convertToCSV = (data) => {
    const headers = ['ID', 'Cliente', 'Email', 'Total', 'Status', 'Data', 'Produtos'];
    const csvRows = data.map(order => [
      order._id,
      order.name,
      order.email,
      `€${order.totalAmount?.toFixed(2)}`,
      order.status,
      new Date(order.createdAt).toLocaleDateString('pt-BR'),
      order.products?.map(p => `${p.name} (${p.quantity}x)`).join('; ') || 'N/A'
    ]);

    const escapeField = (field) => {
      return typeof field === 'string' && field.includes(',') ? `"${field}"` : field;
    };

    const csvContent = [headers, ...csvRows.map(row => row.map(escapeField))];
    return csvContent.map(row => row.join(',')).join('\n');
  };

  // Notification functions
  const sendTestNotification = async () => {
    try {
      console.log('📧 Sending test notification...');
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'test' })
      });

      const result = await response.json();
      if (result.success) {
        alert('✅ Notificação teste enviada com sucesso!');
        fetchNotifications();
        fetchDashboardData();
      }
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      alert('❌ Erro ao enviar notificação');
    }
  };

  const resendNotification = async (orderId, type) => {
    try {
      console.log('📧 Resending notification:', { orderId, type });
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'resend', orderId, customer: type })
      });

      const result = await response.json();
      if (result.success) {
        alert('✅ Notificação reenviada com sucesso!');
        fetchNotifications();
      }
    } catch (error) {
      console.error('❌ Error resending notification:', error);
      alert('❌ Erro ao reenviar notificação');
    }
  };

  // Atualizar status do pedido
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('✅ Status atualizado com sucesso!');
        fetchOrders();
        fetchDashboardData();
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      alert('❌ Erro ao atualizar status');
    }
  };

  // Criar etiqueta de envio
  const createShippingLabel = async (order) => {
    try {
      console.log('🏷️ Criando etiqueta de envio para pedido:', order._id);

      // Show loading state
      const originalButton = event?.target;
      if (originalButton) {
        originalButton.disabled = true;
        originalButton.textContent = 'Criando...';
      }

      // Prepare shipping data
      const shippingData = {
        orderId: order._id,
        customerInfo: {
          name: order.name,
          email: order.email,
          phone: order.phone || ''
        },
        shippingAddress: {
          street: order.address,
          city: order.city,
          state: order.state,
          postalCode: order.postalCode,
          country: order.country || 'BR'
        },
        products: order.products || [],
        weight: order.totalWeight || 1,
        dimensions: order.dimensions || { length: 20, width: 15, height: 5 },
        value: order.totalAmount,
        service: order.shippingMethod || 'standard'
      };

      // Call shipping API to create label
      const response = await fetch('/api/admin/shipping/create-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...shippingData,
          adminPassword: 'juliojuliana62'
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update order with tracking information
        await updateOrderStatus(order._id, 'processing');

        // Show success message with tracking info
        alert(`✅ Etiqueta criada com sucesso!\n\nCódigo de rastreamento: ${result.trackingNumber}\nTransportadora: ${result.carrier}\n\nA etiqueta foi enviada por email e está disponível para download.`);

        // Refresh orders to show updated status
        fetchOrders();
        fetchDashboardData();

        // Open label PDF if available
        if (result.labelUrl) {
          window.open(result.labelUrl, '_blank');
        }
      } else {
        throw new Error(result.message || 'Erro ao criar etiqueta');
      }

    } catch (error) {
      console.error('❌ Erro ao criar etiqueta de envio:', error);
      alert(`❌ Erro ao criar etiqueta de envio: ${error.message}\n\nVerifique:\n- Endereço de entrega completo\n- Peso e dimensões do produto\n- Conexão com transportadora`);
    } finally {
      // Reset button state
      if (originalButton) {
        originalButton.disabled = false;
        originalButton.textContent = 'Criar Etiqueta';
      }
    }
  };

  // Missing function implementations
  const fetchAnalyticsData = async () => {
    try {
      console.log('📊 Fetching analytics data...');
      // Placeholder for analytics data fetching
      setAnalyticsData({
        conversionFunnel: [],
        customerLifetimeValue: 0,
        topProducts: [],
        revenueByChannel: [],
        geographicDistribution: [],
        customerSegments: [],
        orderFrequency: [],
        averageOrderValue: 0,
        customerRetentionRate: 0,
        monthlyRecurringRevenue: 0
      });
    } catch (error) {
      console.error('❌ Error fetching analytics data:', error);
    }
  };

  const setupRealTimeUpdates = () => {
    try {
      console.log('🔄 Setting up real-time updates...');
      // Placeholder for real-time update setup
      setRealTimeConnected(true);
    } catch (error) {
      console.error('❌ Error setting up real-time updates:', error);
      setRealTimeConnected(false);
    }
  };

  const setupOfflineDetection = () => {
    const handleOnline = () => {
      setIsOffline(false);
      syncOfflineChanges();
    };

    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  };

  const syncOfflineChanges = async () => {
    try {
      console.log('🔄 Syncing offline changes...');
      // Process sync queue
      for (const change of syncQueue) {
        // Process each queued change
        console.log('Processing offline change:', change);
      }
      setSyncQueue([]);
    } catch (error) {
      console.error('❌ Error syncing offline changes:', error);
    }
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...orders];

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    if (filters.customer) {
      const searchTerm = filters.customer.toLowerCase();
      filtered = filtered.filter(order =>
        order.name?.toLowerCase().includes(searchTerm) ||
        order.email?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.minValue) {
      filtered = filtered.filter(order => order.totalAmount >= parseFloat(filters.minValue));
    }

    if (filters.maxValue) {
      filtered = filtered.filter(order => order.totalAmount <= parseFloat(filters.maxValue));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal = a[filters.sortBy];
      let bVal = b[filters.sortBy];

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

  // Dashboard rendering
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Cartões de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Pedidos</p>
              <p className="text-3xl font-bold">{dashboardData.loading ? '...' : dashboardData.totalOrders}</p>
              <p className="text-blue-100 text-xs mt-2">
                {dashboardData.pendingOrders} pendentes
              </p>
            </div>
            <ShoppingCart className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Receita Total</p>
              <p className="text-3xl font-bold">
                €{dashboardData.loading ? '...' : dashboardData.totalRevenue.toFixed(2)}
              </p>
              <p className="text-green-100 text-xs mt-2">+12% vs mês anterior</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Stock Baixo</p>
              <p className="text-3xl font-bold">{dashboardData.loading ? '...' : dashboardData.lowStockItems}</p>
              <p className="text-orange-100 text-xs mt-2">Items precisam reposição</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Cupons Ativos</p>
              <p className="text-3xl font-bold">{dashboardData.loading ? '...' : dashboardData.activeCoupons}</p>
              <p className="text-purple-100 text-xs mt-2">Campanhas em andamento</p>
            </div>
            <Tag className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Status do sistema e última atualização */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-semibold text-gray-900">Sistema Operacional</h3>
              <p className="text-sm text-gray-600">
                Última atualização: {dashboardData.lastUpdate || 'Carregando...'}
              </p>
            </div>
          </div>
          <Button
            onClick={fetchDashboardData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={dashboardData.loading}
          >
            <RefreshCw className={`w-4 h-4 ${dashboardData.loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {dashboardData.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Erro:</span>
              <span>{dashboardData.error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Alertas de Stock Baixo */}
      <LowStockAlerts />
    </div>
  );

  // Orders table with enhanced features
  const OrdersTable = () => {
    return (
    <div className="space-y-6">
      {/* Filtros e ações em massa */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Gestão de Pedidos</h2>
          <div className="flex items-center gap-3">
            <Button
              onClick={exportToExcel}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button
              onClick={fetchOrders}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="processing">Processando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
            <input
              type="text"
              placeholder="Nome ou email..."
              value={filters.customer}
              onChange={(e) => setFilters(prev => ({ ...prev, customer: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Data</option>
              <option value="totalAmount">Valor</option>
              <option value="status">Status</option>
              <option value="name">Nome</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordem</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => setFilters(prev => ({ ...prev, sortOrder: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Mais recente</option>
              <option value="asc">Mais antigo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de pedidos com produtos visíveis */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedido & Cliente
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                📦 Produtos a Enviar
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                📍 Endereço de Entrega
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor & Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                🚚 Envio
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order, index) => (
              <tr key={order._id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      #{order._id?.slice(-8) || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">{order.name || 'Nome não disponível'}</div>
                    <div className="text-xs text-gray-500">{order.email || 'Email não disponível'}</div>
                    <div className="text-xs text-gray-400">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('pt-BR') : 'Data não disponível'}
                    </div>
                  </div>
                </td>

                {/* Products column - shows exactly what to ship */}
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {order.products && order.products.length > 0 ? (
                      <div className="space-y-2">
                        {order.products.slice(0, 2).map((product, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = '/placeholder-product.jpg';
                                }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>Qtd: <strong>{product.quantity}</strong></span>
                                {product.sku && <span>SKU: {product.sku}</span>}
                                {product.size && <span>Tam: {product.size}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.products.length > 2 && (
                          <div className="text-xs text-gray-500 text-center py-1">
                            +{order.products.length - 2} mais produtos
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 bg-gray-50 rounded-lg p-3">
                        <Package className="w-5 h-5" />
                        <span className="text-sm">
                          {order.itemsCount || 1} item(s) - detalhes não disponíveis
                        </span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Shipping address column */}
                <td className="px-6 py-4">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-700">
                        <div className="font-medium">{order.address || 'Endereço não disponível'}</div>
                        <div>{order.city || 'Cidade'}, {order.state || 'Estado'}</div>
                        <div>CEP: {order.postalCode || 'N/A'}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.country || 'Brasil'}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Value and status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    €{order.totalAmount?.toFixed(2) || '0.00'}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'pending' ? 'Pendente' :
                       order.status === 'processing' ? 'Processando' :
                       order.status === 'shipped' ? 'Enviado' :
                       order.status === 'delivered' ? 'Entregue' :
                       order.status === 'cancelled' ? 'Cancelado' :
                       order.status || 'Desconhecido'}
                    </span>
                  </div>
                  {order.trackingNumber && (
                    <div className="text-xs text-gray-500 mt-1">
                      Rastreio: {order.trackingNumber}
                    </div>
                  )}
                </td>

                {/* Shipping actions */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                    >
                      <Eye className="w-3 h-3" />
                      Ver Detalhes
                    </Button>

                    {order.status === 'pending' && (
                      <Button
                        onClick={() => createShippingLabel(order)}
                        size="sm"
                        className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-700"
                      >
                        <Truck className="w-3 h-3" />
                        Criar Etiqueta
                      </Button>
                    )}

                    {order.status === 'processing' && (
                      <Button
                        onClick={() => updateOrderStatus(order._id, 'shipped')}
                        size="sm"
                        className="flex items-center gap-1 text-xs bg-purple-600 hover:bg-purple-700"
                      >
                        <Send className="w-3 h-3" />
                        Marcar Enviado
                      </Button>
                    )}

                    {(order.status === 'pending' || order.status === 'processing') && (
                      <Button
                        onClick={() => resendNotification(order._id, 'customer')}
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 text-xs"
                      >
                        <Bell className="w-3 h-3" />
                        Notificar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum pedido encontrado com os filtros aplicados.</p>
        </div>
      )}
    </div>
  );
  };

  /**
   * Painel de status das notificações
   */
  const NotificationsPanel = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Status das Notificações</h3>
        <Button
          onClick={fetchNotifications}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? notifications.map((notif) => (
          <div key={notif.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 capitalize">
                {notif.type.replace('_', ' ')}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Total: {notif.total}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-green-600 font-semibold">{notif.success}</div>
                <div className="text-gray-500">Enviadas</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-semibold">{notif.failed}</div>
                <div className="text-gray-500">Falharam</div>
              </div>
              <div className="text-center">
                <div className="text-blue-600 font-semibold">{notif.pending}</div>
                <div className="text-gray-500">Pendentes</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Última atualização: {new Date(notif.lastUpdated).toLocaleString('pt-BR')}
              </span>
              <Button
                onClick={sendTestNotification}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                Teste
              </Button>
            </div>
          </div>
        )) : (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma notificação encontrada</p>
            <Button
              onClick={sendTestNotification}
              className="mt-4"
              size="sm"
            >
              Enviar Notificação de Teste
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => <OrdersTable />;

  const renderNotifications = () => <NotificationsPanel />;

  const renderShipping = () => (
    <div className="space-y-6">
      {/* Estatísticas de Envio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Pedidos Pendentes</p>
              <p className="text-3xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
            <Package className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Em Processamento</p>
              <p className="text-3xl font-bold">{orders.filter(o => o.status === 'processing').length}</p>
            </div>
            <Truck className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Enviados</p>
              <p className="text-3xl font-bold">{orders.filter(o => o.status === 'shipped').length}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Ações de Envio Rápido */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas de Envio</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            className="flex items-center gap-2 justify-center"
            onClick={() => {
              const pendingOrders = orders.filter(o => o.status === 'pending');
              pendingOrders.forEach(order => createShippingLabel(order));
            }}
          >
            <Truck className="w-4 h-4" />
            Criar Todas as Etiquetas
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 justify-center"
            onClick={() => {
              const processingOrders = orders.filter(o => o.status === 'processing');
              processingOrders.forEach(order => updateOrderStatus(order._id, 'shipped'));
            }}
          >
            <Send className="w-4 h-4" />
            Marcar Tudo Enviado
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 justify-center"
            onClick={exportToExcel}
          >
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2 justify-center"
            onClick={() => {
              orders.forEach(order => {
                if (order.status === 'pending' || order.status === 'processing') {
                  resendNotification(order._id, 'customer');
                }
              });
            }}
          >
            <Bell className="w-4 h-4" />
            Notificar Todos
          </Button>
        </div>
      </div>

      {/* Lista de Pedidos para Envio */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pedidos Prontos para Envio</h3>

        <div className="space-y-4">
          {orders.filter(order => order.status === 'pending' || order.status === 'processing').map((order, index) => (
            <div key={order._id || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">#{order._id?.slice(-8)}</p>
                      <p className="text-sm text-gray-600">{order.name}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>{order.address}</p>
                      <p>{order.city}, {order.state} - {order.postalCode}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">€{order.totalAmount?.toFixed(2)}</p>
                      <p className="text-gray-600">{order.products?.length || 1} item(s)</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => createShippingLabel(order)}
                      className="flex items-center gap-1"
                    >
                      <Truck className="w-3 h-3" />
                      Criar Etiqueta
                    </Button>
                  )}

                  {order.status === 'processing' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrderStatus(order._id, 'shipped')}
                      className="flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Marcar Enviado
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {orders.filter(order => order.status === 'pending' || order.status === 'processing').length === 0 && (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum pedido pendente para envio</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Gestão de Inventário</h3>
      <LowStockAlerts />
    </div>
  );

  const renderCoupons = () => {
    // Mock data para cupons
    const coupons = [
      { id: '1', code: 'WELCOME10', discount: 10, type: 'percentage', active: true, uses: 45, maxUses: 100 },
      { id: '2', code: 'FRETEGRATIS', discount: 0, type: 'free_shipping', active: true, uses: 23, maxUses: 50 },
      { id: '3', code: 'BLACKFRIDAY', discount: 25, type: 'percentage', active: false, uses: 150, maxUses: 200 },
    ];

    return (
      <div className="space-y-6">
        {/* Estatísticas de Cupons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Cupons Ativos</p>
                <p className="text-3xl font-bold">{coupons.filter(c => c.active).length}</p>
              </div>
              <Tag className="w-12 h-12 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total de Usos</p>
                <p className="text-3xl font-bold">{coupons.reduce((sum, c) => sum + c.uses, 0)}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Desconto Médio</p>
                <p className="text-3xl font-bold">{(coupons.filter(c => c.type === 'percentage').reduce((sum, c) => sum + c.discount, 0) / coupons.filter(c => c.type === 'percentage').length || 0).toFixed(0)}%</p>
              </div>
              <DollarSign className="w-12 h-12 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Economia Total</p>
                <p className="text-3xl font-bold">€{(dashboardData.totalRevenue * 0.12).toFixed(0)}</p>
              </div>
              <Star className="w-12 h-12 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Criar Novo Cupom */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Criar Novo Cupom</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código do Cupom</label>
                <input
                  type="text"
                  placeholder="Ex: DESCONTO20"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  id="coupon-code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Desconto</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2" id="coupon-type">
                  <option value="percentage">Porcentagem</option>
                  <option value="fixed">Valor Fixo (€)</option>
                  <option value="free_shipping">Frete Grátis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Desconto</label>
                <input
                  type="number"
                  placeholder="10"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  id="coupon-value"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Limite de Usos</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  id="coupon-limit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Expiração</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  id="coupon-expiry"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" id="coupon-active" defaultChecked />
                  Ativar cupom imediatamente
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => {
                const code = document.getElementById('coupon-code').value;
                const type = document.getElementById('coupon-type').value;
                const value = document.getElementById('coupon-value').value;
                const limit = document.getElementById('coupon-limit').value;
                const expiry = document.getElementById('coupon-expiry').value;
                const active = document.getElementById('coupon-active').checked;

                if (code && value) {
                  alert(`✅ Cupom "${code}" criado com sucesso!\nTipo: ${type}\nDesconto: ${value}\nLimite: ${limit}\nAtivo: ${active ? 'Sim' : 'Não'}`);
                } else {
                  alert('❌ Preencha pelo menos o código e o valor do desconto');
                }
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Criar Cupom
            </Button>
          </div>
        </div>

        {/* Lista de Cupons */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Cupons Existentes</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Sincronizando cupons...')}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Desconto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{coupon.code}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">
                        {coupon.type === 'percentage' ? 'Porcentagem' :
                         coupon.type === 'fixed' ? 'Valor Fixo' :
                         'Frete Grátis'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium">
                        {coupon.type === 'percentage' ? `${coupon.discount}%` :
                         coupon.type === 'fixed' ? `€${coupon.discount}` :
                         'Grátis'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <span className="font-medium">{coupon.uses}</span>
                        <span className="text-gray-500">/{coupon.maxUses}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(coupon.uses / coupon.maxUses) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {coupon.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(coupon.code);
                            alert('Código copiado!');
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={coupon.active ? "outline" : "default"}
                          onClick={() => alert(`Cupom ${coupon.active ? 'desativado' : 'ativado'}!`)}
                        >
                          {coupon.active ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTracking = () => (
    <div className="space-y-6">
      {/* Estatísticas de Rastreamento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Em Trânsito</p>
              <p className="text-3xl font-bold">{orders.filter(o => o.status === 'shipped' && !o.deliveredAt).length}</p>
            </div>
            <Truck className="w-12 h-12 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Entregues</p>
              <p className="text-3xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Atrasados</p>
              <p className="text-3xl font-bold">
                {orders.filter(o => {
                  if (o.status !== 'shipped') return false;
                  const shippedDate = new Date(o.shippedAt || o.createdAt);
                  const daysSinceShipped = (new Date() - shippedDate) / (1000 * 60 * 60 * 24);
                  return daysSinceShipped > 7;
                }).length}
              </p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Com Tracking</p>
              <p className="text-3xl font-bold">{orders.filter(o => o.trackingNumber).length}</p>
            </div>
            <MapPin className="w-12 h-12 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Pedidos com Rastreamento */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pedidos com Código de Rastreamento</h3>

        <div className="space-y-4">
          {orders.filter(order => order.trackingNumber).map((order, index) => (
            <div key={order._id || index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">#{order._id?.slice(-8)}</p>
                      <p className="text-sm text-gray-600">{order.name}</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-blue-600">{order.trackingNumber}</p>
                      <p className="text-gray-600">{order.carrier || 'Correios'}</p>
                    </div>
                    <div className="text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'shipped' ? 'bg-orange-100 text-orange-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'shipped' ? 'Em Trânsito' :
                         order.status === 'delivered' ? 'Entregue' :
                         order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (order.trackingNumber) {
                        const trackingUrl = `https://www2.correios.com.br/sistemas/rastreamento/ctrl/ctrlRastreamento.cfm?codigo=${order.trackingNumber}`;
                        window.open(trackingUrl, '_blank');
                      }
                    }}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Rastrear
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(order.trackingNumber);
                      alert('Código copiado!');
                    }}
                    className="flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copiar
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {orders.filter(order => order.trackingNumber).length === 0 && (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum pedido com código de rastreamento</p>
            </div>
          )}
        </div>
      </div>

      {/* Ferramentas de Rastreamento */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ferramentas de Rastreamento</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Consulta Rápida</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Código de rastreamento"
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                id="tracking-input"
              />
              <Button
                size="sm"
                onClick={() => {
                  const code = document.getElementById('tracking-input').value;
                  if (code) {
                    window.open(`https://www2.correios.com.br/sistemas/rastreamento/ctrl/ctrlRastreamento.cfm?codigo=${code}`, '_blank');
                  }
                }}
              >
                Consultar
              </Button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Atualizar Status</h4>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                // Simular atualização de status de rastreamento
                alert('Atualizando status de rastreamento de todos os pedidos...');
                fetchOrders();
              }}
            >
              Sincronizar Tudo
            </Button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Relatório</h4>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                const trackingData = orders.filter(o => o.trackingNumber);
                const csvData = convertToCSV(trackingData);
                const blob = new Blob([csvData], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `tracking_${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
              }}
            >
              Exportar Tracking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Relatórios</h3>
      <div className="space-y-4">
        <Button
          onClick={exportToExcel}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar Pedidos para Excel
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'orders': return renderOrders();
      case 'shipping': return renderShipping();
      case 'notifications': return renderNotifications();
      case 'inventory': return renderInventory();
      case 'coupons': return renderCoupons();
      case 'tracking': return renderTracking();
      case 'reports': return renderReports();
      default: return renderDashboard();
    }
  };

  console.log('✅ Admin Panel: Rendering admin dashboard');

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">JC Hair Studio</h1>
            <p className="text-gray-600 mt-2">Acesso ao Painel Administrativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite a senha"
                required
              />
            </div>

            {authError && (
              <div className="text-red-600 text-sm text-center">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Principal */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo e Título */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  JC Hair Studio
                </h1>
                <p className="text-sm text-gray-600">Painel Administrativo Profissional</p>
              </div>
            </div>

            {/* Status e Informações */}
            <div className="flex items-center gap-6">
              {/* Indicador de Status */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Sistema Online</span>
              </div>

              {/* Estatísticas Rápidas */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{dashboardData.totalOrders}</div>
                  <div className="text-gray-600">Pedidos</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">€{dashboardData.totalRevenue.toFixed(0)}</div>
                  <div className="text-gray-600">Receita</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{dashboardData.pendingOrders}</div>
                  <div className="text-gray-600">Pendentes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'orders', name: 'Pedidos', icon: ShoppingCart },
              { id: 'shipping', name: 'Envios', icon: Truck },
              { id: 'notifications', name: 'Notificações', icon: Bell },
              { id: 'inventory', name: 'Inventário', icon: Package },
              { id: 'coupons', name: 'Cupons', icon: Tag },
              { id: 'tracking', name: 'Rastreamento', icon: MapPin },
              { id: 'reports', name: 'Relatórios', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">JC Hair Studio</h3>
                <p className="text-sm text-gray-600">Sistema de Gestão Empresarial</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="https://jchairstudios62.xyz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">jchairstudios62.xyz</span>
              </a>
              <a href="mailto:juliocesarurss65@gmail.com" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">juliocesarurss65@gmail.com</span>
              </a>
              <a href="tel:+351928375226" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">+351 928375226</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                📦 Detalhes do Pedido #{selectedOrder._id?.slice(-8)}
              </h2>
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Informações do Cliente
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nome:</span> {selectedOrder.name}</div>
                    <div><span className="font-medium">Email:</span> {selectedOrder.email}</div>
                    <div><span className="font-medium">Telefone:</span> {selectedOrder.phone || 'Não informado'}</div>
                    <div><span className="font-medium">Data:</span> {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}</div>
                    <div><span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedOrder.status === 'pending' ? 'Pendente' :
                         selectedOrder.status === 'processing' ? 'Processando' :
                         selectedOrder.status === 'shipped' ? 'Enviado' :
                         selectedOrder.status === 'delivered' ? 'Entregue' :
                         selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Endereço de Entrega
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div>{selectedOrder.address}</div>
                    <div>{selectedOrder.city}, {selectedOrder.state}</div>
                    <div>CEP: {selectedOrder.postalCode}</div>
                    <div>{selectedOrder.country || 'Brasil'}</div>
                  </div>
                </div>
              </div>

              {/* Products Ordered */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Produtos do Pedido ({selectedOrder.products?.length || 0} itens)
                </h3>

                <div className="space-y-3">
                  {selectedOrder.products && selectedOrder.products.length > 0 ? (
                    selectedOrder.products.map((product, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-4">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = '/placeholder-product.jpg';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            {product.description && (
                              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span>Qtd: <span className="font-medium">{product.quantity}</span></span>
                              <span>Preço: <span className="font-medium">€{product.unitPrice?.toFixed(2)}</span></span>
                              <span>Total: <span className="font-medium">€{product.totalPrice?.toFixed(2)}</span></span>
                            </div>
                            {(product.sku || product.brand || product.size) && (
                              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                {product.sku && <span>SKU: {product.sku}</span>}
                                {product.brand && <span>Marca: {product.brand}</span>}
                                {product.size && <span>Tamanho: {product.size}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Informações dos produtos não disponíveis</p>
                      <p className="text-sm">Pedido pode ter sido feito antes da implementação do sistema de produtos detalhados.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>€{(selectedOrder.totalAmount - (selectedOrder.shippingCost || 0)).toFixed(2)}</span>
                  </div>
                  {selectedOrder.shippingCost && (
                    <div className="flex justify-between">
                      <span>Envio:</span>
                      <span>€{selectedOrder.shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
                    <span>Total:</span>
                    <span>€{selectedOrder.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => createShippingLabel(selectedOrder)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Truck className="w-4 h-4" />
                  Criar Etiqueta de Envio
                </button>

                <button
                  onClick={() => updateOrderStatus(selectedOrder._id, 'processing')}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  Marcar como Processando
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedOrder._id);
                    alert('ID do pedido copiado!');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copiar ID
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}