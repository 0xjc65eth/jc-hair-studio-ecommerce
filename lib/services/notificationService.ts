import {
  sendOrderConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendShippingNotificationEmail,
  sendContactEmail,
  OrderEmailData,
  PaymentEmailData,
  ShippingEmailData,
  ContactFormData
} from '@/lib/utils/sendgrid';
import logger from '@/lib/logger';
import PersistentNotificationLogger from './persistentNotificationLogger';

export interface NotificationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
    description?: string;
    brand?: string;
    category?: string;
  }>;
  paymentMethod?: string;
  shippingAddress?: any;
  trackingCode?: string;
  carrier?: string;
  transactionId?: string;
  orderDate?: string;
  estimatedDelivery?: string;
}

export type NotificationEvent =
  | 'order_created'
  | 'order_confirmed'
  | 'payment_confirmed'
  | 'order_processing'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'order_refunded'
  | 'inventory_low'
  | 'inventory_out';

export class NotificationService {
  private static readonly TEST_CLIENT_EMAIL = 'juliana.dayane110@gmail.com';
  private static readonly COMPANY_EMAIL = 'juliocesarurss62@gmail.com';

  // Controle de modo de teste através de variável de ambiente
  private static readonly IS_TEST_MODE = process.env.NOTIFICATION_TEST_MODE === 'true';

  /**
   * Determine which client email to use based on test mode
   */
  private static getClientEmail(originalEmail: string): string {
    if (this.IS_TEST_MODE) {
      logger.info(`🧪 TEST MODE: Overriding client email from ${originalEmail} to ${this.TEST_CLIENT_EMAIL}`);
      return this.TEST_CLIENT_EMAIL;
    }
    logger.info(`📧 PRODUCTION MODE: Using real client email ${originalEmail}`);
    return originalEmail;
  }

  /**
   * Dispatch notification based on event type
   */
  static async notify(event: NotificationEvent, data: NotificationData): Promise<{
    clientNotification: boolean;
    companyNotification: boolean;
  }> {
    logger.info(`📧 Dispatching notifications for event: ${event}`, {
      orderId: data.orderId,
      customerEmail: data.customerEmail
    });

    const results = {
      clientNotification: false,
      companyNotification: false
    };

    try {
      switch (event) {
        case 'order_created':
        case 'order_confirmed':
          results.clientNotification = await this.sendClientOrderConfirmation(data);
          results.companyNotification = await this.sendCompanyOrderNotification(data);
          break;

        case 'payment_confirmed':
          results.clientNotification = await this.sendClientPaymentConfirmation(data);
          results.companyNotification = await this.sendCompanyPaymentNotification(data);
          break;

        case 'order_processing':
          results.clientNotification = await this.sendClientProcessingNotification(data);
          results.companyNotification = await this.sendCompanyProcessingNotification(data);
          break;

        case 'order_shipped':
          results.clientNotification = await this.sendClientShippingNotification(data);
          results.companyNotification = await this.sendCompanyShippingNotification(data);
          break;

        case 'order_delivered':
          results.clientNotification = await this.sendClientDeliveryNotification(data);
          results.companyNotification = await this.sendCompanyDeliveryNotification(data);
          break;

        case 'order_cancelled':
          results.clientNotification = await this.sendClientCancellationNotification(data);
          results.companyNotification = await this.sendCompanyCancellationNotification(data);
          break;

        case 'inventory_low':
          results.companyNotification = await this.sendInventoryLowNotification(data);
          break;

        case 'inventory_out':
          results.companyNotification = await this.sendInventoryOutNotification(data);
          break;

        default:
          logger.warn(`Unknown notification event: ${event}`);
      }

      logger.info(`📧 Notification dispatch completed for ${event}`, {
        orderId: data.orderId,
        clientSent: results.clientNotification,
        companySent: results.companyNotification
      });

      // Log the notification attempt
      PersistentNotificationLogger.addLog({
        event,
        orderId: data.orderId,
        customerEmail: data.customerEmail,
        clientEmail: this.getClientEmail(data.customerEmail),
        companyEmail: this.COMPANY_EMAIL,
        clientSent: results.clientNotification,
        companySent: results.companyNotification,
        emailData: {
          customerName: data.customerName,
          total: data.total,
          itemCount: data.items.length
        }
      });

      return results;
    } catch (error) {
      logger.error(`Failed to dispatch notifications for event ${event}:`, error);
      return results;
    }
  }

  // CLIENT NOTIFICATIONS (juliana.dayane110@gmail.com)
  private static async sendClientOrderConfirmation(data: NotificationData): Promise<boolean> {
    try {
      const orderData: OrderEmailData = {
        orderId: data.orderId,
        customerName: data.customerName,
        customerEmail: this.getClientEmail(data.customerEmail),
        total: data.total,
        items: data.items,
        paymentMethod: data.paymentMethod || 'Cartão de Crédito',
        shippingAddress: data.shippingAddress,
        orderDate: data.orderDate || new Date().toLocaleDateString('pt-PT'),
        estimatedDelivery: data.estimatedDelivery || '5-10 dias úteis'
      };

      return await sendOrderConfirmationEmail(orderData);
    } catch (error) {
      logger.error('Failed to send client order confirmation:', error);
      return false;
    }
  }

  private static async sendClientPaymentConfirmation(data: NotificationData): Promise<boolean> {
    try {
      const paymentData: PaymentEmailData = {
        orderId: data.orderId,
        customerName: data.customerName,
        customerEmail: this.getClientEmail(data.customerEmail),
        total: data.total,
        paymentMethod: data.paymentMethod || 'Cartão de Crédito',
        transactionId: data.transactionId,
        paymentDate: new Date().toLocaleDateString('pt-PT'),
        estimatedDelivery: data.estimatedDelivery || '3-5 dias úteis'
      };

      return await sendPaymentConfirmationEmail(paymentData);
    } catch (error) {
      logger.error('Failed to send client payment confirmation:', error);
      return false;
    }
  }

  private static async sendClientProcessingNotification(data: NotificationData): Promise<boolean> {
    try {
      const contactData: ContactFormData = {
        name: data.customerName,
        email: this.getClientEmail(data.customerEmail),
        subject: `Pedido em Processamento #${data.orderId}`,
        message: `Seu pedido #${data.orderId} está sendo processado com muito cuidado. Total: €${data.total.toFixed(2)}. Previsão de envio: 1-2 dias úteis.`,
        formType: 'order_confirmation'
      };

      return await sendContactEmail(contactData);
    } catch (error) {
      logger.error('Failed to send client processing notification:', error);
      return false;
    }
  }

  private static async sendClientShippingNotification(data: NotificationData): Promise<boolean> {
    try {
      if (!data.trackingCode || !data.carrier) {
        logger.warn('Missing tracking information for shipping notification');
        return false;
      }

      const shippingData: ShippingEmailData = {
        orderId: data.orderId,
        customerName: data.customerName,
        customerEmail: this.getClientEmail(data.customerEmail),
        trackingCode: data.trackingCode,
        carrier: data.carrier,
        trackingUrl: `https://tracking.${data.carrier.toLowerCase()}.com/${data.trackingCode}`,
        estimatedDelivery: data.estimatedDelivery || '5-10 dias úteis',
        shippingAddress: data.shippingAddress,
        items: data.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        }))
      };

      return await sendShippingNotificationEmail(shippingData);
    } catch (error) {
      logger.error('Failed to send client shipping notification:', error);
      return false;
    }
  }

  private static async sendClientDeliveryNotification(data: NotificationData): Promise<boolean> {
    try {
      const contactData: ContactFormData = {
        name: data.customerName,
        email: this.getClientEmail(data.customerEmail),
        subject: `🎉 Pedido Entregue #${data.orderId} - JC Hair Studio's 62`,
        message: `Parabéns! Seu pedido #${data.orderId} foi entregue com sucesso! Esperamos que você ame seus novos produtos de beleza. Não se esqueça de compartilhar sua experiência conosco!`,
        formType: 'shipping_notification'
      };

      return await sendContactEmail(contactData);
    } catch (error) {
      logger.error('Failed to send client delivery notification:', error);
      return false;
    }
  }

  private static async sendClientCancellationNotification(data: NotificationData): Promise<boolean> {
    try {
      const contactData: ContactFormData = {
        name: data.customerName,
        email: this.getClientEmail(data.customerEmail),
        subject: `Pedido Cancelado #${data.orderId} - JC Hair Studio's 62`,
        message: `Seu pedido #${data.orderId} foi cancelado conforme solicitado. Se houve pagamento, o reembolso será processado em até 5 dias úteis. Qualquer dúvida, estamos aqui para ajudar!`,
        formType: 'support'
      };

      return await sendContactEmail(contactData);
    } catch (error) {
      logger.error('Failed to send client cancellation notification:', error);
      return false;
    }
  }

  // COMPANY NOTIFICATIONS (juliocesarurss62@gmail.com)
  private static async sendCompanyOrderNotification(data: NotificationData): Promise<boolean> {
    try {
      const itemsList = data.items.map(item =>
        `• ${item.name} (${item.quantity}x) - €${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');

      const contactData: ContactFormData = {
        name: 'Sistema de Notificações',
        email: this.COMPANY_EMAIL,
        subject: `🆕 NOVO PEDIDO #${data.orderId} - €${data.total.toFixed(2)}`,
        message: `
NOVO PEDIDO RECEBIDO!

📋 Pedido: #${data.orderId}
👤 Cliente: ${data.customerName} (${data.customerEmail})
💰 Total: €${data.total.toFixed(2)}
💳 Pagamento: ${data.paymentMethod || 'Cartão de Crédito'}
📅 Data: ${data.orderDate || new Date().toLocaleDateString('pt-PT')}

🛍️ PRODUTOS:
${itemsList}

📍 ENDEREÇO DE ENTREGA:
${data.shippingAddress ? JSON.stringify(data.shippingAddress, null, 2) : 'A definir'}

⏰ AÇÕES NECESSÁRIAS:
1. Confirmar disponibilidade dos produtos
2. Processar pagamento (se necessário)
3. Preparar produtos para envio
4. Gerar código de rastreamento

Este pedido requer atenção imediata para processamento.
        `,
        formType: 'order_confirmation'
      };

      return await sendContactEmail(contactData);
    } catch (error) {
      logger.error('Failed to send company order notification:', error);
      return false;
    }
  }

  private static async sendCompanyPaymentNotification(data: NotificationData): Promise<boolean> {
    try {
      const contactData: ContactFormData = {
        name: 'Sistema de Pagamentos',
        email: this.COMPANY_EMAIL,
        subject: `💳 PAGAMENTO CONFIRMADO #${data.orderId} - €${data.total.toFixed(2)}`,
        message: `
PAGAMENTO APROVADO COM SUCESSO!

📋 Pedido: #${data.orderId}
👤 Cliente: ${data.customerName} (${data.customerEmail})
💰 Valor: €${data.total.toFixed(2)}
💳 Método: ${data.paymentMethod || 'Cartão de Crédito'}
🔗 ID Transação: ${data.transactionId || 'N/A'}
📅 Data Pagamento: ${new Date().toLocaleDateString('pt-PT')}

✅ STATUS: APROVADO

⏰ PRÓXIMAS AÇÕES:
1. ✅ Pagamento confirmado
2. 🔄 Separar produtos para envio
3. 📦 Embalar produtos
4. 🚚 Gerar código de rastreamento
5. 📧 Notificar cliente sobre envio

O pedido está liberado para processamento imediato.
        `,
        formType: 'payment_confirmation'
      };

      return await sendContactEmail(contactData);
    } catch (error) {
      logger.error('Failed to send company payment notification:', error);
      return false;
    }
  }

  private static async sendCompanyProcessingNotification(data: NotificationData): Promise<boolean> {
    try {
      const contactData: ContactFormData = {
        name: 'Sistema de Processamento',
        email: this.COMPANY_EMAIL,
        subject: `⚙️ PROCESSANDO PEDIDO #${data.orderId}`,
        message: `
PEDIDO EM PROCESSAMENTO

📋 Pedido: #${data.orderId}
👤 Cliente: ${data.customerName} (${data.customerEmail})
💰 Total: €${data.total.toFixed(2)}
📅 Início Processamento: ${new Date().toLocaleString('pt-PT')}

📝 CHECKLIST DE PROCESSAMENTO:
☐ Verificar estoque
☐ Separar produtos
☐ Embalar com cuidado
☐ Gerar etiqueta de envio
☐ Notificar transportadora
☐ Enviar código de rastreamento

Tempo estimado para conclusão: 1-2 dias úteis
        `,
        formType: 'order_confirmation'
      };

      return await sendContactEmail(contactData);
    } catch (error) {
      logger.error('Failed to send company processing notification:', error);
      return false;
    }
  }

  private static async sendCompanyShippingNotification(data: NotificationData): Promise<boolean> {
    try {
      const contactData: ContactFormData = {
        name: 'Sistema de Envios',
        email: this.COMPANY_EMAIL,
        subject: `📦 PEDIDO ENVIADO #${data.orderId} - Código: ${data.trackingCode}`,
        message: `
PEDIDO ENVIADO COM SUCESSO!

📋 Pedido: #${data.orderId}
👤 Cliente: ${data.customerName} (${data.customerEmail})
💰 Total: €${data.total.toFixed(2)}
📦 Código Rastreamento: ${data.trackingCode}
🚚 Transportadora: ${data.carrier}
📅 Data Envio: ${new Date().toLocaleString('pt-PT')}
🏠 Entrega Estimada: ${data.estimatedDelivery || '5-10 dias úteis'}

✅ STATUS: ENVIADO

📍 ENDEREÇO DE ENTREGA:
${data.shippingAddress ? JSON.stringify(data.shippingAddress, null, 2) : 'Verificar sistema'}

⏰ PRÓXIMAS AÇÕES:
1. ✅ Cliente notificado sobre envio
2. 🔄 Acompanhar status da entrega
3. 📧 Confirmar recebimento
4. ⭐ Solicitar avaliação do cliente

O cliente foi automaticamente notificado com o código de rastreamento.
        `,
        formType: 'shipping_notification'
      };

      return await sendContactEmail(contactData);
    } catch (error) {
      logger.error('Failed to send company shipping notification:', error);
      return false;
    }
  }

  private static async sendCompanyDeliveryNotification(data: NotificationData): Promise<boolean> {
    try {
      const contactData: ContactFormData = {
        name: 'Sistema de Entregas',
        email: this.COMPANY_EMAIL,
        subject: `✅ ENTREGA CONFIRMADA #${data.orderId}`,
        message: `
PEDIDO ENTREGUE COM SUCESSO!

📋 Pedido: #${data.orderId}
👤 Cliente: ${data.customerName} (${data.customerEmail})
💰 Total: €${data.total.toFixed(2)}
📅 Data Entrega: ${new Date().toLocaleString('pt-PT')}

✅ STATUS: ENTREGUE

📊 MÉTRICAS DO PEDIDO:
• Tempo total de processamento: [Calcular automaticamente]
• Status de pagamento: Aprovado
• Método de entrega: ${data.carrier}
• Satisfação esperada: Aguardando feedback

⏰ AÇÕES RECOMENDADAS:
1. ✅ Confirmar entrega no sistema
2. 📧 Enviar pesquisa de satisfação
3. 📱 Monitorar redes sociais para menções
4. 🎯 Incluir cliente em campanhas de fidelização
5. 💌 Agendar follow-up em 30 dias

Pedido concluído com sucesso! 🎉
        `,
        formType: 'order_confirmation'
      };

      return await sendContactEmail(contactData);
    } catch (error) {
      logger.error('Failed to send company delivery notification:', error);
      return false;
    }
  }

  private static async sendCompanyCancellationNotification(data: NotificationData): Promise<boolean> {
    try {
      const contactData: ContactFormData = {
        name: 'Sistema de Cancelamentos',
        email: this.COMPANY_EMAIL,
        subject: `❌ PEDIDO CANCELADO #${data.orderId} - Ação Requerida`,
        message: `
PEDIDO CANCELADO

📋 Pedido: #${data.orderId}
👤 Cliente: ${data.customerName} (${data.customerEmail})
💰 Total: €${data.total.toFixed(2)}
📅 Data Cancelamento: ${new Date().toLocaleString('pt-PT')}

⚠️ AÇÕES IMEDIATAS NECESSÁRIAS:
1. 🔄 Reverter separação de produtos (se iniciada)
2. 💳 Processar reembolso (se pagamento confirmado)
3. 📧 Confirmar cancelamento com cliente
4. 📊 Atualizar estoque
5. 🔍 Analisar motivo do cancelamento

💡 ANÁLISE RECOMENDADA:
• Identificar padrões de cancelamento
• Melhorar processo se necessário
• Follow-up personalizado com cliente
• Oferecer alternativas ou desconto futuro

Cliente foi notificado sobre o cancelamento e política de reembolso.
        `,
        formType: 'support'
      };

      return await sendContactEmail(contactData);
    } catch (error) {
      logger.error('Failed to send company cancellation notification:', error);
      return false;
    }
  }

  private static async sendInventoryLowNotification(data: NotificationData): Promise<boolean> {
    try {
      const contactData: ContactFormData = {
        name: 'Sistema de Estoque',
        email: this.COMPANY_EMAIL,
        subject: `⚠️ ESTOQUE BAIXO - Reposição Necessária`,
        message: `
ALERTA DE ESTOQUE BAIXO

🛍️ Produtos com estoque baixo detectados:
${data.items.map(item => `• ${item.name} - Categoria: ${item.category || 'N/A'}`).join('\n')}

📊 SITUAÇÃO ATUAL:
• Produtos afetados: ${data.items.length}
• Status: Estoque baixo (< 10 unidades)
• Risco: Possível ruptura em breve

⏰ AÇÕES RECOMENDADAS:
1. 📦 Verificar estoque físico
2. 📞 Contatar fornecedores
3. 🛒 Realizar novo pedido de compra
4. 📱 Atualizar disponibilidade no site
5. 📧 Notificar equipe de vendas

Tempo estimado para reposição: 3-5 dias úteis
        `,
        formType: 'support'
      };

      return await sendContactEmail(contactData);
    } catch (error) {
      logger.error('Failed to send inventory low notification:', error);
      return false;
    }
  }

  private static async sendInventoryOutNotification(data: NotificationData): Promise<boolean> {
    try {
      const contactData: ContactFormData = {
        name: 'Sistema de Estoque',
        email: this.COMPANY_EMAIL,
        subject: `🚨 ESTOQUE ESGOTADO - Ação Urgente`,
        message: `
ESTOQUE ESGOTADO - URGENTE!

🛍️ Produtos sem estoque:
${data.items.map(item => `• ${item.name} - ${item.brand || 'N/A'}`).join('\n')}

🚨 SITUAÇÃO CRÍTICA:
• Produtos afetados: ${data.items.length}
• Status: Estoque zero
• Impacto: Vendas interrompidas

⚡ AÇÕES URGENTES:
1. 🚫 Remover produtos do site imediatamente
2. 📞 Contato urgente com fornecedores
3. 🛒 Pedido de reposição emergencial
4. 📧 Notificar clientes em lista de espera
5. 💬 Comunicar equipe de atendimento

ATENÇÃO: Produtos indisponíveis para venda até reposição!
        `,
        formType: 'support'
      };

      return await sendContactEmail(contactData);
    } catch (error) {
      logger.error('Failed to send inventory out notification:', error);
      return false;
    }
  }

  /**
   * Test function to send sample notifications
   */
  static async sendTestNotifications(): Promise<void> {
    const testData: NotificationData = {
      orderId: `TEST-${Date.now()}`,
      customerName: 'Maria Silva',
      customerEmail: 'customer@example.com',
      total: 149.99,
      items: [
        {
          name: 'Shampoo Hidratante Premium',
          quantity: 2,
          price: 34.99,
          brand: 'JC Hair Studio\'s',
          category: 'Cuidados Capilares',
          description: 'Shampoo premium para cabelos ressecados'
        },
        {
          name: 'Condicionador Reparador',
          quantity: 1,
          price: 29.99,
          brand: 'JC Hair Studio\'s',
          category: 'Cuidados Capilares'
        },
        {
          name: 'Máscara Nutritiva',
          quantity: 1,
          price: 49.99,
          brand: 'JC Hair Studio\'s',
          category: 'Tratamentos'
        }
      ],
      paymentMethod: 'Cartão de Crédito',
      shippingAddress: {
        name: 'Maria Silva',
        street: 'Rua das Flores, 123',
        city: 'Lisboa',
        zipCode: '1000-001',
        country: 'Portugal',
        phone: '+351 912345678'
      },
      trackingCode: 'JC2024001122334455',
      carrier: 'CTT',
      orderDate: new Date().toLocaleDateString('pt-PT'),
      estimatedDelivery: '3-5 dias úteis'
    };

    logger.info('🧪 Starting comprehensive notification test...');

    // Test all notification types
    const events: NotificationEvent[] = [
      'order_confirmed',
      'payment_confirmed',
      'order_processing',
      'order_shipped',
      'order_delivered',
      'order_cancelled'
    ];

    for (const event of events) {
      logger.info(`🧪 Testing ${event} notifications...`);
      const results = await this.notify(event, testData);
      logger.info(`🧪 ${event} results:`, results);

      // Wait a bit between notifications to avoid overwhelming
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    logger.info('🧪 All test notifications completed!');
  }
}

export default NotificationService;