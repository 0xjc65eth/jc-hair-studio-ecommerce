import { Metadata } from 'next';
import { Truck, MapPin, Clock, Package, ArrowLeft, Calculator } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ajuda - Envio e Entrega | JC Hair Studio',
  description: 'Informações sobre frete, prazos de entrega, regiões atendidas e opções de envio do JC Hair Studio.',
};

export default function EnvioAjudaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à página inicial
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Envio e Entrega</h1>
          <p className="text-gray-600">Informações sobre frete e prazos de entrega</p>
        </div>

        {/* Shipping Options */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Truck className="w-6 h-6 mr-3 text-amber-600" />
            Opções de Envio
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Correios - PAC</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Prazo: 8 a 15 dias úteis</p>
                <p>• Frete calculado por CEP</p>
                <p>• Rastreamento incluído</p>
                <p>• Seguro automático</p>
                <p className="text-green-600 font-medium">• Mais econômico</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Correios - SEDEX</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Prazo: 3 a 7 dias úteis</p>
                <p>• Frete calculado por CEP</p>
                <p>• Rastreamento incluído</p>
                <p>• Seguro automático</p>
                <p className="text-blue-600 font-medium">• Mais rápido</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">🚚 Frete Grátis</h3>
            <p className="text-green-700 text-sm">
              Aproveite frete grátis via PAC para compras acima de <strong>R$ 299</strong> em todo o Brasil!
            </p>
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-3 text-blue-600" />
            Regiões Atendidas
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Brasil</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Todas as capitais</li>
                <li>• Interior de todos os estados</li>
                <li>• Regiões metropolitanas</li>
                <li>• Algumas localidades rurais</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Portugal</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Lisboa e Porto</li>
                <li>• Principais cidades</li>
                <li>• Consultar disponibilidade</li>
                <li>• Prazo: 15-25 dias úteis</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Europa</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Espanha e França</li>
                <li>• Itália e Alemanha</li>
                <li>• Consultar viabilidade</li>
                <li>• Prazo: 20-35 dias úteis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shipping Times */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-purple-600" />
            Prazos de Entrega
          </h2>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">📦 Processamento do Pedido</h3>
              <p className="text-blue-700 text-sm">
                Pedidos aprovados até as 14h são processados no mesmo dia.
                Após às 14h ou finais de semana, processamento no próximo dia útil.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">Região</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">PAC</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-800">SEDEX</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-4 text-gray-600">Sudeste</td>
                    <td className="py-2 px-4 text-gray-600">3-8 dias úteis</td>
                    <td className="py-2 px-4 text-gray-600">1-3 dias úteis</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-4 text-gray-600">Sul</td>
                    <td className="py-2 px-4 text-gray-600">5-10 dias úteis</td>
                    <td className="py-2 px-4 text-gray-600">2-5 dias úteis</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-4 text-gray-600">Nordeste</td>
                    <td className="py-2 px-4 text-gray-600">8-12 dias úteis</td>
                    <td className="py-2 px-4 text-gray-600">3-7 dias úteis</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-4 text-gray-600">Centro-Oeste</td>
                    <td className="py-2 px-4 text-gray-600">6-10 dias úteis</td>
                    <td className="py-2 px-4 text-gray-600">3-6 dias úteis</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-gray-600">Norte</td>
                    <td className="py-2 px-4 text-gray-600">10-15 dias úteis</td>
                    <td className="py-2 px-4 text-gray-600">5-10 dias úteis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tracking */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Package className="w-6 h-6 mr-3 text-green-600" />
            Rastreamento
          </h2>

          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">Como Rastrear</h3>
              <div className="text-amber-700 text-sm space-y-1">
                <p>• Você receberá o código de rastreamento por email e WhatsApp</p>
                <p>• Acesse o site dos Correios ou use o app</p>
                <p>• Digite o código de rastreamento</p>
                <p>• Acompanhe em tempo real o status da entrega</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Status de Entrega</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span><strong>Postado:</strong> Pedido foi despachado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span><strong>Em trânsito:</strong> A caminho do destino</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span><strong>Saiu para entrega:</strong> Carteiro a caminho</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span><strong>Entregue:</strong> Pedido foi recebido</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Calculator */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calculator className="w-6 h-6 mr-3 text-indigo-600" />
            Calcular Frete
          </h2>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
            <p className="text-indigo-700 text-sm">
              💡 <strong>Dica:</strong> Calcule o frete diretamente no carrinho de compras inserindo seu CEP.
              O valor e prazo aparecerão automaticamente antes de finalizar o pedido.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Como Calcular</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Adicione produtos ao carrinho</li>
                <li>2. Acesse o carrinho de compras</li>
                <li>3. Digite seu CEP no campo indicado</li>
                <li>4. Escolha a modalidade de frete</li>
                <li>5. Veja valor e prazo de entrega</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-3">Fatores que Influenciam</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Peso total dos produtos</li>
                <li>• Dimensões da embalagem</li>
                <li>• Distância até o destino</li>
                <li>• Modalidade escolhida (PAC/SEDEX)</li>
                <li>• Promoções de frete grátis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}