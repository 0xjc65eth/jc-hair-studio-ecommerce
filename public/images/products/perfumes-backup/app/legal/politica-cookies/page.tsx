import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | 62 Beauty\'s 62',
  description: 'Política de Cookies em conformidade com a ePrivacy Directive e GDPR',
}

export default function PoliticaCookies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Política de Cookies
            </h1>
            <p className="text-gray-600 text-lg">
              <strong>Última atualização:</strong> 12 de setembro de 2025<br/>
              <strong>Versão:</strong> 2.0 - ePrivacy Directive Compliant<br/>
              <strong>Controlador:</strong> 62 Beauty's 62, Lda.
            </p>
          </header>

          <div className="space-y-8 text-gray-700 leading-7">
            
            {/* 1. O que são Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. O que são Cookies e Tecnologias Similares</h2>
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <p className="mb-4"><strong>Definição:</strong> Cookies são pequenos ficheiros de texto armazenados no seu dispositivo (computador, tablet, smartphone) quando visita um website.</p>
                <div className="space-y-3">
                  <p><strong>🍪 Cookies HTTP:</strong> Ficheiros de texto com informações sobre a sua navegação</p>
                  <p><strong>📱 Local Storage:</strong> Armazenamento local no browser para dados persistentes</p>
                  <p><strong>🔍 Pixels de Rastreamento:</strong> Imagens invisíveis que monitorizam comportamento</p>
                  <p><strong>📊 Web Beacons:</strong> Tecnologia para análise de tráfego e engagement</p>
                  <p><strong>🆔 Fingerprinting:</strong> Identificação através de características do dispositivo</p>
                </div>
              </div>
            </section>

            {/* 2. Base Legal */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Base Legal e Enquadramento Normativo</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-3">Legislação Aplicável</h3>
                  <ul className="space-y-2 text-sm">
                    <li><strong>ePrivacy Directive 2002/58/EC</strong> (revista 2009/136/EC)</li>
                    <li><strong>GDPR</strong> - Regulamento (UE) 2016/679</li>
                    <li><strong>Lei das Comunicações Electrónicas</strong> (Portugal)</li>
                    <li><strong>Orientações EDPB</strong> sobre cookies e outras tecnologias</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Princípios Fundamentais</h3>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Consentimento Informado:</strong> Deve ser livre, específico, informado e inequívoco</li>
                    <li><strong>Granularidade:</strong> Consentimento por categoria de cookies</li>
                    <li><strong>Retirada Fácil:</strong> Deve ser tão simples retirar como dar consentimento</li>
                    <li><strong>Transparência:</strong> Informação clara sobre finalidades</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Classificação de Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Classificação Técnica e Legal de Cookies</h2>
              
              <div className="space-y-6">
                {/* Cookies Técnicos */}
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-xl font-semibold text-green-800 mb-4">🔧 Cookies Técnicos (Estritamente Necessários)</h3>
                  <p className="font-semibold mb-3">BASE LEGAL: Interesse legítimo - Art. 6º(1)(f) GDPR | Isentos de consentimento</p>
                  
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-3 text-left">Nome</th>
                          <th className="border border-gray-300 p-3 text-left">Finalidade</th>
                          <th className="border border-gray-300 p-3 text-left">Duração</th>
                          <th className="border border-gray-300 p-3 text-left">Tipo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-3 font-mono text-sm">session_id</td>
                          <td className="border border-gray-300 p-3">Identificação de sessão do utilizador</td>
                          <td className="border border-gray-300 p-3">Sessão</td>
                          <td className="border border-gray-300 p-3">1ª Parte</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-3 font-mono text-sm">cart_contents</td>
                          <td className="border border-gray-300 p-3">Manutenção do carrinho de compras</td>
                          <td className="border border-gray-300 p-3">7 dias</td>
                          <td className="border border-gray-300 p-3">1ª Parte</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-mono text-sm">csrf_token</td>
                          <td className="border border-gray-300 p-3">Proteção contra ataques CSRF</td>
                          <td className="border border-gray-300 p-3">Sessão</td>
                          <td className="border border-gray-300 p-3">1ª Parte</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-3 font-mono text-sm">consent_choices</td>
                          <td className="border border-gray-300 p-3">Armazenar preferências de cookies</td>
                          <td className="border border-gray-300 p-3">1 ano</td>
                          <td className="border border-gray-300 p-3">1ª Parte</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-mono text-sm">language_pref</td>
                          <td className="border border-gray-300 p-3">Idioma selecionado pelo utilizador</td>
                          <td className="border border-gray-300 p-3">30 dias</td>
                          <td className="border border-gray-300 p-3">1ª Parte</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cookies Analíticos */}
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">📊 Cookies Analíticos e de Performance</h3>
                  <p className="font-semibold mb-3">BASE LEGAL: Consentimento - Art. 6º(1)(a) GDPR | Requer consentimento explícito</p>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-800 mb-2">Google Analytics 4 (GA4)</h4>
                      <p className="text-sm mb-2"><strong>Fornecedor:</strong> Google Ireland Limited</p>
                      <p className="text-sm mb-2"><strong>Finalidade:</strong> Análise de tráfego, comportamento dos utilizadores, otimização de performance</p>
                      <p className="text-sm mb-2"><strong>Transferência:</strong> Estados Unidos (Standard Contractual Clauses)</p>
                      <div className="grid md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-xs font-semibold">Cookies Principais:</p>
                          <ul className="text-xs space-y-1">
                            <li>• _ga (2 anos)</li>
                            <li>• _ga_XXXXXXXXXX (2 anos)</li>
                            <li>• _gid (24 horas)</li>
                            <li>• _gat_gtag_XXXXXXX (1 minuto)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold">Dados Processados:</p>
                          <ul className="text-xs space-y-1">
                            <li>• Identificadores únicos</li>
                            <li>• Páginas visitadas</li>
                            <li>• Tempo de sessão</li>
                            <li>• Origem do tráfego</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-800 mb-2">Hotjar (Opcional)</h4>
                      <p className="text-sm mb-2"><strong>Fornecedor:</strong> Hotjar Ltd. (Malta)</p>
                      <p className="text-sm mb-2"><strong>Finalidade:</strong> Mapas de calor, gravações de sessões, feedback dos utilizadores</p>
                      <p className="text-sm"><strong>Cookies:</strong> _hjSessionUser_* (1 ano), _hjSession_* (30 min)</p>
                    </div>
                  </div>
                </div>

                {/* Cookies de Marketing */}
                <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                  <h3 className="text-xl font-semibold text-orange-800 mb-4">📢 Cookies de Marketing e Publicidade</h3>
                  <p className="font-semibold mb-3">BASE LEGAL: Consentimento - Art. 6º(1)(a) GDPR | Requer consentimento explícito</p>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-800 mb-2">Meta Pixel (Facebook/Instagram)</h4>
                      <p className="text-sm mb-2"><strong>Finalidade:</strong> Remarketing, otimização de campanhas, audiences personalizadas</p>
                      <p className="text-sm mb-2"><strong>Cookies:</strong> _fbp (90 dias), _fbc (90 dias)</p>
                      <p className="text-sm"><strong>Transferência:</strong> Estados Unidos (Adequacy Decision)</p>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-800 mb-2">Google Ads / Google Tag Manager</h4>
                      <p className="text-sm mb-2"><strong>Finalidade:</strong> Conversões, remarketing, campanhas direcionadas</p>
                      <p className="text-sm mb-2"><strong>Cookies:</strong> _gcl_au (90 dias), _gac_* (90 dias)</p>
                      <p className="text-sm"><strong>Transferência:</strong> Estados Unidos (Standard Contractual Clauses)</p>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-800 mb-2">Email Marketing (Mailchimp)</h4>
                      <p className="text-sm mb-2"><strong>Finalidade:</strong> Rastreamento de aberturas de email, cliques, engagement</p>
                      <p className="text-sm mb-2"><strong>Cookies:</strong> _mcid (2 anos)</p>
                      <p className="text-sm"><strong>Transferência:</strong> Estados Unidos (Privacy Shield)</p>
                    </div>
                  </div>
                </div>

                {/* Cookies de Personalização */}
                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">🎯 Cookies de Personalização</h3>
                  <p className="font-semibold mb-3">BASE LEGAL: Consentimento - Art. 6º(1)(a) GDPR | Requer consentimento explícito</p>
                  
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-gray-800 mb-2">Preferências do Utilizador</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold mb-1">Funcionalidades:</p>
                        <ul className="text-sm space-y-1">
                          <li>• Produtos visualizados recentemente</li>
                          <li>• Lista de desejos</li>
                          <li>• Recomendações personalizadas</li>
                          <li>• Preferências de navegação</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Cookies:</p>
                        <ul className="text-sm space-y-1">
                          <li>• recent_products (30 dias)</li>
                          <li>• wishlist_items (90 dias)</li>
                          <li>• user_preferences (1 ano)</li>
                          <li>• recommendation_data (60 dias)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Gestão de Consentimento */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Gestão de Consentimento e Preferências</h2>
              
              <div className="space-y-6">
                <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
                  <h3 className="font-semibold text-indigo-800 mb-3">4.1. Banner de Consentimento</h3>
                  <p className="mb-4">Implementamos um sistema de gestão de consentimento (CMP) que cumpre os requisitos do GDPR e ePrivacy:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Características:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Consentimento granular por categoria</li>
                        <li>• Informação clara sobre finalidades</li>
                        <li>• Opção de rejeitar todos os cookies não essenciais</li>
                        <li>• Acesso fácil às definições</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Funcionalidades:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Guardar preferências por 12 meses</li>
                        <li>• Re-consentimento após atualizações</li>
                        <li>• Logs de consentimento para auditoria</li>
                        <li>• Interface multilíngue</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">4.2. Centro de Preferências</h3>
                  <div className="space-y-4">
                    <p>Pode gerir as suas preferências de cookies a qualquer momento através do nosso Centro de Preferências:</p>
                    <div className="bg-white p-4 rounded border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Gerir Cookies</h4>
                        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                          Abrir Preferências
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Aceda às definições avançadas para controlar individualmente cada categoria de cookies
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-yellow-800 mb-3">4.3. Retirada de Consentimento</h3>
                  <p className="mb-3"><strong>Tem o direito de retirar o consentimento a qualquer momento, sendo tão fácil quanto foi dar o consentimento inicial.</strong></p>
                  <div className="space-y-2">
                    <p><strong>Métodos disponíveis:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Centro de Preferências no website</li>
                      <li>Email para privacy@jchairstudio62.com</li>
                      <li>Configurações do browser (delete de cookies)</li>
                      <li>Opt-out direto nos fornecedores terceiros</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Cookies de Terceiros */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cookies de Terceiros e Transferências Internacionais</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left">Fornecedor</th>
                      <th className="border border-gray-300 p-3 text-left">Finalidade</th>
                      <th className="border border-gray-300 p-3 text-left">Localização</th>
                      <th className="border border-gray-300 p-3 text-left">Salvaguardas</th>
                      <th className="border border-gray-300 p-3 text-left">Opt-out</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Google Analytics</td>
                      <td className="border border-gray-300 p-3">Análise web</td>
                      <td className="border border-gray-300 p-3">EUA</td>
                      <td className="border border-gray-300 p-3">SCC + Adequacy Decision</td>
                      <td className="border border-gray-300 p-3">
                        <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:text-blue-800 text-sm">Opt-out GA</a>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Meta (Facebook)</td>
                      <td className="border border-gray-300 p-3">Marketing</td>
                      <td className="border border-gray-300 p-3">EUA</td>
                      <td className="border border-gray-300 p-3">Adequacy Decision</td>
                      <td className="border border-gray-300 p-3">
                        <a href="https://www.facebook.com/settings?tab=ads" className="text-blue-600 hover:text-blue-800 text-sm">FB Ads Settings</a>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Mailchimp</td>
                      <td className="border border-gray-300 p-3">Email marketing</td>
                      <td className="border border-gray-300 p-3">EUA</td>
                      <td className="border border-gray-300 p-3">Privacy Shield + SCC</td>
                      <td className="border border-gray-300 p-3">
                        <a href="mailto:unsubscribe@jchairstudio62.com" className="text-blue-600 hover:text-blue-800 text-sm">Unsubscribe</a>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Hotjar</td>
                      <td className="border border-gray-300 p-3">UX análise</td>
                      <td className="border border-gray-300 p-3">Malta (UE)</td>
                      <td className="border border-gray-300 p-3">Adequacy (UE)</td>
                      <td className="border border-gray-300 p-3">
                        <a href="https://www.hotjar.com/legal/compliance/opt-out" className="text-blue-600 hover:text-blue-800 text-sm">Hotjar Opt-out</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <p className="font-semibold text-blue-800 mb-2">Informação sobre Transferências:</p>
                <ul className="text-sm space-y-1">
                  <li><strong>SCC:</strong> Standard Contractual Clauses - Cláusulas contratuais padrão aprovadas pela Comissão Europeia</li>
                  <li><strong>Adequacy Decision:</strong> Países reconhecidos pela UE como tendo proteção adequada de dados</li>
                  <li><strong>Privacy Shield:</strong> Programa de certificação para empresas americanas (substituído por medidas adicionais)</li>
                </ul>
              </div>
            </section>

            {/* 6. Controle pelo Browser */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Controle de Cookies através do Browser</h2>
              
              <p className="mb-6">Para além das nossas ferramentas de gestão, pode controlar cookies diretamente através do seu browser:</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">🌐 Chrome</h3>
                    <p className="text-sm">Definições → Privacidade e segurança → Cookies e outros dados de sites</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">🦊 Firefox</h3>
                    <p className="text-sm">Preferências → Privacidade e segurança → Cookies e dados de sites</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">🧭 Safari</h3>
                    <p className="text-sm">Preferências → Privacidade → Gerir dados de websites</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">⚡ Edge</h3>
                    <p className="text-sm">Definições → Cookies e permissões de site → Gerir e eliminar cookies</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">🔒 Navegação Privada</h3>
                    <p className="text-sm">Todos os browsers oferecem modo privado/incógnito que não armazena cookies</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">🛡️ Do Not Track</h3>
                    <p className="text-sm">Sinal enviado pelo browser indicando preferência por não rastreamento</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg mt-6 border-l-4 border-yellow-500">
                <h3 className="font-semibold text-yellow-800 mb-3">⚠️ Impacto da Desativação de Cookies</h3>
                <p className="mb-3">Desativar cookies pode afetar a funcionalidade do website:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-red-700">Funcionalidades que podem ser afetadas:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Manutenção do carrinho de compras</li>
                      <li>• Login automático</li>
                      <li>• Preferências guardadas</li>
                      <li>• Personalização de conteúdo</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-green-700">Funcionalidades que continuam a funcionar:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Navegação no website</li>
                      <li>• Visualização de produtos</li>
                      <li>• Processo de checkout (sessão única)</li>
                      <li>• Contacto e suporte</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Direitos do Utilizador */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Direitos do Utilizador e Proteção de Dados</h2>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-800 mb-4">Os seus direitos relativamente aos cookies:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">🔍 Direito à Informação</h4>
                    <p className="text-sm mb-3">Informações claras sobre que cookies utilizamos e porquê</p>
                    
                    <h4 className="font-semibold mb-2">✅ Direito ao Consentimento</h4>
                    <p className="text-sm mb-3">Consentimento livre, específico e informado</p>

                    <h4 className="font-semibold mb-2">🚫 Direito de Recusa</h4>
                    <p className="text-sm">Pode recusar cookies não essenciais sem impacto na navegação básica</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🔄 Direito de Retirada</h4>
                    <p className="text-sm mb-3">Retirar consentimento a qualquer momento de forma simples</p>
                    
                    <h4 className="font-semibold mb-2">📋 Direito de Acesso</h4>
                    <p className="text-sm mb-3">Informações sobre quais dados foram coletados via cookies</p>

                    <h4 className="font-semibold mb-2">🗑️ Direito ao Apagamento</h4>
                    <p className="text-sm">Eliminação de dados coletados através de cookies</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white rounded border-l-4 border-blue-500">
                  <p className="font-semibold">📧 Para exercer os seus direitos:</p>
                  <p>Contacte-nos através de: <a href="mailto:privacy@jchairstudio62.com" className="text-purple-600 hover:text-purple-800">privacy@jchairstudio62.com</a></p>
                  <p className="text-sm text-gray-600 mt-2">Resposta garantida em 30 dias</p>
                </div>
              </div>
            </section>

            {/* 8. Crianças e Adolescentes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Proteção de Crianças e Adolescentes</h2>
              
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-3">🧒 Política de Idade Mínima</h3>
                <div className="space-y-3">
                  <p><strong>Idade mínima para consentimento:</strong> 16 anos (conforme Art. 8º GDPR)</p>
                  <p><strong>Menores de 16 anos:</strong> Requerem autorização dos pais/tutores legais</p>
                  <p><strong>Verificação:</strong> Solicitamos confirmação de idade em processo de registo</p>
                  <p><strong>Detecção:</strong> Se identificarmos dados de menores sem autorização, procederemos à eliminação imediata</p>
                </div>
              </div>
            </section>

            {/* 9. Atualizações */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Atualizações e Alterações</h2>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">9.1. Política de Atualizações</h3>
                <div className="space-y-3">
                  <p><strong>Revisões regulares:</strong> Esta política é revista trimestralmente</p>
                  <p><strong>Alterações substanciais:</strong> Notificadas por banner no website e email</p>
                  <p><strong>Novos cookies:</strong> Requerão novo consentimento se não essenciais</p>
                  <p><strong>Histórico de versões:</strong> Disponível mediante pedido</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">9.2. Notificação de Mudanças</h3>
                <p>Será notificado sobre alterações através de:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Banner informativo no topo do website</li>
                  <li>Email para utilizadores registados</li>
                  <li>Atualização da data no topo desta política</li>
                  <li>Novo pedido de consentimento se aplicável</li>
                </ul>
              </div>
            </section>

            {/* 10. Contactos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contactos e Suporte</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">🔐 Data Protection Officer</h3>
                  <p><strong>Email:</strong> privacy@jchairstudio62.com</p>
                  <p><strong>Assunto:</strong> [COOKIES] - Sua questão</p>
                  <p><strong>Resposta:</strong> Máximo 72 horas</p>
                  <p className="text-sm mt-3">Especialista em questões relacionadas com cookies e proteção de dados</p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">🛠️ Suporte Técnico</h3>
                  <p><strong>Email:</strong> suporte@jchairstudio62.com</p>
                  <p><strong>Telefone:</strong> [Número de contacto]</p>
                  <p><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</p>
                  <p className="text-sm mt-3">Apoio na gestão de preferências de cookies e problemas técnicos</p>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg mt-6">
                <h3 className="font-semibold text-purple-800 mb-3">🏛️ Autoridades de Supervisão</h3>
                <p>Se considera que os seus direitos não estão a ser respeitados:</p>
                <div className="mt-3 space-y-2">
                  <p><strong>Portugal:</strong> CNPD - Comissão Nacional de Proteção de Dados</p>
                  <p><strong>Website:</strong> cnpd.pt</p>
                  <p><strong>Email:</strong> geral@cnpd.pt</p>
                  <p><strong>UE:</strong> Pode contactar a autoridade do seu país de residência</p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t pt-8 mt-10">
              <div className="bg-gradient-to-r from-blue-800 to-purple-800 text-white p-6 rounded-lg">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">🍪 Compromisso com a Transparência</h3>
                  <p className="text-sm">
                    Esta Política de Cookies foi desenvolvida para garantir total transparência sobre como utilizamos cookies e tecnologias similares, 
                    em pleno cumprimento da ePrivacy Directive e GDPR.
                  </p>
                  <div className="border-t border-blue-300 pt-4 space-y-2">
                    <p className="text-sm">© 2025 62 Beauty's 62, Lda. | Todos os direitos reservados</p>
                    <p className="text-xs">ePrivacy Directive Compliant | GDPR Compliant | Versão 2.0</p>
                    <div className="flex justify-center space-x-4 text-xs">
                      <button className="hover:text-blue-200 transition-colors">Gerir Cookies</button>
                      <span>|</span>
                      <a href="/legal/politica-privacidade" className="hover:text-blue-200 transition-colors">Política de Privacidade</a>
                      <span>|</span>
                      <a href="/legal/termos-uso" className="hover:text-blue-200 transition-colors">Termos de Uso</a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}