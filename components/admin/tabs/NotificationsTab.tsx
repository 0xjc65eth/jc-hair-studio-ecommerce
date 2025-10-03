'use client';

import { useNotifications } from '../hooks';
import { ActionButton } from '../shared';
import { Bell, RefreshCw, Send } from 'lucide-react';

/**
 * NotificationsTab Component
 *
 * Aba de gerenciamento de notificações do admin.
 * Exibe logs e estatísticas de emails enviados.
 *
 * Features:
 * - Estatísticas de envio por tipo de evento
 * - Taxa de sucesso/falha
 * - Envio de notificações de teste
 * - Reenvio de notificações falhadas
 *
 * @component
 */
export function NotificationsTab() {
  const {
    notifications,
    loading,
    sendTestNotification,
    refresh,
    getTotalStats,
    getSuccessRate,
  } = useNotifications();

  const totalStats = getTotalStats();
  const successRate = getSuccessRate();

  const handleTestNotification = async () => {
    const result = await sendTestNotification();
    alert(result.message);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Status das Notificações</h3>
          <p className="text-sm text-gray-600">
            Taxa de sucesso: <strong>{successRate}%</strong> | Total enviado: <strong>{totalStats.success}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <ActionButton
            icon={RefreshCw}
            label="Atualizar"
            onClick={refresh}
            variant="outline"
            loading={loading}
          />
          <ActionButton
            icon={Send}
            label="Teste"
            onClick={handleTestNotification}
          />
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 capitalize">
                  {notif.type.replace('_', ' ')}
                </h4>
                <span className="text-sm text-gray-600">Total: {notif.total}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-green-600 font-semibold">{notif.success}</div>
                  <div className="text-gray-500">Enviadas</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 font-semibold">{notif.failed}</div>
                  <div className="text-gray-500">Falharam</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-600 font-semibold">{notif.pending}</div>
                  <div className="text-gray-500">Pendentes</div>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Última atualização: {new Date(notif.lastUpdated).toLocaleString('pt-BR')}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma notificação encontrada</p>
            <ActionButton
              icon={Send}
              label="Enviar Notificação de Teste"
              onClick={handleTestNotification}
              className="mt-4"
            />
          </div>
        )}
      </div>
    </div>
  );
}
