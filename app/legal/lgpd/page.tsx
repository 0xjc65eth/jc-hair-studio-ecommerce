import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política LGPD | JC Hair Studio\'s 62',
  description: 'Conformidade com a Lei Geral de Proteção de Dados do Brasil para clientes brasileiros',
}

export default function LGPD() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-600 text-white p-3 rounded-full">
                🇧🇷
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Política LGPD
                </h1>
                <p className="text-xl text-gray-600">Lei Geral de Proteção de Dados</p>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              <strong>Última atualização:</strong> 12 de setembro de 2025<br/>
              <strong>Versão:</strong> 1.0 - LGPD Compliant<br/>
              <strong>Lei de Referência:</strong> Lei nº 13.709/2018 (LGPD)<br/>
              <strong>Controlador:</strong> JC Hair Studio's 62, Lda.
            </p>
          </header>

          <div className="space-y-8 text-gray-700 leading-7">
            
            {/* 1. Apresentação e Escopo */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Apresentação e Âmbito de Aplicação</h2>
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <p className="font-semibold text-green-800 mb-4">COMPROMISSO COM A PROTEÇÃO DE DADOS PESSOAIS DOS BRASILEIROS</p>
                <div className="space-y-3">
                  <p><strong>1.1. APLICABILIDADE:</strong> Esta política aplica-se especificamente ao tratamento de dados pessoais de residentes no Brasil, em cumprimento da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
                  <p><strong>1.2. CONTROLADOR:</strong> JC Hair Studio's 62, Lda., empresa portuguesa que opera e-commerce internacional, atua como controlador de dados para clientes brasileiros.</p>
                  <p><strong>1.3. TRATAMENTO TRANSFRONTEIRIÇO:</strong> Os dados coletados no Brasil são transferidos e processados em Portugal (União Europeia), país com nível adequado de proteção segundo a ANPD.</p>
                  <p><strong>1.4. COMPLEMENTARIDADE:</strong> Esta política complementa nossa <a href="/legal/politica-privacidade" className="text-green-600 hover:text-green-800 underline">Política de Privacidade GDPR</a>, oferecendo proteções específicas aos titulares brasileiros.</p>
                </div>
              </div>
            </section>

            {/* 2. Definições LGPD */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Definições Conforme a LGPD</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">📊 Dados Pessoais</h3>
                    <p className="text-sm">Informação relacionada a pessoa natural identificada ou identificável (Art. 5º, I).</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">🔒 Dados Sensíveis</h3>
                    <p className="text-sm">Origem racial, convicções religiosas, opiniões políticas, saúde, vida sexual, dados biométricos ou genéticos (Art. 5º, II).</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">👤 Titular</h3>
                    <p className="text-sm">Pessoa natural a quem se referem os dados pessoais que são objeto de tratamento (Art. 5º, V).</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">🏢 Controlador</h3>
                    <p className="text-sm">Pessoa natural ou jurídica responsável pelas decisões referentes ao tratamento de dados pessoais (Art. 5º, VI).</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-800 mb-2">⚙️ Tratamento</h3>
                    <p className="text-sm">Operação realizada com dados pessoais: coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação, controle, modificação, comunicação, transferência, difusão ou extração (Art. 5º, X).</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">🛡️ Encarregado (DPO)</h3>
                    <p className="text-sm">Pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a ANPD (Art. 5º, VIII).</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Bases Legais LGPD */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Bases Legais para Tratamento (Art. 7º da LGPD)</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">I - Consentimento do Titular</h3>
                  <p className="mb-3"><strong>Aplicação:</strong> Marketing direto, newsletters, cookies não essenciais, comunicações promocionais</p>
                  <div className="bg-white p-4 rounded border">
                    <p className="font-semibold mb-2">Características do Consentimento:</p>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Livre:</strong> Sem coação ou pressão</li>
                      <li>• <strong>Informado:</strong> Finalidades claras e específicas</li>
                      <li>• <strong>Inequívoco:</strong> Manifestação expressa de vontade</li>
                      <li>• <strong>Específico:</strong> Para finalidades determinadas</li>
                      <li>• <strong>Destacado:</strong> Separado de outros termos</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-xl font-semibold text-green-800 mb-3">II - Cumprimento de Obrigação Legal</h3>
                  <p><strong>Aplicação:</strong> Emissão de notas fiscais, obrigações tributárias, registros contábeis, cumprimento de determinações judiciais e regulatórias brasileiras</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                  <h3 className="text-xl font-semibold text-purple-800 mb-3">VI - Execução de Contrato</h3>
                  <p><strong>Aplicação:</strong> Processamento de pedidos, entrega de produtos, atendimento ao cliente, gestão de garantias e devoluções</p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                  <h3 className="text-xl font-semibold text-orange-800 mb-3">IX - Interesse Legítimo</h3>
                  <p className="mb-3"><strong>Aplicação:</strong> Prevenção de fraudes, segurança da plataforma, melhorias no serviço</p>
                  <div className="bg-white p-4 rounded border text-sm">
                    <p><strong>Teste de Balanceamento:</strong> Sempre avaliamos se nosso interesse legítimo não prejudica seus direitos fundamentais</p>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                  <h3 className="text-xl font-semibold text-red-800 mb-3">🚫 Dados Sensíveis - Proteção Especial</h3>
                  <div className="space-y-3">
                    <p><strong>POLÍTICA:</strong> Não coletamos intencionalmente dados sensíveis</p>
                    <p><strong>SE COLETADOS INADVERTIDAMENTE:</strong> Eliminação imediata ou tratamento apenas com consentimento específico e destacado</p>
                    <p><strong>BASES PARA DADOS SENSÍVEIS (Art. 11):</strong> Consentimento específico, cumprimento de obrigação legal, políticas públicas, estudos por órgão de pesquisa, exercício de direitos em processo judicial</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Dados Tratados */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Categorias de Dados Pessoais Tratados</h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Dados Coletados de Clientes Brasileiros</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-3 text-blue-700">Dados de Identificação</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Nome completo</li>
                        <li>• Email e telefone</li>
                        <li>• CPF (quando fornecido)</li>
                        <li>• Data de nascimento (opcional)</li>
                        <li>• Endereços de entrega e faturação</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-3 text-green-700">Dados Transacionais</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Histórico de compras</li>
                        <li>• Dados de cartão (tokenizados)</li>
                        <li>• Valor e frequência de transações</li>
                        <li>• Métodos de pagamento utilizados</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-3 text-purple-700">Dados de Navegação</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Endereço IP (localização aproximada)</li>
                        <li>• Cookies e identificadores únicos</li>
                        <li>• Páginas visitadas e produtos visualizados</li>
                        <li>• Interações com emails marketing</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-3 text-orange-700">Dados de Comunicação</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Mensagens de suporte ao cliente</li>
                        <li>• Avaliações e comentários</li>
                        <li>• Preferências de comunicação</li>
                        <li>• Histórico de atendimento</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Finalidades do Tratamento */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Finalidades do Tratamento e Período de Retenção</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left">Finalidade</th>
                      <th className="border border-gray-300 p-3 text-left">Base Legal (Art. 7º)</th>
                      <th className="border border-gray-300 p-3 text-left">Dados Utilizados</th>
                      <th className="border border-gray-300 p-3 text-left">Retenção</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Processamento de pedidos</td>
                      <td className="border border-gray-300 p-3">Execução de contrato (VI)</td>
                      <td className="border border-gray-300 p-3">Identificação, pagamento, endereço</td>
                      <td className="border border-gray-300 p-3">5 anos (CDC)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Emissão de notas fiscais</td>
                      <td className="border border-gray-300 p-3">Obrigação legal (II)</td>
                      <td className="border border-gray-300 p-3">CPF, endereço, dados da compra</td>
                      <td className="border border-gray-300 p-3">5 anos (legislação fiscal)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Marketing e newsletters</td>
                      <td className="border border-gray-300 p-3">Consentimento (I)</td>
                      <td className="border border-gray-300 p-3">Email, preferências, histórico</td>
                      <td className="border border-gray-300 p-3">Até revogação do consentimento</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3">Prevenção de fraudes</td>
                      <td className="border border-gray-300 p-3">Interesse legítimo (IX)</td>
                      <td className="border border-gray-300 p-3">Dados transacionais, IP, device</td>
                      <td className="border border-gray-300 p-3">3 anos após último uso</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Atendimento ao cliente</td>
                      <td className="border border-gray-300 p-3">Execução de contrato (VI)</td>
                      <td className="border border-gray-300 p-3">Identificação, histórico, comunicações</td>
                      <td className="border border-gray-300 p-3">3 anos após resolução</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. Direitos dos Titulares */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Direitos dos Titulares de Dados (Art. 18 da LGPD)</h2>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800 mb-4">VOCÊ TEM OS SEGUINTES DIREITOS GARANTIDOS PELA LGPD:</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border-l-4 border-blue-400">
                      <h4 className="font-semibold text-blue-700 mb-2">I - Confirmação de Tratamento</h4>
                      <p className="text-sm">Confirmar se tratamos os seus dados pessoais</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded border-l-4 border-green-400">
                      <h4 className="font-semibold text-green-700 mb-2">II - Acesso aos Dados</h4>
                      <p className="text-sm">Obter cópia dos seus dados pessoais tratados</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded border-l-4 border-purple-400">
                      <h4 className="font-semibold text-purple-700 mb-2">III - Correção de Dados</h4>
                      <p className="text-sm">Corrigir dados incompletos, inexatos ou desatualizados</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded border-l-4 border-yellow-400">
                      <h4 className="font-semibold text-yellow-700 mb-2">IV - Anonimização/Bloqueio</h4>
                      <p className="text-sm">Anonimização ou bloqueio de dados desnecessários</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border-l-4 border-red-400">
                      <h4 className="font-semibold text-red-700 mb-2">V - Eliminação</h4>
                      <p className="text-sm">Eliminar dados tratados com consentimento</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded border-l-4 border-indigo-400">
                      <h4 className="font-semibold text-indigo-700 mb-2">VI - Portabilidade</h4>
                      <p className="text-sm">Transferir dados para outro fornecedor</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded border-l-4 border-pink-400">
                      <h4 className="font-semibold text-pink-700 mb-2">VII - Informações Compartilhadas</h4>
                      <p className="text-sm">Saber com quem compartilhamos seus dados</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded border-l-4 border-orange-400">
                      <h4 className="font-semibold text-orange-700 mb-2">VIII - Revogação do Consentimento</h4>
                      <p className="text-sm">Retirar consentimento a qualquer momento</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 mb-2">Como Exercer Seus Direitos:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>📧 Email:</strong> lgpd@jchairstudio62.com</p>
                      <p><strong>📋 Formulário:</strong> Disponível no website</p>
                      <p><strong>📞 Telefone:</strong> [Número específico para LGPD]</p>
                    </div>
                    <div>
                      <p><strong>⏱️ Prazo de resposta:</strong> 15 dias</p>
                      <p><strong>🆓 Gratuito:</strong> Primeiro pedido por ano</p>
                      <p><strong>🔍 Identificação:</strong> Pode solicitar comprovação de identidade</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Transferência Internacional */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Transferência Internacional de Dados</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-blue-800 mb-3">7.1. Transferências para Portugal (União Europeia)</h3>
                  <div className="space-y-3">
                    <p><strong>PAÍS DE DESTINO:</strong> Portugal, membro da União Europeia</p>
                    <p><strong>ADEQUAÇÃO:</strong> A ANPD reconhece a União Europeia como região com nível adequado de proteção de dados</p>
                    <p><strong>BASE LEGAL:</strong> Art. 33, I da LGPD (país com nível de proteção adequado)</p>
                    <p><strong>PROTEÇÕES ADICIONAIS:</strong> Aplicação do GDPR europeu oferece proteções equivalentes ou superiores à LGPD</p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-yellow-800 mb-3">7.2. Transferências para Terceiros Países</h3>
                  <p className="mb-4">Para alguns serviços utilizamos fornecedores em países terceiros:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-2">Estados Unidos</h4>
                      <p className="text-sm mb-2"><strong>Serviços:</strong> Google Analytics, Stripe, Mailchimp</p>
                      <p className="text-sm mb-2"><strong>Base Legal:</strong> Cláusulas contratuais padrão (Art. 33, II, 'c')</p>
                      <p className="text-sm"><strong>Garantias:</strong> Standard Contractual Clauses + medidas técnicas adicionais</p>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-2">Outros Países</h4>
                      <p className="text-sm mb-2"><strong>Critério:</strong> Apenas países com adequação reconhecida ou com cláusulas contratuais específicas</p>
                      <p className="text-sm"><strong>Compromisso:</strong> Não transferimos dados para países sem proteção adequada</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">7.3. Direitos Relacionados à Transferência</h3>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Informação:</strong> Direito de saber para onde seus dados são transferidos</li>
                    <li><strong>Oposição:</strong> Direito de opor-se a transferências específicas</li>
                    <li><strong>Garantias:</strong> Direito de conhecer as salvaguardas aplicadas</li>
                    <li><strong>Responsabilização:</strong> Mantemos responsabilidade pelos dados mesmo após transferência</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 8. Segurança e Incidentes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Segurança e Comunicação de Incidentes</h2>
              
              <div className="space-y-6">
                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-3">8.1. Medidas de Segurança Técnicas</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Medidas Preventivas:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Criptografia TLS 1.3 para transmissão</li>
                        <li>• Criptografia AES-256 para armazenamento</li>
                        <li>• Autenticação multifator para sistemas</li>
                        <li>• Controle de acesso baseado em funções</li>
                        <li>• Monitoramento 24/7 de segurança</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Medidas Organizacionais:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Treinamento em proteção de dados</li>
                        <li>• Políticas internas de segurança</li>
                        <li>• Auditoria regular de processos</li>
                        <li>• Teste de penetração trimestral</li>
                        <li>• Backup encriptado diário</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                  <h3 className="font-semibold text-red-800 mb-3">8.2. Comunicação de Incidentes de Segurança</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-800 mb-2">Procedimento em Caso de Incidente</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold text-sm mb-1">Para a ANPD:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Prazo: 72 horas (quando aplicável)</li>
                            <li>• Conteúdo: Natureza, dados envolvidos, medidas tomadas</li>
                            <li>• Canal: Sistema da ANPD</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-sm mb-1">Para os Titulares:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Prazo: Prazo razoável</li>
                            <li>• Conteúdo: Riscos, medidas, recomendações</li>
                            <li>• Canal: Email, website, SMS se necessário</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-800 mb-2">Tipos de Incidentes Reportáveis</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Acesso não autorizado a dados pessoais</li>
                        <li>• Vazamento ou divulgação acidental</li>
                        <li>• Alteração não autorizada de dados</li>
                        <li>• Indisponibilidade prolongada de sistemas</li>
                        <li>• Destruição não autorizada de dados</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 9. Encarregado de Proteção de Dados */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Encarregado de Proteção de Dados (DPO)</h2>
              
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border-l-4 border-indigo-500">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-indigo-800 mb-3">👤 Identificação do Encarregado</h3>
                    <div className="bg-white p-4 rounded border space-y-2">
                      <p><strong>Nome:</strong> [Nome do DPO designado]</p>
                      <p><strong>Cargo:</strong> Encarregado de Proteção de Dados</p>
                      <p><strong>Email:</strong> lgpd@jchairstudio62.com</p>
                      <p><strong>Telefone:</strong> [Número direto do DPO]</p>
                      <p><strong>Horário:</strong> Segunda a Sexta, 9h às 18h (horário de Brasília)</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-indigo-800 mb-3">⚖️ Funções do Encarregado</h3>
                    <div className="bg-white p-4 rounded border">
                      <ul className="text-sm space-y-2">
                        <li>• Receber comunicações da ANPD e dos titulares</li>
                        <li>• Orientar funcionários sobre práticas de proteção de dados</li>
                        <li>• Executar demais atribuições determinadas pelo controlador</li>
                        <li>• Atuar como canal de comunicação com a ANPD</li>
                        <li>• Orientar sobre o cumprimento da LGPD</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white rounded border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 mb-2">📞 Como Contactar o Encarregado</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p><strong>Para Titulares:</strong></p>
                      <p>Exercício de direitos, dúvidas sobre tratamento de dados, reclamações</p>
                    </div>
                    <div>
                      <p><strong>Para Autoridades:</strong></p>
                      <p>Comunicações da ANPD, fiscalizações, procedimentos administrativos</p>
                    </div>
                    <div>
                      <p><strong>Prazo de Resposta:</strong></p>
                      <p>15 dias para titulares, 72h para autoridades (casos urgentes imediato)</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 10. Consentimento */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Gestão de Consentimento</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-green-800 mb-3">10.1. Características do Consentimento LGPD</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-semibold text-sm mb-1">🆓 LIVRE</h4>
                        <p className="text-xs">Sem coação, pressão ou vício de vontade</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-semibold text-sm mb-1">📋 INFORMADO</h4>
                        <p className="text-xs">Finalidades claras e específicas</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-semibold text-sm mb-1">✅ INEQUÍVOCO</h4>
                        <p className="text-xs">Manifestação expressa e positiva</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-semibold text-sm mb-1">🎯 ESPECÍFICO</h4>
                        <p className="text-xs">Para finalidades determinadas</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-semibold text-sm mb-1">🔍 DESTACADO</h4>
                        <p className="text-xs">Separado de outros termos contratuais</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-semibold text-sm mb-1">🔄 REVOGÁVEL</h4>
                        <p className="text-xs">Pode ser retirado a qualquer momento</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">10.2. Mecanismos de Consentimento</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-2">Coleta de Consentimento</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Checkbox específica para cada finalidade</li>
                        <li>• Linguagem clara e acessível</li>
                        <li>• Opção de consentimento granular</li>
                        <li>• Registro de data, hora e IP do consentimento</li>
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-semibold mb-2">Gestão de Consentimento</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Portal do cliente para gestão de consentimentos</li>
                        <li>• Histórico de consentimentos dados e retirados</li>
                        <li>• Notificação antes da expiração (se aplicável)</li>
                        <li>• Opção de retirada simples e gratuita</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-yellow-800 mb-3">10.3. Retirada de Consentimento</h3>
                  <div className="space-y-3">
                    <p><strong>FACILIDADE:</strong> A retirada do consentimento deve ser tão fácil quanto foi dá-lo</p>
                    <p><strong>MÉTODOS:</strong></p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Portal do cliente no website</li>
                      <li>• Email para lgpd@jchairstudio62.com</li>
                      <li>• Link de unsubscribe em emails</li>
                      <li>• Contacto telefônico com o DPO</li>
                    </ul>
                    <p><strong>EFEITOS:</strong> A retirada não compromete a legalidade do tratamento realizado antes da retirada</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 11. Autoridade Nacional */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Autoridade Nacional de Proteção de Dados (ANPD)</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border-l-4 border-blue-500">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-3">🏛️ Identificação da ANPD</h3>
                    <div className="bg-white p-4 rounded border space-y-2">
                      <p><strong>Nome:</strong> Autoridade Nacional de Proteção de Dados</p>
                      <p><strong>Natureza:</strong> Autarquia federal vinculada à Presidência da República</p>
                      <p><strong>Website:</strong> gov.br/anpd</p>
                      <p><strong>Email:</strong> comunicacao@anpd.gov.br</p>
                      <p><strong>Sede:</strong> Brasília/DF</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-3">⚖️ Direitos perante a ANPD</h3>
                    <div className="bg-white p-4 rounded border">
                      <ul className="text-sm space-y-2">
                        <li><strong>Petição:</strong> Direito de petição à ANPD sobre questões relacionadas aos seus dados</li>
                        <li><strong>Reclamação:</strong> Direito de apresentar reclamação sobre violações da LGPD</li>
                        <li><strong>Fiscalização:</strong> Direito de solicitar fiscalização de controladores</li>
                        <li><strong>Orientação:</strong> Direito de obter orientações sobre seus direitos</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-white rounded border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-2">📋 Como Apresentar Reclamação à ANPD</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>1. Tente resolver diretamente conosco:</strong></p>
                      <p>Contacte primeiro nosso DPO: lgpd@jchairstudio62.com</p>
                      
                      <p className="mt-3"><strong>2. Se não houver resolução:</strong></p>
                      <p>Acesse o portal da ANPD e registre sua reclamação</p>
                    </div>
                    <div>
                      <p><strong>Informações necessárias:</strong></p>
                      <ul className="space-y-1">
                        <li>• Identificação completa</li>
                        <li>• Descrição detalhada do problema</li>
                        <li>• Documentos comprobatórios</li>
                        <li>• Tentativas de resolução prévia</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 12. Menores de Idade */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Tratamento de Dados de Crianças e Adolescentes</h2>
              
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <h3 className="font-semibold text-red-800 mb-3">👶 Proteção Especial de Menores (Art. 14 da LGPD)</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2 text-gray-800">Crianças (menores de 12 anos)</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>PROIBIDO:</strong> Coleta de dados sem consentimento específico dos pais/responsáveis</li>
                      <li>• <strong>VERIFICAÇÃO:</strong> Processo de verificação da autorização parental</li>
                      <li>• <strong>INTERESSE SUPERIOR:</strong> Sempre considerado o melhor interesse da criança</li>
                      <li>• <strong>FINALIDADES:</strong> Apenas para finalidades específicas e legítimas</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2 text-gray-800">Adolescentes (12 a 18 anos)</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>AUTORIZAÇÃO:</strong> Podem consentir com orientação dos responsáveis</li>
                      <li>• <strong>INFORMAÇÃO:</strong> Linguagem adequada à idade e maturidade</li>
                      <li>• <strong>SUPERVISÃO:</strong> Direito dos pais de supervisionar o tratamento</li>
                      <li>• <strong>EDUCAÇÃO:</strong> Orientação sobre proteção de dados</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-100 p-4 rounded border border-yellow-300">
                    <h4 className="font-semibold mb-2 text-yellow-800">🚨 Nossa Política Rigorosa</h4>
                    <p className="text-sm mb-2"><strong>IDADE MÍNIMA:</strong> 18 anos para uso dos nossos serviços</p>
                    <p className="text-sm mb-2"><strong>DETECÇÃO:</strong> Se identificarmos dados de menores, eliminação imediata</p>
                    <p className="text-sm"><strong>NOTIFICAÇÃO:</strong> Pais/responsáveis podem nos contactar se suspeitarem de uso por menores</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 13. Alterações */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Alterações a Esta Política</h2>
              
              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-800 mb-3">13.1. Processo de Atualização</h3>
                <div className="space-y-3">
                  <p><strong>PERIODICIDADE:</strong> Revisão semestral ou conforme alterações legislativas</p>
                  <p><strong>NOTIFICAÇÃO:</strong> Titulares brasileiros serão notificados por email e banner no website</p>
                  <p><strong>PRAZO:</strong> 30 dias de antecedência para alterações substanciais</p>
                  <p><strong>NOVA VERSÃO:</strong> Sempre disponível neste endereço com data de atualização</p>
                </div>

                <div className="mt-4 p-4 bg-white rounded border">
                  <h4 className="font-semibold mb-2">Critérios para Alterações Substanciais</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Novas finalidades de tratamento</li>
                    <li>• Alteração nas bases legais</li>
                    <li>• Novos compartilhamentos de dados</li>
                    <li>• Mudanças no período de retenção</li>
                    <li>• Alterações nos direitos dos titulares</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Footer Legal */}
            <footer className="border-t pt-8 mt-10">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
                <div className="text-center space-y-4">
                  <div className="flex justify-center items-center gap-3">
                    <span className="text-2xl">🇧🇷</span>
                    <h3 className="text-lg font-semibold">Compromisso com a Proteção de Dados Brasileiros</h3>
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <p className="text-sm">
                    Esta política foi desenvolvida em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) 
                    e demais regulamentações aplicáveis, garantindo a proteção integral dos direitos dos titulares brasileiros.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-green-300">
                    <div>
                      <p className="font-semibold text-sm">📧 Encarregado DPO</p>
                      <p className="text-xs">lgpd@jchairstudio62.com</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">🏛️ ANPD</p>
                      <p className="text-xs">gov.br/anpd</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">⏱️ Resposta</p>
                      <p className="text-xs">15 dias para titulares</p>
                    </div>
                  </div>

                  <div className="border-t border-green-300 pt-4 space-y-2">
                    <p className="text-sm">© 2025 JC Hair Studio's 62, Lda. | Todos os direitos reservados</p>
                    <p className="text-xs">LGPD Compliant | Lei nº 13.709/2018 | Versão 1.0 | Válida a partir de 12/09/2025</p>
                    <div className="flex justify-center space-x-4 text-xs">
                      <a href="/legal/politica-privacidade" className="hover:text-green-200 transition-colors">Política de Privacidade GDPR</a>
                      <span>|</span>
                      <a href="/legal/termos-uso" className="hover:text-green-200 transition-colors">Termos de Uso</a>
                      <span>|</span>
                      <a href="/legal/politica-cookies" className="hover:text-green-200 transition-colors">Política de Cookies</a>
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