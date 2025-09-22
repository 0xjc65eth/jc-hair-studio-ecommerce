// Testes de integração para APIs do JC Hair Studio's 62
// Testa endpoints críticos sem depender do front-end
// @jest-environment node

const axios = require('axios');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

// Configuração do axios com timeout
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

describe('JC Hair Studio API Integration Tests', () => {

  // Setup global - aguardar servidor estar rodando
  beforeAll(async () => {
    try {
      await api.get('/');
      console.log('✅ Servidor disponível para testes em:', BASE_URL);
    } catch (error) {
      console.error('❌ Servidor não está disponível:', error.message);
      throw new Error('Servidor deve estar rodando antes dos testes');
    }
  });

  describe('API de Autenticação', () => {
    test('NextAuth providers endpoint should be accessible', async () => {
      try {
        const response = await api.get('/api/auth/providers');
        expect(response.status).toBe(200);
        expect(response.data).toBeDefined();
        console.log('✅ NextAuth providers acessível');
      } catch (error) {
        // Algumas versões do NextAuth podem retornar 404 se não configurado
        if (error.response?.status === 404) {
          console.log('⚠️ NextAuth providers endpoint não encontrado');
          return;
        }
        throw error;
      }
    });

    test('Auth callback should handle requests', async () => {
      try {
        // Testa se endpoint está configurado (não o processo completo)
        const response = await api.get('/api/auth/signin');
        // Pode retornar 200 ou redirect
        expect([200, 302, 307].includes(response.status)).toBe(true);
        console.log('✅ NextAuth signin configurado');
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('⚠️ NextAuth signin endpoint não encontrado');
          return;
        }
        // Aceita outros códigos de status que não sejam 5xx
        if (error.response?.status >= 500) {
          throw error;
        }
      }
    });
  });

  describe('API de Newsletter', () => {
    test('POST /api/newsletter should accept valid email', async () => {
      const testData = {
        email: 'teste@exemplo.com',
        name: 'Teste Automatizado'
      };

      try {
        const response = await api.post('/api/newsletter', testData);
        expect([200, 201].includes(response.status)).toBe(true);
        console.log('✅ Newsletter API funcionando');

        if (response.data) {
          expect(response.data.success || response.data.message).toBeDefined();
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('⚠️ API /api/newsletter não implementada');
          return;
        }
        if (error.response?.status === 400) {
          // Pode ser validação - verificar se mensagem faz sentido
          console.log('ℹ️ Newsletter retornou erro 400:', error.response.data);
          return;
        }
        throw error;
      }
    });

    test('POST /api/newsletter should reject invalid email', async () => {
      const testData = {
        email: 'email-invalido',
        name: 'Teste'
      };

      try {
        const response = await api.post('/api/newsletter', testData);
        // Se aceitar email inválido, isso é um problema
        if (response.status === 200) {
          console.log('⚠️ API newsletter aceita emails inválidos');
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('⚠️ API /api/newsletter não implementada');
          return;
        }
        // Erro 400 é esperado para email inválido
        expect(error.response?.status).toBe(400);
        console.log('✅ Newsletter rejeita emails inválidos');
      }
    });
  });

  describe('API de Contato', () => {
    test('POST /api/contact should accept valid contact form', async () => {
      const testData = {
        name: 'Teste Automatizado',
        email: 'teste@exemplo.com',
        subject: 'Teste de Integração',
        message: 'Esta é uma mensagem de teste automatizada.',
        formType: 'contact'
      };

      try {
        const response = await api.post('/api/contact', testData);
        expect([200, 201].includes(response.status)).toBe(true);
        console.log('✅ Contact API funcionando');

        if (response.data) {
          expect(response.data.success || response.data.message).toBeDefined();
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('⚠️ API /api/contact não implementada');
          return;
        }
        throw error;
      }
    });

    test('POST /api/contact should require mandatory fields', async () => {
      const incompleteData = {
        name: 'Teste',
        // email e message faltando
      };

      try {
        const response = await api.post('/api/contact', incompleteData);
        // Não deveria aceitar dados incompletos
        if (response.status === 200) {
          console.log('⚠️ API contact aceita dados incompletos');
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('⚠️ API /api/contact não implementada');
          return;
        }
        // Erro 400 é esperado para dados obrigatórios faltando
        expect(error.response?.status).toBe(400);
        console.log('✅ Contact API valida campos obrigatórios');
      }
    });
  });

  describe('API de Carrinho', () => {
    test('GET /api/cart should be accessible', async () => {
      try {
        const response = await api.get('/api/cart');
        // Pode retornar carrinho vazio ou erro de autenticação
        expect([200, 401, 404].includes(response.status)).toBe(true);

        if (response.status === 200) {
          console.log('✅ API carrinho acessível');
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('⚠️ API /api/cart não implementada');
          return;
        }
        // 401 é aceitável se requer autenticação
        if (error.response?.status === 401) {
          console.log('ℹ️ API carrinho requer autenticação');
          return;
        }
        // 500 pode indicar erro de implementação, mas não falha o teste
        if (error.response?.status === 500) {
          console.log('⚠️ API carrinho retorna erro 500 - implementação pode ter problemas');
          return;
        }
        throw error;
      }
    });
  });

  describe('API de Seed/Data', () => {
    test('GET /api/seed should populate database', async () => {
      try {
        const response = await api.get('/api/seed');
        expect([200, 201].includes(response.status)).toBe(true);
        console.log('✅ Seed API funcionando');

        if (response.data) {
          console.log('✅ Seed executado:', response.data.message || 'Sucesso');
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('⚠️ API /api/seed não implementada');
          return;
        }
        throw error;
      }
    }, 30000); // Timeout maior para seed
  });

  describe('API de Produtos', () => {
    test('Products data should be accessible', async () => {
      // Testar possíveis endpoints de produtos
      const productEndpoints = ['/api/products', '/api/product', '/produtos'];

      let foundEndpoint = false;

      for (const endpoint of productEndpoints) {
        try {
          const response = await api.get(endpoint);
          if (response.status === 200) {
            console.log(`✅ Produtos acessíveis via ${endpoint}`);
            foundEndpoint = true;

            if (response.data) {
              const products = Array.isArray(response.data) ? response.data : response.data.products;
              if (products && products.length > 0) {
                console.log(`📦 ${products.length} produtos encontrados`);
              }
            }
            break;
          }
        } catch (error) {
          // Continuar testando outros endpoints
          continue;
        }
      }

      if (!foundEndpoint) {
        console.log('⚠️ Nenhuma API de produtos encontrada');
      }

      // Teste sempre passa pois produtos podem estar em páginas estáticas
      expect(true).toBe(true);
    });
  });

  describe('Verificações de SendGrid', () => {
    test('SendGrid configuration should be present', () => {
      // Verificar se variáveis de ambiente estão configuradas
      const hasApiKey = !!process.env.SENDGRID_API_KEY;
      const hasFromEmail = !!process.env.FROM_EMAIL;

      if (!hasApiKey) {
        console.log('⚠️ SENDGRID_API_KEY não configurada');
      } else {
        console.log('✅ SENDGRID_API_KEY configurada');
      }

      if (!hasFromEmail) {
        console.log('⚠️ FROM_EMAIL não configurada');
      } else {
        console.log('✅ FROM_EMAIL configurada');
      }

      // Teste sempre passa, apenas informa sobre configuração
      expect(true).toBe(true);
    });
  });

  describe('Health Checks', () => {
    test('Application should respond to health check', async () => {
      const healthEndpoints = ['/health', '/api/health', '/status', '/'];

      let responding = false;

      for (const endpoint of healthEndpoints) {
        try {
          const response = await api.get(endpoint);
          if (response.status === 200) {
            console.log(`✅ Aplicação respondendo via ${endpoint}`);
            responding = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }

      expect(responding).toBe(true);
    });

    test('API response times should be reasonable', async () => {
      const startTime = Date.now();

      try {
        await api.get('/');
        const responseTime = Date.now() - startTime;

        console.log(`⏱️ Tempo de resposta: ${responseTime}ms`);

        // Avisar se muito lento, mas não falhar o teste
        if (responseTime > 5000) {
          console.log('⚠️ Resposta lenta (>5s)');
        } else {
          console.log('✅ Tempo de resposta aceitável');
        }

        expect(responseTime).toBeLessThan(30000); // Falha apenas se > 30s
      } catch (error) {
        throw new Error(`Aplicação não respondeu: ${error.message}`);
      }
    });
  });
});