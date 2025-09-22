'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/formatters';

interface LowStockAlert {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  sku: string;
  currentStock: number;
  threshold: number;
  status: 'ACTIVE' | 'RESOLVED';
  createdAt: Date;
}

export function LowStockAlerts() {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLowStockAlerts = async () => {
    try {
      const response = await fetch('/api/inventory?action=low-stock');
      const data = await response.json();

      if (data.success) {
        setAlerts(data.data);
      } else {
        console.error('Failed to fetch low stock alerts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching low stock alerts:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLowStockAlerts();
  };

  const handleRestock = async (productId: string, variantId?: string) => {
    const quantity = prompt('Digite a quantidade a adicionar ao estoque:');
    const quantityNum = parseInt(quantity || '0');

    if (!quantityNum || quantityNum <= 0) {
      alert('Quantidade inválida');
      return;
    }

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add',
          productId,
          variantId,
          quantity: quantityNum,
          reason: 'Reposição via alerta de estoque baixo'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Estoque atualizado com sucesso!');
        fetchLowStockAlerts(); // Refresh the list
      } else {
        alert('Erro ao atualizar estoque: ' + data.error);
      }
    } catch (error) {
      console.error('Error restocking:', error);
      alert('Erro ao atualizar estoque');
    }
  };

  useEffect(() => {
    fetchLowStockAlerts();
  }, []);

  const getStockLevelColor = (current: number, threshold: number) => {
    const percentage = (current / threshold) * 100;
    if (percentage <= 25) return 'text-red-600 bg-red-50';
    if (percentage <= 50) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getUrgencyLevel = (current: number, threshold: number) => {
    if (current === 0) return 'Sem estoque';
    if (current <= threshold * 0.25) return 'Crítico';
    if (current <= threshold * 0.5) return 'Baixo';
    return 'Atenção';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Alertas de Estoque Baixo</h2>
              <p className="text-sm text-gray-600">
                {alerts.length} produto{alerts.length !== 1 ? 's' : ''} com estoque baixo
              </p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="p-6">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum alerta de estoque baixo</p>
            <p className="text-sm text-gray-400 mt-1">
              Todos os produtos estão com estoque adequado
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${getStockLevelColor(alert.currentStock, alert.threshold)}
                      `}>
                        {getUrgencyLevel(alert.currentStock, alert.threshold)}
                      </div>
                      <h3 className="font-medium text-gray-900">
                        {alert.productName}
                        {alert.variantName && (
                          <span className="text-gray-500"> - {alert.variantName}</span>
                        )}
                      </h3>
                    </div>

                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">SKU:</span>
                        <span className="ml-1 font-mono">{alert.sku}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Estoque atual:</span>
                        <span className={`ml-1 font-medium ${
                          alert.currentStock === 0 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {alert.currentStock} unidades
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Limite mínimo:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {alert.threshold} unidades
                        </span>
                      </div>
                    </div>

                    {/* Stock Level Visual */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Nível de estoque</span>
                        <span>{alert.currentStock}/{alert.threshold}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            alert.currentStock === 0
                              ? 'bg-red-500'
                              : alert.currentStock <= alert.threshold * 0.25
                              ? 'bg-red-400'
                              : alert.currentStock <= alert.threshold * 0.5
                              ? 'bg-orange-400'
                              : 'bg-yellow-400'
                          }`}
                          style={{
                            width: `${Math.min(100, (alert.currentStock / alert.threshold) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Button
                      onClick={() => handleRestock(alert.productId, alert.variantId)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Package className="w-4 h-4 mr-1" />
                      Repor Estoque
                    </Button>
                    <Button
                      onClick={() => window.open(`/admin/products/${alert.productId}`, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      Ver Produto
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {alerts.length > 0 && (
        <div className="border-t p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>
                {alerts.filter(a => a.currentStock === 0).length} sem estoque
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span>
                {alerts.filter(a => a.currentStock > 0 && a.currentStock <= a.threshold * 0.5).length} estoque crítico
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>
                {alerts.filter(a => a.currentStock > a.threshold * 0.5).length} necessita atenção
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}