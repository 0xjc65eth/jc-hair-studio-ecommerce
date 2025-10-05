'use client';

import { useState } from 'react';
import { useOrders } from '../hooks';
import { FilterBar, ActionButton, StatusBadge } from '../shared';
import {
  Package,
  MapPin,
  Eye,
  Truck,
  Send,
  Bell,
  Download,
  RefreshCw,
} from 'lucide-react';

/**
 * Props do OrdersTab
 */
interface OrdersTabProps {
  /**
   * Callback quando um pedido é selecionado para ver detalhes
   */
  onOrderSelect?: (order: any) => void;
}

/**
 * OrdersTab Component
 *
 * Aba de gerenciamento de pedidos do admin.
 * Lista, filtra e gerencia todos os pedidos da loja.
 *
 * Features:
 * - Listagem completa de pedidos
 * - Filtros avançados (status, cliente, valor, ordenação)
 * - Visualização de produtos e endereço de entrega
 * - Ações rápidas: criar etiqueta, atualizar status, notificar
 * - Exportação para CSV/Excel
 * - Auto-refresh a cada 30 segundos
 * - Exibição de imagens de produtos
 *
 * Utiliza:
 * - useOrders hook para lógica de negócio
 * - FilterBar para filtros
 * - StatusBadge para status visual
 * - ActionButton para ações
 *
 * @component
 *
 * @example
 * <OrdersTab onOrderSelect={(order) => setSelectedOrder(order)} />
 */
export function OrdersTab({ onOrderSelect }: OrdersTabProps) {
  const {
    filteredOrders,
    filters,
    loading,
    updateFilter,
    resetFilters,
    updateOrderStatus,
    createShippingLabel,
    resendNotification,
    exportToCSV,
    refresh,
  } = useOrders(true); // Auto-refresh habilitado

  const [actionLoading, setActionLoading] = useState<{[key: string]: boolean}>({});

  /**
   * Cria etiqueta de envio com feedback visual
   */
  const handleCreateLabel = async (order: any) => {
    setActionLoading(prev => ({ ...prev, [order._id]: true }));

    const result = await createShippingLabel(order);

    if (result.success) {
      alert(`✅ Etiqueta criada com sucesso!\n\nCódigo de rastreamento: ${result.trackingNumber}\nTransportadora: ${result.carrier}`);
      if (result.labelUrl) {
        window.open(result.labelUrl, '_blank');
      }
    } else {
      alert(`❌ Erro ao criar etiqueta: ${result.error}`);
    }

    setActionLoading(prev => ({ ...prev, [order._id]: false }));
  };

  /**
   * Exporta para Excel/CSV
   */
  const handleExport = () => {
    const csvData = exportToCSV();
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
  };

  return (
    <div className="space-y-6">
      {/* Header com Ações */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Gestão de Pedidos</h2>
          <div className="flex items-center gap-3">
            <ActionButton
              icon={Download}
              label="Exportar"
              onClick={handleExport}
              variant="outline"
            />
            <ActionButton
              icon={RefreshCw}
              label="Atualizar"
              onClick={refresh}
              variant="outline"
              loading={loading}
            />
          </div>
        </div>

        {/* Barra de Filtros */}
        <FilterBar
          filters={{
            statusOptions: [
              { value: 'all', label: 'Todos os Status' },
              { value: 'pending', label: 'Pendente' },
              { value: 'processing', label: 'Processando' },
              { value: 'shipped', label: 'Enviado' },
              { value: 'delivered', label: 'Entregue' },
              { value: 'cancelled', label: 'Cancelado' },
            ],
            statusValue: filters.status,
            onStatusChange: (value) => updateFilter('status', value),

            searchPlaceholder: 'Nome ou email...',
            searchValue: filters.customer,
            onSearchChange: (value) => updateFilter('customer', value),

            sortOptions: [
              { value: 'date', label: 'Data' },
              { value: 'totalAmount', label: 'Valor' },
              { value: 'status', label: 'Status' },
              { value: 'name', label: 'Nome' },
            ],
            sortValue: filters.sortBy,
            onSortChange: (value) => updateFilter('sortBy', value),

            orderOptions: [
              { value: 'desc', label: 'Mais recente' },
              { value: 'asc', label: 'Mais antigo' },
            ],
            orderValue: filters.sortOrder,
            onOrderChange: (value) => updateFilter('sortOrder', value),
          }}
          onReset={resetFilters}
          showReset={true}
        />
      </div>

      {/* Tabela de Pedidos */}
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
                🚚 Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order, index) => (
              <tr key={order._id || index} className="hover:bg-gray-50">
                {/* Pedido & Cliente */}
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

                {/* Produtos */}
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {order.products && order.products.length > 0 ? (
                      <div className="space-y-2">
                        {order.products.slice(0, 2).map((product: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
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
                        <span className="text-sm">Detalhes não disponíveis</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Endereço */}
                <td className="px-6 py-4">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-700">
                        <div className="font-medium">{order.address || 'Endereço não disponível'}</div>
                        <div>{order.city || 'Cidade'}, {order.state || 'Estado'}</div>
                        <div>CEP: {order.postalCode || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Valor & Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    €{order.totalAmount?.toFixed(2) || '0.00'}
                  </div>
                  <div className="mt-1">
                    <StatusBadge status={order.status} />
                  </div>
                  {order.trackingNumber && (
                    <div className="text-xs text-gray-500 mt-1">
                      Rastreio: {order.trackingNumber}
                    </div>
                  )}
                </td>

                {/* Ações */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <ActionButton
                      icon={Eye}
                      label="Ver Detalhes"
                      onClick={() => onOrderSelect?.(order)}
                      variant="outline"
                      size="sm"
                    />

                    {order.status === 'pending' && (
                      <ActionButton
                        icon={Truck}
                        label="Criar Etiqueta"
                        onClick={() => handleCreateLabel(order)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        loading={actionLoading[order._id]}
                      />
                    )}

                    {order.status === 'processing' && (
                      <ActionButton
                        icon={Send}
                        label="Marcar Enviado"
                        onClick={() => updateOrderStatus(order._id, 'shipped')}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      />
                    )}

                    {(order.status === 'pending' || order.status === 'processing') && (
                      <ActionButton
                        icon={Bell}
                        label="Notificar"
                        onClick={() => resendNotification(order._id, 'customer')}
                        variant="outline"
                        size="sm"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
