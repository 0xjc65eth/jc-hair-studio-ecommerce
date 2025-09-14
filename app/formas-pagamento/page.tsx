'use client'

import Link from 'next/link'

export default function FormasPagamentoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-light tracking-widest mb-4">
            FORMAS DE PAGAMENTO
          </h1>
          <p className="text-xl text-emerald-200 mb-2">Flexibilidade e Segurança</p>
          <p className="text-lg text-emerald-100 font-light">Múltiplas opções • Transações seguras • Facilidade máxima</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link> / 
        <span className="ml-1 text-gray-900 font-medium"> Formas de Pagamento</span>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* PIX - Brazil */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-500">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🇧🇷</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">PIX - Brasil</h3>
              <p className="text-gray-600">Pagamento instantâneo e seguro</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Vantagens</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Confirmação imediata</li>
                  <li>• Sem taxas adicionais</li>
                  <li>• Disponível 24/7</li>
                  <li>• Segurança máxima</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📋 Como Funciona</h4>
                <ol className="text-sm text-gray-700 space-y-1">
                  <li>1. Confirme seu pedido via WhatsApp</li>
                  <li>2. Receba o QR Code ou chave PIX</li>
                  <li>3. Realize o pagamento no seu banco</li>
                  <li>4. Envie o comprovante</li>
                  <li>5. Pedido processado em minutos</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Bank Transfer - Europe */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🇪🇺</div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">Transferência Bancária</h3>
              <p className="text-gray-600">SEPA - União Europeia</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🏦 Detalhes Bancários</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <div><strong>Banco:</strong> KBC Bank (Bélgica)</div>
                  <div><strong>IBAN:</strong> BE## #### #### ####</div>
                  <div><strong>BIC:</strong> KREDBEBB</div>
                  <div><strong>Titular:</strong> JC Hair Studio's 62</div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">⚡ Processamento</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• SEPA: 1-2 dias úteis</li>
                  <li>• Transferência internacional: 3-5 dias</li>
                  <li>• Confirmação automática</li>
                </ul>
              </div>
            </div>
          </div>

          {/* PayPal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-purple-500">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">PayPal</h3>
              <p className="text-gray-600">Proteção internacional do comprador</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🛡️ Proteção Total</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Proteção do comprador</li>
                  <li>• Reembolso garantido</li>
                  <li>• Criptografia avançada</li>
                  <li>• Aceito mundialmente</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-2">💰 Taxas</h4>
                <div className="text-sm text-gray-700">
                  Taxa de 3,9% + €0,35 por transação internacional
                  (incluída no valor final do orçamento)
                </div>
              </div>
            </div>
          </div>

          {/* Wise (ex-TransferWise) */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-teal-500">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold text-teal-600 mb-2">Wise</h3>
              <p className="text-gray-600">Câmbio real e taxas baixas</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="font-semibold text-teal-800 mb-2">💱 Vantagens Wise</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Taxa de câmbio real</li>
                  <li>• Taxas até 8x menores</li>
                  <li>• Transparência total</li>
                  <li>• Rastreamento em tempo real</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">📱 Como Usar</h4>
                <ol className="text-sm text-gray-700 space-y-1">
                  <li>1. Solicite dados da conta Wise</li>
                  <li>2. Use o app/site do Wise</li>
                  <li>3. Envie para nossa conta</li>
                  <li>4. Compartilhe o recibo</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Credit Cards */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-red-500">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💳</div>
              <h3 className="text-2xl font-bold text-red-600 mb-2">Cartões de Crédito</h3>
              <p className="text-gray-600">Visa, Mastercard, American Express</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">💳 Bandeiras Aceitas</h4>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
                  <div className="text-center p-2 bg-white rounded">Visa</div>
                  <div className="text-center p-2 bg-white rounded">Mastercard</div>
                  <div className="text-center p-2 bg-white rounded">Amex</div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🔒 Segurança</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Protocolo SSL 256-bit</li>
                  <li>• Tokenização de dados</li>
                  <li>• Verificação 3D Secure</li>
                  <li>• PCI DSS Compliant</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bitcoin */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-orange-500">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">₿</div>
              <h3 className="text-2xl font-bold text-orange-600 mb-2">Bitcoin</h3>
              <p className="text-gray-600">Para clientes tech-savvy</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">⚡ Vantagens Bitcoin</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Transação global instantânea</li>
                  <li>• Taxas mínimas</li>
                  <li>• Desconto de 3% no valor total</li>
                  <li>• Privacidade máxima</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">📋 Processo</h4>
                <ol className="text-sm text-gray-700 space-y-1">
                  <li>1. Confirme pedido via WhatsApp</li>
                  <li>2. Receba endereço da wallet</li>
                  <li>3. Transfira o valor exato</li>
                  <li>4. Envie hash da transação</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Installment Plans */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            💳 Parcelamento Disponível
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-2xl mb-2">2x</div>
              <div className="text-sm font-semibold text-blue-700">Sem Juros</div>
              <div className="text-xs text-gray-600">Cartão ou PayPal</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-2xl mb-2">3x</div>
              <div className="text-sm font-semibold text-green-700">Sem Juros</div>
              <div className="text-xs text-gray-600">Pedidos &gt; €200</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-2xl mb-2">6x</div>
              <div className="text-sm font-semibold text-purple-700">Com Juros</div>
              <div className="text-xs text-gray-600">1.99% a.m.</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <div className="text-2xl mb-2">12x</div>
              <div className="text-sm font-semibold text-yellow-700">Com Juros</div>
              <div className="text-xs text-gray-600">2.49% a.m.</div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-700">
              <strong>Parcelamento sujeito à aprovação.</strong> Consulte condições específicas para seu país.
            </p>
          </div>
        </div>

        {/* Special Conditions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            🎯 Condições Especiais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-lg font-semibold text-green-700 mb-2">Desconto à Vista</h4>
              <p className="text-sm text-gray-700 mb-3">
                5% de desconto para pagamentos via PIX ou transferência bancária
              </p>
              <div className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                Aplicado automaticamente
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-4xl mb-4">📦</div>
              <h4 className="text-lg font-semibold text-blue-700 mb-2">Frete Grátis</h4>
              <p className="text-sm text-gray-700 mb-3">
                Para pedidos acima de €150 em produtos (não inclui frete)
              </p>
              <div className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                Europa: Correios Premium
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-4xl mb-4">🎁</div>
              <h4 className="text-lg font-semibold text-purple-700 mb-2">Cliente Fiel</h4>
              <p className="text-sm text-gray-700 mb-3">
                A partir da 3ª compra, ganhe 10% de desconto permanente
              </p>
              <div className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded">
                Vitalício
              </div>
            </div>
          </div>
        </div>

        {/* Security & Guarantees */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            🔒 Segurança e Garantias
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h4 className="font-semibold mb-2">Transações Seguras</h4>
              <p className="text-sm text-gray-300">
                Criptografia SSL 256-bit em todas as transações
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">💎</div>
              <h4 className="font-semibold mb-2">Produto Garantido</h4>
              <p className="text-sm text-gray-300">
                Satisfação garantida ou dinheiro de volta
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold mb-2">Suporte 24/7</h4>
              <p className="text-sm text-gray-300">
                Atendimento via WhatsApp para emergências
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🌍</div>
              <h4 className="font-semibold mb-2">Entrega Rastreada</h4>
              <p className="text-sm text-gray-300">
                Código de rastreamento para todos os pedidos
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Payment */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ❓ Perguntas Frequentes - Pagamento
          </h3>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold text-gray-800 mb-2">🔄 Posso cancelar após o pagamento?</h4>
              <p className="text-gray-700">
                Sim, você tem até 2 horas após a confirmação do pagamento para cancelar sem custo. 
                Após esse prazo, aplicamos nossa política de cancelamento com possível taxa.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold text-gray-800 mb-2">⏰ Quanto tempo para processar o pagamento?</h4>
              <p className="text-gray-700">
                PIX: Instantâneo | Transferência SEPA: 1-2 dias | PayPal: Imediato | Wise: 1-3 dias
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h4 className="font-semibold text-gray-800 mb-2">💱 Como funciona o câmbio?</h4>
              <p className="text-gray-700">
                Preços em EUR. Para pagamentos em outras moedas, usamos a cotação do dia da confirmação. 
                Recomendamos Wise para melhores taxas de câmbio.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🧾 Preciso de nota fiscal?</h4>
              <p className="text-gray-700">
                Sim, sempre emitimos fatura comercial para importação. Clientes da UE recebem fatura com IVA incluso.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Pronto para finalizar seu pedido?
          </h3>
          <p className="text-gray-600 mb-6">
            Nossa equipe está disponível para orientar sobre a melhor forma de pagamento para você
          </p>
          
          <a
            href={`https://wa.me/32470032758?text=${encodeURIComponent('💳 Olá! Gostaria de informações sobre formas de pagamento e finalizar meu pedido. Podem me orientar sobre a melhor opção para meu país?')}`}
            target="_blank"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            💬 Finalizar Pedido via WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}