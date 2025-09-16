'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('produtos')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const categories = [
    { id: 'produtos', name: '🎯 Produtos', icon: '💇‍♀️' },
    { id: 'pedidos', name: '📦 Pedidos', icon: '🛒' },
    { id: 'pagamentos', name: '💳 Pagamentos', icon: '💰' },
    { id: 'entrega', name: '🚚 Entrega', icon: '📦' },
    { id: 'tecnicos', name: '🔧 Técnicos', icon: '⚙️' },
    { id: 'geral', name: '❓ Geral', icon: '🤔' }
  ]

  const faqs = {
    produtos: [
      {
        question: "Qual a diferença entre mega hair e extensões naturais?",
        answer: "O mega hair são extensões aplicadas com queratina para uso permanente (3-6 meses), enquanto extensões naturais incluem apliques temporários, fitas adesivas e grampos. Mega hair oferece resultado mais natural e duradouro, ideal para quem quer uma mudança definitiva."
      },
      {
        question: "Como escolher a cor ideal do cabelo?",
        answer: "Recomendamos enviar fotos do seu cabelo com boa iluminação natural via WhatsApp. Nossa equipe possui uma carta de cores com mais de 60 tonalidades e pode orientar sobre a melhor combinação. Também oferecemos amostras de cor por €5 (descontados na compra)."
      },
      {
        question: "Qual o comprimento disponível?",
        answer: "Nossos cabelos vão de 40cm a 70cm. Para medir corretamente, use uma fita métrica da raiz até onde deseja que o cabelo termine. Lembre-se que cabelos muito longos requerem mais cuidados especiais."
      },
      {
        question: "Os cabelos são 100% naturais?",
        answer: "Sim, todos nossos cabelos são 100% naturais, virgens e de origem brasileira. Passam por rigoroso controle de qualidade e possuem certificados de procedência. Não utilizamos fibras sintéticas ou misturas."
      },
      {
        question: "Quanto tempo dura o mega hair?",
        answer: "Com aplicação correta e cuidados adequados, o mega hair dura entre 3-6 meses. A durabilidade depende do tipo de cabelo, crescimento natural, cuidados diários e frequência de lavagens."
      },
      {
        question: "Posso tingir ou descolorir o cabelo natural?",
        answer: "Sim, nossos cabelos naturais aceitam tintura e descoloração. Porém, recomendamos sempre fazer teste em uma mecha pequena primeiro e usar produtos profissionais. Processos químicos podem reduzir a durabilidade."
      },
      {
        question: "Qual a diferença entre Progressive Vogue e outros produtos?",
        answer: "A Progressive Vogue é nossa linha premium de alisamento sem formol, desenvolvida especialmente para cabelos européeus. Oferece alisamento natural, brilho intenso e proteção térmica, durando até 4 meses."
      },
      {
        question: "Vocês vendem produtos para manutenção?",
        answer: "Sim, temos linha completa de manutenção incluindo shampoos sem sulfato, condicionadores, máscaras de hidratação, óleos nutritivos e protetores térmicos específicos para cabelos com extensões."
      }
    ],
    pedidos: [
      {
        question: "Qual o prazo de processamento do pedido?",
        answer: "Pedidos são processados em 1-2 dias úteis após confirmação do pagamento. Produtos sob medida podem levar até 5 dias úteis. Você recebe atualizações por WhatsApp em cada etapa do processo."
      },
      {
        question: "Como alterar meu pedido após a confirmação?",
        answer: "Alterações são possíveis até 2 horas após confirmação do pagamento. Entre em contato imediatamente via WhatsApp (+32 470 032 758). Após início da separação, alterações podem não ser possíveis."
      },
      {
        question: "Posso cancelar meu pedido?",
        answer: "Sim, cancelamentos são gratuitos até 2 horas após confirmação. Entre 2-24 horas há taxa de 5%. Após 24 horas, seguimos nossa política de devolução padrão com direito de arrependimento de 14 dias."
      },
      {
        question: "Como acompanhar meu pedido?",
        answer: "Você recebe código de rastreamento por WhatsApp e email assim que o pedido é enviado. Pode acompanhar em tempo real no site da transportadora. Nossa equipe também envia atualizações importantes."
      },
      {
        question: "Posso fazer pedidos por telefone?",
        answer: "Nosso atendimento principal é via WhatsApp para maior agilidade e registro das conversas. Para pedidos complexos, também atendemos por email (contato@jchairstudios62.xyz) com resposta em até 24h."
      },
      {
        question: "Há pedido mínimo?",
        answer: "Não há valor mínimo, mas pedidos acima de €75 têm frete grátis na Europa. Para otimizar custos, recomendamos aproveitar esta condição especial sempre que possível."
      },
      {
        question: "Vocês fazem pedidos personalizados?",
        answer: "Sim, aceitamos pedidos sob medida incluindo cortes específicos, misturas de cores, tamanhos especiais e kits customizados. Prazo adicional de 3-7 dias úteis e consulta prévia obrigatória."
      }
    ],
    pagamentos: [
      {
        question: "Quais formas de pagamento vocês aceitam?",
        answer: "Aceitamos PIX (Brasil), transferência bancária SEPA, PayPal, Wise, cartões de crédito (Visa/Mastercard/Amex) e Bitcoin. Cada método tem condições específicas de prazo e taxas."
      },
      {
        question: "Posso parcelar minha compra?",
        answer: "Sim! Oferecemos parcelamento sem juros em até 3x (pedidos >€200) e com juros até 12x. PayPal também oferece opções de crediário. Consulte condições específicas para seu país."
      },
      {
        question: "Há desconto para pagamento à vista?",
        answer: "Sim, 5% de desconto para PIX e transferência bancária, 3% para Bitcoin. Descontos aplicados automaticamente no valor final. Não cumulativo com outras promoções."
      },
      {
        question: "Quando é cobrado o pagamento?",
        answer: "Cartões são cobrados imediatamente na confirmação. PIX e transferências devem ser realizados em até 24h após confirmação do pedido. Após este prazo, o pedido é cancelado automaticamente."
      },
      {
        question: "É seguro usar cartão de crédito?",
        answer: "Absolutamente. Utilizamos criptografia SSL 256-bit, tokenização de dados, verificação 3D Secure e somos PCI DSS compliant. Seus dados nunca são armazenados em nossos servidores."
      },
      {
        question: "Como funciona o câmbio para outras moedas?",
        answer: "Preços base em EUR. Para outras moedas, usamos cotação do dia da confirmação. Wise oferece as melhores taxas. PayPal e cartões aplicam suas próprias cotações e spreads."
      },
      {
        question: "Posso usar múltiplas formas de pagamento?",
        answer: "Por questões de segurança e controle, aceitamos apenas uma forma de pagamento por pedido. Para valores altos, recomendamos transferência bancária ou Wise."
      }
    ],
    entrega: [
      {
        question: "Para quais países vocês entregam?",
        answer: "Entregamos para toda Europa (prioridade), Américas, Austrália, Japão e outros países. União Europeia tem condições especiais de prazo e frete. Consulte disponibilidade para países não listados."
      },
      {
        question: "Qual o prazo de entrega para Portugal?",
        answer: "Portugal: 2-3 dias (padrão) ou 1-2 dias (express). Usamos CTT e transportadoras internacionais. Frete grátis acima de €50. Entrega expressa disponível por taxa adicional."
      },
      {
        question: "Como é calculado o frete?",
        answer: "Frete baseado em destino, peso e dimensões. Cotação automática no checkout ou via WhatsApp. Europa: €8-25, Internacional: €25-65. Frete grátis conforme condições por país."
      },
      {
        question: "Vocês entregam em apartamentos?",
        answer: "Sim, entregamos em residências, apartamentos e escritórios. Importante fornecer informações completas (porteiro, interfone, referências) para evitar problemas na entrega."
      },
      {
        question: "E se eu não estiver em casa na entrega?",
        answer: "Transportadoras fazem até 3 tentativas. Você pode reagendar, indicar vizinho para receber ou retirar em ponto de coleta. Instruções específicas podem ser fornecidas no pedido."
      },
      {
        question: "Posso alterar endereço após envio?",
        answer: "Alterações de endereço após envio são limitadas e dependem da transportadora. Entre em contato imediatamente via WhatsApp. Podem aplicar-se taxas adicionais para redirecionamento."
      },
      {
        question: "Como é feita a embalagem?",
        answer: "Embalagem premium com caixa rígida, proteção anti-impacto, papel de seda e etiquetagem discreta. Produtos líquidos têm proteção adicional contra vazamentos. Embalagem sustentável sempre que possível."
      }
    ],
    tecnicos: [
      {
        question: "Como aplicar mega hair em casa?",
        answer: "Não recomendamos aplicação caseira de mega hair. Requer técnica profissional e ferramentas específicas (pistola de queratina, pente de aplicação). Indicamos profissionais capacitados na sua região."
      },
      {
        question: "Quais ferramentas preciso para aplicação?",
        answer: "Para mega hair: pistola de queratina, pente de aplicação, alicate removedor. Para tape-in: pente específico, ferro prancha. Para clips: apenas pente comum. Vendemos kits completos de ferramentas."
      },
      {
        question: "Como remover mega hair sem danificar?",
        answer: "Use queratina removedora ou óleo específico, aqueça levemente e deslize suavemente. NUNCA puxe ou force. Processo demora 2-3 horas. Recomendamos profissional experiente para evitar danos."
      },
      {
        question: "Posso reutilizar o mega hair após remoção?",
        answer: "Sim, se removido corretamente e cabelo está em boas condições. Precisa limpeza profissional para retirar resíduos de queratina antes da nova aplicação. Durabilidade pode ser menor na segunda aplicação."
      },
      {
        question: "Como cuidar do cabelo com extensões?",
        answer: "Use shampoo sem sulfato, evite produtos com álcool, escove com cuidado (de baixo para cima), durma com cabelo preso e faça hidratação semanal. Evite calor excessivo na raiz."
      },
      {
        question: "Posso fazer exercícios com mega hair?",
        answer: "Sim, mas evite suor excessivo na raiz nos primeiros 3 dias. Use faixas ou prendas para proteger. Lave o cabelo após exercícios intensos para remover sal do suor que pode danificar a queratina."
      },
      {
        question: "Como fazer progressiva em casa com segurança?",
        answer: "Use produtos sem formol, faça teste de mecha, aplique com luvas, mantenha ventilação e siga instruções rigorosamente. Nossa Progressive Vogue inclui manual completo e suporte via WhatsApp."
      },
      {
        question: "Qual a diferença entre queratina líquida e em bastão?",
        answer: "Queratina em bastão é mais tradicional, derrete com calor e oferece fixação forte. Líquida é mais prática, seca naturalmente, ideal para retoques. Ambas têm mesma durabilidade quando aplicadas corretamente."
      }
    ],
    geral: [
      {
        question: "A 62 Beauty's 62 é uma empresa confiável?",
        answer: "Sim, somos empresa registrada em Portugal e Bélgica há mais de 10 anos. Temos milhares de clientes satisfeitos na Europa, certificações de qualidade e cumprimos todas regulamentações GDPR e direitos do consumidor UE."
      },
      {
        question: "Vocês têm loja física?",
        answer: "Somos especializados em e-commerce para otimizar preços. Temos sede em Lisboa (Portugal) e filial em Bruxelas (Bélgica), mas atendimento é principalmente online via WhatsApp e email para maior agilidade."
      },
      {
        question: "Como entrar em contato com vocês?",
        answer: "WhatsApp: +32 470 032 758 (principal), Email: contato@jchairstudios62.xyz, Website: www.jchairstudios62.xyz. Atendemos Segunda a Sexta 9h-18h, Sábado 9h-14h (horário CET)."
      },
      {
        question: "Vocês oferecem garantia?",
        answer: "Sim, garantia de qualidade em todos os produtos. Defeitos de fabricação têm reposição gratuita. Além disso, respeitamos direito de arrependimento de 14 dias conforme lei europeia."
      },
      {
        question: "Posso revender produtos de vocês?",
        answer: "Sim, temos programa de parcerias para profissionais e lojistas. Oferecemos preços especiais, suporte técnico e materiais de marketing. Entre em contato para conhecer condições."
      },
      {
        question: "Vocês fazem treinamentos?",
        answer: "Oferecemos suporte técnico via WhatsApp e manuais detalhados. Para treinamentos presenciais, indicamos parceiros certificados na sua região. Também temos tutoriais em vídeo no nosso canal."
      },
      {
        question: "Como vocês garantem a qualidade?",
        answer: "Controle rigoroso desde a origem: seleção criteriosa de fornecedores, testes de qualidade em cada lote, certificações internacionais e feedback contínuo dos clientes. Qualidade é nossa prioridade número 1."
      },
      {
        question: "Vocês seguem as leis europeias?",
        answer: "Absolutamente. Somos compliance com GDPR (proteção de dados), regulamentações de importação UE, direitos do consumidor, rotulagem de cosméticos e todas as normativas aplicáveis ao nosso setor."
      },
      {
        question: "Como vocês protegem meus dados pessoais?",
        answer: "Seguimos rigorosamente a GDPR: criptografia de dados, servidores seguros na UE, acesso restrito a informações, direito ao esquecimento e consentimento explícito para uso de dados. Sua privacidade é sagrada."
      },
      {
        question: "Posso indicar amigos e ganhar desconto?",
        answer: "Sim! Nosso programa de indicação oferece 10% de desconto para você e seu amigo na primeira compra dele. Desconto aplicado automaticamente quando ele mencionar sua indicação no pedido."
      }
    ]
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-light tracking-widest mb-4">
            PERGUNTAS FREQUENTES
          </h1>
          <p className="text-xl text-cyan-200 mb-2">FAQ Completo</p>
          <p className="text-lg text-cyan-100 font-light">Mais de 40 perguntas • Respostas detalhadas • Suporte especializado</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-cyan-600 transition-colors">Home</Link> / 
        <span className="ml-1 text-gray-900 font-medium"> FAQ</span>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Search */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">🔍 Encontre sua Resposta</h2>
            <p className="text-gray-600">Selecione uma categoria abaixo ou role para ver todas as perguntas</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-xl text-center transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-semibold">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`bg-white rounded-2xl shadow-xl p-8 ${
                activeCategory === 'todos' || activeCategory === category.id ? 'block' : 'hidden'
              }`}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                {category.name}
              </h3>
              
              <div className="space-y-4">
                {faqs[category.id as keyof typeof faqs].map((faq, index) => {
                  const globalIndex = categories.findIndex(c => c.id === category.id) * 1000 + index
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(globalIndex)}
                        className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                      >
                        <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                        <span className="text-cyan-600 text-2xl flex-shrink-0">
                          {openFaq === globalIndex ? '−' : '+'}
                        </span>
                      </button>
                      {openFaq === globalIndex && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8 mt-12">
          <h3 className="text-3xl font-bold mb-6 text-center">
            🤔 Ainda tem Dúvidas?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">📱</div>
              <h4 className="text-xl font-semibold mb-2">WhatsApp Direto</h4>
              <p className="text-gray-300 mb-4">
                Fale com nossa equipe especializada em tempo real
              </p>
              <a
                href={`https://wa.me/32470032758?text=${encodeURIComponent('❓ Olá! Tenho uma dúvida que não encontrei no FAQ. Podem me ajudar?')}`}
                target="_blank"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                💬 Perguntar Agora
              </a>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">✉️</div>
              <h4 className="text-xl font-semibold mb-2">Email Detalhado</h4>
              <p className="text-gray-300 mb-4">
                Para perguntas complexas que requerem explicação detalhada
              </p>
              <a
                href="mailto:suporte@jchairstudios62.xyz"
                className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                📧 Enviar Pergunta
              </a>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              🕐 <strong>Horário de Atendimento:</strong> Segunda a Sexta 9h-18h, Sábado 9h-14h (CET)
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Garantimos resposta em até 2 horas nos dias úteis
            </p>
          </div>
        </div>

        {/* Popular Resources */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📚 Recursos Populares
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/como-comprar"
              className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
              <h4 className="font-semibold text-gray-800 mb-2">Como Comprar</h4>
              <p className="text-sm text-gray-600">Processo completo de compra passo a passo</p>
            </Link>
            
            <Link 
              href="/envio-entrega"
              className="group p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🚚</div>
              <h4 className="font-semibold text-gray-800 mb-2">Envio & Entrega</h4>
              <p className="text-sm text-gray-600">Prazos, custos e rastreamento</p>
            </Link>
            
            <Link 
              href="/trocas-devolucoes"
              className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🔄</div>
              <h4 className="font-semibold text-gray-800 mb-2">Trocas & Devoluções</h4>
              <p className="text-sm text-gray-600">Política de satisfação e direitos UE</p>
            </Link>
            
            <Link 
              href="/formas-pagamento"
              className="group p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">💳</div>
              <h4 className="font-semibold text-gray-800 mb-2">Formas de Pagamento</h4>
              <p className="text-sm text-gray-600">Todas as opções de pagamento disponíveis</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}