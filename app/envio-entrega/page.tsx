'use client'

import Link from 'next/link'

export default function EnvioEntregaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-light tracking-widest mb-4">
            ENVIO & ENTREGA
          </h1>
          <p className="text-xl text-indigo-200 mb-2">Logística Completa</p>
          <p className="text-lg text-indigo-100 font-light">Entrega em toda Europa • Parceiros confiáveis • Rastreamento ativo</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link> / 
        <span className="ml-1 text-gray-900 font-medium"> Envio & Entrega</span>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Coverage Map */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🌍 Áreas de Entrega
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Europe Priority */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                🇪🇺 Europa (Prioritária)
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600">União Europeia</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Portugal</li>
                    <li>• Espanha</li>
                    <li>• França</li>
                    <li>• Bélgica</li>
                    <li>• Holanda</li>
                    <li>• Alemanha</li>
                    <li>• Itália</li>
                    <li>• Luxemburgo</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600">Outros Países</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Reino Unido</li>
                    <li>• Suíça</li>
                    <li>• Noruega</li>
                    <li>• Dinamarca</li>
                    <li>• Suécia</li>
                    <li>• Finlândia</li>
                    <li>• Áustria</li>
                    <li>• República Checa</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm font-medium text-gray-800">
                  🚀 Entrega Express: 3-5 dias úteis | 🆓 Frete grátis acima de €75
                </p>
              </div>
            </div>

            {/* International */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
              <h3 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                🌎 Internacional
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">Américas</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Brasil</li>
                    <li>• Estados Unidos</li>
                    <li>• Canadá</li>
                    <li>• México</li>
                    <li>• Argentina</li>
                    <li>• Chile</li>
                    <li>• Colômbia</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">Outros</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Austrália</li>
                    <li>• Japão</li>
                    <li>• Coreia do Sul</li>
                    <li>• Singapura</li>
                    <li>• Dubai</li>
                    <li>• Israel</li>
                    <li>• África do Sul</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-green-400">
                <p className="text-sm font-medium text-gray-800">
                  📦 Entrega Padrão: 10-20 dias úteis | 📋 Documentação incluída
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Partners */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🤝 Parceiros Logísticos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl">
              <div className="text-4xl mb-3">📦</div>
              <h4 className="font-bold text-yellow-700 mb-2">DHL Express</h4>
              <p className="text-sm text-gray-700 mb-2">Europa: 3-5 dias</p>
              <p className="text-xs text-gray-600">Rastreamento premium</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
              <div className="text-4xl mb-3">🚚</div>
              <h4 className="font-bold text-red-700 mb-2">FedEx</h4>
              <p className="text-sm text-gray-700 mb-2">Internacional: 7-12 dias</p>
              <p className="text-xs text-gray-600">Rede global</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-4xl mb-3">📮</div>
              <h4 className="font-bold text-blue-700 mb-2">UPS</h4>
              <p className="text-sm text-gray-700 mb-2">Padrão: 5-10 dias</p>
              <p className="text-xs text-gray-600">Custo-benefício</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-4xl mb-3">🇵🇹</div>
              <h4 className="font-bold text-green-700 mb-2">CTT Portugal</h4>
              <p className="text-sm text-gray-700 mb-2">Nacional: 2-3 dias</p>
              <p className="text-xs text-gray-600">Correio português</p>
            </div>
          </div>
        </div>

        {/* Delivery Times by Region */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ⏰ Prazos de Entrega por Região
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-800">Região</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Padrão</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Express</th>
                  <th className="text-left p-4 font-semibold text-gray-800">Frete Grátis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-4 font-medium text-gray-800">🇵🇹 Portugal</td>
                  <td className="p-4 text-gray-700">2-3 dias</td>
                  <td className="p-4 text-gray-700">1-2 dias</td>
                  <td className="p-4 text-green-600">€50+</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">🇪🇸 Espanha</td>
                  <td className="p-4 text-gray-700">3-5 dias</td>
                  <td className="p-4 text-gray-700">2-3 dias</td>
                  <td className="p-4 text-green-600">€65+</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-800">🇫🇷 França</td>
                  <td className="p-4 text-gray-700">4-6 dias</td>
                  <td className="p-4 text-gray-700">2-3 dias</td>
                  <td className="p-4 text-green-600">€75+</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">🇧🇪 Bélgica/Holanda</td>
                  <td className="p-4 text-gray-700">3-4 dias</td>
                  <td className="p-4 text-gray-700">1-2 dias</td>
                  <td className="p-4 text-green-600">€75+</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-800">🇩🇪 Alemanha</td>
                  <td className="p-4 text-gray-700">4-6 dias</td>
                  <td className="p-4 text-gray-700">2-3 dias</td>
                  <td className="p-4 text-green-600">€75+</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">🇬🇧 Reino Unido</td>
                  <td className="p-4 text-gray-700">5-8 dias</td>
                  <td className="p-4 text-gray-700">3-5 dias</td>
                  <td className="p-4 text-yellow-600">€100+</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-gray-800">🇧🇷 Brasil</td>
                  <td className="p-4 text-gray-700">15-25 dias</td>
                  <td className="p-4 text-gray-700">8-12 dias</td>
                  <td className="p-4 text-yellow-600">€150+</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">🇺🇸 EUA/Canadá</td>
                  <td className="p-4 text-gray-700">10-15 dias</td>
                  <td className="p-4 text-gray-700">5-8 dias</td>
                  <td className="p-4 text-yellow-600">€120+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Special Handling */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            🎯 Manuseio Especial
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📦</div>
              <h4 className="font-semibold mb-2">Embalagem Premium</h4>
              <p className="text-sm text-purple-200">
                Caixa rígida com proteção anti-impacto e papel de seda
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">❄️</div>
              <h4 className="font-semibold mb-2">Controle Térmico</h4>
              <p className="text-sm text-purple-200">
                Material isolante para proteção contra variações de temperatura
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">💧</div>
              <h4 className="font-semibold mb-2">À Prova d'Água</h4>
              <p className="text-sm text-purple-200">
                Embalagem selada contra umidade e infiltrações
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🏷️</div>
              <h4 className="font-semibold mb-2">Etiquetagem Discreta</h4>
              <p className="text-sm text-purple-200">
                Embalagem neutra para total discrição na entrega
              </p>
            </div>
          </div>
        </div>

        {/* Tracking System */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📍 Sistema de Rastreamento
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">📱 Como Funciona</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Envio Confirmado</p>
                    <p className="text-sm text-gray-600">Receba o código de rastreamento via WhatsApp e email</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Em Trânsito</p>
                    <p className="text-sm text-gray-600">Acompanhe o progresso em tempo real no site da transportadora</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Saiu para Entrega</p>
                    <p className="text-sm text-gray-600">Notificação automática quando estiver a caminho</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Entregue</p>
                    <p className="text-sm text-gray-600">Confirmação de entrega com dados do recebedor</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">📊 Informações Disponíveis</h4>
              <div className="bg-gray-50 p-6 rounded-xl">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700">Status atual da encomenda</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700">Localização aproximada</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700">Data prevista de entrega</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700">Histórico de movimentações</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700">Tentativas de entrega</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✅</span>
                    <span className="text-gray-700">Instruções especiais</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            📞 Suporte de Entrega
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <h4 className="font-semibold mb-2">WhatsApp Direto</h4>
              <p className="text-sm text-gray-300 mb-4">
                Tire dúvidas sobre sua entrega em tempo real
              </p>
              <a
                href="https://wa.me/32470032758"
                target="_blank"
                className="inline-block bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Falar Agora
              </a>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">📧</div>
              <h4 className="font-semibold mb-2">Email Suporte</h4>
              <p className="text-sm text-gray-300 mb-4">
                Para questões complexas e documentação
              </p>
              <a
                href="mailto:entrega@jchairstudios62.xyz"
                className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Enviar Email
              </a>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🕒</div>
              <h4 className="font-semibold mb-2">Horário de Atendimento</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>Segunda a Sexta: 9h-18h</p>
                <p>Sábado: 9h-14h</p>
                <p>Domingo: Emergências</p>
                <p className="text-xs mt-2">Horário Central Europeu (CET)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}