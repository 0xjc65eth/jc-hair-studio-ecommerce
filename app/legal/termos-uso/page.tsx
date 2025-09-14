import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso | JC Hair Studio\'s 62',
  description: 'Termos e Condições de Uso juridicamente blindados para e-commerce internacional',
}

export default function TermosUso() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Termos e Condições de Uso
            </h1>
            <p className="text-gray-600 text-lg">
              <strong>Última atualização:</strong> 12 de setembro de 2025<br/>
              <strong>Versão:</strong> 3.0 - Proteção Legal Máxima<br/>
              <strong>Entidade:</strong> JC Hair Studio's 62, Lda.
            </p>
          </header>

          <div className="space-y-8 text-gray-700 leading-7">
            
            {/* 1. Aceitação dos Termos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Aceitação dos Termos</h2>
              <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                <p className="font-semibold text-red-800 mb-3">IMPORTANTE: LEIA ATENTAMENTE ANTES DE UTILIZAR NOSSOS SERVIÇOS</p>
                <div className="space-y-3">
                  <p><strong>1.1.</strong> Ao aceder, navegar ou utilizar este website (www.jchairstudio62.com), VOCÊ CONFIRMA que leu, compreendeu e aceita ficar vinculado a estes Termos e Condições de Uso ("Termos").</p>
                  <p><strong>1.2.</strong> Se NÃO CONCORDAR com qualquer parte destes Termos, deve CESSAR IMEDIATAMENTE a utilização do website e serviços.</p>
                  <p><strong>1.3.</strong> A utilização continuada após alterações aos Termos constitui aceitação das mesmas.</p>
                  <p><strong>1.4.</strong> Estes Termos formam um contrato legalmente vinculativo entre você e JC Hair Studio's 62, Lda.</p>
                </div>
              </div>
            </section>

            {/* 2. Identificação da Entidade */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Identificação da Entidade Comercial</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Dados da Empresa</h3>
                    <p><strong>Denominação Social:</strong> JC Hair Studio's 62, Lda.</p>
                    <p><strong>NIPC/NIF:</strong> [Número de identificação fiscal]</p>
                    <p><strong>Conservatória:</strong> [Localização do registo comercial]</p>
                    <p><strong>Capital Social:</strong> [Valor em euros]</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Contactos</h3>
                    <p><strong>Sede Social:</strong> [Endereço completo em Portugal]</p>
                    <p><strong>Email:</strong> info@jchairstudio62.com</p>
                    <p><strong>Telefone:</strong> [Número de contacto]</p>
                    <p><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Descrição dos Serviços */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Descrição dos Serviços Oferecidos</h2>
              <div className="space-y-4">
                <p><strong>3.1. OBJETO:</strong> A JC Hair Studio's 62 opera uma plataforma de e-commerce especializada na venda de produtos para cabelo, extensões, mega hair e acessórios de beleza.</p>
                
                <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">Produtos Disponíveis:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Extensões e Mega Hair</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Mega hair natural brasileiro</li>
                      <li>• Extensões sintéticas premium</li>
                      <li>• Fitas adesivas profissionais</li>
                      <li>• Queratina e microlinks</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Produtos de Cuidado</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Shampoos e condicionadores</li>
                      <li>• Máscaras reconstrutoras</li>
                      <li>• Óleos nutritivos</li>
                      <li>• Produtos finalizadores</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Progressiva Vogue</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Kits de progressiva profissional</li>
                      <li>• Tratamentos alisadores</li>
                      <li>• Produtos pós-química</li>
                      <li>• Neutralizantes específicos</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Acessórios</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Ferramentas profissionais</li>
                      <li>• Apliques e presilhas</li>
                      <li>• Kits de aplicação</li>
                      <li>• Produtos de manutenção</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mt-6">
                  <p><strong>3.2. RESERVA DE ALTERAÇÃO:</strong> Reservamo-nos o direito de modificar, descontinuar ou substituir qualquer produto ou serviço, temporária ou permanentemente, sem aviso prévio.</p>
                </div>
              </div>
            </section>

            {/* 4. Obrigações do Usuário */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Obrigações e Responsabilidades do Usuário</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">4.1. Uso Lícito e Apropriado</h3>
                  <p><strong>VOCÊ COMPROMETE-SE A:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Utilizar o website apenas para fins legais e comerciais</li>
                    <li>Fornecer informações verdadeiras, precisas e atualizadas</li>
                    <li>Manter a confidencialidade dos seus dados de acesso</li>
                    <li>Notificar imediatamente qualquer uso não autorizado da sua conta</li>
                    <li>Respeitar os direitos de propriedade intelectual</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-3">4.2. Atividades Expressamente Proibidas</h3>
                  <p><strong>É TERMINANTEMENTE PROIBIDO:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Usar sistemas automatizados (bots) para navegar ou fazer pedidos</li>
                    <li>Tentar obter acesso não autorizado a sistemas ou dados</li>
                    <li>Reproduzir, distribuir ou modificar o conteúdo sem autorização</li>
                    <li>Realizar atividades que possam danificar, sobrecarregar ou prejudicar o funcionamento</li>
                    <li>Utilizar o website para fins fraudulentos ou enganosos</li>
                    <li>Violar qualquer lei ou regulamento aplicável</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">4.3. Idade Mínima e Capacidade Legal</h3>
                  <p><strong>DECLARAÇÃO DE CAPACIDADE:</strong> Ao utilizar este website, declara que:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Tem pelo menos 18 anos de idade OU possui autorização parental</li>
                    <li>Possui capacidade legal para celebrar contratos vinculativos</li>
                    <li>As informações fornecidas são verdadeiras e verificáveis</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 5. Propriedade Intelectual */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Propriedade Intelectual e Marcas Registadas</h2>
              
              <div className="space-y-6">
                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-800 mb-3">5.1. Direitos Reservados</h3>
                  <p><strong>TODOS OS DIREITOS RESERVADOS:</strong> O website e todo o seu conteúdo, incluindo mas não limitado a:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Textos, gráficos, logótipos, ícones, imagens, vídeos</li>
                    <li>Código-fonte, software, base de dados</li>
                    <li>Layout, design, estrutura de navegação</li>
                    <li>Compilações, traduções, e obras derivadas</li>
                  </ul>
                  <p className="mt-3 font-semibold">São propriedade exclusiva da JC Hair Studio's 62 ou dos seus licenciadores, protegidos por leis de direitos autorais, marcas registadas e outras leis de propriedade intelectual.</p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-3">5.2. Uso Autorizado</h3>
                  <p><strong>LICENÇA LIMITADA:</strong> Concedemos-lhe uma licença não exclusiva, não transferível e revogável para:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Aceder e visualizar o conteúdo apenas para uso pessoal</li>
                    <li>Imprimir páginas para referência pessoal</li>
                    <li>Partilhar links (não conteúdo copiado) em redes sociais</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-3">5.3. Violações e Proteção Legal</h3>
                  <p><strong>PROTEÇÃO RIGOROSA:</strong> Qualquer uso não autorizado pode resultar em:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Rescisão imediata da licença de uso</li>
                    <li>Ação judicial por violação de direitos autorais</li>
                    <li>Pedido de indemnização por danos e prejuízos</li>
                    <li>Medidas cautelares para cessação da violação</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 6. Preços e Condições Comerciais */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Política de Preços e Condições Comerciais</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">6.1. Formação de Preços</h3>
                  <div className="space-y-3">
                    <p><strong>6.1.1.</strong> Todos os preços são apresentados em EUROS (€) e incluem IVA à taxa legal em vigor</p>
                    <p><strong>6.1.2.</strong> Os preços podem variar sem aviso prévio, sendo aplicável o preço vigente no momento da confirmação do pedido</p>
                    <p><strong>6.1.3.</strong> Erros tipográficos ou de sistema não vinculam a empresa</p>
                    <p><strong>6.1.4.</strong> Promoções são válidas enquanto mencionado ou até esgotamento de stock</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">6.2. Condições de Pagamento</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Métodos Aceites:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Cartão de débito/crédito (Visa, Mastercard)</li>
                        <li>• PayPal e carteiras digitais</li>
                        <li>• Transferência bancária (encomendas &gt; €500)</li>
                        <li>• MB Way (apenas Portugal)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Processamento:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Pagamento processado em ambiente seguro</li>
                        <li>• Confirmação imediata por email</li>
                        <li>• Reembolsos processados no método original</li>
                        <li>• Dados de cartão não armazenados</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-yellow-800 mb-3">6.3. Reserva de Direitos Comerciais</h3>
                  <p><strong>DIREITOS RESERVADOS:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Recusar ou cancelar encomendas por motivos justificados</li>
                    <li>Limitar quantidades por cliente</li>
                    <li>Suspender vendas para investigações de fraude</li>
                    <li>Aplicar condições especiais para encomendas de grande volume</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 7. Entrega e Logística */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Condições de Entrega e Logística</h2>
              
              <div className="space-y-6">
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-indigo-800 mb-3">7.1. Áreas de Entrega e Prazos</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-4">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-3 text-left">Destino</th>
                          <th className="border border-gray-300 p-3 text-left">Prazo</th>
                          <th className="border border-gray-300 p-3 text-left">Custo</th>
                          <th className="border border-gray-300 p-3 text-left">Transportadora</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-3">Portugal Continental</td>
                          <td className="border border-gray-300 p-3">24-48h úteis</td>
                          <td className="border border-gray-300 p-3">€4,99 (Grátis &gt; €50)</td>
                          <td className="border border-gray-300 p-3">CTT/DPD</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-3">Açores/Madeira</td>
                          <td className="border border-gray-300 p-3">3-5 dias úteis</td>
                          <td className="border border-gray-300 p-3">€9,99</td>
                          <td className="border border-gray-300 p-3">CTT Expresso</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3">Espanha</td>
                          <td className="border border-gray-300 p-3">3-5 dias úteis</td>
                          <td className="border border-gray-300 p-3">€12,99</td>
                          <td className="border border-gray-300 p-3">DPD/UPS</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-3">União Europeia</td>
                          <td className="border border-gray-300 p-3">5-10 dias úteis</td>
                          <td className="border border-gray-300 p-3">€19,99</td>
                          <td className="border border-gray-300 p-3">UPS/FedEx</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-3">7.2. Condições e Limitações</h3>
                  <div className="space-y-3">
                    <p><strong>7.2.1. FORÇA MAIOR:</strong> Prazos podem ser afetados por circunstâncias fora do nosso controlo (greves, condições meteorológicas, pandemias, etc.)</p>
                    <p><strong>7.2.2. TENTATIVAS DE ENTREGA:</strong> Máximo 3 tentativas. Após este período, a encomenda retorna ao remetente com custos por conta do cliente</p>
                    <p><strong>7.2.3. RESPONSABILIDADE:</strong> Após entrega confirmada pela transportadora, a responsabilidade transfere-se para o destinatário</p>
                    <p><strong>7.2.4. INSPEÇÃO:</strong> Cliente deve inspeccionar a encomenda na receção e reportar danos imediatamente</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. Garantias e Limitação de Responsabilidade */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Garantias e Limitação de Responsabilidade</h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                  <h3 className="font-semibold text-red-800 mb-3">8.1. LIMITAÇÃO DE GARANTIAS</h3>
                  <p className="font-semibold mb-3">OS PRODUTOS SÃO VENDIDOS "COMO ESTÃO" (AS IS) COM AS SEGUINTES LIMITAÇÕES:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>NÃO GARANTIMOS:</strong> Resultados específicos, adequação para fins particulares não declarados, ou compatibilidade com todos os tipos de cabelo</li>
                    <li><strong>GARANTIA LIMITADA:</strong> Apenas contra defeitos de fabrico, válida por 30 dias a partir da receção</li>
                    <li><strong>EXCLUSÕES:</strong> Danos por uso incorreto, reações alérgicas individuais, ou desgaste natural</li>
                    <li><strong>RESPONSABILIDADE LIMITADA:</strong> Máximo igual ao valor pago pelo produto defeituoso</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-yellow-800 mb-3">8.2. EXCLUSÃO DE DANOS CONSEQUENCIAIS</h3>
                  <p className="font-semibold mb-3">EM NENHUMA CIRCUNSTÂNCIA SEREMOS RESPONSÁVEIS POR:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Danos indiretos, incidentais, consequenciais ou punitivos</li>
                    <li>Lucros cessantes, perda de dados ou interrupção de negócios</li>
                    <li>Danos morais ou psicológicos</li>
                    <li>Custos de produtos ou serviços de substituição</li>
                  </ul>
                  <p className="mt-3 text-sm"><em>Esta limitação aplica-se mesmo que tenhamos sido avisados da possibilidade de tais danos.</em></p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">8.3. Garantia Legal do Consumidor</h3>
                  <p><strong>DIREITOS IRRENUNCIÁVEIS:</strong> As limitações acima não prejudicam os direitos imperartivos conferidos pela legislação de proteção ao consumidor, incluindo:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Garantia de conformidade (2 anos para bens de consumo)</li>
                    <li>Direito de arrependimento (14 dias para vendas à distância)</li>
                    <li>Reparação, substituição ou redução de preço</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 9. Direito de Arrependimento */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Direito de Arrependimento (Vendas à Distância)</h2>
              
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-green-800 mb-3">9.1. Prazo e Condições</h3>
                <div className="space-y-3">
                  <p><strong>PRAZO:</strong> 14 dias corridos a partir da receção da encomenda</p>
                  <p><strong>COMUNICAÇÃO:</strong> Deve comunicar a desistência por email (devolucoes@jchairstudio62.com) ou formulário no website</p>
                  <p><strong>ESTADO DOS PRODUTOS:</strong> Produtos devem estar nas condições originais, não utilizados e na embalagem original</p>
                  <p><strong>CUSTOS DE DEVOLUÇÃO:</strong> Por conta do cliente, salvo se o produto foi entregue defeituoso</p>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg mt-6">
                <h3 className="font-semibold text-red-800 mb-3">9.2. Produtos Excluídos do Direito de Arrependimento</h3>
                <p><strong>NÃO SE APLICA A:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Produtos personalizados ou feitos por medida</li>
                  <li>Produtos que se deterioram rapidamente</li>
                  <li>Produtos de higiene pessoal abertos</li>
                  <li>Produtos com embalagem violada por razões de saúde</li>
                </ul>
              </div>
            </section>

            {/* 10. Resolução de Disputas */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Resolução de Disputas e Mediação</h2>
              
              <div className="space-y-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-3">10.1. Resolução Amigável</h3>
                  <p><strong>PRIMEIRA INSTÂNCIA:</strong> Comprometemo-nos a resolver disputas de forma amigável através de:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Contacto direto com o nosso serviço de apoio ao cliente</li>
                    <li>Mediação através de entidade competente</li>
                    <li>Arbitragem voluntária em centros especializados</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">10.2. Entidades de Resolução Alternativa</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Portugal:</h4>
                      <p className="text-sm">Centro de Arbitragem de Conflitos de Consumo de Lisboa</p>
                      <p className="text-sm">Email: info@centroarbitragemlisboa.pt</p>
                      <p className="text-sm">Website: www.centroarbitragemlisboa.pt</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">União Europeia:</h4>
                      <p className="text-sm">Plataforma de Resolução de Litígios Online</p>
                      <p className="text-sm">Website: ec.europa.eu/consumers/odr</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-500">
                  <h3 className="font-semibold text-gray-800 mb-3">10.3. Jurisdição e Foro Competente</h3>
                  <p><strong>FORO ELEITO:</strong> Para todas as questões não resolvidas amigavelmente, fica eleito o foro da comarca de Lisboa, Portugal, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>
                  <p className="mt-2"><strong>LEI APLICÁVEL:</strong> Legislação portuguesa e regulamentação comunitária europeia.</p>
                </div>
              </div>
            </section>

            {/* 11. Força Maior */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Força Maior e Caso Fortuito</h2>
              
              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                <h3 className="font-semibold text-orange-800 mb-3">11.1. Eventos de Força Maior</h3>
                <p><strong>NÃO SEREMOS RESPONSÁVEIS</strong> por atrasos ou falhas na execução decorrentes de:</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Fenómenos naturais (terramotos, inundações)</li>
                    <li>Guerras, atos de terrorismo</li>
                    <li>Greves, lock-outs</li>
                    <li>Falhas de sistemas de terceiros</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pandemias e emergências sanitárias</li>
                    <li>Alterações legislativas súbitas</li>
                    <li>Interrupções de serviços públicos</li>
                    <li>Atos ou omissões de autoridades</li>
                  </ul>
                </div>
                <p className="mt-4 font-semibold">Em caso de força maior prolongada (&gt; 30 dias), qualquer das partes pode resolver o contrato sem penalizações.</p>
              </div>
            </section>

            {/* 12. Divisibilidade e Modificações */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Divisibilidade e Modificações dos Termos</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">12.1. Cláusula de Divisibilidade</h3>
                  <p>Se qualquer disposição destes Termos for considerada inválida, ilegal ou inexequível por tribunal competente, tal disposição será separada e as restantes disposições permanecerão em pleno vigor e efeito.</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-3">12.2. Modificações Unilaterais</h3>
                  <div className="space-y-2">
                    <p><strong>DIREITO DE ALTERAÇÃO:</strong> Reservamo-nos o direito de modificar estes Termos a qualquer momento</p>
                    <p><strong>NOTIFICAÇÃO:</strong> Alterações substanciais serão notificadas por email ou banner no website</p>
                    <p><strong>ENTRADA EM VIGOR:</strong> 30 dias após notificação</p>
                    <p><strong>ACEITAÇÃO:</strong> Uso continuado após modificações constitui aceitação</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">12.3. Prevalência de Versões</h3>
                  <p>Em caso de conflito entre versões linguísticas destes Termos, a versão em português prevalecerá para todas as questões legais e interpretações.</p>
                </div>
              </div>
            </section>

            {/* 13. Contactos e Reclamações */}
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Contactos, Reclamações e Apoio ao Cliente</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">📞 Apoio ao Cliente</h3>
                  <p><strong>Email:</strong> info@jchairstudio62.com</p>
                  <p><strong>Telefone:</strong> [Número de contacto]</p>
                  <p><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</p>
                  <p><strong>Tempo de Resposta:</strong> Máximo 48h úteis</p>
                  <p><strong>Idiomas:</strong> Português, Inglês, Espanhol</p>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-3">📋 Livro de Reclamações</h3>
                  <p><strong>Físico:</strong> Disponível na sede da empresa</p>
                  <p><strong>Online:</strong> Portal da Queixa (portaldaqueixa.com)</p>
                  <p><strong>ASAE:</strong> Autoridade de Segurança Alimentar</p>
                  <p><strong>DGPC:</strong> Direção-Geral do Consumidor</p>
                  <p className="text-sm mt-2">Todas as reclamações são investigadas e respondidas em 15 dias úteis</p>
                </div>
              </div>
            </section>

            {/* Footer Legal */}
            <footer className="border-t pt-8 mt-10">
              <div className="bg-gray-800 text-white p-6 rounded-lg">
                <div className="text-center space-y-3">
                  <p className="font-semibold text-lg">DECLARAÇÃO DE ACEITAÇÃO</p>
                  <p>Ao utilizar este website e serviços, VOCÊ RECONHECE que leu, compreendeu e aceita ficar vinculado a estes Termos e Condições de Uso na sua totalidade.</p>
                  <div className="border-t border-gray-600 pt-4 mt-4">
                    <p className="text-sm">© 2025 JC Hair Studio's 62, Lda. | Todos os direitos reservados</p>
                    <p className="text-sm">Documento juridicamente blindado | Versão 3.0 | Última atualização: 12/09/2025</p>
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