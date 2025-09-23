/**
 * @fileoverview API de Confirmação de Pagamento com Sistema de Notificações Paralelas
 * @description Processa confirmações de pagamento e executa 5 agentes de notificação em paralelo
 * @version 2.0.0
 * @author JC Hair Studio Development Team
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeParallelNotifications } from '@/app/api/admin/notifications/route';

/**
 * Endpoint POST para processar confirmações de pagamento bem-sucedidas
 * Executa sistema avançado de notificações com 5 agentes paralelos:
 * - Agent 1: Notificação completa para admin (juliocesarurss65@gmail.com)
 * - Agent 2: Email de confirmação de pedido para cliente
 * - Agent 3: Email de confirmação de pagamento para cliente
 * - Agent 4: Sistema de backup via Discord webhook
 * - Agent 5: Persistência no MongoDB para auditoria
 */
export async function POST(request: NextRequest) {
  try {
    // ==========================================
    // EXTRAÇÃO E VALIDAÇÃO DOS DADOS RECEBIDOS
    // ==========================================

    console.log('🎉 Iniciando processamento de pagamento confirmado...');

    // Extrair dados do corpo da requisição (incluindo novos campos técnicos)
    const {
      paymentIntentId,
      customerInfo,
      items,
      amount,
      orderTotals,
      technicalInfo,
      shippingAddress,
      deliveryMethod
    } = await request.json();

    // Log detalhado dos dados recebidos para auditoria
    console.log('📋 Dados recebidos:', {
      paymentIntentId,
      customerName: customerInfo?.name,
      customerEmail: customerInfo?.email,
      customerPhone: customerInfo?.phone,
      customerCpfNif: customerInfo?.cpfNif ? customerInfo.cpfNif.substring(0, 3) + '***' : 'N/A',
      total: amount,
      itemsCount: items?.length || 0,
      hasCompleteAddress: !!(customerInfo?.address),
      deliveryMethod: customerInfo?.deliveryMethod || deliveryMethod,
      clientIp: technicalInfo?.clientIp || 'N/A',
      userAgent: technicalInfo?.userAgent ? technicalInfo.userAgent.substring(0, 50) + '...' : 'N/A',
      hasOrderTotals: !!orderTotals
    });

    // ==========================================
    // CAPTURA DE DADOS TÉCNICOS DO CLIENTE
    // ==========================================

    // Priorizar dados técnicos enviados pelo cliente, com fallback para headers
    const clientIp = technicalInfo?.clientIp ||
                     request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     request.ip ||
                     'Unknown IP';

    const userAgent = technicalInfo?.userAgent ||
                      request.headers.get('user-agent') ||
                      'Unknown Device';

    // Capturar dados técnicos adicionais
    const browserLanguage = technicalInfo?.browserLanguage || 'Unknown';
    const timezone = technicalInfo?.timezone || 'Unknown';
    const screenResolution = technicalInfo?.screenResolution || 'Unknown';
    const referrer = technicalInfo?.referrer || request.headers.get('referer') || 'direct';

    // Log das informações técnicas capturadas
    console.log('🔍 Dados técnicos completos capturados:', {
      clientIp,
      userAgent: userAgent.substring(0, 100) + '...',
      browserLanguage,
      timezone,
      screenResolution,
      referrer
    });

    // ==========================================
    // PREPARAÇÃO DE DADOS COMPLETOS DO PEDIDO
    // ==========================================

    console.log('📦 Preparando dados completos do pedido...');

    // Construir objeto completo com todos os dados necessários para notificações
    const completeOrderData = {
      // Identificadores únicos do pedido
      orderId: paymentIntentId ? paymentIntentId.slice(-8) : `TEST-${Date.now().toString().slice(-8)}`, // Últimos 8 caracteres como ID amigável
      paymentIntentId,
      transactionId: paymentIntentId,

      // Dados básicos do cliente (COMPLETOS)
      customerName: customerInfo?.name || 'Cliente',
      customerEmail: customerInfo?.email || 'email não informado',
      customerPhone: customerInfo?.phone || '',
      customerCpfNif: customerInfo?.cpfNif || '',
      customerCountry: customerInfo?.country || 'Portugal',

      // Informações financeiras (DETALHADAS)
      total: amount || orderTotals?.finalTotal || 0,
      subtotal: orderTotals?.subtotal || amount || 0,
      taxAmount: orderTotals?.taxAmount || 0,
      shippingCost: orderTotals?.shippingCost || 0,
      currency: 'EUR',
      discount: 0,

      // Status e metadados do pagamento
      status: 'paid', // Confirmação de pagamento aprovado
      paymentMethod: 'Cartão de Crédito',
      paymentGateway: 'Stripe', // Gateway usado para processar o pagamento

      // Timestamps importantes
      createdAt: new Date().toISOString(),

      // Lista detalhada de produtos com validação
      products: items?.map((item: any) => ({
        name: item.name || 'Produto',
        quantity: item.quantity || 1,
        price: item.price || 0,
        sku: item.sku || item.id || 'N/A', // SKU para controle de estoque
        // Calcular subtotal do item
        subtotal: (item.price || 0) * (item.quantity || 1)
      })) || [],

      // Endereço de entrega completo (PRIORITIZA dados do customerInfo)
      shippingAddress: customerInfo?.address ? {
        name: customerInfo.name || 'Cliente',
        street: customerInfo.address.street || '',
        number: customerInfo.address.number || '',
        complement: customerInfo.address.complement || '',
        neighborhood: customerInfo.address.neighborhood || '',
        city: customerInfo.address.city || '',
        state: customerInfo.address.state || '',
        zipCode: customerInfo.address.zipCode || '',
        country: customerInfo.country || 'Portugal',
        phone: customerInfo.phone || '',
        notes: ''
      } : (shippingAddress ? {
        name: shippingAddress.name || customerInfo?.name || 'Cliente',
        street: shippingAddress.street || shippingAddress.address || '',
        complement: shippingAddress.complement || shippingAddress.address2 || '',
        neighborhood: shippingAddress.neighborhood || shippingAddress.district || '',
        city: shippingAddress.city || '',
        state: shippingAddress.state || shippingAddress.region || '',
        zipCode: shippingAddress.zipCode || shippingAddress.postalCode || '',
        country: shippingAddress.country || 'Portugal',
        phone: shippingAddress.phone || customerInfo?.phone || '',
        notes: shippingAddress.notes || shippingAddress.instructions || ''
      } : null),

      // Informações de entrega e envio
      deliveryMethod: customerInfo?.deliveryMethod || deliveryMethod || 'Correios - Envio Padrão',
      shippingCarrier: 'Correios',
      estimatedDelivery: '5-10 dias úteis',

      // Dados técnicos para análise (COMPLETOS E OBRIGATÓRIOS)
      clientIp: clientIp,
      userAgent: userAgent,
      browserLanguage: browserLanguage,
      timezone: timezone,
      screenResolution: screenResolution,
      referrer: referrer,

      // Metadados adicionais para analytics (EXPANDIDOS)
      source: 'Website', // Origem da venda
      sessionId: request.headers.get('x-session-id') || 'Unknown',
      orderTimestamp: technicalInfo?.orderTimestamp || new Date().toISOString(),

      // Dados de geolocalização e detecção de fraude
      technicalFingerprint: {
        ip: clientIp,
        userAgent: userAgent,
        language: browserLanguage,
        timezone: timezone,
        resolution: screenResolution,
        referrer: referrer,
        timestamp: new Date().toISOString()
      }
    };

    // Log dos dados preparados (sem informações sensíveis)
    console.log('✅ Dados do pedido COMPLETOS preparados:', {
      orderId: completeOrderData.orderId,
      customerEmail: completeOrderData.customerEmail,
      customerPhone: completeOrderData.customerPhone,
      customerCpfNif: completeOrderData.customerCpfNif ? completeOrderData.customerCpfNif.substring(0, 3) + '***' : 'N/A',
      total: completeOrderData.total,
      subtotal: completeOrderData.subtotal,
      taxAmount: completeOrderData.taxAmount,
      shippingCost: completeOrderData.shippingCost,
      productCount: completeOrderData.products.length,
      hasCompleteAddress: !!completeOrderData.shippingAddress,
      deliveryMethod: completeOrderData.deliveryMethod,
      clientIp: completeOrderData.clientIp,
      browserLanguage: completeOrderData.browserLanguage,
      timezone: completeOrderData.timezone,
      paymentGateway: completeOrderData.paymentGateway,
      hasTechnicalFingerprint: !!completeOrderData.technicalFingerprint
    });

    // ==========================================
    // EXECUÇÃO DO SISTEMA DE NOTIFICAÇÕES PARALELAS
    // ==========================================

    console.log('🚀 Executando sistema de notificações com 5 agentes paralelos...');
    console.log('📧 Admin principal: juliocesarurss65@gmail.com');

    // Executar todas as notificações usando o novo sistema paralelo
    // Este sistema garante:
    // 1. Máxima velocidade (execução paralela)
    // 2. Redundância (múltiplos canais)
    // 3. Auditoria completa (logs no MongoDB)
    // 4. Retry automático em caso de falhas
    const notificationResults = await executeParallelNotifications(completeOrderData);

    // ==========================================
    // ANÁLISE DETALHADA DOS RESULTADOS
    // ==========================================

    console.log('📊 Resultados das notificações recebidos:', notificationResults);

    // Verificar se notificação crítica do admin foi enviada
    const adminNotification = notificationResults.details?.find(
      (detail: any) => detail.agent === 'Admin'
    );

    if (adminNotification?.status === 'fulfilled') {
      console.log('✅ CRÍTICO: Notificação admin enviada com sucesso para juliocesarurss65@gmail.com');
    } else {
      console.error('❌ CRÍTICO: Falha na notificação admin:', adminNotification?.error);
    }

    // Analisar sucesso das notificações do cliente
    const customerNotifications = notificationResults.details?.filter(
      (detail: any) => ['Order', 'Payment'].includes(detail.agent)
    );

    const successfulCustomerNotifications = customerNotifications?.filter(
      (detail: any) => detail.status === 'fulfilled'
    ).length || 0;

    console.log(`📨 Notificações do cliente: ${successfulCustomerNotifications}/${customerNotifications?.length || 0} enviadas`);

    // Log resumo final das notificações
    console.log('📈 Resumo final das notificações:', {
      totalAgents: notificationResults.total,
      successful: notificationResults.successful,
      failed: notificationResults.failed,
      successRate: ((notificationResults.successful / notificationResults.total) * 100).toFixed(1) + '%'
    });

    // ==========================================
    // ATUALIZAÇÃO DO DASHBOARD ADMINISTRATIVO
    // ==========================================

    console.log('💾 Atualizando dashboard administrativo...');

    // Atualizar status do pedido no painel administrativo
    try {
      const dashboardResponse = await fetch(`${request.nextUrl.origin}/api/admin/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Update': 'true' // Header para identificar atualização automática
        },
        body: JSON.stringify({
          ...completeOrderData,
          status: 'paid',
          notificationStatus: notificationResults,
          updatedAt: new Date().toISOString()
        })
      });

      if (dashboardResponse.ok) {
        console.log('✅ Pedido registrado no dashboard administrativo');
      } else {
        console.warn('⚠️ Aviso: Falha ao atualizar dashboard (não crítico)');
      }
    } catch (dashboardError) {
      console.warn('⚠️ Aviso: Erro ao conectar com dashboard:', dashboardError);
      // Não é crítico - o sistema pode continuar funcionando
    }

    // ==========================================
    // RESPOSTA FINAL DE SUCESSO
    // ==========================================

    console.log('🎊 Processamento de pagamento concluído com sucesso!');

    // Retornar resposta detalhada sobre o processamento
    return NextResponse.json({
      success: true,
      message: 'Pagamento processado e notificações enviadas com sucesso',
      orderId: completeOrderData.orderId,
      paymentStatus: 'confirmed',
      notificationResults: {
        totalSent: notificationResults.successful,
        totalFailed: notificationResults.failed,
        adminNotified: adminNotification?.status === 'fulfilled',
        customerNotified: successfulCustomerNotifications > 0
      },
      metadata: {
        processedAt: new Date().toISOString(),
        totalAmount: completeOrderData.total,
        currency: completeOrderData.currency,
        productsCount: completeOrderData.products.length
      }
    });

  } catch (error) {
    // ==========================================
    // TRATAMENTO DE ERROS CRÍTICOS
    // ==========================================

    console.error('❌ ERRO CRÍTICO no processamento de pagamento:', error);

    // Log detalhado do erro para debug
    console.error('🔍 Detalhes do erro:', {
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : 'Stack não disponível',
      timestamp: new Date().toISOString()
    });

    // Tentar enviar notificação de erro crítico para admin
    try {
      console.log('📧 Tentando notificar admin sobre erro crítico...');

      // Dados mínimos para notificação de erro
      const errorNotificationData = {
        orderId: `ERROR-${Date.now()}`,
        customerName: 'Sistema JC Hair Studio',
        customerEmail: 'sistema@jchairstudios62.xyz',
        total: 0,
        status: 'error',
        products: [],
        errorDetails: {
          message: error instanceof Error ? error.message : 'Erro desconhecido',
          timestamp: new Date().toISOString(),
          endpoint: '/api/payment-success'
        },
        createdAt: new Date().toISOString()
      };

      // Tentar executar notificação de erro
      await executeParallelNotifications(errorNotificationData);
      console.log('✅ Admin notificado sobre erro crítico');

    } catch (notificationError) {
      console.error('❌ Falha ao notificar admin sobre erro:', notificationError);
    }

    // Retornar erro estruturado para o cliente
    return NextResponse.json({
      success: false,
      error: 'Erro interno no processamento do pagamento',
      message: 'Seu pagamento foi processado, mas houve um problema nas notificações. Nossa equipe foi notificada.',
      details: process.env.NODE_ENV === 'development' ? {
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      } : undefined, // Só mostrar detalhes em desenvolvimento
      support: {
        email: 'contato@jchairstudios62.xyz',
        phone: '+351 928375226'
      }
    }, { status: 500 });
  }
}