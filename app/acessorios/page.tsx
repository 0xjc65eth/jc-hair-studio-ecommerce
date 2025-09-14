import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acessórios Profissionais - Ferramentas e Produtos Premium | JC Hair Studio\'s 62',
  description: 'Acessórios profissionais para extensões: ferramentas de aplicação, produtos de cuidado, equipamentos de styling. Qualidade premium para profissionais.',
  keywords: [
    'acessórios cabelo',
    'ferramentas profissionais',
    'produtos cuidado extensões',
    'equipamentos salão',
    'chapinha profissional',
    'secador profissional',
    'lisboa portugal'
  ],
  openGraph: {
    title: 'Acessórios Profissionais - JC Hair Studio\'s 62',
    description: 'Ferramentas e produtos premium para cuidado e styling de extensões',
    images: ['/images/acessorios-hero.jpg'],
  },
}

export default function AcessoriosPage() {
  const toolCategories = [
    {
      category: "Ferramentas de Aplicação Profissional",
      description: "Equipamentos especializados para aplicação precisa de extensões",
      icon: "🔧",
      items: [
        {
          name: "Alicate Micro Ring Titanium Pro",
          price: "€45",
          originalPrice: "€65",
          description: "Alicate profissional com revestimento de titânio para aplicação de micro rings",
          features: ["Revestimento anti-aderente", "Pressão controlada", "Formato ergonômico", "Durabilidade superior"],
          brand: "JC Professional Tools",
          rating: 4.9,
          inStock: true,
          image: "/images/alicate-micro-ring.jpg"
        },
        {
          name: "Pistola de Queratina Digital",
          price: "€180",
          originalPrice: "€220",
          description: "Equipamento para aplicação de extensões I-Tip e U-Tip com controle digital",
          features: ["Temperatura digital", "Aquecimento rápido", "Design profissional", "Cabo longo"],
          brand: "Hair Pro Elite",
          rating: 4.8,
          inStock: true,
          image: "/images/pistola-queratina.jpg"
        },
        {
          name: "Kit Aplicação Tape-in Completo",
          price: "€85",
          originalPrice: "€120",
          description: "Set completo para aplicação profissional de extensões tape-in",
          features: ["Espátula precisa", "Régua medidora", "Clips separadores", "Manual técnico"],
          brand: "Extension Masters",
          rating: 4.7,
          inStock: true,
          image: "/images/kit-tape-in.jpg"
        },
        {
          name: "Agulha Profissional Nano Ring",
          price: "€35",
          originalPrice: "€45",
          description: "Agulha ultra fina para aplicação de nano rings invisíveis",
          features: ["Ponta ultra fina", "Cabo antideslizante", "Aço cirúrgico", "Precisão máxima"],
          brand: "Nano Tech Hair",
          rating: 4.9,
          inStock: true,
          image: "/images/agulha-nano.jpg"
        }
      ]
    },
    {
      category: "Produtos de Cuidado Premium",
      description: "Linha completa para manutenção e cuidado de extensões naturais",
      icon: "🧴",
      items: [
        {
          name: "Shampoo Sulfate-Free Remy Care",
          price: "€28",
          originalPrice: "€35",
          description: "Shampoo especializado para cabelo Remy com pH balanceado",
          features: ["Sem sulfatos", "pH 5.5 balanceado", "Vitamina E", "Proteínas de seda"],
          brand: "Remy Professional",
          rating: 4.8,
          inStock: true,
          image: "/images/shampoo-remy.jpg"
        },
        {
          name: "Condicionador Intensivo Extensions",
          price: "€32",
          originalPrice: "€40",
          description: "Condicionador ultra hidratante específico para extensões",
          features: ["Hidratação profunda", "Proteção UV", "Sem parabenos", "Fórmula concentrada"],
          brand: "Remy Professional",
          rating: 4.9,
          inStock: true,
          image: "/images/condicionador-extensions.jpg"
        },
        {
          name: "Máscara Reparadora Luxury",
          price: "€48",
          originalPrice: "€60",
          description: "Tratamento intensivo semanal para extensões premium",
          features: ["Queratina hidrolisada", "Óleo de argan", "Colágeno marinho", "Ação imediata"],
          brand: "Luxury Hair Care",
          rating: 4.9,
          inStock: true,
          image: "/images/mascara-reparadora.jpg"
        },
        {
          name: "Sérum Nutritivo Multi-Vitamínico",
          price: "€55",
          originalPrice: "€70",
          description: "Blend exclusivo de óleos e vitaminas para nutrição profunda",
          features: ["12 óleos nobres", "Vitaminas A, E, F", "Absorção rápida", "Proteção térmica"],
          brand: "Vitamin Hair Plus",
          rating: 4.8,
          inStock: true,
          image: "/images/serum-nutritivo.jpg"
        }
      ]
    },
    {
      category: "Equipamentos de Styling Profissional",
      description: "Ferramentas de alta performance para styling e finalização",
      icon: "✨",
      items: [
        {
          name: "Chapinha Titanium Matrix Pro",
          price: "€165",
          originalPrice: "€220",
          description: "Chapinha profissional com placas de titânio e controle digital",
          features: ["Placas flutuantes", "180°C-230°C", "Aquecimento 30s", "Cabo giratório"],
          brand: "Matrix Professional",
          rating: 4.9,
          inStock: true,
          image: "/images/chapinha-matrix.jpg"
        },
        {
          name: "Secador Íons Negativos Pro 3000W",
          price: "€180",
          originalPrice: "€250",
          description: "Secador profissional com tecnologia íon e 3000W de potência",
          features: ["3000W potência", "Íons negativos", "3 temperaturas", "Motor AC longo"],
          brand: "Pro Hair Tech",
          rating: 4.8,
          inStock: true,
          image: "/images/secador-ions.jpg"
        },
        {
          name: "Babyliss Ondulador Cerâmica 32mm",
          price: "€95",
          originalPrice: "€130",
          description: "Modelador profissional com cerâmica turmalina",
          features: ["Cerâmica turmalina", "Aquecimento uniforme", "Cabo longo 3m", "Suporte incluído"],
          brand: "BaByliss Pro",
          rating: 4.7,
          inStock: true,
          image: "/images/babyliss-ondulador.jpg"
        },
        {
          name: "Escova Rotativa Volumizadora",
          price: "€85",
          originalPrice: "€110",
          description: "Escova rotativa para volume e alisamento simultâneos",
          features: ["Rotação dupla", "Cerdas naturais", "3 temperaturas", "Design ergonômico"],
          brand: "Volume Master",
          rating: 4.6,
          inStock: true,
          image: "/images/escova-rotativa.jpg"
        }
      ]
    },
    {
      category: "Acessórios e Manutenção",
      description: "Itens essenciais para manutenção e organização profissional",
      icon: "🛠️",
      items: [
        {
          name: "Micro Rings Premium Kit 500un",
          price: "€35",
          originalPrice: "€50",
          description: "Kit com 500 micro rings de silicone em 8 cores diferentes",
          features: ["8 cores sortidas", "Silicone médico", "Diâmetros variados", "Caixa organizadora"],
          brand: "Ring Pro Collection",
          rating: 4.8,
          inStock: true,
          image: "/images/micro-rings-kit.jpg"
        },
        {
          name: "Fita Tape-in Profissional 50m",
          price: "€45",
          originalPrice: "€65",
          description: "Fita adesiva hipoalergênica para extensões tape-in",
          features: ["50 metros", "Adesivo médico", "Transparente", "Fácil remoção"],
          brand: "Tape Pro Medical",
          rating: 4.9,
          inStock: true,
          image: "/images/fita-tape-in.jpg"
        },
        {
          name: "Escova Paddle Cerdas Javali Premium",
          price: "€38",
          originalPrice: "€55",
          description: "Escova paddle com cerdas naturais de javali para extensões",
          features: ["100% cerdas javali", "Base pneumática", "Cabo madeira", "Anti-estático"],
          brand: "Natural Brush Co",
          rating: 4.9,
          inStock: true,
          image: "/images/escova-paddle.jpg"
        },
        {
          name: "Kit Pentes Profissionais 12pç",
          price: "€42",
          originalPrice: "€60",
          description: "Set completo de pentes especializados para extensões",
          features: ["12 pentes variados", "Antiestáticos", "Resistente ao calor", "Estojo incluído"],
          brand: "Comb Master Pro",
          rating: 4.7,
          inStock: true,
          image: "/images/kit-pentes.jpg"
        }
      ]
    }
  ]

  const professionalKits = [
    {
      name: "Kit Iniciante Complete",
      description: "Tudo que você precisa para começar com extensões",
      price: "€189",
      originalPrice: "€280",
      savings: 91,
      items: [
        "Alicate Micro Ring básico",
        "300 Micro Rings sortidos",
        "Shampoo e Condicionador Remy",
        "Escova Paddle Premium",
        "Pente Desenredante",
        "Manual de aplicação"
      ],
      image: "/images/kit-iniciante.jpg",
      badge: "Mais Popular"
    },
    {
      name: "Kit Profissional Master",
      description: "Setup completo para profissionais experientes",
      price: "€450",
      originalPrice: "€650",
      savings: 200,
      items: [
        "Alicate Titanium Pro",
        "Pistola Queratina Digital",
        "Linha completa cuidados (4 produtos)",
        "500 Micro Rings Premium",
        "Kit Tape-in completo",
        "Consultoria técnica incluída"
      ],
      image: "/images/kit-master.jpg",
      badge: "Recomendado"
    },
    {
      name: "Kit Styling Elite",
      description: "Equipamentos premium para finalização",
      price: "€380",
      originalPrice: "€520",
      savings: 140,
      items: [
        "Chapinha Titanium Matrix",
        "Secador Íons Negativos 3000W",
        "Babyliss Ondulador 32mm",
        "Linha produtos styling (3un)",
        "Suporte organizador",
        "Garantia estendida 2 anos"
      ],
      image: "/images/kit-styling.jpg",
      badge: "Premium"
    }
  ]

  const brandSpotlight = [
    {
      name: "Matrix Professional",
      description: "Líder mundial em equipamentos de salão",
      specialty: "Chapinhas e equipamentos térmicos",
      since: "Desde 1980",
      warranty: "2 anos",
      logo: "/images/brands/matrix-logo.png"
    },
    {
      name: "BaByliss Pro",
      description: "Inovação francesa em styling profissional",
      specialty: "Modeladores e ferramentas de styling",
      since: "Desde 1961",
      warranty: "3 anos",
      logo: "/images/brands/babyliss-logo.png"
    },
    {
      name: "Remy Professional",
      description: "Especialista em produtos para cabelo Remy",
      specialty: "Linha de cuidados específicos",
      since: "Desde 2005",
      warranty: "Satisfação garantida",
      logo: "/images/brands/remy-logo.png"
    }
  ]

  const faq = [
    {
      question: "Qual alicate é melhor para iniciantes?",
      answer: "Recomendamos o Alicate Micro Ring Titanium Pro por ter pressão controlada e ser ergonômico, facilitando o aprendizado da técnica correta."
    },
    {
      question: "Posso usar produtos comuns em extensões?",
      answer: "Não recomendamos. Extensões precisam de produtos específicos sem sulfato e com pH balanceado para manter a qualidade e durabilidade."
    },
    {
      question: "Com que frequência devo limpar as ferramentas?",
      answer: "Após cada uso para remoção de resíduos. Faça limpeza profunda semanal com álcool 70% para higienização completa."
    },
    {
      question: "Equipamentos profissionais fazem diferença?",
      answer: "Absolutamente. Equipamentos profissionais oferecem controle preciso de temperatura, durabilidade superior e resultados consistentes."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-light tracking-widest mb-4">
            ACESSÓRIOS PROFISSIONAIS
          </h1>
          <p className="text-xl text-purple-200 mb-2">Ferramentas e Produtos Premium</p>
          <p className="text-lg text-purple-100 font-light">30 Anos de Experiência • Qualidade Garantida • Suporte Técnico</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link> / 
        <span className="ml-1 text-gray-900 font-medium"> Acessórios</span>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Catálogo Completo de Ferramentas Profissionais
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Mais de 150 produtos profissionais cuidadosamente selecionados por nossa equipe com 30+ anos 
            de experiência. Ferramentas, produtos e equipamentos das melhores marcas mundiais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">Marcas Premium</h3>
              <p className="text-sm text-gray-600">Matrix, BaByliss, Remy Pro</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">Garantia Estendida</h3>
              <p className="text-sm text-gray-600">Até 3 anos de cobertura</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">Entrega Rápida</h3>
              <p className="text-sm text-gray-600">24-48h em toda Europa</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">Suporte Técnico</h3>
              <p className="text-sm text-gray-600">Orientação especializada</p>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        {toolCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-4xl">{category.icon}</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{category.category}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center relative">
                    <div className="text-5xl">{category.icon}</div>
                    {item.originalPrice && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        -{Math.round(((parseFloat(item.originalPrice.replace('€', '')) - parseFloat(item.price.replace('€', ''))) / parseFloat(item.originalPrice.replace('€', ''))) * 100)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                      <div className="flex items-center text-xs text-yellow-500">
                        {'⭐'.repeat(Math.floor(item.rating))}
                        <span className="text-gray-500 ml-1">{item.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-purple-600 font-medium mb-2">{item.brand}</p>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                    
                    <ul className="space-y-1 mb-4">
                      {item.features.slice(0, 2).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-xs text-gray-700">
                          <span className="text-purple-500 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-xl font-bold text-purple-600">{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">{item.originalPrice}</span>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${item.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.inStock ? 'Em estoque' : 'Sob consulta'}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => {
                        const message = `🛠️ Olá! Tenho interesse no ${item.name} - ${item.brand} (${item.price}). Gostaria de mais informações sobre disponibilidade, especificações técnicas e formas de pagamento.`
                        window.open(`https://wa.me/32470032758?text=${encodeURIComponent(message)}`, '_blank')
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-medium text-sm"
                    >
                      Consultar Especialista
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Professional Kits */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Kits Profissionais Completos
          </h3>
          <p className="text-gray-600 text-center mb-8">
            Conjuntos cuidadosamente montados para diferentes níveis profissionais
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {professionalKits.map((kit, index) => (
              <div key={index} className={`border-2 rounded-xl p-6 text-center transition-all duration-300 relative ${
                kit.badge === "Recomendado" ? 'border-purple-400 bg-purple-50 scale-105' : 'border-purple-200 hover:border-purple-400'
              }`}>
                {kit.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {kit.badge}
                  </div>
                )}
                
                <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-4xl">
                    {index === 0 ? '🆕' : index === 1 ? '⭐' : '👑'}
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-purple-600 mb-2">{kit.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{kit.description}</p>
                
                <ul className="text-xs text-gray-600 mb-6 space-y-1">
                  {kit.items.map((item, itemIndex) => (
                    <li key={itemIndex}>• {item}</li>
                  ))}
                </ul>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-purple-600">{kit.price}</div>
                  <div className="text-sm text-gray-500 line-through">{kit.originalPrice} individual</div>
                  <div className="text-green-600 font-medium">Economia de €{kit.savings}</div>
                </div>
                
                <button
                  onClick={() => {
                    const message = `🎁 Olá! Tenho interesse no ${kit.name} (${kit.price}). Gostaria de mais informações sobre os produtos inclusos e formas de pagamento.`
                    window.open(`https://wa.me/32470032758?text=${encodeURIComponent(message)}`, '_blank')
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-medium"
                >
                  Solicitar Kit
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Spotlight */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
            Marcas Parceiras Premium
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brandSpotlight.map((brand, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center">
                <div className="h-16 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="font-bold text-gray-600">{brand.name}</span>
                </div>
                
                <h4 className="font-semibold text-gray-800 mb-2">{brand.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{brand.description}</p>
                <p className="text-xs text-indigo-600 mb-1"><strong>Especialidade:</strong> {brand.specialty}</p>
                <p className="text-xs text-indigo-600 mb-1"><strong>Tradição:</strong> {brand.since}</p>
                <p className="text-xs text-indigo-600"><strong>Garantia:</strong> {brand.warranty}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Dicas de Especialista
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-blue-700 mb-3">🎯 Escolhendo Ferramentas</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Invista em qualidade: ferramentas premium duram 5x mais</li>
                <li>• Controle de temperatura é essencial para não danificar</li>
                <li>• Ergonomia reduz fadiga em longos procedimentos</li>
                <li>• Manutenção adequada prolonga vida útil</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-blue-700 mb-3">🧴 Produtos de Cuidado</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• pH balanceado preserva estrutura do cabelo</li>
                <li>• Produtos sem sulfato são obrigatórios</li>
                <li>• Hidratação regular mantém maciez e brilho</li>
                <li>• Proteção térmica antes de qualquer heat styling</li>
              </ul>
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
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Precisa de Orientação Especializada?
          </h3>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Nossa equipe de especialistas pode ajudar você a escolher os produtos ideais para suas 
            necessidades específicas. Consultoria gratuita com mais de 30 anos de experiência.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`https://wa.me/32470032758?text=${encodeURIComponent('🛠️ Olá! Gostaria de orientação especializada para escolher os acessórios e ferramentas ideais para minhas extensões. Podem me ajudar com recomendações personalizadas?')}`}
              target="_blank"
              className="inline-flex items-center gap-3 bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              📱 Consultoria Gratuita
            </a>
            
            <div className="text-purple-200 text-sm">
              <p>📞 +32 470 032 758</p>
              <p>📍 Lisboa, Portugal</p>
              <p>🕒 Seg-Sáb: 9h-18h</p>
              <p>🎓 Suporte técnico incluído</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}