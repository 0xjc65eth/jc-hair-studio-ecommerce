// Sistema de automação de emails baseado no status do pedido

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderData {
  id: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
  shippingAddress?: string;
  trackingCode?: string;
  carrier?: string;
  estimatedDelivery?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderEmailAutomation {
  private static baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Enviar email automaticamente baseado na mudança de status
  static async handleStatusChange(
    oldStatus: OrderStatus | null,
    newStatus: OrderStatus,
    orderData: OrderData
  ): Promise<boolean> {
    console.log(`📋 Status do pedido ${orderData.id}: ${oldStatus} → ${newStatus}`);

    try {
      switch (newStatus) {
        case 'CONFIRMED':
          return await this.sendOrderConfirmation(orderData);

        case 'SHIPPED':
          if (orderData.trackingCode && orderData.carrier) {
            return await this.sendShippingNotification(orderData);
          } else {
            console.warn(`⚠️ Pedido ${orderData.id} marcado como SHIPPED mas sem código de rastreamento`);
            return false;
          }

        case 'DELIVERED':
          return await this.sendDeliveryConfirmation(orderData);

        case 'CANCELLED':
          return await this.sendCancellationNotification(orderData);

        default:
          console.log(`ℹ️ Status ${newStatus} não requer envio automático de email`);
          return true;
      }
    } catch (error) {
      console.error(`❌ Erro ao processar automação de email para pedido ${orderData.id}:`, error);
      return false;
    }
  }

  // Confirmação de pedido
  private static async sendOrderConfirmation(orderData: OrderData): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order-confirmation',
        data: {
          orderId: orderData.id,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          items: orderData.items,
          total: orderData.total,
          paymentMethod: orderData.paymentMethod
        }
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ Email de confirmação enviado para pedido ${orderData.id}`);
      return true;
    } else {
      console.error(`❌ Falha no email de confirmação:`, result.error);
      return false;
    }
  }

  // Notificação de despacho
  private static async sendShippingNotification(orderData: OrderData): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/notify-shipping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: orderData.id,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        trackingCode: orderData.trackingCode,
        carrier: orderData.carrier,
        estimatedDelivery: orderData.estimatedDelivery,
        shippingAddress: orderData.shippingAddress,
        items: orderData.items.map(item => ({
          name: item.name,
          quantity: item.quantity
        }))
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ Email de despacho enviado para pedido ${orderData.id}`);
      return true;
    } else {
      console.error(`❌ Falha no email de despacho:`, result.error);
      return false;
    }
  }

  // Confirmação de entrega
  private static async sendDeliveryConfirmation(orderData: OrderData): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'custom',
        data: {
          to: orderData.customerEmail,
          subject: `📦 Pedido Entregue #${orderData.id} - JC Hair Studio's 62`,
          html: this.generateDeliveryEmailHtml(orderData),
          text: this.generateDeliveryEmailText(orderData)
        }
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ Email de entrega enviado para pedido ${orderData.id}`);
      return true;
    } else {
      console.error(`❌ Falha no email de entrega:`, result.error);
      return false;
    }
  }

  // Notificação de cancelamento
  private static async sendCancellationNotification(orderData: OrderData): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'custom',
        data: {
          to: orderData.customerEmail,
          subject: `❌ Pedido Cancelado #${orderData.id} - JC Hair Studio's 62`,
          html: this.generateCancellationEmailHtml(orderData),
          text: this.generateCancellationEmailText(orderData)
        }
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ Email de cancelamento enviado para pedido ${orderData.id}`);
      return true;
    } else {
      console.error(`❌ Falha no email de cancelamento:`, result.error);
      return false;
    }
  }

  // Templates de email para entrega
  private static generateDeliveryEmailHtml(orderData: OrderData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pedido Entregue - JC Hair Studio's 62</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ff6b9d; margin: 0;">JC Hair Studio's 62</h1>
            <p style="color: #666; margin: 5px 0;">Pedido Entregue com Sucesso! 🎉</p>
          </div>

          <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #c3e6cb;">
            <h2 style="margin-top: 0; color: #155724;">Parabéns, ${orderData.customerName}!</h2>
            <p>Seu pedido #${orderData.id} foi entregue com sucesso!</p>
          </div>

          <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #0066cc;">💄 Como foi sua experiência?</h3>
            <p>Adoraríamos saber sua opinião sobre os produtos!<br>
            📱 Compartilhe nas redes sociais e marque @jchairstudios62<br>
            ⭐ Sua avaliação é muito importante para nós</p>
          </div>

          <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0;">Obrigado por escolher o JC Hair Studio's 62!</p>
            <p style="color: #666; margin: 5px 0;">💄 Sua beleza é nossa inspiração 💄</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static generateDeliveryEmailText(orderData: OrderData): string {
    return `
      JC Hair Studio's 62 - Pedido Entregue!

      Parabéns, ${orderData.customerName}!

      Seu pedido #${orderData.id} foi entregue com sucesso!

      Como foi sua experiência?
      - Compartilhe nas redes sociais
      - Marque @jchairstudios62
      - Sua avaliação é importante

      Obrigado por escolher o JC Hair Studio's 62!
    `;
  }

  // Templates de email para cancelamento
  private static generateCancellationEmailHtml(orderData: OrderData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pedido Cancelado - JC Hair Studio's 62</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ff6b9d; margin: 0;">JC Hair Studio's 62</h1>
            <p style="color: #666; margin: 5px 0;">Pedido Cancelado</p>
          </div>

          <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #f5c6cb;">
            <h2 style="margin-top: 0; color: #721c24;">Olá, ${orderData.customerName}</h2>
            <p>Seu pedido #${orderData.id} foi cancelado conforme solicitado.</p>
          </div>

          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #856404;">💳 Informações sobre Reembolso</h3>
            <p>Se você já efetuou o pagamento:<br>
            • O reembolso será processado em até 5 dias úteis<br>
            • O valor aparecerá na sua fatura do cartão<br>
            • Você receberá uma confirmação por email</p>
          </div>

          <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #0066cc;">🛍️ Continue Navegando</h3>
            <p>Que tal dar uma olhada em nossos outros produtos?<br>
            Temos sempre novidades esperando por você!</p>
          </div>

          <div style="text-align: center; padding: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0;">Dúvidas? Entre em contato conosco!</p>
            <p style="color: #666; margin: 5px 0;">💄 JC Hair Studio's 62 💄</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static generateCancellationEmailText(orderData: OrderData): string {
    return `
      JC Hair Studio's 62 - Pedido Cancelado

      Olá, ${orderData.customerName}

      Seu pedido #${orderData.id} foi cancelado conforme solicitado.

      Informações sobre Reembolso:
      • Processamento em até 5 dias úteis
      • Valor aparecerá na fatura do cartão
      • Confirmação por email

      Continue navegando em nossos produtos!

      Dúvidas? Entre em contato conosco.
    `;
  }
}