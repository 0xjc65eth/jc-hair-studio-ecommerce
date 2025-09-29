'use client'

import Link from 'next/link'

export default function TrocasDevolucoesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-600 to-rose-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-light tracking-widest mb-4">
            TROCAS & DEVOLUÇÕES
          </h1>
          <p className="text-xl text-rose-200 mb-2">Política de Satisfação</p>
          <p className="text-lg text-rose-100 font-light">Direito de arrependimento • Qualidade garantida • Processo simples</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-rose-600 transition-colors">Home</Link> / 
        <span className="ml-1 text-gray-900 font-medium"> Trocas & Devoluções</span>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* EU Rights Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🇪🇺</div>
            <h2 className="text-3xl font-bold mb-4">Direitos do Consumidor UE</h2>
            <p className="text-xl mb-6">
              De acordo com a Diretiva Europeia 2011/83/UE, você tem <strong>14 dias</strong> para cancelar sua compra sem justificativa
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-800 p-4 rounded-lg">
                <div className="font-semibold mb-1">🕐 Prazo Legal</div>
                <div>14 dias corridos após recebimento</div>
              </div>
              <div className="bg-blue-800 p-4 rounded-lg">
                <div className="font-semibold mb-1">💰 Reembolso Total</div>
                <div>100% do valor pago incluindo frete inicial</div>
              </div>
              <div className="bg-blue-800 p-4 rounded-lg">
                <div className="font-semibold mb-1">📋 Sem Justificativa</div>
                <div>Não precisa explicar o motivo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            📋 Processo de Devolução Passo a Passo
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Steps */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">Contato Inicial</h4>
                  <p className="text-gray-700 mb-2">
                    Entre em contato via WhatsApp ou email informando sua intenção de devolver o produto.
                  </p>
                  <div className="text-sm text-blue-600 font-medium">
                    📱 WhatsApp: +32 470 032 758 | 📧 devolucoes@jchairstudios62.xyz
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-700 mb-2">Autorização</h4>
                  <p className="text-gray-700 mb-2">
                    Receba o código de autorização (RMA) e instruções específicas para embalagem e envio.
                  </p>
                  <div className="text-sm text-green-600 font-medium">
                    Resposta em até 24 horas nos dias úteis
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-purple-700 mb-2">Embalagem</h4>
                  <p className="text-gray-700 mb-2">
                    Embale o produto nas condições originais com todos os acessórios e documentação.
                  </p>
                  <div className="text-sm text-purple-600 font-medium">
                    Use preferencialmente a embalagem original
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl">
                <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-yellow-700 mb-2">Envio</h4>
                  <p className="text-gray-700 mb-2">
                    Envie para nosso centro de devolução usando o método indicado pela nossa equipe.
                  </p>
                  <div className="text-sm text-yellow-600 font-medium">
                    Código de rastreamento obrigatório
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl">
                <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-indigo-700 mb-2">Processamento</h4>
                  <p className="text-gray-700 mb-2">
                    Analisamos o produto e processamos seu reembolso em até 7 dias úteis após recebimento.
                  </p>
                  <div className="text-sm text-indigo-600 font-medium">
                    Você recebe confirmação por email
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-gray-800 mb-6">⏱️ Cronograma de Reembolso</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">Solicitação de Devolução</span>
                  <span className="text-blue-600 font-semibold">Imediato</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">Autorização RMA</span>
                  <span className="text-green-600 font-semibold">24h</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">Envio do Produto</span>
                  <span className="text-purple-600 font-semibold">5-10 dias</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">Análise e Aprovação</span>
                  <span className="text-yellow-600 font-semibold">3-7 dias</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium text-gray-700">Processamento Reembolso</span>
                  <span className="text-indigo-600 font-semibold">7-14 dias</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
                <p className="text-sm font-medium text-green-800">
                  📅 Prazo Total: <strong>15-35 dias</strong> dependendo da localização e forma de pagamento original
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Eligible vs Non-Eligible */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Eligible Products */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
              ✅ Produtos Elegíveis para Troca/Devolução
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h4 className="font-semibold text-green-800 mb-2">🎯 Condições Aceitas</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Produtos não utilizados ou testados</li>
                  <li>• Embalagem original intacta</li>
                  <li>• Todos os acessórios inclusos</li>
                  <li>• Etiquetas e lacres preservados</li>
                  <li>• Dentro do prazo de 14 dias</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📦 Tipos de Produto</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Extensões de cabelo natural</li>
                  <li>• Mega hair (não aplicado)</li>
                  <li>• Produtos para progressiva</li>
                  <li>• Acessórios para aplicação</li>
                  <li>• Kits completos lacrados</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">💡 Motivos Válidos</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Arrependimento (direito legal UE)</li>
                  <li>• Cor diferente do solicitado</li>
                  <li>• Produto com defeito de fabricação</li>
                  <li>• Tamanho/comprimento incorreto</li>
                  <li>• Produto danificado no transporte</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Non-Eligible Products */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
              ❌ Produtos NÃO Elegíveis
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <h4 className="font-semibold text-red-800 mb-2">🚫 Condições Não Aceitas</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Produtos utilizados ou aplicados</li>
                  <li>• Embalagem danificada ou perdida</li>
                  <li>• Prazo de 14 dias expirado</li>
                  <li>• Produtos cortados ou modificados</li>
                  <li>• Sinais de uso ou desgaste</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Produtos Especiais</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Produtos sob medida/customizados</li>
                  <li>• Mega hair já aplicado</li>
                  <li>• Produtos químicos abertos</li>
                  <li>• Extensões misturadas com outros lotes</li>
                  <li>• Produtos com mais de 30 dias</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">📋 Exceções</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Produtos em promoção liquidação</li>
                  <li>• Últimas unidades em estoque</li>
                  <li>• Produtos com desconto &gt; 50%</li>
                  <li>• Vendas especiais Black Friday</li>
                  <li>• Produtos descontinuados</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Costs and Responsibilities */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            💰 Custos de Retorno
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-4xl mb-3">🆓</div>
              <h4 className="font-semibold text-green-700 mb-2">Defeito de Fabricação</h4>
              <p className="text-sm text-gray-700 mb-2">
                Frete de devolução por nossa conta
              </p>
              <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                Custo: €0,00
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-4xl mb-3">📦</div>
              <h4 className="font-semibold text-blue-700 mb-2">Erro Nosso</h4>
              <p className="text-sm text-gray-700 mb-2">
                Produto/cor/tamanho incorreto
              </p>
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Custo: €0,00
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
              <div className="text-4xl mb-3">🔄</div>
              <h4 className="font-semibold text-yellow-700 mb-2">Arrependimento</h4>
              <p className="text-sm text-gray-700 mb-2">
                Cliente arca com frete de retorno
              </p>
              <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                Custo: €15-35
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-4xl mb-3">🚚</div>
              <h4 className="font-semibold text-purple-700 mb-2">Troca</h4>
              <p className="text-sm text-gray-700 mb-2">
                Frete de nova remessa
              </p>
              <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                Custo: Conforme região
              </div>
            </div>
          </div>
        </div>

        {/* Quality Guarantee */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            🏆 Garantia de Qualidade 62 Beauty's 62
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">💎</div>
              <h4 className="font-semibold mb-2">Qualidade Premium</h4>
              <p className="text-sm text-amber-100">
                Cabelo 100% natural com garantia de origem
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🔬</div>
              <h4 className="font-semibold mb-2">Controle Rigoroso</h4>
              <p className="text-sm text-amber-100">
                Cada lote testado e aprovado por especialistas
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">📋</div>
              <h4 className="font-semibold mb-2">Certificação</h4>
              <p className="text-sm text-amber-100">
                Certificados de qualidade e procedência
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h4 className="font-semibold mb-2">Compromisso</h4>
              <p className="text-sm text-amber-100">
                Satisfação do cliente é nossa prioridade
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-lg font-semibold mb-2">
              🎯 Nossa Promessa: Se você não ficar 100% satisfeito, devolveremos seu dinheiro!
            </p>
            <p className="text-sm text-amber-200">
              Compromisso com excelência há mais de 10 anos servindo clientes em toda Europa
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📞 Precisa de Ajuda com Trocas/Devoluções?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📱</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">WhatsApp Prioritário</h4>
              <p className="text-gray-600 mb-4">
                Fale diretamente com nossa equipe especializada em devoluções
              </p>
              <a
                href={`https://wa.me/32470032758?text=${encodeURIComponent('🔄 Olá! Preciso de orientação sobre processo de troca/devolução. Podem me ajudar?')}`}
                target="_blank"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                💬 Iniciar Conversa
              </a>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">✉️</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Email Especializado</h4>
              <p className="text-gray-600 mb-4">
                Para questões complexas e documentação detalhada
              </p>
              <a
                href="mailto:devolucoes@jchairstudios62.xyz"
                className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                📧 Enviar Email
              </a>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-xl text-center">
            <p className="text-gray-700 font-medium">
              🕐 <strong>Horário de Atendimento:</strong> Segunda a Sexta 9h-18h, Sábado 9h-14h (CET)
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Garantimos resposta em até 24 horas nos dias úteis
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}