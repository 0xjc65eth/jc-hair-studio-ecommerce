import Link from 'next/link'
import type { Metadata } from 'next'
import WhatsAppButton from '../../components/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Kits Completos Premium - Soluções Integradas | 62 Beauty\'s 62',
  description: 'Kits completos para extensões: iniciante, profissional, styling. Soluções integradas com economia garantida. Mega hair, progressiva, acessórios premium.',
  keywords: [
    'kits completos',
    'kit mega hair',
    'kit progressiva',
    'kit profissional',
    'solução completa',
    'extensões kit',
    'economia garantida',
    'lisboa portugal'
  ],
  openGraph: {
    title: 'Kits Completos Premium - 62 Beauty\'s 62',
    description: 'Soluções completas para transformação total com economia garantida',
    images: ['/images/kits-completos-hero.jpg'],
  },
}

export default function KitsCompletosPage() {
  const kitCategories = [
    {
      category: "Kits para Iniciantes",
      description: "Soluções completas para quem está começando no mundo das extensões",
      kits: [
        {
          id: 1,
          name: "Kit Descoberta Clip-in",
          image: "https://i.ibb.co/6c9qWqnq/613-1800x.webp",
          description: "Kit perfeito para experimentar extensões pela primeira vez",
          level: "Iniciante",
          duration: "Uso imediato",
          includes: [
            "Extensões Clip-in 100% Remy 40cm (80g)",
            "Escova paddle cerdas naturais",
            "Shampoo sem sulfato 250ml",
            "Condicionador hidratante 250ml",
            "Leave-in protetor térmico",
            "Manual de aplicação ilustrado",
            "Vídeo tutorial online",
            "Bolsa de armazenamento premium"
          ],
          originalPrice: 129,
          salePrice: 89,
          savings: 40,
          featured: false,
          badge: "Melhor Custo-Benefício"
        },
        {
          id: 2,
          name: "Kit Transformação Completa",
          image: "https://i.ibb.co/hPZVQ0x/35-Cms-1800x.webp",
          description: "Tudo que você precisa para uma mudança de visual completa",
          level: "Iniciante-Intermediário",
          duration: "2-3 meses",
          includes: [
            "Extensões Tape-in Premium 50cm (120g)",
            "Kit aplicação tape-in profissional",
            "Linha completa cuidados (4 produtos)",
            "Máscara reparadora luxury",
            "Óleo nutritivo multi-vitamínico",
            "Escova térmica profissional",
            "Consultoria online 30min",
            "Suporte técnico 90 dias"
          ],
          originalPrice: 289,
          salePrice: 219,
          savings: 70,
          featured: true,
          badge: "Mais Popular"
        }
      ]
    },
    {
      category: "Kits Profissionais",
      description: "Soluções avançadas para profissionais e entusiastas experientes",
      kits: [
        {
          id: 3,
          name: "Kit Profissional Micro Ring Master",
          image: "https://i.ibb.co/C3m13MrM/Bulk-2-main-50-1800x.webp",
          description: "Setup completo para aplicação profissional de micro rings",
          level: "Profissional",
          duration: "4-6 meses",
          includes: [
            "Cabelo bulk premium 50cm (150g)",
            "Alicate micro ring titanium pro",
            "500 micro rings sortidos premium",
            "Agulha aplicação nano precision",
            "Kit ferramentas profissionais (8 peças)",
            "Linha produtos manutenção (5 produtos)",
            "Treinamento técnico online 2h",
            "Certificado de conclusão",
            "Suporte técnico 6 meses"
          ],
          originalPrice: 449,
          salePrice: 329,
          savings: 120,
          featured: true,
          badge: "Recomendado Pro"
        },
        {
          id: 4,
          name: "Kit Fusion Premium Elite",
          image: "https://i.ibb.co/VW3SS6XC/Cabelo-14-60e6bbd2-1b6f-4b74-ab7a-9183874d95f4-1800x.webp",
          description: "Sistema de fusão italiana para resultados ultra profissionais",
          level: "Especialista",
          duration: "6-8 meses",
          includes: [
            "Extensões I-Tip queratina italiana 60cm (200g)",
            "Pistola queratina digital pro",
            "Queratina premium (250g)",
            "Removedor profissional",
            "Kit styling completo (5 ferramentas)",
            "Linha premium cuidados (6 produtos)",
            "Workshop presencial 4h (opcional)",
            "Certificação internacional",
            "Suporte vitalício"
          ],
          originalPrice: 789,
          salePrice: 589,
          savings: 200,
          featured: false,
          badge: "Premium Elite"
        }
      ]
    },
    {
      category: "Kits Especializados",
      description: "Soluções específicas para necessidades e texturas particulares",
      kits: [
        {
          id: 5,
          name: "Kit Cachos Naturais Luxury",
          image: "https://i.ibb.co/Q7VXH4qK/Cabelo-5-1800x.webp",
          description: "Especializado em cabelos cacheados e crespos naturais",
          level: "Especializado",
          duration: "4-5 meses",
          includes: [
            "Extensões cacheadas 3B/3C 45cm (140g)",
            "Shampoo co-wash específico",
            "Condicionador leave-in cachos",
            "Gelatina ativadora premium",
            "Óleo de coco puro 100ml",
            "Diffusor professional",
            "Toalha microfibra anti-frizz",
            "Guia método LOC personalizado"
          ],
          originalPrice: 234,
          salePrice: 179,
          savings: 55,
          featured: false,
          badge: "Cachos Perfeitos"
        },
        {
          id: 6,
          name: "Kit Progressiva Vogue Master",
          image: "https://i.ibb.co/B2z4LK0d/Cabelo-1-5f757ba1-093e-4a52-83b3-c832f7c44540-1800x.webp",
          description: "Alisamento profissional premium para resultados de salão",
          level: "Avançado",
          duration: "5-6 meses",
          includes: [
            "Progressiva Vogue Premium 1L",
            "Shampoo clarificante preparatório",
            "Neutralizante pH balancer",
            "Máscara pós-química intensiva",
            "Protetor couro cabeludo",
            "Kit EPI profissional completo",
            "Guia técnico detalhado",
            "Suporte técnico especializado 90 dias"
          ],
          originalPrice: 329,
          salePrice: 259,
          savings: 70,
          featured: false,
          badge: "Resultado Salão"
        },
        {
          id: 7,
          name: "Kit Color & Extensions Deluxe",
          image: "https://i.ibb.co/6c9qWqnq/613-1800x.webp",
          description: "Combinação perfeita de coloração e extensões premium",
          level: "Expert",
          duration: "3-4 meses",
          includes: [
            "Extensões loiro platinado 613 (160g)",
            "Kit coloração profissional",
            "Matizador premium 500ml",
            "Tônico violet intensive",
            "Máscara reconstrutora pós-coloração",
            "Glossing treatment luxury",
            "Ferramentas coloração (6 peças)",
            "Consultoria colorista online 1h"
          ],
          originalPrice: 379,
          salePrice: 299,
          savings: 80,
          featured: true,
          badge: "Expert Only"
        }
      ]
    }
  ]

  const kitBenefits = [
    {
      icon: "💰",
      title: "Economia Garantida",
      description: "Até €200 de economia vs compra individual",
      highlight: "25-40% desconto"
    },
    {
      icon: "🎓",
      title: "Suporte Incluído",
      description: "Consultoria e treinamento especializado",
      highlight: "Suporte vitalício"
    },
    {
      icon: "📦",
      title: "Entrega Premium",
      description: "Embalagem especial e frete grátis",
      highlight: "24-48h Europa"
    },
    {
      icon: "🛡️",
      title: "Garantia Estendida",
      description: "Cobertura completa até 12 meses",
      highlight: "100% satisfação"
    }
  ]

  const customKitOptions = [
    {
      type: "Por Necessidade",
      options: [
        "Volume extra",
        "Comprimento específico", 
        "Mudança de cor",
        "Textura diferente",
        "Uso esporádico",
        "Transformação completa"
      ]
    },
    {
      type: "Por Tipo de Cabelo",
      options: [
        "Cabelo fino",
        "Cabelo grosso",
        "Cabelo danificado",
        "Cabelo quimicamente tratado",
        "Couro cabeludo sensível",
        "Crescimento lento"
      ]
    },
    {
      type: "Por Lifestyle",
      options: [
        "Atleta/esportista",
        "Profissional corporativo",
        "Vida social intensa",
        "Mãe ocupada",
        "Estudante",
        "Artista/criativa"
      ]
    }
  ]

  const faq = [
    {
      question: "Qual kit é ideal para iniciantes?",
      answer: "O Kit Descoberta Clip-in é perfeito para quem está começando. Tem tudo que precisa com manual detalhado e suporte online incluído."
    },
    {
      question: "Posso personalizar um kit existente?",
      answer: "Sim! Oferecemos personalização completa. Nossa especialista analisa suas necessidades e monta um kit único para você."
    },
    {
      question: "Os kits incluem treinamento?",
      answer: "Todos os kits profissionais incluem treinamento online. Kits Premium e Elite incluem consultoria personalizada e suporte técnico."
    },
    {
      question: "Qual a garantia dos kits?",
      answer: "Oferecemos garantia estendida de até 12 meses nos kits, cobrindo produtos e suporte técnico. Satisfação 100% garantida."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-light tracking-widest mb-4">
            KITS COMPLETOS
          </h1>
          <p className="text-xl text-indigo-200 mb-2">Soluções Integradas para Transformação Total</p>
          <p className="text-lg text-indigo-100 font-light">30 Anos de Experiência • Economia até €200 • Suporte Incluso</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link> / 
        <span className="ml-1 text-gray-900 font-medium"> Kits Completos</span>
      </nav>

      {/* Benefits Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-6 text-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {kitBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{benefit.icon}</div>
                <div className="font-semibold mb-1">{benefit.title}</div>
                <div className="text-sm text-green-100 mb-1">{benefit.description}</div>
                <div className="text-xs bg-white/20 px-2 py-1 rounded font-medium">{benefit.highlight}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Kits Profissionais Cuidadosamente Desenvolvidos
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto mb-8">
            Com mais de 30 anos de experiência, criamos soluções completas para cada necessidade. 
            Cada kit é montado estrategicamente para oferecer máxima economia, praticidade e resultados profissionais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">15+ Kits Especializados</h3>
              <p className="text-sm text-gray-600">Para todos os níveis e necessidades</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">Curadoria Especializada</h3>
              <p className="text-sm text-gray-600">Produtos selecionados por especialistas</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">Resultados Garantidos</h3>
              <p className="text-sm text-gray-600">Satisfação ou dinheiro de volta</p>
            </div>
          </div>
        </div>

        {/* Kits Grid */}
        <div className="space-y-12 mb-12">
          {kitCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{category.category}</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {category.kits.map((kit) => (
            <div
              key={kit.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${
                kit.featured ? 'ring-2 ring-indigo-400 ring-opacity-50 transform scale-105' : ''
              }`}
            >
              {/* Featured Badge */}
              {kit.featured && (
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2 px-4 text-center font-bold">
                  ⭐ MAIS POPULAR
                </div>
              )}
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="md:w-1/3">
                    <img
                      src={kit.image}
                      alt={kit.name}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{kit.name}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{kit.description}</p>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-3xl font-bold text-indigo-600">€{kit.salePrice}</span>
                      <span className="text-lg text-gray-500 line-through">€{kit.originalPrice}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                        Economize €{kit.savings}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Includes */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span>📋</span> Inclui neste kit:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {kit.includes.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* CTA */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <WhatsAppButton
                    message={`🎁 Olá! Tenho interesse no ${kit.name} (€${kit.salePrice}). Gostaria de mais informações sobre disponibilidade, formas de pagamento e prazo de entrega.`}
                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>📱</span>
                    <span>Consultar Disponibilidade</span>
                  </WhatsAppButton>
                </div>
              </div>
            </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Kits */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
            🤔 Por Que Escolher Nossos Kits?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h4 className="text-lg font-semibold text-indigo-700 mb-2">Expertise Profissional</h4>
              <p className="text-gray-700">
                Cada kit foi desenvolvido com nossa experiência de 30+ anos, 
                garantindo a combinação perfeita de produtos.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-lg font-semibold text-indigo-700 mb-2">Economia Real</h4>
              <p className="text-gray-700">
                Economize até €90 comparado à compra individual. 
                Melhor custo-benefício garantido.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-lg font-semibold text-indigo-700 mb-2">Resultados Garantidos</h4>
              <p className="text-gray-700">
                Produtos testados e aprovados em salões profissionais. 
                Satisfação garantida ou seu dinheiro de volta.
              </p>
            </div>
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
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Pronto para Sua Transformação Completa?
          </h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Escolha seu kit ideal ou deixe nossa especialista criar uma solução personalizada para você. 
            Garantimos resultados profissionais com economia garantida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`https://wa.me/32470032758?text=${encodeURIComponent('🎁 Olá! Gostaria de orientação para escolher o kit ideal para minhas necessidades. Podem me ajudar com uma consultoria personalizada?')}`}
              target="_blank"
              className="inline-flex items-center gap-3 bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              📱 Consultoria Gratuita
            </a>
            
            <div className="text-indigo-200 text-sm">
              <p>📞 +32 470 032 758</p>
              <p>📍 Lisboa, Portugal</p>
              <p>🕒 Seg-Sáb: 9h-18h</p>
              <p>🎓 Suporte incluso</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}