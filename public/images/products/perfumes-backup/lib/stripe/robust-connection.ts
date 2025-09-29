import Stripe from 'stripe';

// Cache global para evitar testes de conectividade repetidos
const connectionCache = new Map<string, { isConnected: boolean; lastCheck: number; config: any }>();

// Configurações otimizadas para Vercel - timeouts reduzidos para evitar Function Timeout
const CONNECTION_STRATEGIES = [
  {
    name: 'fast',
    config: {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      timeout: 10000, // 10 segundos - otimizado para Vercel
      maxNetworkRetries: 0, // Sem retries para ser mais rápido
      telemetry: false, // Desabilita telemetria para reduzir overhead
    }
  },
  {
    name: 'balanced',
    config: {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      timeout: 15000, // 15 segundos - balance entre velocidade e reliability
      maxNetworkRetries: 1, // Apenas 1 retry
      telemetry: false,
      host: 'api.stripe.com', // Host explícito
      protocol: 'https', // Protocolo explícito
    }
  },
  {
    name: 'last_resort',
    config: {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      timeout: 20000, // 20 segundos máximo - dentro do limite Vercel
      maxNetworkRetries: 2, // Máximo 2 retries
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

        // Teste de conectividade rápido - otimizado para Vercel Function limits
        // Usar timeout agressivo para evitar Function Timeout
        await Promise.race([
          stripe.accounts.retrieve(), // Operação mais leve que balance
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Connection timeout')), 8000) // 8 segundos max
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

    // Se todas as estratégias falharam, usar configuração bypass sem teste de conectividade
    console.log('⚠️ All connection strategies failed, using bypass configuration');

    // Configuração de bypass - sem testes de conectividade, otimizada para Vercel
    const bypassStripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
      timeout: 25000, // 25 segundos - dentro do limite Vercel
      maxNetworkRetries: 1, // Mínimo necessário
      telemetry: false
    });

    // Marcar como bypass no cache com TTL curto
    connectionCache.set(cacheKey, {
      isConnected: true, // Assumir que vai funcionar
      lastCheck: now,
      config: { bypass: true, timeout: 25000 }
    });

    return bypassStripe;
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

        // Backoff rápido otimizado para Vercel: 500ms, 1s, 1.5s
        const delay = (attempt + 1) * 500;
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