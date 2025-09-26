'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/Button';
import { CreditCard, Loader2 } from 'lucide-react';

// Lazy loading do Stripe - só carrega quando necessário
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
let stripePromise: Promise<any> | null = null;

const getStripe = () => {
  if (!stripePromise && stripePublicKey) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

interface StripePaymentProps {
  amount: number;
  currency?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

interface PaymentFormProps extends StripePaymentProps {
  clientSecret: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = 'eur',
  customerInfo,
  items,
  onSuccess,
  onError,
  clientSecret,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  // PaymentForm agora recebe clientSecret como prop - não precisa criar

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('🎯 PAYMENT: Form submission started...');

    // Enhanced validation checks with logging
    if (!stripe) {
      console.error('❌ PAYMENT: Stripe not loaded');
      onError('Sistema de pagamento não carregado. Recarregue a página.');
      return;
    }

    if (!elements) {
      console.error('❌ PAYMENT: Stripe Elements not loaded');
      onError('Formulário de pagamento não carregado. Recarregue a página.');
      return;
    }

    if (!clientSecret) {
      console.error('❌ PAYMENT: No client secret available');
      onError('Sessão de pagamento inválida. Recarregue a página.');
      return;
    }

    console.log('✅ PAYMENT: All prerequisites validated, proceeding with payment...');
    setIsProcessing(true);

    try {
      console.log('💳 PAYMENT: Confirming payment with Stripe...');

      // Simplified payment confirmation - removed return_url to prevent redirect issues
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Remove return_url to stay on current page
        },
        redirect: 'if_required', // Only redirect if absolutely necessary
      });

      console.log('📋 PAYMENT: Stripe confirmation response:', {
        hasError: !!error,
        errorType: error?.type,
        errorMessage: error?.message,
        paymentIntentStatus: paymentIntent?.status,
        paymentIntentId: paymentIntent?.id
      });

      if (error) {
        console.error('❌ PAYMENT: Stripe confirmation failed:', error);
        onError(error.message || 'Erro no processamento do pagamento');
      } else if (paymentIntent?.status === 'succeeded') {
        console.log('🎉 PAYMENT: Payment succeeded!', paymentIntent.id);
        onSuccess(paymentIntent.id);
      } else {
        console.warn('⚠️ PAYMENT: Unexpected payment status:', paymentIntent?.status);
        onError('Estado de pagamento inesperado. Tente novamente.');
      }
    } catch (confirmationError) {
      console.error('❌ PAYMENT: Exception during confirmation:', confirmationError);
      onError('Erro interno durante o processamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
      console.log('🔄 PAYMENT: Processing complete, UI reset');
    }
  };

  // PaymentElement não precisa de opções de estilo customizadas

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">
            Escolha seu Método de Pagamento
          </h3>
        </div>

        <div className="space-y-4">
          {clientSecret && (
            <div
              className="payment-element-wrapper"
              style={{
                minHeight: '280px',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '20px'
              }}
            >
              <style jsx>{`
                .payment-element-wrapper :global(.p-PaymentElement) {
                  transition: all 0.3s ease;
                }
                .payment-element-wrapper :global(.p-PaymentMethodSelector) {
                  margin-bottom: 16px !important;
                }
                .payment-element-wrapper :global(.p-PaymentMethod) {
                  position: relative;
                  z-index: 1;
                  background: white;
                  margin-bottom: 12px !important;
                  border-radius: 8px;
                  overflow: hidden;
                }
              `}</style>
              <PaymentElement
                options={{
                  layout: 'tabs',
                  paymentMethodOrder: ['card', 'klarna', 'bancontact', 'amazon_pay', 'apple_pay', 'google_pay'],
                  defaultValues: {
                    billingDetails: {
                      name: customerInfo.name,
                      email: customerInfo.email,
                      phone: customerInfo.phone,
                    }
                  },
                  fields: {
                    billingDetails: {
                      name: 'never',
                      email: 'never',
                      phone: 'never',
                      address: 'never'
                    }
                  }
                }}
              />
            </div>
          )}

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium text-blue-800 mb-2">✨ Métodos Disponíveis:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <p>💳 Cartão de Crédito/Débito</p>
              <p>🛒 Klarna</p>
              <p>🏦 Bancontact</p>
              <p>📦 Amazon Pay</p>
              <p>🍎 Apple Pay</p>
              <p>🎨 Google Pay</p>
            </div>
            <p className="mt-2 text-xs text-blue-600">🔒 Todos processados com segurança pelo Stripe</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Total a pagar:
          </span>
          <span className="text-lg font-bold text-amber-600">
            €{amount.toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing || !clientSecret}
        className="w-full flex items-center justify-center gap-2"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processando Pagamento...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pagar €{amount.toFixed(2)}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        Ao finalizar a compra, você concorda com nossos{' '}
        <a href="/legal/termos-uso" className="text-amber-600 hover:underline">
          Termos de Uso
        </a>{' '}
        e{' '}
        <a href="/legal/privacidade" className="text-amber-600 hover:underline">
          Política de Privacidade
        </a>
      </p>
    </form>
  );
};

// Componente principal que envolve o form com Elements
export const StripePayment: React.FC<StripePaymentProps> = (props) => {
  const [clientSecret, setClientSecret] = useState('');

  // Enhanced Payment Intent creation with comprehensive logging
  useEffect(() => {
    const createPaymentIntent = async () => {
      console.log('💳 STRIPE: Initializing payment intent...', {
        amount: props.amount,
        currency: props.currency,
        customerEmail: props.customerInfo.email,
        itemsCount: props.items.length
      });

      try {
        const requestData = {
          amount: props.amount,
          currency: props.currency,
          customerInfo: props.customerInfo,
          items: props.items,
        };

        console.log('📤 STRIPE: Sending payment intent request...', requestData);

        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        console.log('📥 STRIPE: Payment intent response status:', response.status);

        const data = await response.json();
        console.log('📄 STRIPE: Payment intent response data:', {
          success: response.ok,
          hasClientSecret: !!data.clientSecret,
          paymentIntentId: data.paymentIntentId,
          error: data.error
        });

        if (response.ok && data.clientSecret) {
          console.log('✅ STRIPE: Payment intent created successfully');
          setClientSecret(data.clientSecret);
        } else {
          console.error('❌ STRIPE: Payment intent creation failed:', data.error);
          props.onError(data.error || 'Erro ao inicializar pagamento');
        }
      } catch (error) {
        console.error('❌ STRIPE: Network error creating payment intent:', error);
        props.onError('Erro ao conectar com o processador de pagamentos. Verifique sua conexão.');
      }
    };

    if (props.amount > 0) {
      console.log('🚀 STRIPE: Starting payment intent creation process...');
      createPaymentIntent();
    } else {
      console.warn('⚠️ STRIPE: Invalid amount, skipping payment intent creation:', props.amount);
    }
  }, [props.amount, props.currency, props.customerInfo, props.items, props.onError]);

  if (!stripePublicKey) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">❌ Erro na configuração do Stripe</p>
        <p className="text-sm text-red-500 mt-2">
          Chave pública do Stripe não encontrada. Verifique as variáveis de ambiente.
        </p>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#1e40af',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#dc2626',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
      rules: {
        '.Tab': {
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px 16px',
          margin: '4px',
          transition: 'all 0.2s ease',
        },
        '.Tab--selected': {
          backgroundColor: '#dbeafe',
          borderColor: '#3b82f6',
        },
        '.TabContent': {
          padding: '16px 0',
          minHeight: '200px',
        },
      }
    },
  };

  if (!clientSecret) {
    return (
      <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-800">Preparando pagamento...</span>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={getStripe()} options={options}>
      <PaymentForm {...props} clientSecret={clientSecret} />
    </Elements>
  );
};