import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade | 62 Beauty\'s 62',
  description: 'Política de Privacidade em conformidade com o GDPR e proteção de dados pessoais',
}

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Política de Privacidade
            </h1>
            <p className="text-gray-600 text-lg">
              <strong>Última atualização:</strong> 12 de setembro de 2025<br/>
              <strong>Versão:</strong> 2.1 - GDPR Compliant<br/>
              <strong>Controlador de Dados:</strong> 62 Beauty's 62
            </p>
          </header>

          <div className="space-y-8 text-gray-700 leading-7">
            
            {/* 1. Identificação do Controlador */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Identificação do Controlador de Dados</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p><strong>Denominação Social:</strong> 62 Beauty's 62, Lda.</p>
                <p><strong>NIPC/NIF:</strong> [A completar com número oficial]</p>
                <p><strong>Morada:</strong> [Endereço completo em Portugal]</p>
                <p><strong>Email de Contacto:</strong> info@jchairstudio62.com</p>
                <p><strong>Data Protection Officer (DPO):</strong> privacy@jchairstudio62.com</p>
                <p><strong>Representante na UE:</strong> 62 Beauty's 62, Lda.</p>
              </div>
            </section>

            {/* 2. Base Legal */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Base Legal para Processamento (Art. 6º GDPR)</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold">a) Consentimento (Art. 6º, n.º 1, alínea a)</h3>
                  <p>Para marketing direto, newsletters, cookies não essenciais e comunicações promocionais.</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold">b) Execução de Contrato (Art. 6º, n.º 1, alínea b)</h3>
                  <p>Para processamento de encomendas, entrega de produtos, atendimento ao cliente e gestão de garantias.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold">c) Interesse Legítimo (Art. 6º, n.º 1, alínea f)</h3>
                  <p>Para análise de fraude, segurança da plataforma, melhoramento dos serviços e comunicações transacionais.</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold">d) Cumprimento de Obrigação Legal (Art. 6º, n.º 1, alínea c)</h3>
                  <p>Para contabilidade, faturação, reporting fiscal e cumprimento de regulamentações aplicáveis.</p>
                </div>
              </div>
            </section>

            {/* 3. Dados Coletados */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Categorias de Dados Pessoais Coletados</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-purple-700">3.1. Dados de Identificação</h3>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Nome completo, email, número de telefone</li>
                <li>Endereço de faturação e entrega</li>
                <li>Data de nascimento (opcional, para ofertas personalizadas)</li>
                <li>Número de identificação fiscal (se aplicável)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-purple-700">3.2. Dados de Navegação e Comportamento</h3>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Endereço IP, user agent, localização aproximada</li>
                <li>Cookies, pixels de rastreamento, identificadores únicos</li>
                <li>Histórico de navegação, produtos visualizados, pesquisas</li>
                <li>Interações com emails e campanhas de marketing</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-purple-700">3.3. Dados Transacionais</h3>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Histórico de compras, métodos de pagamento</li>
                <li>Dados de cartão (tokenizados pelo processador)</li>
                <li>Valor das transações, datas, produtos adquiridos</li>
                <li>Comunicações de suporte ao cliente</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-purple-700">3.4. Dados Sensíveis</h3>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-semibold text-red-700">ATENÇÃO: Não coletamos intencionalmente dados sensíveis</p>
                <p>Caso sejam fornecidos inadvertidamente (por exemplo, em comunicações), serão processados apenas pelo tempo necessário e depois eliminados, salvo obrigação legal contrária.</p>
              </div>
            </section>

            {/* 4. Finalidades */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Finalidades do Processamento</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Gestão Comercial</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Processamento de encomendas</li>
                    <li>Gestão de stocks e entregas</li>
                    <li>Atendimento ao cliente e suporte</li>
                    <li>Gestão de devoluções e garantias</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Marketing e Comunicação</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Newsletters e ofertas personalizadas</li>
                    <li>Campanhas promocionais segmentadas</li>
                    <li>Remarketing e publicidade direcionada</li>
                    <li>Análise de comportamento do consumidor</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Segurança e Fraude</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Prevenção de atividades fraudulentas</li>
                    <li>Segurança da plataforma e dados</li>
                    <li>Monitorização de atividades suspeitas</li>
                    <li>Cumprimento de obrigações legais</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Análise e Melhoria</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Analytics e estatísticas de uso</li>
                    <li>Otimização da experiência do usuário</li>
                    <li>Desenvolvimento de novos produtos</li>
                    <li>Estudos de mercado e tendências</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. Período de Retenção */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Período de Retenção de Dados</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left">Categoria de Dados</th>
                      <th className="border border-gray-300 p-3 text-left">Período de Retenção</th>
                      <th className="border border-gray-300 p-3 text-left">Base Legal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Dados de clientes ativos</td>
                      <td className="border border-gray-300 p-3">Durante a relação comercial + 3 anos</td>
                      <td className="border border-gray-300 p-3">Interesse legítimo</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Dados de faturação/contabilidade</td>
                      <td className="border border-gray-300 p-3">10 anos</td>
                      <td className="border border-gray-300 p-3">Obrigação legal</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Dados de marketing (com consentimento)</td>
                      <td className="border border-gray-300 p-3">Até retirada do consentimento</td>
                      <td className="border border-gray-300 p-3">Consentimento</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Logs de segurança</td>
                      <td className="border border-gray-300 p-3">12 meses</td>
                      <td className="border border-gray-300 p-3">Interesse legítimo</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Dados de menores</td>
                      <td className="border border-gray-300 p-3">Eliminação imediata se detetados</td>
                      <td className="border border-gray-300 p-3">Proteção especial</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. Direitos dos Titulares */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Direitos dos Titulares dos Dados (Capítulo III GDPR)</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="font-semibold mb-4">Tem o direito de exercer os seguintes direitos gratuitamente:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-purple-700">🔍 Direito de Acesso (Art. 15º)</h3>
                    <p className="text-sm">Obter confirmação e cópia dos seus dados pessoais</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-700">✏️ Direito de Retificação (Art. 16º)</h3>
                    <p className="text-sm">Corrigir dados inexatos ou incompletos</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-700">🗑️ Direito ao Apagamento (Art. 17º)</h3>
                    <p className="text-sm">"Direito ao esquecimento" em certas circunstâncias</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-700">⏸️ Direito à Limitação (Art. 18º)</h3>
                    <p className="text-sm">Restringir o processamento dos seus dados</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-700">📱 Direito à Portabilidade (Art. 20º)</h3>
                    <p className="text-sm">Transferir dados para outro controlador</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-700">❌ Direito de Oposição (Art. 21º)</h3>
                    <p className="text-sm">Opor-se ao processamento baseado em interesse legítimo</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white rounded border-l-4 border-purple-500">
                  <p className="font-semibold">📧 Como exercer os seus direitos:</p>
                  <p>Email: <a href="mailto:privacy@jchairstudio62.com" className="text-purple-600 hover:text-purple-800">privacy@jchairstudio62.com</a></p>
                  <p className="text-sm text-gray-600 mt-2">Resposta garantida em 30 dias (prorrogável por mais 60 dias em casos complexos)</p>
                </div>
              </div>
            </section>

            {/* 7. Transferências Internacionais */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Transferências Internacionais e Salvaguardas</h2>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800">Países com Decisão de Adequação</h3>
                  <p>Transferimos dados para países considerados seguros pela Comissão Europeia (Reino Unido, Suíça, etc.)</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-yellow-800">Países Terceiros com Salvaguardas</h3>
                  <p><strong>Estados Unidos:</strong> Processadores certificados Privacy Shield/Standard Contractual Clauses</p>
                  <p><strong>Brasil:</strong> Cláusulas contratuais padrão aprovadas pela Comissão Europeia</p>
                  <p><strong>Outros:</strong> Binding Corporate Rules ou Cláusulas Contratuais Padrão (SCC)</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Fornecedores Internacionais Principais:</h3>
                  <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                    <li>Google Analytics (Privacy Shield Framework)</li>
                    <li>Stripe/PayPal (Standard Contractual Clauses)</li>
                    <li>Mailchimp (Privacy Shield Framework)</li>
                    <li>AWS/Azure (Standard Contractual Clauses)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 8. Medidas de Segurança */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Medidas de Segurança Implementadas</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-800">🔒 Técnicas</h3>
                  <ul className="text-sm space-y-1">
                    <li>Criptografia TLS 1.3</li>
                    <li>Hashing de passwords</li>
                    <li>Tokenização de dados de pagamento</li>
                    <li>Firewall e monitorização 24/7</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-800">👥 Organizacionais</h3>
                  <ul className="text-sm space-y-1">
                    <li>Formação em proteção de dados</li>
                    <li>Controlos de acesso baseados em funções</li>
                    <li>Auditorias regulares de segurança</li>
                    <li>Planos de resposta a incidentes</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-800">📋 Físicas</h3>
                  <ul className="text-sm space-y-1">
                    <li>Data centers certificados ISO 27001</li>
                    <li>Controlo de acesso físico</li>
                    <li>Backups encriptados</li>
                    <li>Destruição segura de dados</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 9. Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Cookies e Tecnologias Similares</h2>
              <p>Utilizamos cookies e tecnologias similares conforme descrito na nossa <a href="/legal/politica-cookies" className="text-purple-600 hover:text-purple-800 underline">Política de Cookies</a> dedicada.</p>
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <p className="font-semibold">Gestão de Cookies:</p>
                <p>Pode gerir as suas preferências através do banner de consentimento ou nas definições do seu browser.</p>
              </div>
            </section>

            {/* 10. Menores */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Proteção de Menores de 16 Anos</h2>
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-2">Política de Idade Mínima</h3>
                <p className="mb-4">Os nossos serviços destinam-se exclusivamente a pessoas com 16 anos ou mais, conforme o Art. 8º do GDPR.</p>
                <div className="space-y-2">
                  <p><strong>🚫 Proibição:</strong> Não coletamos intencionalmente dados de menores de 16 anos</p>
                  <p><strong>🔍 Deteção:</strong> Se identificarmos dados de menores, procederemos à eliminação imediata</p>
                  <p><strong>👨‍👩‍👧‍👦 Responsabilidade Parental:</strong> Pais/tutores devem supervisionar o acesso dos menores</p>
                  <p><strong>📞 Reporte:</strong> Contacte-nos se suspeitar de utilização por menores</p>
                </div>
              </div>
            </section>

            {/* 11. DPO e Contactos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Data Protection Officer e Contactos</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-purple-800">📧 Data Protection Officer</h3>
                  <p><strong>Email:</strong> privacy@jchairstudio62.com</p>
                  <p><strong>Resposta:</strong> Máximo 72 horas úteis</p>
                  <p><strong>Competências:</strong></p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Exercício de direitos GDPR</li>
                    <li>• Reclamações sobre proteção de dados</li>
                    <li>• Questões sobre esta política</li>
                    <li>• Incidentes de segurança</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-blue-800">🏛️ Autoridades de Supervisão</h3>
                  <p><strong>Portugal:</strong> Comissão Nacional de Proteção de Dados (CNPD)</p>
                  <p><strong>Website:</strong> cnpd.pt</p>
                  <p><strong>Email:</strong> geral@cnpd.pt</p>
                  <p className="text-sm mt-3 font-semibold">Tem o direito de apresentar reclamação se considerar que os seus dados não estão a ser processados em conformidade com o GDPR.</p>
                </div>
              </div>
            </section>

            {/* 12. Breach Notification */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Notificação de Violações de Dados</h2>
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h3 className="font-semibold text-orange-800">Procedimento em Caso de Incidente</h3>
                  <p>Em caso de violação de dados que possa representar risco para os seus direitos e liberdades:</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">⏱️ Prazo de Notificação</h4>
                    <p className="text-sm">• Autoridades: 72 horas</p>
                    <p className="text-sm">• Titulares: Sem demora injustificada</p>
                  </div>
                  <div className="bg-white p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">📋 Informação Fornecida</h4>
                    <p className="text-sm">• Natureza da violação</p>
                    <p className="text-sm">• Medidas tomadas</p>
                    <p className="text-sm">• Recomendações de proteção</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 13. Alterações */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Alterações a Esta Política</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="mb-4">Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças legais ou operacionais.</p>
                <div className="space-y-2">
                  <p><strong>📅 Notificação:</strong> Alterações substanciais serão comunicadas por email e/ou banner no website</p>
                  <p><strong>⏰ Prazo:</strong> Entrada em vigor 30 dias após notificação</p>
                  <p><strong>📖 Histórico:</strong> Versões anteriores disponíveis mediante pedido</p>
                  <p><strong>✅ Novo Consentimento:</strong> Pode ser solicitado para alterações materiais</p>
                </div>
              </div>
            </section>

            {/* 14. Lei Aplicável */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Lei Aplicável e Jurisdição</h2>
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <p><strong>Lei Aplicável:</strong> Regulamento (UE) 2016/679 (GDPR) e legislação portuguesa complementar</p>
                <p><strong>Jurisdição:</strong> Tribunais portugueses para resolução de litígios</p>
                <p><strong>Direitos Irrenunciáveis:</strong> Esta cláusula não prejudica os direitos imperartivos do consumidor</p>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t pt-6 mt-8">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Para questões sobre esta Política de Privacidade: <a href="mailto:privacy@jchairstudio62.com" className="text-purple-600 hover:text-purple-800">privacy@jchairstudio62.com</a>
                </p>
                <p className="text-xs text-gray-500">
                  © 2025 62 Beauty's 62, Lda. Todos os direitos reservados. | GDPR Compliant
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}