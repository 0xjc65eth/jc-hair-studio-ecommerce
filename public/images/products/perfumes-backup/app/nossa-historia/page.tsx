import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, MapPin, Users, Award, TrendingUp, Globe2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nossa História - 62 Beauty\'s 62',
  description: 'A jornada de mais de 30 anos da 62 Beauty\'s 62: dos primeiros passos como pequeno salão até se tornar líder em extensões premium na Europa.',
  keywords: [
    'história 62 Beauty',
    'cronologia empresa',
    'evolução extensões cabelo',
    'crescimento internacional',
    'líder europa beleza',
    'trajetória sucesso',
    '30 anos experiência'
  ],
  openGraph: {
    title: 'Nossa História - 62 Beauty\'s 62',
    description: 'Conheça a inspiradora jornada de três décadas: do sonho local ao reconhecimento internacional em extensões premium.',
    type: 'article',
  },
};

const timelineData = [
  {
    period: "Anos 1990",
    title: "O Início de um Sonho",
    year: "1990-1999",
    icon: Users,
    color: "bg-amber-100 text-amber-700",
    events: [
      {
        year: "1990",
        title: "Fundação da 62 Beauty",
        description: "Júlio César abre um pequeno salão especializado em extensões de cabelo em Portugal, com foco na qualidade artesanal e atendimento personalizado."
      },
      {
        year: "1993",
        title: "Primeira Expansão",
        description: "Ampliação das instalações e contratação da primeira equipe especializada. Início do trabalho com cabelos naturais importados."
      },
      {
        year: "1997",
        title: "Reconhecimento Local",
        description: "Primeiros prêmios regionais de excelência em beleza. Estabelecimento como referência local em extensões premium."
      },
      {
        year: "1999",
        title: "Base Sólida Estabelecida",
        description: "Final da década marca mil clientes atendidas e reputação consolidada no mercado português de beleza premium."
      }
    ]
  },
  {
    period: "Anos 2000",
    title: "Expansão e Especialização",
    year: "2000-2009", 
    icon: TrendingUp,
    color: "bg-blue-100 text-blue-700",
    events: [
      {
        year: "2001",
        title: "Produtos Premium",
        description: "Início da importação direta de cabelos naturais de alta qualidade. Estabelecimento de parcerias com fornecedores internacionais selecionados."
      },
      {
        year: "2004",
        title: "Inovação Tecnológica", 
        description: "Investimento em novas técnicas de aplicação e tratamento. Introdução de métodos exclusivos de coloração e texturização."
      },
      {
        year: "2006",
        title: "Certificações de Qualidade",
        description: "Conquista das primeiras certificações internacionais. Implementação de sistema de gestão da qualidade ISO 9001."
      },
      {
        year: "2009",
        title: "Marco dos 10.000 Clientes",
        description: "Celebração de uma década de crescimento sustentável. Reconhecimento como pioneira em extensões naturais em Portugal."
      }
    ]
  },
  {
    period: "Anos 2010", 
    title: "Conquista da Europa",
    year: "2010-2019",
    icon: Globe2,
    color: "bg-green-100 text-green-700",
    events: [
      {
        year: "2011",
        title: "Entrada no Mercado Europeu",
        description: "Primeira expansão internacional com sede estabelecida em Lisboa. Início das operações de exportação para países vizinhos."
      },
      {
        year: "2014",
        title: "Escritório em Bruxelas",
        description: "Abertura do escritório comercial na Bélgica, estrategicamente posicionado no coração da Europa para melhor atendimento regional."
      },
      {
        year: "2016",
        title: "Parcerias Estratégicas",
        description: "Estabelecimento de alianças com salões premium em 8 países europeus. Criação da rede de distribuidores autorizados."
      },
      {
        year: "2018",
        title: "Líder em Qualidade",
        description: "Reconhecimento como marca premium líder em extensões naturais na Península Ibérica e Benelux."
      }
    ]
  },
  {
    period: "Anos 2020",
    title: "Era Digital e Sustentabilidade", 
    year: "2020-2023",
    icon: Award,
    color: "bg-purple-100 text-purple-700",
    events: [
      {
        year: "2020",
        title: "Transformação Digital",
        description: "Lançamento do e-commerce premium com entrega internacional. Adaptação às novas necessidades de consumo durante a pandemia."
      },
      {
        year: "2021",
        title: "Delivery Internacional",
        description: "Expansão do serviço de entrega para 15 países europeus. Implementação de logística expressa e sustentável."
      },
      {
        year: "2022",
        title: "Compromisso Sustentável",
        description: "Adoção de práticas 100% sustentáveis. Certificações ambientais e implementação de economia circular."
      },
      {
        year: "2023",
        title: "Marco dos 30 Anos",
        description: "Celebração de três décadas com mais de 40.000 clientes satisfeitas em toda a Europa. Consolidação como marca de referência."
      }
    ]
  },
  {
    period: "Hoje",
    title: "Liderança e Futuro",
    year: "2024 - Presente",
    icon: MapPin,
    color: "bg-rose-100 text-rose-700", 
    events: [
      {
        year: "2024",
        title: "Líder Europeia Consolidada",
        description: "Reconhecida oficialmente como líder em extensões premium na Europa, com presença estabelecida em 15 países e crescimento de 40% anual."
      },
      {
        year: "2024",
        title: "Inovação Contínua",
        description: "Lançamento de linha exclusiva de produtos orgânicos. Desenvolvimento de técnicas revolucionárias de aplicação não-invasiva."
      },
      {
        year: "2024",
        title: "Expansão Global",
        description: "Planos de expansão para América do Norte e Ásia. Preparação para abertura de novas bases operacionais internacionais."
      },
      {
        year: "Futuro",
        title: "Visão 2030",
        description: "Objetivo de tornar-se a marca global número 1 em extensões premium, mantendo os valores de qualidade, sustentabilidade e excelência."
      }
    ]
  }
];

const challenges = [
  {
    title: "Superação da Crise de 2008",
    description: "Durante a crise financeira global, mantivemos nossa qualidade premium e encontramos oportunidades de crescimento através da inovação e eficiência operacional.",
    year: "2008-2010"
  },
  {
    title: "Adaptação à Era Digital",
    description: "Transição bem-sucedida do modelo tradicional para o e-commerce, preservando o atendimento personalizado que sempre nos caracterizou.",
    year: "2019-2021"
  },
  {
    title: "Pandemia Global",
    description: "Reinvenção dos processos de atendimento e venda, com implementação de consultorias virtuais e protocolos de segurança rigorosos.",
    year: "2020-2022"
  }
];

const evolutionPoints = [
  {
    title: "Qualidade Artesanal → Premium Internacional",
    description: "Evolução de técnicas artesanais locais para padrões internacionais de excelência com tecnologia de ponta."
  },
  {
    title: "Atendimento Local → Experiência Global",
    description: "Expansão do atendimento personalizado local para uma experiência premium internacional consistente."
  },
  {
    title: "Produtos Tradicionais → Linha Sustentável",
    description: "Transição para linha completa de produtos eco-friendly sem comprometer a qualidade premium."
  },
  {
    title: "Negócio Familiar → Empresa Internacional",
    description: "Crescimento orgânico de negócio familiar para empresa internacional reconhecida no setor."
  }
];

const partnerships = [
  { name: "Salões Premium Europa", description: "Rede de 200+ salões parceiros" },
  { name: "Fornecedores Certificados", description: "Parcerias diretas com origem" },
  { name: "Institutos de Beleza", description: "Colaboração educacional" },
  { name: "Organizações Sustentáveis", description: "Compromisso ambiental" }
];

export default function NossaHistoriaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
              Uma jornada de 
              <span className="italic"> paixão e excelência</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Há mais de três décadas, iniciamos uma jornada extraordinária que nos levou 
              de um pequeno salão local ao reconhecimento como líder europeia em extensões 
              de cabelo premium. Cada década trouxe novos desafios, conquistas e a 
              consolidação de nossos valores fundamentais.
            </p>
            <div className="flex items-center gap-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <span>1990 - Presente</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={20} />
                <span>Portugal → Europa</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span>50.000+ Clientes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Linha do Tempo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cada período da nossa história representa marcos importantes na construção 
              da empresa que somos hoje.
            </p>
          </div>

          <div className="space-y-20">
            {timelineData.map((period, periodIndex) => {
              const Icon = period.icon;
              return (
                <div key={periodIndex} className="relative">
                  {/* Period Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${period.color}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-medium text-gray-900">{period.title}</h3>
                      <p className="text-gray-600">{period.year}</p>
                    </div>
                  </div>

                  {/* Events */}
                  <div className="ml-6 border-l-2 border-gray-200 pl-8 space-y-8">
                    {period.events.map((event, eventIndex) => (
                      <div key={eventIndex} className="relative">
                        <div className="absolute -left-10 w-4 h-4 bg-gray-900 rounded-full"></div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {event.year}
                            </span>
                            <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Challenges Overcome */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Desafios Superados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa trajetória foi marcada por desafios que nos fortaleceram e nos 
              transformaram numa empresa ainda mais resiliente e inovadora.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {challenges.map((challenge, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-2">{challenge.year}</div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">{challenge.title}</h3>
                <p className="text-gray-600 leading-relaxed">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evolution of Quality */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Evolução da Qualidade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa constante busca pela excelência nos levou a uma evolução contínua 
              em todos os aspectos do nosso negócio.
            </p>
          </div>

          <div className="space-y-8">
            {evolutionPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-medium">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">{point.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Partnerships */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
              Parcerias Estratégicas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ao longo dos anos, construímos uma rede sólida de parcerias que nos 
              permite oferecer o melhor em produtos e serviços.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnerships.map((partnership, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={24} className="text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{partnership.name}</h3>
                <p className="text-sm text-gray-600">{partnership.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light mb-6">
              Visão para o Futuro
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Olhamos para o futuro com a mesma paixão e determinação que nos 
              trouxeram até aqui, prontos para os próximos 30 anos de inovação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe2 size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-medium mb-4">Expansão Global</h3>
              <p className="text-gray-300">
                Levar nossa excelência para novos continentes, mantendo os 
                valores que nos definem.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-medium mb-4">Inovação Contínua</h3>
              <p className="text-gray-300">
                Desenvolvimento de novas tecnologias e produtos que revolucionem 
                o mercado de beleza.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-medium mb-4">Impacto Positivo</h3>
              <p className="text-gray-300">
                Continuar impactando positivamente a vida de mulheres em 
                todo o mundo através da beleza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6">
            Seja Parte da Nossa Próxima Década
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Nossa história continua a ser escrita a cada cliente satisfeita. 
            Faça parte desta jornada de excelência e transformação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/produtos" 
              className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Descobrir Produtos
            </Link>
            <Link 
              href="/sobre" 
              className="border border-gray-200 text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Conhecer a Empresa
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}