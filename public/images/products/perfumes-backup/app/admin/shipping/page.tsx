'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Calculator,
  Printer,
  Download,
  Send,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Eye,
  Edit3,
  Trash2,
  CheckSquare,
  Square,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Globe,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  Users,
  Tag,
  Calendar,
  FileText,
  Settings,
  Archive,
  Star,
  Shield,
  Layers,
  Grid,
  List
} from 'lucide-react';

export default function ShippingManagementPage() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [orders, setOrders] = useState([]);
  const [shippingStats, setShippingStats] = useState({
    pendingShipments: 0,
    shippedToday: 0,
    inTransit: 0,
    delivered: 0,
    averageDeliveryTime: 0,
    onTimeRate: 0,
    totalShippingCost: 0,
    totalRevenue: 0
  });
  const [carriers, setCarriers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter and search states
  const [filters, setFilters] = useState({
    status: 'all',
    carrier: 'all',
    dateRange: '7',
    priority: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Label generation states
  const [labelGeneration, setLabelGeneration] = useState({
    selectedCarrier: 'ctt',
    format: 'pdf',
    options: {
      insurance: false,
      signature: false,
      priority: false,
      returnLabel: false
    }
  });

  // Rate calculation states
  const [rateCalculation, setRateCalculation] = useState({
    destination: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'PT'
    },
    packages: [{
      weight: 1,
      length: 20,
      width: 15,
      height: 10,
      value: 50
    }],
    rates: []
  });

  useEffect(() => {
    fetchShippingData();
    fetchOrders();
    fetchShippingStats();
  }, [filters]);

  const fetchShippingData = async () => {
    setLoading(true);
    try {
      // Fetch orders with shipping data
      const ordersResponse = await fetch('/api/admin/orders');
      const ordersData = await ordersResponse.json();

      if (ordersData.success) {
        setOrders(ordersData.orders.filter(order =>
          order.shipping && order.shipping.trackingNumber
        ));
      }
    } catch (error) {
      console.error('Error fetching shipping data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      if (data.success) {
        // Filter orders that need shipping or are being shipped
        const shippableOrders = data.orders.filter(order =>
          ['paid', 'processing', 'preparing', 'shipped', 'in_transit'].includes(order.payment?.status || order.shipping?.status)
        );
        setOrders(shippableOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchShippingStats = async () => {
    try {
      const response = await fetch(`/api/admin/shipping/status?period=${filters.dateRange}&detailed=true`);
      const data = await response.json();
      if (data.success) {
        setShippingStats({
          pendingShipments: data.statusDistribution.find(s => s._id === 'pending')?.count || 0,
          shippedToday: data.statusDistribution.find(s => s._id === 'shipped')?.count || 0,
          inTransit: data.statusDistribution.find(s => s._id === 'in_transit')?.count || 0,
          delivered: data.statusDistribution.find(s => s._id === 'delivered')?.count || 0,
          averageDeliveryTime: data.deliveryMetrics.averageDeliveryTime || 0,
          onTimeRate: data.deliveryMetrics.onTimeRate || 0,
          totalShippingCost: data.deliveryMetrics.totalShippingCost || 0,
          totalRevenue: data.totalOrders * 50 // Average order value
        });

        if (data.carrierPerformance) {
          setCarriers(data.carrierPerformance);
        }
      }
    } catch (error) {
      console.error('Error fetching shipping stats:', error);
    }
  };

  const generateLabels = async () => {
    if (selectedOrders.size === 0) {
      alert('Please select orders to generate labels');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/shipping/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: Array.from(selectedOrders),
          carrier: labelGeneration.selectedCarrier,
          format: labelGeneration.format,
          options: labelGeneration.options
        })
      });

      const data = await response.json();
      if (data.success) {
        setLabels(data.labels);
        alert(`Successfully generated ${data.labels.length} shipping labels`);

        // Download batch PDF if available
        if (data.batchPdfUrl) {
          window.open(data.batchPdfUrl, '_blank');
        }

        // Refresh orders
        fetchOrders();
        setSelectedOrders(new Set());
      } else {
        alert('Failed to generate labels: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating labels:', error);
      alert('Error generating labels');
    } finally {
      setLoading(false);
    }
  };

  const calculateRates = async () => {
    if (!rateCalculation.destination.city || !rateCalculation.destination.country) {
      alert('Please enter destination city and country');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/shipping/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rateCalculation)
      });

      const data = await response.json();
      if (data.success) {
        setRateCalculation(prev => ({
          ...prev,
          rates: data.rates
        }));
      } else {
        alert('Failed to calculate rates: ' + data.error);
      }
    } catch (error) {
      console.error('Error calculating rates:', error);
      alert('Error calculating rates');
    } finally {
      setLoading(false);
    }
  };

  const updateShippingStatus = async (status: string) => {
    if (selectedOrders.size === 0) {
      alert('Please select orders to update');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/shipping/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderIds: Array.from(selectedOrders),
          status,
          automaticNotification: true
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Updated ${data.updatedOrders} orders to ${status}`);
        fetchOrders();
        fetchShippingStats();
        setSelectedOrders(new Set());
      } else {
        alert('Failed to update status: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    const newSelection = new Set(selectedOrders);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedOrders(newSelection);
  };

  const selectAllOrders = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(order => order.orderId)));
    }
  };

  // Filter orders based on current filters
  const filteredOrders = orders.filter(order => {
    if (filters.status !== 'all' && order.shipping?.status !== filters.status) return false;
    if (filters.carrier !== 'all' && order.shipping?.carrier !== filters.carrier) return false;
    if (searchTerm && !order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.customer?.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const StatCard = ({ title, value, icon: Icon, color, subtext, trend }: any) => (
    <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
            {trend && (
              <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {trend === 'up' ? '↗️' : '↘️'}
              </div>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtext && <p className="text-sm text-gray-500">{subtext}</p>}
        </div>
        <div className={`p-4 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Truck className="w-8 h-8 text-blue-600" />
            Shipping Management Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Complete shipping operations and logistics control
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchShippingStats} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </Button>
          <Button onClick={() => setActiveView('labels')} className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Generate Labels
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Shipments"
          value={shippingStats.pendingShipments}
          icon={Clock}
          color="text-yellow-600"
          subtext="Awaiting processing"
          trend="up"
        />
        <StatCard
          title="Shipped Today"
          value={shippingStats.shippedToday}
          icon={Package}
          color="text-blue-600"
          subtext="Packages sent"
          trend="up"
        />
        <StatCard
          title="In Transit"
          value={shippingStats.inTransit}
          icon={Truck}
          color="text-purple-600"
          subtext="On the way"
        />
        <StatCard
          title="Delivered"
          value={shippingStats.delivered}
          icon={CheckCircle}
          color="text-green-600"
          subtext="Successfully delivered"
          trend="up"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Avg Delivery Time"
          value={`${Math.round(shippingStats.averageDeliveryTime)} days`}
          icon={Target}
          color="text-indigo-600"
          subtext="From shipment to delivery"
        />
        <StatCard
          title="On-Time Rate"
          value={`${Math.round(shippingStats.onTimeRate)}%`}
          icon={Star}
          color="text-emerald-600"
          subtext="Delivered on schedule"
          trend="up"
        />
        <StatCard
          title="Shipping Revenue"
          value={`€${Math.round(shippingStats.totalShippingCost)}`}
          icon={DollarSign}
          color="text-rose-600"
          subtext="Total shipping costs"
        />
      </div>

      {/* Carrier Performance */}
      {carriers.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Carrier Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carriers.map((carrier, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{carrier._id}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    carrier.onTimeRate > 90 ? 'bg-green-100 text-green-700' :
                    carrier.onTimeRate > 70 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {Math.round(carrier.onTimeRate)}% on-time
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Orders:</span>
                    <span className="font-medium">{carrier.orderCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Cost:</span>
                    <span className="font-medium">€{carrier.averageCost?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deliveries:</span>
                    <span className="font-medium">{carrier.totalDeliveries}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => setActiveView('orders')}
            variant="outline"
            className="w-full justify-start h-20 flex-col gap-2"
          >
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <span>Manage Orders</span>
          </Button>
          <Button
            onClick={() => setActiveView('labels')}
            variant="outline"
            className="w-full justify-start h-20 flex-col gap-2"
          >
            <Printer className="w-6 h-6 text-green-600" />
            <span>Print Labels</span>
          </Button>
          <Button
            onClick={() => setActiveView('rates')}
            variant="outline"
            className="w-full justify-start h-20 flex-col gap-2"
          >
            <Calculator className="w-6 h-6 text-purple-600" />
            <span>Calculate Rates</span>
          </Button>
          <Button
            onClick={() => setActiveView('tracking')}
            variant="outline"
            className="w-full justify-start h-20 flex-col gap-2"
          >
            <MapPin className="w-6 h-6 text-orange-600" />
            <span>Track Packages</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-blue-600" />
            Shipping Orders Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage orders that need shipping processing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchOrders} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          {selectedOrders.size > 0 && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => updateShippingStatus('shipped')}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Mark as Shipped ({selectedOrders.size})
              </Button>
              <Button
                onClick={generateLabels}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Generate Labels
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Order ID or customer email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="shipped">Shipped</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Carrier</label>
            <select
              value={filters.carrier}
              onChange={(e) => setFilters(prev => ({ ...prev, carrier: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Carriers</option>
              <option value="CTT">CTT</option>
              <option value="DPD">DPD</option>
              <option value="UPS">UPS</option>
              <option value="DHL">DHL</option>
              <option value="Correios">Correios</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={selectAllOrders}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              {selectedOrders.size === filteredOrders.length ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              Select All
            </Button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Orders for Shipping</h3>
            <span className="text-sm text-gray-600">
              {filteredOrders.length} orders ({selectedOrders.size} selected)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleOrderSelection(order.orderId)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {selectedOrders.has(order.orderId) ?
                        <CheckSquare className="w-5 h-5" /> :
                        <Square className="w-5 h-5" />
                      }
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">#{order.orderId?.slice(-8)}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(order.timestamps?.createdAt || order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </span>
                      <span className="text-xs text-gray-500">{order.customer?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900">
                        {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                      </span>
                      <span className="text-xs text-gray-500">{order.deliveryAddress?.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.shipping?.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.shipping?.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.shipping?.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.shipping?.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.shipping?.trackingNumber ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-mono text-gray-900">
                          {order.shipping.trackingNumber}
                        </span>
                        <span className="text-xs text-gray-500">{order.shipping.carrier}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2"
                        onClick={() => {
                          // View order details
                          alert(`View details for order ${order.orderId}`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.shipping?.trackingNumber && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="p-2"
                          onClick={() => {
                            window.open(order.shipping.trackingUrl, '_blank');
                          }}
                        >
                          <MapPin className="w-4 h-4" />
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
            <p className="text-gray-500">No orders found matching the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLabels = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Printer className="w-7 h-7 text-green-600" />
            Shipping Label Generation
          </h2>
          <p className="text-gray-600 mt-1">
            Generate professional shipping labels for multiple carriers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setActiveView('orders')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Select Orders
          </Button>
        </div>
      </div>

      {/* Label Configuration */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Label Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carrier Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Carrier</label>
            <select
              value={labelGeneration.selectedCarrier}
              onChange={(e) => setLabelGeneration(prev => ({ ...prev, selectedCarrier: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ctt">CTT Express</option>
              <option value="dpd">DPD</option>
              <option value="ups">UPS</option>
              <option value="dhl">DHL Express</option>
              <option value="correios">Correios</option>
            </select>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select
              value={labelGeneration.format}
              onChange={(e) => setLabelGeneration(prev => ({ ...prev, format: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pdf">PDF (4x6)</option>
              <option value="png">PNG Image</option>
              <option value="zpl">ZPL (Thermal Printer)</option>
            </select>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
            <div className="space-y-2">
              {Object.entries(labelGeneration.options).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setLabelGeneration(prev => ({
                      ...prev,
                      options: { ...prev.options, [key]: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Orders Info */}
        {selectedOrders.size > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Selected Orders ({selectedOrders.size})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Weight (est.): </span>
                <span className="font-medium">{selectedOrders.size * 1.5} kg</span>
              </div>
              <div>
                <span className="text-blue-700">Estimated Cost: </span>
                <span className="font-medium">€{(selectedOrders.size * 8.50).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={generateLabels}
            disabled={selectedOrders.size === 0 || loading}
            className="flex items-center gap-2 px-8 py-3"
          >
            <Printer className="w-5 h-5" />
            {loading ? 'Generating...' : `Generate ${selectedOrders.size} Labels`}
          </Button>
        </div>
      </div>

      {/* Generated Labels */}
      {labels.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Generated Labels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {labels.map((label, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">#{label.orderId.slice(-8)}</span>
                  <span className="text-xs text-gray-500">{label.carrier}</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Tracking: {label.trackingNumber}</div>
                  <div>Cost: €{label.cost}</div>
                  <div>Delivery: {label.estimatedDelivery.toLocaleDateString()}</div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(label.labelUrl, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="p-2"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderRates = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Calculator className="w-7 h-7 text-purple-600" />
            Shipping Rate Calculator
          </h2>
          <p className="text-gray-600 mt-1">
            Calculate shipping rates for different carriers and services
          </p>
        </div>
      </div>

      {/* Rate Calculator */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Calculate Shipping Rates</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Destination */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Destination</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={rateCalculation.destination.city}
                    onChange={(e) => setRateCalculation(prev => ({
                      ...prev,
                      destination: { ...prev.destination, city: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter destination city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    value={rateCalculation.destination.country}
                    onChange={(e) => setRateCalculation(prev => ({
                      ...prev,
                      destination: { ...prev.destination, country: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PT">Portugal</option>
                    <option value="ES">Spain</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="IT">Italy</option>
                    <option value="BR">Brazil</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Region</label>
                  <input
                    type="text"
                    value={rateCalculation.destination.state}
                    onChange={(e) => setRateCalculation(prev => ({
                      ...prev,
                      destination: { ...prev.destination, state: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="State or region"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={rateCalculation.destination.zipCode}
                    onChange={(e) => setRateCalculation(prev => ({
                      ...prev,
                      destination: { ...prev.destination, zipCode: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="ZIP/Postal code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Package Details</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rateCalculation.packages[0].weight}
                    onChange={(e) => setRateCalculation(prev => ({
                      ...prev,
                      packages: [{ ...prev.packages[0], weight: parseFloat(e.target.value) || 0 }]
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value (€)</label>
                  <input
                    type="number"
                    value={rateCalculation.packages[0].value}
                    onChange={(e) => setRateCalculation(prev => ({
                      ...prev,
                      packages: [{ ...prev.packages[0], value: parseFloat(e.target.value) || 0 }]
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (cm)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={rateCalculation.packages[0].length}
                    onChange={(e) => setRateCalculation(prev => ({
                      ...prev,
                      packages: [{ ...prev.packages[0], length: parseFloat(e.target.value) || 0 }]
                    }))}
                    placeholder="Length"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={rateCalculation.packages[0].width}
                    onChange={(e) => setRateCalculation(prev => ({
                      ...prev,
                      packages: [{ ...prev.packages[0], width: parseFloat(e.target.value) || 0 }]
                    }))}
                    placeholder="Width"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={rateCalculation.packages[0].height}
                    onChange={(e) => setRateCalculation(prev => ({
                      ...prev,
                      packages: [{ ...prev.packages[0], height: parseFloat(e.target.value) || 0 }]
                    }))}
                    placeholder="Height"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={calculateRates}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3"
          >
            <Calculator className="w-5 h-5" />
            {loading ? 'Calculating...' : 'Calculate Rates'}
          </Button>
        </div>
      </div>

      {/* Rates Results */}
      {rateCalculation.rates.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Shipping Rates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rateCalculation.rates.map((rate, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{rate.carrier}</span>
                  <span className="text-lg font-bold text-blue-600">€{rate.cost.toFixed(2)}</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Service: {rate.service}</div>
                  <div>Delivery: {rate.estimatedDays} days</div>
                  <div>Features: {rate.features.join(', ')}</div>
                  {rate.restrictions && rate.restrictions.length > 0 && (
                    <div className="text-red-600">
                      Restrictions: {rate.restrictions.join(', ')}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setLabelGeneration(prev => ({ ...prev, selectedCarrier: rate.carrier.toLowerCase() }));
                      setActiveView('labels');
                    }}
                  >
                    Select Carrier
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTracking = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <MapPin className="w-7 h-7 text-orange-600" />
            Package Tracking
          </h2>
          <p className="text-gray-600 mt-1">
            Track packages and manage delivery updates
          </p>
        </div>
      </div>

      {/* Tracking Interface */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Track Package</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Order ID or Tracking Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Order ID or tracking number..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Button className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Track
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Event
              </Button>
              <Button variant="outline" size="sm">
                <Send className="w-4 h-4 mr-1" />
                Notify Customer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tracking Activity */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Tracking Activity</h3>

        <div className="space-y-4">
          {/* Sample tracking events */}
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Package Shipped</span>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <p className="text-sm text-gray-600">Order #JC12345 shipped via CTT Express</p>
          </div>

          <div className="border-l-4 border-green-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Package Delivered</span>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            <p className="text-sm text-gray-600">Order #JC12340 delivered to João Silva</p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Out for Delivery</span>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            <p className="text-sm text-gray-600">Order #JC12338 out for delivery in Porto</p>
          </div>
        </div>
      </div>
    </div>
  );

  const views = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'orders', name: 'Orders', icon: ShoppingCart },
    { id: 'labels', name: 'Labels', icon: Printer },
    { id: 'rates', name: 'Rates', icon: Calculator },
    { id: 'tracking', name: 'Tracking', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Shipping Management</h1>
                <p className="text-sm text-gray-600">Complete logistics control</p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">All Systems Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <nav className="space-y-2">
                  {views.map(view => {
                    const Icon = view.icon;
                    const isActive = activeView === view.id;
                    return (
                      <button
                        key={view.id}
                        onClick={() => setActiveView(view.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mr-3 ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`} />
                        <span className="font-medium">{view.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-8">
                {activeView === 'dashboard' && renderDashboard()}
                {activeView === 'orders' && renderOrders()}
                {activeView === 'labels' && renderLabels()}
                {activeView === 'rates' && renderRates()}
                {activeView === 'tracking' && renderTracking()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}