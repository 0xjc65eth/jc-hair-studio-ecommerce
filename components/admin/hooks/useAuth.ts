import { useState, useEffect } from 'react';

/**
 * Custom Hook: useAuth
 *
 * Gerencia autenticação do painel administrativo com:
 * - Login com senha via API
 * - Persistência de sessão no localStorage
 * - Validação automática de sessão expirada (1 hora)
 * - Logout manual
 *
 * @returns {Object} Estado e métodos de autenticação
 * @property {boolean} isAuthenticated - Se usuário está autenticado
 * @property {string} authError - Mensagem de erro de autenticação
 * @property {boolean} isLoading - Se está verificando sessão
 * @property {Function} login - Função para fazer login
 * @property {Function} logout - Função para fazer logout
 *
 * @example
 * const { isAuthenticated, login, logout, authError } = useAuth();
 *
 * // Para fazer login:
 * await login('minha-senha');
 *
 * // Para fazer logout:
 * logout();
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Verifica se existe uma sessão válida no localStorage
   * Sessão expira após 1 hora (3600000ms)
   *
   * @returns {boolean} true se sessão é válida, false caso contrário
   */
  const checkAuthSession = (): boolean => {
    try {
      const sessionData = localStorage.getItem('adminSession');

      if (sessionData) {
        const session = JSON.parse(sessionData);
        const now = Date.now();

        // Verificar se a sessão não expirou (1 hora)
        if (session.authenticated && (now - session.timestamp) < session.expiresIn) {
          setIsAuthenticated(true);
          console.log('✅ Sessão admin válida carregada');
          return true;
        } else {
          // Sessão expirada - limpar
          localStorage.removeItem('adminSession');
          console.log('⏰ Sessão admin expirada');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar sessão:', error);
      localStorage.removeItem('adminSession');
    }

    return false;
  };

  /**
   * Faz login com senha via API
   * Salva sessão no localStorage em caso de sucesso
   *
   * @param {string} password - Senha do admin
   * @returns {Promise<boolean>} true se login bem-sucedido, false caso contrário
   */
  const login = async (password: string): Promise<boolean> => {
    try {
      setAuthError('');

      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Login bem-sucedido
        setIsAuthenticated(true);
        setAuthError('');

        // Salvar sessão com timeout de 1 hora
        const sessionData = {
          authenticated: true,
          timestamp: Date.now(),
          expiresIn: 3600000, // 1 hora em ms
        };
        localStorage.setItem('adminSession', JSON.stringify(sessionData));

        console.log('✅ Login admin bem-sucedido');
        return true;
      } else {
        // Senha incorreta
        setAuthError('Senha incorreta. Tente novamente.');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro de autenticação:', error);
      setAuthError('Erro de conexão. Tente novamente.');
      return false;
    }
  };

  /**
   * Faz logout removendo a sessão do localStorage
   */
  const logout = () => {
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
    console.log('👋 Logout admin realizado');
  };

  // Ao montar o componente, verificar se já existe sessão válida
  useEffect(() => {
    const hasValidSession = checkAuthSession();
    setIsLoading(false);

    if (!hasValidSession) {
      console.log('🔐 Nenhuma sessão válida encontrada');
    }
  }, []);

  return {
    isAuthenticated,
    authError,
    isLoading,
    login,
    logout,
    setAuthError,
  };
}
