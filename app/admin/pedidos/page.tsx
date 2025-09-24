'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils/formatters';
import { ShippingLabelService, ShippingLabelData } from '@/lib/services/shippingLabelService';
import { InvoiceService, InvoiceData } from '@/lib/services/invoiceService';
import {
  Package,
  Printer,
  Eye,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Download,
  Mail,
  MapPin,
  Phone,
  Calendar,
  DollarSign,
  CreditCard,
  User,
  ShoppingBag,
  FileText,
  Receipt
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
  phone?: string;
}

interface Order {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  shippingAddress: ShippingAddress;
  trackingCode?: string;
  carrier?: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

// Mock data para demonstração
const mockOrders: Order[] = [
  {
    id: '1',
    orderId: 'JC-2025-001',
    customerName: 'Maria Silva',
    customerEmail: 'maria.silva@email.com',
    customerPhone: '+351 912 345 678',
    items: [
      { id: '1', name: 'Kit Mega Hair Loiro 60cm', quantity: 1, price: 299.99 },
      { id: '2', name: 'Shampoo Matizador 500ml', quantity: 2, price: 35.50 }
    ],
    total: 370.99,
    subtotal: 335.49,
    shipping: 25.00,
    tax: 10.50,
    status: 'pending',
    paymentStatus: 'paid',
    paymentMethod: 'Cartão de Crédito',
    shippingAddress: {
      name: 'Maria Silva',
      street: 'Rua das Flores, 123',
      city: 'Lisboa',
      zipCode: '1000-001',
      country: 'Portugal',
      phone: '+351 912 345 678'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    orderId: 'JC-2025-002',
    customerName: 'Ana Santos',
    customerEmail: 'ana.santos@email.com',
    customerPhone: '+351 925 678 901',
    items: [
      { id: '3', name: 'Progressiva Vogue Premium', quantity: 1, price: 189.90 },
      { id: '4', name: 'Máscara Hidratação Profunda', quantity: 1, price: 45.00 }
    ],
    total: 244.90,
    subtotal: 234.90,
    shipping: 10.00,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'PayPal',
    shippingAddress: {
      name: 'Ana Santos',
      street: 'Av. da Liberdade, 456',
      city: 'Porto',
      zipCode: '4000-123',
      country: 'Portugal',
      phone: '+351 925 678 901'
    },
    trackingCode: 'CTT123456789PT',
    carrier: 'CTT',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    orderId: 'JC-2025-003',
    customerName: 'Juliana Costa',
    customerEmail: 'juliana.dayane110@gmail.com',
    customerPhone: '+351 932 123 456',
    items: [
      { id: '5', name: 'Kit Completo Coloração', quantity: 3, price: 78.50 }
    ],
    total: 245.50,
    subtotal: 235.50,
    shipping: 10.00,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Visa ****7842',
    shippingAddress: {
      name: 'Juliana Costa',
      street: 'Rua do Comércio, 789',
      city: 'Braga',
      zipCode: '4700-456',
      country: 'Portugal',
      phone: '+351 932 123 456'
    },
    trackingCode: 'DHL987654321PT',
    carrier: 'DHL',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Função para gerar etiqueta
  const generateShippingLabel = async (order: Order) => {
    setIsLoading(true);
    try {
      const labelData: ShippingLabelData = {
        orderId: order.orderId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity
        })),
        trackingCode: order.trackingCode,
        carrier: order.carrier,
        weight: "0.5kg",
        dimensions: "30x20x10cm",
        createdAt: new Date(order.createdAt)
      };

      // Gerar e baixar o PDF real
      ShippingLabelService.downloadLabel(labelData);

      // Notificação de sucesso
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `✅ Etiqueta gerada para pedido ${order.orderId}!`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);

    } catch (error) {
      console.error('Erro ao gerar etiqueta:', error);
      alert('Erro ao gerar etiqueta');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para gerar nota fiscal
  const generateInvoice = async (order: Order) => {
    setIsLoading(true);
    try {
      const invoiceData: InvoiceData = {
        invoiceNumber: `INV-${order.orderId}-${Date.now().toString().slice(-6)}`,
        orderId: order.orderId,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        customerTaxId: '123456789', // Seria obtido dos dados do cliente
        billingAddress: {
          name: order.shippingAddress.name,
          street: order.shippingAddress.street,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          zipCode: order.shippingAddress.zipCode,
          country: order.shippingAddress.country
        },
        items: order.items.map(item => ({
          description: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.price * item.quantity,
          taxRate: 23 // IVA Portugal
        })),
        subtotal: order.subtotal || order.total * 0.877, // Aproximação sem IVA
        taxAmount: (order.subtotal || order.total * 0.877) * 0.23,
        shipping: order.shipping,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        notes: 'Obrigado pela sua compra! Todos os produtos têm garantia de qualidade.',
        companyData: {
          name: "JC Hair Studio's 62",
          address: "R. Gil Vicente N°5, Torre da Marinha, 2840-474 Seixal - Portugal",
          taxId: "PT123456789",
          phone: "+351 928 375 226",
          email: "juliocesarurss62@gmail.com",
          website: "jchairstudios62.xyz"
        }
      };

      // Gerar e baixar o PDF da nota fiscal
      InvoiceService.downloadInvoice(invoiceData);

      // Notificação de sucesso
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `📄 Nota fiscal gerada para pedido ${order.orderId}!`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);

    } catch (error) {
      console.error('Erro ao gerar nota fiscal:', error);
      alert('Erro ao gerar nota fiscal');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar status do pedido
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Filtrar pedidos
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: Order['status']) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pendente' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', icon: RefreshCw, label: 'Processando' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Truck, label: 'Enviado' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Entregue' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Cancelado' }
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  const getPaymentBadge = (status: Order['paymentStatus']) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendente' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Pago' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Falhou' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Reembolsado' }
    };
    const badge = badges[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="mr-3 text-blue-600" />
            Gestão de Pedidos
          </h1>
          <p className="text-gray-600 mt-2">
            Visualize, gerencie e processe todos os pedidos da sua loja
          </p>
        </div>

        {/* Filtros e Pesquisa */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Pesquisar por ID, nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendentes</option>
                <option value="processing">Processando</option>
                <option value="shipped">Enviados</option>
                <option value="delivered">Entregues</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Em Trânsito</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'shipped').length}
                </p>
              </div>
              <Truck className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tabela de Pedidos */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      {getPaymentBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Ver detalhes"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => generateShippingLabel(order)}
                          className="text-green-600 hover:text-green-800"
                          title="Gerar etiqueta"
                          disabled={isLoading || order.status === 'delivered' || order.status === 'cancelled'}
                        >
                          <Printer className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => generateInvoice(order)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Gerar nota fiscal"
                          disabled={isLoading}
                        >
                          <Receipt className="w-5 h-5" />
                        </button>
                        {order.trackingCode && (
                          <button
                            className="text-purple-600 hover:text-purple-800"
                            title="Rastreamento"
                          >
                            <Truck className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Detalhes do Pedido */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Pedido {selectedOrder.orderId}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Status e Ações */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(selectedOrder.status)}
                      {getPaymentBadge(selectedOrder.paymentStatus)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => generateShippingLabel(selectedOrder)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                        disabled={isLoading}
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Etiqueta
                      </button>
                      <button
                        onClick={() => generateInvoice(selectedOrder)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
                        disabled={isLoading}
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Nota Fiscal
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </button>
                    </div>
                  </div>
                </div>

                {/* Informações do Cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Informações do Cliente
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Nome:</span> {selectedOrder.customerName}</p>
                      <p><span className="text-gray-600">Email:</span> {selectedOrder.customerEmail}</p>
                      {selectedOrder.customerPhone && (
                        <p><span className="text-gray-600">Telefone:</span> {selectedOrder.customerPhone}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Endereço de Entrega
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>{selectedOrder.shippingAddress.name}</p>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                      {selectedOrder.shippingAddress.phone && (
                        <p className="flex items-center mt-2">
                          <Phone className="w-3 h-3 mr-1" />
                          {selectedOrder.shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Itens do Pedido */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qtd</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Preço</th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-center">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatCurrency(item.price)}</td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                            Subtotal:
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                            {formatCurrency(selectedOrder.subtotal || selectedOrder.total)}
                          </td>
                        </tr>
                        {selectedOrder.shipping && (
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-sm text-gray-600 text-right">
                              Frete:
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 text-right">
                              {formatCurrency(selectedOrder.shipping)}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-base font-bold text-gray-900 text-right">
                            Total:
                          </td>
                          <td className="px-4 py-2 text-base font-bold text-gray-900 text-right">
                            {formatCurrency(selectedOrder.total)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Informações de Envio */}
                {selectedOrder.trackingCode && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Truck className="w-4 h-4 mr-2" />
                      Informações de Envio
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Transportadora:</span> {selectedOrder.carrier}
                      </div>
                      <div>
                        <span className="text-gray-600">Código de Rastreamento:</span> {selectedOrder.trackingCode}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}