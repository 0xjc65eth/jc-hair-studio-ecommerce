'use client'

import Link from 'next/link'

export default function ComoComprarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-light tracking-widest mb-4">
            COMO COMPRAR
          </h1>
          <p className="text-xl text-blue-200 mb-2">Processo Simples e Seguro</p>
          <p className="text-lg text-blue-100 font-light">Seu pedido em poucos passos • Suporte completo • Entrega garantida</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link> / 
        <span className="ml-1 text-gray-900 font-medium"> Como Comprar</span>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Step by Step Process */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            📋 Processo de Compra Passo a Passo
          </h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-blue-50 rounded-xl">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-blue-700 mb-2">📱 Consulta Inicial</h3>
                <p className="text-gray-700 mb-4">
                  Entre em contato via WhatsApp informando qual produto você deseja. 
                  Nossa equipe fará uma análise personalizada e orientará sobre a melhor opção para seu cabelo.
                </p>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-gray-600 font-medium">💡 Dica: Tenha em mãos fotos do seu cabelo atual e a cor desejada para uma orientação mais precisa.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-green-50 rounded-xl">
              <div className="flex-shrink-0 w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-green-700 mb-2">💰 Orçamento Personalizado</h3>
                <p className="text-gray-700 mb-4">
                  Você receberá um orçamento detalhado incluindo produto, frete e impostos. 
                  Informamos todas as formas de pagamento disponíveis e prazos de entrega.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-1">🌍 Entrega Europa</h4>
                    <p className="text-sm text-gray-600">5-10 dias úteis</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-1">🌎 Entrega Internacional</h4>
                    <p className="text-sm text-gray-600">10-20 dias úteis</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-purple-50 rounded-xl">
              <div className="flex-shrink-0 w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-purple-700 mb-2">✅ Confirmação do Pedido</h3>
                <p className="text-gray-700 mb-4">
                  Aprovado o orçamento, você confirma o pedido e escolhe a forma de pagamento. 
                  Enviamos todos os detalhes por escrito para sua segurança.
                </p>
                <div className="bg-white p-3 rounded-lg border-l-4 border-purple-400">
                  <p className="text-sm text-gray-600">
                    <strong>Incluímos:</strong> Número de rastreamento, data prevista de entrega e instruções de cuidado.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-yellow-50 rounded-xl">
              <div className="flex-shrink-0 w-16 h-16 bg-yellow-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                4
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-yellow-700 mb-2">📦 Preparação e Envio</h3>
                <p className="text-gray-700 mb-4">
                  Seu produto é cuidadosamente selecionado, embalado com proteção especial e 
                  enviado com rastreamento completo. Você recebe atualizações em tempo real.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white p-2 rounded text-center">
                    <div className="font-semibold text-yellow-700">📋 Seleção</div>
                    <div className="text-xs text-gray-600">Produto escolhido especialmente</div>
                  </div>
                  <div className="bg-white p-2 rounded text-center">
                    <div className="font-semibold text-yellow-700">📦 Embalagem</div>
                    <div className="text-xs text-gray-600">Proteção premium</div>
                  </div>
                  <div className="bg-white p-2 rounded text-center">
                    <div className="font-semibold text-yellow-700">🚚 Envio</div>
                    <div className="text-xs text-gray-600">Rastreamento ativo</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-indigo-50 rounded-xl">
              <div className="flex-shrink-0 w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                5
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-indigo-700 mb-2">🎉 Recebimento e Suporte</h3>
                <p className="text-gray-700 mb-4">
                  Você recebe seu produto e nosso suporte não para por aí! Oferecemos orientações 
                  de aplicação, cuidados e estamos disponíveis para qualquer dúvida.
                </p>
                <div className="bg-white p-3 rounded-lg border-l-4 border-indigo-400">
                  <p className="text-sm text-gray-600">
                    <strong>Suporte vitalício:</strong> Nossa equipe está sempre disponível para orientações e dicas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              📱 WhatsApp Oficial
            </h3>
            <p className="text-gray-600 mb-6">
              Nossa principal forma de atendimento. Resposta rápida e orientação personalizada.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600">🇧🇪</span>
                <div>
                  <div className="font-semibold text-gray-800">Bélgica</div>
                  <div className="text-sm text-gray-600">+32 470 032 758</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600">🇵🇹</span>
                <div>
                  <div className="font-semibold text-gray-800">Portugal</div>
                  <div className="text-sm text-gray-600">+351 XXX XXX XXX</div>
                </div>
              </div>
            </div>
            
            <a
              href="https://wa.me/32470032758"
              target="_blank"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              💬 Iniciar Conversa
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              ✉️ Email & Website
            </h3>
            <p className="text-gray-600 mb-6">
              Para consultas detalhadas, catálogos e informações técnicas.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-gray-800">📧 Email Comercial</div>
                <div className="text-sm text-gray-600">contato@jchairstudios62.xyz</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-semibold text-gray-800">🌐 Website</div>
                <div className="text-sm text-gray-600">www.jchairstudios62.xyz</div>
              </div>
            </div>
            
            <a
              href="mailto:contato@jchairstudios62.xyz"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              📧 Enviar Email
            </a>
          </div>
        </div>

        {/* First Purchase Tips */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            🎯 Dicas para Primeira Compra
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">📏</div>
              <h4 className="font-semibold text-blue-700 mb-2">Meça seu Cabelo</h4>
              <p className="text-sm text-gray-700">
                Meça da raiz até a ponta desejada. Nossos produtos vão de 40cm a 70cm.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">📸</div>
              <h4 className="font-semibold text-purple-700 mb-2">Fotos do Cabelo</h4>
              <p className="text-sm text-gray-700">
                Envie fotos com boa iluminação natural para combinarmos a cor perfeitamente.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
              <div className="text-3xl mb-3">🎨</div>
              <h4 className="font-semibold text-green-700 mb-2">Teste de Cor</h4>
              <p className="text-sm text-gray-700">
                Oferecemos amostras de cor por apenas €5 (descontados na compra).
              </p>
            </div>
          </div>
        </div>

        {/* Personalized Service */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            💎 Atendimento Personalizado
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-blue-400">🎯 Consultoria Gratuita</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Análise do seu tipo de cabelo</li>
                <li>• Recomendação de produtos ideais</li>
                <li>• Orientação de aplicação</li>
                <li>• Dicas de manutenção</li>
                <li>• Suporte pós-venda vitalício</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4 text-green-400">🚀 Processo Otimizado</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Resposta em até 2 horas</li>
                <li>• Orçamento detalhado</li>
                <li>• Múltiplas formas de pagamento</li>
                <li>• Envio expresso disponível</li>
                <li>• Rastreamento em tempo real</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border-l-4 border-amber-400 mb-8">
          <h3 className="text-2xl font-bold text-amber-800 mb-4 flex items-center gap-2">
            ⚠️ Informações Importantes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-amber-700 mb-2">🕒 Horários de Atendimento</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>Segunda a Sexta: 9h às 18h</li>
                <li>Sábado: 9h às 14h</li>
                <li>Domingo: Plantão emergencial</li>
                <li>Fuso: Horário da Europa Central (CET)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-amber-700 mb-2">📋 Antes de Comprar</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Sempre consulte nossa equipe</li>
                <li>• Confirme a cor com fotos</li>
                <li>• Verifique documentação de importação</li>
                <li>• Leia nossas políticas de troca</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🏛️ Informações Legais e Corporativas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🇵🇹 Sede Portugal</h4>
                <p className="text-sm text-gray-700">
                  62 Beauty's 62<br />
                  Lisboa, Portugal<br />
                  NIF: PT###.###.###<br />
                  Registro de Empresa Europeu
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🇧🇪 Filial Bélgica</h4>
                <p className="text-sm text-gray-700">
                  62 Beauty's 62 BVBA<br />
                  Bruxelas, Bélgica<br />
                  VAT: BE#########<br />
                  Licença de Importação UE
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🛡️ Conformidade GDPR</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Proteção de dados pessoais</li>
                  <li>• Política de privacidade transparente</li>
                  <li>• Direito ao esquecimento</li>
                  <li>• Consentimento explícito</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">📜 Políticas Integradas</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Termos de uso claros</li>
                  <li>• Política de cookies</li>
                  <li>• Direitos do consumidor UE</li>
                  <li>• Resolução de disputas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}