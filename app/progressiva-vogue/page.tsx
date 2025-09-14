'use client'

import Link from 'next/link'

export default function ProgressivaVoguePage() {
  const progressiveTypes = [
    {
      name: "Progressiva Orgânica Premium",
      description: "Fórmula 100% natural com extratos vegetais e óleos essenciais",
      features: [
        "Sem ingredientes químicos agressivos",
        "Ideal para cabelos sensibilizados",
        "Hidratação profunda simultânea",
        "Reduz 85% do volume",
        "Duração: 4-5 meses"
      ],
      price: "€180 - €280",
      image: "/images/progressiva-organica.jpg"
    },
    {
      name: "Progressiva Marroquina Elite",
      description: "Tecnologia marroquina com óleo de argan e queratina premium",
      features: [
        "Óleo de argan puro do Marrocos",
        "Queratina hidrolisada de alta qualidade",
        "Reconstrução da fibra capilar",
        "Reduz 95% do volume e frizz",
        "Duração: 5-6 meses"
      ],
      price: "€220 - €350",
      image: "/images/progressiva-marroquina.jpg"
    },
    {
      name: "Botox Capilar Luxury",
      description: "Tratamento intensivo de rejuvenescimento capilar premium",
      features: [
        "Vitaminas A, C, E e complexo B",
        "Aminoácidos reconstrutores",
        "Colágeno e elastina naturais",
        "Efeito botox no frizz",
        "Duração: 3-4 meses"
      ],
      price: "€150 - €240",
      image: "/images/botox-capilar.jpg"
    }
  ]

  const applicationSteps = [
    {
      step: 1,
      title: "Diagnóstico Personalizado",
      description: "Análise completa do tipo capilar, histórico químico e condições do cabelo",
      duration: "15 min",
      details: [
        "Avaliação microscópica da fibra",
        "Teste de porosidade",
        "Verificação de resistência",
        "Análise do couro cabeludo"
      ]
    },
    {
      step: 2,
      title: "Preparação Profissional",
      description: "Limpeza profunda e preparação específica para cada tipo de progressiva",
      duration: "20 min",
      details: [
        "Shampoo clarificante pH neutro",
        "Remoção de resíduos e oleosidade",
        "Preparação da cutícula",
        "Secagem técnica 80%"
      ]
    },
    {
      step: 3,
      title: "Aplicação Técnica",
      description: "Aplicação mecha a mecha com precisão profissional",
      duration: "45-90 min",
      details: [
        "Separação em quadrantes",
        "Aplicação 1cm da raiz",
        "Distribuição uniforme",
        "Tempo de pausa controlado"
      ]
    },
    {
      step: 4,
      title: "Selagem e Finalização",
      description: "Processo de selagem com equipamentos profissionais de alta qualidade",
      duration: "30-45 min",
      details: [
        "Secagem profissional",
        "Prancha cerâmica 180-200°C",
        "Selagem mecha a mecha",
        "Tratamento finalizador"
      ]
    }
  ]

  const careTips = [
    {
      category: "Primeiras 72h",
      icon: "⏰",
      tips: [
        "Não molhe o cabelo por 72 horas",
        "Evite prender ou amarrar",
        "Durma com cabelo solto",
        "Use fronha de seda ou cetim",
        "Não use chapéus ou bonés"
      ]
    },
    {
      category: "Produtos Recomendados",
      icon: "🧴",
      tips: [
        "Shampoo sem sulfato exclusivo",
        "Condicionador hidratante específico",
        "Máscara reconstrutora semanal",
        "Leave-in protetor térmico",
        "Óleo nutritivo para as pontas"
      ]
    },
    {
      category: "Manutenção Mensal",
      icon: "📅",
      tips: [
        "Hidratação profissional mensal",
        "Corte de pontas a cada 8 semanas",
        "Cauterização quinzenal",
        "Cronograma capilar personalizado",
        "Retoque da raiz conforme crescimento"
      ]
    }
  ]

  const beforeAfterGallery = [
    { before: "/images/before-1.jpg", after: "/images/after-1.jpg", description: "Cabelo cacheado transformado em liso natural" },
    { before: "/images/before-2.jpg", after: "/images/after-2.jpg", description: "Redução de volume e controle de frizz" },
    { before: "/images/before-3.jpg", after: "/images/after-3.jpg", description: "Progressiva Marroquina - brilho e maciez" },
    { before: "/images/before-4.jpg", after: "/images/after-4.jpg", description: "Botox Capilar - rejuvenescimento total" }
  ]

  const faq = [
    {
      question: "Qual é a diferença entre as progressivas oferecidas?",
      answer: "A Orgânica é 100% natural, ideal para cabelos sensíveis. A Marroquina tem tecnologia premium com argan para máxima durabilidade. O Botox é um tratamento rejuvenescedor menos invasivo."
    },
    {
      question: "Posso fazer progressiva em cabelo com química?",
      answer: "Sim, mas é necessária uma avaliação prévia. Aguardamos 15 dias após relaxamento e 30 dias após coloração. Nossa análise determina a compatibilidade."
    },
    {
      question: "Quanto tempo dura o procedimento completo?",
      answer: "Entre 2h30 a 4 horas, dependendo do comprimento, densidade e tipo de progressiva escolhida. Incluímos análise, aplicação e finalização profissional."
    },
    {
      question: "É possível fazer progressiva em cabelo descolorido?",
      answer: "Dependendo do nível de descoloração, sim. O Botox Capilar é mais indicado para cabelos muito descoloridos, oferecendo reconstrução e alisamento suave."
    },
    {
      question: "Qual o prazo para reagendar em caso de chuva?",
      answer: "Por segurança, reagendamos automaticamente em dias chuvosos. O processo de selagem pode ser comprometido com umidade excessiva."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-600 to-pink-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-light tracking-widest mb-4">
            PROGRESSIVA VOGUE
          </h1>
          <p className="text-xl text-pink-200 mb-2">Alisamento Premium Profissional</p>
          <p className="text-lg text-pink-100 font-light">30 Anos de Experiência • Tecnologia Avançada • Resultados Garantidos</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-pink-600 transition-colors">Home</Link> / 
        <span className="ml-1 text-gray-900 font-medium"> Progressiva Vogue</span>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Alisamento Profissional de Salão Premium
          </h2>
          
          <p className="text-lg text-gray-700 text-center mb-8 leading-relaxed max-w-4xl mx-auto">
            Com mais de 30 anos de experiência em Lisboa, oferecemos os mais avançados tratamentos de alisamento 
            profissional. Tecnologia de ponta, produtos premium importados e técnicas exclusivas para 
            resultados excepcionais e duradouros.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-pink-600 mb-2">30+ Anos de Experiência</h3>
              <p className="text-gray-600">Especialistas reconhecidos em progressivas profissionais</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold text-pink-600 mb-2">Tecnologia Avançada</h3>
              <p className="text-gray-600">Fórmulas exclusivas sem formol, 100% seguras</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold text-pink-600 mb-2">Durabilidade Superior</h3>
              <p className="text-gray-600">Resultados que duram de 4 a 6 meses</p>
            </div>
          </div>
        </div>

        {/* Types of Progressives */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Nossos Tratamentos Exclusivos
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {progressiveTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                  <div className="text-6xl">
                    {index === 0 ? '🌿' : index === 1 ? '💎' : '✨'}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{type.name}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{type.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-pink-500 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-pink-600">{type.price}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Disponível
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      const message = `🌟 Olá! Tenho interesse na ${type.name}. Gostaria de agendar uma consulta para avaliação e orçamento personalizado.`
                      window.open(`https://wa.me/32470032758?text=${encodeURIComponent(message)}`, '_blank')
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Agendar Consulta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-pink-800 mb-6 text-center">
            Processo Profissional Passo a Passo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applicationSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2">
                    {step.step}
                  </div>
                  <div className="text-xs text-pink-600 font-semibold">{step.duration}</div>
                </div>
                
                <h4 className="font-semibold text-gray-800 mb-2 text-center">{step.title}</h4>
                <p className="text-sm text-gray-600 mb-3 text-center">{step.description}</p>
                
                <ul className="text-xs text-gray-600 space-y-1">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-1">
                      <span className="text-pink-400">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Before and After Gallery */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Transformações Reais dos Nossos Clientes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {beforeAfterGallery.map((item, index) => (
              <div key={index} className="border rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 gap-0">
                  <div className="relative">
                    <div className="aspect-square bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Antes</span>
                    </div>
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      ANTES
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">Depois</span>
                    </div>
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      DEPOIS
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 text-center">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Veja mais transformações nas nossas redes sociais</p>
            <div className="flex justify-center gap-4">
              <a href="#" className="text-pink-600 hover:text-pink-700">Instagram</a>
              <a href="#" className="text-pink-600 hover:text-pink-700">Facebook</a>
              <a href="#" className="text-pink-600 hover:text-pink-700">TikTok</a>
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
            Cuidados Profissionais Pós-Progressiva
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careTips.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h4 className="font-semibold text-indigo-700">{category.category}</h4>
                </div>
                
                <ul className="space-y-2">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-indigo-400 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-indigo-700 font-medium mb-2">
              Produtos de manutenção disponíveis em nosso catálogo
            </p>
            <Link 
              href="/acessorios" 
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              Ver produtos de cuidado →
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Perguntas Frequentes
          </h3>
          
          <div className="space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  {item.question}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Pronta para Transformar seu Cabelo?
          </h3>
          <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
            Agende sua consulta personalizada gratuita e descubra qual progressiva é ideal para você. 
            Nossa equipe especializada está pronta para criar o visual dos seus sonhos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`https://wa.me/32470032758?text=${encodeURIComponent('🌟 Olá! Gostaria de agendar uma consulta gratuita para progressiva. Preciso de avaliação profissional e orçamento personalizado.')}`}
              target="_blank"
              className="inline-flex items-center gap-3 bg-white text-pink-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              📱 Consulta Gratuita WhatsApp
            </a>
            
            <div className="text-pink-200 text-sm">
              <p>📞 +32 470 032 758</p>
              <p>📍 Lisboa, Portugal</p>
              <p>🕒 Seg-Sáb: 9h-18h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}