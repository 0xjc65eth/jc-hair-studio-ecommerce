import { NextRequest, NextResponse } from 'next/server';
import { OrderEmailAutomation, OrderStatus, OrderData } from '@/lib/utils/order-automation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, newStatus, orderData, oldStatus } = body;

    // Validação básica
    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: 'orderId e newStatus são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar se o status é válido
    const validStatuses: OrderStatus[] = [
      'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
    ];

    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: `Status inválido. Use: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Se orderData foi fornecido, usar para automação
    if (orderData) {
      console.log(`🔄 Processando mudança de status para pedido ${orderId}: ${oldStatus || 'N/A'} → ${newStatus}`);

      // Executar automação de email
      const emailSent = await OrderEmailAutomation.handleStatusChange(
        oldStatus || null,
        newStatus,
        {
          ...orderData,
          id: orderId,
          status: newStatus
        }
      );

      // Aqui você pode integrar com seu banco de dados para atualizar o status
      // await updateOrderInDatabase(orderId, newStatus);

      return NextResponse.json({
        success: true,
        message: `Status atualizado para ${newStatus}`,
        emailSent,
        data: {
          orderId,
          oldStatus: oldStatus || null,
          newStatus,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      // Apenas atualizar status sem automação
      console.log(`📝 Atualizando status do pedido ${orderId} para ${newStatus} (sem automação)`);

      return NextResponse.json({
        success: true,
        message: `Status atualizado para ${newStatus}`,
        emailSent: false,
        note: 'Nenhum email enviado - dados do pedido não fornecidos',
        data: {
          orderId,
          newStatus,
          timestamp: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET para documentação e exemplos
export async function GET() {
  return NextResponse.json({
    description: 'API para atualizar status de pedidos com automação de emails',
    endpoint: 'POST /api/update-order-status',
    validStatuses: [
      'PENDING - Pedido criado, aguardando pagamento',
      'CONFIRMED - Pagamento confirmado (envia email de confirmação)',
      'PROCESSING - Pedido sendo preparado',
      'SHIPPED - Pedido despachado (envia email com código de rastreamento)',
      'DELIVERED - Pedido entregue (envia email de entrega)',
      'CANCELLED - Pedido cancelado (envia email de cancelamento)',
      'REFUNDED - Pedido reembolsado'
    ],
    examples: {
      'Marcar como confirmado (com automação)': {
        orderId: 'JC123456',
        oldStatus: 'PENDING',
        newStatus: 'CONFIRMED',
        orderData: {
          customerName: 'Maria Silva',
          customerEmail: 'maria@email.com',
          items: [
            { name: 'Shampoo Loreal', quantity: 1, price: 29.90 }
          ],
          total: 29.90,
          paymentMethod: 'Cartão de Crédito',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:30:00Z'
        }
      },
      'Marcar como despachado (com automação)': {
        orderId: 'JC123456',
        oldStatus: 'PROCESSING',
        newStatus: 'SHIPPED',
        orderData: {
          customerName: 'Maria Silva',
          customerEmail: 'maria@email.com',
          items: [
            { name: 'Shampoo Loreal', quantity: 1, price: 29.90 }
          ],
          total: 29.90,
          paymentMethod: 'Cartão de Crédito',
          shippingAddress: 'Rua das Flores, 123\\nSão Paulo - SP',
          trackingCode: 'BR123456789BR',
          carrier: 'Correios',
          estimatedDelivery: '2024-01-15',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T14:00:00Z'
        }
      },
      'Apenas atualizar status (sem automação)': {
        orderId: 'JC123456',
        newStatus: 'PROCESSING'
      }
    },
    automation: {
      'CONFIRMED': 'Envia email de confirmação do pedido',
      'SHIPPED': 'Envia email com código de rastreamento (requer trackingCode e carrier)',
      'DELIVERED': 'Envia email de entrega com pedido de avaliação',
      'CANCELLED': 'Envia email de cancelamento com informações de reembolso'
    }
  });
}