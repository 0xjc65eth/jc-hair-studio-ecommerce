import { Metadata } from 'next';
import { RotateCcw, Clock, CheckCircle, ArrowLeft, Phone } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ajuda - Devoluções e Trocas | JC Hair Studio',
  description: 'Política de devoluções, trocas e reembolsos do JC Hair Studio. Saiba como proceder com sua solicitação.',
};

export default function DevolucaoAjudaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à página inicial
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Devoluções e Trocas</h1>
          <p className="text-gray-600">Política de devoluções e como proceder</p>
        </div>

        {/* Return Policy */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <RotateCcw className="w-6 h-6 mr-3 text-amber-600" />
            Política de Devoluções
          </h2>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-amber-800 mb-2">Prazo para Devolução</h3>
            <p className="text-amber-700">
              Você tem até <strong>30 dias</strong> após o recebimento do produto para solicitar devolução ou troca.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">Condições para Devolução</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Produto em perfeito estado de conservação</li>
              <li>• Embalagem original lacrada (para produtos de beleza)</li>
              <li>• Nota fiscal ou comprovante de compra</li>
              <li>• Ausência de sinais de uso ou violação</li>
              <li>• Todos os acessórios e manuais inclusos</li>
            </ul>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
            Como Solicitar Devolução
          </h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Entre em Contato</h3>
                <p className="text-gray-600">
                  Envie um WhatsApp para (11) 99999-9999 ou email para devolucoes@jchairstudio.com
                  informando o número do pedido e motivo da devolução.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Autorização</h3>
                <p className="text-gray-600">
                  Nossa equipe analisará sua solicitação e enviará as instruções
                  para devolução em até 24 horas.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Envio do Produto</h3>
                <p className="text-gray-600">
                  Embale o produto adequadamente e envie pelos Correios ou transportadora
                  indicada. O frete de devolução é por nossa conta.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Reembolso</h3>
                <p className="text-gray-600">
                  Após recebermos e analisarmos o produto, o reembolso será processado
                  em até 7 dias úteis na mesma forma de pagamento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeframes */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-blue-600" />
            Prazos de Reembolso
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800">Cartão de Crédito</h3>
              <p className="text-gray-600">
                O estorno aparecerá na próxima fatura ou em até 2 faturas,
                dependendo da data de fechamento.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-800">PIX / Transferência</h3>
              <p className="text-gray-600">
                Reembolso em até 7 dias úteis via PIX para a conta informada
                no momento da compra.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-3" />
            Precisa de Ajuda?
          </h2>
          <p className="mb-4">
            Nossa equipe está pronta para ajudá-lo com sua devolução ou troca.
          </p>
          <div className="space-y-2 text-sm">
            <p>📱 WhatsApp: (11) 99999-9999</p>
            <p>📧 Email: devolucoes@jchairstudio.com</p>
            <p>🕒 Atendimento: Segunda a Sexta, 9h às 18h</p>
          </div>
        </div>
      </div>
    </div>
  );
}