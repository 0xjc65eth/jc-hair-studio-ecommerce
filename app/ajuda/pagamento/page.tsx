import { Metadata } from 'next';
import { CreditCard, Shield, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ajuda - Pagamento | JC Hair Studio',
  description: 'Central de ajuda sobre formas de pagamento, métodos aceitos e dúvidas sobre pagamento no JC Hair Studio.',
};

export default function PagamentoAjudaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à página inicial
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajuda - Pagamento</h1>
          <p className="text-gray-600">Tire suas dúvidas sobre formas de pagamento</p>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-amber-600" />
            Métodos de Pagamento Aceitos
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800">Cartões de Crédito</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Visa</li>
                <li>• Mastercard</li>
                <li>• American Express</li>
                <li>• Elo</li>
                <li>• Hipercard</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800">Outros Métodos</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• PIX (instantâneo)</li>
                <li>• Boleto bancário</li>
                <li>• Transferência bancária</li>
                <li>• PayPal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-green-600" />
            Segurança
          </h2>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Seus dados estão protegidos</h3>
              <p className="text-green-700 text-sm">
                Utilizamos certificação SSL 256-bit e processadores certificados PCI DSS para garantir
                a segurança de suas informações de pagamento.
              </p>
            </div>

            <ul className="space-y-2 text-gray-600">
              <li>• Não armazenamos dados do cartão de crédito</li>
              <li>• Transações processadas por meio seguro</li>
              <li>• Monitoramento 24/7 contra fraudes</li>
              <li>• Conformidade com LGPD</li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <HelpCircle className="w-6 h-6 mr-3 text-blue-600" />
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Como funciona o pagamento por PIX?</h3>
              <p className="text-gray-600">
                Após finalizar o pedido, você receberá um QR Code para pagamento via PIX.
                O pagamento é processado instantaneamente e seu pedido é confirmado em seguida.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Posso parcelar minha compra?</h3>
              <p className="text-gray-600">
                Sim! Aceitamos parcelamento em até 12x sem juros no cartão de crédito para compras acima de R$ 200.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">O que fazer se o pagamento não foi processado?</h3>
              <p className="text-gray-600">
                Verifique os dados do cartão e tente novamente. Se persistir, entre em contato conosco
                pelo WhatsApp ou email para assistência imediata.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Quando o valor é debitado?</h3>
              <p className="text-gray-600">
                Para cartão de crédito, o valor é debitado no fechamento da fatura.
                Para PIX e débito, o desconto é imediato.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}