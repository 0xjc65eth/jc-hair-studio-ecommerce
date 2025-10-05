'use client';

import {
  X,
  ShoppingBag,
  MapPin,
  Package,
  Truck,
  Copy,
} from 'lucide-react';
import { ActionButton } from '../shared';

/**
 * Props do OrderDetailModal
 */
interface OrderDetailModalProps {
  /**
   * Pedido selecionado para exibir detalhes
   */
  order: any;

  /**
   * Se o modal está aberto
   */
  isOpen: boolean;

  /**
   * Callback para fechar o modal
   */
  onClose: () => void;

  /**
   * Callback para criar etiqueta de envio
   */
  onCreateLabel?: (order: any) => void;

  /**
   * Callback para atualizar status
   */
  onUpdateStatus?: (orderId: string, status: string) => void;
}

/**
 * OrderDetailModal Component
 *
 * Modal para exibir detalhes completos de um pedido.
 *
 * Features:
 * - Informações do cliente
 * - Endereço de entrega
 * - Lista completa de produtos com imagens
 * - Resumo de valores (subtotal, envio, total)
 * - Ações rápidas (criar etiqueta, atualizar status, copiar ID)
 * - Design responsivo
 * - Scroll vertical para pedidos grandes
 *
 * @component
 *
 * @example
 * <OrderDetailModal
 *   order={selectedOrder}
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onCreateLabel={handleCreateLabel}
 *   onUpdateStatus={handleUpdateStatus}
 * />
 */
export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onCreateLabel,
  onUpdateStatus,
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header do Modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            📦 Detalhes do Pedido #{order._id?.slice(-8)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações do Cliente */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Informações do Cliente
              </h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Nome:</span> {order.name}</div>
                <div><span className="font-medium">Email:</span> {order.email}</div>
                <div><span className="font-medium">Telefone:</span> {order.phone || 'Não informado'}</div>
                <div><span className="font-medium">Data:</span> {new Date(order.createdAt).toLocaleString('pt-BR')}</div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status === 'pending' ? 'Pendente' :
                     order.status === 'processing' ? 'Processando' :
                     order.status === 'shipped' ? 'Enviado' :
                     order.status === 'delivered' ? 'Entregue' :
                     order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Endereço de Entrega */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Endereço de Entrega
              </h3>
              <div className="space-y-1 text-sm">
                <div>{order.address}</div>
                <div>{order.city}, {order.state}</div>
                <div>CEP: {order.postalCode}</div>
                <div>{order.country || 'Brasil'}</div>
              </div>
            </div>
          </div>

          {/* Produtos do Pedido */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produtos do Pedido ({order.products?.length || 0} itens)
            </h3>

            <div className="space-y-3">
              {order.products && order.products.length > 0 ? (
                order.products.map((product: any, index: number) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
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
                </div>
              )}
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Resumo do Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>€{(order.totalAmount - (order.shippingCost || 0)).toFixed(2)}</span>
              </div>
              {order.shippingCost && (
                <div className="flex justify-between">
                  <span>Envio:</span>
                  <span>€{order.shippingCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
                <span>Total:</span>
                <span>€{order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-6 flex flex-wrap gap-3">
            {onCreateLabel && (
              <ActionButton
                icon={Truck}
                label="Criar Etiqueta de Envio"
                onClick={() => onCreateLabel(order)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              />
            )}

            {onUpdateStatus && (
              <ActionButton
                icon={Package}
                label="Marcar como Processando"
                onClick={() => onUpdateStatus(order._id, 'processing')}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              />
            )}

            <ActionButton
              icon={Copy}
              label="Copiar ID"
              onClick={() => {
                navigator.clipboard.writeText(order._id);
                alert('ID do pedido copiado!');
              }}
              variant="outline"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
