'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  Shield,
  Globe,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Lock,
  User,
  Download
} from 'lucide-react';

interface UserPreferences {
  notifications: {
    email: {
      orderUpdates: boolean;
      promotions: boolean;
      newProducts: boolean;
    };
    push: {
      orderUpdates: boolean;
      promotions: boolean;
    };
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    allowMarketing: boolean;
    allowAnalytics: boolean;
  };
  language: string;
  currency: string;
}

export default function ConfiguracoesPage() {
  const { data: session, status } = useSession();
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      email: {
        orderUpdates: true,
        promotions: false,
        newProducts: false,
      },
      push: {
        orderUpdates: true,
        promotions: false
      }
    },
    privacy: {
      profileVisibility: 'private',
      allowMarketing: false,
      allowAnalytics: true
    },
    language: 'pt-BR',
    currency: 'EUR'
  });

  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!session) return;

      try {
        // Mock data - replace with actual API call
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [session]);

  const handlePreferenceChange = (path: string, value: any) => {
    const keys = path.split('.');
    setPreferences(prev => {
      const updated = { ...prev };
      let current = updated as any;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSavePreferences = async () => {
    try {
      // API call to save preferences
      console.log('Saving preferences:', preferences);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('A nova senha deve ter pelo menos 8 caracteres!');
      return;
    }

    try {
      // API call to change password
      console.log('Changing password');
      alert('Senha alterada com sucesso!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      alert('Erro ao alterar senha. Verifique a senha atual e tente novamente.');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // API call to delete account
      console.log('Deleting account');
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta. Tente novamente.');
    }
  };

  const handleExportData = async () => {
    try {
      // API call to export user data
      console.log('Exporting user data');
      alert('Seus dados serão enviados por email em até 24 horas.');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Tente novamente.');
    }
  };

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
          <p className="text-gray-600 mb-4">Você precisa estar logado para acessar as configurações.</p>
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Fazer login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/conta"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minha Conta
          </Link>
          <h1 className="text-3xl font-light text-gray-900 mb-2">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e configurações de conta</p>
        </div>

        <div className="space-y-8">
          {/* Notificações */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-medium text-gray-900">Notificações</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Notificações por Email
                </h3>
                <div className="space-y-3 ml-6">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Atualizações de pedidos</span>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.email.orderUpdates}
                      onChange={(e) => handlePreferenceChange('notifications.email.orderUpdates', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Promoções e ofertas</span>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.email.promotions}
                      onChange={(e) => handlePreferenceChange('notifications.email.promotions', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Novos produtos</span>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.email.newProducts}
                      onChange={(e) => handlePreferenceChange('notifications.email.newProducts', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Notificações Push
                </h3>
                <div className="space-y-3 ml-6">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Atualizações de pedidos</span>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.push.orderUpdates}
                      onChange={(e) => handlePreferenceChange('notifications.push.orderUpdates', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Promoções e ofertas</span>
                    <input
                      type="checkbox"
                      checked={preferences.notifications.push.promotions}
                      onChange={(e) => handlePreferenceChange('notifications.push.promotions', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Privacidade */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-medium text-gray-900">Privacidade</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Visibilidade do perfil</span>
                  <p className="text-xs text-gray-500">Controle quem pode ver suas informações</p>
                </div>
                <select
                  value={preferences.privacy.profileVisibility}
                  onChange={(e) => handlePreferenceChange('privacy.profileVisibility', e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="private">Privado</option>
                  <option value="public">Público</option>
                </select>
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Permitir marketing personalizado</span>
                  <p className="text-xs text-gray-500">Usar dados para personalizar ofertas</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.privacy.allowMarketing}
                  onChange={(e) => handlePreferenceChange('privacy.allowMarketing', e.target.checked)}
                  className="rounded border-gray-300"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">Permitir análise de uso</span>
                  <p className="text-xs text-gray-500">Ajudar a melhorar nossos serviços</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.privacy.allowAnalytics}
                  onChange={(e) => handlePreferenceChange('privacy.allowAnalytics', e.target.checked)}
                  className="rounded border-gray-300"
                />
              </label>
            </div>
          </div>

          {/* Idioma e Região */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-medium text-gray-900">Idioma e Região</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moeda
                </label>
                <select
                  value={preferences.currency}
                  onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-medium text-gray-900">Segurança</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Alterar Senha</h3>
                    <p className="text-sm text-gray-600">Última alteração há 3 meses</p>
                  </div>
                  <ArrowLeft className={`w-4 h-4 text-gray-400 transition-transform ${showPasswordChange ? 'rotate-90' : '-rotate-90'}`} />
                </div>
              </button>

              {showPasswordChange && (
                <form onSubmit={handlePasswordChange} className="ml-4 space-y-4 border-l-2 border-gray-200 pl-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 pr-10"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 pr-10"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Alterar Senha
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordChange(false)}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Dados da Conta */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-medium text-gray-900">Dados da Conta</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleExportData}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">Exportar Dados</h3>
                    <p className="text-sm text-gray-600">Baixe uma cópia de todos os seus dados</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <div>
                    <h3 className="font-medium text-red-900">Excluir Conta</h3>
                    <p className="text-sm text-red-600">Remover permanentemente sua conta e dados</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <button
              onClick={handleSavePreferences}
              className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Salvar Configurações
            </button>
          </div>
        </div>

        {/* Modal de Confirmação para Exclusão */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar Exclusão</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão removidos permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Excluir Conta
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}