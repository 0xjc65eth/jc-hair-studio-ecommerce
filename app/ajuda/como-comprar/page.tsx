import { Metadata } from 'next';
import { ShoppingCart, Search, CreditCard, Truck, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ajuda - Como Comprar | JC Hair Studio',
  description: 'Guia passo a passo de como fazer sua compra no JC Hair Studio. Aprenda a navegar, escolher produtos e finalizar seu pedido.',
};

export default function ComoComprarAjudaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à página inicial
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Como Comprar</h1>
          <p className="text-gray-600">Guia completo para fazer sua compra</p>
        </div>

        {/* Step by Step */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-3 text-amber-600" />
            Passo a Passo
          </h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold">1</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-600" />
                  Encontre seus Produtos
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>• Use a barra de busca para encontrar produtos específicos</p>
                  <p>• Navigate pelas categorias: Mega Hair, Cosméticos, Maquiagens</p>
                  <p>• Use os filtros para refinar sua busca por marca, preço ou tipo</p>
                  <p>• Confira nossas seções especiais como "Mais Vendidos" e "Promoções"</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold">2</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-green-600" />
                  Adicione ao Carrinho
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>• Clique no produto para ver detalhes, fotos e avaliações</p>
                  <p>• Escolha a quantidade desejada</p>
                  <p>• Selecione variações como cor ou tamanho (quando aplicável)</p>
                  <p>• Clique em "Adicionar ao Carrinho"</p>
                  <p>• Continue comprando ou vá para o carrinho</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold">3</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                  Finalize seu Pedido
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>• Revise os produtos no seu carrinho</p>
                  <p>• Aplique cupons de desconto (se houver)</p>
                  <p>• Preencha seus dados pessoais e endereço de entrega</p>
                  <p>• Escolha a forma de pagamento</p>
                  <p>• Confirme seu pedido</p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold">4</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-indigo-600" />
                  Acompanhe seu Pedido
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>• Você receberá um email de confirmação</p>
                  <p>• Acompanhe o status do pedido em "Minha Conta"</p>
                  <p>• Receba atualizações por email e WhatsApp</p>
                  <p>• Acompanhe a entrega pelo código de rastreamento</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            💡 Dicas para uma Melhor Experiência
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-800">Navegação</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Use o menu lateral para explorar categorias</li>
                <li>• Marque produtos como favoritos para comprar depois</li>
                <li>• Compare produtos similares antes de decidir</li>
                <li>• Leia as avaliações de outros clientes</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-gray-800">Pagamento</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• PIX tem desconto de 5% em algumas compras</li>
                <li>• Parcele sem juros no cartão (compras acima de R$ 200)</li>
                <li>• Verifique cupons de desconto disponíveis</li>
                <li>• Calcule o frete antes de finalizar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            ❓ Problemas Comuns
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Não consigo adicionar produto ao carrinho</h3>
              <p className="text-gray-600 text-sm">
                Verifique se você selecionou todas as opções obrigatórias (cor, tamanho, etc.).
                Limpe o cache do navegador ou tente em modo privado.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Site está lento ou não carrega</h3>
              <p className="text-gray-600 text-sm">
                Verifique sua conexão com a internet. Tente recarregar a página ou
                acesse de outro dispositivo. Em horários de pico pode haver lentidão.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Produto fora de estoque</h3>
              <p className="text-gray-600 text-sm">
                Use a opção "Avisar quando chegar" para ser notificado quando o produto
                voltar ao estoque. Ou confira produtos similares na mesma categoria.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Links Úteis</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/produtos" className="flex items-center hover:text-amber-200 transition-colors">
              <ChevronRight className="w-4 h-4 mr-2" />
              Ver Todos os Produtos
            </Link>
            <Link href="/mega-hair" className="flex items-center hover:text-amber-200 transition-colors">
              <ChevronRight className="w-4 h-4 mr-2" />
              Mega Hair
            </Link>
            <Link href="/cosmeticos" className="flex items-center hover:text-amber-200 transition-colors">
              <ChevronRight className="w-4 h-4 mr-2" />
              Cosméticos
            </Link>
            <Link href="/conta" className="flex items-center hover:text-amber-200 transition-colors">
              <ChevronRight className="w-4 h-4 mr-2" />
              Minha Conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}