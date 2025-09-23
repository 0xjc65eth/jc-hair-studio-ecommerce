'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/Button';
import { CreditCard, Loader2 } from 'lucide-react';

// Carregar Stripe (usar chave pública)
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
console.log('🔑 Stripe Public Key:', stripePublicKey ? 'Loaded' : 'Missing');
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

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

const PaymentForm: React.FC<StripePaymentProps> = ({
  amount,
  currency = 'eur',
  customerInfo,
  items,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  // Criar Payment Intent quando o componente carrega
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency,
            customerInfo,
            items,
          }),
        });

        const data = await response.json();
        console.log('💳 Payment Intent Response:', data);

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          console.log('✅ Client Secret set successfully');
        } else {
          console.error('❌ No client secret in response:', data);
          onError(`Erro ao inicializar pagamento: ${data.error || 'Resposta inválida'}`);
        }
      } catch (error) {
        console.error('Erro ao criar Payment Intent:', error);
        onError('Erro ao conectar com o processador de pagamentos');
      }
    };

    createPaymentIntent();
  }, [amount, currency, customerInfo, items, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError('Elemento do cartão não encontrado');
      setIsProcessing(false);
      return;
    }

    // Confirmar o pagamento
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
          },
        },
      }
    );

    setIsProcessing(false);

    if (error) {
      console.error('Erro no pagamento:', error);
      onError(error.message || 'Erro no processamento do pagamento');
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '"Inter", system-ui, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">
            Informações do Cartão
          </h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <CardElement options={cardElementOptions} />
          </div>

          <div className="text-sm text-gray-600">
            <p>💳 Aceitamos Visa, Mastercard, American Express</p>
            <p>🔒 Seus dados são protegidos por criptografia SSL</p>
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
  if (!stripePromise) {
    return (
      <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-medium">❌ Erro na configuração do Stripe</p>
        <p className="text-sm text-red-500 mt-2">
          Chave pública do Stripe não encontrada. Verifique as variáveis de ambiente.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};