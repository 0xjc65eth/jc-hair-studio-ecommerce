import Link from 'next/link'
import type { Metadata } from 'next'
import WhatsAppButton from '../../components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Extensões Naturais Premium - Cabelo 100% Humano Remy | 62 Beauty\'s 62',
  description: 'Extensões de cabelo 100% natural Remy premium. Clip-in, Tape-in, Micro Ring. Qualidade superior, cores perfeitas, durabilidade garantida. Lisboa, Portugal.',
  keywords: [
    'extensões naturais',
    'cabelo humano remy',
    'clip-in extensions',
    'tape-in extensions',
    'micro ring extensions',
    'extensões premium',
    'cabelo natural',
    'lisboa portugal'
  ],
  openGraph: {
    title: 'Extensões Naturais Premium - 62 Beauty\'s 62',
    description: 'Cabelo 100% humano Remy premium com qualidade superior e durabilidade garantida',
    images: ['/images/extensoes-naturais-hero.jpg'],
  },
}

export default function ExtensoesNaturaisPage() {
  const extensionTypes = [
    {
      name: "Extensões Clip-in Premium",
      description: "Aplicação instantânea em casa com clips de silicone anti-alérgicos",
      features: [
        "100% Cabelo Humano Remy Virgin",
        "Clips de titânio revestidos",
        "Aplicação em 10 minutos",
        "Reutilizáveis por 12+ meses",
        "Disponível em 25+ cores",
        "Comprimentos: 40cm a 70cm"
      ],
      price: "€45 - €120",
      duration: "Imediata",
      ideal: "Eventos especiais, uso ocasional",
      image: "/images/clip-in-extensions.jpg"
    },
    {
      name: "Extensões Tape-in Professional",
      description: "Fita adesiva médica hipoalergênica para uso prolongado confortável",
      features: [
        "Fita adesiva dermatológica",
        "Invisíveis e ultra finas",
        "Aplicação profissional 60min",
        "Confortáveis para dormir",
        "Resistentes à água",
        "Reaplicação a cada 6-8 semanas"
      ],
      price: "€80 - €200",
      duration: "6-8 semanas",
      ideal: "Uso diário prolongado",
      image: "/images/tape-in-extensions.jpg"
    },
    {
      name: "Micro Ring Luxury",
      description: "Sistema de anéis micro sem químicos para máxima naturalidade",
      features: [
        "Anéis de cobre revestidos",
        "Aplicação strand by strand",
        "Zero produtos químicos",
        "Crescimento natural do cabelo",
        "Ajuste individual de cada mecha",
        "Durabilidade superior"
      ],
      price: "€120 - €300",
      duration: "3-4 meses",
      ideal: "Transformação completa natural",
      image: "/images/micro-ring-extensions.jpg"
    },
    {
      name: "Nano Ring Ultra Fine",
      description: "Tecnologia nano para cabelos finos e sensíveis",
      features: [
        "90% menores que micro rings",
        "Ideal para cabelos finos",
        "Invisíveis mesmo em rabos",
        "Peso distribuído uniformemente",
        "Aplicação ultra delicada",
        "Conforto máximo"
      ],
      price: "€150 - €350",
      duration: "3-4 meses",
      ideal: "Cabelos finos e sensíveis",
      image: "/images/nano-ring-extensions.jpg"
    },
    {
      name: "I-Tip Pre-bonded",
      description: "Queratina pré-moldada italiana para aderência perfeita",
      features: [
        "Queratina italiana premium",
        "Aderência molecular",
        "Aplicação com calor controlado",
        "Resultado extremamente natural",
        "Remoção profissional segura",
        "Ideal para volume e comprimento"
      ],
      price: "€180 - €400",
      duration: "4-5 meses",
      ideal: "Resultado ultra profissional",
      image: "/images/i-tip-extensions.jpg"
    },
    {
      name: "U-Tip Fusion Premium",
      description: "Sistema de fusão com queratina moldável para personalização total",
      features: [
        "Queratina moldável a quente",
        "Personalização de cada ponta",
        "Aderência ultra resistente",
        "Movimento completamente natural",
        "Compatível com todos os tipos",
        "Tecnologia italiana"
      ],
      price: "€200 - €450",
      duration: "4-6 meses",
      ideal: "Máxima durabilidade e naturalidade",
      image: "/images/u-tip-extensions.jpg"
    }
  ]

  const colorGuide = [
    { range: "#1 - #4", name: "Pretos Intensos", description: "Do preto azulado ao castanho muito escuro" },
    { range: "#6 - #10", name: "Castanhos Médios", description: "Castanho médio a castanho claro dourado" },
    { range: "#12 - #18", name: "Loiros Escuros", description: "Do loiro escuro ao loiro médio" },
    { range: "#20 - #24", name: "Loiros Claros", description: "Loiro claro a loiro acinzentado" },
    { range: "#60 - #613", name: "Loiros Platinados", description: "Loiro platinado a loiro quase branco" },
    { range: "Especiais", name: "Cores Fashion", description: "Ruivos, coloridos e tons exclusivos" }
  ]

  const textureOptions = [
    {
      name: "Liso Natural",
      description: "Textura lisa natural brasileira",
      characteristics: ["Movimento natural", "Fácil de alisar", "Versatilidade máxima"],
      icon: "➰"
    },
    {
      name: "Ondulado Suave", 
      description: "Ondas naturais definidas",
      characteristics: ["Ondas tipo 2A-2B", "Volume natural", "Definição sem esforço"],
      icon: "🌊"
    },
    {
      name: "Cacheado Natural",
      description: "Cachos naturais tipo 3A-3B",
      characteristics: ["Cachos definidos", "Textura rica", "Volume abundante"],
      icon: "🌀"
    },
    {
      name: "Afro Texturizado",
      description: "Textura crespa natural 4A-4C",
      characteristics: ["Textura densa", "Volume máximo", "Versatilidade styling"],
      icon: "☁️"
    }
  ]

  const applicationTutorials = [
    {
      type: "Clip-in",
      steps: [
        {
          step: 1,
          title: "Preparação",
          description: "Penteie o cabelo e separe horizontalmente",
          time: "2 min"
        },
        {
          step: 2,
          title: "Posicionamento",
          description: "Comece pela nuca, subindo gradualmente",
          time: "5 min"
        },
        {
          step: 3,
          title: "Fixação",
          description: "Pressione clips firmemente contra o couro cabeludo",
          time: "2 min"
        },
        {
          step: 4,
          title: "Finalização",
          description: "Penteie integrando com cabelo natural",
          time: "1 min"
        }
      ]
    },
    {
      type: "Tape-in",
      steps: [
        {
          step: 1,
          title: "Análise",
          description: "Avaliação profissional do cabelo e couro cabeludo",
          time: "10 min"
        },
        {
          step: 2,
          title: "Preparação",
          description: "Limpeza e separação em seções precisas",
          time: "15 min"
        },
        {
          step: 3,
          title: "Aplicação",
          description: "Colagem das fitas strand by strand",
          time: "30 min"
        },
        {
          step: 4,
          title: "Finalização",
          description: "Corte, modelagem e acabamento profissional",
          time: "15 min"
        }
      ]
    }
  ]

  const maintenanceCalendar = [
    {
      period: "Diário",
      tasks: [
        "Escove suavemente com escova de cerdas naturais",
        "Aplique leave-in nas pontas",
        "Evite dormir com cabelo molhado",
        "Use fronha de seda ou cetim"
      ],
      icon: "📅"
    },
    {
      period: "Semanal", 
      tasks: [
        "Hidratação com máscara específica",
        "Lavagem com shampoo sem sulfato",
        "Condicionamento das pontas",
        "Verificação dos pontos de fixação"
      ],
      icon: "🗓️"
    },
    {
      period: "Mensal",
      tasks: [
        "Tratamento profissional de hidratação",
        "Corte de equalização das pontas",
        "Limpeza profunda dos clips/fitas",
        "Avaliação do estado geral"
      ],
      icon: "📆"
    },
    {
      period: "Retoques",
      tasks: [
        "Clip-in: Manutenção dos clips",
        "Tape-in: Reaplicação 6-8 semanas",
        "Micro Ring: Ajuste 3-4 meses", 
        "Fusão: Remoção 4-6 meses"
      ],
      icon: "🔄"
    }
  ]

  const faq = [
    {
      question: "Qual a diferença entre cabelo Remy e cabelo comum?",
      answer: "Cabelo Remy mantém todas as cutículas alinhadas na mesma direção, evitando emaranhados e garantindo movimento natural. É a mais alta qualidade disponível no mercado, durando muito mais tempo que cabelo comum."
    },
    {
      question: "Posso colorir minhas extensões?",
      answer: "Sim, extensões de cabelo humano podem ser coloridas, mas recomendamos sempre procurar um profissional. Tons mais escuros são mais seguros. Para clarear, é necessário processo de descoloração profissional."
    },
    {
      question: "Quantos gramas preciso para um resultado natural?",
      answer: "Para volume sutil: 80-100g. Para mudança moderada: 120-150g. Para transformação completa: 160-200g. Nossa consulta personalizada determina a quantidade ideal para seu caso específico."
    },
    {
      question: "As extensões danificam meu cabelo natural?",
      answer: "Quando aplicadas e mantidas corretamente por profissionais, não. Pelo contrário, podem proteger seu cabelo natural de danos do calor e manipulação excessiva durante o styling."
    },
    {
      question: "Como escolher a cor perfeita?",
      answer: "Oferecemos serviço de color matching personalizado. Analisamos seu cabelo sob diferentes luzes e criamos blend personalizado para integração perfeita, inclusive com mechas e reflexos."
    },
    {
      question: "Posso nadar e fazer exercícios com extensões?",
      answer: "Sim! Tape-in, Micro Ring e sistemas de fusão são resistentes à água e suor. Recomendamos usar leave-in protetor e sempre enxaguar após piscina/mar para remover cloro/sal."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-light tracking-widest mb-4">
            EXTENSÕES NATURAIS
          </h1>
          <p className="text-xl text-green-200 mb-2">100% Cabelo Humano Remy Premium</p>
          <p className="text-lg text-green-100 font-light">30 Anos de Experiência • Qualidade Certificada • Resultado Garantido</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-green-600 transition-colors">Home</Link> / 
        <span className="ml-1 text-gray-900 font-medium"> Extensões Naturais</span>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Extensões de Cabelo Premium Certificadas
          </h2>
          
          <p className="text-lg text-gray-700 text-center mb-8 leading-relaxed max-w-4xl mx-auto">
            Especializamos em extensões de cabelo 100% humano Remy há mais de 30 anos. 
            Cada mecha é cuidadosamente selecionada, tratada e preparada para oferecer 
            a mais alta qualidade, durabilidade e naturalidade possível.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">Cabelo Remy Premium</h3>
              <p className="text-sm text-gray-600">Cutículas alinhadas, zero emaranhado</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">50+ Cores Disponíveis</h3>
              <p className="text-sm text-gray-600">Color matching personalizado</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🔬</div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">Tecnologia Avançada</h3>
              <p className="text-sm text-gray-600">6 métodos de aplicação diferentes</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">⏱️</div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">Durabilidade Superior</h3>
              <p className="text-sm text-gray-600">De 3 meses a 1 ano de duração</p>
            </div>
          </div>
        </div>

        {/* Extension Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Métodos de Aplicação Profissionais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extensionTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <div className="text-5xl">
                    {index === 0 ? '📎' : index === 1 ? '🎗️' : index === 2 ? '💍' : index === 3 ? '⭕' : index === 4 ? '💧' : '🔗'}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{type.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{type.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                    <div>
                      <span className="font-semibold text-green-600">Duração:</span>
                      <p className="text-gray-600">{type.duration}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-green-600">Ideal para:</span>
                      <p className="text-gray-600">{type.ideal}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-1 mb-6">
                    {type.features.slice(0, 4).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-xs text-gray-700">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-green-600">{type.price}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Disponível
                    </span>
                  </div>
                  
                  <WhatsAppButton
                    message={`🌿 Olá! Tenho interesse em ${type.name}. Gostaria de agendar uma consulta para avaliação e orçamento personalizado.`}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm"
                  >
                    Consultar Especialista
                  </WhatsAppButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Guide */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Guia Completo de Cores
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {colorGuide.map((color, index) => (
              <div key={index} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-600"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{color.range}</h4>
                    <p className="text-sm font-medium text-green-600">{color.name}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">{color.description}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <h4 className="font-bold text-green-800 mb-2">Serviço de Color Matching Personalizado</h4>
            <p className="text-sm text-green-700 mb-4">
              Nossa especialista analisa seu cabelo sob diferentes luzes e cria o blend perfeito 
              para integração invisível, incluindo mechas e reflexos naturais.
            </p>
            <WhatsAppButton
              message="🎨 Olá! Gostaria de agendar um color matching personalizado para encontrar a cor perfeita das minhas extensões."
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Agendar Color Matching
            </WhatsAppButton>
          </div>
        </div>

        {/* Texture Options */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
            Texturas Disponíveis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {textureOptions.map((texture, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">{texture.icon}</div>
                <h4 className="font-semibold text-gray-800 mb-2">{texture.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{texture.description}</p>
                
                <ul className="space-y-1">
                  {texture.characteristics.map((char, charIndex) => (
                    <li key={charIndex} className="text-xs text-indigo-600">
                      • {char}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Application Tutorials */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Tutoriais de Aplicação
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {applicationTutorials.map((tutorial, index) => (
              <div key={index} className="border rounded-xl p-6">
                <h4 className="text-lg font-semibold text-green-600 mb-4">
                  Como aplicar: {tutorial.type}
                </h4>
                
                <div className="space-y-4">
                  {tutorial.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex gap-4">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h5 className="font-medium text-gray-800">{step.title}</h5>
                          <span className="text-xs text-green-600 font-medium">{step.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Quer aprender pessoalmente? Oferecemos workshops práticos!</p>
            <WhatsAppButton
              message="📚 Olá! Tenho interesse em participar de um workshop de aplicação de extensões. Quando será o próximo?"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Info sobre Workshops
            </WhatsAppButton>
          </div>
        </div>

        {/* Maintenance Calendar */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center">
            Calendário de Manutenção
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {maintenanceCalendar.map((period, index) => (
              <div key={index} className="bg-white rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">{period.icon}</div>
                  <h4 className="font-semibold text-purple-700">{period.period}</h4>
                </div>
                
                <ul className="space-y-2">
                  {period.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-purple-700 font-medium mb-2">
              Produtos de manutenção profissionais disponíveis
            </p>
            <Link 
              href="/acessorios" 
              className="text-purple-600 hover:text-purple-800 underline"
            >
              Ver linha de cuidados →
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
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Transforme seu Visual com Extensões Premium
          </h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Agende sua consulta personalizada gratuita com nossa especialista. 
            Vamos analisar seu cabelo e criar o plano perfeito para seus objetivos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`https://wa.me/32470032758?text=${encodeURIComponent('🌿 Olá! Gostaria de agendar uma consulta gratuita para extensões naturais. Preciso de avaliação profissional e orientação sobre qual método seria ideal para mim.')}`}
              target="_blank"
              className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              📱 Consulta Gratuita WhatsApp
            </a>
            
            <div className="text-green-200 text-sm">
              <p>📞 +32 470 032 758</p>
              <p>📍 Lisboa, Portugal</p>
              <p>🕒 Seg-Sáb: 9h-18h</p>
              <p>🎓 Consultoria incluída</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}