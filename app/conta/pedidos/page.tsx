'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, Eye, ArrowLeft } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  shipping: {
    method: string;
    address: string;
    trackingCode?: string;
  };
}

const statusConfig = {
  pending: { label: 'Aguardando Pagamento', color: 'text-yellow-600 bg-yellow-100', icon: Clock },
  processing: { label: 'Processando', color: 'text-blue-600 bg-blue-100', icon: Package },
  shipped: { label: 'Enviado', color: 'text-purple-600 bg-purple-100', icon: Truck },
  delivered: { label: 'Entregue', color: 'text-green-600 bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'text-red-600 bg-red-100', icon: Package }
};

export default function PedidosPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session) return;

      try {
        // Mock data - replace with actual API call
        const mockOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'JC-2024-001',
            date: '2024-01-15',
            status: 'delivered',
            total: 89.90,
            items: [
              { id: '1', name: 'Shampoo Hidratante L\'Oréal', quantity: 2, price: 24.95, image: '/placeholder-product.jpg' },
              { id: '2', name: 'Condicionador Nutritivo', quantity: 1, price: 39.90, image: '/placeholder-product.jpg' }
            ],
            shipping: {
              method: 'Correios PAC',
              address: 'Rua das Flores, 123 - São Paulo, SP',
              trackingCode: 'BR123456789'
            }
          },
          {
            id: '2',
            orderNumber: 'JC-2024-002',
            date: '2024-01-20',
            status: 'shipped',
            total: 156.80,
            items: [
              { id: '3', name: 'Kit Progressiva Wella', quantity: 1, price: 156.80, image: '/placeholder-product.jpg' }
            ],
            shipping: {
              method: 'Sedex',
              address: 'Rua das Flores, 123 - São Paulo, SP',
              trackingCode: 'BR987654321'
            }
          },
          {
            id: '3',
            orderNumber: 'JC-2024-003',
            date: '2024-01-25',
            status: 'processing',
            total: 67.40,
            items: [
              { id: '4', name: 'Tinta para Cabelo Loreal', quantity: 2, price: 33.70, image: '/placeholder-product.jpg' }
            ],
            shipping: {
              method: 'Correios PAC',
              address: 'Rua das Flores, 123 - São Paulo, SP'
            }
          }
        ];

        setOrders(mockOrders);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Você precisa estar logado para ver seus pedidos.</p>
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Fazer login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/conta"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minha Conta
          </Link>
          <h1 className="text-3xl font-light text-gray-900 mb-2">Meus Pedidos</h1>
          <p className="text-gray-600">Acompanhe o status dos seus pedidos</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-gray-600 mb-6">Você ainda não fez nenhum pedido conosco.</p>
            <Link
              href="/cosmeticos"
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Começar a Comprar
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Pedido #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Realizado em {new Date(order.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig[order.status].label}
                      </div>
                      <div className="text-lg font-medium text-gray-900">
                        €{order.total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-3">Itens do Pedido</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{item.name}</h5>
                                <p className="text-sm text-gray-600">
                                  Quantidade: {item.quantity} | €{item.price.toFixed(2)} cada
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  €{(item.quantity * item.price).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Informações de Entrega</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Método:</span> {order.shipping.method}</p>
                          <p><span className="font-medium">Endereço:</span> {order.shipping.address}</p>
                          {order.shipping.trackingCode && (
                            <p><span className="font-medium">Código de rastreio:</span> {order.shipping.trackingCode}</p>
                          )}
                        </div>

                        {order.shipping.trackingCode && (
                          <button className="mt-4 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                            <Eye className="w-4 h-4" />
                            Rastrear Pedido
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}