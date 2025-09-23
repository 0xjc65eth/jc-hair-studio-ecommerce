import Stripe from 'stripe';

// Cache global para evitar testes de conectividade repetidos
const connectionCache = new Map<string, { isConnected: boolean; lastCheck: number; config: any }>();

// Configurações de conectividade escalonadas - do mais conservador ao mais agressivo
const CONNECTION_STRATEGIES = [
  {
    name: 'conservative',
    config: {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      timeout: 30000, // 30 segundos - timeout padrão
      maxNetworkRetries: 1, // Mínimo de retries para economizar tempo
      telemetry: false, // Desabilita telemetria para reduzir overhead
    }
  },
  {
    name: 'balanced',
    config: {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      timeout: 45000, // 45 segundos - timeout médio
      maxNetworkRetries: 3, // Retries balanceados
      telemetry: false,
      host: 'api.stripe.com', // Host explícito
      protocol: 'https', // Protocolo explícito
    }
  },
  {
    name: 'aggressive',
    config: {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      timeout: 90000, // 90 segundos - timeout extenso
      maxNetworkRetries: 5, // Máximo de retries
      telemetry: false,
      host: 'api.stripe.com',
      protocol: 'https',
    }
  }
];

/**
 * Classe para gerenciar conexão robusta com Stripe
 * Implementa múltiplas estratégias de conexão e cache inteligente
 */
class RobustStripeConnection {
  private static instance: RobustStripeConnection;
  private activeStripe: Stripe | null = null;
  private currentStrategy: string = 'conservative';

  private constructor() {}

  /**
   * Singleton pattern para garantir uma única instância da conexão
   */
  static getInstance(): RobustStripeConnection {
    if (!RobustStripeConnection.instance) {
      RobustStripeConnection.instance = new RobustStripeConnection();
    }
    return RobustStripeConnection.instance;
  }

  /**
   * Obter instância Stripe com estratégia de conexão robusta
   * Implementa fallback automático entre diferentes configurações
   */
  async getStripeInstance(): Promise<Stripe> {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error('Stripe secret key not configured');
    }

    // Verificar cache de conexão - evita testes desnecessários por 5 minutos
    const cacheKey = `stripe_${secretKey.substring(0, 20)}`;
    const cached = connectionCache.get(cacheKey);
    const now = Date.now();

    // Se temos uma conexão cached e válida (menos de 5 minutos), usar ela
    if (cached && cached.isConnected && (now - cached.lastCheck) < 300000) {
      console.log('✅ Using cached Stripe connection');
      return new Stripe(secretKey, cached.config);
    }

    // Tentar conectar usando diferentes estratégias
    for (const strategy of CONNECTION_STRATEGIES) {
      try {
        console.log(`🔍 Attempting Stripe connection with ${strategy.name} strategy...`);

        const stripe = new Stripe(secretKey, strategy.config);

        // Teste de conectividade mais leve - apenas verificar se consegue fazer uma chamada simples
        // Usar account retrieve em vez de balance (pode ter menos restrições)
        await Promise.race([
          stripe.accounts.retrieve(), // Operação mais leve que balance
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timeout')), 15000)
          )
        ]);

        // Sucesso! Cachear esta configuração
        connectionCache.set(cacheKey, {
          isConnected: true,
          lastCheck: now,
          config: strategy.config
        });

        this.activeStripe = stripe;
        this.currentStrategy = strategy.name;

        console.log(`✅ Stripe connected successfully with ${strategy.name} strategy`);
        return stripe;

      } catch (error) {
        console.log(`❌ ${strategy.name} strategy failed:`, error instanceof Error ? error.message : 'Unknown error');
        continue; // Tentar próxima estratégia
      }
    }

    // Se todas as estratégias falharam, retornar instância básica sem teste
    console.log('⚠️ All connection strategies failed, returning basic instance without connectivity test');

    // Usar configuração mais simples possível como último recurso
    const basicStripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      timeout: 120000, // 2 minutos de timeout final
      maxNetworkRetries: 0, // Sem retries automáticos
    });

    // Marcar como potencialmente problemático no cache
    connectionCache.set(cacheKey, {
      isConnected: false,
      lastCheck: now,
      config: { basic: true }
    });

    return basicStripe;
  }

  /**
   * Executar operação Stripe com retry exponential backoff
   * Implementa lógica inteligente de retry para operações críticas
   */
  async executeWithRetry<T>(
    operation: (stripe: Stripe) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const stripe = await this.getStripeInstance();
        return await operation(stripe);
      } catch (error) {
        lastError = error as Error;

        // Se é o último attempt, não fazer retry
        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Retrying Stripe operation in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);

        await new Promise(resolve => setTimeout(resolve, delay));

        // Limpar cache em caso de erro para forçar nova conexão
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (secretKey) {
          const cacheKey = `stripe_${secretKey.substring(0, 20)}`;
          connectionCache.delete(cacheKey);
        }
      }
    }

    throw lastError || new Error('Operation failed after all retries');
  }

  /**
   * Obter status da conexão atual
   */
  getConnectionStatus(): { strategy: string; cached: boolean } {
    return {
      strategy: this.currentStrategy,
      cached: !!this.activeStripe
    };
  }
}

// Exportar instância singleton
export const robustStripe = RobustStripeConnection.getInstance();

// Função helper para criar payment intent com robustez
export async function createRobustPaymentIntent(params: {
  amount: number;
  currency: string;
  customerInfo?: { name?: string; email?: string };
  metadata?: Record<string, string>;
}) {
  return await robustStripe.executeWithRetry(async (stripe) => {
    return await stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Converter para centavos
      currency: params.currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customerName: params.customerInfo?.name || 'Cliente',
        customerEmail: params.customerInfo?.email || '',
        ...params.metadata
      },
    });
  });
}

// Função helper para criar checkout session com robustez
export async function createRobustCheckoutSession(params: {
  amount: number;
  currency: string;
  customerInfo?: { name?: string; email?: string };
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  return await robustStripe.executeWithRetry(async (stripe) => {
    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: params.currency,
            product_data: {
              name: params.customerInfo?.name || 'Produto JC Hair Studio',
              description: 'Compra JC Hair Studio',
            },
            unit_amount: Math.round(params.amount * 100), // Converter para centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerInfo?.email,
      metadata: {
        customerName: params.customerInfo?.name || 'Cliente',
        ...params.metadata
      },
    });
  });
}