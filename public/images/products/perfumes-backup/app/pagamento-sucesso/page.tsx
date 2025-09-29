import { Metadata } from 'next';
import { CheckCircle, ArrowLeft, Package, Clock, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pagamento Confirmado | JC Hair Studio',
  description: 'Seu pagamento foi processado com sucesso. Obrigado pela sua compra!',
};

export default function PagamentoSucessoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h1>
          <p className="text-lg text-gray-600">
            Obrigado pela sua compra. Seu pedido foi processado com sucesso.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Passos</h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Confirmação por Email</h3>
                <p className="text-sm text-gray-600">
                  Você receberá um email de confirmação com os detalhes do seu pedido em alguns minutos.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Preparação do Pedido</h3>
                <p className="text-sm text-gray-600">
                  Seu pedido será preparado e embalado com cuidado em até 24-48 horas.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Envio e Entrega</h3>
                <p className="text-sm text-gray-600">
                  Você receberá o código de rastreamento assim que o pedido for despachado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Precisa de Ajuda?</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>📱 WhatsApp: +351 928 375 226</p>
            <p>📧 Email: suporte@jchairstudios62.xyz</p>
            <p>🕒 Atendimento: Segunda a Sexta, 9h às 18h</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar à Loja
          </Link>

          <Link
            href="/conta/pedidos"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Package className="w-4 h-4" />
            Meus Pedidos
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Referência do pagamento será incluída no email de confirmação.
          </p>
        </div>
      </div>
    </div>
  );
}