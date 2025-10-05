import { useState, useEffect, useCallback } from 'react';

/**
 * Interface para notificação
 */
interface Notification {
  id: string;
  type: string;
  total: number;
  success: number;
  failed: number;
  pending: number;
  lastUpdated: string;
}

/**
 * Custom Hook: useNotifications
 *
 * Gerencia sistema de notificações administrativas:
 * - Busca logs de notificações enviadas
 * - Estatísticas de envio (sucesso, falha, pendente)
 * - Envio de notificações de teste
 * - Reenvio de notificações falhadas
 * - Auto-refresh opcional
 *
 * @param {boolean} autoRefresh - Se deve atualizar automaticamente (padrão: false)
 * @returns {Object} Estado e métodos de notificações
 *
 * @example
 * const {
 *   notifications,
 *   loading,
 *   sendTestNotification,
 *   resendNotification,
 *   refresh
 * } = useNotifications();
 */
export function useNotifications(autoRefresh: boolean = false) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca logs de notificações da API
   * Transforma dados de logs em estatísticas agregadas por tipo de evento
   *
   * API: GET /api/admin/notification-logs
   */
  const fetchNotifications = useCallback(async () => {
    try {
      console.log('🔔 Fetching notification logs...');
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/notification-logs');
      const data = await response.json();

      if (data.success) {
        console.log('✅ Notification logs fetched successfully:', data.data.stats);

        // Transformar logs em formato de notificações para UI
        const transformedNotifications: Notification[] = [];
        const { stats, logs } = data.data;

        // Processar breakdown de eventos
        if (stats.eventBreakdown && Object.keys(stats.eventBreakdown).length > 0) {
          Object.entries(stats.eventBreakdown).forEach(([eventType, count]) => {
            const eventLogs = logs.filter((log: any) => log.event === eventType);

            // Calcular sucessos (quando ambos cliente E empresa receberam)
            const successful = eventLogs.filter(
              (log: any) => log.clientSent && log.companySent
            ).length;

            // Calcular falhas (quando um ou ambos falharam)
            const failed = eventLogs.filter(
              (log: any) => !log.clientSent || !log.companySent
            ).length;

            transformedNotifications.push({
              id: `notif_${eventType}`,
              type: eventType,
              total: count as number,
              success: successful * 2, // Cliente + Empresa
              failed: failed,
              pending: 0,
              lastUpdated: eventLogs.length > 0 ? eventLogs[0].timestamp : new Date().toISOString(),
            });
          });
        }

        setNotifications(transformedNotifications);
      } else {
        throw new Error(data.error || 'Failed to fetch notification logs');
      }
    } catch (err: any) {
      console.error('❌ Error fetching notifications:', err);
      setError(err.message);

      // Definir notificação padrão em caso de erro
      setNotifications([
        {
          id: 'no_notifications',
          type: 'sistema_inicializado',
          total: 0,
          success: 0,
          failed: 0,
          pending: 0,
          lastUpdated: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Envia uma notificação de teste
   * Útil para verificar se o sistema de emails está funcionando
   *
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const sendTestNotification = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('📧 Sending test notification...');

      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'test' }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Test notification sent successfully');
        // Atualizar lista após envio
        await fetchNotifications();

        return {
          success: true,
          message: 'Notificação teste enviada com sucesso!',
        };
      } else {
        throw new Error(result.error || 'Falha ao enviar notificação');
      }
    } catch (err: any) {
      console.error('❌ Error sending test notification:', err);
      return {
        success: false,
        message: err.message || 'Erro ao enviar notificação',
      };
    }
  };

  /**
   * Reenvia notificação para um pedido específico
   *
   * @param {string} orderId - ID do pedido
   * @param {string} recipient - Destinatário ('customer' ou 'company')
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const resendNotification = async (
    orderId: string,
    recipient: 'customer' | 'company'
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      console.log('📧 Resending notification:', { orderId, recipient });

      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'resend',
          orderId,
          customer: recipient,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Notification resent successfully');
        // Atualizar lista após reenvio
        await fetchNotifications();

        return {
          success: true,
          message: 'Notificação reenviada com sucesso!',
        };
      } else {
        throw new Error(result.error || 'Falha ao reenviar notificação');
      }
    } catch (err: any) {
      console.error('❌ Error resending notification:', err);
      return {
        success: false,
        message: err.message || 'Erro ao reenviar notificação',
      };
    }
  };

  /**
   * Calcula estatísticas totais de todas as notificações
   *
   * @returns {Object} Estatísticas agregadas
   */
  const getTotalStats = () => {
    return notifications.reduce(
      (acc, notif) => ({
        total: acc.total + notif.total,
        success: acc.success + notif.success,
        failed: acc.failed + notif.failed,
        pending: acc.pending + notif.pending,
      }),
      { total: 0, success: 0, failed: 0, pending: 0 }
    );
  };

  /**
   * Calcula taxa de sucesso das notificações
   *
   * @returns {number} Percentual de sucesso (0-100)
   */
  const getSuccessRate = (): number => {
    const totals = getTotalStats();
    if (totals.total === 0) return 0;

    return Math.round((totals.success / (totals.success + totals.failed)) * 100);
  };

  /**
   * Verifica se há notificações falhadas
   *
   * @returns {boolean} true se houver falhas
   */
  const hasFailedNotifications = (): boolean => {
    return notifications.some(notif => notif.failed > 0);
  };

  // Auto-refresh (se habilitado)
  useEffect(() => {
    fetchNotifications();

    if (autoRefresh) {
      const interval = setInterval(fetchNotifications, 60000); // 1 minuto
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    sendTestNotification,
    resendNotification,
    refresh: fetchNotifications,
    getTotalStats,
    getSuccessRate,
    hasFailedNotifications,
  };
}
